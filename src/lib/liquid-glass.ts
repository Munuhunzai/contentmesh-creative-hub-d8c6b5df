import type { PointerEvent } from "react";

// Update only paint variables; pointer movement does not re-render React components.
export const glassPointer = {
  onPointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--glass-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    node.style.setProperty("--glass-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  },
  onPointerLeave(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.removeProperty("--glass-x");
    event.currentTarget.style.removeProperty("--glass-y");
  },
};
