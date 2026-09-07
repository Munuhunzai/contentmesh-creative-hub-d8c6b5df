import { Modal } from "@/components/layout/Modal";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Play, ArrowUpRight } from "lucide-react";
import { useSanity } from "@/integrations/sanity/useSanity";
import { portfolioQuery } from "@/integrations/sanity/queries";
import { optimizeSanityImage, getSanitySrcSet } from "@/lib/sanity-image";

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
  projectType?: string;
  brief?: string;
  approach?: string;
  deliverables?: string[];
  outcome?: string;
};

const FALLBACK_ITEMS: Item[] = [];

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

export function Portfolio({ featuredOnly = false }: { featuredOnly?: boolean }) {
  const items = useSanity<Item[]>(["sanity", "portfolio"], portfolioQuery, FALLBACK_ITEMS);
  const categories = Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[]));
  const cats = ["All work", ...categories.filter((c) => c !== "All work")];
  const [cat, setCat] = useState<string>("All work");
  const [open, setOpen] = useState<Item | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const featured = items.filter((p) => p.featured);
  const filteredList = featuredOnly
    ? (featured.length ? featured : items).slice(0, 4)
    : cat === "All work"
      ? items
      : items.filter((p) => p.category === cat);

  const list = featuredOnly ? filteredList : filteredList.slice(0, visibleCount);
  return (
    <section className="studio-section" id="portfolio" aria-labelledby="portfolio-heading">
      <div className="studio-section-heading">
        <div>
          <p className="eyebrow">{featuredOnly ? "01 / Selected work" : "The collection"}</p>
          <h2 id="portfolio-heading" className="section-title mt-4">
            Made to be watched.
            <br />
            <span className="text-brand-blue">Remembered after.</span>
          </h2>
        </div>
        <div className="max-w-sm">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Explore the visual direction, storytelling and craft behind our films. Open a project
            for a closer look.
          </p>
          {featuredOnly && (
            <Link to="/portfolio" className="studio-text-link mt-5">
              View all projects <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
      {!featuredOnly && items.length > 0 && (
        <div className="mb-9 flex flex-wrap gap-2" aria-label="Filter projects">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => {
                setCat(c);
                setVisibleCount(12);
              }}
              className={`min-h-11 rounded-full border px-5 py-2 text-sm font-medium transition-colors ${cat === c ? "border-brand-blue bg-brand-blue text-white" : "border-border bg-white hover:border-brand-blue"}`}
            >
              {c}
              <span className="ml-2 opacity-65">
                {c === "All work" ? items.length : items.filter((p) => p.category === c).length}
              </span>
            </button>
          ))}
        </div>
      )}
      {items.length > 0 && (
        <p className="sr-only" role="status">
          Showing {list.length} of {filteredList.length} projects{featuredOnly ? "" : ` in ${cat}`}
        </p>
      )}
      <div className="grid gap-x-7 gap-y-10 md:grid-cols-2">
        {list.map((p, i) => (
          <article key={p._id} className="min-w-0">
            <button
              type="button"
              aria-label={`View project: ${p.title}`}
              aria-haspopup="dialog"
              onClick={() => setOpen(p)}
              className="project-card group block w-full text-left"
            >
              <div
                className="project-card-media"
                style={{ backgroundColor: i % 2 ? "#132e4b" : "#0e447f" }}
              >
                {p.thumbnailUrl ? (
                  <img
                    src={optimizeSanityImage(p.thumbnailUrl, 960, 75)}
                    srcSet={getSanitySrcSet(p.thumbnailUrl, [480, 720, 960, 1440], 75)}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    alt=""
                    width={960}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                  />
                ) : (
                  <div aria-hidden="true" className="project-placeholder">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-xs uppercase tracking-[0.2em]">
                      ContentMesh / {p.category || "Studio work"}
                    </span>
                  </div>
                )}
                <span className="absolute bottom-5 left-5 inline-flex min-h-11 items-center gap-3 rounded-full bg-white px-5 text-xs font-bold text-brand-blue shadow-lg">
                  {p.videoUrl || p.videoFileUrl ? (
                    <>
                      <Play className="h-3.5 w-3.5 fill-current" /> Watch project
                    </>
                  ) : (
                    <>
                      Explore project <ArrowUpRight className="h-4 w-4" />
                    </>
                  )}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-border py-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {p.category || "Studio project"}
                    {p.projectType ? ` / ${p.projectType}` : ""}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold tracking-tight sm:text-2xl">
                    {p.title}
                  </h3>
                </div>
                <span
                  aria-hidden="true"
                  className="pt-1 text-xs tabular-nums text-muted-foreground"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </button>
          </article>
        ))}
      </div>
      {!featuredOnly && list.length < filteredList.length && (
        <div className="mt-10 text-center">
          <button
            type="button"
            className="studio-button studio-button-outline"
            onClick={() => setVisibleCount((count) => count + 12)}
          >
            Load more projects{" "}
            <span className="text-xs opacity-70">{filteredList.length - list.length} more</span>
          </button>
        </div>
      )}
      {items.length === 0 && (
        <div className="border-y border-border bg-secondary/40 px-6 py-12 sm:p-12">
          <p className="eyebrow">A reference for your idea</p>
          <h3 className="mt-3 font-display text-2xl font-bold">Looking for something specific?</h3>
          <p className="mt-3 max-w-lg text-muted-foreground">
            Tell us what you're making and we'll share relevant work and creative directions.
          </p>
          <Link to="/contact" className="studio-text-link mt-6">
            Request relevant work <ArrowUpRight className="h-4 w-4" />
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
              {open.projectType && <p className="eyebrow mb-4">{open.projectType}</p>}
              {open.client && (
                <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">
                  {open.projectType === "Concept study" || open.projectType === "Personal project"
                    ? "Brand / subject"
                    : "Client"}
                  : {open.client}
                </p>
              )}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {open.description ||
                  "Ask us about the creative approach and production details behind this project."}
              </p>
              <dl className="mt-6 space-y-6">
                {[
                  ["The brief", open.brief],
                  ["Creative approach", open.approach],
                  ["Result", open.outcome],
                ].map(([label, value]) =>
                  value?.trim() ? (
                    <div key={label}>
                      <dt className="text-sm font-bold text-brand-blue">{label}</dt>
                      <dd className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                        {value}
                      </dd>
                    </div>
                  ) : null,
                )}
                {!!open.deliverables?.length && (
                  <div>
                    <dt className="text-sm font-bold text-brand-blue">Deliverables</dt>
                    <dd>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {open.deliverables.map((item, i) => (
                          <li key={i} className="rounded-full bg-secondary px-3 py-2 text-xs">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
                <p className="text-sm font-medium">Have a project in mind?</p>
                <Link
                  to="/contact"
                  search={{ reference: open.title }}
                  className="studio-button studio-button-blue"
                  onClick={() => setOpen(null)}
                >
                  Create something like this <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
