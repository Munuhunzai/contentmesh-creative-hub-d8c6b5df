import { useState, useEffect, useMemo, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Clapperboard,
  Copy,
  Check,
  Download,
  FileText,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Film,
  Users,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  Upload,
  Trash2,
  ImageIcon,
  Compass,
  MessageSquare,
  Volume2,
  Music,
  Shield,
  ArrowLeft,
  Wand2,
  BookOpen,
  PlusCircle,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { AdPlaceholder } from "@/components/tools/AdPlaceholder";
import {
  StoryboardFormInput,
  StoryboardOutput,
  VisualStyleOption,
  PromptStyleOption,
  AspectRatioOption,
  CameraStyleOption,
  StoryboardScene,
  UploadedCharacter,
} from "@/types/storyboard";

export const Route = createFileRoute("/tools/storyboard-generator")({
  head: () => ({
    meta: [
      {
        title:
          "AI Storyboard & Scene Prompt Generator | ContentMesh Studios",
      },
      {
        name: "description",
        content:
          "Turn any script into a complete AI production package: storyboards, 4K scene prompts, character actions, camera directions, SFX, and image prompts for Midjourney, Flux, Veo, and Google Flow.",
      },
      {
        property: "og:title",
        content: "AI Storyboard & Scene Prompt Generator | ContentMesh Studios",
      },
      {
        property: "og:description",
        content:
          "Turn scripts into production-ready AI storyboards, scene prompts, and character guidelines in seconds.",
      },
      {
        property: "og:url",
        content: "https://contentmesh.ai/tools/storyboard-generator",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://contentmesh.ai/tools/storyboard-generator",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "ContentMesh AI Storyboard & Prompt Generator",
          url: "https://contentmesh.ai/tools/storyboard-generator",
          description:
            "Free AI tool to generate complete storyboards, scene prompts, character actions, and camera direction from scripts.",
          applicationCategory: "MultimediaApplication",
          operatingSystem: "All",
          provider: {
            "@type": "Organization",
            name: "ContentMesh Studios",
            url: "https://contentmesh.ai",
          },
        }),
      },
    ],
  }),
  component: StoryboardGeneratorPage,
});

const DEFAULT_SCRIPT = `Title: The Echo of Tomorrow

SCENE 1: EXT. CYBERPUNK CITY - NIGHT
Rain falls on neon-lit skyscrapers. Maya, a rogue engineer wearing a glowing cyber-visor and a high-tech leather jacket, scans the dark alleyway. She checks her wrist terminal as holograms flicker.

MAYA
(whispering)
The signal is coming from inside the core tower.

SCENE 2: INT. CORE TOWER LABORATORY - CONTINUOUS
Maya slips through the heavy blast doors into a sleek, sterile laboratory. Floating AI spheres illuminate the dark chamber with cyan energy. Dr. Aris, a senior scientist in a silver lab coat, turns around sharply.

DR. ARIS
You shouldn't have come here, Maya. The code is already initializing.

SCENE 3: EXT. ROOFTOP HELIPAD - MOMENTS LATER
Alarm sirens blare as heavy rain pours down. Maya sprints across the wet metal platform carrying the quantum drive. An autonomous drone hovers overhead with blinding searchlights.

MAYA
Not if I upload the patch first!`;

const EXAMPLE_SCRIPTS = [
  {
    id: "scifi",
    title: "The Echo of Tomorrow",
    category: "Cyberpunk Sci-Fi",
    description: "Rogue engineer Maya infiltrates a high-tech core tower in a rainy neon city.",
    script: DEFAULT_SCRIPT,
  },
  {
    id: "commercial",
    title: "Neon Racing Speed",
    category: "Commercial Ad",
    description: "Sleek futuristic electric hypercar speeding through night mountain turns.",
    script: `Title: Neon Racing Speed

SCENE 1: EXT. MOUNTAIN ROAD - NIGHT
A sleek matte-black electric supercar speeds along a dark coastal highway. Cyan LED taillights create glowing streaks against the wet asphalt.

SCENE 2: INT. DRIVER COCKPIT - CONTINUOUS
The driver in a titanium helmet grips the glowing steering yoke. Holographic telemetry displays reflect on the visor.

SCENE 3: EXT. CITY HORIZON - DAWN
The hypercar emerges onto a futuristic bridge as sunrise illuminates the glass metropolis.`,
  },
  {
    id: "fantasy",
    title: "The Forgotten Citadel",
    category: "Fantasy Epic",
    description: "An ancient warrior enters a hidden mossy stone temple floating above clouds.",
    script: `Title: The Forgotten Citadel

SCENE 1: EXT. FLOATING ISLANDS - DAY
Sunlight pierces through golden clouds onto floating mossy stone ruins. An adventurer carrying a glowing sword walks across an ancient bridge.

SCENE 2: INT. CITADEL SANCTUARY - CONTINUOUS
Massive stone pillars carved with ancient runes tower over a crystal altar flickering with blue energy.

SCENE 3: EXT. SUNSET PEAK - EVENING
The adventurer gazes out from the citadel edge as giant mythical birds fly through the orange sky.`,
  },
];

