import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [isInStudio, setIsInStudio] = useState(false);

  // Direct mouse position motion values (instant 1:1 hardware device tracking)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const lastTargetRef = useRef<EventTarget | null>(null);

  useEffect(() => {
    // Detect Sanity Studio route
    if (typeof window !== "undefined") {
      const isStudio =
        window.location.pathname.startsWith("/studio") ||
        Boolean(document.getElementById("sanity") || document.querySelector('[id*="sanity"]'));
      setIsInStudio(isStudio);
      if (isStudio) {
        document.body.classList.add("sanity-studio");
      } else {
        document.body.classList.remove("sanity-studio");
      }
    }

    // Detect touch device
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const touch = isCoarse || hasTouch;
    setIsTouchDevice(touch);

    if (touch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Inspect target only when pointer enters a new DOM element (avoids continuous state re-renders)
      if (e.target !== lastTargetRef.current) {
        lastTargetRef.current = e.target;
        const target = e.target as HTMLElement | null;

        if (target) {
          const isText = Boolean(
            target.tagName === "INPUT" ||
              target.tagName === "TEXTAREA" ||
              target.isContentEditable ||
              target.closest('input, textarea, [contenteditable="true"]')
          );

          const isClickable =
            !isText &&
            Boolean(
              target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.getAttribute("role") === "button" ||
                target.classList.contains("cursor-pointer") ||
                target.closest("button, a, [role='button'], .cursor-pointer")
            );

          if (cursorRef.current) {
            if (isText) {
              cursorRef.current.style.opacity = "0";
            } else {
              cursorRef.current.style.opacity = "1";
              if (isClickable) {
                cursorRef.current.style.transform = "scale(1.3)";
                cursorRef.current.style.filter = "drop-shadow(0 0 12px rgba(255, 90, 31, 0.8))";
              } else {
                cursorRef.current.style.transform = "scale(1)";
                cursorRef.current.style.filter = "drop-shadow(0 0 5px rgba(255, 90, 31, 0.35))";
              }
            }
          }
        }
      }
    };

    const handleMouseDown = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = "scale(0.85)";
      }
    };

    const handleMouseUp = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = "scale(1)";
      }
    };

    const handleMouseLeave = () => {
      mouseX.set(-100);
      mouseY.set(-100);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  // Completely disable on touch devices or inside Sanity Studio
  if (isTouchDevice || isInStudio) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[999999] select-none will-change-transform"
      style={{
        x: mouseX,
        y: mouseY,
      }}
    >
      <div
        ref={cursorRef}
        className="relative h-7 w-7 transition-all duration-150 ease-out origin-top-left"
        style={{
          filter: "drop-shadow(0 0 5px rgba(255, 90, 31, 0.35))",
        }}
      >
        <img
          src="/cursor.webp"
          alt=""
          width={28}
          height={28}
          className="h-full w-full object-contain pointer-events-none"
          loading="eager"
          decoding="async"
        />
      </div>
    </motion.div>
  );
}
