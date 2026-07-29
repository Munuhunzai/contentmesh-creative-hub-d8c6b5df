import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
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
    iconImg: "/services/ai-video.jpg",
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
    iconImg: "/services/ai-animation.jpg",
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
    iconImg: "/services/voiceovers.jpg",
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
    iconImg: "/services/ugc-editing.jpg",
    iconComponent: Film,
    shortDescription:
      "High-converting UGC video ad edits for performance marketing agencies on Meta & TikTok.",
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
    iconImg: "/services/ai-avatar.jpg",
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
    iconImg: "/services/commercial-ads.jpg",
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
    title: "Explainers",
    fullTitle: "Corporate Explainers & SaaS Product Demos",
    category: "Production",
    color: "#fde047", // Soft Gold
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

export function Services() {
  const sanityServices = useSanity<any[]>(["sanity", "services"], servicesQuery, []);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="relative py-24 sm:py-32" id="services">
      <div className="mx-auto max-w-7xl px-6">
        {/* ── Section Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5A1F] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" /> Service Categories
            </p>
            <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Categories & Capabilities
            </h2>
            <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
              Slide through our core services below. Click any category to inspect deliverables and book.
            </p>
          </div>

          {/* Navigation Arrows (Desktop & Mobile) */}
          <div className="mt-6 flex items-center gap-3 md:mt-0">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="grid h-12 w-12 place-items-center rounded-full border border-border/80 bg-background text-foreground shadow-md transition-transform hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="grid h-12 w-12 place-items-center rounded-full bg-foreground text-background shadow-md transition-transform hover:scale-110 active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── Horizontal Scrollable Circular Cards Slider ───────────────────── */}
        <div
          ref={scrollRef}
          className="no-scrollbar mt-12 flex items-center gap-8 overflow-x-auto scroll-smooth py-6 px-2 select-none"
        >
          {SERVICES_DATA.map((item) => {
            const Icon = item.iconComponent;
            return (
              <motion.div
                key={item._id}
                whileHover={{ scale: 1.06, y: -6 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedService(item)}
                className="group flex flex-col items-center shrink-0 cursor-pointer text-center"
                style={{ width: "140px" }}
              >
                {/* Vibrant Circular Card Badge */}
                <div
                  className="relative flex h-32 w-32 items-center justify-center rounded-full shadow-lg transition-shadow duration-300 group-hover:shadow-2xl overflow-hidden"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 16px 32px -8px ${item.color}88`,
                  }}
                >
                  {/* Custom 3D Icon Image or Rendered Icon */}
                  {item.iconImg ? (
                    <img
                      src={item.iconImg}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-black/10 text-black">
                      <Icon className="h-12 w-12 drop-shadow-md" />
                    </div>
                  )}

                  {/* Hover ring pulse */}
                  <div className="absolute inset-0 rounded-full border-2 border-white/40 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                {/* Service Category Title */}
                <span className="mt-4 font-display text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-[#FF5A1F]">
                  {item.title}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── On-Click Service Details Modal / Drawer ─────────────────────────── */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative z-10 w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-border/80 bg-background p-7 sm:p-10 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                aria-label="Close modal"
                className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-secondary/80 text-foreground transition-transform hover:scale-110 active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Top Service Badge Header */}
              <div className="flex items-center gap-4">
                <div
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full shadow-md overflow-hidden"
                  style={{ backgroundColor: selectedService.color }}
                >
                  {selectedService.iconImg ? (
                    <img
                      src={selectedService.iconImg}
                      alt={selectedService.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <selectedService.iconComponent className="h-9 w-9 text-black" />
                  )}
                </div>

                <div>
                  <span className="inline-block rounded-full bg-[#FF5A1F]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#FF5A1F]">
                    {selectedService.category}
                  </span>
                  <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {selectedService.fullTitle}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {selectedService.fullDescription}
              </p>

              {/* Key Deliverables List */}
              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">
                  What's Included & Deliverables:
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {selectedService.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#FF5A1F]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  to="/contact"
                  onClick={() => setSelectedService(null)}
                  className="inline-flex w-full sm:flex-1 items-center justify-center gap-2 rounded-full bg-[#FF5A1F] px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-[#FF5A1F]/30 transition-transform hover:scale-102"
                >
                  Book This Service <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setSelectedService(null)}
                  className="w-full sm:w-auto rounded-full border border-border/80 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
