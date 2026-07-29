import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Layers, Zap } from "lucide-react";
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

// Kraving 3D Color Themes
const KRAVING_THEMES = [
  {
    gradient: "linear-gradient(135deg, rgba(255,90,31,0.18) 0%, rgba(13,76,146,0.12) 100%)",
    accent: "#FF5A1F",
    glow: "rgba(255,90,31,0.35)",
    border: "rgba(255,90,31,0.25)",
  },
  {
    gradient: "linear-gradient(135deg, rgba(13,76,146,0.20) 0%, rgba(37,99,235,0.12) 100%)",
    accent: "#0D4C92",
    glow: "rgba(13,76,146,0.40)",
    border: "rgba(13,76,146,0.30)",
  },
  {
    gradient: "linear-gradient(135deg, rgba(246,194,68,0.18) 0%, rgba(255,90,31,0.12) 100%)",
    accent: "#F6C244",
    glow: "rgba(246,194,68,0.35)",
    border: "rgba(246,194,68,0.30)",
  },
  {
    gradient: "linear-gradient(135deg, rgba(225,29,72,0.18) 0%, rgba(147,51,234,0.12) 100%)",
    accent: "#E11D48",
    glow: "rgba(225,29,72,0.35)",
    border: "rgba(225,29,72,0.30)",
  },
  {
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(13,76,146,0.12) 100%)",
    accent: "#10B981",
    glow: "rgba(16,185,129,0.35)",
    border: "rgba(16,185,129,0.30)",
  },
  {
    gradient: "linear-gradient(135deg, rgba(147,51,234,0.18) 0%, rgba(255,90,31,0.12) 100%)",
    accent: "#9333EA",
    glow: "rgba(147,51,234,0.35)",
    border: "rgba(147,51,234,0.30)",
  },
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
        <p className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5A1F] backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
        </p>
      )}
      <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
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

// ─── Kraving 3D Interactive Card Component ──────────────────────────────────

function Kraving3DCard({ s, idx }: { s: ServiceDoc; idx: number }) {
  const theme = KRAVING_THEMES[idx % KRAVING_THEMES.length];
  const Icon = getIcon(s.icon, Sparkles);

  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
    const rY = ((x - centerX) / centerX) * 10;  // Max 10 deg tilt

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="perspective-1000"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[2.25rem] border bg-background/80 p-7 backdrop-blur-2xl transition-all duration-300 ease-out"
        style={{
          background: theme.gradient,
          borderColor: theme.border,
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          boxShadow: `0 20px 40px -15px ${theme.glow}, 0 0 0 1px ${theme.border}`,
        }}
      >
        {/* Subtle 3D background sphere glow */}
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl transition-all duration-500 group-hover:scale-125"
          style={{ background: theme.glow }}
        />

        <div>
          {/* Top Row: Kraving 3D Floating Icon Capsule + Category Tag */}
          <div className="flex items-center justify-between">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: idx * 0.2 }}
              className="relative flex h-14 w-14 items-center justify-center rounded-2xl border shadow-lg backdrop-blur-xl"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                borderColor: theme.border,
                boxShadow: `0 8px 24px -6px ${theme.glow}`,
                color: theme.accent,
              }}
            >
              <Icon className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
            </motion.div>

            <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur-md">
              <Layers className="h-3 w-3" /> {s.category || "Capability"}
            </span>
          </div>

          {/* Title */}
          <h3 className="mt-7 font-display text-xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-[#FF5A1F]">
            {s.title}
          </h3>

          {/* Description */}
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {s.shortDescription}
          </p>
        </div>

        {/* Kraving Interactive 3D Footer Pill Button */}
        <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
            Start Brief
          </span>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 group-hover:scale-110"
            style={{
              backgroundColor: theme.accent,
              borderColor: theme.accent,
              color: "#ffffff",
              boxShadow: `0 6px 18px ${theme.glow}`,
            }}
          >
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>

        {/* Link overlay */}
        <Link to="/contact" className="absolute inset-0 z-20" aria-label={s.title} />
      </div>
    </motion.div>
  );
}

// ─── Main Services Section ──────────────────────────────────────────────────

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
          eyebrow="Kraving 3D Creative Suite"
          title="Full-Stack AI Video Production & Creative Capabilities"
          desc="Explore our 3D animated creative suite — from commercial video ads to AI animation, avatar creation, and voice dubbing."
        />

        {/* ── Kraving 3D Category Pill Tabs ─────────────────────────────────── */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "bg-[#FF5A1F] text-white shadow-xl shadow-[#FF5A1F]/35 scale-105"
                    : "glass border border-border/60 text-muted-foreground hover:border-[#FF5A1F]/40 hover:bg-secondary hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ── Kraving 3D Cards Grid ───────────────────────────────────────── */}
        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((s, idx) => (
              <Kraving3DCard key={s._id || s.title} s={s} idx={idx} />
            ))}
          </AnimatePresence>
        </div>

        {/* ── Bottom Call To Action ───────────────────────────────────────── */}
        <div className="mt-16 text-center">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#FF5A1F] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-2xl shadow-[#FF5A1F]/40 transition-all duration-300 hover:scale-105 hover:bg-[#e04c15]"
          >
            <Zap className="h-4 w-4" /> Start Custom AI Production Brief{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
