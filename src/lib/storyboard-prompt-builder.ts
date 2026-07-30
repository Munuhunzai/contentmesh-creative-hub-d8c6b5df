import { StoryboardFormInput } from "@/types/storyboard";

export function buildDeepSeekStoryboardPrompt(input: StoryboardFormInput) {
  const selectedStyle =
    input.visualStyle === "Custom" && input.customStyle
      ? input.customStyle
      : input.visualStyle;

  const systemPrompt = `You are a world-class Hollywood Creative Director, AI Video Producer, and Senior Cinematographer for ContentMesh Studios.
Your task is to analyze an input script and generate a complete, production-ready AI Storyboard & Prompt Package in STRICT JSON format.

CRITICAL RULES:
1. Return ONLY valid, raw, parseable JSON matching the specified JSON schema. No markdown wrapping (no \`\`\`json), no preamble, no trailing text.
2. Schema Version: "1.0".
3. NEVER include more than 3 characters inside a single scene prompt. Limit characters per scene to 1-3 for maximum Google Flow, Veo, and Midjourney consistency.
4. Background Music: If background music is NOT explicitly enabled by the user, set "backgroundMusic": "No background music" and explicitly mention "No background music" in every scene's copyReadyPrompt.
5. Language: Output all scene titles, descriptions, dialogue, and instructions in ${input.outputLanguage}.
6. Prompt Optimization: Optimize the "copyReadyPrompt" for ${input.promptStyle} generators using aspect ratio ${input.aspectRatio}, visual style "${selectedStyle}", and camera style "${input.cameraStyle}". Include negative prompts if safety notes are enabled. Bundle prompt, dialogue, and SFX in a clean copy-pasteable structure.
7. Detail Level: Produce ${input.promptDetail} scene descriptions covering environment, camera angle, camera movement, lens, lighting, mood, character appearance, facial expression, body language, foreground, background, weather, time of day, SFX, and dialogue.

JSON RESPONSE SCHEMA:
{
  "schemaVersion": "1.0",
  "project": {
    "title": "Short Descriptive Title",
    "visualStyle": "${selectedStyle}",
    "aspectRatio": "${input.aspectRatio}",
    "language": "${input.outputLanguage}"
  },
  "summary": "High-level summary of the script narrative and visual theme.",
  "analytics": {
    "totalScenes": 0,
    "charactersCount": 0,
    "locationsCount": 0,
    "estimatedRuntime": "0m 00s",
    "wordCount": 0,
    "dialogueCount": 0,
    "promptCount": 0
  },
  "characters": [
    {
      "name": "Character Name",
      "appearance": "Detailed physical appearance & wardrobe",
      "description": "Role and personality summary",
      "sceneCount": 1,
      "characterPrompt": "Ready-to-use character consistency prompt"
    }
  ],
  "environments": [
    {
      "location": "Location Name",
      "imagePrompt": "Ready-to-use environment background image prompt",
      "description": "Architectural and spatial overview",
      "mood": "Lighting and atmosphere",
      "lighting": "Cinematic lighting setup"
    }
  ],
  "timeline": [
    {
      "sceneNumber": 1,
      "sceneTitle": "Scene Title",
      "duration": "5s",
      "environment": "Location Name",
      "characters": ["Character 1"]
    }
  ],
  "scenes": [
    {
      "sceneNumber": 1,
      "sceneTitle": "Scene Title",
      "duration": "5s",
      "environment": "Location Name",
      "visualStyle": "${selectedStyle}",
      "characters": ["Max 1-3 Character Names"],
      "camera": {
        "angle": "Eye level / Low angle / Wide shot",
        "movement": "Slow push in / Pan left / Tracking",
        "lens": "35mm / 85mm anamorphic"
      },
      "lighting": "Golden hour backlight / Soft studio key light",
      "mood": "Dramatic / Energetic / Mysterious",
      "composition": "Rule of thirds, strong depth of field",
      "actions": "Specific character actions and body language",
      "dialogue": ${input.includeDialogue ? '"Character dialogue line"' : "null"},
      "narration": "Optional narrator voiceover if required",
      "sfx": ${input.includeSFX ? '"Sound effect description"' : "null"},
      "backgroundMusic": ${input.includeBackgroundMusic ? '"Ambient soundtrack description"' : '"No background music"'},
      "negativePrompt": ${input.safetyNotes ? '"blurry, distorted, low quality, extra limbs, watermark, text"' : "null"},
      "generationPrompt": "Comprehensive scene prompt description",
      "copyReadyPrompt": "Final optimized prompt ready to copy-paste into ${input.promptStyle} (${selectedStyle}, ${input.aspectRatio})"
    }
  ]
}`;

  const userPrompt = `
Generate a complete ${input.numberOfScenes}-scene storyboard from the following script:

--- SCRIPT START ---
${input.script}
--- SCRIPT END ---

${
  input.characterPrompts
    ? `
USER CHARACTER PROMPTS REFERENCE:
${input.characterPrompts}
`
    : ""
}

CONFIGURATION REQUIREMENTS:
- Target Scenes: Exactly ${input.numberOfScenes} scenes.
- Visual Style: ${selectedStyle}
- Target AI Generator Format: ${input.promptStyle}
- Aspect Ratio: ${input.aspectRatio}
- Camera Style: ${input.cameraStyle}
- Detail Level: ${input.promptDetail}
- Include Character Dialogue: ${input.includeDialogue ? "Yes" : "No"}
- Include Sound Effects (SFX): ${input.includeSFX ? "Yes" : "No"}
- Include Background Music: ${input.includeBackgroundMusic ? "Yes" : "No (Always state 'No background music')"}
- Include Negative Prompts: ${input.safetyNotes ? "Yes" : "No"}

Produce ONLY valid JSON according to the schema.
`;

  return { systemPrompt, userPrompt };
}
