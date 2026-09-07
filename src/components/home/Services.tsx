import { Modal } from "@/components/layout/Modal";
import { useState } from "react";
import {
  X,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Video,
  Wand2,
  Mic,
  Film,
  Megaphone,
  Share2,
  Building2,
  PlayCircle,
  Youtube,
  BookOpen,
  Brain,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSanity } from "@/integrations/sanity/useSanity";
import { servicesQuery } from "@/integrations/sanity/queries";

export type ServiceItem = {
  _id: string;
  title: string;
  fullTitle: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  deliverables: string[];
  color: string;
  iconImg?: string;
  iconComponent: React.ComponentType<{ className?: string }>;
};

const SERVICES_DATA: ServiceItem[] = [
  {
    _id: "1",
    title: "AI Video",
    fullTitle: "AI Commercial Video Production Services",
    category: "Production",
    color: "#b4f07e", // Vibrant Lime Green
    iconImg: "/services/ai-video.webp",
    iconComponent: Video,
    shortDescription:
      "Full-stack AI video creation, generative visuals, and script-to-screen commercial production.",
    fullDescription:
      "We combine state-of-the-art generative AI models (Runway Gen-3, Luma, Sora-class) with senior human post-production to craft cinema-grade commercial ads and visual stories.",
    deliverables: [
      "Custom Scriptwriting & Storyboarding",
      "Generative 4K Video Renderings",
      "Professional Sound Design & Mix",
      "Multi-cut Aspect Ratio Variations (16:9, 9:16, 1:1)",
      "Full Commercial Distribution License",
    ],
  },
  {
    _id: "2",
    title: "AI Animation",
    fullTitle: "AI Animation & 3D Motion Visuals",
    category: "Animation",
    color: "#fca5d5", // Vibrant Pink
    iconImg: "/services/ai-animation.webp",
    iconComponent: Wand2,
    shortDescription:
      "Cinema-grade 2D/3D character animation, product concepts, and kinetic motion graphics.",
    fullDescription:
      "Bring complex visual ideas to life with high-fidelity 3D character animation, fluid motion graphics, and stylized generative visual effects.",
    deliverables: [
      "3D Character & Object Modeling",
      "Fluid Camera Motion & Lighting",
      "Kinetic Typography & Lower Thirds",
      "Custom Brand Asset Integration",
      "Broadcast Quality Master Export",
    ],
  },
  {
    _id: "3",
    title: "Voiceovers",
    fullTitle: "Multilingual AI Voiceovers & Video Dubbing",
    category: "Voice & Audio",
    color: "#fed766", // Bright Yellow
    iconImg: "/services/voiceovers.webp",
    iconComponent: Mic,
    shortDescription:
      "Studio-grade AI voice cloning, lip-syncing, and audio translation in 40+ global languages.",
    fullDescription:
      "Scale your brand internationally with emotion-tuned AI voiceovers, voice cloning, automatic lip-sync alignment, and native accent localization.",
    deliverables: [
      "Voice Cloning & Persona Calibration",
      "Translation & Subtitle Alignment",
      "40+ Languages & Dialect Variations",
      "Mastered 24-bit Audio Tracks",
      "Noise Reduction & Room Polish",
    ],
  },
  {
    _id: "4",
    title: "UGC Ads",
    fullTitle: "UGC Video Editing & Performance Ads",
    category: "Marketing",
    color: "#7ef0e8", // Cyan / Aqua
    iconImg: "/services/ugc-editing.webp",
    iconComponent: Film,
    shortDescription:
      "High-converting UGC video ad editing for performance marketing agencies on Meta & TikTok.",
    fullDescription:
      "Turn raw creator clips into high-converting performance ads. We optimize hooks, pacing, captions, overlay graphics, and call-to-actions.",
    deliverables: [
      "Scroll-Stopping 3-Second Hook Variations",
      "Dynamic B-Roll & Text Overlays",
      "Trending Audio & SFX Track Integration",
      "Rapid A/B Test Cutdowns",
      "Meta, TikTok & YouTube Shorts Native Formatting",
    ],
  },
  {
    _id: "5",
    title: "AI Avatars",
    fullTitle: "Custom AI Presenter Avatars for Onboarding & Training",
    category: "Avatars",
    color: "#ffaa7e", // Warm Orange / Peach
    iconImg: "/services/ai-avatar.webp",
    iconComponent: Sparkles,
    shortDescription:
      "Custom AI avatars for company onboarding, internal training, and self-service helpdesk portals.",
    fullDescription:
      "Build hyper-realistic brand presenter avatars. Update corporate training videos, onboarding sequences, and support documentation in minutes without re-shooting.",
    deliverables: [
      "Custom Brand Presenter Avatar Creation",
      "Photorealistic Voice & Gesture Sync",
      "Onboarding & Training Video Templates",
      "Instant Text-to-Video Script Updates",
      "LMS & Portal Embed Integration",
    ],
  },
  {
    _id: "6",
    title: "Commercial Ads",
    fullTitle: "High-Impact Commercial Ads & CTV Campaigns",
    category: "Advertising",
    color: "#d8b4fe", // Purple / Violet
    iconImg: "/services/commercial-ads.webp",
    iconComponent: Megaphone,
    shortDescription:
      "High-converting spots engineered for Meta, YouTube, TikTok, and Connected TV (CTV).",
    fullDescription:
      "End-to-end commercial ad creation built to capture attention and drive measurable revenue across paid social and broadcast channels.",
    deliverables: [
      "Direct Response & Brand Awareness Concepts",
      "High-Impact Visual Editing & Color Grading",
      "Licensed Commercial Soundtrack",
      "Platform Compliance & Aspect Ratios",
    ],
  },
  {
    _id: "7",
    title: "Social Reels",
    fullTitle: "Social Media Video Agency & Vertical Content",
    category: "Marketing",
    color: "#93c5fd", // Light Blue
    iconImg: "/services/social-reels.webp",
    iconComponent: Share2,
    shortDescription:
      "Scroll-stopping vertical-native video content designed for organic and paid growth.",
    fullDescription:
      "Consistent, high-quality short-form video production built specifically for Instagram Reels, TikTok, and YouTube Shorts.",
    deliverables: [
      "Monthly Content Calendar Production",
      "Vertical-Native Storytelling",
      "Engaging Subtitle Captions",
      "Cross-Platform Distribution Formats",
    ],
  },
  {
    _id: "8",
    title: "Talking Head",
    fullTitle: "Talking Head & SaaS Product Demos",
    category: "Production",
    color: "#fde047", // Soft Gold
    iconImg: "/services/explainers.webp",
    iconComponent: PlayCircle,
    shortDescription:
      "Clear, elegant product explainers that turn complex technical concepts into sales.",
    fullDescription:
      "Showcase your software, SaaS, or enterprise service with slick UI animations, clear voiceover narration, and conversion-focused storytelling.",
    deliverables: [
      "App & Software Interface Animation",
      "Technical Feature Breakdowns",
      "Executive Pitch Video Edits",
      "HD Master & Web Embed Formats",
    ],
  },
  {
    _id: "9",
    title: "Studio Stages",
    fullTitle: "In-House Studio Stage & Hybrid Production",
    category: "Production",
    color: "#a7f3d0", // Mint Green
    iconImg: "/services/studio-stages.webp",
    iconComponent: Building2,
    shortDescription:
      "In-house lighting stage, camera crew, edit bays, and AI hybrid production workflows.",
    fullDescription:
      "Combine live camera production with AI background extensions, visual effects, and post-production polish in our dedicated studio space.",
    deliverables: [
      "Live Filming & Studio Lighting Setup",
      "4K Camera Crew & Direction",
      "Generative Background Extensions",
      "Post-Production Edit & Mix",
    ],
  },
  {
    _id: "10",
    title: "YouTube Studio",
    fullTitle: "Full-Stack YouTube Channel Automation & Editing",
    category: "Marketing",
    color: "#f87171", // Coral Red
    iconImg: "/services/youtube-studio.webp",
    iconComponent: Youtube,
    shortDescription:
      "Full-stack channel management: topic research, scriptwriting, AI voice, edit & thumbnails.",
    fullDescription:
      "Scale a dedicated YouTube channel with automated longform video editing, custom high-CTR thumbnails, and polished voiceover narration.",
    deliverables: [
      "High-CTR Thumbnail Design",
      "Paced Editing with Sound Effects",
      "Chapter Markers & SEO Metadata",
      "Weekly Channel Publishing Workflows",
    ],
  },
  {
    _id: "11",
    title: "Brand Films",
    fullTitle: "Documentary Brand Films & Executive Stories",
    category: "Production",
    color: "#cbd5e1", // Slate Silver
    iconImg: "/services/brand-films.webp",
    iconComponent: BookOpen,
    shortDescription:
      "Documentary-style narratives and brand films engineered for emotional resonance.",
    fullDescription:
      "Tell your company's founding story, mission, and culture through documentary-grade cinematography, voiceover, and custom music scoring.",
    deliverables: [
      "Executive Interview Editing",
      "Archive & B-Roll Assembly",
      "Cinematic Color Grading",
      "Custom Soundtrack Composition",
    ],
  },
  {
    _id: "12",
    title: "AI Strategy",
    fullTitle: "AI Video Content Strategy & Roadmap",
    category: "Strategy",
    color: "#f472b6", // Rose Pink
    iconImg: "/services/ai-strategy.webp",
    iconComponent: Brain,
    shortDescription:
      "Data-driven creative roadmaps tuned to your marketing funnel, audience & revenue targets.",
    fullDescription:
      "Work directly with our creative directors to audit your video funnel, select optimal AI tools, and structure scalable production pipelines.",
    deliverables: [
      "Video Funnel Audit & Analysis",
      "AI Workflow Setup & Guidelines",
      "Quarterly Content Roadmap",
      "Creative Brief Templates",
    ],
  },
];

