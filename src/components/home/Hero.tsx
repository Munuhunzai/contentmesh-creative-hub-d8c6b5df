import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSanity } from "@/integrations/sanity/useSanity";
import { homepageQuery } from "@/integrations/sanity/queries";
import { optimizeSanityImage } from "@/lib/sanity-image";

// ─── Types ────────────────────────────────────────────────────────────────────

type HeroSlide = {
  category?: string;
  title?: string;
  videoFileUrl?: string;
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
  {
    category: "AI VIDEO PRODUCTION",
    title: "VISUALS THAT MOVE PEOPLE.",
  },
  { category: "GENERATIVE ART", title: "IMAGES BORN FROM IMAGINATION." },
  { category: "BRAND FILMS", title: "STORIES WORTH WATCHING." },
];

const FALLBACK_GRADIENTS = ["#000000", "#000000", "#000000"];

const SLIDE_DURATION = 5000; // ms (5 seconds per slide)
const CROSSFADE_DURATION = 500; // ms (500ms crossfade)

// ─── Component ────────────────────────────────────────────────────────────────

export function Hero() {
  const data = useSanity<HomepageData>(["sanity", "homepage"], homepageQuery, {});

  const slides: HeroSlide[] =
    data?.heroSlides && data.heroSlides.length > 0 ? data.heroSlides : FALLBACK_SLIDES;
  const description: string = data?.heroDescription || FALLBACK_DESCRIPTION;

  const [current, setCurrent] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  // ── Transition helper ─────────────────────────────────────────────────────
  const goToSlide = useCallback(
    (nextIndex: number) => {
      if (nextIndex === current) return;
      setPrevSlide(current);
      setCurrent(nextIndex);
      setIsTransitioning(true);
    },
    [current],
  );

  // ── Auto-advance ───────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      goToSlide((current + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearTimeout(t);
  }, [current, slides.length, goToSlide]);

  // ── End transition timer ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isTransitioning) return;
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setPrevSlide(null);
    }, CROSSFADE_DURATION);
    return () => clearTimeout(timer);
  }, [isTransitioning]);

  // ── Selective Video Play / Pause control ──────────────────────────────────
  // Only active (or outgoing during crossfade) video plays. Inactive videos are paused to save GPU resources.
  useEffect(() => {
    slides.forEach((s, i) => {
      if (!s.videoFileUrl) return;
      const v = videoRefs.current.get(i);
      if (!v) return;

      const isCurrentActive = i === current;
      const isOutgoingActive = isTransitioning && i === prevSlide;

      if (isCurrentActive) {
        const p = v.play();
        if (p !== undefined) p.catch(() => {});
      } else if (!isOutgoingActive) {
        v.pause();
      }
    });
  }, [current, isTransitioning, prevSlide, slides]);

  // ── Keyboard navigation ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToSlide((current - 1 + slides.length) % slides.length);
      if (e.key === "ArrowRight") goToSlide((current + 1) % slides.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, slides.length, goToSlide]);

  const prev = useCallback(
    () => goToSlide((current - 1 + slides.length) % slides.length),
    [current, slides.length, goToSlide],
  );
  const next = useCallback(
    () => goToSlide((current + 1) % slides.length),
    [current, slides.length, goToSlide],
  );

  // ── Preload background images into browser cache ──────────────────────────
  useEffect(() => {
    slides.forEach((s) => {
      if (s.backgroundImageUrl) {
        const img = new Image();
        img.src = optimizeSanityImage(s.backgroundImageUrl, 1200, 75);
      }
    });
  }, [slides]);

  const slide = slides[current] ?? {};

  return (
    <section
      className="hero-video-container relative w-full overflow-hidden bg-black aspect-[16/9] min-h-[340px] max-h-[65vh] sm:aspect-none sm:max-h-none sm:h-[100dvh] isolate"
      style={{ backgroundColor: "#000000" }}
      aria-label="Hero"
    >
      {/* ── Permanent black base — always opaque ── */}
      <div className="absolute inset-0 bg-black" style={{ backgroundColor: "#000000" }} aria-hidden />

      {/* ── Background Image / Fallback layers ── */}
      {slides.map((s, i) => {
        const bgGrad = FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length];
        const isActive = i === current || (isTransitioning && i === prevSlide);
        if (!isActive && s.videoFileUrl) return null;

        return (
          <div
            key={s.backgroundImageUrl || `bg-layer-${i}`}
            className={`hero-video ${i === current ? "active pointer-events-auto" : "pointer-events-none"} bg-black`}
            style={{ backgroundColor: "#000000" }}
          >
            {s.backgroundImageUrl ? (
              <div className="relative h-full w-full bg-black" style={{ backgroundColor: "#000000" }}>
                <img
                  src={optimizeSanityImage(s.backgroundImageUrl, 1200, 75)}
                  alt={s.title || `Hero Slide ${i + 1}`}
                  loading="eager"
                  fetchPriority={i === 0 ? "high" : "auto"}
                  decoding="async"
                  style={{ backgroundColor: "#000000" }}
                  className="h-full w-full object-cover object-center bg-black"
                />
              </div>
            ) : (
              <div className="h-full w-full bg-black" style={{ background: bgGrad, backgroundColor: "#000000" }} />
            )}
          </div>
        );
      })}

      {/* ── Direct Video Upload background (selective playback, GPU friendly) ── */}
      {slides.map((s, i) => {
        if (!s.videoFileUrl) return null;
        const isCurrentActive = i === current;

        return (
          <video
            ref={(el) => {
              if (el) videoRefs.current.set(i, el);
              else videoRefs.current.delete(i);
            }}
            key={s.videoFileUrl}
            src={s.videoFileUrl}
            loop
            muted
            playsInline
            preload="auto"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "translate3d(0, 0, 0)",
              WebkitTransform: "translate3d(0, 0, 0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              backgroundColor: "#000000",
            }}
            className={`hero-video ${isCurrentActive ? "active pointer-events-auto" : "pointer-events-none"} bg-black`}
          />
        );
      })}

      {/* ── Dark overlay — heavier on left & bottom for readability ── */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
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
      <div className="absolute bottom-4 left-4 right-4 z-20 sm:left-14 sm:right-auto sm:bottom-24 sm:max-w-lg lg:max-w-2xl">
        {/* Title — changes per slide */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
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
