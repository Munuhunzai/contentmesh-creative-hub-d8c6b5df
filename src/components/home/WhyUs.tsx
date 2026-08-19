import { motion } from "framer-motion";
import {
  TrendingDown,
  Zap,
  Award,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

const FEATURES = [
  {
    icon: TrendingDown,
    title: "Competitive Pricing & 70%+ Savings",
    desc: "Experience studio-grade commercial quality without traditional video agency markup — flat-rate pricing with zero hidden shoot fees.",
  },
  {
    icon: Zap,
    title: "3–5 Day Lightning Turnaround",
    desc: "Don't let 6-week production schedules stall your marketing — ship high-converting video ads, reels, and product explainers in 72 hours.",
  },
  {
    icon: Award,
    title: "Certified AI Directors & Editors",
    desc: "Our team combines cutting-edge AI generation models with senior filmmakers, motion designers, and sound engineers for flawless execution.",
  },
  {
    icon: ShieldCheck,
    title: "100% Quality & Revisions Guarantee",
    desc: "Prioritize creative excellence with guaranteed brand safety, licensed commercial usage rights, and multi-round revision passes on every campaign.",
  },
];

export function WhyUs() {
  return (
    <section className="relative py-16 sm:py-24" id="why-us">
      <div className="mx-auto max-w-7xl px-6">
        {/* ── Dark Navy Section Container ── */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0B1526] p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
          {/* Subtle warm glow background wash */}
          <div
            className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, #FF5A1F 0%, transparent 70%)" }}
          />

          <div className="relative grid gap-12 lg:grid-cols-12 lg:items-center">

            {/* ── Left Column (Title + Subtitle + Featured Team/Studio Image) ── */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
                  / Why ContentMesh?
                </span>

                <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
                  Why choose us ?
                </h2>

                <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300">
                  Built specifically for ambitious brands to scale content velocity, save time, stay ahead of competitors, and drive high-ROI video campaigns with less effort.
                </p>
              </div>

              {/* Featured Image Box */}
              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-lg group">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt="ContentMesh AI Video Directors & Team collaborating"
                  className="h-52 sm:h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap items-center gap-5 pt-1 text-sm font-bold">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-[#FF7A3F] hover:text-white transition-colors group"
                >
                  Book Free Discovery <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  Explore Portfolio <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* ── Right Column (4 Stacked Dark Cards) ── */}
            <div className="lg:col-span-7 space-y-4">
              {FEATURES.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, duration: 0.5 }}
                    className="group relative overflow-hidden rounded-2xl bg-[#142338] p-6 sm:p-7 border border-white/10 transition-all hover:bg-[#182a44] hover:border-white/20 hover:shadow-xl"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon Badge */}
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-white group-hover:bg-[#FF5A1F] group-hover:text-white transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Text Details */}
                      <div>
                        <h3 className="font-display text-lg font-bold text-white tracking-tight">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
