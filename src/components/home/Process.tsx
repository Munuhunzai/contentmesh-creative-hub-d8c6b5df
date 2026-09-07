const STAGES = [
  {
    title: "Find the direction",
    desc: "We work through your audience, references and message, then shape the concept, script and visual approach.",
    review: "You review the idea and storyboard",
  },
  {
    title: "Build the world",
    desc: "Generation and production bring the agreed direction to life. Editing, voice and sound give the film its rhythm.",
    review: "You review the work in progress",
  },
  {
    title: "Make it ready",
    desc: "We refine the details and prepare the agreed versions for your channels. Scope, formats and revision rounds are settled together.",
    review: "You approve the final delivery",
  },
];
export function Process() {
  return (
    <section className="studio-section" id="process" aria-labelledby="process-heading">
      <div className="studio-section-heading">
        <div>
          <p className="eyebrow">04 / Working together</p>
          <h2 id="process-heading" className="section-title mt-4">
            A clear path.
            <br />
            Room for your input.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          You know what we’re making, what comes next and where your feedback fits.
        </p>
      </div>
      <ol className="grid gap-8 md:grid-cols-3">
        {STAGES.map((stage, i) => (
          <li key={stage.title} className="border-t border-brand-blue/25 pt-6">
            <span
              className="font-display text-5xl font-medium tracking-tighter text-brand-blue/35"
              aria-hidden="true"
            >
              0{i + 1}
              <span className="text-accent">.</span>
            </span>
            <h3 className="mt-7 font-display text-2xl font-bold">{stage.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{stage.desc}</p>
            <p className="mt-7 flex items-start gap-3 text-xs font-semibold text-brand-blue">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {stage.review}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
