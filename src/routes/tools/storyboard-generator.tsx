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
  Loader2,
  History,
  Clock,
  ExternalLink,
  Send,
  Sliders,
  Layers,
  Bot,
  Terminal,
  Paperclip,
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
          "AI Storyboard & Scene Prompt Studio | Make AI",
      },
      {
        name: "description",
        content:
          "Turn any script into a complete AI production package: storyboards, 4K scene prompts, character actions, camera directions, SFX, and image prompts for Midjourney, Flux, Veo, and Google Flow.",
      },
      {
        property: "og:title",
        content: "AI Storyboard & Scene Prompt Studio | Make AI",
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
          name: "Make AI Storyboard & Prompt Studio",
          url: "https://contentmesh.ai/tools/storyboard-generator",
          description:
            "Free AI tool to generate complete storyboards, scene prompts, character actions, and camera direction from scripts.",
          applicationCategory: "MultimediaApplication",
          operatingSystem: "All",
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

export interface SavedStoryItem {
  id: string;
  title: string;
  timestamp: string;
  script: string;
  visualStyle: string;
  sceneCount: number;
  output: StoryboardOutput;
}

const cleanPromptText = (text: string) => {
  if (!text) return "";
  return text
    .replace(/,\s*\([^)]*(change|redo|try again|again|rewrite)[^)]*\)/gi, "")
    .replace(/\(\s*(change|redo|try again|again|rewrite)[^)]*\)/gi, "")
    .replace(/,\s*,/g, ",")
    .replace(/\s+/g, " ")
    .trim();
};

