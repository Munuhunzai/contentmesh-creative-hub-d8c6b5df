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
  Printer,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Film,
  Users,
  MapPin,
  Volume2,
  Music,
  Shield,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Zap,
  Upload,
  Trash2,
  Image as ImageIcon,
  Compass,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { AdPlaceholder } from "@/components/tools/AdPlaceholder";
import {
  StoryboardFormInput,
  StoryboardOutput,
  VisualStyleOption,
  PromptStyleOption,
  OutputLanguageOption,
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

const LANGUAGES: OutputLanguageOption[] = [
  "English",
  "Urdu",
  "Arabic",
  "Spanish",
  "French",
  "German",
  "Hindi",
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
  // Form State
  const [form, setForm] = useState<StoryboardFormInput>({
    script: DEFAULT_SCRIPT,
    numberOfScenes: 10,
    visualStyle: "Cyberpunk",
    customStyle: "",
    characterPrompts: "Maya: Rogue female engineer, dark braided hair, glowing cyber-visor, black tactical leather jacket.\nDr. Aris: Senior scientist, 50s, silver lab coat, sharp blue eyes.",
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
  const [expandedScenes, setExpandedScenes] = useState<Record<number, boolean>>({});

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

    // Calculate target page for sceneNumber
    if (output?.scenes) {
      const sceneIndex = output.scenes.findIndex((s) => s.sceneNumber === sceneNumber);
      if (sceneIndex !== -1) {
        const targetPage = Math.floor(sceneIndex / SCENES_PER_PAGE) + 1;
        setCurrentPage(targetPage);
      }
    }

    setExpandedScenes((prev) => ({ ...prev, [sceneNumber]: true }));

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

  const getCombinedPackageText = (scene: StoryboardScene) => {
    let pkg = `[SCENE ${scene.sceneNumber}: ${scene.sceneTitle}]\n🎬 VISUAL PROMPT:\n${scene.copyReadyPrompt || scene.generationPrompt}`;
    if (scene.dialogue) {
      pkg += `\n\n💬 DIALOGUE:\n"${scene.dialogue}"`;
    }
    if (scene.sfx) {
      pkg += `\n\n🔊 SOUND EFFECTS (SFX):\n${scene.sfx}`;
    }
    if (scene.negativePrompt) {
      pkg += `\n\n🛑 NEGATIVE PROMPT:\n${scene.negativePrompt}`;
    }
    return pkg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.script || form.script.trim().length < 10) {
      setError("Please paste a script with at least 10 characters.");
      return;
    }

    setError(null);
    setLoading(true);

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

      const initialExpanded: Record<number, boolean> = {};
      data.scenes?.forEach((s) => (initialExpanded[s.sceneNumber] = true));
      setExpandedScenes(initialExpanded);
    } catch (err: any) {
      setError(err.message || "An error occurred during generation.");
    } finally {
      setLoading(false);
    }
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
      content = `# ${output.project.title}\n\n**Visual Style:** ${output.project.visualStyle} | **Aspect Ratio:** ${output.project.aspectRatio}\n\n## Summary\n${output.summary}\n\n## Scenes\n`;
      output.scenes.forEach((s) => {
        content += `\n### Scene ${s.sceneNumber}: ${s.sceneTitle} (${s.duration})\n- **Environment:** ${s.environment}\n- **Characters:** ${s.characters.join(", ")}\n- **Camera:** ${s.camera.angle}, ${s.camera.movement}\n- **Prompt Package:**\n\`\`\`\n${getCombinedPackageText(s)}\n\`\`\`\n`;
      });
      mimeType = "text/markdown";
    } else {
      content = `${output.project.title}\n======================\n${output.summary}\n\nSCENE PACKAGES:\n`;
      output.scenes.forEach((s) => {
        content += `\n${getCombinedPackageText(s)}\n----------------------------------------\n`;
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

  const toggleExpand = (scNo: number) => {
    setExpandedScenes((prev) => ({ ...prev, [scNo]: !prev[scNo] }));
  };

  return (
    <SiteLayout>
      {/* ── Mobile-Optimized Hero & Header ───────────────────────────────── */}
      <section className="relative overflow-hidden pt-4 sm:pt-8 pb-4 px-4 sm:px-6 w-full max-w-full">
        <div className="mx-auto max-w-7xl text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#FF5A1F] backdrop-blur-md">
            <Clapperboard className="h-3.5 w-3.5" /> AI Storyboard & Scene Prompt Studio
          </p>
          <h1 className="mt-2.5 font-display text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground break-words">
            AI Storyboard & Prompt Generator
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-muted-foreground break-words">
            Turn any script into a complete AI production package: storyboards, 4K scene prompts, character actions, dialogue, camera directions, SFX, and generation-ready prompts.
          </p>
        </div>
      </section>

      {/* ── Main Workspace Container ──────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 pb-20 w-full max-w-full overflow-hidden" id="generator-workspace">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-12 w-full max-w-full">
          {/* ── LEFT INPUT PANEL (35% Desktop / 100% Mobile Stack) ───────────── */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-5 min-w-0 max-w-full">
            <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-3.5 sm:p-7 shadow-glass backdrop-blur-xl max-w-full overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <SlidersHorizontal className="h-4 w-4 text-[#FF5A1F] shrink-0" />
                <h2 className="font-display text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
                  Script & Production Config
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-w-full">
                {/* Script Textarea */}
                <div className="max-w-full">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                      Script / Screenplay
                    </label>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {form.script.length} chars
                    </span>
                  </div>
                  <textarea
                    rows={7}
                    value={form.script}
                    onChange={(e) => handleFormChange("script", e.target.value)}
                    placeholder="Paste your screenplay, ad script, or story outline here..."
                    className="w-full max-w-full rounded-xl sm:rounded-2xl border border-input bg-background/80 px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 leading-relaxed font-mono break-words whitespace-pre-wrap"
                    required
                  />
                </div>

                {/* ── CHARACTER IMAGE UPLOAD & PROMPTS SECTION ──────────────── */}
                <div className="rounded-xl border border-border/70 bg-secondary/20 p-3 space-y-3 max-w-full">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5 text-[#FF5A1F]" /> Character Reference Images
                    </label>
                    <span className="text-[10px] font-bold text-[#FF5A1F]">
                      {form.uploadedCharacters?.length || 0} Uploaded
                    </span>
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileUpload}
                    accept="image/png, image/jpeg, image/webp"
                    multiple
                    className="hidden"
                  />

                  {/* Upload Drop Zone Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#FF5A1F]/50 bg-[#FF5A1F]/5 p-3 text-xs font-bold text-[#FF5A1F] hover:bg-[#FF5A1F]/10 transition-colors"
                  >
                    <Upload className="h-4 w-4" /> Upload Character Images (PNG/JPG)
                  </button>

                  {/* Uploaded Characters Preview List */}
                  {form.uploadedCharacters && form.uploadedCharacters.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      {form.uploadedCharacters.map((char) => (
                        <div
                          key={char.id}
                          className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background p-2 max-w-full"
                        >
                          {char.imageUrl ? (
                            <img
                              src={char.imageUrl}
                              alt={char.name}
                              className="h-12 w-12 rounded-lg object-cover border border-border/40 shrink-0"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
                              <Users className="h-5 w-5" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0 space-y-1">
                            <input
                              type="text"
                              value={char.name}
                              placeholder="Character Name"
                              onChange={(e) =>
                                handleUpdateUploadedCharacter(char.id, "name", e.target.value)
                              }
                              className="w-full rounded-md border border-input bg-background px-2 py-0.5 text-xs font-bold text-foreground outline-none focus:ring-1 focus:ring-[#FF5A1F]"
                            />
                            <input
                              type="text"
                              value={char.prompt}
                              placeholder="Visual prompt details..."
                              onChange={(e) =>
                                handleUpdateUploadedCharacter(char.id, "prompt", e.target.value)
                              }
                              className="w-full rounded-md border border-input bg-background px-2 py-0.5 text-[10px] text-muted-foreground outline-none focus:ring-1 focus:ring-[#FF5A1F]"
                            />
                          </div>

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

                  {/* Text Character Prompts Area */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Additional Text Character Prompts
                    </label>
                    <textarea
                      rows={2}
                      value={form.characterPrompts || ""}
                      onChange={(e) => handleFormChange("characterPrompts", e.target.value)}
                      placeholder="Character Name: Prompt details..."
                      className="w-full max-w-full rounded-xl border border-input bg-background/80 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 font-mono text-muted-foreground break-words"
                    />
                  </div>
                </div>

                {/* Number of Scenes & Visual Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-full">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1">
                      Scenes (1–200)
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
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1">
                      Visual Style
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
                </div>

                {/* Custom Style Input */}
                {form.visualStyle === "Custom" && (
                  <div className="max-w-full">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1">
                      Custom Visual Style
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1980s Neon Synthwave 3D Render"
                      value={form.customStyle || ""}
                      onChange={(e) => handleFormChange("customStyle", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                    />
                  </div>
                )}

                {/* AI Model & Prompt Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-full">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1">
                      AI Engine
                    </label>
                    <select
                      value={form.aiModel}
                      onChange={(e) => handleFormChange("aiModel", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                    >
                      <option value="DeepSeek">DeepSeek V3 (Default)</option>
                      <option value="OpenAI">OpenAI GPT-4o</option>
                      <option value="Claude">Claude 3.5 Sonnet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1">
                      Target Generator
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
                </div>

                {/* Aspect Ratio & Camera Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-full">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1">
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
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1">
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

                {/* Language & Detail Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-full">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1">
                      Output Language
                    </label>
                    <select
                      value={form.outputLanguage}
                      onChange={(e) => handleFormChange("outputLanguage", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                    >
                      {LANGUAGES.map((lg) => (
                        <option key={lg} value={lg}>
                          {lg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1">
                      Prompt Detail
                    </label>
                    <select
                      value={form.promptDetail}
                      onChange={(e) => handleFormChange("promptDetail", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                    >
                      <option value="Basic">Basic</option>
                      <option value="Detailed">Detailed</option>
                      <option value="Ultra Detailed">Ultra Detailed</option>
                    </select>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-2 rounded-xl border border-border/60 bg-secondary/20 p-3 max-w-full">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <MessageSquare className="h-3.5 w-3.5 text-[#FF5A1F]" /> Include Dialogue
                    </span>
                    <input
                      type="checkbox"
                      checked={form.includeDialogue}
                      onChange={(e) => handleFormChange("includeDialogue", e.target.checked)}
                      className="h-4 w-4 rounded accent-[#FF5A1F]"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <Volume2 className="h-3.5 w-3.5 text-[#FF5A1F]" /> Include SFX
                    </span>
                    <input
                      type="checkbox"
                      checked={form.includeSFX}
                      onChange={(e) => handleFormChange("includeSFX", e.target.checked)}
                      className="h-4 w-4 rounded accent-[#FF5A1F]"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <Music className="h-3.5 w-3.5 text-[#FF5A1F]" /> Include Music
                    </span>
                    <input
                      type="checkbox"
                      checked={form.includeBackgroundMusic}
                      onChange={(e) => handleFormChange("includeBackgroundMusic", e.target.checked)}
                      className="h-4 w-4 rounded accent-[#FF5A1F]"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <Shield className="h-3.5 w-3.5 text-[#FF5A1F]" /> Safety Negative Prompts
                    </span>
                    <input
                      type="checkbox"
                      checked={form.safetyNotes}
                      onChange={(e) => handleFormChange("safetyNotes", e.target.checked)}
                      className="h-4 w-4 rounded accent-[#FF5A1F]"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FF5A1F] py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl shadow-[#FF5A1F]/30 transition-transform duration-300 active:scale-95 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Generating Package...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Generate Storyboard Package
                    </>
                  )}
                </button>

                {error && (
                  <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-semibold text-destructive break-words">
                    {error}
                  </p>
                )}
              </form>
            </div>

            {/* ── Sticky Sidebar Ad Placeholder (Desktop Only) ───────────────── */}
            <AdPlaceholder type="sidebar-sticky" />
          </div>

          {/* ── RIGHT GENERATED RESULTS PANEL ─────────────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-6 min-w-0 max-w-full">
            {!output && !loading && (
              <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-dashed border-border/80 bg-card/60 p-6 sm:p-12 text-center min-h-[300px] sm:min-h-[450px] max-w-full">
                <div className="grid h-12 w-12 sm:h-16 sm:w-16 place-items-center rounded-2xl bg-[#FF5A1F]/10 text-[#FF5A1F]">
                  <Clapperboard className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h3 className="mt-4 font-display text-base sm:text-xl font-bold text-foreground">
                  Ready to Generate Your Storyboard
                </h3>
                <p className="mt-1.5 max-w-md text-xs text-muted-foreground leading-relaxed break-words">
                  Paste your script, upload character reference images, select your target AI generator, and click Generate Storyboard Package.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-border/80 bg-card/80 p-6 sm:p-12 text-center min-h-[300px] sm:min-h-[450px] shadow-glass backdrop-blur-xl max-w-full">
                <RefreshCw className="h-8 w-8 text-[#FF5A1F] animate-spin" />
                <h3 className="mt-4 font-display text-base sm:text-lg font-bold text-foreground">
                  Analyzing Script & Building Storyboards...
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground break-words">
                  Structuring camera angles, lighting, 4K prompts, dialogue, and uploaded character references into a unified package.
                </p>
              </div>
            )}

            {output && !loading && (
              <div className="space-y-4 sm:space-y-6 min-w-0 max-w-full">
                {/* ── Analytics Overview Header Bar ──────────────────────────── */}
                <div className="flex flex-wrap gap-2 sm:grid sm:grid-cols-4 lg:grid-cols-7 max-w-full">
                  {[
                    { label: "Scenes", val: output.scenes?.length || 0, color: "text-[#FF5A1F]" },
                    { label: "Chars", val: output.analytics?.charactersCount || output.characters?.length || 0, color: "text-blue-500" },
                    { label: "Locs", val: output.analytics?.locationsCount || output.environments?.length || 0, color: "text-emerald-500" },
                    { label: "Runtime", val: output.analytics?.estimatedRuntime || "1m 30s", color: "text-purple-500" },
                    { label: "Words", val: output.analytics?.wordCount || 0, color: "text-amber-500" },
                    { label: "Dialogues", val: output.analytics?.dialogueCount || 0, color: "text-pink-500" },
                    { label: "Packages", val: output.scenes?.length || 0, color: "text-[#FF5A1F]" },
                  ].map((m, i) => (
                    <div key={i} className="flex-1 min-w-[70px] sm:min-w-0 rounded-xl border border-border/60 bg-card p-2 text-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">{m.label}</span>
                      <p className={`font-display text-sm sm:text-base font-black ${m.color}`}>{m.val}</p>
                    </div>
                  ))}
                </div>

                {/* ── Storyboard Horizontal Visual Timeline ───────────────────── */}
                {output.timeline && output.timeline.length > 0 && (
                  <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-3.5 sm:p-6 shadow-glass max-w-full overflow-hidden">
                    <div className="flex items-center justify-between mb-2.5">
                      <h3 className="font-display text-[11px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                        <Film className="h-3.5 w-3.5 text-[#FF5A1F]" /> Storyboard Timeline ({output.timeline.length} Scenes)
                      </h3>
                      
                      {/* Timeline Navigation Arrow Controls */}
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
                      className="no-scrollbar flex items-center gap-2.5 overflow-x-auto pb-1 max-w-full scroll-smooth"
                    >
                      {output.timeline.map((item) => (
                        <div
                          key={item.sceneNumber}
                          onClick={() => scrollToScene(item.sceneNumber)}
                          className="flex flex-col justify-between shrink-0 rounded-xl border border-border/60 bg-secondary/30 p-2.5 cursor-pointer hover:border-[#FF5A1F] hover:bg-secondary transition-all"
                          style={{ width: "135px" }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="rounded-md bg-[#FF5A1F]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#FF5A1F]">
                              Sc {item.sceneNumber}
                            </span>
                            <span className="text-[9px] text-muted-foreground font-semibold">{item.duration}</span>
                          </div>
                          <h4 className="mt-1 font-display text-[11px] font-bold text-foreground line-clamp-1">
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

                {/* ── Top Export, Filter & Quick Jumper Action Toolbar ───────── */}
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-2.5 rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-3.5 sm:p-5 shadow-glass max-w-full">
                  {/* Search Bar */}
                  <div className="relative w-full sm:flex-1 sm:min-w-[160px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search prompts, scene #, or locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background pl-8 pr-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                    />
                  </div>

                  {/* Scene Jumper Dropdown */}
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

                  {/* Category Filter Pills */}
                  <div className="no-scrollbar flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 max-w-full">
                    {[
                      { key: "all", label: "All" },
                      { key: "dialogue", label: "Dialogue" },
                      { key: "sfx", label: "SFX" },
                      { key: "characters", label: "Chars" },
                    ].map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setActiveFilter(f.key)}
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold transition-all ${
                          activeFilter === f.key
                            ? "bg-[#FF5A1F] text-white shadow-md"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Export Buttons */}
                  <div className="grid grid-cols-3 sm:flex items-center gap-1.5 max-w-full">
                    <button
                      onClick={() =>
                        handleCopy(
                          output.scenes.map((s) => getCombinedPackageText(s)).join("\n\n========================================\n\n"),
                          "all-packages"
                        )
                      }
                      className="col-span-3 sm:col-span-1 inline-flex items-center justify-center gap-1 rounded-xl border border-[#FF5A1F]/40 bg-[#FF5A1F]/10 px-2.5 py-1.5 text-[11px] font-bold text-[#FF5A1F]"
                    >
                      {copiedKey === "all-packages" ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      Copy All
                    </button>

                    <button
                      onClick={() => exportFormatted("markdown")}
                      className="inline-flex items-center justify-center gap-1 rounded-xl border border-border/80 bg-background px-2 py-1.5 text-[11px] font-semibold text-foreground"
                    >
                      <FileText className="h-3 w-3" /> MD
                    </button>

                    <button
                      onClick={() => exportFormatted("json")}
                      className="inline-flex items-center justify-center gap-1 rounded-xl border border-border/80 bg-background px-2 py-1.5 text-[11px] font-semibold text-foreground"
                    >
                      <Download className="h-3 w-3" /> JSON
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center justify-center gap-1 rounded-xl border border-border/80 bg-background px-2 py-1.5 text-[11px] font-semibold text-foreground"
                    >
                      <Printer className="h-3 w-3" /> Print
                    </button>
                  </div>
                </div>

                {/* ── Generated Scenes List (Paginated: 10 scenes per page) ── */}
                <div className="space-y-4 max-w-full">
                  {paginatedScenes.map((scene) => {
                    const isExpanded = expandedScenes[scene.sceneNumber] !== false;
                    const copyKey = `scene-pkg-${scene.sceneNumber}`;

                    return (
                      <motion.div
                        key={scene.sceneNumber}
                        id={`scene-card-${scene.sceneNumber}`}
                        layout
                        className="overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-3.5 sm:p-5 shadow-glass backdrop-blur-xl transition-all hover:border-[#FF5A1F]/30 max-w-full"
                      >
                        {/* Scene Header Bar */}
                        <div
                          onClick={() => toggleExpand(scene.sceneNumber)}
                          className="flex items-start sm:items-center justify-between gap-2 cursor-pointer max-w-full"
                        >
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <span className="flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-[#FF5A1F] text-[11px] sm:text-xs font-bold text-white shadow-md">
                              {scene.sceneNumber}
                            </span>
                            <div className="min-w-0">
                              <h3 className="font-display text-xs sm:text-base font-bold text-foreground truncate">
                                {scene.sceneTitle}
                              </h3>
                              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                                <span className="shrink-0">⏱ {scene.duration}</span>
                                <span>•</span>
                                <span className="truncate">📍 {scene.environment}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <span className="hidden sm:inline-block rounded-full bg-secondary px-2 py-0.5 text-[9px] font-bold text-muted-foreground uppercase">
                              {scene.visualStyle}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>

                        {/* Collapsible Content */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 sm:mt-5 border-t border-border/40 pt-3 space-y-3 max-w-full overflow-hidden"
                            >
                              {/* Character Tags & Camera Motion */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs max-w-full">
                                <div className="rounded-xl border border-border/60 bg-secondary/20 p-2.5 max-w-full">
                                  <span className="font-bold text-foreground uppercase tracking-wider text-[9px]">Characters ({scene.characters?.length || 0})</span>
                                  <div className="flex flex-wrap gap-1 mt-1 max-w-full">
                                    {scene.characters?.map((c, i) => (
                                      <span key={i} className="rounded-md bg-background px-1.5 py-0.5 text-[10px] font-semibold text-foreground border border-border/60 break-words">
                                        {c}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="rounded-xl border border-border/60 bg-secondary/20 p-2.5 max-w-full">
                                  <span className="font-bold text-foreground uppercase tracking-wider text-[9px]">Camera & Lens</span>
                                  <p className="mt-0.5 text-[10px] sm:text-[11px] text-muted-foreground break-words">
                                    {scene.camera?.angle} • {scene.camera?.movement} ({scene.camera?.lens})
                                  </p>
                                </div>
                              </div>

                              {/* ── UNIFIED PRODUCTION PACKAGE ── */}
                              <div className="rounded-xl border border-[#FF5A1F]/30 bg-background p-3 sm:p-4 space-y-3 shadow-sm max-w-full overflow-hidden">
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-b border-border/40 pb-2 max-w-full">
                                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#FF5A1F] flex items-center gap-1">
                                    <Sparkles className="h-3.5 w-3.5 shrink-0" /> AI Package ({form.promptStyle})
                                  </span>
                                  <button
                                    onClick={() => handleCopy(getCombinedPackageText(scene), copyKey)}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1 rounded-lg bg-[#FF5A1F] px-3 py-1.5 text-[11px] font-bold text-white shadow-md active:scale-95"
                                  >
                                    {copiedKey === copyKey ? (
                                      <Check className="h-3.5 w-3.5" />
                                    ) : (
                                      <Copy className="h-3.5 w-3.5" />
                                    )}
                                    Copy Scene Package
                                  </button>
                                </div>

                                {/* Visual Prompt */}
                                <div className="max-w-full">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                                    🎬 Visual AI Prompt
                                  </span>
                                  <p className="text-[11px] sm:text-xs font-mono text-foreground leading-relaxed break-words whitespace-pre-wrap selection:bg-[#FF5A1F]/30">
                                    {scene.copyReadyPrompt || scene.generationPrompt}
                                  </p>
                                </div>

                                {/* Dialogue Line */}
                                {scene.dialogue && (
                                  <div className="border-t border-border/30 pt-2 max-w-full">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#FF5A1F] block mb-1 flex items-center gap-1">
                                      <MessageSquare className="h-3 w-3 shrink-0" /> Character Dialogue
                                    </span>
                                    <p className="text-[11px] font-mono italic text-foreground bg-[#FF5A1F]/5 p-2 rounded-lg border border-[#FF5A1F]/20 break-words whitespace-pre-wrap">
                                      "{scene.dialogue}"
                                    </p>
                                  </div>
                                )}

                                {/* Sound Effects (SFX) */}
                                {scene.sfx && (
                                  <div className="border-t border-border/30 pt-2 max-w-full">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1 flex items-center gap-1">
                                      <Volume2 className="h-3 w-3 shrink-0" /> Sound Effects (SFX)
                                    </span>
                                    <p className="text-[11px] font-mono text-muted-foreground bg-secondary/30 p-2 rounded-lg border border-border/40 break-words whitespace-pre-wrap">
                                      🔊 {scene.sfx}
                                    </p>
                                  </div>
                                )}

                                {/* Negative Prompt */}
                                {scene.negativePrompt && (
                                  <div className="border-t border-border/30 pt-1.5 text-[9px] font-mono text-muted-foreground break-words">
                                    <strong>Negative Prompt:</strong> {scene.negativePrompt}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
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
                                    ? "bg-[#FF5A1F] text-white shadow-md"
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

                {/* ── Character Library Panel ─────────────────────────────────── */}
                {output.characters && output.characters.length > 0 && (
                  <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-3.5 sm:p-6 shadow-glass max-w-full">
                    <h3 className="font-display text-sm sm:text-lg font-bold text-foreground mb-2.5 flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-[#FF5A1F]" /> Character Library ({output.characters.length})
                    </h3>
                    <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 max-w-full">
                      {output.characters.map((char, i) => (
                        <div key={i} className="flex gap-3 rounded-xl border border-border/60 bg-secondary/20 p-3 max-w-full">
                          {char.imageUrl ? (
                            <img
                              src={char.imageUrl}
                              alt={char.name}
                              className="h-16 w-16 rounded-xl object-cover border border-border/40 shrink-0 shadow-sm"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-xl bg-background border border-border/40 flex items-center justify-center text-muted-foreground shrink-0">
                              <Users className="h-6 w-6" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-display font-bold text-xs text-foreground truncate">{char.name}</h4>
                              <span className="rounded-full bg-background px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground shrink-0">
                                {char.sceneCount} Scenes
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground break-words line-clamp-2">{char.appearance}</p>
                            <div className="pt-0.5">
                              <button
                                onClick={() => handleCopy(char.characterPrompt, `char-${i}`)}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FF5A1F] hover:underline"
                              >
                                {copiedKey === `char-${i}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                Copy Prompt
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Environment Library Panel ───────────────────────────────── */}
                {output.environments && output.environments.length > 0 && (
                  <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-3.5 sm:p-6 shadow-glass max-w-full">
                    <h3 className="font-display text-sm sm:text-lg font-bold text-foreground mb-2.5 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-emerald-500" /> Environment Library ({output.environments.length})
                    </h3>
                    <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 max-w-full">
                      {output.environments.map((env, i) => (
                        <div key={i} className="rounded-xl border border-border/60 bg-secondary/20 p-3 space-y-1 max-w-full">
                          <h4 className="font-display font-bold text-xs text-foreground truncate">{env.location}</h4>
                          <p className="text-[11px] text-muted-foreground break-words">{env.description}</p>
                          <div className="pt-1">
                            <button
                              onClick={() => handleCopy(env.imagePrompt, `env-${i}`)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 hover:underline"
                            >
                              {copiedKey === `env-${i}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              Copy Background Prompt
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Bottom Future Footer Ad Banner Placeholder ────────────────────── */}
      <AdPlaceholder type="footer-banner" className="mb-12" />

      {/* ── Agency Conversion CTA Footprint ─────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-border/60 bg-gradient-to-b from-secondary/40 via-background to-background py-12 sm:py-16 w-full max-w-full">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#FF5A1F]">
            <Zap className="h-3.5 w-3.5" /> Need Full Commercial Production?
          </span>
          <h2 className="mt-3 font-display text-xl sm:text-3xl font-black tracking-tight text-foreground break-words">
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
    </SiteLayout>
  );
}
