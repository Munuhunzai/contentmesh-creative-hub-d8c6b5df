import { useEffect, useState, lazy, Suspense, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AmbientBackground } from "./AmbientBackground";

const FloatingChatbot = lazy(() =>
  import("@/components/chat/FloatingChatbot").then((m) => ({ default: m.FloatingChatbot })),
);

interface SiteLayoutProps {
  children: ReactNode;
  /** Optional full-bleed slot rendered BEFORE the padded main (e.g. full-screen Hero). */
  heroSlot?: ReactNode;
  noTopPadding?: boolean;
}

export function SiteLayout({ children, heroSlot, noTopPadding }: SiteLayoutProps) {
  const [showTop, setShowTop] = useState(false);
  const [loadChatbot, setLoadChatbot] = useState(false);

  useEffect(() => {
    const on = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    // Defer loading chatbot bundle until initial viewport paint & user interaction occurs
    const enableChatbot = () => setLoadChatbot(true);
    const timer = setTimeout(enableChatbot, 2000);
    window.addEventListener("mousemove", enableChatbot, { once: true, passive: true });
    window.addEventListener("touchstart", enableChatbot, { once: true, passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", enableChatbot);
      window.removeEventListener("touchstart", enableChatbot);
    };
  }, []);

  return (
    <div className="folded-paper-site relative min-h-dvh w-full max-w-full overflow-x-hidden">
      <AmbientBackground />
      <Navbar />
      {/* Hero renders here — behind the fixed navbar, no pt-28 */}
      {heroSlot}
      <main
        className={`w-full max-w-full overflow-x-hidden ${heroSlot || noTopPadding ? "pt-16 sm:pt-20" : "pt-28"}`}
      >
        {children}
      </main>
      <Footer />
      {loadChatbot && (
        <Suspense fallback={null}>
          <FloatingChatbot />
        </Suspense>
      )}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="glass-strong glass-reflect fixed bottom-28 left-6 z-40 grid h-12 w-12 place-items-center rounded-full text-foreground shadow-float transition-transform hover:scale-105"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
