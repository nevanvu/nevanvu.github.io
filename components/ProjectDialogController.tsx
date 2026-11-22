"use client";

import { useEffect } from "react";

// Opens a project's pop-up from its card and keeps the URL in step with it.
//
// The card's "Explore project" link is a plain hash link (#autodrive), so the
// browser adds the history entry itself: the link can be shared, landing on
// it opens the pop-up, and Back closes it. The dialog grows out of the card
// it came from and shrinks back into it on close, faster than it opened.
export function ProjectDialogController() {
  useEffect(() => {
    const dialogs = new Map<string, HTMLDialogElement>();
    document.querySelectorAll<HTMLDialogElement>("[data-project-dialog]").forEach((d) => {
      dialogs.set(d.dataset.projectDialog!, d);
    });
    if (!dialogs.size) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let current: HTMLDialogElement | null = null;
    let origin: HTMLElement | null = null;
    // True when this page added the #slug entry (a click on a card), so
    // closing can step Back instead of leaving a stray entry behind.
    let openedHere = false;

    const hashSlug = () => decodeURIComponent(window.location.hash.slice(1));
    const cardFor = (slug: string) =>
      document.querySelector<HTMLElement>(`[data-project-open="${CSS.escape(slug)}"]`)?.closest<HTMLElement>(".project") ??
      null;

    // Where the dialog starts from (and returns to): the card's centre, at
    // roughly the card's size. Without a card, a short rise from below.
    const fromCard = (d: HTMLDialogElement) => {
      if (!origin) return "translateY(1.5rem) scale(0.96)";
      const c = origin.getBoundingClientRect();
      const r = d.getBoundingClientRect();
      const dx = c.left + c.width / 2 - (r.left + r.width / 2);
      const dy = c.top + c.height / 2 - (r.top + r.height / 2);
      const s = Math.min(0.9, Math.max(0.4, c.width / r.width));
      return `translate(${dx}px, ${dy}px) scale(${s})`;
    };

    const stop = (d: HTMLDialogElement) => d.getAnimations().forEach((a) => a.cancel());

    const fadeBackdrop = (d: HTMLDialogElement, to: 0 | 1, duration: number) => {
      try {
        d.animate({ opacity: to ? [0, 1] : [1, 0] }, { duration, pseudoElement: "::backdrop", fill: "forwards" });
      } catch {
        // Older browsers can't animate ::backdrop; it simply appears.
      }
    };

    const open = (slug: string) => {
      const d = dialogs.get(slug);
      if (!d || d === current) return;
      if (current) close(current, false);
      origin = cardFor(slug);
      stop(d);
      d.showModal();
      // Start at the top each time (only possible once it's shown).
      d.querySelector(".dialog-scroll")?.scrollTo(0, 0);
      current = d;
      if (reduced.matches) {
        d.animate({ opacity: [0, 1] }, { duration: 150, easing: "ease-out" });
        fadeBackdrop(d, 1, 150);
      } else {
        d.animate(
          { transform: [fromCard(d), "none"], opacity: [0, 1] },
          { duration: 450, easing: "cubic-bezier(0.2, 0.9, 0.25, 1)" },
        );
        fadeBackdrop(d, 1, 300);
      }
    };

    const close = (d: HTMLDialogElement, animated = true) => {
      if (current === d) current = null;
      stop(d);
      if (!animated || !d.open) {
        if (d.open) d.close();
        return;
      }
      const duration = reduced.matches ? 120 : 240;
      const motion = reduced.matches
        ? d.animate({ opacity: [1, 0] }, { duration, fill: "forwards" })
        : d.animate(
            { transform: ["none", fromCard(d)], opacity: [1, 0] },
            { duration, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" },
          );
      fadeBackdrop(d, 0, duration);
      motion.finished
        .then(() => {
          stop(d);
          if (d !== current && d.open) d.close();
        })
        .catch(() => {
          // Cancelled because it was reopened mid-close; nothing to tidy.
        });
    };

    // The URL is the source of truth: #slug means that pop-up is open.
    const sync = () => {
      const slug = hashSlug();
      if (dialogs.has(slug)) open(slug);
      else if (current) close(current);
    };

    // Close from inside (the X, Esc, a click outside): step Back if this page
    // added the entry, otherwise just drop the hash from the address.
    const requestClose = () => {
      if (!current) return;
      if (openedHere) {
        openedHere = false;
        history.back();
      } else {
        history.replaceState(history.state, "", window.location.pathname + window.location.search);
        close(current);
      }
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest("[data-project-open]")) openedHere = true;
    };

    const onDialogClick = (e: MouseEvent) => {
      const d = e.currentTarget as HTMLDialogElement;
      // The dialog has no padding, so a click on it (not its contents) is a
      // click on the dimmed backdrop around it.
      if (e.target === d || (e.target as Element).closest("[data-dialog-close]")) requestClose();
    };

    const onCancel = (e: Event) => {
      e.preventDefault(); // Esc: close the same way as the X, with motion.
      requestClose();
    };

    // If the browser closes it on its own (a repeated Esc), tidy the URL.
    const onNativeClose = (e: Event) => {
      const d = e.currentTarget as HTMLDialogElement;
      if (current === d) current = null;
      if (hashSlug() === d.dataset.projectDialog) {
        if (openedHere) {
          openedHere = false;
          history.back();
        } else {
          history.replaceState(history.state, "", window.location.pathname + window.location.search);
        }
      }
    };

    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", sync);
    dialogs.forEach((d) => {
      d.addEventListener("click", onDialogClick);
      d.addEventListener("cancel", onCancel);
      d.addEventListener("close", onNativeClose);
    });
    sync();

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", sync);
      dialogs.forEach((d) => {
        d.removeEventListener("click", onDialogClick);
        d.removeEventListener("cancel", onCancel);
        d.removeEventListener("close", onNativeClose);
        stop(d);
        if (d.open) d.close();
      });
    };
  }, []);

  return null;
}