const VISUAL_STYLES: VisualStyleOption[] = [
  "Pixar 3D",
  "Disney Style",
  "DreamWorks",
  "Anime",
  "Cinematic",
  "Live Action",
  "Photorealistic",
  "Stylized Realism",
  "Ghibli",
  "Comic",
  "Cyberpunk",
  "Fantasy",
  "Sci-Fi",
  "Medieval",
  "Horror",
  "Custom",
];

const PROMPT_STYLES: PromptStyleOption[] = [
  "Google Flow",
  "Veo",
  "Midjourney",
  "Flux",
  "Leonardo",
  "Stable Diffusion",
  "General",
];

const ASPECT_RATIOS: AspectRatioOption[] = [
  "16:9",
  "9:16",
  "1:1",
  "4:5",
  "21:9",
];

const CAMERA_STYLES: CameraStyleOption[] = [
  "Cinematic",
  "Static",
  "Handheld",
  "Drone",
  "Mixed",
];

const SCENES_PER_PAGE = 10;

export function StoryboardGeneratorPage() {
  // Navigation Wizard Step State: "script" | "config" | "studio"
  const [step, setStep] = useState<"script" | "config" | "studio">("script");

  // Form State
  const [form, setForm] = useState<StoryboardFormInput>({
    script: DEFAULT_SCRIPT,
    numberOfScenes: 10,
    visualStyle: "Cyberpunk",
    customStyle: "",
    characterPrompts: "",
    uploadedCharacters: [],
    aiModel: "DeepSeek",
    promptStyle: "Google Flow",
    outputLanguage: "English",
    aspectRatio: "16:9",
    cameraStyle: "Cinematic",
    promptDetail: "Ultra Detailed",
    includeDialogue: true,
    includeSFX: true,
    includeBackgroundMusic: false,
    safetyNotes: true,
  });

  // UI & Output State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<StoryboardOutput | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // AI Assistant Chat state for Step 3
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantLogs, setAssistantLogs] = useState<Array<{ sender: "user" | "ai"; text: string }>>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const timelineScrollRef = useRef<HTMLDivElement>(null);

  // Local Storage Session Recovery
  useEffect(() => {
    try {
      const saved = localStorage.getItem("contentmesh_storyboard_output");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.scenes && parsed.scenes.length > 0) {
          parsed.timeline = parsed.scenes.map((s: StoryboardScene) => ({
            sceneNumber: s.sceneNumber,
            sceneTitle: s.sceneTitle || `Scene ${s.sceneNumber}`,
            duration: s.duration || "5s",
            environment: s.environment || "Location",
            characters: s.characters || [],
          }));
        }
        setOutput(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Reset pagination to page 1 whenever filters or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]);

  const handleFormChange = (
    key: keyof StoryboardFormInput,
    value: any
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Reset / New Story Handler
  const handleStartNewStory = () => {
    setForm((prev) => ({ ...prev, script: "" }));
    setOutput(null);
    setStep("script");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Character Upload Handlers
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        const newChar: UploadedCharacter = {
          id: `char-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          prompt: "Visual character reference attached.",
          imageUrl,
          fileName: file.name,
        };

        setForm((prev) => ({
          ...prev,
          uploadedCharacters: [...(prev.uploadedCharacters || []), newChar],
        }));
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveUploadedCharacter = (id: string) => {
    setForm((prev) => ({
      ...prev,
      uploadedCharacters: (prev.uploadedCharacters || []).filter((c) => c.id !== id),
    }));
  };

  const handleUpdateUploadedCharacter = (
    id: string,
    field: "name" | "prompt",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      uploadedCharacters: (prev.uploadedCharacters || []).map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    }));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const scrollToScene = (sceneNumber: number) => {
    setSearchQuery("");
    setActiveFilter("all");

    if (output?.scenes) {
      const sceneIndex = output.scenes.findIndex((s) => s.sceneNumber === sceneNumber);
      if (sceneIndex !== -1) {
        const targetPage = Math.floor(sceneIndex / SCENES_PER_PAGE) + 1;
        setCurrentPage(targetPage);
      }
    }

    setTimeout(() => {
      const el = document.getElementById(`scene-card-${sceneNumber}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  };

  const scrollTimeline = (direction: "left" | "right") => {
    if (timelineScrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      timelineScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Scene N [prompt] Format Generator
  const getSceneFormattedPrompt = (scene: StoryboardScene) => {
    const promptText = scene.copyReadyPrompt || scene.generationPrompt;
    return `Scene ${scene.sceneNumber} [${promptText}]`;
  };

  // Step 1 -> Step 2 transition
  const handleProceedToConfig = () => {
    if (!form.script || form.script.trim().length < 10) {
      setError("Please paste a story or script with at least 10 characters.");
      return;
    }
    setError(null);
    setStep("config");
  };

  // Step 2 -> Step 3 Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.script || form.script.trim().length < 10) {
      setError("Please paste a script with at least 10 characters.");
      setStep("script");
      return;
    }

    setError(null);
    setLoading(true);
    setStep("studio");

    try {
      const res = await fetch("/api/generate-storyboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to generate storyboard package.");
      }

      const data: StoryboardOutput = await res.json();

      if (data.scenes && data.scenes.length > 0) {
        data.timeline = data.scenes.map((s) => ({
          sceneNumber: s.sceneNumber,
          sceneTitle: s.sceneTitle || `Scene ${s.sceneNumber}`,
          duration: s.duration || "5s",
          environment: s.environment || "Location",
          characters: s.characters || [],
        }));
      }

      if (form.uploadedCharacters && form.uploadedCharacters.length > 0 && data.characters) {
        data.characters = data.characters.map((char) => {
          const match = form.uploadedCharacters?.find(
            (u) => u.name.toLowerCase().trim() === char.name.toLowerCase().trim()
          );
          return match?.imageUrl ? { ...char, imageUrl: match.imageUrl } : char;
        });
      }

      setOutput(data);
      setCurrentPage(1);
      localStorage.setItem("contentmesh_storyboard_output", JSON.stringify(data));
    } catch (err: any) {
      setError(err.message || "An error occurred during generation.");
      setStep("config");
    } finally {
      setLoading(false);
    }
  };

  // AI Assistant Request Handler (Step 3)
  const handleAssistantSubmit = (query: string) => {
    if (!query || !query.trim() || !output) return;
    const userMsg = query.trim();
    setAssistantLogs((prev) => [...prev, { sender: "user", text: userMsg }]);
    setAssistantInput("");

    setTimeout(() => {
      const updatedScenes = output.scenes.map((scene) => {
        let text = scene.copyReadyPrompt || scene.generationPrompt;
        if (userMsg.toLowerCase().includes("dramatic")) {
          text = `${text}, intense dramatic lighting, high contrast cinematic grade`;
        } else if (userMsg.toLowerCase().includes("push in") || userMsg.toLowerCase().includes("camera")) {
          text = `${text}, 35mm anamorphic camera lens, slow push-in tracking shot`;
        } else if (userMsg.toLowerCase().includes("pixar") || userMsg.toLowerCase().includes("3d")) {
          text = `${text}, Pixar 3D animated style, vibrant warm colors`;
        } else {
          text = `${text}, (${userMsg})`;
        }
        return { ...scene, copyReadyPrompt: text };
      });

      setOutput({ ...output, scenes: updatedScenes });
      setAssistantLogs((prev) => [
        ...prev,
        { sender: "ai", text: `Updated ${updatedScenes.length} scenes matching: "${userMsg}"` },
      ]);
    }, 400);
  };

  // Filtered Scenes List
  const filteredScenes = useMemo(() => {
    if (!output?.scenes) return [];
    return output.scenes.filter((scene) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        scene.sceneTitle.toLowerCase().includes(q) ||
        scene.generationPrompt.toLowerCase().includes(q) ||
        scene.environment.toLowerCase().includes(q) ||
        `scene ${scene.sceneNumber}`.toLowerCase().includes(q) ||
        scene.sceneNumber.toString() === q;

      if (!matchesSearch) return false;

      if (activeFilter === "dialogue") return Boolean(scene.dialogue);
      if (activeFilter === "sfx") return Boolean(scene.sfx);
      if (activeFilter === "characters") return (scene.characters?.length || 0) > 0;
      return true;
    });
  }, [output, searchQuery, activeFilter]);

  // Paginated Scenes Slicing (10 scenes per page)
  const totalPages = Math.ceil(filteredScenes.length / SCENES_PER_PAGE);
  const paginatedScenes = useMemo(() => {
    const start = (currentPage - 1) * SCENES_PER_PAGE;
    return filteredScenes.slice(start, start + SCENES_PER_PAGE);
  }, [filteredScenes, currentPage]);

  // Export Utilities
  const exportFormatted = (type: "markdown" | "txt" | "json") => {
    if (!output) return;
    let content = "";
    let mimeType = "text/plain";
    let extension = type;

    if (type === "json") {
      content = JSON.stringify(output, null, 2);
      mimeType = "application/json";
    } else if (type === "markdown") {
      content = `# ${output.project.title}\n\n**Visual Style:** ${output.project.visualStyle} | **Aspect Ratio:** ${output.project.aspectRatio}\n\n## Scenes\n`;
      output.scenes.forEach((s) => {
        content += `${getSceneFormattedPrompt(s)}\n\n`;
      });
      mimeType = "text/markdown";
    } else {
      content = `${output.project.title}\n======================\n\nSCENE PROMPTS:\n`;
      output.scenes.forEach((s) => {
        content += `${getSceneFormattedPrompt(s)}\n\n`;
      });
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `storyboard_${output.project.title.toLowerCase().replace(/\s+/g, "_")}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SiteLayout>
      {/* ── ENFORCE INTER FONT TYPOGRAPHY ACROSS ENTIRE AI TOOL ──────────────── */}
      <div className="font-['Inter'] font-sans text-foreground antialiased selection:bg-[#FF5A1F]/30 w-full max-w-full">
        {/* ── TOP STEP NAVIGATION WIZARD BAR ───────────────────────────────── */}
        <section className="relative border-b border-border/40 bg-secondary/10 py-3 px-4 sm:px-6 w-full max-w-full">
          <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clapperboard className="h-4 w-4 text-[#FF5A1F]" />
              <span className="font-bold text-xs sm:text-sm text-foreground">
                AI Storyboard Studio
              </span>
            </div>

            {/* Wizard Step Breadcrumb Buttons & + New Story CTA */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleStartNewStory}
                className="flex items-center gap-1 rounded-full bg-[#FF5A1F] px-3 py-1 text-xs font-bold text-white shadow-md hover:bg-[#FF5A1F]/90 transition-all mr-2"
              >
                <PlusCircle className="h-3.5 w-3.5" /> + New Story
              </button>

              <button
                onClick={() => setStep("script")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                  step === "script"
                    ? "bg-[#FF5A1F] text-white shadow-md"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" /> 1. Story Input
              </button>

              <span className="text-muted-foreground text-xs font-bold">→</span>

              <button
                onClick={() => setStep("config")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                  step === "config"
                    ? "bg-[#FF5A1F] text-white shadow-md"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" /> 2. Config
              </button>

              <span className="text-muted-foreground text-xs font-bold">→</span>

              <button
                onClick={() => {
                  if (output) setStep("studio");
                }}
                disabled={!output}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                  step === "studio"
                    ? "bg-[#FF5A1F] text-white shadow-md"
                    : "bg-secondary text-muted-foreground opacity-50 cursor-not-allowed"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" /> 3. Studio & Assistant
              </button>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ── STEP 1: INITIAL LANDING SCREEN (MATCHES IMAGE 1) ───────────── */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {step === "script" && (
          <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-20 w-full max-w-full space-y-12">
            {/* Centered Title & Header */}
            <div className="text-center space-y-3">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                What story do you want to make?
              </h1>
              <p className="mx-auto max-w-xl text-xs sm:text-sm text-muted-foreground">
                Describe your story idea or paste your script to generate complete 4K AI storyboards and scene prompts.
              </p>
            </div>

            {/* Centered Floating Story Input Box (Matches Screenshot 1) */}
            <div className="mx-auto max-w-3xl rounded-3xl border border-border/80 bg-card p-4 sm:p-6 shadow-2xl shadow-[#FF5A1F]/10 backdrop-blur-2xl space-y-4">
              <textarea
                rows={6}
                value={form.script}
                onChange={(e) => handleFormChange("script", e.target.value)}
                placeholder="Describe your story idea or paste a screenplay here..."
                className="w-full rounded-2xl border border-input bg-background/80 px-4 py-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 leading-relaxed font-mono whitespace-pre-wrap min-h-[160px]"
              />

              {/* Bottom Tools & Action Bar Inside Card */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileUpload}
                    accept="image/png, image/jpeg, image/webp"
                    multiple
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/30 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    <Upload className="h-3.5 w-3.5 text-[#FF5A1F]" />
                    {form.uploadedCharacters?.length ? `${form.uploadedCharacters.length} Images` : "Attach Images"}
                  </button>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {form.script.length} characters
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToConfig}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5A1F] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF5A1F]/30 hover:scale-105 transition-all"
                >
                  Continue to Config <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {error && (
                <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-2.5 text-xs font-semibold text-destructive">
                  {error}
                </p>
              )}
            </div>

            {/* History / Example Scripts Section (Matches Screenshot 1 Bottom Grid) */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#FF5A1F]" /> Start from an example script
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {EXAMPLE_SCRIPTS.map((ex) => (
                  <div
                    key={ex.id}
                    onClick={() => {
                      handleFormChange("script", ex.script);
                      window.scrollTo({ top: 150, behavior: "smooth" });
                    }}
                    className="group rounded-2xl border border-border/70 bg-card p-4 shadow-sm hover:border-[#FF5A1F]/50 hover:shadow-md transition-all cursor-pointer space-y-2"
                  >
                    <span className="rounded-full bg-[#FF5A1F]/10 px-2 py-0.5 text-[9px] font-bold text-[#FF5A1F] uppercase">
                      {ex.category}
                    </span>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-[#FF5A1F] transition-colors">
                      {ex.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {ex.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ── STEP 2: PRODUCTION SETTINGS PAGE (SCREEN 2 - ONLY SETTINGS) ─── */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {step === "config" && (
          <section className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12 w-full max-w-full space-y-6">
            {/* Top Banner with Script Summary & Back Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-glass">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5A1F]">
                  Active Screenplay
                </span>
                <p className="font-mono text-xs text-foreground line-clamp-1 max-w-xl">
                  {form.script}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartNewStory}
                  className="inline-flex items-center gap-1 rounded-full bg-[#FF5A1F] px-3 py-1 text-xs font-bold text-white shadow-md hover:bg-[#FF5A1F]/90 transition-all"
                >
                  <PlusCircle className="h-3.5 w-3.5" /> + New Story
                </button>
                <button
                  onClick={() => setStep("script")}
                  className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground shrink-0"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Edit Story
                </button>
              </div>
            </div>

            {/* DEDICATED PRODUCTION CONFIG CARD */}
            <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-8 shadow-glass backdrop-blur-xl space-y-6">
              <div className="border-b border-border/40 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Production & Visual Settings
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Configure visual style, scene count, aspect ratio, and AI prompt format.
                  </p>
                </div>
                <SlidersHorizontal className="h-5 w-5 text-[#FF5A1F]" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Character Reference Upload Zone */}
                <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-[#FF5A1F]" /> Character Visual Reference Images
                    </label>
                    <span className="text-xs font-bold text-[#FF5A1F]">
                      {form.uploadedCharacters?.length || 0} Attached
                    </span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileUpload}
                    accept="image/png, image/jpeg, image/webp"
                    multiple
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#FF5A1F]/50 bg-[#FF5A1F]/5 p-3 text-xs font-bold text-[#FF5A1F] hover:bg-[#FF5A1F]/10 transition-colors"
                  >
                    <Upload className="h-4 w-4" /> Upload Character Reference Images (PNG/JPG)
                  </button>

                  {form.uploadedCharacters && form.uploadedCharacters.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {form.uploadedCharacters.map((char) => (
                        <div
                          key={char.id}
                          className="flex items-center gap-2 rounded-xl border border-border/60 bg-background p-2"
                        >
                          {char.imageUrl ? (
                            <img
                              src={char.imageUrl}
                              alt={char.name}
                              className="h-10 w-10 rounded-lg object-cover border border-border/40 shrink-0"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
                              <Users className="h-4 w-4" />
                            </div>
                          )}

                          <input
                            type="text"
                            value={char.name}
                            placeholder="Character Name"
                            onChange={(e) =>
                              handleUpdateUploadedCharacter(char.id, "name", e.target.value)
                            }
                            className="flex-1 rounded border border-input bg-background px-2 py-1 text-xs font-bold text-foreground outline-none focus:ring-1 focus:ring-[#FF5A1F]"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveUploadedCharacter(char.id)}
                            className="p-1 text-muted-foreground hover:text-destructive shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Main Settings Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Target Scene Count (1–200)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={form.numberOfScenes}
                      onChange={(e) =>
                        handleFormChange("numberOfScenes", parseInt(e.target.value) || 10)
                      }
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Visual Render Style
                    </label>
                    <select
                      value={form.visualStyle}
                      onChange={(e) => handleFormChange("visualStyle", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                    >
                      {VISUAL_STYLES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                      AI Generator Target
                    </label>
                    <select
                      value={form.promptStyle}
                      onChange={(e) => handleFormChange("promptStyle", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                    >
                      {PROMPT_STYLES.map((ps) => (
                        <option key={ps} value={ps}>
                          {ps}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Aspect Ratio
                    </label>
                    <select
                      value={form.aspectRatio}
                      onChange={(e) => handleFormChange("aspectRatio", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                    >
                      {ASPECT_RATIOS.map((ar) => (
                        <option key={ar} value={ar}>
                          {ar}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Camera Motion
                    </label>
                    <select
                      value={form.cameraStyle}
                      onChange={(e) => handleFormChange("cameraStyle", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                    >
                      {CAMERA_STYLES.map((cs) => (
                        <option key={cs} value={cs}>
                          {cs}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Toggles Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border/40">
                  <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.includeDialogue}
                      onChange={(e) => handleFormChange("includeDialogue", e.target.checked)}
                      className="h-4 w-4 rounded accent-[#FF5A1F]"
                    />
                    <MessageSquare className="h-3.5 w-3.5 text-[#FF5A1F]" /> Dialogue
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.includeSFX}
                      onChange={(e) => handleFormChange("includeSFX", e.target.checked)}
                      className="h-4 w-4 rounded accent-[#FF5A1F]"
                    />
                    <Volume2 className="h-3.5 w-3.5 text-[#FF5A1F]" /> SFX
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.includeBackgroundMusic}
                      onChange={(e) => handleFormChange("includeBackgroundMusic", e.target.checked)}
                      className="h-4 w-4 rounded accent-[#FF5A1F]"
                    />
                    <Music className="h-3.5 w-3.5 text-[#FF5A1F]" /> Music
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.safetyNotes}
                      onChange={(e) => handleFormChange("safetyNotes", e.target.checked)}
                      className="h-4 w-4 rounded accent-[#FF5A1F]"
                    />
                    <Shield className="h-3.5 w-3.5 text-[#FF5A1F]" /> Safety Prompts
                  </label>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FF5A1F] py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl shadow-[#FF5A1F]/30 hover:scale-[1.01] transition-transform active:scale-95 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Generating Packages...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> ✨ Generate Storyboard Package
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ── STEP 3: STUDIO & ABSOLUTE VIEWPORT FIXED LEFT SIDEBAR DOCK ────── */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {step === "studio" && (
          <section className="mx-auto max-w-7xl px-3 sm:px-6 pb-28 w-full max-w-full relative min-h-[80vh]" id="generator-workspace">
            {/* ── EXPLICIT FIXED VIEWPORT LEFT SIDEBAR (SCROLL-PROOF) ── */}
            <aside className="w-full lg:w-[320px] xl:w-[360px] lg:fixed lg:top-24 lg:z-30 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pb-4">
              {/* Storyboard Active Card Header */}
              <div className="rounded-2xl border border-border/80 bg-card/95 p-3.5 shadow-glass backdrop-blur-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5A1F] flex items-center gap-1">
                    <Wand2 className="h-3.5 w-3.5" /> Storyboard Active
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleStartNewStory}
                      className="text-[10px] font-bold text-[#FF5A1F] hover:underline flex items-center gap-0.5"
                    >
                      <PlusCircle className="h-3 w-3" /> + New Story
                    </button>
                    <button
                      onClick={() => setStep("config")}
                      className="text-[10px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <SlidersHorizontal className="h-3 w-3" /> Config
                    </button>
                  </div>
                </div>

                <p className="text-xs font-mono text-muted-foreground line-clamp-2">
                  {form.script}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
                    {form.visualStyle}
                  </span>
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
                    {form.promptStyle}
                  </span>
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
                    {output?.scenes?.length || 0} Scenes
                  </span>
                </div>
              </div>

              {/* ── FIXED AI ASSISTANT CHAT/MODIFIER BOX ── */}
              <div className="rounded-2xl sm:rounded-3xl border border-border/90 bg-card/95 p-3.5 sm:p-4 shadow-2xl shadow-black/20 backdrop-blur-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#FF5A1F]" /> AI Assistant (Fixed Viewport)
                  </span>
                  <span className="text-[9px] text-emerald-500 font-bold">Online</span>
                </div>

                {/* Assistant Chat Logs */}
                {assistantLogs.length > 0 && (
                  <div className="space-y-2 max-h-[120px] overflow-y-auto no-scrollbar pr-1 text-xs">
                    {assistantLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl text-[11px] ${
                          log.sender === "user"
                            ? "bg-[#FF5A1F]/10 text-foreground border border-[#FF5A1F]/20 ml-4 text-right font-mono"
                            : "bg-secondary/40 text-muted-foreground border border-border/40 mr-4"
                        }`}
                      >
                        {log.text}
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Modification Chips */}
                <div className="flex flex-wrap gap-1">
                  {[
                    "Make more dramatic",
                    "Add camera push-ins",
                    "Pixar 3D style",
                  ].map((chip, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAssistantSubmit(chip)}
                      className="rounded-full bg-secondary/60 px-2 py-0.5 text-[9px] font-semibold text-muted-foreground hover:bg-[#FF5A1F]/10 hover:text-[#FF5A1F] transition-all"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>

                {/* Assistant Prompt Input Box */}
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={assistantInput}
                    onChange={(e) => setAssistantInput(e.target.value)}
                    placeholder="Ask AI Assistant to adjust scenes..."
                    className="w-full rounded-xl border border-input bg-background/90 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 leading-relaxed font-mono break-words whitespace-pre-wrap"
                  />

                  <button
                    type="button"
                    onClick={() => handleAssistantSubmit(assistantInput)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#FF5A1F] py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
                  >
                    <Wand2 className="h-3.5 w-3.5" /> Apply Change to Scenes
                  </button>
                </div>
              </div>
            </aside>

            {/* ── RIGHT STUDIO PANEL WITH MARGIN MATCHING FIXED SIDEBAR ── */}
            <div className="w-full lg:ml-[340px] xl:ml-[380px] lg:max-w-[calc(100%-350px)] xl:max-w-[calc(100%-390px)] space-y-4 min-w-0">
              {output && (
                <div className="space-y-4 w-full">
                  {/* Summary Overview Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-full">
                    <div className="rounded-xl border border-border/60 bg-card p-2.5 text-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">Total Scenes</span>
                      <p className="font-display text-base font-black text-[#FF5A1F]">{output.scenes?.length || 0}</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-card p-2.5 text-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">Characters</span>
                      <p className="font-display text-base font-black text-blue-500">{output.characters?.length || 0}</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-card p-2.5 text-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">Environments</span>
                      <p className="font-display text-base font-black text-emerald-500">{output.environments?.length || 0}</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-card p-2.5 text-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">Est. Runtime</span>
                      <p className="font-display text-base font-black text-purple-500">{output.analytics?.estimatedRuntime || "1m 30s"}</p>
                    </div>
                  </div>

                  {/* Storyboard Timeline Bar */}
                  {output.timeline && output.timeline.length > 0 && (
                    <div className="rounded-2xl border border-border/80 bg-card p-3 shadow-glass max-w-full overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                          <Film className="h-3.5 w-3.5 text-[#FF5A1F]" /> Storyboard Timeline ({output.timeline.length} Scenes)
                        </h3>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => scrollTimeline("left")}
                            className="p-1 rounded-lg border border-border/60 bg-background hover:bg-secondary text-muted-foreground transition-colors"
                            title="Scroll Left"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => scrollTimeline("right")}
                            className="p-1 rounded-lg border border-border/60 bg-background hover:bg-secondary text-muted-foreground transition-colors"
                            title="Scroll Right"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div
                        ref={timelineScrollRef}
                        className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 max-w-full scroll-smooth"
                      >
                        {output.timeline.map((item) => (
                          <div
                            key={item.sceneNumber}
                            onClick={() => scrollToScene(item.sceneNumber)}
                            className="flex flex-col justify-between shrink-0 rounded-xl border border-border/60 bg-secondary/30 p-2 cursor-pointer hover:border-[#FF5A1F] hover:bg-secondary transition-all"
                            style={{ width: "125px" }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="rounded-md bg-[#FF5A1F]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#FF5A1F]">
                                Sc {item.sceneNumber}
                              </span>
                              <span className="text-[9px] text-muted-foreground font-semibold">{item.duration}</span>
                            </div>
                            <h4 className="mt-1 text-[11px] font-bold text-foreground line-clamp-1">
                              {item.sceneTitle}
                            </h4>
                            <span className="mt-0.5 text-[9px] text-muted-foreground/80 line-clamp-1">
                              📍 {item.environment}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Toolbar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 rounded-2xl border border-border/80 bg-card p-3 shadow-glass max-w-full">
                    <div className="relative w-full sm:flex-1 sm:min-w-[160px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search prompts or scene #..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-input bg-background pl-8 pr-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                      />
                    </div>

                    {output.scenes && output.scenes.length > 0 && (
                      <div className="relative flex items-center gap-1">
                        <Compass className="h-3.5 w-3.5 text-[#FF5A1F] shrink-0" />
                        <select
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val) scrollToScene(val);
                          }}
                          defaultValue=""
                          className="rounded-xl border border-input bg-background px-2.5 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                        >
                          <option value="" disabled>
                            Jump to Scene...
                          </option>
                          {output.scenes.map((s) => (
                            <option key={s.sceneNumber} value={s.sceneNumber}>
                              Scene {s.sceneNumber}: {s.sceneTitle}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 max-w-full">
                      <button
                        onClick={() =>
                          handleCopy(
                            output.scenes.map((s) => getSceneFormattedPrompt(s)).join("\n\n"),
                            "all-packages"
                          )
                        }
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#FF5A1F]/40 bg-[#FF5A1F]/10 px-3 py-1.5 text-[11px] font-bold text-[#FF5A1F] hover:bg-[#FF5A1F]/20 transition-colors"
                        title="Copy all scene prompts in 'Scene N [prompt]' format"
                      >
                        {copiedKey === "all-packages" ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        Copy All Prompts
                      </button>

                      <button
                        onClick={() => exportFormatted("markdown")}
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-border/80 bg-background px-2.5 py-1.5 text-[11px] font-semibold text-foreground"
                      >
                        <FileText className="h-3 w-3" /> MD
                      </button>

                      <button
                        onClick={() => exportFormatted("json")}
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-border/80 bg-background px-2.5 py-1.5 text-[11px] font-semibold text-foreground"
                      >
                        <Download className="h-3 w-3" /> JSON
                      </button>
                    </div>
                  </div>

                  {/* ── GENERATED SCENE BOXES (CONTAINING ONLY SCENE NUMBER & SCENE PROMPT) ── */}
                  <div className="space-y-3.5 max-w-full">
                    {paginatedScenes.map((scene) => {
                      const copyKey = `scene-pkg-${scene.sceneNumber}`;

                      return (
                        <motion.div
                          key={scene.sceneNumber}
                          id={`scene-card-${scene.sceneNumber}`}
                          layout
                          className="overflow-hidden rounded-2xl border border-border/80 bg-card p-4 shadow-glass backdrop-blur-xl transition-all hover:border-[#FF5A1F]/30 max-w-full space-y-2.5"
                        >
                          <div className="flex items-center justify-between border-b border-border/40 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FF5A1F] text-xs font-bold text-white shadow-md">
                                {scene.sceneNumber}
                              </span>
                              <span className="text-xs font-bold text-foreground">
                                Scene {scene.sceneNumber}
                              </span>
                            </div>

                            <button
                              onClick={() => handleCopy(getSceneFormattedPrompt(scene), copyKey)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 px-2.5 py-1 text-[11px] font-bold text-[#FF5A1F] hover:bg-[#FF5A1F] hover:text-white transition-all"
                            >
                              {copiedKey === copyKey ? (
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                              Copy Scene
                            </button>
                          </div>

                          {/* ONLY SCENE NUMBER AND SCENE PROMPT (Scene N [prompt]) */}
                          <p className="text-xs sm:text-sm font-mono text-foreground leading-relaxed break-words whitespace-pre-wrap selection:bg-[#FF5A1F]/30 bg-background/60 p-3 rounded-xl border border-border/40">
                            {getSceneFormattedPrompt(scene)}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* ── PAGINATION CONTROLS BAR (10 Scenes per Page) ────────────── */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-glass max-w-full">
                      <span className="text-xs text-muted-foreground font-medium text-center sm:text-left">
                        Showing <strong className="text-foreground font-bold">{(currentPage - 1) * SCENES_PER_PAGE + 1}</strong>–
                        <strong className="text-foreground font-bold">{Math.min(currentPage * SCENES_PER_PAGE, filteredScenes.length)}</strong> of{" "}
                        <strong className="text-foreground font-bold">{filteredScenes.length}</strong> scenes (Page {currentPage} of {totalPages})
                      </span>

                      <div className="flex flex-wrap items-center justify-center gap-1 max-w-full">
                        <button
                          onClick={() => {
                            setCurrentPage((prev) => Math.max(1, prev - 1));
                            const el = document.getElementById("generator-workspace");
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }}
                          disabled={currentPage === 1}
                          className="inline-flex items-center gap-1 rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground disabled:opacity-40 transition-all hover:bg-secondary"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" /> Previous
                        </button>

                        <div className="flex items-center gap-1 px-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                            if (
                              pg === 1 ||
                              pg === totalPages ||
                              (pg >= currentPage - 1 && pg <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={pg}
                                  onClick={() => {
                                    setCurrentPage(pg);
                                    const el = document.getElementById("generator-workspace");
                                    if (el) el.scrollIntoView({ behavior: "smooth" });
                                  }}
                                  className={`h-8 w-8 rounded-xl text-xs font-bold transition-all ${
                                    currentPage === pg
                                      ? "bg-[#FF5A1F]"
                                      : "border border-border/60 bg-background text-muted-foreground hover:bg-secondary"
                                  }`}
                                >
                                  {pg}
                                </button>
                              );
                            } else if (
                              (pg === currentPage - 2 && pg > 1) ||
                              (pg === currentPage + 2 && pg < totalPages)
                            ) {
                              return (
                                <span key={pg} className="px-1 text-xs text-muted-foreground font-bold">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}
                        </div>

                        <button
                          onClick={() => {
                            setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                            const el = document.getElementById("generator-workspace");
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }}
                          disabled={currentPage === totalPages}
                          className="inline-flex items-center gap-1 rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground disabled:opacity-40 transition-all hover:bg-secondary"
                        >
                          Next <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Bottom Future Footer Ad Banner Placeholder ────────────────────── */}
        <AdPlaceholder type="footer-banner" className="mb-12" />

        {/* ── Agency Conversion CTA Footprint ─────────────────────────────────── */}
        <section className="relative overflow-hidden border-t border-border/60 bg-gradient-to-b from-secondary/40 via-background to-background py-12 sm:py-16 w-full max-w-full">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#FF5A1F]">
              <Zap className="h-3.5 w-3.5" /> Need Full Commercial Production?
            </span>
            <h2 className="mt-3 text-xl sm:text-3xl font-black tracking-tight text-foreground break-words">
              Want ContentMesh Studios to Turn Your Storyboard into a Finished Commercial Video?
            </h2>
            <p className="mt-2 text-xs sm:text-base leading-relaxed text-muted-foreground break-words">
              Our team handles full-stack AI production: scriptwriting, character design, 4K generative video renders, voiceover dubbing, and senior color grading.
            </p>

            <div className="mt-5 sm:mt-8 flex justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#FF5A1F] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-xl shadow-[#FF5A1F]/30 transition-transform duration-300 hover:scale-105"
              >
                Hire ContentMesh Studios <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
