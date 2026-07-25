import { createFileRoute } from "@tanstack/react-router";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

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
5. Encourage users to book a discovery call or place an order at /contact.
6. For pricing, mention Starter ($1.5k/mo), Professional ($2k/mo), or Enterprise (custom).
7. Tone: warm, confident, concise. Short paragraphs. Genuinely helpful.`;

function generateFallbackReply(userText: string): string {
  const query = userText.toLowerCase().trim();

  if (
    query.includes("price") ||
    query.includes("cost") ||
    query.includes("plan") ||
    query.includes("retainer") ||
    query.includes("rate") ||
    query.includes("how much")
  ) {
    return "Our retainer plans are simple and transparent:\n\n- **Starter**: $1.5k/mo — 1 video/mo (AI video up to 60s, 2 revision rounds, 5-day delivery)\n- **Professional**: $2k/mo — 4 videos/mo (AI video + animation, unlimited revisions, 48h priority queue)\n- **Enterprise**: Custom pricing for dedicated studio teams & custom workflows.\n\nYou can explore full plan features on our [Pricing](/pricing) page or request a quote on our [Contact Form](/contact)!";
  }

  if (
    query.includes("portfolio") ||
    query.includes("sample") ||
    query.includes("example") ||
    query.includes("work") ||
    query.includes("video") ||
    query.includes("show") ||
    query.includes("reel")
  ) {
    return "We've created high-converting AI commercials, product launches, animations, and corporate films for brands worldwide.\n\nYou can watch selected productions directly on our [Portfolio](/portfolio) page!";
  }

  if (
    query.includes("service") ||
    query.includes("offer") ||
    query.includes("do") ||
    query.includes("animation") ||
    query.includes("voiceover") ||
    query.includes("editing")
  ) {
    return "ContentMesh is a full-stack AI creative agency. Our core services include:\n\n- **AI Video Production & Animation**\n- **Studio-grade AI Voiceovers** (40+ languages)\n- **Commercial Ads & Brand Films**\n- **Video Editing & Motion Graphics**\n- **Social Reels & YouTube Content**\n\nCheck out our full list of capabilities on our [Services](/services) page!";
  }

  if (
    query.includes("contact") ||
    query.includes("order") ||
    query.includes("book") ||
    query.includes("hire") ||
    query.includes("start") ||
    query.includes("whatsapp") ||
    query.includes("email")
  ) {
    return "Ready to bring your project to life? You can get in touch in two easy ways:\n\n- **Place an Order / Request Quote**: Submit your project details on our [Order Form](/contact).\n- **Chat on WhatsApp**: Reach out directly to our team on [WhatsApp](https://wa.me/923000000000)!\n\nWe usually respond within a few hours.";
  }

  if (
    query.includes("turnaround") ||
    query.includes("fast") ||
    query.includes("time") ||
    query.includes("delivery") ||
    query.includes("how long")
  ) {
    return "Our production timelines:\n\n- **Starter Plan**: 5 business days per project\n- **Professional Plan**: 48-hour priority turnaround\n- **Custom Rush Delivery**: Available for urgent commercial launches via [Contact](/contact).";
  }

  if (
    query.includes("revision") ||
    query.includes("edit") ||
    query.includes("change") ||
    query.includes("feedback")
  ) {
    return "We want your content to be 100% perfect!\n\n- **Starter Plan**: Includes 2 revision rounds\n- **Professional & Enterprise Plans**: Include **unlimited revisions**.";
  }

  return "ContentMesh is an AI-powered creative studio delivering cinematic video production, animations, ads, and brand storytelling.\n\nHow can I help you today? Feel free to ask about our **services**, **pricing**, **portfolio**, or **how to place an order**!";
}

async function handlePost({ request }: { request: Request }) {
  let lastUserMessage = "";
  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (!messages.length) {
      return Response.json({ reply: generateFallbackReply("") });
    }

    const userMsgs = messages.filter((m) => m.role === "user");
    lastUserMessage = userMsgs[userMsgs.length - 1]?.content ?? "";

    const key =
      process.env.DEEPSEEK_API_KEY ||
      process.env.VITE_DEEPSEEK_API_KEY ||
      (import.meta as any).env?.DEEPSEEK_API_KEY ||
      (import.meta as any).env?.VITE_DEEPSEEK_API_KEY;

    if (!key) {
      // Return smart fallback instead of error
      return Response.json({ reply: generateFallbackReply(lastUserMessage) });
    }

    const trimmed = messages.slice(-20).map((m) => ({
      role: m.role === "assistant" ? "assistant" : m.role === "system" ? "system" : "user",
      content: String(m.content ?? "").slice(0, 4000),
    }));

    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
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
