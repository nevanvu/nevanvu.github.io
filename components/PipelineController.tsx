"use client";

import { useEffect } from "react";

type State = "queued" | "running" | "passed" | "waiting";

// Drives the pipeline: fills the rail as you scroll and moves each stage
// from queued to running to passed. Writes only data attributes and one
// transform per frame, so the work stays on the compositor.
export function PipelineController() {
  useEffect(() => {
    const main = document.querySelector<HTMLElement>("[data-pipeline]");
    const rail = main?.querySelector<HTMLElement>(".rail");
    const fill = rail?.querySelector<HTMLElement>(".rail-fill");
    if (!main || !rail || !fill) return;

    const trigger = main.querySelector<HTMLElement>("[data-trigger]");
    const stages = Array.from(main.querySelectorAll<HTMLElement>("[data-stage]"));
    const nav = stages.map((s) => document.querySelectorAll<HTMLElement>(`[data-nav-for="${s.id}"]`));
    const pageBar = document.querySelector<HTMLElement>("[data-page-progress]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let railTop = 0;
    let railHeight = 1;
    let centers: number[] = [];
    let frame = 0;

    // A stage's node lives in its sticky head, so measure it from the top of
    // its section (which never moves) rather than from wherever it is stuck.
    const nodeCenter = (el: HTMLElement, mainTop: number) => {
      const node = el.querySelector<HTMLElement>(".stage-node")!;
      const head = el.querySelector<HTMLElement>(".stage-head");
      const r = node.getBoundingClientRect();
      const top = head ? el.getBoundingClientRect().top + (r.top - head.getBoundingClientRect().top) : r.top;
      return { y: top + window.scrollY - mainTop + r.height / 2, x: r.left + r.width / 2 };
    };

    const measure = () => {
      const m = main.getBoundingClientRect();
      const mainTop = m.top + window.scrollY;
      const first = nodeCenter(trigger ?? stages[0], mainTop);
      centers = stages.map((s) => nodeCenter(s, mainTop).y);
      railTop = first.y;
      railHeight = Math.max(1, centers[centers.length - 1] - railTop);
      rail.style.left = `${first.x - m.left}px`;
      rail.style.top = `${railTop}px`;
      rail.style.height = `${railHeight}px`;
    };

    const setState = (el: HTMLElement, state: State) => {
      if (el.dataset.state !== state) el.dataset.state = state;
    };

    const update = () => {
      frame = 0;
      const mainTop = main.getBoundingClientRect().top + window.scrollY;
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const atEnd = window.scrollY >= maxScroll - 2;
      // The "read head" sits 60% down the viewport; at the end of the page it
      // jumps past everything so short final sections still complete.
      const head = atEnd ? Infinity : window.scrollY + window.innerHeight * 0.6 - mainTop;

      fill.style.transform = `scaleY(${Math.min(1, Math.max(0, (head - railTop) / railHeight))})`;
      if (pageBar) pageBar.style.transform = `scaleX(${Math.min(1, window.scrollY / maxScroll)})`;

      stages.forEach((stage, i) => {
        const start = centers[i];
        const end = i < stages.length - 1 ? centers[i + 1] : Infinity;
        let state: State = head < start ? "queued" : head < end ? "running" : "passed";
        if (stage.hasAttribute("data-gate") && state !== "queued") state = "waiting";
        setState(stage, state);
        nav[i].forEach((link) => {
          setState(link, state);
          if (state === "running" || state === "waiting") link.setAttribute("aria-current", "step");
          else link.removeAttribute("aria-current");
        });
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // The hero's trigger node is the page-load moment: it runs briefly, then passes.
    let triggerTimer = 0;
    if (trigger) {
      if (reduced.matches) setState(trigger, "passed");
      else {
        setState(trigger, "running");
        triggerTimer = window.setTimeout(() => setState(trigger, "passed"), 1100);
      }
    }

    measure();
    update();
    main.classList.add("is-live");

    const resize = new ResizeObserver(() => {
      measure();
      schedule();
    });
    resize.observe(main);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Webfonts can shift node positions once they load.
    document.fonts?.ready.then(() => {
      measure();
      schedule();
    });

    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      clearTimeout(triggerTimer);
    };
  }, []);

  return null;
}
