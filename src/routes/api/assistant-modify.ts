import { createFileRoute } from "@tanstack/react-router";
import { StoryboardFormInput, StoryboardOutput, VisualStyleOption } from "@/types/storyboard";
import { safeParseAIJson } from "@/lib/json-repair";

export const Route = createFileRoute("/api/assistant-modify")({
  server: {
    handlers: {
      POST: handleAssistantPost,
    },
  },
});

interface AssistantRequestBody {
  userQuery: string;
  currentForm: StoryboardFormInput;
  currentOutput: StoryboardOutput;
  chatHistory: Array<{ sender: "user" | "ai"; text: string }>;
}

interface AssistantResponseBody {
  actionSummary: string;
  updatedForm: Partial<StoryboardFormInput>;
  updatedOutput: StoryboardOutput;
}

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

const cleanPromptText = (text: string) => {
  if (!text) return "";
  return text
    .replace(/^Scene\s*\d+[:\-\s\\[]*/gi, "")
    .replace(/^Scene\s*\d+:\s*/gi, "")
    .replace(/,\s*\([^)]*(change|redo|try again|again|rewrite)[^)]*\)/gi, "")
    .replace(/\(\s*(change|redo|try again|again|rewrite)[^)]*\)/gi, "")
    .replace(/,\s*,/g, ",")
    .replace(/\s+/g, " ")
    .trim();
};

function localIntelligentAssistant(
  userMsg: string,
  currentForm: StoryboardFormInput,
  currentOutput: StoryboardOutput
): AssistantResponseBody {
  const qLower = userMsg.toLowerCase();
  let actionDesc = "";
  let newScenes = [...(currentOutput.scenes || [])];
  let newFormScript = currentForm.script;
  let newVisualStyle = currentForm.visualStyle;
  let newTargetCount = currentForm.numberOfScenes;

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
    newTargetCount = targetCount;

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
  } else if (isStyleChange) {
    const extractedStyle = matchedStyle || userMsg.replace(/change visual style (to)?|change style (to)?|make style|set style (to)?|use style|style/gi, "").trim();

    if (extractedStyle) {
      const validStyle = VISUAL_STYLES.find((st) => st.toLowerCase() === extractedStyle.toLowerCase()) || (extractedStyle.charAt(0).toUpperCase() + extractedStyle.slice(1)) as VisualStyleOption;
      newVisualStyle = validStyle;

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

      newScenes = newScenes.map((scene) => {
        const promptText = `Scene ${scene.sceneNumber} [${newVisualStyle} style, ${topic}, cinematic 4K resolution, 16:9, dramatic lighting, high detail]`;
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

  return {
    actionSummary: actionDesc,
    updatedForm: {
      script: newFormScript,
      visualStyle: newVisualStyle,
      numberOfScenes: newTargetCount,
    },
    updatedOutput: {
      ...currentOutput,
      project: {
        ...(currentOutput.project || {}),
        visualStyle: newVisualStyle,
      },
      scenes: newScenes,
      timeline: newTimeline,
    },
  };
}

async function handleAssistantPost({ request }: { request: Request }) {
  try {
    const apiKey =
      process.env.DEEPSEEK_API_KEY ||
      process.env.VITE_DEEPSEEK_API_KEY ||
      (import.meta as any).env?.DEEPSEEK_API_KEY ||
      (import.meta as any).env?.VITE_DEEPSEEK_API_KEY;

    const body = (await request.json()) as AssistantRequestBody;
    const { userQuery, currentForm, currentOutput, chatHistory } = body;

    if (!userQuery || !userQuery.trim()) {
      return Response.json({ error: "Please provide a valid query." }, { status: 400 });
    }

    if (!apiKey) {
      const fallbackResult = localIntelligentAssistant(userQuery, currentForm, currentOutput);
      return Response.json(fallbackResult);
    }

    const systemPrompt = `You are an expert AI Director and Storyboard Assistant.
Your task is to update an existing AI video storyboard package based on the user's instruction while maintaining project memory and continuity.

You MUST reply ONLY with a valid JSON object in this exact schema:
{
  "actionSummary": "1-sentence description of what change was performed",
  "updatedForm": {
    "script": "updated screenplay string",
    "visualStyle": "updated visual style name",
    "numberOfScenes": 10
  },
  "updatedOutput": {
    "project": {
      "title": "Title",
      "visualStyle": "Visual Style",
      "aspectRatio": "16:9"
    },
    "scenes": [
      {
        "sceneNumber": 1,
        "sceneTitle": "Scene Title",
        "duration": "5s",
        "environment": "Location",
        "characters": ["Char1"],
        "dialogue": "dialogue line",
        "sfx": "sfx line",
        "cameraDirection": "camera shot",
        "generationPrompt": "Scene 1 [full 4K render prompt]",
        "copyReadyPrompt": "Scene 1 [full 4K render prompt]"
      }
    ]
  }
}`;

    const userContextPrompt = `CURRENT STORYBOARD MEMORY:
- Visual Style: ${currentForm.visualStyle}
- Current Scene Count: ${currentOutput?.scenes?.length || currentForm.numberOfScenes}
- Screenplay/Script: ${currentForm.script}
- Scenes Summary: ${currentOutput?.scenes?.map((s) => `Scene ${s.sceneNumber}: ${s.sceneTitle}`).join("; ")}

RECENT CHAT HISTORY:
${(chatHistory || []).slice(-4).map((h) => `${h.sender.toUpperCase()}: ${h.text}`).join("\n")}

USER INSTRUCTION TO APPLY:
"${userQuery}"

Modify the storyboard package accordingly. Ensure every scene has a high quality 4K prompt in "Scene N [prompt]" format.`;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContextPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      console.warn("DeepSeek assistant request returned non-OK, using fallback.");
      const fallbackResult = localIntelligentAssistant(userQuery, currentForm, currentOutput);
      return Response.json(fallbackResult);
    }

    const resData = await response.json();
    const content = resData.choices?.[0]?.message?.content;

    if (!content) {
      const fallbackResult = localIntelligentAssistant(userQuery, currentForm, currentOutput);
      return Response.json(fallbackResult);
    }

    const parsed = safeParseAIJson<AssistantResponseBody>(content);
    if (!parsed || !parsed.updatedOutput) {
      const fallbackResult = localIntelligentAssistant(userQuery, currentForm, currentOutput);
      return Response.json(fallbackResult);
    }

    return Response.json(parsed);
  } catch (err: any) {
    console.error("Error in assistant API endpoint:", err);
    return Response.json({ error: err.message || "Failed to process assistant request." }, { status: 500 });
  }
}
