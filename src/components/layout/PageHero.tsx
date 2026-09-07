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
    <section className="border-b border-border bg-[#f5f6f8]">
      <div className="studio-section !py-14 sm:!py-20">
        <p className="eyebrow flex items-center gap-3">
          <span className="h-px w-7 bg-accent" />
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.3rem,5.4vw,4.6rem)] font-extrabold leading-[1.08] tracking-[-0.05em] text-brand-blue">
          {title}
        </h1>
        {desc && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {desc}
          </p>
        )}
      </div>
    </section>
  );
}
