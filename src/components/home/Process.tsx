import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeader } from "./Services";

const STEPS = [
  {
    num: "01",
    title: "Discovery",
    desc: "Kickoff call, goals, target audience, tone of voice — we get inside your brand before touching a single frame.",
    accent: "#FF5A1F",
  },
  {
    num: "02",
    title: "Strategy",
    desc: "Concept, narrative arc, platform plan, deliverables list. A creative blueprint you sign off on before production starts.",
    accent: "#F6C244",
  },
  {
    num: "03",
    title: "Script",
    desc: "Tight copywriting, storyboard panels and a mood board so you can see the film before it's made.",
    accent: "#0D4C92",
  },
  {
    num: "04",
    title: "Production",
    desc: "AI generation, studio shoots, voiceover sessions — all orchestrated by a dedicated producer.",
    accent: "#FF5A1F",
  },
  {
    num: "05",
    title: "Editing",
    desc: "Assembly cut, colour grade, sound design, motion graphics and subtitle pass. Unlimited revisions on Pro+.",
    accent: "#F6C244",
  },
  {
    num: "06",
    title: "Delivery",
    desc: "Master files, platform cutdowns, compressed social exports and launch-day support — done and ready to publish.",
    accent: "#0D4C92",
  },
];

function StepCard({ step, index }: { step: (typeof STEPS)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col"
    >
      {/* Giant ghost number — decorative */}
      <div
        className="pointer-events-none select-none font-display font-black leading-none tracking-tighter"
        style={{
          fontSize: "clamp(5rem, 10vw, 9rem)",
          color: "transparent",
          WebkitTextStroke: `1px ${step.accent}30`,
          lineHeight: 1,
          transition: "WebkitTextStrokeColor 0.4s",
        }}
      >
        {step.num}
      </div>

      {/* Card body */}
      <div
        className="relative mt-4 flex-1 overflow-hidden rounded-[1.75rem] p-6 transition-transform duration-500 group-hover:-translate-y-2"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Hover glow top-left */}
        <div
          className="pointer-events-none absolute -left-6 -top-6 h-28 w-28 rounded-full blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(circle, ${step.accent}55 0%, transparent 70%)` }}
        />

        {/* Accent pill */}
        <div
          className="mb-4 inline-flex h-1.5 w-8 rounded-full"
          style={{ background: step.accent }}
        />

        <h3 className="font-display text-xl font-bold tracking-tight text-white">
          {step.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
}

export function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Parallax on the large background text
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-28 sm:py-36"
      id="process"
      style={{ background: "linear-gradient(160deg, #06060a 0%, #0e0e18 60%, #06060a 100%)" }}
    >
      {/* ── Large ambient background word ── */}
      <motion.div
        style={{ y: bgY }}
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
      >
        <span
          className="font-display font-black uppercase tracking-tighter text-white/[0.025]"
          style={{ fontSize: "clamp(8rem, 22vw, 22rem)", whiteSpace: "nowrap" }}
        >
          PROCESS
        </span>
      </motion.div>

      {/* ── Radial glow blobs ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] opacity-20"
        style={{ background: "radial-gradient(circle, #FF5A1F 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 bottom-1/3 h-[300px] w-[300px] translate-x-1/2 translate-y-1/2 rounded-full blur-[100px] opacity-15"
        style={{ background: "radial-gradient(circle, #0D4C92 0%, transparent 70%)" }}
      />

      {/* ── Content ── */}
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Process"
          title="A tight, transparent creative workflow"
          desc="Six focused steps from brief to broadcast — with checkpoints at every stage."
        />

        {/* ── Horizontal connector line (desktop) ── */}
        <div className="relative mt-20">
          {/* The line runs behind the cards */}
          <div
            aria-hidden
            className="absolute left-0 right-0 hidden lg:block"
            style={{ top: "clamp(5rem, 10vw, 9rem)", height: "1px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.10) 15%, rgba(255,255,255,0.10) 85%, transparent)" }}
          />

          {/* Step dots on the line */}
          <div
            aria-hidden
            className="absolute left-0 right-0 hidden lg:flex justify-between"
            style={{ top: "clamp(5rem, 10vw, 9rem)", transform: "translateY(-50%)" }}
          >
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 + 0.3, type: "spring", stiffness: 400, damping: 20 }}
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  background: s.accent,
                  boxShadow: `0 0 12px 2px ${s.accent}88`,
                }}
              />
            ))}
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {STEPS.map((s, i) => (
              <StepCard key={s.num} step={s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
