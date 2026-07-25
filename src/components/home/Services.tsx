import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { useSanity } from "@/integrations/sanity/useSanity";
import { servicesQuery } from "@/integrations/sanity/queries";
import { getIcon } from "@/lib/icon-map";

type ServiceDoc = {
  _id: string;
  title: string;
  slug?: string;
  icon?: string;
  shortDescription?: string;
};

const FALLBACK: ServiceDoc[] = [
  { _id: "1",  title: "AI Video Production",     icon: "Video",       shortDescription: "From script to screen — cinematic AI-generated videos ready to publish." },
  { _id: "2",  title: "AI Animation",             icon: "Wand2",       shortDescription: "Character, product and motion animation powered by the latest models." },
  { _id: "3",  title: "Professional Voiceovers",  icon: "Mic",         shortDescription: "Studio-grade AI voice with human polish, in 40+ languages." },
  { _id: "4",  title: "Video Editing",            icon: "Film",        shortDescription: "Fast, precise edits with color grading, sound design, and pacing." },
  { _id: "5",  title: "Motion Graphics",          icon: "Sparkles",    shortDescription: "Brand-driven kinetic typography, transitions and explainer visuals." },
  { _id: "6",  title: "Commercial Ads",           icon: "Megaphone",   shortDescription: "High-converting spots for Meta, YouTube, TikTok, and CTV." },
  { _id: "7",  title: "Social Media Content",     icon: "Share2",      shortDescription: "Scroll-stopping reels, shorts and vertical-native storytelling." },
  { _id: "8",  title: "In-house Production",      icon: "Building2",   shortDescription: "Studio, lighting, camera and crew — end-to-end capability." },
  { _id: "9",  title: "Corporate Explainers",     icon: "PlayCircle",  shortDescription: "Clear, elegant explainers that make complex ideas land." },
  { _id: "10", title: "YouTube Automation",       icon: "Youtube",     shortDescription: "Full-stack channels: research, script, voice, edit, thumbnail." },
  { _id: "11", title: "Brand Storytelling",       icon: "BookOpen",    shortDescription: "Documentary-style narratives that make your brand unforgettable." },
  { _id: "12", title: "AI Content Strategy",      icon: "Brain",       shortDescription: "A creative roadmap tuned to your goals, funnel and audience." },
];

// Gradient pairs per card — alternating dark/light, cinematic feel matching the reference
const CARD_STYLES = [
  { bg: "linear-gradient(160deg,#0a0a0a 0%,#1a1a1a 100%)", accent: "#FF5A1F", light: false },
  { bg: "linear-gradient(160deg,#f0ede6 0%,#e8e4da 100%)", accent: "#111",     light: true  },
  { bg: "linear-gradient(160deg,#0D4C92 0%,#051e3a 100%)", accent: "#FF5A1F", light: false },
  { bg: "linear-gradient(160deg,#1a1a1a 0%,#2d2d2d 100%)", accent: "#F6C244", light: false },
  { bg: "linear-gradient(160deg,#e8e4da 0%,#d4cebc 100%)", accent: "#0D4C92", light: true  },
  { bg: "linear-gradient(160deg,#FF5A1F 0%,#c4380b 100%)", accent: "#fff",    light: false },
];

function ServiceCard({ s, idx }: { s: ServiceDoc; idx: number }) {
  const style = CARD_STYLES[idx % CARD_STYLES.length];
  const Icon = getIcon(s.icon, Sparkles);
  const textColor = style.light ? "#111" : "#fff";
  const mutedColor = style.light ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.6)";
  const iconBg = style.light
    ? "rgba(0,0,0,0.08)"
    : "rgba(255,255,255,0.12)";

  return (
    <div
      className="group relative shrink-0 overflow-hidden rounded-[2rem] select-none"
      style={{
        width: "240px",
        height: "360px",
        background: style.bg,
        boxShadow: "0 24px 60px rgba(0,0,0,0.30), 0 4px 16px rgba(0,0,0,0.18)",
        border: style.light ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.08)",
        cursor: "default",
        transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-10px) scale(1.03)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 40px 80px rgba(0,0,0,0.40), 0 8px 24px rgba(0,0,0,0.22)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 24px 60px rgba(0,0,0,0.30), 0 4px 16px rgba(0,0,0,0.18)";
      }}
    >
      {/* Subtle noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "128px" }}
      />

      {/* Glow accent dot top-right */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${style.accent}55 0%, transparent 70%)` }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        {/* Top — icon */}
        <div
          className="grid h-11 w-11 place-items-center rounded-2xl"
          style={{ background: iconBg, color: style.accent }}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Bottom — title + description */}
        <div>
          <h3
            className="font-display text-[1.25rem] font-bold leading-tight tracking-tight"
            style={{ color: textColor }}
          >
            {s.title}
          </h3>
          <p
            className="mt-2 text-[0.78rem] leading-relaxed"
            style={{ color: mutedColor }}
          >
            {s.shortDescription}
          </p>

          {/* Bottom accent line */}
          <div
            className="mt-5 h-[2px] w-10 rounded-full"
            style={{ background: style.accent }}
          />
        </div>
      </div>
    </div>
  );
}

export function Services() {
  const services = useSanity<ServiceDoc[]>(["sanity", "services"], servicesQuery, FALLBACK);
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate the array so the loop feels infinite
  const doubled = [...services, ...services];

  // Pause animation on hover
  const pause  = () => { if (trackRef.current) trackRef.current.style.animationPlayState = "paused"; };
  const resume = () => { if (trackRef.current) trackRef.current.style.animationPlayState = "running"; };

  // Card width + gap
  const CARD_W  = 240;
  const GAP     = 24;
  const STEP    = CARD_W + GAP;
  // Total width of one set
  const totalW  = services.length * STEP;

  return (
    <section className="relative overflow-hidden py-24 sm:py-32" id="services">
      {/* Section header */}
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Services"
          title="A full-stack creative studio, supercharged by AI"
          desc="Every capability you need to ship premium video content — under one roof."
        />
      </div>

      {/* Marquee track */}
      <div
        className="relative mt-16"
        style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        {/* Inject keyframes via a style tag */}
        <style>{`
          @keyframes marquee-rtl {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-${totalW}px); }
          }
          .marquee-track {
            animation: marquee-rtl ${services.length * 3.5}s linear infinite;
          }
        `}</style>

        <div
          ref={trackRef}
          className="marquee-track flex gap-6"
          style={{ width: `${doubled.length * STEP}px`, willChange: "transform" }}
        >
          {doubled.map((s, i) => (
            <ServiceCard key={`${s._id}-${i}`} s={s} idx={i % services.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  desc,
  center = true,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {eyebrow}
      </span>
      <h2 className="mt-5 font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl lg:text-[52px]">
        {title}
      </h2>
      {desc && (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {desc}
        </p>
      )}
    </div>
  );
}
