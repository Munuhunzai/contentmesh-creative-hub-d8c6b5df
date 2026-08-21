import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SectionHeader } from "./Services";
import { useSanity } from "@/integrations/sanity/useSanity";
import { pricingQuery } from "@/integrations/sanity/queries";

// ─── Hardcoded fallback (shown while Sanity data loads or if no plans added yet) ─
const FALLBACK_TIERS = [
  {
    _id: "starter",
    name: "Starter",
    price: "$1.5k",
    isCustomPrice: false,
    description: "For founders and creators shipping their first videos.",
    featured: false,
    features: [
      "1 project / month",
      "AI video up to 60s",
      "1 voiceover language",
      "2 revision rounds",
      "5-day turnaround",
    ],
    ctaLabel: "Get Quote",
    ctaUrl: "/contact",
  },
  {
    _id: "professional",
    name: "Professional",
    price: "$2k",
    isCustomPrice: false,
    description: "For growing brands running multi-channel content.",
    featured: true,
    features: [
      "4 projects / month",
      "AI video + animation",
      "3 voiceover languages",
      "Unlimited revisions*",
      "Dedicated PM",
      "48h priority queue",
    ],
    ctaLabel: "Get Quote",
    ctaUrl: "/contact",
  },
  {
    _id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    isCustomPrice: true,
    description: "For teams needing an end-to-end creative partner.",
    featured: false,
    features: [
      "Unlimited projects",
      "In-house production crew",
      "10+ voiceover languages",
      "Custom workflows & CMS",
      "SLA & priority support",
    ],
    ctaLabel: "Get Quote",
    ctaUrl: "/contact",
  },
];

type PricingPlan = {
  _id: string;
  name: string;
  price: string;
  isCustomPrice?: boolean;
  description: string;
  featured?: boolean;
  features: string[];
  ctaLabel?: string;
  ctaUrl?: string;
};

export function Pricing() {
  const plans = useSanity<PricingPlan[]>(["sanity", "pricingPlans"], pricingQuery, FALLBACK_TIERS);
  const tiers = plans && plans.length > 0 ? plans : FALLBACK_TIERS;

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32" id="pricing">
      <SectionHeader
        eyebrow="Pricing"
        title="Transparent AI Video Production Pricing & Monthly Retainer Plans"
        desc="Scalable monthly plans tailored for ambitious brands — no hidden fees, no long lock-in contracts."
      />
      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {tiers.map((t, i) => (
          <motion.div
            key={t._id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={`relative rounded-[2.25rem] p-8 transition-transform hover:-translate-y-1 ${
              t.featured
                ? "text-white shadow-[0_30px_80px_-30px_rgba(255,90,31,0.55)] scale-100 lg:scale-[1.04]"
                : "glass glass-reflect shadow-glass"
            }`}
            style={
              t.featured
                ? {
                    background:
                      "linear-gradient(135deg, oklch(0.72 0.19 42) 0%, oklch(0.60 0.22 30) 55%, oklch(0.36 0.13 260) 100%)",
                    border: "1px solid rgba(255,255,255,0.35)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.5), 0 30px 80px -30px rgba(255,90,31,0.55)",
                  }
                : undefined
            }
          >
            {t.featured && (
              <>
                <div className="pointer-events-none absolute inset-0 rounded-[2.25rem] bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.35),transparent_50%)]" />
                <motion.div
                  aria-hidden
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="pointer-events-none absolute -inset-1 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_50%,rgba(255,90,31,0.35),transparent_60%)] blur-2xl"
                />
                <span className="glass absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  Most Popular
                </span>
              </>
            )}
            <div className="relative">
              <h3 className="font-display text-xl font-semibold tracking-tight">{t.name}</h3>
              <p
                className={`mt-1 text-sm ${t.featured ? "text-white/85" : "text-muted-foreground"}`}
              >
                {t.description}
              </p>
              <p className="mt-6 font-display text-5xl font-bold tracking-tight">
                {t.price}
                <span
                  className={`ml-1 text-base font-medium ${t.featured ? "text-white/70" : "text-muted-foreground"}`}
                >
                  {!t.isCustomPrice && t.price !== "Custom" ? "/mo" : ""}
                </span>
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {(t.features ?? []).map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${t.featured ? "text-white" : "text-accent"}`}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {/* CTA — internal Link or external <a> */}
              {(t.ctaUrl ?? "/contact").startsWith("http") ? (
                <a
                  href={t.ctaUrl ?? "/contact"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-semibold ring-1 transition-transform hover:scale-[1.02] ${
                    t.featured
                      ? "bg-white text-primary ring-white/60 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.6)]"
                      : "bg-gradient-to-br from-[oklch(0.42_0.15_260)] to-[oklch(0.30_0.11_260)] text-white ring-white/20 shadow-ink"
                  }`}
                >
                  {t.ctaLabel ?? "Get Quote"}
                </a>
              ) : (
                <Link
                  to={(t.ctaUrl ?? "/contact") as "/contact"}
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-semibold ring-1 transition-transform hover:scale-[1.02] ${
                    t.featured
                      ? "bg-white text-primary ring-white/60 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.6)]"
                      : "bg-gradient-to-br from-[oklch(0.42_0.15_260)] to-[oklch(0.30_0.11_260)] text-white ring-white/20 shadow-ink"
                  }`}
                >
                  {t.ctaLabel ?? "Get Quote"}
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
