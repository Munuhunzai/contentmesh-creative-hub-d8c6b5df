import { Modal } from "@/components/layout/Modal";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { useSanity } from "@/integrations/sanity/useSanity";
import { portfolioQuery } from "@/integrations/sanity/queries";
import { SectionHeader } from "./Services";
import { optimizeSanityImage } from "@/lib/sanity-image";

type Item = {
  _id: string;
  title: string;
  category?: string;
  featured?: boolean;
  description?: string;
  thumbnailUrl?: string | null;
  videoUrl?: string;
  videoFileUrl?: string;
  client?: string;
};

const FALLBACK_ITEMS: Item[] = [];

const GRADIENTS = [
  "linear-gradient(135deg,#FF5A1F,#C23800)",
  "linear-gradient(135deg,#0D4C92,#0a2450)",
  "linear-gradient(135deg,#F6C244,#FF5A1F)",
  "linear-gradient(135deg,#0D4C92,#5a7fbf)",
  "linear-gradient(135deg,#111,#FF5A1F)",
  "linear-gradient(135deg,#FF5A1F,#F6C244)",
];
const SPANS = ["sm:col-span-2 sm:row-span-2", "", "", "sm:col-span-2", "", "", "sm:col-span-2", ""];

/** Extract Google Drive file ID */
function getGoogleDriveFileId(url: string): string | null {
  try {
    const fileIdMatch =
      url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return fileIdMatch[1];
    }
  } catch {
    return null;
  }
  return null;
}

/** Native HTML5 video player for Google Drive video streams with iframe fallback and pop-out button mask */
function GoogleDriveVideoPlayer({ fileId, title }: { fileId: string; title: string }) {
  const [failedDirect, setFailedDirect] = useState(false);

  if (failedDirect) {
    return (
      <div className="relative w-full h-full max-h-[50dvh] sm:max-h-[55vh] overflow-hidden bg-black">
        <iframe
          src={`https://drive.google.com/file/d/${fileId}/preview`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="h-full w-full"
          style={{ border: "none" }}
        />
        {/* Mask to block & hide Google Drive top-right pop-out button [↗] */}
        <div
          className="absolute top-0 right-0 h-14 w-20 bg-black z-20 pointer-events-auto"
          aria-hidden
        />
      </div>
    );
  }

  return (
    <video
      ref={(el) => {
        if (el) {
          const p = el.play();
          if (p !== undefined) p.catch(() => {});
        }
      }}
      onError={() => setFailedDirect(true)}
      src={`https://lh3.googleusercontent.com/d/${fileId}`}
      controls
      autoPlay
      playsInline
      preload="auto"
      className="h-full w-full max-h-[50dvh] sm:max-h-[55vh] object-contain bg-black"
    />
  );
}

/** Extract Vimeo ID */
function getVimeoId(url: string): string | null {
  try {
    const match = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (match && match[1]) return match[1];
  } catch {
    return null;
  }
  return null;
}

/** Extract a YouTube video ID from any YouTube URL format */
function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
    const v = u.searchParams.get("v");
    if (v) return v;
    const em = u.pathname.match(/\/embed\/([^/?]+)/);
    if (em) return em[1];
    const sh = u.pathname.match(/\/shorts\/([^/?]+)/);
    if (sh) return sh[1];
  } catch {
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  }
  return null;
}

