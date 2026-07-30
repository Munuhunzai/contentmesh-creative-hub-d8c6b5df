import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Clapperboard,
  Layers,
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
  MessageSquare,
  Zap,
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

export function StoryboardGeneratorPage() {
  // Form State
  const [form, setForm] = useState<StoryboardFormInput>({
    script: DEFAULT_SCRIPT,
    numberOfScenes: 5,
    visualStyle: "Cyberpunk",
    customStyle: "",
    characterPrompts: "Maya: Rogue female engineer, dark braided hair, glowing cyber-visor, black tactical leather jacket.\nDr. Aris: Senior scientist, 50s, silver lab coat, sharp blue eyes.",
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
  const [expandedScenes, setExpandedScenes] = useState<Record<number, boolean>>({});

  // Local Storage Session Recovery
  useEffect(() => {
    try {
      const saved = localStorage.getItem("contentmesh_storyboard_output");
      if (saved) {
        setOutput(JSON.parse(saved));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleFormChange = (
    key: keyof StoryboardFormInput,
    value: any
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
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
      setOutput(data);
      localStorage.setItem("contentmesh_storyboard_output", JSON.stringify(data));

      // Expand all scenes by default
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
      const matchesSearch =
        scene.sceneTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scene.generationPrompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scene.environment.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === "dialogue") return Boolean(scene.dialogue);
      if (activeFilter === "sfx") return Boolean(scene.sfx);
      if (activeFilter === "characters") return (scene.characters?.length || 0) > 0;
      return true;
    });
  }, [output, searchQuery, activeFilter]);

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
      {/* ── Hero & Upfront Tool Header ───────────────────────────────────── */}
      <section className="relative overflow-hidden pt-8 sm:pt-12 pb-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5A1F] backdrop-blur-md">
            <Clapperboard className="h-3.5 w-3.5" /> AI Storyboard & Scene Prompt Studio
          </p>
          <h1 className="mt-3 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
            AI Storyboard & Prompt Generator
          </h1>
          <p className="mx-auto mt-2.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
            Turn any script into a complete AI production package: storyboards, 4K scene prompts, character actions, dialogue, camera directions, SFX, and generation-ready prompts.
          </p>
        </div>
      </section>

      {/* ── Main Workspace Container ──────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-28" id="generator-workspace">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* ── LEFT INPUT PANEL (35% on Desktop) ────────────────────────────── */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="rounded-[2.25rem] border border-border/80 bg-card p-6 sm:p-8 shadow-glass backdrop-blur-xl">
              <div className="flex items-center gap-2 border-b border-border/40 pb-4">
                <SlidersHorizontal className="h-5 w-5 text-[#FF5A1F]" />
                <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
                  Script & Production Config
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {/* Script Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Script / Screenplay
                    </label>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {form.script.length} chars
                    </span>
                  </div>
                  <textarea
                    rows={10}
                    value={form.script}
                    onChange={(e) => handleFormChange("script", e.target.value)}
                    placeholder="Paste your screenplay, ad script, or story outline here..."
                    className="w-full rounded-2xl border border-input bg-background/80 px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 leading-relaxed font-mono"
                    required
                  />
                </div>

                {/* Number of Scenes & Visual Style */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Scenes (1–200)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={form.numberOfScenes}
                      onChange={(e) =>
                        handleFormChange("numberOfScenes", parseInt(e.target.value) || 5)
                      }
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Visual Style
                    </label>
                    <select
                      value={form.visualStyle}
                      onChange={(e) => handleFormChange("visualStyle", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
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
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Custom Visual Style
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1980s Neon Synthwave 3D Render"
                      value={form.customStyle || ""}
                      onChange={(e) => handleFormChange("customStyle", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                    />
                  </div>
                )}

                {/* Character Prompts Reference */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                    Character Consistency Prompts
                  </label>
                  <textarea
                    rows={4}
                    value={form.characterPrompts || ""}
                    onChange={(e) => handleFormChange("characterPrompts", e.target.value)}
                    placeholder="Character Name: Prompt details..."
                    className="w-full rounded-2xl border border-input bg-background/80 px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 font-mono text-muted-foreground"
                  />
                </div>

                {/* AI Model & Prompt Style */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                      AI Engine
                    </label>
                    <select
                      value={form.aiModel}
                      onChange={(e) => handleFormChange("aiModel", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                    >
                      <option value="DeepSeek">DeepSeek V3 (Default)</option>
                      <option value="OpenAI">OpenAI GPT-4o (Modular)</option>
                      <option value="Claude">Claude 3.5 Sonnet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Target Generator
                    </label>
                    <select
                      value={form.promptStyle}
                      onChange={(e) => handleFormChange("promptStyle", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Aspect Ratio
                    </label>
                    <select
                      value={form.aspectRatio}
                      onChange={(e) => handleFormChange("aspectRatio", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                    >
                      {ASPECT_RATIOS.map((ar) => (
                        <option key={ar} value={ar}>
                          {ar}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Camera Motion
                    </label>
                    <select
                      value={form.cameraStyle}
                      onChange={(e) => handleFormChange("cameraStyle", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Output Language
                    </label>
                    <select
                      value={form.outputLanguage}
                      onChange={(e) => handleFormChange("outputLanguage", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                    >
                      {LANGUAGES.map((lg) => (
                        <option key={lg} value={lg}>
                          {lg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Prompt Detail
                    </label>
                    <select
                      value={form.promptDetail}
                      onChange={(e) => handleFormChange("promptDetail", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                    >
                      <option value="Basic">Basic</option>
                      <option value="Detailed">Detailed</option>
                      <option value="Ultra Detailed">Ultra Detailed</option>
                    </select>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-2.5 rounded-2xl border border-border/60 bg-secondary/20 p-4">
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
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FF5A1F] py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl shadow-[#FF5A1F]/30 transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
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
                  <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-semibold text-destructive">
                    {error}
                  </p>
                )}
              </form>
            </div>

            {/* ── Sticky Sidebar Ad Placeholder (300x600 Desktop) ─────────────── */}
            <AdPlaceholder type="sidebar-sticky" />
          </div>

          {/* ── RIGHT GENERATED RESULTS PANEL (65% Desktop) ──────────────────── */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {!output && !loading && (
              <div className="flex flex-col items-center justify-center rounded-[2.25rem] border border-dashed border-border/80 bg-card/60 p-12 text-center min-h-[500px]">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#FF5A1F]/10 text-[#FF5A1F]">
                  <Clapperboard className="h-8 w-8" />
                </div>
                <h3 className="mt-6 font-display text-xl font-bold text-foreground">
                  Ready to Generate Your Storyboard
                </h3>
                <p className="mt-2 max-w-md text-xs text-muted-foreground leading-relaxed">
                  Paste your script on the left, select your target AI generator (Google Flow, Midjourney, Flux, Veo), and click Generate Storyboard Package.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center rounded-[2.25rem] border border-border/80 bg-card/80 p-12 text-center min-h-[500px] shadow-glass backdrop-blur-xl">
                <RefreshCw className="h-10 w-10 text-[#FF5A1F] animate-spin" />
                <h3 className="mt-6 font-display text-lg font-bold text-foreground">
                  Analyzing Script & Building Storyboards...
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Structuring camera angles, lighting, 4K prompts, dialogue, and SFX into a unified production package.
                </p>
              </div>
            )}

            {output && !loading && (
              <div className="space-y-6">
                {/* ── Analytics Overview Header Bar ────────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  <div className="rounded-2xl border border-border/60 bg-card p-3.5 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Scenes</span>
                    <p className="font-display text-lg font-black text-[#FF5A1F]">{output.analytics?.totalScenes || output.scenes?.length || 0}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-card p-3.5 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Characters</span>
                    <p className="font-display text-lg font-black text-blue-500">{output.analytics?.charactersCount || output.characters?.length || 0}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-card p-3.5 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Locations</span>
                    <p className="font-display text-lg font-black text-emerald-500">{output.analytics?.locationsCount || output.environments?.length || 0}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-card p-3.5 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Runtime</span>
                    <p className="font-display text-lg font-black text-purple-500">{output.analytics?.estimatedRuntime || "1m 30s"}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-card p-3.5 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Words</span>
                    <p className="font-display text-lg font-black text-amber-500">{output.analytics?.wordCount || 0}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-card p-3.5 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Dialogues</span>
                    <p className="font-display text-lg font-black text-pink-500">{output.analytics?.dialogueCount || 0}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 rounded-2xl border border-border/60 bg-card p-3.5 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Packages</span>
                    <p className="font-display text-lg font-black text-[#FF5A1F]">{output.analytics?.promptCount || output.scenes?.length || 0}</p>
                  </div>
                </div>

                {/* ── Storyboard Horizontal Visual Timeline ───────────────────── */}
                {output.timeline && output.timeline.length > 0 && (
                  <div className="rounded-[2rem] border border-border/80 bg-card p-6 shadow-glass">
                    <h3 className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                      <Film className="h-4 w-4 text-[#FF5A1F]" /> Storyboard Timeline
                    </h3>
                    <div className="no-scrollbar flex items-center gap-3 overflow-x-auto pb-2">
                      {output.timeline.map((item) => (
                        <div
                          key={item.sceneNumber}
                          onClick={() => toggleExpand(item.sceneNumber)}
                          className="flex flex-col justify-between shrink-0 rounded-2xl border border-border/60 bg-secondary/30 p-3.5 cursor-pointer hover:border-[#FF5A1F]/60 hover:bg-secondary transition-all"
                          style={{ width: "160px" }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="rounded-md bg-[#FF5A1F]/10 px-2 py-0.5 text-[10px] font-bold text-[#FF5A1F]">
                              Scene {item.sceneNumber}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-semibold">{item.duration}</span>
                          </div>
                          <h4 className="mt-2 font-display text-xs font-bold text-foreground line-clamp-1">
                            {item.sceneTitle}
                          </h4>
                          <span className="mt-1 text-[10px] text-muted-foreground/80 line-clamp-1">
                            📍 {item.environment}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Top Export & Filter Action Toolbar ────────────────────────── */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-border/80 bg-card p-5 shadow-glass">
                  {/* Search Bar */}
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search scene prompts, dialogue, or locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background pl-9 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                    />
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { key: "all", label: "All Scenes" },
                      { key: "dialogue", label: "Dialogue" },
                      { key: "sfx", label: "SFX" },
                      { key: "characters", label: "Characters" },
                    ].map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setActiveFilter(f.key)}
                        className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${
                          activeFilter === f.key
                            ? "bg-[#FF5A1F] text-white shadow-md"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Export Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleCopy(
                          output.scenes.map((s) => getCombinedPackageText(s)).join("\n\n========================================\n\n"),
                          "all-packages"
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#FF5A1F]/40 bg-[#FF5A1F]/10 px-3 py-2 text-xs font-bold text-[#FF5A1F] hover:bg-[#FF5A1F] hover:text-white transition-colors"
                    >
                      {copiedKey === "all-packages" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      Copy All Packages
                    </button>

                    <button
                      onClick={() => exportFormatted("markdown")}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                    >
                      <FileText className="h-3.5 w-3.5" /> MD
                    </button>

                    <button
                      onClick={() => exportFormatted("json")}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                    >
                      <Download className="h-3.5 w-3.5" /> JSON
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                    >
                      <Printer className="h-3.5 w-3.5" /> Print
                    </button>
                  </div>
                </div>

                {/* ── Generated Scenes List (Unified Production Package Together) ─ */}
                <div className="space-y-5">
                  {filteredScenes.map((scene) => {
                    const isExpanded = expandedScenes[scene.sceneNumber] !== false;
                    const copyKey = `scene-pkg-${scene.sceneNumber}`;

                    return (
                      <motion.div
                        key={scene.sceneNumber}
                        layout
                        className="overflow-hidden rounded-[2rem] border border-border/80 bg-card p-6 shadow-glass backdrop-blur-xl transition-all hover:border-[#FF5A1F]/30"
                      >
                        {/* Scene Header Bar */}
                        <div
                          onClick={() => toggleExpand(scene.sceneNumber)}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF5A1F] text-xs font-bold text-white shadow-md">
                              {scene.sceneNumber}
                            </span>
                            <div>
                              <h3 className="font-display text-base font-bold text-foreground">
                                {scene.sceneTitle}
                              </h3>
                              <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                                <span>⏱ {scene.duration}</span>
                                <span>•</span>
                                <span>📍 {scene.environment}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="hidden sm:inline-block rounded-full bg-secondary px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              {scene.visualStyle}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
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
                              className="mt-6 border-t border-border/40 pt-5 space-y-4"
                            >
                              {/* Character Tags & Camera Motion */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="rounded-xl border border-border/60 bg-secondary/20 p-3">
                                  <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">Characters ({scene.characters?.length || 0})</span>
                                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    {scene.characters?.map((c, i) => (
                                      <span key={i} className="rounded-md bg-background px-2 py-0.5 text-[11px] font-semibold text-foreground border border-border/60">
                                        {c}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="rounded-xl border border-border/60 bg-secondary/20 p-3">
                                  <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">Camera & Lens</span>
                                  <p className="mt-1 text-muted-foreground">
                                    {scene.camera?.angle} • {scene.camera?.movement} ({scene.camera?.lens})
                                  </p>
                                </div>
                              </div>

                              {/* ── UNIFIED PRODUCTION PACKAGE: Prompt, Dialogue & SFX Together ── */}
                              <div className="rounded-2xl border border-[#FF5A1F]/30 bg-background p-5 space-y-4 shadow-sm">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
                                  <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F] flex items-center gap-1.5">
                                    <Sparkles className="h-4 w-4" /> AI Production Package ({form.promptStyle})
                                  </span>
                                  <button
                                    onClick={() => handleCopy(getCombinedPackageText(scene), copyKey)}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF5A1F] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#e04c15] transition-transform active:scale-95"
                                  >
                                    {copiedKey === copyKey ? (
                                      <Check className="h-4 w-4" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                    Copy Scene Package
                                  </button>
                                </div>

                                {/* Visual Prompt */}
                                <div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                                    🎬 Visual AI Prompt
                                  </span>
                                  <p className="text-xs font-mono text-foreground leading-relaxed selection:bg-[#FF5A1F]/30">
                                    {scene.copyReadyPrompt || scene.generationPrompt}
                                  </p>
                                </div>

                                {/* Dialogue Line */}
                                {scene.dialogue && (
                                  <div className="border-t border-border/30 pt-3">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5A1F] block mb-1 flex items-center gap-1">
                                      <MessageSquare className="h-3 w-3" /> Character Dialogue
                                    </span>
                                    <p className="text-xs font-mono italic text-foreground bg-[#FF5A1F]/5 p-2.5 rounded-xl border border-[#FF5A1F]/20">
                                      "{scene.dialogue}"
                                    </p>
                                  </div>
                                )}

                                {/* Sound Effects (SFX) */}
                                {scene.sfx && (
                                  <div className="border-t border-border/30 pt-3">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1 flex items-center gap-1">
                                      <Volume2 className="h-3 w-3" /> Sound Effects (SFX)
                                    </span>
                                    <p className="text-xs font-mono text-muted-foreground bg-secondary/30 p-2.5 rounded-xl border border-border/40">
                                      🔊 {scene.sfx}
                                    </p>
                                  </div>
                                )}

                                {/* Negative Prompt */}
                                {scene.negativePrompt && (
                                  <div className="border-t border-border/30 pt-2 text-[10px] font-mono text-muted-foreground">
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

                {/* ── Character Library Panel ─────────────────────────────────── */}
                {output.characters && output.characters.length > 0 && (
                  <div className="rounded-[2.25rem] border border-border/80 bg-card p-6 sm:p-8 shadow-glass">
                    <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-[#FF5A1F]" /> Character Library ({output.characters.length})
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {output.characters.map((char, i) => (
                        <div key={i} className="rounded-2xl border border-border/60 bg-secondary/20 p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-display font-bold text-foreground">{char.name}</h4>
                            <span className="rounded-full bg-background px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                              {char.sceneCount} Scenes
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{char.appearance}</p>
                          <div className="pt-2">
                            <button
                              onClick={() => handleCopy(char.characterPrompt, `char-${i}`)}
                              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#FF5A1F] hover:underline"
                            >
                              {copiedKey === `char-${i}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              Copy Consistency Prompt
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Environment Library Panel ───────────────────────────────── */}
                {output.environments && output.environments.length > 0 && (
                  <div className="rounded-[2.25rem] border border-border/80 bg-card p-6 sm:p-8 shadow-glass">
                    <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-emerald-500" /> Environment Library ({output.environments.length})
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {output.environments.map((env, i) => (
                        <div key={i} className="rounded-2xl border border-border/60 bg-secondary/20 p-4 space-y-2">
                          <h4 className="font-display font-bold text-foreground">{env.location}</h4>
                          <p className="text-xs text-muted-foreground">{env.description}</p>
                          <div className="pt-2">
                            <button
                              onClick={() => handleCopy(env.imagePrompt, `env-${i}`)}
                              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-500 hover:underline"
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
      <AdPlaceholder type="footer-banner" className="mb-16" />

      {/* ── Agency Conversion CTA Footprint ─────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-border/60 bg-gradient-to-b from-secondary/40 via-background to-background py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5A1F]">
            <Zap className="h-3.5 w-3.5" /> Need Full Commercial Production?
          </span>
          <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Want ContentMesh Studios to Turn Your Storyboard into a Finished Commercial Video?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Our team handles full-stack AI production: scriptwriting, character design, 4K generative video renders, voiceover dubbing, and senior color grading.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#FF5A1F] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-2xl shadow-[#FF5A1F]/40 transition-transform duration-300 hover:scale-105"
            >
              Hire ContentMesh Studios <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
