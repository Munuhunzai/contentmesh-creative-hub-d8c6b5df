import { ArrowUpRight, Clapperboard, ScanEye, AudioLines } from "lucide-react";
import { Link } from "@tanstack/react-router";

const PRINCIPLES = [
  {
    icon: Clapperboard,
    title: "A story before a shot",
    desc: "The audience, message and feeling guide the creative direction. Every visual has a job to do.",
  },
  {
    icon: ScanEye,
    title: "Continuity in the details",
    desc: "Characters, products, lighting and environments are considered together, with human review throughout production.",
  },
  {
    icon: AudioLines,
    title: "Finished as a film",
    desc: "Editing, sound, pacing and colour bring the generated material together into a coherent final piece.",
  },
];
export function WhyUs() {
  return (
    <section id="why-us" className="studio-principles">
      <div className="studio-section !py-16 sm:!py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffb18a]">
              03 / The ContentMesh approach
            </p>
            <h2 className="section-title mt-5">
              Technology makes it possible.
              <br />
              <span className="text-[#ffb18a]">Direction makes it matter.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/75">
              AI is part of the production. The judgement behind the story, the composition and the
              final cut is human.
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex min-h-11 items-center gap-4 border-b border-white/40 text-sm font-semibold"
            >
              Meet the studio <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-white/20 border-y border-white/20">
            {PRINCIPLES.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="flex gap-5 py-7">
                <Icon className="mt-1 h-6 w-6 shrink-0 text-[#ffb18a]" strokeWidth={1.5} />
                <div>
                  <p className="mb-2 text-[10px] tabular-nums tracking-widest text-white/55">
                    0{i + 1}
                  </p>
                  <h3 className="font-display text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