export function Portfolio() {
  const items = useSanity<Item[]>(["sanity", "portfolio"], portfolioQuery, FALLBACK_ITEMS);
  const categories = Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[]));
  const cats = ["Featured", ...categories];
  const [cat, setCat] = useState<string>("Featured");
  const [open, setOpen] = useState<Item | null>(null);

  const featuredItems = items.filter((p) => p.featured);
  const list =
    cat === "Featured"
      ? featuredItems.length > 0
        ? featuredItems
        : items
      : items.filter((p) => p.category === cat);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24" id="portfolio">
      <SectionHeader
        eyebrow="Portfolio"
        title="Made to be watched."
        desc="A curated showcase of recent AI video productions, commercial ads, animations, and spokesperson reels."
      />

      {/* Category filter pills */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {cats.map((c) => (
          <button
            key={c}
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={`rounded-full min-h-11 px-4 py-2 text-sm font-medium transition-all ${
              cat === c
                ? "bg-brand-blue text-white shadow-sm"
                : "glass hover:bg-white/60 dark:hover:bg-white/10"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Portfolio grid */}
      <motion.div
        layout
        className="mt-10 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        <AnimatePresence>
          {list.map((p, i) => {
            const gradient = GRADIENTS[i % GRADIENTS.length];
            const span = SPANS[i % SPANS.length];
            return (
              <motion.button
                layout
                key={p._id}
                aria-haspopup="dialog"
                onClick={() => setOpen(p)}
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className={`group relative overflow-hidden rounded-3xl text-left ${span}`}
                style={{
                  background: p.thumbnailUrl
                    ? `url(${optimizeSanityImage(p.thumbnailUrl, 480, 65)}) center/cover`
                    : gradient,
                }}
              >
                {!p.thumbnailUrl && <div className="absolute inset-0 mesh-bg opacity-20" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-widest opacity-80">
                    {p.category}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold">{p.title}</h3>
                </div>
                {/* Play icon on hover */}
                <div className="absolute right-4 top-4 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-white/90 text-primary opacity-100 sm:opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Play className="h-4 w-4 fill-current" />
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {items.length === 0 && (
        <div className="mt-8 rounded-3xl border border-border bg-secondary/50 p-10 text-center">
          <h3 className="font-display text-2xl font-bold">
            Find the right reference for your brief
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Tell us what you're making and we'll share relevant work and creative directions.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex rounded-full bg-brand-blue px-6 py-3 font-semibold text-white"
          >
            Request relevant work
          </Link>
        </div>
      )}
      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.title || "Project"}>
        {open && (
          <>
            {/* Video / thumbnail area — Completely clean, zero control overlap! */}
            <div className="relative w-full shrink-0 bg-black flex items-center justify-center max-h-[50dvh] sm:max-h-[55vh] aspect-video">
              {open.videoFileUrl ? (
                <video
                  ref={(el) => {
                    if (el) {
                      const p = el.play();
                      if (p !== undefined) p.catch(() => {});
                    }
                  }}
                  src={open.videoFileUrl}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  className="h-full w-full max-h-[50dvh] sm:max-h-[55vh] object-contain bg-black"
                />
              ) : open.videoUrl && getGoogleDriveFileId(open.videoUrl) ? (
                <GoogleDriveVideoPlayer
                  fileId={getGoogleDriveFileId(open.videoUrl)!}
                  title={open.title}
                />
              ) : open.videoUrl && getYouTubeId(open.videoUrl) ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(open.videoUrl)}?autoplay=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`}
                  title={open.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="h-full w-full max-h-[50dvh] sm:max-h-[55vh]"
                  style={{ border: "none" }}
                />
              ) : open.videoUrl && getVimeoId(open.videoUrl) ? (
                <iframe
                  src={`https://player.vimeo.com/video/${getVimeoId(open.videoUrl)}?autoplay=1&playsinline=1`}
                  title={open.title}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full max-h-[50dvh] sm:max-h-[55vh]"
                  style={{ border: "none" }}
                />
              ) : open.videoUrl ? (
                <video
                  ref={(el) => {
                    if (el) {
                      const p = el.play();
                      if (p !== undefined) p.catch(() => {});
                    }
                  }}
                  src={open.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  className="h-full w-full max-h-[50dvh] sm:max-h-[55vh] object-contain bg-black"
                />
              ) : open.thumbnailUrl ? (
                <img
                  src={optimizeSanityImage(open.thumbnailUrl, 1200, 75)}
                  alt={open.title}
                  width={1200}
                  height={675}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full max-h-[50dvh] sm:max-h-[55vh] object-cover"
                />
              ) : (
                <div
                  className="h-full w-full max-h-[50dvh] sm:max-h-[55vh]"
                  style={{ background: "linear-gradient(135deg,#0D4C92,#082F59)" }}
                >
                  <div className="h-full w-full mesh-bg opacity-20" />
                </div>
              )}
            </div>

            {/* Info Description */}
            <div className="p-4 sm:p-5 overflow-y-auto min-h-0 flex-1 bg-card">
              {open.client && (
                <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">
                  Client: {open.client}
                </p>
              )}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {open.description ??
                  "A cinematic production blending AI generation, live-action plates and premium sound design."}
              </p>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
