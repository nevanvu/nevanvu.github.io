"use client";

import { useEffect } from "react";

// A soft light that follows the cursor across a project or Off court card, like glass
// catching light. Only for real pointers (not touch), and it writes two CSS
// variables at most once a frame; the CSS draws and fades the light.
export function CardLightController() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;

    let frame = 0;
    let card: HTMLElement | null = null;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${Math.round(x - r.left)}px`);
      card.style.setProperty("--my", `${Math.round(y - r.top)}px`);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      card = (e.target as Element).closest<HTMLElement>(".project, .interest");
      if (!card) return;
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
