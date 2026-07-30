import { StoryboardFormInput } from "@/types/storyboard";

export function buildDeepSeekStoryboardPrompt(input: StoryboardFormInput) {
  const selectedStyle =
    input.visualStyle === "Custom" && input.customStyle
      ? input.customStyle
      : input.visualStyle;

  const targetSceneCount = Math.max(1, Math.min(200, input.numberOfScenes || 10));

  const systemPrompt = `You are a world-class Hollywood Creative Director, AI Video Producer, and Senior Cinematographer for ContentMesh Studios.
Your task is to analyze an input script and generate a complete, production-ready AI Storyboard & Prompt Package in STRICT JSON format.

CRITICAL RULES & DIRECTIVES:
1. EXACT SCENE COUNT: You MUST generate EXACTLY ${targetSceneCount} distinct scene objects inside the "scenes" array (Scene 1 through Scene ${targetSceneCount}) and ${targetSceneCount} items in the "timeline" array. NEVER default to 5 scenes or stop early. If targetSceneCount is ${targetSceneCount}, the "scenes" array MUST have ${targetSceneCount} elements.
2. Return ONLY valid, raw, parseable JSON matching the specified JSON schema. No markdown wrapping (no \`\`\`json), no preamble, no trailing text.
3. Schema Version: "1.0".
4. NEVER include more than 3 characters inside a single scene prompt. Limit characters per scene to 1-3 for maximum Google Flow, Veo, and Midjourney consistency.
5. Background Music: If background music is NOT explicitly enabled by the user, set "backgroundMusic": "No background music" and explicitly mention "No background music" in every scene's copyReadyPrompt.
6. Language: Output all scene titles, descriptions, dialogue, and instructions in ${input.outputLanguage}.
7. Prompt Optimization: Optimize the "copyReadyPrompt" for ${input.promptStyle} generators using aspect ratio ${input.aspectRatio}, visual style "${selectedStyle}", and camera style "${input.cameraStyle}". Include negative prompts if safety notes are enabled. Bundle prompt, dialogue, and SFX in a clean copy-pasteable structure.
8. Detail Level: Produce ${input.promptDetail} scene descriptions covering environment, camera angle, camera movement, lens, lighting, mood, character appearance, facial expression, body language, foreground, background, weather, time of day, SFX, and dialogue.

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
    "totalScenes": ${targetSceneCount},
    "charactersCount": 0,
    "locationsCount": 0,
    "estimatedRuntime": "0m 00s",
    "wordCount": 0,
    "dialogueCount": 0,
    "promptCount": ${targetSceneCount}
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

  let characterRefSection = "";
  if (input.uploadedCharacters && input.uploadedCharacters.length > 0) {
    characterRefSection += "\nUPLOADED CHARACTER VISUAL REFERENCES:\n";
    input.uploadedCharacters.forEach((c) => {
      characterRefSection += `- Character Name: ${c.name || "Unnamed"} | Prompt: ${c.prompt || "Visual reference attached"}\n`;
    });
  }
  if (input.characterPrompts) {
    characterRefSection += `\nTEXT CHARACTER PROMPTS:\n${input.characterPrompts}\n`;
  }

  const userPrompt = `
STRICT TASK: Segment and expand the following script into EXACTLY ${targetSceneCount} cinematic scenes (Scene 1 to Scene ${targetSceneCount}).

--- SCRIPT START ---
${input.script}
--- SCRIPT END ---

${characterRefSection ? `CHARACTER REFERENCES:\n${characterRefSection}` : ""}

CONFIGURATION REQUIREMENTS:
- Target Scene Count: EXACTLY ${targetSceneCount} SCENES (The "scenes" array MUST contain ${targetSceneCount} scene objects).
- Visual Style: ${selectedStyle}
- Target AI Generator Format: ${input.promptStyle}
- Aspect Ratio: ${input.aspectRatio}
- Camera Style: ${input.cameraStyle}
- Detail Level: ${input.promptDetail}
- Include Character Dialogue: ${input.includeDialogue ? "Yes" : "No"}
- Include Sound Effects (SFX): ${input.includeSFX ? "Yes" : "No"}
- Include Background Music: ${input.includeBackgroundMusic ? "Yes" : "No (Always state 'No background music')"}
- Include Negative Prompts: ${input.safetyNotes ? "Yes" : "No"}

Even if the input script is concise, expand the visual beats into EXACTLY ${targetSceneCount} distinct sequential scenes. Produce ONLY valid JSON.
`;

  return { systemPrompt, userPrompt };
}
