import { useSanity } from "@/integrations/sanity/useSanity";
import { homepageQuery } from "@/integrations/sanity/queries";

type Stat = { value: number; suffix?: string; label: string };
type HomepageStats = { stats?: Stat[] };

const FALLBACK: HomepageStats = {};

export function Stats() {
  const data = useSanity<HomepageStats>(["sanity", "homepage", "stats"], homepageQuery, FALLBACK);
  const stats = data.stats?.filter((s) => Number.isFinite(s.value) && s.label) || [];
  if (!stats.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="relative overflow-hidden rounded-[2rem] gradient-brand-blue p-8 shadow-ink sm:p-12">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-[#3D7FBE]/30 blur-3xl" />
        <div className="relative grid grid-cols-2 gap-8 text-white sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                {s.value.toLocaleString("en-US")}
                {s.suffix ?? ""}
              </p>
              <p className="mt-2 text-sm text-white/85">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
