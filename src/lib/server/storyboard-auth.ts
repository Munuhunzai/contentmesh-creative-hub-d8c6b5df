type Usage = {
  allowed?: boolean;
  used: number;
  limit: number;
  remaining: number;
  resetsAt: string;
};

type SupabaseConfig = { url: string; anonKey: string };

function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  return url && anonKey ? { url: url.replace(/\/$/, ""), anonKey } : null;
}

export type StoryboardAuth =
  { ok: true; token: string; userId: string } | { ok: false; response: Response };

export async function requireStoryboardAuth(request: Request): Promise<StoryboardAuth> {
  const config = getSupabaseConfig();
  if (!config) {
    return {
      ok: false,
      response: Response.json(
        { error: "Account access is not configured yet. Please try again later." },
        { status: 503 },
      ),
    };
  }

  const authorization = request.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return {
      ok: false,
      response: Response.json(
        { error: "Please sign in to use the storyboard tool." },
        { status: 401 },
      ),
    };
  }

  try {
    const response = await fetch(`${config.url}/auth/v1/user`, {
      headers: { apikey: config.anonKey, Authorization: `Bearer ${match[1]}` },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      return {
        ok: false,
        response: Response.json(
          { error: "Your sign-in has expired. Please sign in again." },
          { status: 401 },
        ),
      };
    }
    const user = (await response.json()) as {
      id?: string;
      email_confirmed_at?: string | null;
      confirmed_at?: string | null;
    };
    if (!user.id) {
      return {
        ok: false,
        response: Response.json(
          { error: "Please sign in to use the storyboard tool." },
          { status: 401 },
        ),
      };
    }
    if (!user.email_confirmed_at && !user.confirmed_at) {
      return {
        ok: false,
        response: Response.json(
          { error: "Please confirm your email address before using the storyboard tool." },
          { status: 403 },
        ),
      };
    }
    return { ok: true, token: match[1], userId: user.id };
  } catch (error) {
    console.error("Supabase auth verification failed:", error);
    return {
      ok: false,
      response: Response.json(
        { error: "Account service is temporarily unavailable. Please retry shortly." },
        { status: 503 },
      ),
    };
  }
}

async function callUsageRpc(
  token: string,
  functionName: "get_storyboard_usage" | "consume_storyboard_credits",
  credits?: number,
): Promise<{ usage?: Usage; response?: Response }> {
  const config = getSupabaseConfig();
  if (!config) {
    return {
      response: Response.json(
        { error: "Account access is not configured yet. Please try again later." },
        { status: 503 },
      ),
    };
  }

  try {
    const response = await fetch(`${config.url}/rest/v1/rpc/${functionName}`, {
      method: "POST",
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credits === undefined ? {} : { p_credits: credits }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Supabase ${functionName} RPC failed (${response.status}):`, errorText);
      return {
        response: Response.json(
          { error: "Usage limits are not ready yet. Please try again later." },
          { status: 503 },
        ),
      };
    }

    const raw = await response.json();
    const data = (Array.isArray(raw) ? raw[0] : raw) as Usage | undefined;
    if (!data || typeof data.used !== "number" || typeof data.limit !== "number") {
      console.error(`Invalid ${functionName} RPC response`);
      return {
        response: Response.json(
          { error: "Usage limits are not ready yet. Please try again later." },
          { status: 503 },
        ),
      };
    }
    return { usage: data };
  } catch (error) {
    console.error(`Supabase ${functionName} RPC request failed:`, error);
    return {
      response: Response.json(
        { error: "Usage service is temporarily unavailable. Please retry shortly." },
        { status: 503 },
      ),
    };
  }
}

export async function getStoryboardUsage(token: string) {
  return callUsageRpc(token, "get_storyboard_usage");
}

export async function consumeStoryboardCredits(token: string, credits: number) {
  return callUsageRpc(token, "consume_storyboard_credits", credits);
}

export function usageLimitResponse(usage: Usage) {
  return Response.json(
    {
      error: `Monthly AI credit limit reached (${usage.limit} credits). Your credits reset on ${usage.resetsAt}.`,
      usage,
    },
    { status: 429 },
  );
}
