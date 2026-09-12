import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
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
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const slide = slides[current % slides.length];
  const canPlay = started && !paused && !reducedMotion && visible;
  // Keep the poster as the initial paint; load motion after the page is ready.
  useEffect(() => {
    const start = () => setStarted(true);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);
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
    let active = true;
    if (canPlay)
      video.play()?.catch(() => {
        if (active) setPaused(true);
      });
    else video.pause();
    return () => {
      active = false;
    };
  }, [canPlay, slide.videoFileUrl]);
  const move = (delta: number) => {
    setPaused(true);
    setCurrent((index) => (index + delta + slides.length) % slides.length);
  };
  return (
    <section
      ref={sectionRef}
      aria-label="ContentMesh creative studio"
      className="studio-hero studio-hero-fullscreen"
    >
      <div className="studio-hero-media" aria-hidden="true">
        {slide.backgroundImageUrl && (
          <img
            key={slide.backgroundImageUrl}
            src={optimizeSanityImage(slide.backgroundImageUrl, 1440, 75)}
            srcSet={getSanitySrcSet(slide.backgroundImageUrl, [640, 960, 1440, 1920], 75)}
            sizes="100vw"
            alt=""
            width={1440}
            height={1080}
            fetchPriority="high"
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {slide.videoFileUrl && started && !reducedMotion && (
          <video
            ref={videoRef}
            key={slide.videoFileUrl}
            src={slide.videoFileUrl}
            poster={
              slide.backgroundImageUrl
                ? optimizeSanityImage(slide.backgroundImageUrl, 1440, 75)
                : undefined
            }
            onError={() => setPaused(true)}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>
      <div className="studio-hero-content">
        <div className="studio-hero-copy">
          <p className="eyebrow text-white/90">ContentMesh / Independent AI studio</p>
          <h1 className="studio-hero-title">
            Your story.
            <br />
            Worth watching.
          </h1>
          <p className="studio-hero-description">
            {data.heroDescription ||
              "Cinematic AI commercials, product films and brand stories. Human creative direction, from the first idea to the final edit."}
          </p>
        </div>
        <div className="studio-hero-footer">
          <p className="min-w-0 text-xs leading-relaxed text-white/90">
            <span className="mr-3 font-semibold tracking-widest">
              {String((current % slides.length) + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </span>
            {slide.title || slide.category || "AI-powered. Human-directed."}
          </p>
          <div className="flex items-center gap-2">
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
                onClick={() => {
                  setStarted(true);
                  setPaused((value) => !value);
                }}
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
