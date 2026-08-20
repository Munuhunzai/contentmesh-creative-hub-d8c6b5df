import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const INTRO: Msg = {
  role: "assistant",
  content:
    "Hi! I'm Mesh — ContentMesh's AI assistant. Tell me about your project and I'll suggest the right service, share ideas, or help you book a discovery call.",
};

export function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([INTRO]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setError(null);
    const next = [...messages, { role: "user", content: text } as Msg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        setError(data.error ?? "Chat is temporarily unavailable.");
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.reply! }]);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating avatar button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          open
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 1, scale: 1, y: [0, -10, 0] }
        }
        transition={
          open
            ? { duration: 0.2 }
            : {
                opacity: { delay: 0.6, duration: 0.4 },
                y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
              }
        }
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-10 right-6 z-[9998] grid h-16 w-16 place-items-center rounded-full transition-transform hover:scale-110 sm:bottom-12"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(14,68,127,0.15)",
          boxShadow: "0 18px 45px -12px rgba(14,68,127,0.35), 0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        {open ? (
          <X className="h-5 w-5 text-[#0E447F]" />
        ) : (
          <img
            src="/chatbot-avatar.webp"
            alt="ContentMesh AI"
            width={56}
            height={56}
            decoding="async"
            className="h-14 w-14 rounded-full object-contain"
          />
        )}
        {!open && (
          <span
            aria-hidden
            className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white"
            style={{ background: "#FF7A00" }}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 left-4 right-4 z-[9999] flex w-auto flex-col overflow-hidden sm:left-auto sm:right-6 sm:bottom-28 sm:w-[380px] max-w-[calc(100vw-2rem)]"
            style={{
              height: "min(520px, calc(100dvh - 7.5rem))",
              maxHeight: "calc(100dvh - 7rem)",
              borderRadius: 24,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(32px) saturate(180%)",
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.6)",
              boxShadow: "0 30px 80px -20px rgba(14,68,127,0.35), 0 10px 30px rgba(0,0,0,0.10)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-5 py-4 shrink-0"
              style={{
                background: "linear-gradient(135deg, #0E447F 0%, #0A3663 100%)",
                color: "#fff",
              }}
            >
              <img
                src="/chatbot-avatar.webp"
                alt="ContentMesh AI Assistant"
                width={40}
                height={40}
                loading="lazy"
                decoding="async"
                className="h-10 w-10 rounded-full bg-white/95 object-contain p-1"
              />
              <div className="flex-1">
                <div className="text-sm font-semibold leading-tight">Mesh · ContentMesh</div>
                <div className="flex items-center gap-1.5 text-xs opacity-90">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: "#FF7A00" }}
                  />
                  Online — usually replies instantly
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid h-8 w-8 place-items-center rounded-full text-white/90 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
              <div className="flex flex-col gap-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={m.role === "user" ? "self-end" : "self-start"}
                    style={{ maxWidth: "85%" }}
                  >
                    <div
                      className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
                      style={
                        m.role === "user"
                          ? {
                              background: "linear-gradient(135deg, #0E447F 0%, #0A3663 100%)",
                              color: "#fff",
                              borderBottomRightRadius: 6,
                            }
                          : {
                              background: "#F4F5F7",
                              color: "#1E293B",
                              borderBottomLeftRadius: 6,
                            }
                      }
                    >
                      {renderFormattedContent(m.content, m.role)}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="self-start">
                    <div
                      className="flex items-center gap-1 rounded-2xl px-3.5 py-3 text-sm"
                      style={{ background: "#F4F5F7", borderBottomLeftRadius: 6 }}
                    >
                      <Dot delay={0} />
                      <Dot delay={0.15} />
                      <Dot delay={0.3} />
                    </div>
                  </div>
                )}
                {error && (
                  <div
                    className="self-start rounded-2xl px-3.5 py-2.5 text-xs"
                    style={{ background: "#FEE", color: "#B00020" }}
                  >
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
              className="flex items-center gap-2 border-t border-black/5 bg-white/70 px-3 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about services, ideas, or book a call…"
                maxLength={1000}
                className="flex-1 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0E447F]"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send"
                className="grid h-10 w-10 place-items-center rounded-full text-white transition-transform hover:scale-105 disabled:opacity-50"
                style={{ background: "#FF7A00" }}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="inline-block h-1.5 w-1.5 rounded-full"
      style={{ background: "#0E447F" }}
      animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
      transition={{ duration: 0.9, repeat: Infinity, delay }}
    />
  );
}

function renderFormattedContent(text: string, role: "user" | "assistant") {
  const paragraphs = text.split("\n\n");
  return paragraphs.map((para, pIdx) => {
    const lines = para.split("\n");
    const isList = lines.length > 0 && lines.every((line) => line.trim().startsWith("- ") || line.trim().startsWith("* "));

    if (isList) {
      return (
        <ul key={pIdx} className="my-1.5 space-y-2">
          {lines.map((line, lIdx) => {
            const cleanLine = line.trim().replace(/^[-*]\s+/, "");
            return (
              <li key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: role === "user" ? "#FF8C00" : "#FF5A1F" }}
                />
                <span className="flex-1">{parseFormattedText(cleanLine, role)}</span>
              </li>
            );
          })}
        </ul>
      );
    }

    return (
      <p key={pIdx} className="mb-2 last:mb-0 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, lIdx) => (
          <span key={lIdx}>
            {lIdx > 0 && <br />}
            {parseFormattedText(line, role)}
          </span>
        ))}
      </p>
    );
  });
}

function parseFormattedText(text: string, role: "user" | "assistant") {
  // Regex to match markdown links [label](url) or bold **text**
  const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|__.*?__)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith("[") && part.includes("](")) {
      const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (match) {
        const [, label, url] = match;
        const isExternal = url.startsWith("http");
        return (
          <a
            key={i}
            href={url}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="underline font-semibold transition-opacity hover:opacity-80"
            style={{ color: role === "user" ? "#FFFFFF" : "#0E447F" }}
          >
            {label}
          </a>
        );
      }
    }
    if ((part.startsWith("**") && part.endsWith("**")) || (part.startsWith("__") && part.endsWith("__"))) {
      const content = part.slice(2, -2);
      return (
        <strong
          key={i}
          className="font-bold"
          style={{ color: role === "user" ? "#FFFFFF" : "#0F172A" }}
        >
          {content}
        </strong>
      );
    }
    return part;
  });
}