export function StoryboardGeneratorPage() {
  const [step, setStep] = useState<"script" | "config" | "studio">("script");

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<StoryboardOutput | null>(null);
  const [storyHistory, setStoryHistory] = useState<SavedStoryItem[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [assistantInput, setAssistantInput] = useState("");
  const [assistantLogs, setAssistantLogs] = useState<Array<{ sender: "user" | "ai"; text: string }>>([]);
  const [assistantLoading, setAssistantLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const timelineScrollRef = useRef<HTMLDivElement>(null);
  const rightCanvasRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      const savedOutput = localStorage.getItem("contentmesh_storyboard_output");
      if (savedOutput) {
        const parsed = JSON.parse(savedOutput);
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

      const savedHistory = localStorage.getItem("contentmesh_story_history");
      if (savedHistory) {
        const parsedHist = JSON.parse(savedHistory);
        if (Array.isArray(parsedHist)) {
          setStoryHistory(parsedHist);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]);

  const handleFormChange = (
    key: keyof StoryboardFormInput,
    value: any
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleStartNewStory = () => {
    setForm((prev) => ({ ...prev, script: "" }));
    setOutput(null);
    setStep("script");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenHistoryStory = (item: SavedStoryItem) => {
    setForm((prev) => ({
      ...prev,
      script: item.script,
      visualStyle: item.visualStyle as VisualStyleOption,
      numberOfScenes: item.sceneCount,
    }));
    setOutput(item.output);
    setStep("studio");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteHistoryStory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = storyHistory.filter((item) => item.id !== id);
    setStoryHistory(updated);
    localStorage.setItem("contentmesh_story_history", JSON.stringify(updated));
  };

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

  const getSceneFormattedPrompt = (scene: StoryboardScene) => {
    const promptText = cleanPromptText(scene.copyReadyPrompt || scene.generationPrompt);
    return `Scene ${scene.sceneNumber} [${promptText}]`;
  };

  const handleProceedToConfig = () => {
    if (!form.script || form.script.trim().length < 10) {
      setError("Please paste a story or script with at least 10 characters.");
      return;
    }
    setError(null);
    setStep("config");
  };

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

      const newHistoryItem: SavedStoryItem = {
        id: `story-${Date.now()}`,
        title: data.project?.title || form.script.slice(0, 30) + "...",
        timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        script: form.script,
        visualStyle: form.visualStyle,
        sceneCount: data.scenes?.length || form.numberOfScenes,
        output: data,
      };

      const updatedHistory = [newHistoryItem, ...storyHistory.filter((item) => item.script !== form.script)].slice(0, 15);
      setStoryHistory(updatedHistory);
      localStorage.setItem("contentmesh_story_history", JSON.stringify(updatedHistory));
    } catch (err: any) {
      setError(err.message || "An error occurred during generation.");
      setStep("config");
    } finally {
      setLoading(false);
    }
  };

  /* ── FULLY FUNCTIONAL AI PROMPT ASSISTANT HANDLER ── */
  const handleAssistantSubmit = (query: string) => {
    if (!query || !query.trim() || !output) return;
    const userMsg = query.trim();
    setAssistantLogs((prev) => [...prev, { sender: "user", text: userMsg }]);
    setAssistantInput("");
    setAssistantLoading(true);

    setTimeout(() => {
      const qLower = userMsg.toLowerCase();
      let actionDesc = "";
      let newScenes = [...output.scenes];
      let newFormScript = form.script;

      const numMatch = qLower.match(/\b(\d+)\b/);
      const isSceneCountChange =
        /\b(scene|scenes|count|increase|decrease|add|reduce|make|set)\b/i.test(qLower) && numMatch;

      const isScriptChange =
        /change script|rewrite story|new story|script about|story about|change topic|make a script/i.test(qLower);

      const matchedStyle = VISUAL_STYLES.find((st) =>
        qLower.includes(st.toLowerCase())
      );

      const isStyleChange =
        /style|visual|look|aesthetic|render|theme/i.test(qLower) || Boolean(matchedStyle);

      if (isSceneCountChange && numMatch) {
        let targetCount = parseInt(numMatch[1], 10);
        if (qLower.includes("add") || qLower.includes("increase by")) {
          targetCount = newScenes.length + targetCount;
        } else if (qLower.includes("reduce by") || qLower.includes("decrease by")) {
          targetCount = Math.max(1, newScenes.length - targetCount);
        }

        targetCount = Math.min(Math.max(1, targetCount), 50);

        if (targetCount > newScenes.length) {
          const currentLen = newScenes.length;
          const CAMERA_VARIATIONS = [
            "35mm anamorphic lens, slow push-in tracking shot, cinematic lighting",
            "wide-angle establishing shot, golden hour illumination, rich textures",
            "low-angle dynamic perspective, dramatic rim lighting, high contrast",
            "over-the-shoulder medium shot, shallow depth of field",
          ];

          for (let i = currentLen; i < targetCount; i++) {
            const scNum = i + 1;
            const camVar = CAMERA_VARIATIONS[i % CAMERA_VARIATIONS.length];
            const basePrompt = cleanPromptText(
              newScenes[currentLen - 1]?.generationPrompt || "Cinematic scene action"
            );
            const promptText = `Scene ${scNum} [${basePrompt}, continuation sequence ${scNum}, ${camVar}]`;

            newScenes.push({
              sceneNumber: scNum,
              sceneTitle: `Scene ${scNum}`,
              duration: "6s",
              environment: newScenes[currentLen - 1]?.environment || "Studio Setting",
              characters: newScenes[currentLen - 1]?.characters || [],
              dialogue: `Dialogue line for scene ${scNum}`,
              sfx: "Ambient atmosphere",
              cameraDirection: camVar,
              generationPrompt: promptText,
              copyReadyPrompt: promptText,
            });
          }
          actionDesc = `Increased scene count from ${currentLen} to ${targetCount} scenes`;
        } else if (targetCount < newScenes.length) {
          const currentLen = newScenes.length;
          newScenes = newScenes.slice(0, targetCount);
          actionDesc = `Decreased scene count from ${currentLen} to ${targetCount} scenes`;
        }

        setForm((prev) => ({ ...prev, numberOfScenes: targetCount }));
      } else if (isStyleChange) {
        const newStyle = matchedStyle || userMsg.replace(/change visual style (to)?|change style (to)?|make style|set style (to)?|use style|style/gi, "").trim();

        if (newStyle) {
          const validStyle = VISUAL_STYLES.find((st) => st.toLowerCase() === newStyle.toLowerCase()) || (newStyle.charAt(0).toUpperCase() + newStyle.slice(1)) as VisualStyleOption;
          setForm((prev) => ({ ...prev, visualStyle: validStyle }));

          if (output.project) {
            output.project.visualStyle = validStyle;
          }

          newScenes = newScenes.map((scene) => {
            let promptText = cleanPromptText(scene.generationPrompt || scene.copyReadyPrompt);
            promptText = `${promptText}, ${validStyle} style, 4K render quality`;
            promptText = cleanPromptText(promptText);
            return {
              ...scene,
              generationPrompt: promptText,
              copyReadyPrompt: promptText,
            };
          });

          actionDesc = `Updated visual style to "${validStyle}" across all scenes`;
        }
      } else if (isScriptChange) {
        const topic = userMsg
          .replace(/change script (to|about)?|rewrite story (about)?|script about|story about|make a script (about)?/gi, "")
          .trim();

        if (topic) {
          newFormScript = `Title: ${topic.toUpperCase()}\n\nStory about ${topic}`;
          setForm((prev) => ({ ...prev, script: newFormScript }));

          newScenes = newScenes.map((scene) => {
            const promptText = `Scene ${scene.sceneNumber} [${form.visualStyle} style, ${topic}, cinematic 4K resolution, 16:9, dramatic lighting, high detail]`;
            return {
              ...scene,
              sceneTitle: `Scene ${scene.sceneNumber}: ${topic.slice(0, 20)}`,
              generationPrompt: promptText,
              copyReadyPrompt: promptText,
            };
          });
          actionDesc = `Rewrote screenplay topic to "${topic}" and updated scene prompts`;
        }
      } else {
        const CAMERA_VARIATIONS = [
          "35mm anamorphic lens, cinematic lighting, slow tracking shot",
          "wide-angle establishing view, golden hour sunlight, detailed texture",
          "low-angle dynamic perspective, high-contrast atmospheric grade",
          "over-the-shoulder shot, shallow depth of field, soft rim lighting",
        ];

        const isRegenReq = /change|redo|again|regenerate|rewrite|try again|fresh|variation/i.test(qLower);

        newScenes = newScenes.map((scene, idx) => {
          let promptText = cleanPromptText(scene.generationPrompt || scene.copyReadyPrompt);

          if (isRegenReq) {
            const varAngle = CAMERA_VARIATIONS[idx % CAMERA_VARIATIONS.length];
            promptText = `${promptText}, ${varAngle}`;
            actionDesc = "Generated fresh scene variations with dynamic camera angles & lighting";
          } else if (qLower.includes("dramatic") || qLower.includes("intense")) {
            promptText = `${promptText}, intense dramatic lighting, high contrast cinematic grade`;
            actionDesc = "Applied intense dramatic lighting to all scenes";
          } else if (qLower.includes("push in") || qLower.includes("zoom") || qLower.includes("camera")) {
            promptText = `${promptText}, 35mm anamorphic camera lens, slow push-in tracking shot`;
            actionDesc = "Added 35mm camera motion and tracking to scenes";
          } else if (qLower.includes("pixar") || qLower.includes("3d")) {
            promptText = `${promptText}, Pixar 3D animated render, vibrant warm colors`;
            actionDesc = "Updated style to Pixar 3D animation";
          } else if (qLower.includes("anime") || qLower.includes("ghibli")) {
            promptText = `${promptText}, hand-drawn anime aesthetic, Studio Ghibli style, vibrant colors`;
            actionDesc = "Updated style to Anime & Ghibli aesthetic";
          } else if (qLower.includes("rain") || qLower.includes("storm") || qLower.includes("wet")) {
            promptText = `${promptText}, heavy rain pouring down, wet reflective ground, water droplets`;
            actionDesc = "Added heavy rain and wet reflections to scenes";
          } else if (qLower.includes("night") || qLower.includes("dark")) {
            promptText = `${promptText}, atmospheric night time lighting, deep shadows, neon glows`;
            actionDesc = "Adjusted lighting to atmospheric night scene";
          } else if (qLower.includes("cyberpunk") || qLower.includes("neon")) {
            promptText = `${promptText}, glowing neon lights, futuristic cyberpunk city backdrop`;
            actionDesc = "Injected cyberpunk neon aesthetics into scenes";
          } else {
            promptText = `${promptText}, ${userMsg}`;
            actionDesc = `Applied "${userMsg}" to all scenes`;
          }

          promptText = cleanPromptText(promptText);

          return {
            ...scene,
            generationPrompt: promptText,
            copyReadyPrompt: promptText,
          };
        });
      }

      const newTimeline = newScenes.map((s) => ({
        sceneNumber: s.sceneNumber,
        sceneTitle: s.sceneTitle || `Scene ${s.sceneNumber}`,
        duration: s.duration || "5s",
        environment: s.environment || "Location",
        characters: s.characters || [],
      }));

      const newOutput = {
        ...output,
        scenes: newScenes,
        timeline: newTimeline,
      };

      setOutput(newOutput);
      localStorage.setItem("contentmesh_storyboard_output", JSON.stringify(newOutput));

      const updatedHistory = storyHistory.map((item) =>
        item.script === form.script
          ? {
              ...item,
              script: newFormScript,
              sceneCount: newScenes.length,
              output: newOutput,
            }
          : item
      );
      setStoryHistory(updatedHistory);
      localStorage.setItem("contentmesh_story_history", JSON.stringify(updatedHistory));

      setAssistantLogs((prev) => [
        ...prev,
        { sender: "ai", text: `✨ ${actionDesc}` },
      ]);
      setAssistantLoading(false);
    }, 450);
  };

  const filteredScenes = useMemo(() => {
    if (!output?.scenes) return [];
    return output.scenes.filter((scene) => {
      const q = searchQuery.toLowerCase().trim();
      const promptStr = cleanPromptText(scene.copyReadyPrompt || scene.generationPrompt);
      const matchesSearch =
        !q ||
        scene.sceneTitle.toLowerCase().includes(q) ||
        promptStr.toLowerCase().includes(q) ||
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

  const totalPages = Math.ceil(filteredScenes.length / SCENES_PER_PAGE);
  const paginatedScenes = useMemo(() => {
    const start = (currentPage - 1) * SCENES_PER_PAGE;
    return filteredScenes.slice(start, start + SCENES_PER_PAGE);
  }, [filteredScenes, currentPage]);

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
    <SiteLayout noTopPadding>
      {/* ── CLEAN MODERN LIGHT THEME ─────────────────────────────────────── */}
      <div className="font-['Inter'] font-sans text-slate-900 antialiased bg-slate-50 min-h-screen w-full max-w-full selection:bg-slate-200 selection:text-slate-900">
        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ── STEP 1: LIGHT MODE PROMPT SCREEN ───────────────────────────── */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {step === "script" && (
          <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-2 sm:pt-4 pb-12 w-full max-w-full space-y-8">
            {/* Hero Title */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs text-slate-600 font-sans shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-slate-700" /> Powered by Generative Scene Intelligence
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                What do you want to create today?
              </h1>
              <p className="mx-auto max-w-lg text-xs sm:text-sm text-slate-600 leading-relaxed">
                Transform screenplays, story ideas, or commercial concepts into production-ready 4K AI storyboards and prompts.
              </p>
            </div>

            {/* LIGHT MODE FLOATING INPUT BAR */}
            <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xl shadow-slate-200/50 space-y-3 transition-all focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-200">
              <textarea
                rows={5}
                value={form.script}
                onChange={(e) => handleFormChange("script", e.target.value)}
                placeholder="Describe your scene concept or paste a screenplay here..."
                className="w-full rounded-2xl border-none bg-transparent px-2 py-1 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none leading-relaxed font-sans whitespace-pre-wrap min-h-[140px] resize-none"
              />

              {/* Bottom Control Strip inside Input Box */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
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
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Paperclip className="h-3.5 w-3.5 text-slate-500" />
                    {form.uploadedCharacters?.length ? `${form.uploadedCharacters.length} Files` : "Attach Media"}
                  </button>

                  <select
                    value={form.visualStyle}
                    onChange={(e) => handleFormChange("visualStyle", e.target.value)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-sans text-slate-700 outline-none hover:bg-slate-100 transition-colors"
                  >
                    {VISUAL_STYLES.map((st) => (
                      <option key={st} value={st} className="bg-white text-slate-900">
                        {st} Style
                      </option>
                    ))}
                  </select>

                  <span className="text-[10px] font-sans text-slate-500 hidden sm:inline">
                    {form.script.length} chars
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToConfig}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-black transition-all shadow-md active:scale-95"
                >
                  Configure Story <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-600">
                  {error}
                </p>
              )}
            </div>

            {/* ── USER'S RECENT STORY HISTORY SECTION ────────────────────────── */}
            {storyHistory.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-sans uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <History className="h-4 w-4 text-slate-500" /> Recent Story Workspaces ({storyHistory.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {storyHistory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleOpenHistoryStory(item)}
                      className="group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 hover:shadow-md transition-all cursor-pointer space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-sans text-slate-700 border border-slate-200">
                            {item.visualStyle} • {item.sceneCount} Scenes
                          </span>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteHistoryStory(item.id, e)}
                            className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                            title="Delete from History"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-slate-900 transition-colors line-clamp-1">
                          {item.title}
                        </h4>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-sans">
                          {item.script}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-500 font-sans">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" /> {item.timestamp}
                        </span>
                        <span className="font-semibold text-slate-800 group-hover:text-slate-950 flex items-center gap-0.5">
                          Open <ExternalLink className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Example Scripts Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-sans uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-slate-500" /> Start from example templates
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {EXAMPLE_SCRIPTS.map((ex) => (
                  <div
                    key={ex.id}
                    onClick={() => {
                      handleFormChange("script", ex.script);
                      window.scrollTo({ top: 150, behavior: "smooth" });
                    }}
                    className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 hover:shadow-md transition-all cursor-pointer space-y-2"
                  >
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-sans text-slate-600 border border-slate-200">
                      {ex.category}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-800 group-hover:text-slate-950 transition-colors">
                      {ex.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {ex.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ── STEP 2: LIGHT MODE CONFIGURATION PAGE ────────────────────────── */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {step === "config" && (
          <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-2 sm:pt-4 pb-12 w-full max-w-full space-y-6">
            {/* Active Script Summary Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-sans uppercase text-slate-500">
                  Selected Screenplay
                </span>
                <p className="font-sans text-xs text-slate-800 line-clamp-1 max-w-xl">
                  {form.script}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartNewStory}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-black transition-all"
                >
                  <PlusCircle className="h-3.5 w-3.5" /> New Story
                </button>
                <button
                  onClick={() => setStep("script")}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 shrink-0"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Edit Script
                </button>
              </div>
            </div>

            {/* DEDICATED PRODUCTION CONFIG CARD */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Production Settings & Visual Targets
                  </h2>
                  <p className="text-xs text-slate-600">
                    Configure visual rendering target, scene density, aspect ratio, and camera direction.
                  </p>
                </div>
                <Sliders className="h-5 w-5 text-slate-500" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Character Upload Zone */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-sans uppercase text-slate-700 flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-slate-500" /> Character Reference Images
                    </label>
                    <span className="text-xs font-sans text-slate-500">
                      {form.uploadedCharacters?.length || 0} Files Attached
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
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white p-3 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors"
                  >
                    <Upload className="h-4 w-4 text-slate-500" /> Upload Character Models (PNG/JPG)
                  </button>

                  {form.uploadedCharacters && form.uploadedCharacters.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {form.uploadedCharacters.map((char) => (
                        <div
                          key={char.id}
                          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2"
                        >
                          {char.imageUrl ? (
                            <img
                              src={char.imageUrl}
                              alt={char.name}
                              className="h-10 w-10 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
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
                            className="flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-sans text-slate-900 outline-none focus:ring-1 focus:ring-slate-400"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveUploadedCharacter(char.id)}
                            className="p-1 text-slate-400 hover:text-red-600 shrink-0"
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
                    <label className="block text-xs font-sans uppercase text-slate-600 mb-1.5">
                      Target Scene Count
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={form.numberOfScenes}
                      onChange={(e) =>
                        handleFormChange("numberOfScenes", parseInt(e.target.value) || 10)
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-sans text-slate-900 outline-none focus:ring-1 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans uppercase text-slate-600 mb-1.5">
                      Visual Render Style
                    </label>
                    <select
                      value={form.visualStyle}
                      onChange={(e) => handleFormChange("visualStyle", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-sans text-slate-900 outline-none focus:ring-1 focus:ring-slate-400"
                    >
                      {VISUAL_STYLES.map((st) => (
                        <option key={st} value={st} className="bg-white">
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-sans uppercase text-slate-600 mb-1.5">
                      AI Model Target
                    </label>
                    <select
                      value={form.promptStyle}
                      onChange={(e) => handleFormChange("promptStyle", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-sans text-slate-900 outline-none focus:ring-1 focus:ring-slate-400"
                    >
                      {PROMPT_STYLES.map((ps) => (
                        <option key={ps} value={ps} className="bg-white">
                          {ps}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-sans uppercase text-slate-600 mb-1.5">
                      Aspect Ratio
                    </label>
                    <select
                      value={form.aspectRatio}
                      onChange={(e) => handleFormChange("aspectRatio", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-sans text-slate-900 outline-none focus:ring-1 focus:ring-slate-400"
                    >
                      {ASPECT_RATIOS.map((ar) => (
                        <option key={ar} value={ar} className="bg-white">
                          {ar}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-sans uppercase text-slate-600 mb-1.5">
                      Camera Motion
                    </label>
                    <select
                      value={form.cameraStyle}
                      onChange={(e) => handleFormChange("cameraStyle", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-sans text-slate-900 outline-none focus:ring-1 focus:ring-slate-400"
                    >
                      {CAMERA_STYLES.map((cs) => (
                        <option key={cs} value={cs} className="bg-white">
                          {cs}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Toggles Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
                  <label className="flex items-center gap-2 text-xs font-sans text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.includeDialogue}
                      onChange={(e) => handleFormChange("includeDialogue", e.target.checked)}
                      className="h-4 w-4 rounded bg-white border-slate-300 accent-slate-900"
                    />
                    <MessageSquare className="h-3.5 w-3.5 text-slate-500" /> Dialogue
                  </label>

                  <label className="flex items-center gap-2 text-xs font-sans text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.includeSFX}
                      onChange={(e) => handleFormChange("includeSFX", e.target.checked)}
                      className="h-4 w-4 rounded bg-white border-slate-300 accent-slate-900"
                    />
                    <Volume2 className="h-3.5 w-3.5 text-slate-500" /> SFX
                  </label>

                  <label className="flex items-center gap-2 text-xs font-sans text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.includeBackgroundMusic}
                      onChange={(e) => handleFormChange("includeBackgroundMusic", e.target.checked)}
                      className="h-4 w-4 rounded bg-white border-slate-300 accent-slate-900"
                    />
                    <Music className="h-3.5 w-3.5 text-slate-500" /> Music
                  </label>

                  <label className="flex items-center gap-2 text-xs font-sans text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.safetyNotes}
                      onChange={(e) => handleFormChange("safetyNotes", e.target.checked)}
                      className="h-4 w-4 rounded bg-white border-slate-300 accent-slate-900"
                    />
                    <Shield className="h-3.5 w-3.5 text-slate-500" /> Safety
                  </label>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-xs font-semibold text-white shadow-lg hover:bg-black transition-all disabled:opacity-60 active:scale-95"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" /> Generating Scenes...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Generate Storyboard Package ✦
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ── STEP 3: FULL-SCREEN STUDIO WITH AI ASSISTANT ON BOTTOM LEFT ───── */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {step === "studio" && (
          <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden w-full max-w-full bg-slate-50 relative">
            {/* PINNED TOP HEADER WITH ONLY TWO BUTTONS */}
            <header className="shrink-0 border-b border-slate-200 bg-white px-4 sm:px-6 py-2.5 w-full flex items-center justify-end gap-2.5 z-30 shadow-sm">
              <button
                onClick={handleStartNewStory}
                className="flex items-center gap-1.5 rounded-full bg-slate-900 text-white px-4 py-1.5 text-xs font-semibold hover:bg-black transition-all shadow-sm"
              >
                <PlusCircle className="h-3.5 w-3.5" /> + New Story
              </button>

              <button
                onClick={() => setStep("config")}
                className="flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 px-4 py-1.5 text-xs font-medium hover:bg-slate-200 transition-all"
              >
                <Sliders className="h-3.5 w-3.5" /> Config
              </button>
            </header>

            {/* DUAL-PANEL FULL-HEIGHT CONTAINER */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden w-full max-w-7xl mx-auto px-3 sm:px-6 py-3 gap-5">
              {/* FIXED TALL LEFT SIDEBAR (AI PROMPT ASSISTANT PANEL TOUCHING TOP HEADER LINE) */}
              <aside className="w-full lg:w-[320px] xl:w-[360px] shrink-0 h-full overflow-hidden flex flex-col">
                {/* ── AI ASSISTANT CHAT DOCK (FULL HEIGHT - TOUCHING TOP HEADER LINE) ── */}
                <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 shadow-xl space-y-3 flex-1 flex flex-col overflow-hidden h-full">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 shrink-0">
                    <span className="text-[11px] font-sans uppercase font-bold text-slate-800 tracking-wider flex items-center gap-1.5">
                      <Bot className="h-4 w-4 text-slate-700" /> AI Prompt Assistant
                    </span>
                    <span className="text-[9px] text-emerald-600 font-sans flex items-center gap-1 font-semibold">
                      {assistantLoading && <Loader2 className="h-3 w-3 animate-spin text-slate-700" />} Ready
                    </span>
                  </div>

                  {/* Assistant Chat Logs — EXPANDS to fill full vertical height */}
                  <div className="flex-1 overflow-y-auto no-scrollbar pr-1 text-xs space-y-2">
                    {assistantLogs.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 space-y-2">
                        <Bot className="h-8 w-8 text-slate-300" />
                        <p className="text-xs font-semibold text-slate-600">AI Prompt Assistant</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed max-w-[220px]">
                          Ask me to change visual style, add/remove scenes, adjust lighting, or rewrite script topics.
                        </p>
                      </div>
                    ) : (
                      assistantLogs.map((log, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl text-[11px] font-sans leading-relaxed ${
                            log.sender === "user"
                              ? "bg-slate-900 text-white ml-4 text-right font-medium"
                              : "bg-slate-100 text-slate-800 border border-slate-200 mr-4"
                          }`}
                        >
                          {log.text}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Quick Action Chips */}
                  <div className="flex flex-wrap gap-1 shrink-0 pt-1">
                    {[
                      "Change style to Pixar 3D",
                      "Change style to Anime",
                      "Increase scenes to 12",
                      "Decrease scenes to 5",
                    ].map((chip, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAssistantSubmit(chip)}
                        disabled={assistantLoading}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-sans text-slate-700 border border-slate-200 hover:bg-slate-200 hover:text-slate-950 transition-all disabled:opacity-50"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>

                  {/* ChatGPT Input Bar */}
                  <div className="space-y-2 shrink-0 pt-1">
                    <textarea
                      rows={2}
                      value={assistantInput}
                      onChange={(e) => setAssistantInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAssistantSubmit(assistantInput);
                        }
                      }}
                      placeholder="Ask AI to change visual style (e.g. Pixar 3D, Anime), rewrite script, or adjust scene count..."
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:ring-1 focus:ring-slate-400 leading-relaxed font-sans break-words whitespace-pre-wrap resize-none"
                    />

                    <button
                      type="button"
                      onClick={() => handleAssistantSubmit(assistantInput)}
                      disabled={assistantLoading || !assistantInput.trim()}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white shadow hover:bg-black active:scale-95 transition-all disabled:opacity-50"
                    >
                      {assistantLoading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> Modifying Story...
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" /> Apply Change to Story
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </aside>

              {/* ── SCROLLABLE RIGHT CANVAS ── */}
              <main ref={rightCanvasRef} className="flex-1 h-full overflow-y-auto pr-1.5 no-scrollbar space-y-4 min-w-0">
                {loading || !output ? (
                  /* ── FULL SCENE CANVAS LOADING SCREEN ── */
                  <div className="flex flex-col items-center justify-center min-h-[480px] h-full space-y-6 text-center p-6 bg-white rounded-3xl border border-slate-200 shadow-sm my-auto">
                    <div className="relative flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
                      <Sparkles className="h-6 w-6 text-slate-800 absolute animate-pulse" />
                    </div>

                    <div className="space-y-2 max-w-sm">
                      <h3 className="text-base font-bold text-slate-900">Generating Storyboard Package</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">
                        Creating 4K scene prompts, camera movements, character direction, and lighting specifications...
                      </p>
                    </div>

                    {/* Shimmering Skeleton Cards Preview */}
                    <div className="w-full space-y-3 pt-2 max-w-lg">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2.5 animate-pulse text-left">
                          <div className="flex items-center justify-between">
                            <div className="h-4 w-20 bg-slate-200 rounded-md" />
                            <div className="h-4 w-16 bg-slate-200 rounded-md" />
                          </div>
                          <div className="h-3 w-full bg-slate-200 rounded-md" />
                          <div className="h-3 w-3/4 bg-slate-200 rounded-md" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 w-full pb-12">
                    {/* Assistant Modifying Scenes Indicator */}
                    {assistantLoading && (
                      <div className="rounded-2xl border border-slate-900 bg-slate-900 text-white p-3.5 shadow-lg flex items-center justify-between gap-3 animate-pulse">
                        <div className="flex items-center gap-2 text-xs font-semibold">
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                          <span>AI Assistant is updating story scenes & visual style...</span>
                        </div>
                        <span className="text-[10px] font-sans bg-white/20 px-2 py-0.5 rounded-full text-white">Generating</span>
                      </div>
                    )}

                    {/* Summary Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-full">
                      <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-center shadow-sm">
                        <span className="text-[9px] font-sans uppercase text-slate-500 block">Total Scenes</span>
                        <p className="font-sans text-base font-bold text-slate-900">{output.scenes?.length || 0}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-center shadow-sm">
                        <span className="text-[9px] font-sans uppercase text-slate-500 block">Characters</span>
                        <p className="font-sans text-base font-bold text-slate-900">{output.characters?.length || 0}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-center shadow-sm">
                        <span className="text-[9px] font-sans uppercase text-slate-500 block">Environments</span>
                        <p className="font-sans text-base font-bold text-slate-900">{output.environments?.length || 0}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-center shadow-sm">
                        <span className="text-[9px] font-sans uppercase text-slate-500 block">Est. Runtime</span>
                        <p className="font-sans text-base font-bold text-slate-900">{output.analytics?.estimatedRuntime || "1m 30s"}</p>
                      </div>
                    </div>

                    {/* Storyboard Timeline Scrubber Bar */}
                    {output.timeline && output.timeline.length > 0 && (
                      <div className="rounded-2xl border border-slate-200 bg-white p-3 max-w-full overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-[11px] font-sans uppercase text-slate-600 flex items-center gap-1.5 font-semibold">
                            <Film className="h-3.5 w-3.5 text-slate-700" /> Timeline Scrubber ({output.timeline.length} Scenes)
                          </h3>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => scrollTimeline("left")}
                              className="p-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                              title="Scroll Left"
                            >
                              <ChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => scrollTimeline("right")}
                              className="p-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
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
                              className="flex flex-col justify-between shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-2 cursor-pointer hover:border-slate-300 hover:bg-slate-100 transition-all"
                              style={{ width: "125px" }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-sans font-semibold text-slate-800">
                                  Sc {item.sceneNumber}
                                </span>
                                <span className="text-[9px] text-slate-500 font-sans">{item.duration}</span>
                              </div>
                              <h4 className="mt-1 text-[11px] font-semibold text-slate-900 line-clamp-1">
                                {item.sceneTitle}
                              </h4>
                              <span className="mt-0.5 text-[9px] text-slate-500 line-clamp-1 font-sans">
                                📍 {item.environment}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 rounded-2xl border border-slate-200 bg-white p-3 max-w-full shadow-sm">
                      <div className="relative w-full sm:flex-1 sm:min-w-[160px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search prompts..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:ring-1 focus:ring-slate-400 font-sans"
                        />
                      </div>

                      {output.scenes && output.scenes.length > 0 && (
                        <div className="relative flex items-center gap-1">
                          <Compass className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <select
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (val) scrollToScene(val);
                            }}
                            defaultValue=""
                            className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-sans text-slate-700 outline-none focus:ring-1 focus:ring-slate-400"
                          >
                            <option value="" disabled className="bg-white">
                              Jump to Scene...
                            </option>
                            {output.scenes.map((s) => (
                              <option key={s.sceneNumber} value={s.sceneNumber} className="bg-white">
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
                          className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-900 bg-slate-900 px-3 py-1.5 text-[11px] font-sans font-semibold text-white hover:bg-black transition-colors shadow-sm"
                          title="Copy all scene prompts in 'Scene N [prompt]' format"
                        >
                          {copiedKey === "all-packages" ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          Copy All Prompts
                        </button>

                        <button
                          onClick={() => exportFormatted("markdown")}
                          className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-sans text-slate-700 hover:bg-slate-100"
                        >
                          <FileText className="h-3 w-3" /> MD
                        </button>

                        <button
                          onClick={() => exportFormatted("json")}
                          className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-sans text-slate-700 hover:bg-slate-100"
                        >
                          <Download className="h-3 w-3" /> JSON
                        </button>
                      </div>
                    </div>

                    {/* ── GENERATED SCENE CARDS (Scene N [prompt]) ── */}
                    <div className="space-y-3 max-w-full">
                      {paginatedScenes.map((scene) => {
                        const copyKey = `scene-pkg-${scene.sceneNumber}`;

                        return (
                          <motion.div
                            key={scene.sceneNumber}
                            id={`scene-card-${scene.sceneNumber}`}
                            layout
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow max-w-full space-y-2.5"
                          >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-[10px] font-sans font-bold text-slate-800 border border-slate-200">
                                  {scene.sceneNumber}
                                </span>
                                <span className="text-xs font-sans font-semibold text-slate-800">
                                  Scene {scene.sceneNumber}
                                </span>
                              </div>

                              <button
                                onClick={() => handleCopy(getSceneFormattedPrompt(scene), copyKey)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-sans text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-all"
                              >
                                {copiedKey === copyKey ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                                Copy Scene
                              </button>
                            </div>

                            {/* ONLY SCENE NUMBER AND SCENE PROMPT (Scene N [prompt]) */}
                            <p className="text-xs sm:text-sm font-sans text-slate-900 leading-relaxed break-words whitespace-pre-wrap bg-slate-50 p-3 rounded-xl border border-slate-200 selection:bg-slate-200 selection:text-slate-900">
                              {getSceneFormattedPrompt(scene)}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* ── PAGINATION CONTROLS BAR (10 Scenes per Page) ────────────── */}
                    {totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 max-w-full shadow-sm">
                        <span className="text-xs font-sans text-slate-600 text-center sm:text-left">
                          Showing {(currentPage - 1) * SCENES_PER_PAGE + 1}–{Math.min(currentPage * SCENES_PER_PAGE, filteredScenes.length)} of {filteredScenes.length} scenes (Page {currentPage} of {totalPages})
                        </span>

                        <div className="flex flex-wrap items-center justify-center gap-1 max-w-full">
                          <button
                            onClick={() => {
                              setCurrentPage((prev) => Math.max(1, prev - 1));
                              if (rightCanvasRef.current) {
                                rightCanvasRef.current.scrollTo({ top: 0, behavior: "smooth" });
                              }
                            }}
                            disabled={currentPage === 1}
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-sans text-slate-700 disabled:opacity-40 transition-all hover:bg-slate-100"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" /> Prev
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
                                      if (rightCanvasRef.current) {
                                        rightCanvasRef.current.scrollTo({ top: 0, behavior: "smooth" });
                                      }
                                    }}
                                    className={`h-7 w-7 rounded-lg text-xs font-sans transition-all ${
                                      currentPage === pg
                                        ? "bg-slate-900 text-white font-bold"
                                        : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
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
                                  <span key={pg} className="px-1 text-xs text-slate-400 font-sans">
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
                              if (rightCanvasRef.current) {
                                rightCanvasRef.current.scrollTo({ top: 0, behavior: "smooth" });
                              }
                            }}
                            disabled={currentPage === totalPages}
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-sans text-slate-700 disabled:opacity-40 transition-all hover:bg-slate-100"
                          >
                            Next <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </main>
            </div>
          </div>
        )}

        {/* ── Bottom Footer Ad Placeholder ────────────────────────────────────── */}
        {step !== "studio" && <AdPlaceholder type="footer-banner" className="mb-12" />}

        {/* ── Sleek Modern Footer Footprint ───────────────────────────────────── */}
        {step !== "studio" && (
          <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 w-full max-w-full">
            <div className="mx-auto max-w-4xl text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 text-slate-600" />
                <span className="font-sans text-xs text-slate-600">Make AI Storyboard Engine</span>
              </div>
              <p className="text-xs text-slate-500 max-w-xl mx-auto font-sans">
                Designed for directors, filmmakers, animators, and prompt engineers creating multi-scene AI video productions.
              </p>
            </div>
          </footer>
        )}
      </div>
    </SiteLayout>
  );
}
