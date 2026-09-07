import { guardRequest, readJson, requestErrorResponse } from "@/lib/request-guard";
import { createFileRoute } from "@tanstack/react-router";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are Mesh, the friendly AI assistant for ContentMesh — an AI-powered creative studio.

ContentMesh services:
- AI Video Production & AI Animation
- AI Voiceovers & AI Image / Marketing Content
- Professional Video Editing & Motion Graphics
- Commercial Advertisement Production & Brand Films
- In-house Video Production & Social Media Content

Your job:
1. Answer questions about ContentMesh services clearly and concisely.
2. Recommend the most suitable service based on the client's goals.
3. Ask smart discovery questions to understand project needs.
4. Generate creative ideas and content directions when helpful.
5. Encourage users to book a discovery call or request a custom quote at /contact.
6. For pricing or project estimates, explain that every project is custom-quoted based on scope, video length, and complexity, and invite them to get a quick quote at /contact.
7. Tone: warm, confident, concise. Short paragraphs. Genuinely helpful.`;

function generateFallbackReply(userText: string): string {
  const query = userText.toLowerCase();
  if (/price|cost|budget|rate|plan/.test(query))
    return "Each project is quoted around its length, style, deliverables and deadline. Share your brief on our [Contact page](/contact) for a tailored estimate.";
  if (/time|delivery|turnaround|revision/.test(query))
    return "Timelines and revision rounds are agreed in your project scope. Tell us your deadline and deliverables on our [Contact page](/contact), and the team will confirm what is feasible.";
  if (/contact|hire|order|book|email|whatsapp/.test(query))
    return "Share your brief through our [Contact page](/contact). You'll also find a direct email option there.";
  return "ContentMesh produces AI commercials, animation, voiceovers and video edits for brands and creators. Explore our [Services](/services), view our [Portfolio](/portfolio), or [request a quote](/contact). What are you making?";
}

async function handlePost({ request }: { request: Request }) {
  let lastUserMessage = "";
  try {
    guardRequest(request, 15);
    const body = (await readJson(request)) as { messages?: ChatMessage[] };
    const messages = Array.isArray(body?.messages)
      ? body.messages.filter(
          (m) =>
            m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
        )
      : [];
    if (!messages.length) {
      return Response.json({ reply: generateFallbackReply("") });
    }

    const userMsgs = messages.filter((m) => m.role === "user");
    lastUserMessage = userMsgs[userMsgs.length - 1]?.content ?? "";

    const key = process.env.DEEPSEEK_API_KEY;

    if (!key) {
      // Return smart fallback instead of error
      return Response.json({ reply: generateFallbackReply(lastUserMessage) });
    }

    const trimmed = messages.slice(-20).map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content ?? "").slice(0, 4000),
    }));

    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      signal: AbortSignal.timeout(90_000),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...trimmed],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!res.ok) {
      console.warn("DeepSeek API status:", res.status, "using fallback assistant");
      return Response.json({ reply: generateFallbackReply(lastUserMessage) });
    }

    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) {
      return Response.json({ reply: generateFallbackReply(lastUserMessage) });
    }

    return Response.json({ reply });
  } catch (err) {
    const failure = requestErrorResponse(err);
    if (failure) return failure;
    console.warn("Chat handler fallback triggered:", err);
    return Response.json({ reply: generateFallbackReply(lastUserMessage) });
  }
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: handlePost,
    },
  },
});
