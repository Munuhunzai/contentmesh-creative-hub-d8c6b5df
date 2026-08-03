import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Cpu,
  Clock,
  Users,
  Repeat,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSanity } from "@/integrations/sanity/useSanity";
import { homepageQuery } from "@/integrations/sanity/queries";
import { SectionHeader } from "./Services";

export function WhyUs() {
  const [activeTab, setActiveTab] = useState<"contentmesh" | "traditional">("contentmesh");

  return (
    <section className="relative overflow-hidden py-24 sm:py-32" id="why-us">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#FF5A1F]/15 via-[#0D4C92]/15 to-transparent blur-3xl opacity-60" />

      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Why ContentMesh"
          title="The AI-Native Creative Partner Your Brand Deserves"
          desc="We merge cinema-grade human direction with generative AI speed — giving you 10x output at a fraction of traditional agency costs."
        />

        {/* ── Interactive Comparison Switcher Pill ──────────────────────────── */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex rounded-full border border-border/80 bg-background/80 p-1.5 backdrop-blur-xl shadow-lg">
            <button
              onClick={() => setActiveTab("contentmesh")}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === "contentmesh"
                  ? "bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/30 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-4 w-4" /> ContentMesh AI Studio
            </button>
            <button
              onClick={() => setActiveTab("traditional")}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === "traditional"
                  ? "bg-secondary text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Traditional Video Agency
            </button>
          </div>
        </div>

        {/* ── Dynamic Comparison Hero Bento Banner ──────────────────────────── */}
        <div className="mt-8 overflow-hidden rounded-[2.5rem] border border-border/80 bg-gradient-to-b from-background via-background/90 to-secondary/30 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
          <AnimatePresence mode="wait">
            {activeTab === "contentmesh" ? (
              <motion.div
                key="contentmesh"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid gap-8 lg:grid-cols-3 lg:items-center"
              >
                <div className="lg:col-span-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#FF5A1F]">
                    <Zap className="h-3.5 w-3.5" /> High-Velocity Output
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-black text-foreground sm:text-3xl lg:text-4xl">
                    3–5 Day Commercial Delivery & 10x Content Variations
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    Instead of burning months on crew booking, location permits, and expensive re-shoots, our generative AI pipeline produces multi-format 4K video ads, localized dubbing, and variations in days.
                  </p>

                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Turnaround Time</p>
                      <p className="mt-1 font-display text-2xl font-black text-[#FF5A1F]">3 – 5 Days</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cost Efficiency</p>
                      <p className="mt-1 font-display text-2xl font-black text-emerald-500">75% Savings</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1 rounded-2xl border border-border/60 bg-background/60 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Asset Formats</p>
                      <p className="mt-1 font-display text-2xl font-black text-blue-500">16:9 • 9:16 • 1:1</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-[#FF5A1F]/30 bg-[#FF5A1F]/5 p-6 backdrop-blur-md">
                  <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">ContentMesh Highlights</h4>
                  <div className="space-y-2.5 text-xs text-foreground/90">
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-[#FF5A1F] shrink-0" /> <span>Script-to-Screen Generative 4K Video</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-[#FF5A1F] shrink-0" /> <span>Human Creative Director Oversight</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-[#FF5A1F] shrink-0" /> <span>40+ Language AI Voice Dubbing</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-[#FF5A1F] shrink-0" /> <span>Unlimited Iterations & Quick Revisions</span></div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="traditional"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid gap-8 lg:grid-cols-3 lg:items-center"
              >
                <div className="lg:col-span-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-destructive">
                    <Clock className="h-3.5 w-3.5" /> Traditional Bottlenecks
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-black text-foreground sm:text-3xl lg:text-4xl">
                    6–12 Week Production Cycles & Sky-High Retainers
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    Traditional production agencies require filming location permits, studio rentals, massive crew logistics, and months of waiting — only to deliver a single 16:9 aspect video cut with zero variations for social ads.
                  </p>

                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 opacity-75">
                    <div className="rounded-2xl border border-destructive/30 bg-background/60 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Turnaround Time</p>
                      <p className="mt-1 font-display text-2xl font-black text-destructive">6 – 12 Weeks</p>
                    </div>
                    <div className="rounded-2xl border border-destructive/30 bg-background/60 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Average Retainer</p>
                      <p className="mt-1 font-display text-2xl font-black text-destructive">$30k – $80k</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1 rounded-2xl border border-destructive/30 bg-background/60 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Re-Shoot Cost</p>
                      <p className="mt-1 font-display text-2xl font-black text-destructive">+$15,000</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-6 backdrop-blur-md">
                  <h4 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">Legacy Agency Tradeoffs</h4>
                  <div className="space-y-2.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2.5"><XCircle className="h-4 w-4 text-destructive shrink-0" /> <span>Rigid Shooting Schedules</span></div>
                    <div className="flex items-center gap-2.5"><XCircle className="h-4 w-4 text-destructive shrink-0" /> <span>Slow Change Request Turnarounds</span></div>
                    <div className="flex items-center gap-2.5"><XCircle className="h-4 w-4 text-destructive shrink-0" /> <span>High Extra Charges for A/B Ad Cuts</span></div>
                    <div className="flex items-center gap-2.5"><XCircle className="h-4 w-4 text-destructive shrink-0" /> <span>Expensive Global Voice Translation</span></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Unique 4-Pillar Feature Cards Grid ────────────────────────────── */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative overflow-hidden rounded-[2rem] border border-border/80 bg-background p-7 shadow-glass backdrop-blur-xl transition-all duration-300 hover:border-[#FF5A1F]/40"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FF5A1F]/10 text-[#FF5A1F] transition-transform duration-300 group-hover:scale-110">
              <Cpu className="h-6 w-6" />
            </div>
            <h4 className="mt-6 font-display text-xl font-bold tracking-tight text-foreground">
              Cutting-Edge AI Tech Stack
            </h4>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              We leverage Runway Gen-3, Luma Dream Machine, ElevenLabs Pro, and custom generative models for cinema visuals.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative overflow-hidden rounded-[2rem] border border-border/80 bg-background p-7 shadow-glass backdrop-blur-xl transition-all duration-300 hover:border-[#0D4C92]/40"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0D4C92]/10 text-[#0D4C92] transition-transform duration-300 group-hover:scale-110">
              <Award className="h-6 w-6" />
            </div>
            <h4 className="mt-6 font-display text-xl font-bold tracking-tight text-foreground">
              100% Senior Human Polish
            </h4>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              Every video is color-graded, audio-mastered, and directed by experienced commercial filmmakers.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative overflow-hidden rounded-[2rem] border border-border/80 bg-background p-7 shadow-glass backdrop-blur-xl transition-all duration-300 hover:border-[#F6C244]/40"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F6C244]/10 text-[#F6C244] transition-transform duration-300 group-hover:scale-110">
              <Users className="h-6 w-6" />
            </div>
            <h4 className="mt-6 font-display text-xl font-bold tracking-tight text-foreground">
              Dedicated Creative Director
            </h4>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              One point of contact from initial brief to final delivery — keeping your vision and deadlines on track.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative overflow-hidden rounded-[2rem] border border-border/80 bg-background p-7 shadow-glass backdrop-blur-xl transition-all duration-300 hover:border-[#FF5A1F]/40"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FF5A1F]/10 text-[#FF5A1F] transition-transform duration-300 group-hover:scale-110">
              <Repeat className="h-6 w-6" />
            </div>
            <h4 className="mt-6 font-display text-xl font-bold tracking-tight text-foreground">
              Flexible Revision Passes
            </h4>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              Rapid iteration rounds ensuring your video ads and content hit exact performance targets.
            </p>
          </motion.div>
        </div>

        {/* ── Bottom Call To Action ────────────────────────────────────────── */}
        <div className="mt-14 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2.5 rounded-full bg-[#FF5A1F] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl shadow-[#FF5A1F]/30 transition-transform duration-300 hover:scale-105"
          >
            Experience The Difference <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
