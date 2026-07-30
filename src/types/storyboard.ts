export type VisualStyleOption =
  | "Pixar 3D"
  | "Disney Style"
  | "DreamWorks"
  | "Anime"
  | "Cinematic"
  | "Live Action"
  | "Photorealistic"
  | "Stylized Realism"
  | "Ghibli"
  | "Comic"
  | "Cyberpunk"
  | "Fantasy"
  | "Sci-Fi"
  | "Medieval"
  | "Horror"
  | "Custom";

export type PromptStyleOption =
  | "Google Flow"
  | "Veo"
  | "Midjourney"
  | "Flux"
  | "Leonardo"
  | "Stable Diffusion"
  | "General";

export type OutputLanguageOption =
  | "English"
  | "Urdu"
  | "Arabic"
  | "Spanish"
  | "French"
  | "German"
  | "Hindi";

export type AspectRatioOption = "16:9" | "9:16" | "1:1" | "4:5" | "21:9";

export type CameraStyleOption =
  | "Static"
  | "Cinematic"
  | "Handheld"
  | "Drone"
  | "Mixed";

export type PromptDetailOption = "Basic" | "Detailed" | "Ultra Detailed";

export interface StoryboardFormInput {
  script: string;
  numberOfScenes: number;
  visualStyle: VisualStyleOption;
  customStyle?: string;
  characterPrompts?: string;
  aiModel: string;
  promptStyle: PromptStyleOption;
  outputLanguage: OutputLanguageOption;
  aspectRatio: AspectRatioOption;
  cameraStyle: CameraStyleOption;
  promptDetail: PromptDetailOption;
  includeDialogue: boolean;
  includeSFX: boolean;
  includeBackgroundMusic: boolean;
  safetyNotes: boolean;
}

export interface StoryboardScene {
  sceneNumber: number;
  sceneTitle: string;
  duration: string;
  environment: string;
  visualStyle: string;
  characters: string[];
  camera: {
    angle: string;
    movement: string;
    lens: string;
  };
  lighting: string;
  mood: string;
  composition: string;
  actions: string;
  dialogue?: string;
  narration?: string;
  sfx?: string;
  backgroundMusic: string;
  negativePrompt?: string;
  generationPrompt: string;
  copyReadyPrompt: string;
}

export interface CharacterItem {
  name: string;
  appearance: string;
  description: string;
  sceneCount: number;
  characterPrompt: string;
}

export interface EnvironmentItem {
  location: string;
  imagePrompt: string;
  description: string;
  mood: string;
  lighting: string;
}

export interface StoryboardAnalytics {
  totalScenes: number;
  charactersCount: number;
  locationsCount: number;
  estimatedRuntime: string;
  wordCount: number;
  dialogueCount: number;
  promptCount: number;
}

export interface StoryboardOutput {
  schemaVersion: string;
  project: {
    title: string;
    visualStyle: string;
    aspectRatio: string;
    language: string;
  };
  summary: string;
  analytics: StoryboardAnalytics;
  characters: CharacterItem[];
  environments: EnvironmentItem[];
  timeline: Array<{
    sceneNumber: number;
    sceneTitle: string;
    duration: string;
    environment: string;
    characters: string[];
  }>;
  scenes: StoryboardScene[];
}