// Quadruple items array to ensure infinite smooth seamless looping

export function SectionHeader({
  eyebrow,
  title,
  desc,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C23800]">{eyebrow}</p>
      )}
      <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {desc && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{desc}</p>
      )}
    </div>
  );
}

type CmsService = {
  _id: string;
  title: string;
  shortDescription?: string;
  longDescription?: string;
  features?: string[];
};

export function Services() {
  const cms = useSanity<CmsService[]>(["sanity", "services"], servicesQuery, []);
  const [selected, setSelected] = useState<ServiceItem | null>(null);
  const items = cms.length
    ? cms.map((item, i) => ({
        ...SERVICES_DATA[i % SERVICES_DATA.length],
        _id: item._id,
        title: item.title,
        fullTitle: item.title,
        shortDescription: item.shortDescription || "Creative production shaped around your brief.",
        fullDescription:
          item.longDescription ||
          item.shortDescription ||
          "Discuss the right deliverables for your project with our team.",
        deliverables: item.features || [],
      }))
    : SERVICES_DATA;
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24" id="services">
      <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <p className="eyebrow">Our capabilities</p>
          <h2 className="section-title mt-3">
            Your idea. Our craft.
            <br />
            <span className="text-brand-blue">Built for the screen.</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          From a single product film to an ongoing content series. Find the right starting point for
          your brief.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <button
            type="button"
            key={item._id}
            onClick={() => setSelected(item)}
            className="service-card group rounded-3xl border border-border bg-card p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-brand-blue/30 hover:shadow-lg"
            aria-haspopup="dialog"
          >
            <div className="mb-6 flex items-center justify-between">
              <img
                src={item.iconImg}
                alt=""
                width={64}
                height={64}
                loading="lazy"
                decoding="async"
                className="h-16 w-16 rounded-2xl object-cover"
              />
              <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="font-display text-xl font-bold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.shortDescription}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">
              Explore service{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        ))}
      </div>
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.fullTitle || "Service details"}
      >
        {selected && (
          <div className="p-6 sm:p-8">
            <p className="text-base leading-relaxed text-muted-foreground">
              {selected.fullDescription}
            </p>
            {selected.deliverables.length > 0 && (
              <>
                <h3 className="mt-6 font-semibold">Deliverables to discuss</h3>
                <ul className="mt-4 space-y-3">
                  {selected.deliverables.map((item) => (
                    <li key={item} className="flex gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-blue" />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <Link
              to="/contact"
              className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white"
            >
              Request a quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </Modal>
    </section>
  );
}
