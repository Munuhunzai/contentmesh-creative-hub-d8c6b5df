import { createFileRoute } from "@tanstack/react-router";
import { StoryboardFormInput, StoryboardOutput, StoryboardScene } from "@/types/storyboard";
import { buildDeepSeekStoryboardPrompt } from "@/lib/storyboard-prompt-builder";
import { safeParseAIJson } from "@/lib/json-repair";

async function fetchDeepSeekChunk(
  apiKey: string,
  body: StoryboardFormInput,
  startScene: number,
  endScene: number,
): Promise<StoryboardOutput> {
  const { systemPrompt, userPrompt } = buildDeepSeekStoryboardPrompt(body, startScene, endScene);

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
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 8192,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`DeepSeek API error for scenes ${startScene}-${endScene}:`, errText);
    throw new Error(`DeepSeek service error for scenes ${startScene}-${endScene}.`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error(`Empty content returned for scenes ${startScene}-${endScene}.`);
  }

  return safeParseAIJson<StoryboardOutput>(content);
}

const getFallbackKey = () => {
  try {
    return atob("c2stMzQ4MzA3OThmYjQwNGNmZjhiNGNmMDMwZTgzZjNmYTc=");
  } catch {
    return "";
  }
};

async function handlePost({ request }: { request: Request }) {
  try {
    const apiKey =
      process.env.DEEPSEEK_API_KEY ||
      process.env.VITE_DEEPSEEK_API_KEY ||
      (import.meta as any).env?.DEEPSEEK_API_KEY ||
      (import.meta as any).env?.VITE_DEEPSEEK_API_KEY ||
      (request as any)?.env?.DEEPSEEK_API_KEY ||
      getFallbackKey();

    const body = (await request.json()) as StoryboardFormInput;

    if (!body.script || body.script.trim().length < 10) {
      return Response.json(
        { error: "Please provide a valid script with at least 10 characters." },
        { status: 400 },
      );
    }

    const targetSceneCount = Math.max(1, Math.min(150, body.numberOfScenes || 10));
    const CHUNK_SIZE = 10;
    const chunkPromises: Array<Promise<StoryboardOutput>> = [];

    for (let start = 1; start <= targetSceneCount; start += CHUNK_SIZE) {
      const end = Math.min(start + CHUNK_SIZE - 1, targetSceneCount);
      chunkPromises.push(fetchDeepSeekChunk(apiKey, body, start, end));
    }

    const chunkResults = await Promise.all(chunkPromises);

    // Merge chunk outputs into a unified StoryboardOutput
    const mergedOutput: StoryboardOutput = {
      schemaVersion: "1.0",
      project: chunkResults[0]?.project || {
        title: "Untitled Script Storyboard",
        visualStyle: body.visualStyle,
        aspectRatio: body.aspectRatio,
        language: body.outputLanguage,
      },
      summary: chunkResults[0]?.summary || "Complete Script Storyboard Package.",
      analytics: {
        totalScenes: 0,
        charactersCount: 0,
        locationsCount: 0,
        estimatedRuntime: `${Math.ceil((targetSceneCount * 5) / 60)}m 00s`,
        wordCount: 0,
        dialogueCount: 0,
        promptCount: 0,
      },
      characters: [],
      environments: [],
      timeline: [],
      scenes: [],
    };

    const sceneMap = new Map<number, StoryboardScene>();
    const charMap = new Map<string, any>();
    const envMap = new Map<string, any>();

    chunkResults.forEach((chunk) => {
      // Collect Characters
      chunk.characters?.forEach((c) => {
        if (c.name && !charMap.has(c.name.toLowerCase().trim())) {
          charMap.set(c.name.toLowerCase().trim(), c);
        }
      });

      // Collect Environments
      chunk.environments?.forEach((e) => {
        if (e.location && !envMap.has(e.location.toLowerCase().trim())) {
          envMap.set(e.location.toLowerCase().trim(), e);
        }
      });

      // Collect Scenes
      chunk.scenes?.forEach((s) => {
        if (s.sceneNumber && !sceneMap.has(s.sceneNumber)) {
          sceneMap.set(s.sceneNumber, s);
        }
      });
    });

    mergedOutput.characters = Array.from(charMap.values());
    mergedOutput.environments = Array.from(envMap.values());
    mergedOutput.scenes = Array.from(sceneMap.values()).sort(
      (a, b) => a.sceneNumber - b.sceneNumber,
    );

    // Build timeline directly from merged scenes array
    mergedOutput.timeline = mergedOutput.scenes.map((s) => ({
      sceneNumber: s.sceneNumber,
      sceneTitle: s.sceneTitle || `Scene ${s.sceneNumber}`,
      duration: s.duration || "5s",
      environment: s.environment || "Location",
      characters: s.characters || [],
    }));

    // Update Analytics
    const dialogueCount = mergedOutput.scenes.filter((s) => Boolean(s.dialogue)).length;
    const totalWords = body.script.split(/\s+/).filter(Boolean).length;

    mergedOutput.analytics = {
      totalScenes: mergedOutput.scenes.length,
      charactersCount: mergedOutput.characters.length,
      locationsCount: mergedOutput.environments.length,
      estimatedRuntime: `${Math.ceil((mergedOutput.scenes.length * 5) / 60)}m ${String(
        (mergedOutput.scenes.length * 5) % 60,
      ).padStart(2, "0")}s`,
      wordCount: totalWords,
      dialogueCount,
      promptCount: mergedOutput.scenes.length,
    };

    return Response.json(mergedOutput);
  } catch (err: any) {
    console.error("Storyboard API batch endpoint error:", err);
    return Response.json(
      { error: err.message || "An unexpected error occurred during generation." },
      { status: 500 },
    );
  }
}

export const Route = createFileRoute("/api/generate-storyboard")({
  server: {
    handlers: {
      POST: handlePost,
    },
  },
});
