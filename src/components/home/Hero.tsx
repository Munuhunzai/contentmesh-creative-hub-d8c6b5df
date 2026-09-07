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
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(true);
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
      className="studio-hero studio-intro"
    >
      <div className="studio-intro-grid">
        <div className="studio-intro-copy">
          <p className="eyebrow flex items-center gap-3">
            <span className="h-2 w-2 bg-accent" /> ContentMesh / Independent AI studio
          </p>
          <h1 className="studio-headline">
            Your story.
            <br />
            <span className="text-brand-blue">Worth</span>
            <br />
            <span className="studio-headline-last">
              watching<span className="text-accent">.</span>
            </span>
          </h1>
          <p className="mt-7 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            {data.heroDescription ||
              "Cinematic AI commercials, product films and brand stories. Human creative direction, from the first idea to the final edit."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/portfolio" className="studio-button studio-button-blue">
              Explore our work <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="studio-button studio-button-outline">
              Start your project <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            <span>Creative direction</span>
            <span>AI production</span>
            <span>Post-production</span>
          </p>
        </div>
        <div className="studio-showcase">
          <div className="studio-showcase-media">
            {slide.backgroundImageUrl && (
              <img
                key={slide.backgroundImageUrl}
                src={optimizeSanityImage(slide.backgroundImageUrl, 1440, 75)}
                srcSet={getSanitySrcSet(slide.backgroundImageUrl, [640, 960, 1440, 1920], 75)}
                sizes="(min-width: 1024px) 52vw, 100vw"
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
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            {!slide.backgroundImageUrl && (!slide.videoFileUrl || reducedMotion || !started) && (
              <div className="studio-showcase-fallback" aria-hidden="true">
                <span>
                  CM<span className="text-[#ff9a6c]">.</span>
                </span>
                <p>Ideas into motion</p>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20 text-white sm:p-8 sm:pt-24">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">
                Inside the frame
              </p>
              <p className="mt-2 max-w-sm font-display text-xl font-semibold sm:text-2xl">
                {slide.title || slide.category || "AI-powered. Human-directed."}
              </p>
            </div>
            <span aria-hidden="true" className="studio-frame-corner" />
          </div>
          <div className="flex min-h-20 flex-wrap items-center justify-between gap-3 bg-[#0b2645] px-5 py-4 text-white sm:px-7">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/75">
              Studio showcase{" "}
              <span className="ml-3 text-[#ff9a6c]">
                / {String((current % slides.length) + 1).padStart(2, "0")}
              </span>
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
      </div>
    </section>
  );
}
