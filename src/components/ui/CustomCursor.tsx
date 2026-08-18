import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isOverTextField, setIsOverTextField] = useState(false);
  const [isInStudio, setIsInStudio] = useState(false);
  const [speed, setSpeed] = useState(0);

  // Direct mouse position motion values (instant 1:1 hardware device tracking)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const speedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPosRef = useRef({ x: 0, y: 0, time: performance.now() });

  useEffect(() => {
    // Detect Sanity Studio route
    const checkStudio = () => {
      const isStudio =
        typeof window !== "undefined" &&
        (window.location.pathname.startsWith("/studio") ||
          Boolean(document.getElementById("sanity") || document.querySelector('[id*="sanity"]')));

      setIsInStudio(isStudio);
      if (isStudio) {
        document.body.classList.add("sanity-studio");
      } else {
        document.body.classList.remove("sanity-studio");
      }
    };

    checkStudio();
    window.addEventListener("popstate", checkStudio);
    const interval = setInterval(checkStudio, 500);

    // Detect touch device
    const checkTouch = () => {
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(isCoarse || hasTouch);
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(now - lastPosRef.current.time, 16);
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const distance = Math.hypot(dx, dy);
      const currentSpeed = distance / dt; // px per ms

      lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };

      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Speed stretch calculation (subtly stretch orange streaks during fast movement)
      const normalizedSpeed = Math.min(currentSpeed * 12, 1);
      setSpeed(normalizedSpeed);

      if (speedTimeoutRef.current) clearTimeout(speedTimeoutRef.current);
      speedTimeoutRef.current = setTimeout(() => setSpeed(0), 40);

      // Check target under pointer
      const target = e.target as HTMLElement | null;
      if (target) {
        // Text field detection
        const isText = Boolean(
          target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable ||
            target.closest(
              'input[type="text"], input[type="email"], input[type="search"], input[type="password"], textarea, [contenteditable="true"]'
            )
        );
        setIsOverTextField(isText);

        // Clickable element detection
        const isClickable =
          !isText &&
          Boolean(
            target.tagName === "BUTTON" ||
              target.tagName === "A" ||
              target.getAttribute("role") === "button" ||
              target.onclick !== null ||
              target.classList.contains("cursor-pointer") ||
              target.closest("button, a, [role='button'], .cursor-pointer")
          );

        setIsHovered(isClickable);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => {
      mouseX.set(-100);
      mouseY.set(-100);
      setSpeed(0);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("popstate", checkStudio);
      clearInterval(interval);
      window.removeEventListener("resize", checkTouch);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (speedTimeoutRef.current) clearTimeout(speedTimeoutRef.current);
    };
  }, [mouseX, mouseY]);

  // Completely disable on touch devices, in Sanity Studio, or over text fields
  if (isTouchDevice || isOverTextField || isInStudio) {
    return null;
  }

  // Sizing for split arrow cursor: ~28px height normal, ~36px on clickable links/buttons
  const width = isHovered ? 24 : 18;
  const height = isHovered ? 36 : 28;

  // Motion stretch & click compression
  const scaleXStretch = 1 + speed * 0.2; // subtle stretch on fast motion
  const clickScale = isClicked ? 0.85 : 1; // 85% compression on mousedown

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[999999] select-none will-change-transform"
      style={{
        x: mouseX,
        y: mouseY,
      }}
    >
      <motion.div
        animate={{
          width: width,
          height: height,
          scaleX: scaleXStretch * clickScale,
          scaleY: clickScale,
          filter: isHovered
            ? "drop-shadow(0 0 12px rgba(255, 90, 31, 0.8)) drop-shadow(0 0 20px rgba(255, 90, 31, 0.45))"
            : "drop-shadow(0 0 5px rgba(255, 90, 31, 0.35))",
        }}
        transition={{
          width: { duration: 0.15, ease: "easeOut" },
          height: { duration: 0.15, ease: "easeOut" },
          scaleX: { duration: 0.06, ease: "easeOut" },
          scaleY: { duration: 0.06, ease: "easeOut" },
          filter: { duration: 0.2 },
        }}
        className="relative"
        style={{
          transformOrigin: "top left",
        }}
      >
        <img
          src="/cursor.png"
          alt=""
          className="h-full w-full object-contain pointer-events-none"
        />
      </motion.div>
    </motion.div>
  );
}
