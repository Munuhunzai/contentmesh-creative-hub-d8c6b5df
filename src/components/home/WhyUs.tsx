import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Film,
  Globe2,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SectionHeader } from "./Services";

const COMPARISON_ROWS = [
  {
    feature: "Production Timeline",
    contentmesh: "3 – 5 Business Days",
    traditional: "6 – 12 Weeks",
  },
  {
    feature: "Creative Variations (Hooks/Cuts)",
    contentmesh: "10+ Variations Per Campaign",
    traditional: "1 Single Fixed Cut",
  },
  {
    feature: "Global Dubbing & Translation",
    contentmesh: "40+ Languages with AI Lip-Sync",
    traditional: "Requires Local Actors (+$15k/market)",
  },
  {
    feature: "Re-shoots & Script Edits",
    contentmesh: "Instant Script Update in 24h",
    traditional: "Full Re-shoot Day (+$15,000)",
  },
  {
    feature: "Average Campaign Investment",
    contentmesh: "Flat Retainer or Pay-Per-Project",
    traditional: "$30,000 – $80,000+ Setup Fee",
  },
];

export function WhyUs() {
  const [viewMode, setViewMode] = useState<"sideBySide" | "grid">("sideBySide");

  return (
    <section className="relative overflow-hidden py-24 sm:py-32" id="why-us">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#FF5A1F]/15 via-[#0D4C92]/15 to-transparent blur-3xl opacity-60" />

      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Why ContentMesh"
          title="The Future of Commercial Video is Here"
          desc="We combine generative AI speed with senior human cinematic direction — giving your brand 10x content velocity at a fraction of traditional cost."
        />

        {/* ── Metric Summary Highlights Banner ────────────────────────────── */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:border-[#FF5A1F]/40 hover:shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF5A1F]">
              <Zap className="h-4 w-4" /> Production Speed
            </div>
            <p className="mt-2 font-display text-3xl sm:text-4xl font-black text-foreground">78% Faster</p>
            <p className="mt-1 text-xs text-muted-foreground">3–5 days vs 6+ weeks</p>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:border-emerald-500/40 hover:shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-500">
              <TrendingUp className="h-4 w-4" /> Cost Savings
            </div>
            <p className="mt-2 font-display text-3xl sm:text-4xl font-black text-foreground">75% Lower</p>
            <p className="mt-1 text-xs text-muted-foreground">No studio rental fees</p>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:border-blue-500/40 hover:shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-500">
              <Globe2 className="h-4 w-4" /> Localization
            </div>
            <p className="mt-2 font-display text-3xl sm:text-4xl font-black text-foreground">40+ Languages</p>
            <p className="mt-1 text-xs text-muted-foreground">AI voice & lip-syncing</p>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:border-purple-500/40 hover:shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-500">
              <Film className="h-4 w-4" /> Ad Variations
            </div>
            <p className="mt-2 font-display text-3xl sm:text-4xl font-black text-foreground">10x Output</p>
            <p className="mt-1 text-xs text-muted-foreground">Multiple hooks for A/B testing</p>
          </div>
        </div>

        {/* ── Direct Head-to-Head Comparison Table / Cards ────────────────── */}
        <div className="mt-12 overflow-hidden rounded-[2.5rem] border border-border/80 bg-card p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF5A1F]">Head-to-Head Breakdown</span>
              <h3 className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl">
                ContentMesh Studio vs. Traditional Agency
              </h3>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-secondary p-1 text-xs font-semibold">
              <button
                onClick={() => setViewMode("sideBySide")}
                className={`rounded-full px-4 py-1.5 transition-all ${
                  viewMode === "sideBySide"
                    ? "bg-[#FF5A1F] text-white shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Comparison Matrix
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-full px-4 py-1.5 transition-all ${
                  viewMode === "grid"
                    ? "bg-[#FF5A1F] text-white shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Core Pillars
              </button>
            </div>
          </div>

          {viewMode === "sideBySide" ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="py-4 px-4 w-1/3">Key Dimension</th>
                    <th className="py-4 px-4 w-1/3 text-[#FF5A1F] bg-[#FF5A1F]/5 rounded-t-2xl">
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4" /> ContentMesh Studio
                      </span>
                    </th>
                    <th className="py-4 px-4 w-1/3 text-muted-foreground">Traditional Production</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {COMPARISON_ROWS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4 font-semibold text-foreground">{row.feature}</td>
                      <td className="py-4 px-4 font-bold text-foreground bg-[#FF5A1F]/5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#FF5A1F] shrink-0" />
                          <span>{row.contentmesh}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-destructive/70 shrink-0" />
                          <span>{row.traditional}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-3xl border border-border/60 bg-background/60 p-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F]">
                  <Zap className="h-5 w-5" />
                </div>
                <h4 className="mt-4 font-display text-lg font-bold">Generative 4K Synthesis</h4>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Using state-of-the-art video foundation models to render hyper-realistic visuals, camera moves, and scene plates.
                </p>
              </div>

              <div className="rounded-3xl border border-border/60 bg-background/60 p-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0D4C92]/10 text-[#0D4C92]">
                  <Film className="h-5 w-5" />
                </div>
                <h4 className="mt-4 font-display text-lg font-bold">Senior Director Supervision</h4>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Human creative directors oversee storyboarding, pacing, color grading, and audio mastering for commercial craft.
                </p>
              </div>

              <div className="rounded-3xl border border-border/60 bg-background/60 p-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-500">
                  <Globe2 className="h-5 w-5" />
                </div>
                <h4 className="mt-4 font-display text-lg font-bold">Global Voice & Lip-Sync</h4>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Instantly translate and re-voice your campaigns across 40+ international markets with natural lip alignment.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── 4 Feature Pillars ────────────────────────────────────────────── */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            whileHover={{ y: -5 }}
            className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:border-[#FF5A1F]/40"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FF5A1F]/10 text-[#FF5A1F]">
              <Clock className="h-6 w-6" />
            </div>
            <h4 className="mt-5 font-display text-lg font-bold text-foreground">3-Day Turnaround</h4>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Fast-track commercial production from brief to final 4K master in 72 hours.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:border-blue-500/40"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/10 text-blue-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="mt-5 font-display text-lg font-bold text-foreground">100% Brand Safe</h4>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Full commercial usage rights, licensed audio tracks, and enterprise compliance.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:border-emerald-500/40"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <RotateCcw className="h-6 w-6" />
            </div>
            <h4 className="mt-5 font-display text-lg font-bold text-foreground">Rapid Script Iterations</h4>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Test new hooks, headlines, or voiceovers without scheduling a new filming shoot.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:border-purple-500/40"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-500/10 text-purple-500">
              <Sparkles className="h-6 w-6" />
            </div>
            <h4 className="mt-5 font-display text-lg font-bold text-foreground">Multi-Format Deliverables</h4>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Get 16:9 widescreen, 9:16 vertical reels, and 1:1 square cuts delivered ready for ads.
            </p>
          </motion.div>
        </div>

        {/* ── Bottom Call To Action ────────────────────────────────────────── */}
        <div className="mt-14 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2.5 rounded-full bg-[#FF5A1F] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl shadow-[#FF5A1F]/30 transition-transform duration-300 hover:scale-105"
          >
            Start Your Next Production <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
