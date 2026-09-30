import { guardRequest, readJson, requestErrorResponse } from "@/lib/request-guard";
import { createFileRoute } from "@tanstack/react-router";
import { StoryboardFormInput, StoryboardOutput, StoryboardScene } from "@/types/storyboard";
import { buildDeepSeekStoryboardPrompt } from "@/lib/storyboard-prompt-builder";
import { safeParseAIJson } from "@/lib/json-repair";
import {
  consumeStoryboardCredits,
  requireStoryboardAuth,
  usageLimitResponse,
} from "@/lib/server/storyboard-auth";

class DeepSeekApiError extends Error {
  constructor(readonly status: number) {
    super(`DeepSeek API returned HTTP ${status}.`);
    this.name = "DeepSeekApiError";
  }
}

async function fetchDeepSeekChunk(
  apiKey: string,
  body: StoryboardFormInput,
  startScene: number,
  endScene: number,
): Promise<StoryboardOutput> {
  const { systemPrompt, userPrompt } = buildDeepSeekStoryboardPrompt(body, startScene, endScene);

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    signal: AbortSignal.timeout(90_000),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-flash",
      thinking: { type: "disabled" },
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
    console.error(
      `DeepSeek API error for scenes ${startScene}-${endScene} (HTTP ${response.status}):`,
      errText,
    );
    throw new DeepSeekApiError(response.status);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error(`Empty content returned for scenes ${startScene}-${endScene}.`);
  }

  return safeParseAIJson<StoryboardOutput>(content);
}

async function handlePost({ request }: { request: Request }) {
  try {
    guardRequest(request, 6);
    const auth = await requireStoryboardAuth(request);
    if (!auth.ok) return auth.response;
    const apiKey = process.env.DEEPSEEK_API_KEY;

    const body = (await readJson(request, 512_000)) as StoryboardFormInput;

    if (
      !body ||
      typeof body.script !== "string" ||
      body.script.trim().length < 10 ||
      body.script.length > 12_000
    ) {
      return Response.json(
        { error: "Please provide a script between 10 and 12,000 characters." },
        { status: 400 },
      );
    }

    if (
      !Number.isInteger(body.numberOfScenes) ||
      body.numberOfScenes < 1 ||
      body.numberOfScenes > 20
    ) {
      return Response.json({ error: "Choose a scene count between 1 and 20." }, { status: 400 });
    }

    if (!apiKey)
      return Response.json(
        { error: "Storyboard generation is temporarily unavailable. Please try again later." },
        { status: 503 },
      );

    const creditCost = Math.ceil(body.numberOfScenes / 10);
    const usageResult = await consumeStoryboardCredits(auth.token, creditCost);
    if (usageResult.response) return usageResult.response;
    if (!usageResult.usage?.allowed) return usageLimitResponse(usageResult.usage!);

    const targetSceneCount = Math.max(1, Math.min(20, body.numberOfScenes || 10));
    const CHUNK_SIZE = 10;
    const ranges: Array<[number, number]> = [];

    for (let start = 1; start <= targetSceneCount; start += CHUNK_SIZE) {
      const end = Math.min(start + CHUNK_SIZE - 1, targetSceneCount);
      ranges.push([start, end]);
    }

    const chunkResults: StoryboardOutput[] = [];
    for (let i = 0; i < ranges.length; i += 3) {
      chunkResults.push(
        ...(await Promise.all(
          ranges
            .slice(i, i + 3)
            .map(([start, end]) => fetchDeepSeekChunk(apiKey, body, start, end)),
        )),
      );
    }

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
    const charMap = new Map<string, StoryboardOutput["characters"][number]>();
    const envMap = new Map<string, StoryboardOutput["environments"][number]>();

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
      estimatedRuntime: `${Math.floor((mergedOutput.scenes.length * 5) / 60)}m ${String(
        (mergedOutput.scenes.length * 5) % 60,
      ).padStart(2, "0")}s`,
      wordCount: totalWords,
      dialogueCount,
      promptCount: mergedOutput.scenes.length,
    };

    return Response.json(mergedOutput);
  } catch (err: unknown) {
    const failure = requestErrorResponse(err);
    if (failure) return failure;
    if (err instanceof DeepSeekApiError) {
      const details: Record<number, string> = {
        400: "The AI provider rejected this request. Check the model configuration and try again.",
        401: "The AI provider rejected its API key. Check the production DEEPSEEK_API_KEY setting.",
        402: "The AI provider account needs billing or available credits.",
        429: "The AI provider is rate limiting requests. Please wait a moment and retry.",
      };
      const message =
        details[err.status] ||
        (err.status >= 500
          ? "The AI provider is temporarily unavailable. Please retry shortly."
          : `The AI provider rejected the request (HTTP ${err.status}).`);
      console.error("Storyboard generation failed at DeepSeek API", err);
      return Response.json({ error: message }, { status: 502 });
    }
    console.error("Storyboard API batch endpoint error:", err);
    return Response.json(
      {
        error:
          "Generation could not complete. Please try again with a shorter script or fewer scenes.",
      },
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
