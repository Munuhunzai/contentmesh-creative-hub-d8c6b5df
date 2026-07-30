import { createFileRoute } from "@tanstack/react-router";
import { StoryboardFormInput, StoryboardOutput } from "@/types/storyboard";
import { buildDeepSeekStoryboardPrompt } from "@/lib/storyboard-prompt-builder";

async function handlePost({ request }: { request: Request }) {
  try {
    const apiKey =
      process.env.DEEPSEEK_API_KEY ||
      process.env.VITE_DEEPSEEK_API_KEY ||
      (import.meta as any).env?.DEEPSEEK_API_KEY ||
      (import.meta as any).env?.VITE_DEEPSEEK_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "DeepSeek API key is not configured on the server." },
        { status: 503 }
      );
    }

    const body = (await request.json()) as StoryboardFormInput;

    if (!body.script || body.script.trim().length < 10) {
      return Response.json(
        { error: "Please provide a valid script with at least 10 characters." },
        { status: 400 }
      );
    }

    const { systemPrompt, userPrompt } = buildDeepSeekStoryboardPrompt(body);

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
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("DeepSeek API error:", errText);
      return Response.json(
        { error: "DeepSeek service returned an error. Please try again." },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return Response.json(
        { error: "Failed to generate storyboard content from AI provider." },
        { status: 500 }
      );
    }

    // Clean potential markdown codeblock backticks if present
    let jsonString = content.trim();
    if (jsonString.startsWith("```")) {
      jsonString = jsonString.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
    }

    const storyboardOutput = JSON.parse(jsonString) as StoryboardOutput;

    return Response.json(storyboardOutput);
  } catch (err: any) {
    console.error("Storyboard API endpoint error:", err);
    return Response.json(
      { error: err.message || "An unexpected error occurred during generation." },
      { status: 500 }
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
