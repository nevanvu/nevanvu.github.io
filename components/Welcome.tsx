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
    // highlight follows it. The easing runs on elapsed time, not frames, so
    // it moves with the same weight on a 60Hz screen as on a 120Hz one: it
    // closes 63% of the gap every 130ms, like a critically damped follow.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const tau = 130;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let frame = 0;
    let last = 0;
    const paint = (now: number) => {
      const k = 1 - Math.exp(-Math.min(64, now - (last || now - 16)) / tau);
      last = now;
      x += (tx - x) * k;
      y += (ty - y) * k;
      card.style.setProperty("--tilt-x", x.toFixed(4));
      card.style.setProperty("--tilt-y", y.toFixed(4));
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.001) frame = requestAnimationFrame(paint);
      else {
        frame = 0;
        last = 0;
      }
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      // The button's glass catches a highlight where the pointer is.
      const b = enter.getBoundingClientRect();
      enter.style.setProperty("--bx", `${Math.round(e.clientX - b.left)}px`);
      enter.style.setProperty("--by", `${Math.round(e.clientY - b.top)}px`);
      const r = card.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
      start();
    };
    // Level the glass when the pointer leaves the window or the tab loses
    // focus, so it never stays leaning toward a cursor that isn't there.
    const onLeaveWindow = () => {
      tx = 0;
      ty = 0;
      start();
    };

    // Only the button lets the visitor in (it also answers Enter and Space).
    const detach = () => {
      el.removeEventListener("pointermove", onMove);
      html.removeEventListener("mouseleave", onLeaveWindow);
      window.removeEventListener("blur", onLeaveWindow);
      enter.removeEventListener("click", run);
    };
    if (fine) {
      el.addEventListener("pointermove", onMove, { passive: true });
      html.addEventListener("mouseleave", onLeaveWindow);
      window.addEventListener("blur", onLeaveWindow);
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
      {/* The "goo" that makes the button's light behave like liquid: blur
          the blobs together, then snap their soft edges back to a crisp
          outline, so where two meet they merge with a smooth neck. */}
      <svg className="welcome-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <filter id="welcome-goo" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" />
        </filter>
      </svg>

      <div className="welcome-ambient" aria-hidden="true">
        <span className="welcome-orb welcome-orb-1" />
        <span className="welcome-orb welcome-orb-2" />
        <span className="welcome-orb welcome-orb-3" />
      </div>

      {/* The seed: a ▶ inside the glass orb the card grows out of. It sits
          outside the card so the card's stretch doesn't squash it. */}
      <span className="welcome-seed" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28" focusable="false">
          <path d="M8 5.6v12.8a1 1 0 0 0 1.5.86l10.2-6.4a1 1 0 0 0 0-1.72L9.5 4.74A1 1 0 0 0 8 5.6Z" />
        </svg>
      </span>

      {/* The welcome the pill holds before it opens into the card, like a
          notification. It sits outside the card so the stretch doesn't
          squash it; the card's own heading is what screen readers get. */}
      <p className="welcome-intro" aria-hidden="true">
        <span className="welcome-intro-word">{welcome.greeting}</span>
        <span className="welcome-intro-sub">{welcome.greetingSub}</span>
      </p>

      <div className="welcome-stage">
        <div className="welcome-card">
          <span className="welcome-sheen" aria-hidden="true" />

          {/* Two lines, like an alarm clock's greeting: a warm hello for the
              visitor's time of day, then the invitation. */}
          <header className="welcome-head">
            <p className="welcome-hi">
              <span className="welcome-greeting">
                <span data-daypart="morning">Good morning</span>
                <span data-daypart="afternoon">Good afternoon</span>
                <span data-daypart="evening">Good evening</span>
              </span>
              , {welcome.hello}
            </p>
            <h2 id="welcome-title" className="welcome-title">
              {welcome.headline}
            </h2>
            <p id="welcome-sub" className="welcome-sub">
              {welcome.subline}
            </p>
          </header>

          {/* The display: an inset pane of glass, like the clock face. A
              status row with the time, then the five stages, numbered and
              dimmed like unlit segments until the visitor runs them; then
              each lights up and spins the pipeline's "running" glyph, a
              little out of step with the next. */}
          <div className="welcome-display">
            <p className="welcome-display-status">
              <span>{welcome.display}</span>
              <span className="welcome-time" data-welcome-time>
                {"\u00a0"}
              </span>
            </p>
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
                  <span className="welcome-step-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {stage.label}
                </li>
              ))}
            </ol>
          </div>

          {/* The control, like the alarm's Snooze: a wide pill that runs the
              pipeline. */}
          <div className="welcome-actions">
            <button type="button" className="button welcome-enter" data-welcome-enter>
              {/* Liquid light inside the glass: blobs that drift, meet and
                  merge, plus one that follows the pointer. */}
              <span className="welcome-liquid" aria-hidden="true">
                <i />
                <i />
                <i className="welcome-liquid-pointer" />
              </span>
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false" className="welcome-play">
                <path d="M8 5.6v12.8a1 1 0 0 0 1.5.86l10.2-6.4a1 1 0 0 0 0-1.72L9.5 4.74A1 1 0 0 0 8 5.6Z" />
              </svg>
              {/* The running label sits invisibly underneath, so the pill is
                  already wide enough and doesn't jump when the text changes. */}
              <span className="welcome-label">
                <span data-welcome-label>{welcome.cta}</span>
                <span className="welcome-label-ghost" aria-hidden="true">
                  {welcome.running}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
