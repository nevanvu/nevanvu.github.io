"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { StageIcon } from "@/components/StageIcon";
import { stages, welcome } from "@/content";

// When the welcome lifts, the boot script's failsafe stops waiting and the
// pipeline's own intro (paused behind this screen) starts playing.
export const WELCOME_DONE = "nv:welcome-done";

// The first-visit invitation: a pane of liquid glass with the time and a
// greeting for the time of day, then an invitation to run the pipeline, with
// its five stages listed as a preview, idle. It stays until the visitor
// presses "Run pipeline"; the stages then spin for a moment, the glass zooms
// away and the pipeline intro plays underneath. It only shows when the boot script in layout.tsx flags
// html.welcome, so without JS, with reduced motion, on
// reloads and on deep links the page opens straight away.
export function Welcome({ style }: { style?: CSSProperties }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const html = document.documentElement;
    if (!el || !html.classList.contains("welcome")) return;
    // Tells the boot script's failsafe the app is running, so it stops
    // watching: from here only the button lifts the welcome.
    html.dataset.welcomeReady = "";

    const card = el.querySelector<HTMLElement>(".welcome-card")!;
    const time = el.querySelector<HTMLElement>("[data-welcome-time]")!;
    const enter = el.querySelector<HTMLButtonElement>("[data-welcome-enter]")!;
    const label = enter.querySelector<HTMLElement>("[data-welcome-label]")!;
    const steps = Array.from(el.querySelectorAll<HTMLElement>("[data-welcome-stage]"));
    let runTimer = 0;
    let clock = 0;

    // The clock: hours and minutes in the visitor's own locale, kept current.
    const tick = () => {
      const now = new Date();
      time.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      el.dataset.clock = "ready";
      clock = window.setTimeout(tick, 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds()));
    };
    tick();

    // Everything behind the glass is out of reach until it lifts.
    const behind = Array.from(document.body.children).filter(
      (c): c is HTMLElement => c !== el && c instanceof HTMLElement && c.tagName !== "SCRIPT",
    );
    behind.forEach((c) => (c.inert = true));
    // Focus starts on the button so Enter or Space runs it, but the ring only
    // shows once the visitor uses the keyboard, not on load for everyone.
    enter.focus({ preventScroll: true, focusVisible: false });

    // The run: every stage starts spinning at once, and after a moment the
    // portfolio opens. Further clicks while it spins do nothing.
    let ran = false;
    const run = () => {
      if (ran) return;
      ran = true;
      el.dataset.run = "";
      enter.setAttribute("aria-disabled", "true");
      label.textContent = welcome.running;
      steps.forEach((step) => (step.dataset.state = "running"));
      runTimer = window.setTimeout(leave, 700);
    };

    let left = false;
    const leave = () => {
      if (left) return;
      left = true;
      clearTimeout(clock);
      el.dataset.phase = "leaving";
      html.classList.remove("welcome");
      behind.forEach((c) => (c.inert = false));
      enter.blur();
      window.dispatchEvent(new Event(WELCOME_DONE));
      window.setTimeout(() => (el.hidden = true), 900);
      detach();
    };

    // A pane you can lean: the glass tilts toward the pointer and a soft
    // highlight follows it, eased each frame so it moves like it has weight.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let frame = 0;
    const paint = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      card.style.setProperty("--tilt-x", x.toFixed(4));
      card.style.setProperty("--tilt-y", y.toFixed(4));
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(paint) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = card.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onLeaveWindow = () => {
      tx = 0;
      ty = 0;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    // Only the button lets the visitor in (it also answers Enter and Space).
    const detach = () => {
      el.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeaveWindow);
      enter.removeEventListener("click", run);
    };
    if (fine) {
      el.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeaveWindow);
    }
    enter.addEventListener("click", run);

    return () => {
      clearTimeout(clock);
      clearTimeout(runTimer);
      cancelAnimationFrame(frame);
      detach();
    };
  }, []);

  return (
    <div ref={root} className="welcome-screen" style={style} role="dialog" aria-modal="true" aria-labelledby="welcome-title" aria-describedby="welcome-sub">
      <div className="welcome-ambient" aria-hidden="true">
        <span className="welcome-orb welcome-orb-1" />
        <span className="welcome-orb welcome-orb-2" />
        <span className="welcome-orb welcome-orb-3" />
      </div>

      <div className="welcome-stage">
        <div className="welcome-card">
          <span className="welcome-sheen" aria-hidden="true" />

          {/* The greeting for the visitor's time of day, then the time. */}
          <p className="welcome-meta">
            <span className="welcome-greeting">
              <span data-daypart="morning">Good morning</span>
              <span data-daypart="afternoon">Good afternoon</span>
              <span data-daypart="evening">Good evening</span>
            </span>
            <span className="welcome-dot" aria-hidden="true" />
            <span className="welcome-time" data-welcome-time>
              {" "}
            </span>
          </p>

          <p className="welcome-hi">{welcome.hello}</p>
          <h2 id="welcome-title" className="welcome-title">
            {welcome.headline}
          </h2>
          <p id="welcome-sub" className="welcome-sub">
            {welcome.subline}
          </p>

          {/* What's coming: the five stages, idle with the pipeline's
              "queued" glyph until the visitor runs them; then each spins the
              "running" glyph, a little out of step with the next. */}
          <ol className="welcome-stages" aria-label="Pipeline stages">
            {stages.map((stage, i) => (
              <li
                key={stage.id}
                className="welcome-step"
                data-welcome-stage
                data-state="queued"
                style={{ "--i": i } as CSSProperties}
              >
                <span className="welcome-step-icon" aria-hidden="true">
                  <StageIcon />
                </span>
                {stage.label}
              </li>
            ))}
          </ol>

          <button type="button" className="button button-primary welcome-enter" data-welcome-enter>
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false" className="welcome-play">
              <path d="M8 5.6v12.8a1 1 0 0 0 1.5.86l10.2-6.4a1 1 0 0 0 0-1.72L9.5 4.74A1 1 0 0 0 8 5.6Z" />
            </svg>
            <span data-welcome-label>{welcome.cta}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
