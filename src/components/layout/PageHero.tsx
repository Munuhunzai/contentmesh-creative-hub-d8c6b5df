export function PageHero({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-[1.1] tracking-[-0.045em] sm:text-6xl">
          {title}
        </h1>
        {desc && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {desc}
          </p>
        )}
      </div>
    </section>
  );
}
