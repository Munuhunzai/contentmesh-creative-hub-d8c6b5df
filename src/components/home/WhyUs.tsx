import { motion } from "framer-motion";
import {
  Zap,
  Award,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export function WhyUs() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28" id="why-us">
      {/* Subtle ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-[#FF5A1F]/10 via-[#0D4C92]/10 to-transparent blur-3xl opacity-50" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-[2.5rem] border border-border/80 bg-card p-8 sm:p-14 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">

            {/* ── Left Column (Main Headline & CTA) ────────────────────── */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="text-sm font-bold uppercase tracking-widest text-[#FF5A1F]">
                / Why ContentMesh?
              </span>

              <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
                The ContentMesh Difference
              </h2>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
                We combine generative AI speed with senior human cinematic direction — giving your brand 10x content velocity at a fraction of traditional video agency costs.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm font-bold">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-[#FF5A1F] hover:text-[#ff6e38] transition-colors group"
                >
                  Book Free Discovery <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors group"
                >
                  Explore Portfolio <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* ── Right Column (2x2 Grid with Divider Lines) ────────────── */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:border-l lg:border-border/60 lg:pl-10">

              {/* Point 1: Competitive Pricing */}
              <div className="flex items-start gap-4 pb-6 sm:pb-8 sm:border-b sm:border-border/60">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FF5A1F]/20">
                  <TrendingDown className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Competitive Pricing
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Experience studio quality without breaking the bank — we offer fair, transparent, and flat-rate pricing with zero hidden shoot fees.
                  </p>
                </div>
              </div>

              {/* Point 2: 3-5 Day Turnaround */}
              <div className="flex items-start gap-4 pb-6 sm:pb-8 sm:border-b sm:border-border/60">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#0D4C92]/10 text-[#0D4C92] border border-[#0D4C92]/20">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    3–5 Day Turnaround
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Don't let traditional 6-week shoot schedules slow your growth — ship high-converting video ads and social reels in 72 hours.
                  </p>
                </div>
              </div>

              {/* Point 3: Certified Experts */}
              <div className="flex items-start gap-4 pt-2 sm:pt-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Certified Experts
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Choose ContentMesh for proven creative excellence backed by senior commercial filmmakers and specialized AI directors.
                  </p>
                </div>
              </div>

              {/* Point 4: 100% Quality Guarantee */}
              <div className="flex items-start gap-4 pt-2 sm:pt-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    100% Quality Guarantee
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Don't just take our word for it — explore our client case studies and see what founders say about working with ContentMesh.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
