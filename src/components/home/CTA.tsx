import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useSanity } from "@/integrations/sanity/useSanity";
import { homepageQuery } from "@/integrations/sanity/queries";

type Data = {
  ctaTitle?: string;
  ctaTitleAccent?: string;
  ctaSubtitle?: string;
};

const FALLBACK: Data = {
  ctaTitle: "Ready to Scale Your Brand with",
  ctaTitleAccent: "High-Impact AI Commercials?",
  ctaSubtitle:
    "Book a 20-minute discovery call. We'll map a high-converting video roadmap tailored to your audience and revenue goals.",
};

export function CTA() {
  const data = useSanity<Data>(["sanity", "homepage", "cta"], homepageQuery, FALLBACK);
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="paper-surface paper-fold-corner relative overflow-hidden rounded-[3px_40px_4px_30px] p-10 sm:p-16"
      >
        <div className="mesh-bg absolute inset-0 opacity-70" />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
              {data.ctaTitle ?? FALLBACK.ctaTitle}{" "}
              <span className="folded-heading text-[#0E447F]">
                {data.ctaTitleAccent ?? FALLBACK.ctaTitleAccent}
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              {data.ctaSubtitle ?? FALLBACK.ctaSubtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, #FF5A1F 0%, #FF7A00 100%)",
                boxShadow: "0 4px 24px rgba(255,90,31,0.45)",
              }}
            >
              Book a Discovery Call{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-6 py-3.5 text-sm font-semibold backdrop-blur hover:bg-secondary"
            >
              See our work
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
