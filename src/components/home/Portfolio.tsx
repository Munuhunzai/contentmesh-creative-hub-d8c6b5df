import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { useSanity } from "@/integrations/sanity/useSanity";
import { portfolioQuery } from "@/integrations/sanity/queries";
import { SectionHeader } from "./Services";

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

const FALLBACK_ITEMS: Item[] = [
  { _id: "f1", title: "Aurea × Launch Film", category: "AI Ads", featured: true },
  { _id: "f2", title: "Halo Wireless — Hero", category: "Product Videos", featured: true },
  { _id: "f3", title: "Nova Robotics Loop", category: "Animations", featured: true },
  { _id: "f4", title: "Fjord — Field Story", category: "Corporate", featured: true },
  { _id: "f5", title: "Kairos AI Explainer", category: "Talking Head" },
  { _id: "f6", title: "Vantage Reels Set", category: "Reels" },
  { _id: "f7", title: "Lumen Series — S02", category: "AI Ads" },
  { _id: "f8", title: "Orbita — Onboarding", category: "Talking Head" },
];

const GRADIENTS = [
  "linear-gradient(135deg,#FF5A1F,#0D4C92)",
  "linear-gradient(135deg,#0D4C92,#0a2450)",
  "linear-gradient(135deg,#F6C244,#FF5A1F)",
  "linear-gradient(135deg,#0D4C92,#5a7fbf)",
  "linear-gradient(135deg,#111,#FF5A1F)",
  "linear-gradient(135deg,#FF5A1F,#F6C244)",
];
const SPANS = ["sm:col-span-2 sm:row-span-2", "", "", "sm:col-span-2", "", "", "sm:col-span-2", ""];

/** Extract Google Drive embed preview URL from shareable links */
function getGoogleDriveEmbedUrl(url: string): string | null {
  try {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
  } catch {
    return null;
  }
  return null;
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
      ? (featuredItems.length > 0 ? featuredItems : items)
      : items.filter((p) => p.category === cat);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24" id="portfolio">
      <SectionHeader eyebrow="Portfolio" title="Work that moves — literally" desc="A curated snapshot of recent productions across formats and industries." />

      {/* Category filter pills */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              cat === c
                ? "bg-gradient-to-br from-[oklch(0.72_0.19_42)] to-[oklch(0.60_0.22_30)] text-white shadow-[0_10px_25px_-10px_rgba(255,90,31,0.6)] ring-1 ring-white/30"
                : "glass hover:bg-white/60 dark:hover:bg-white/10"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Portfolio grid */}
      <motion.div layout className="mt-10 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence>
          {list.map((p, i) => {
            const gradient = GRADIENTS[i % GRADIENTS.length];
            const span = SPANS[i % SPANS.length];
            return (
              <motion.button
                layout
                key={p._id}
                onClick={() => setOpen(p)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className={`group relative overflow-hidden rounded-3xl text-left ${span}`}
                style={{ background: p.thumbnailUrl ? `url(${p.thumbnailUrl}) center/cover` : gradient }}
              >
                {!p.thumbnailUrl && <div className="absolute inset-0 mesh-bg opacity-40 mix-blend-overlay" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-widest opacity-80">{p.category}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold">{p.title}</h3>
                </div>
                {/* Play icon on hover */}
                <div className="absolute right-4 top-4 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-white/90 text-primary opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <Play className="h-4 w-4 fill-current" />
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* ── Lightbox modal ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[200] grid place-items-center bg-black/85 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-card shadow-2xl"
            >
              {/* Close */}
              <button
                onClick={() => setOpen(null)}
                className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/75 text-white border border-white/20 shadow-xl transition-all hover:bg-black hover:scale-105 active:scale-95"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Video / thumbnail area */}
              <div className="aspect-video w-full bg-black">
                {open.videoFileUrl ? (
                  <video
                    src={open.videoFileUrl}
                    controls
                    autoPlay
                    playsInline
                    className="h-full w-full object-contain"
                  />
                ) : open.videoUrl && getGoogleDriveEmbedUrl(open.videoUrl) ? (
                  <iframe
                    src={getGoogleDriveEmbedUrl(open.videoUrl)!}
                    title={open.title}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                    style={{ border: "none" }}
                  />
                ) : open.videoUrl && getYouTubeId(open.videoUrl) ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(open.videoUrl)}?autoplay=1&rel=0&modestbranding=1`}
                    title={open.title}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                    style={{ border: "none" }}
                  />
                ) : open.videoUrl && getVimeoId(open.videoUrl) ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${getVimeoId(open.videoUrl)}?autoplay=1`}
                    title={open.title}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                    style={{ border: "none" }}
                  />
                ) : open.videoUrl ? (
                  <video
                    src={open.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="h-full w-full object-contain"
                  />
                ) : open.thumbnailUrl ? (
                  <img
                    src={open.thumbnailUrl}
                    alt={open.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{ background: "linear-gradient(135deg,#0D4C92,#FF5A1F)" }}
                  >
                    <div className="h-full w-full mesh-bg mix-blend-overlay" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">{open.category}</p>
                <h3 className="mt-2 font-display text-2xl font-bold">{open.title}</h3>
                {open.client && (
                  <p className="mt-1 text-sm text-muted-foreground">Client: {open.client}</p>
                )}
                <p className="mt-3 text-sm text-muted-foreground">
                  {open.description ?? "A cinematic production blending AI generation, live-action plates and premium sound design."}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
