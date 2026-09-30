-- Per-account monthly AI credit budget for the storyboard tool.
-- A storyboard costs one credit per ten requested scenes; at most twenty scenes
-- may be generated in a single request. The SQL RPC enforces the monthly cap
-- atomically, including when multiple requests arrive at once.

create table if not exists public.storyboard_monthly_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  month_start date not null,
  credits_used integer not null default 0 check (credits_used >= 0),
  primary key (user_id, month_start)
);

alter table public.storyboard_monthly_usage enable row level security;
revoke all on table public.storyboard_monthly_usage from anon, authenticated;

create or replace function public.get_storyboard_usage()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_month_start date := date_trunc('month', timezone('utc', now()))::date;
  v_used integer := 0;
  v_limit constant integer := 10;
  v_resets_at date := (date_trunc('month', timezone('utc', now())) + interval '1 month')::date;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select coalesce(max(u.credits_used), 0)
    into v_used
    from public.storyboard_monthly_usage as u
    where u.user_id = v_user_id and u.month_start = v_month_start;

  return jsonb_build_object(
    'used', v_used,
    'limit', v_limit,
    'remaining', greatest(v_limit - v_used, 0),
    'resetsAt', v_resets_at
  );
end;
$$;

create or replace function public.consume_storyboard_credits(p_credits integer)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_month_start date := date_trunc('month', timezone('utc', now()))::date;
  v_used integer;
  v_limit constant integer := 10;
  v_resets_at date := (date_trunc('month', timezone('utc', now())) + interval '1 month')::date;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_credits not in (1, 2) then
    raise exception 'Invalid storyboard credit amount' using errcode = '22023';
  end if;

  insert into public.storyboard_monthly_usage (user_id, month_start, credits_used)
    values (v_user_id, v_month_start, p_credits)
    on conflict (user_id, month_start) do update
      set credits_used = public.storyboard_monthly_usage.credits_used + excluded.credits_used
      where public.storyboard_monthly_usage.credits_used + excluded.credits_used <= v_limit
    returning credits_used into v_used;

  if v_used is null then
    select coalesce(u.credits_used, 0)
      into v_used
      from public.storyboard_monthly_usage as u
      where u.user_id = v_user_id and u.month_start = v_month_start;
    return jsonb_build_object(
      'allowed', false,
      'used', v_used,
      'limit', v_limit,
      'remaining', greatest(v_limit - v_used, 0),
      'resetsAt', v_resets_at
    );
  end if;

  return jsonb_build_object(
    'allowed', true,
    'used', v_used,
    'limit', v_limit,
    'remaining', greatest(v_limit - v_used, 0),
    'resetsAt', v_resets_at
  );
end;
$$;

revoke all on function public.get_storyboard_usage() from public, anon;
revoke all on function public.consume_storyboard_credits(integer) from public, anon;
grant execute on function public.get_storyboard_usage() to authenticated;
grant execute on function public.consume_storyboard_credits(integer) to authenticated;
