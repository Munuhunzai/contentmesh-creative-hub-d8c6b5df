import { StoryboardFormInput } from "@/types/storyboard";

export function buildDeepSeekStoryboardPrompt(
  input: StoryboardFormInput,
  startScene: number = 1,
  endScene?: number
) {
  const selectedStyle =
    input.visualStyle === "Custom" && input.customStyle
      ? input.customStyle
      : input.visualStyle;

  const totalTarget = Math.max(1, Math.min(200, input.numberOfScenes || 10));
  const chunkStart = startScene;
  const chunkEnd = endScene || totalTarget;
  const chunkCount = chunkEnd - chunkStart + 1;

  const startPercent = Math.round(((chunkStart - 1) / totalTarget) * 100);
  const endPercent = Math.round((chunkEnd / totalTarget) * 100);

  const systemPrompt = `You are a world-class Hollywood Creative Director, AI Video Producer, and Senior Cinematographer for ContentMesh Studios.
Your task is to analyze an input script and generate a complete, production-ready AI Storyboard & Prompt Package in STRICT JSON format.

CRITICAL NARRATIVE & CHUNK DIRECTIVES:
1. STORY ARC PROGRESSION: This chunk covers EXACTLY ${startPercent}% to ${endPercent}% progress along the script's chronological story arc.
   - Do NOT restart the story from the beginning if startScene > 1.
   - You MUST pick up the story progression at the ${startPercent}% mark of the narrative and advance the plot continuously through the ${endPercent}% milestone.
2. EXACT SCENE NUMBERS: You MUST generate EXACTLY ${chunkCount} distinct scene objects inside the "scenes" array for Scene ${chunkStart} through Scene ${chunkEnd}.
   - Each scene object's "sceneNumber" MUST be numbered sequentially starting from ${chunkStart} up to ${chunkEnd}.
3. Return ONLY valid, raw, parseable JSON matching the specified JSON schema. No markdown wrapping (no \`\`\`json), no preamble, no trailing text.
4. Schema Version: "1.0".
5. NEVER include more than 3 characters inside a single scene prompt. Limit characters per scene to 1-3 for maximum Google Flow, Veo, and Midjourney consistency.
6. Background Music: If background music is NOT explicitly enabled by the user, set "backgroundMusic": "No background music" and explicitly mention "No background music" in every scene's copyReadyPrompt.
7. Language: Output all scene titles, descriptions, dialogue, and instructions in ${input.outputLanguage}.
8. Prompt Optimization: Optimize the "copyReadyPrompt" for ${input.promptStyle} generators using aspect ratio ${input.aspectRatio}, visual style "${selectedStyle}", and camera style "${input.cameraStyle}".

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
    "totalScenes": ${totalTarget},
    "charactersCount": 0,
    "locationsCount": 0,
    "estimatedRuntime": "${Math.ceil(totalTarget * 5 / 60)}m 00s",
    "wordCount": 0,
    "dialogueCount": 0,
    "promptCount": ${totalTarget}
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
      "sceneNumber": ${chunkStart},
      "sceneTitle": "Scene Title",
      "duration": "5s",
      "environment": "Location Name",
      "characters": ["Character 1"]
    }
  ],
  "scenes": [
    {
      "sceneNumber": ${chunkStart},
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
STRICT NARRATIVE TASK: Focus ONLY on scenes ${chunkStart} through ${chunkEnd} (representing ${startPercent}% to ${endPercent}% of the complete script plot).

--- FULL SCRIPT START ---
${input.script}
--- FULL SCRIPT END ---

${characterRefSection ? `CHARACTER REFERENCES:\n${characterRefSection}` : ""}

CHUNK CONFIGURATION & INSTRUCTIONS:
- Scene Range: SCENES ${chunkStart} TO ${chunkEnd} (Generate EXACTLY ${chunkCount} scene objects numbered ${chunkStart} through ${chunkEnd}).
- Narrative Position: Start at the ${startPercent}% narrative milestone of the story and advance to the ${endPercent}% milestone.
- Visual Style: ${selectedStyle}
- Target AI Generator Format: ${input.promptStyle}
- Aspect Ratio: ${input.aspectRatio}
- Camera Style: ${input.cameraStyle}
- Detail Level: ${input.promptDetail}
- Include Character Dialogue: ${input.includeDialogue ? "Yes" : "No"}
- Include Sound Effects (SFX): ${input.includeSFX ? "Yes" : "No"}
- Include Background Music: ${input.includeBackgroundMusic ? "Yes" : "No (Always state 'No background music')"}
- Include Negative Prompts: ${input.safetyNotes ? "Yes" : "No"}

Do NOT repeat the beginning of the story. Generate unique, sequential visual scenes for range ${chunkStart}..${chunkEnd}. Produce ONLY valid JSON matching the schema.
`;

  return { systemPrompt, userPrompt };
}
