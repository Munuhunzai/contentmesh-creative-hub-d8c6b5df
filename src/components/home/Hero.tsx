import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSanity } from "@/integrations/sanity/useSanity";
import { homepageQuery } from "@/integrations/sanity/queries";
import { optimizeSanityImage, getSanitySrcSet } from "@/lib/sanity-image";

export type HeroSlide = {
  category?: string;
  title?: string;
  videoFileUrl?: string;
  backgroundImageUrl?: string;
};
export type HomepageData = { heroDescription?: string; heroSlides?: HeroSlide[] };

export function Hero({ initialData }: { initialData?: HomepageData | null } = {}) {
  const data = useSanity<HomepageData>(["sanity", "homepage"], homepageQuery, initialData || {});
  const slides = data.heroSlides?.length
    ? data.heroSlides
    : [{ category: "AI-powered. Human-directed." }];
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const slide = slides[current % slides.length];
  const canPlay = !paused && !reducedMotion && visible;
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    let inView = true;
    const update = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(node);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  useEffect(() => {
    if (!canPlay || slides.length < 2) return;
    const timer = setTimeout(() => setCurrent((index) => (index + 1) % slides.length), 8000);
    return () => clearTimeout(timer);
  }, [canPlay, current, slides.length]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (canPlay) video.play()?.catch(() => {});
    else video.pause();
  }, [canPlay, slide.videoFileUrl]);
  const move = (delta: number) => {
    setPaused(true);
    setCurrent((index) => (index + delta + slides.length) % slides.length);
  };
  return (
    <section
      ref={sectionRef}
      aria-label="ContentMesh creative studio"
      className="studio-hero relative isolate overflow-hidden bg-[#081b2c] text-white"
    >
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        {slide.backgroundImageUrl && (
          <img
            key={slide.backgroundImageUrl}
            src={optimizeSanityImage(slide.backgroundImageUrl, 1440, 75)}
            srcSet={getSanitySrcSet(slide.backgroundImageUrl, [640, 960, 1440, 1920], 75)}
            sizes="100vw"
            alt=""
            width={1920}
            height={1080}
            fetchPriority="high"
            loading="eager"
            className="h-full w-full object-cover"
          />
        )}
        {slide.videoFileUrl && !reducedMotion && (
          <video
            ref={videoRef}
            key={slide.videoFileUrl}
            src={slide.videoFileUrl}
            poster={
              slide.backgroundImageUrl
                ? optimizeSanityImage(slide.backgroundImageUrl, 1440, 75)
                : undefined
            }
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,20,33,0.95)_0%,rgba(5,20,33,0.77)_50%,rgba(5,20,33,0.3)_100%)]" />
      <div className="mx-auto flex min-h-[720px] max-w-7xl flex-col justify-end px-6 pb-10 pt-36 sm:min-h-[760px] sm:pb-12 lg:min-h-[min(850px,100svh)] lg:pt-44">
        <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
          <span className="h-2 w-2 rounded-full bg-[#ff8b58]" />
          Independent AI production studio
        </p>
        <h1 className="max-w-4xl font-display text-[clamp(2.8rem,6.4vw,6rem)] font-extrabold leading-[1.03] tracking-[-0.055em]">
          AI-powered.
          <br />
          Human <span className="text-[#ff9a6c]">by design.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          {data.heroDescription ||
            "Cinematic AI videos, commercials and brand stories. Creative direction, production and the final edit — made for your audience."}
        </p>
        <div className="mt-8 flex flex-col gap-3 min-[400px]:flex-row">
          <Link
            to="/contact"
            className="inline-flex min-h-14 items-center justify-center gap-4 rounded-full bg-accent px-7 text-sm font-bold text-white shadow-lg transition hover:bg-[#a83000]"
          >
            Start your project <ArrowUpRight className="h-5 w-5" />
          </Link>
          <Link
            to="/portfolio"
            className="inline-flex min-h-14 items-center justify-center gap-4 rounded-full border border-white/40 bg-white/5 px-7 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Explore our work <Play className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-5 border-t border-white/20 pt-6">
          <p className="text-xs uppercase tracking-[0.14em] text-white/75">
            Strategy <span className="mx-2 text-[#ff9a6c]">/</span> Story{" "}
            <span className="mx-2 text-[#ff9a6c]">/</span> Production{" "}
            <span className="mx-2 text-[#ff9a6c]">/</span> Post
          </p>
          <div className="flex items-center gap-2">
            <span className="mr-3 max-w-40 truncate text-xs text-white/80">
              {slide.category || "Selected work"}
            </span>
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => move(-1)}
                  aria-label="Previous showcase"
                  className="hero-control"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="min-w-10 text-center text-xs tabular-nums">
                  {(current % slides.length) + 1} / {slides.length}
                </span>
                <button
                  type="button"
                  onClick={() => move(1)}
                  aria-label="Next showcase"
                  className="hero-control"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
            {!reducedMotion && (slides.length > 1 || slide.videoFileUrl) && (
              <button
                type="button"
                onClick={() => setPaused((value) => !value)}
                aria-label={paused ? "Play showcase" : "Pause showcase"}
                className="hero-control"
              >
                {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
