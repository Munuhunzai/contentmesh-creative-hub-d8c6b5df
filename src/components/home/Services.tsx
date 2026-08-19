import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    iconImg: "/services/social-reels.jpg",
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
    iconImg: "/services/explainers.jpg",
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
    iconImg: "/services/studio-stages.jpg",
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
    iconImg: "/services/youtube-studio.jpg",
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
    iconImg: "/services/brand-films.jpg",
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
    iconImg: "/services/ai-strategy.jpg",
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
const LOOP_SERVICES = [
  ...SERVICES_DATA,
  ...SERVICES_DATA,
  ...SERVICES_DATA,
  ...SERVICES_DATA,
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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5A1F]">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {desc && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {desc}
        </p>
      )}
    </div>
  );
}

export function Services() {
  const sanityServices = useSanity<any[]>(["sanity", "services"], servicesQuery, []);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ── 1. Mouse Wheel Horizontal Scroll Listener ────────────────────────────────
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Convert vertical scroll wheel movement into horizontal scrolling
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 1.2;
        handleUserInteractionStart();
        handleUserInteractionEnd();
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // ── 2. Auto-Loop Animation + Wrap-Around Handler ────────────────────────────
  useEffect(() => {
    let animId: number;
    let isVisible = false;

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.1 }
    );

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    const autoScroll = () => {
      if (isVisible && scrollRef.current && !isInteractingRef.current && !isMouseDownRef.current) {
        scrollRef.current.scrollLeft += 0.8; // Smooth auto-slide step

        const halfWidth = scrollRef.current.scrollWidth / 2;
        if (scrollRef.current.scrollLeft >= halfWidth) {
          scrollRef.current.scrollLeft -= halfWidth / 2;
        }
      }
      animId = requestAnimationFrame(autoScroll);
    };

    animId = requestAnimationFrame(autoScroll);
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  const handleUserInteractionStart = () => {
    isInteractingRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const handleUserInteractionEnd = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 2500);
  };

  // ── 3. Mouse Drag-to-Scroll Handlers ────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isMouseDownRef.current = true;
    hasDraggedRef.current = false;
    handleUserInteractionStart();
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStartRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.8;
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isMouseDownRef.current = false;
    handleUserInteractionEnd();
  };

  const handleCardClick = (item: ServiceItem) => {
    if (!hasDraggedRef.current) {
      setSelectedService(item);
    }
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden" id="services">
      <div className="mx-auto max-w-7xl px-6">
        {/* ── Centered Section Header ─────────────────────────────────────────── */}
        <SectionHeader
          eyebrow="Service Categories"
          title="Next-Gen AI Video Production Services Built to Scale Your Brand"
          desc="Slide through our core AI video production services below. Click any category to inspect deliverables and request a quote."
        />
      </div>

      {/* ── Mouse Scrollable + Drag-to-Scroll + Auto-Looping Circular Slider ─ */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleUserInteractionStart}
        onTouchEnd={handleUserInteractionEnd}
        onScroll={() => {
          if (scrollRef.current) {
            const halfWidth = scrollRef.current.scrollWidth / 2;
            if (scrollRef.current.scrollLeft >= halfWidth) {
              scrollRef.current.scrollLeft -= halfWidth / 2;
            } else if (scrollRef.current.scrollLeft <= 0) {
              scrollRef.current.scrollLeft += halfWidth / 2;
            }
          }
        }}
        className="no-scrollbar mt-10 flex items-center gap-5 overflow-x-auto py-4 px-4 select-none cursor-grab active:cursor-grabbing w-full"
      >
        {LOOP_SERVICES.map((item, idx) => {
          const Icon = item.iconComponent;
          return (
            <motion.div
              key={`${item._id}-${idx}`}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(item)}
              className="group flex flex-col items-center shrink-0 cursor-pointer text-center"
              style={{ width: "96px" }}
            >
              {/* Compact Circular Card Badge */}
              <div
                className="relative flex h-20 w-20 items-center justify-center rounded-full shadow-md transition-all duration-300 group-hover:shadow-xl overflow-hidden"
                style={{
                  backgroundColor: item.color,
                  boxShadow: `0 10px 20px -6px ${item.color}88`,
                }}
              >
                {/* Custom 3D Icon Image or Fallback Icon */}
                {item.iconImg ? (
                  <img
                    src={item.iconImg}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 pointer-events-none"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-black/10 text-black pointer-events-none">
                    <Icon className="h-8 w-8 drop-shadow-md" />
                  </div>
                )}

                {/* Hover ring pulse */}
                <div className="absolute inset-0 rounded-full border-2 border-white/50 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              {/* Service Category Title */}
              <span className="mt-2.5 font-display text-xs font-bold tracking-tight text-foreground transition-colors group-hover:text-[#FF5A1F] pointer-events-none line-clamp-2 leading-tight">
                {item.title}
              </span>
            </motion.div>
          );
        })}
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
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5A1F]">
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
