import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, TrendingUp, CheckCircle } from "lucide-react";
import { useSanity } from "@/integrations/sanity/useSanity";
import { testimonialsQuery } from "@/integrations/sanity/queries";
import { SectionHeader } from "./Services";

export type Testimonial = {
  _id: string;
  quote: string;
  authorName: string;
  authorRole?: string;
  company?: string;
  avatarUrl?: string | null;
  metric?: string;
  rating?: number;
  accentColor?: string;
};

const FALLBACK: Testimonial[] = [
  {
    _id: "1",
    authorName: "Amelia Chen",
    authorRole: "Head of Growth",
    company: "Aurea Health",
    avatarUrl: "/avatars/amelia.jpg",
    quote:
      "ContentMesh completely reshaped our video ad pipeline. We ship high-converting video variations in 3 days that used to take months with traditional agencies.",
    metric: "+340% ROAS Lift",
    rating: 5,
    accentColor: "#FF5A1F",
  },
  {
    _id: "2",
    authorName: "Marcus Rivera",
    authorRole: "Founder & CEO",
    company: "Halo Wireless",
    avatarUrl: "/avatars/marcus.jpg",
    quote:
      "The visual craft is cinema-grade, and their generative AI workflow gave us shot variety and angle options we could never afford on a physical set.",
    metric: "12M+ Views",
    rating: 5,
    accentColor: "#0D4C92",
  },
  {
    _id: "3",
    authorName: "Priya Sharma",
    authorRole: "Chief Marketing Officer",
    company: "Kairos SaaS",
    avatarUrl: null,
    quote:
      "Every single deliverable was strictly on-brand, on-time, and noticeably higher quality than what we requested. ContentMesh is our secret weapon.",
    metric: "5-Day Turnaround",
    rating: 5,
    accentColor: "#F6C244",
  },
  {
    _id: "4",
    authorName: "Jonas Weber",
    authorRole: "Creative Director",
    company: "Fjord Media",
    avatarUrl: null,
    quote:
      "A rare creative studio that deeply understands narrative storytelling AND technical AI execution. They are our permanent video partner.",
    metric: "10x Content Volume",
    rating: 5,
    accentColor: "#10B981",
  },
];

export function Testimonials() {
  const list = useSanity<Testimonial[]>(["sanity", "testimonials"], testimonialsQuery, FALLBACK);
  const items = list && list.length > 0 ? list : FALLBACK;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const cur = items[activeIndex % items.length];

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Auto advance every 6 seconds unless paused
  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      goNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [activeIndex, isAutoplay]);

  if (!cur) return null;

  return (
    <section className="relative py-24 sm:py-32" id="testimonials">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Verified Client Results"
          title="Loved by High-Growth Brands & Creative Leaders"
          desc="See how modern growth teams and agency directors scale video production with ContentMesh."
        />

        {/* ── Client Company Selector Tabs ──────────────────────────────────── */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {items.map((item, idx) => {
            const isActive = idx === activeIndex % items.length;
            return (
              <button
                key={item._id}
                onClick={() => {
                  setActiveIndex(idx);
                  setIsAutoplay(false);
                }}
                className={`relative rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/30 scale-105"
                    : "glass border border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {item.company || item.authorName}
              </button>
            );
          })}
        </div>

        {/* ── High-Impact Client Spotlight Card ─────────────────────────────── */}
        <div
          className="relative mt-12 mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-border/80 bg-gradient-to-b from-background via-background/90 to-secondary/40 p-8 sm:p-14 shadow-2xl backdrop-blur-2xl"
          onMouseEnter={() => setIsAutoplay(false)}
          onMouseLeave={() => setIsAutoplay(true)}
        >
          {/* Ambient Glow */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl opacity-30 transition-all duration-700"
            style={{ backgroundColor: cur.accentColor || "#FF5A1F" }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={cur._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-4 py-1.5 text-[#F6C244]">
                  {Array.from({ length: cur.rating || 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-current" />
                  ))}
                  <span className="ml-1 text-xs font-bold text-foreground">5.0 Verified</span>
                </div>

                {/* Growth Metric Badge */}
                {cur.metric && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-500">
                    <TrendingUp className="h-3.5 w-3.5" /> {cur.metric}
                  </span>
                )}
              </div>

              {/* Quote Body */}
              <div className="relative mt-8">
                <Quote className="absolute -left-3 -top-3 h-10 w-10 text-[#FF5A1F]/20" />
                <p className="relative font-display text-2xl font-bold leading-relaxed tracking-tight text-foreground sm:text-3xl">
                  "{cur.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between border-t border-border/50 pt-6 gap-4">
                <div className="flex items-center gap-4">
                  {cur.avatarUrl ? (
                    <img
                      src={cur.avatarUrl}
                      alt={cur.authorName}
                      className="h-14 w-14 rounded-2xl border-2 border-[#FF5A1F] object-cover shadow-md"
                    />
                  ) : (
                    <div
                      className="grid h-14 w-14 place-items-center rounded-2xl font-bold text-white shadow-md text-lg"
                      style={{ backgroundColor: cur.accentColor || "#FF5A1F" }}
                    >
                      {cur.authorName.split(" ").map((n) => n[0]).join("")}
                    </div>
                  )}

                  <div>
                    <h4 className="font-display text-lg font-bold tracking-tight text-foreground">
                      {cur.authorName}
                    </h4>
                    <p className="text-xs font-semibold text-muted-foreground">
                      {cur.authorRole} • <span className="text-[#FF5A1F]">{cur.company}</span>
                    </p>
                  </div>
                </div>

                {/* Slide Controls */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={goPrev}
                    aria-label="Previous testimonial"
                    className="grid h-11 w-11 place-items-center rounded-full border border-border/80 bg-background text-foreground shadow-md transition-transform hover:scale-110 active:scale-95"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={goNext}
                    aria-label="Next testimonial"
                    className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-background shadow-md transition-transform hover:scale-110 active:scale-95"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
