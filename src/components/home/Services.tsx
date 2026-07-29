import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSanity } from "@/integrations/sanity/useSanity";
import { servicesQuery } from "@/integrations/sanity/queries";
import { getIcon } from "@/lib/icon-map";

export type ServiceDoc = {
  _id: string;
  title: string;
  slug?: string;
  icon?: string;
  shortDescription?: string;
  category?: string;
};

const CATEGORIES = [
  "All Capabilities",
  "AI Video",
  "Animation",
  "Voice & Audio",
  "Marketing & Ads",
];

const FALLBACK: ServiceDoc[] = [
  {
    _id: "1",
    title: "AI Video Production Services",
    icon: "Video",
    category: "AI Video",
    shortDescription:
      "Full-stack AI video creation, generation, and script-to-screen commercial production services.",
  },
  {
    _id: "2",
    title: "AI Animation & 3D Visuals",
    icon: "Wand2",
    category: "Animation",
    shortDescription:
      "Cinema-grade 2D/3D character, product, and motion animation powered by generative AI models.",
  },
  {
    _id: "3",
    title: "AI Voiceovers & Dubbing",
    icon: "Mic",
    category: "Voice & Audio",
    shortDescription:
      "Multilingual AI voice cloning, audio dubbing, and video translation services in 40+ languages.",
  },
  {
    _id: "4",
    title: "UGC Video Editing Services",
    icon: "Film",
    category: "Marketing & Ads",
    shortDescription:
      "High-converting UGC video ad editing for performance marketing agencies, Meta, TikTok & YouTube.",
  },
  {
    _id: "5",
    title: "AI Avatar Creation Services",
    icon: "Sparkles",
    category: "AI Video",
    shortDescription:
      "Custom AI presenter avatars for company onboarding, training videos, and self-service portals.",
  },
  {
    _id: "6",
    title: "AI Video Advertising Services",
    icon: "Megaphone",
    category: "Marketing & Ads",
    shortDescription:
      "High-impact commercial AI video ads, performance creative, and CTV campaign spots.",
  },
  {
    _id: "7",
    title: "Social Media Video Agency",
    icon: "Share2",
    category: "Marketing & Ads",
    shortDescription:
      "Scroll-stopping reels, shorts, and vertical-native AI video marketing content for modern brands.",
  },
  {
    _id: "8",
    title: "In-House Studio Production",
    icon: "Building2",
    category: "AI Video",
    shortDescription:
      "In-house sound stage, camera crew, edit bays, and AI hybrid production capabilities.",
  },
  {
    _id: "9",
    title: "Corporate AI Explainers",
    icon: "PlayCircle",
    category: "AI Video",
    shortDescription:
      "Clear, elegant explainer videos for SaaS, finance, enterprise compliance, and product drops.",
  },
  {
    _id: "10",
    title: "YouTube Channel Automation",
    icon: "Youtube",
    category: "Marketing & Ads",
    shortDescription:
      "Full-stack channel management: research, scriptwriting, AI voice, video edit & custom thumbnails.",
  },
  {
    _id: "11",
    title: "Brand Storytelling & Ads",
    icon: "BookOpen",
    category: "AI Video",
    shortDescription:
      "Documentary-style narratives and brand films engineered for maximum emotional resonance.",
  },
  {
    _id: "12",
    title: "AI Video Content Strategy",
    icon: "Brain",
    category: "Voice & Audio",
    shortDescription:
      "Data-driven creative roadmaps tuned to your marketing funnel, audience & revenue targets.",
  },
];

const ACCENT_COLORS = [
  "#FF5A1F",
  "#0D4C92",
  "#F6C244",
  "#FF7A00",
  "#2563EB",
  "#E11D48",
];

export function SectionHeader({
  eyebrow,
  title,
  desc,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#FF5A1F]">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {desc && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {desc}
        </p>
      )}
    </div>
  );
}

export function Services() {
  const services = useSanity<ServiceDoc[]>(
    ["sanity", "services"],
    servicesQuery,
    FALLBACK
  );
  const items = services && services.length > 0 ? services : FALLBACK;

  const [activeCategory, setActiveCategory] = useState("All Capabilities");

  const filteredItems = items.filter((item) => {
    if (activeCategory === "All Capabilities") return true;
    return item.category === activeCategory;
  });

  return (
    <section className="relative py-24 sm:py-32" id="services">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Creative Capabilities"
          title="Full-Stack AI Video Production & Creative Services"
          desc="From high-converting commercial video ads to AI animation, voiceovers, and avatar creation — explore our complete studio capabilities."
        />

        {/* ── Category Filter Tabs ──────────────────────────────────────────────── */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/30 scale-[1.02]"
                    : "glass border border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ── User-Friendly Responsive Cards Grid ─────────────────────────────── */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((s, idx) => {
              const Icon = getIcon(s.icon, Sparkles);
              const accentColor = ACCENT_COLORS[idx % ACCENT_COLORS.length];

              return (
                <motion.div
                  key={s._id || s.title}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to="/contact"
                    className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-background via-background/90 to-secondary/30 p-7 shadow-glass backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#FF5A1F]/40 hover:shadow-2xl hover:shadow-[#FF5A1F]/10"
                  >
                    {/* Top ambient glow on hover */}
                    <div
                      className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle, ${accentColor}66 0%, transparent 70%)`,
                      }}
                    />

                    <div>
                      {/* Icon badge & step tag */}
                      <div className="flex items-center justify-between">
                        <div
                          className="grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                          style={{
                            backgroundColor: `${accentColor}15`,
                            color: accentColor,
                          }}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                          {s.category || "Service"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-[#FF5A1F]">
                        {s.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {s.shortDescription}
                      </p>
                    </div>

                    {/* Footer link */}
                    <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
                        Explore Capability
                      </span>
                      <div
                        className="grid h-8 w-8 place-items-center rounded-full border border-border/60 bg-background text-muted-foreground transition-all duration-300 group-hover:border-[#FF5A1F] group-hover:bg-[#FF5A1F] group-hover:text-white"
                      >
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ── Bottom Call To Action ─────────────────────────────────────────────── */}
        <div className="mt-16 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#FF5A1F] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-[#FF5A1F]/30 transition-transform duration-300 hover:scale-105 hover:bg-[#e04c15]"
          >
            Request Custom Production Brief <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
