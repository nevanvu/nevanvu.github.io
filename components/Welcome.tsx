"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { StageIcon } from "@/components/StageIcon";

const jobs = ["Say hello", "Build portfolio", "Deploy to you"];

// When the welcome lifts, the boot script's failsafe stops waiting and the
// pipeline's own intro (paused behind this screen) starts playing.
export const WELCOME_DONE = "nv:welcome-done";

// The first-visit greeting: a pane of liquid glass with the time, a greeting
// for the time of day, and a tiny CI run that boots the portfolio. When the
// run passes (or the visitor clicks, scrolls or presses a key) the glass
// zooms away and the pipeline intro plays underneath. It only shows when the
// boot script in layout.tsx flags html.welcome, so without JS, with reduced
// motion, on reloads and on deep links the page opens straight away.
export function Welcome({ style }: { style?: CSSProperties }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const html = document.documentElement;
    if (!el || !html.classList.contains("welcome")) return;

    const card = el.querySelector<HTMLElement>(".welcome-card")!;
    const time = el.querySelector<HTMLElement>("[data-welcome-time]")!;
    const date = el.querySelector<HTMLElement>("[data-welcome-date]")!;
    const enter = el.querySelector<HTMLButtonElement>("[data-welcome-enter]")!;
    const rows = Array.from(el.querySelectorAll<HTMLElement>("[data-job]"));
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    // The clock: hours and minutes in the visitor's own locale, kept current.
    const tick = () => {
      const now = new Date();
      time.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      date.textContent = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
      el.dataset.clock = "ready";
      later(tick, 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds()));
    };
    tick();

    // Everything behind the glass is out of reach until it lifts.
    const behind = Array.from(document.body.children).filter(
      (c): c is HTMLElement => c !== el && c instanceof HTMLElement && c.tagName !== "SCRIPT",
    );
    behind.forEach((c) => (c.inert = true));
    enter.focus({ preventScroll: true });

    let left = false;
    const leave = () => {
      if (left) return;
      left = true;
      timers.forEach(clearTimeout);
      el.dataset.phase = "leaving";
      html.classList.remove("welcome");
      behind.forEach((c) => (c.inert = false));
      enter.blur();
      window.dispatchEvent(new Event(WELCOME_DONE));
      window.setTimeout(() => (el.hidden = true), 900);
      detach();
    };

    // The run: each job goes running, then passed, one after another.
    const start = 500;
    const step = 520;
    rows.forEach((row, i) => {
      later(() => (row.dataset.state = "running"), start + i * step);
      later(() => (row.dataset.state = "passed"), start + (i + 1) * step - 60);
    });
    later(() => (el.dataset.run = "passed"), start + rows.length * step);
    later(leave, start + rows.length * step + 900);

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

    // Any sign the visitor wants in skips straight to the portfolio.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key === "Shift" || e.metaKey || e.ctrlKey || e.altKey) return;
      leave();
    };
    const detach = () => {
      el.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeaveWindow);
      el.removeEventListener("click", leave);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", leave);
      window.removeEventListener("touchmove", leave);
    };
    if (fine) {
      el.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeaveWindow);
    }
    el.addEventListener("click", leave);
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", leave, { passive: true });
    window.addEventListener("touchmove", leave, { passive: true });

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(frame);
      detach();
    };
  }, []);

  return (
    <div ref={root} className="welcome-screen" style={style} role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="welcome-ambient" aria-hidden="true">
        <span className="welcome-orb welcome-orb-1" />
        <span className="welcome-orb welcome-orb-2" />
        <span className="welcome-orb welcome-orb-3" />
      </div>

      <div className="welcome-stage">
        <div className="welcome-card">
          <span className="welcome-sheen" aria-hidden="true" />

          <div className="welcome-clock">
            <p className="welcome-time" data-welcome-time>
              {" "}
            </p>
            <p className="welcome-date" data-welcome-date>
              {" "}
            </p>
          </div>

          <h2 id="welcome-title" className="welcome-hello">
            <span data-daypart="morning">Good morning.</span>
            <span data-daypart="afternoon">Good afternoon.</span>
            <span data-daypart="evening">Good evening.</span>
          </h2>
          <p className="welcome-lead">
            Welcome in. This portfolio runs like a CI/CD pipeline, so each section is a stage that passes as you
            scroll.
          </p>

          <ol className="welcome-run" aria-label="Starting the portfolio">
            {jobs.map((job) => (
              <li key={job} className="welcome-job" data-job data-state="queued">
                <span className="welcome-job-icon" aria-hidden="true">
                  <StageIcon />
                </span>
                <span>{job}</span>
              </li>
            ))}
          </ol>

          <button type="button" className="button button-primary welcome-enter" data-welcome-enter>
            Enter portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
