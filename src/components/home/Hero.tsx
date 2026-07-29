import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSanity } from "@/integrations/sanity/useSanity";
import { homepageQuery } from "@/integrations/sanity/queries";

// ─── Types ────────────────────────────────────────────────────────────────────

type HeroSlide = {
  category?: string;
  title?: string;
  youtubeUrl?: string;
  backgroundImageUrl?: string;
};

type HomepageData = {
  heroDescription?: string;
  heroSlides?: HeroSlide[];
};

// ─── Fallback content ─────────────────────────────────────────────────────────

const FALLBACK_DESCRIPTION =
  "AI-powered creative studio delivering video production, generative art and brand content that makes your brand impossible to ignore.";

const FALLBACK_SLIDES: HeroSlide[] = [
  { category: "AI VIDEO PRODUCTION", title: "VISUALS THAT MOVE PEOPLE." },
  { category: "GENERATIVE ART",      title: "IMAGES BORN FROM IMAGINATION." },
  { category: "BRAND FILMS",         title: "STORIES WORTH WATCHING." },
];

// CSS gradient backgrounds shown when no image/video is uploaded
const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #04081a 0%, #0D4C92 55%, #FF5A1F 100%)",
  "linear-gradient(135deg, #0a0010 0%, #330055 50%, #FF5A1F 100%)",
  "linear-gradient(135deg, #000a10 0%, #003344 50%, #0D4C92 100%)",
];

const SLIDE_DURATION = 8000; // ms — slightly longer to appreciate the video

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string | null {
  try {
    const patterns = [
      /[?&]v=([^&\n?#]+)/,
      /youtu\.be\/([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m?.[1]) return m[1];
    }
  } catch { /* noop */ }
  return null;
}

// ─── YouTube background iframe (muted autoplay) ─────────────────────────────

function YouTubeBackground({ videoId, active }: { videoId: string; active: boolean }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
      style={{ opacity: active ? 1 : 0, transition: "opacity 1s ease" }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[max(140vw,calc(140vh*16/9))] h-[max(140vh,calc(140vw*9/16))] scale-[1.15]"
        style={{ transformOrigin: "center center" }}
      >
        <iframe
          key={videoId}
          title="Background video"
          src={
            `https://www.youtube-nocookie.com/embed/${videoId}` +
            `?autoplay=1&mute=1&loop=1&playlist=${videoId}` +
            `&controls=0&showinfo=0&rel=0&modestbranding=1` +
            `&iv_load_policy=3&disablekb=1&fs=0&playsinline=1`
          }
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}


// ─── Component ────────────────────────────────────────────────────────────────

export function Hero() {
  const data = useSanity<HomepageData>(["sanity", "homepage"], homepageQuery, {});

  const slides: HeroSlide[] =
    data?.heroSlides && data.heroSlides.length > 0 ? data.heroSlides : FALLBACK_SLIDES;
  const description: string = data?.heroDescription || FALLBACK_DESCRIPTION;

  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  // ── Auto-advance ───────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(
      () => setCurrent((c) => (c + 1) % slides.length),
      SLIDE_DURATION,
    );
    return () => clearTimeout(t);
  }, [current, slides.length]);

  // ── Progress bar ───────────────────────────────────────────────────────────
  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const iv = setInterval(() => {
      const p = Math.min(((Date.now() - start) / SLIDE_DURATION) * 100, 100);
      setProgress(p);
      if (p >= 100) clearInterval(iv);
    }, 40);
    return () => clearInterval(iv);
  }, [current]);

  // ── Keyboard navigation ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  setCurrent((c) => (c - 1 + slides.length) % slides.length);
      if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % slides.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);

  const slide = slides[current] ?? {};
  const ytId = slide.youtubeUrl ? extractYouTubeId(slide.youtubeUrl) : null;
  const bgGradient = FALLBACK_GRADIENTS[current % FALLBACK_GRADIENTS.length];

  return (
    <section
      className="relative w-full overflow-hidden aspect-[16/9] min-h-[340px] max-h-[65vh] sm:aspect-none sm:max-h-none sm:h-[100dvh]"
      aria-label="Hero"
    >
      {/* ── Static background (image upload or gradient fallback) ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
          style={{
            backgroundImage: slide.backgroundImageUrl
              ? `url(${slide.backgroundImageUrl})`
              : bgGradient,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </AnimatePresence>

      {/* ── YouTube background video (muted, autoplay, looping) ── */}
      {slides.map((s, i) => {
        const id = s.youtubeUrl ? extractYouTubeId(s.youtubeUrl) : null;
        if (!id) return null;
        return (
          <YouTubeBackground key={`yt-${i}`} videoId={id} active={i === current} />
        );
      })}

      {/* ── Dark overlay — heavier on left & bottom for readability ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.15) 100%), " +
            "linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 60%)",
        }}
      />


      {/* ── Arrow — prev ──────────────────────────────────────── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-2.5 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition hover:bg-white/20 sm:left-5"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {/* ── Arrow — next ──────────────────────────────────────── */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-2.5 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-5"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {/* ── Content — bottom-left ─────────────────────────────── */}
      <div className="absolute bottom-4 left-4 right-4 z-10 sm:left-14 sm:right-auto sm:bottom-24 sm:max-w-lg lg:max-w-2xl">
        {/* Title — changes per slide */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${current}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black uppercase leading-[0.95] tracking-tight text-white"
            style={{ fontSize: "clamp(1.3rem, 3.8vw + 0.4rem, 4.8rem)" }}
          >
            {slide.title ?? "CREATIVE PRODUCTION REIMAGINED."}
          </motion.h1>
        </AnimatePresence>

        {/* Description — compact text sizing on mobile */}
        <p className="mt-2 text-[11px] leading-snug text-white/80 sm:text-base sm:mt-4 max-w-xs sm:max-w-md line-clamp-2 sm:line-clamp-none">
          {description}
        </p>

        {/* CTAs — compact buttons on mobile */}
        <div className="mt-3 sm:mt-7 flex flex-row items-center gap-2 w-full sm:w-auto">
          <Link
            to="/portfolio"
            className="group flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 py-2 sm:px-5 sm:py-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition hover:bg-white/20 text-center"
          >
            View Portfolio{" "}
            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/contact"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-full bg-orange-500 px-3.5 py-2 sm:px-5 sm:py-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-orange-600 text-center"
            style={{ boxShadow: "0 0 20px rgba(255,90,31,0.45)" }}
          >
            Book an Order
          </Link>
        </div>
      </div>
    </section>
  );
}
