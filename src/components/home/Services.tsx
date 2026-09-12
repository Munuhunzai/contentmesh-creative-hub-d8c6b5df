import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { useId, useState } from "react";
import {
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
  fullDescription: string | PortableTextBlock[];
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
      "AI video creation, generative visuals, and script-to-screen commercial production.",
    fullDescription:
      "We combine state-of-the-art generative AI models (selected for your visual direction) with senior human post-production to craft cinema-grade commercial ads and visual stories.",
    deliverables: [
      "Custom Scriptwriting & Storyboarding",
      "Generative 4K Video Renderings",
      "Professional Sound Design & Mix",
      "Multi-cut Aspect Ratio Variations (16:9, 9:16, 1:1)",
      "Usage rights agreed for your distribution channels",
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
    shortDescription: "AI voiceovers, lip-syncing and audio localisation for your chosen audience.",
    fullDescription:
      "Scale your brand internationally with emotion-tuned AI voiceovers, voice cloning, automatic lip-sync alignment, and native accent localization.",
    deliverables: [
      "Voice Cloning & Persona Calibration",
      "Translation & Subtitle Alignment",
      "Language & Pronunciation Review",
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
    fullTitle: "Virtual Stages & Hybrid Production",
    category: "Production",
    color: "#a7f3d0", // Mint Green
    iconImg: "/services/studio-stages.webp",
    iconComponent: Building2,
    shortDescription:
      "AI environments and hybrid production planned around the assets your project needs.",
    fullDescription:
      "Combine live camera production with AI background extensions, visual effects, and post-production polish through a project-specific production plan.",
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
  longDescription?: string | PortableTextBlock[];
  features?: string[];
};

export function Services({ compact = false }: { compact?: boolean }) {
  const cms = useSanity<CmsService[]>(["sanity", "services"], servicesQuery, []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const tabsId = useId();
  const items = cms.length
    ? cms.map((item, i) => ({
        ...SERVICES_DATA[i % SERVICES_DATA.length],
        _id: item._id,
        title: item.title,
        fullTitle: item.title,
        shortDescription:
          item.shortDescription && item.shortDescription.trim().length >= 15
            ? item.shortDescription
            : "Creative production shaped around your brief.",
        fullDescription:
          (Array.isArray(item.longDescription)
            ? item.longDescription.length
              ? item.longDescription
              : undefined
            : item.longDescription) ||
          (item.shortDescription && item.shortDescription.trim().length >= 15
            ? item.shortDescription
            : undefined) ||
          "Discuss the right deliverables for your project with our team.",
        deliverables: item.features || [],
      }))
    : SERVICES_DATA;
  const visibleItems = compact ? items.slice(0, 3) : items;
  const selectedIndex = Math.max(
    0,
    visibleItems.findIndex((item) => item._id === selectedId),
  );
  return (
    <section
      className="studio-section border-t border-border"
      id="services"
      aria-labelledby="services-heading"
    >
      <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <p className="eyebrow">{compact ? "02 / Capabilities" : "Our capabilities"}</p>
          <h2 id="services-heading" className="section-title mt-3">
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
      <div className="service-overview">
        <div
          className="service-selector"
          role="tablist"
          aria-label="Choose a service"
          aria-orientation="vertical"
        >
          {visibleItems.map((item, index) => (
            <button
              type="button"
              key={item._id}
              role="tab"
              id={`${tabsId}-tab-${index}`}
              aria-controls={`${tabsId}-panel-${index}`}
              aria-selected={selectedIndex === index}
              tabIndex={selectedIndex === index ? 0 : -1}
              className="service-selector-tab"
              onClick={() => setSelectedId(item._id)}
              onKeyDown={(event) => {
                const next =
                  event.key === "ArrowDown"
                    ? (index + 1) % visibleItems.length
                    : event.key === "ArrowUp"
                      ? (index - 1 + visibleItems.length) % visibleItems.length
                      : event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? visibleItems.length - 1
                          : null;
                if (next === null) return;
                event.preventDefault();
                setSelectedId(visibleItems[next]._id);
                const buttons =
                  event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
                    '[role="tab"]',
                  );
                buttons?.[next]?.focus();
              }}
            >
              <span className="service-selector-icon" aria-hidden="true">
                <item.iconComponent className="h-5 w-5" />
              </span>
              <span>{item.title}</span>
              <ArrowRight className="service-selector-arrow h-4 w-4" aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="service-overview-panels">
          {visibleItems.map((item, index) => (
            <div
              key={item._id}
              role="tabpanel"
              id={`${tabsId}-panel-${index}`}
              aria-labelledby={`${tabsId}-tab-${index}`}
              hidden={selectedIndex !== index}
              tabIndex={0}
              className="service-overview-panel"
            >
              <div className="service-overview-copy">
                <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  {item.fullTitle}
                </h3>
                <div className="mt-5">
                  <ServiceDescription value={item.fullDescription} />
                </div>
                {item.deliverables.length > 0 && (
                  <ul className="service-overview-features">
                    {item.deliverables.map((feature, featureIndex) => (
                      <li key={`${featureIndex}-${feature}`}>
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  to="/contact"
                  search={{ reference: `Service: ${item.title}` }}
                  className="studio-text-link mt-8"
                >
                  Request a quote <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="service-overview-art" aria-hidden="true">
                <item.iconComponent />
              </div>
            </div>
          ))}
        </div>
      </div>
      {compact && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-7">
          <p className="text-sm text-muted-foreground">
            One film, an ongoing series, or the whole production.
          </p>
          <Link to="/services" className="studio-text-link">
            Explore all capabilities <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
}

export function ServiceDescription({ value }: { value: string | PortableTextBlock[] }) {
  const plainText =
    typeof value === "string"
      ? value
      : value
          .flatMap((block) => block.children || [])
          .map((span) => (typeof span.text === "string" ? span.text : ""))
          .join(" ");
  if (plainText.trim().length < 15)
    return (
      <p className="text-base leading-relaxed text-muted-foreground">
        Discuss the creative direction and deliverables for your project with our team.
      </p>
    );
  return (
    <div className="space-y-4 text-base leading-relaxed text-muted-foreground [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
      {typeof value === "string" ? value : <PortableText value={value} />}
    </div>
  );
}
