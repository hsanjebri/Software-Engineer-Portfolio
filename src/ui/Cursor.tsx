import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";
import "./Cursor.css";

type Mode = "caret" | "text" | "card" | "link";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const INTERACTIVE = "a, button, summary, [role='button'], [data-cursor-label]";
const CARD = ".card, .mini";
const TEXT = "p, li, h1, h2, h3, h4, dt, dd, figcaption, blockquote";

/** Short verb shown in the pill for an interactive element. */
function labelFor(el: Element) {
  const custom = el.getAttribute("data-cursor-label");
  if (custom) return custom;
  if (el.tagName === "SUMMARY") return (el.parentElement as HTMLDetailsElement)?.open ? "Close" : "More";
  const href = el.getAttribute("href") ?? "";
  if (href.startsWith("mailto:")) return "Email";
  if (el.getAttribute("target") === "_blank") return "Open";
  if (href.startsWith("#")) return "Go";
  if (el.tagName === "A") return "View";
  return "Click";
}

/**
 * Code-editor caret cursor.
 *  - default: blinking caret that trails the pointer
 *  - links/buttons: a blue pill with a one-word label
 *  - project cards: { } brackets around the point
 *  - text: a thin, tall I-beam
 *  - press: quick squash and pop; buttons lean toward the pointer
 * Only mounted for fine pointers; reduced motion snaps instead of trailing.
 */
const Cursor = () => {
  const [enabled, setEnabled] = useState(
    () => typeof window !== "undefined" && window.matchMedia(FINE_POINTER).matches
  );
  // Two layers: the caret blends with the page (difference), the pill doesn't.
  const blendLayer = useRef<HTMLDivElement>(null);
  const pillLayer = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("caret");
  const [label, setLabel] = useState("");
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(FINE_POINTER);
    const onChange = () => setEnabled(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled || !blendLayer.current || !pillLayer.current) return;
    const layers = [blendLayer.current, pillLayer.current];
    const inners = layers.map((l) => l.firstElementChild);
    const reduced = prefersReducedMotion();
    document.documentElement.classList.add("has-cursor");

    const follow = reduced ? 0.001 : 0.28;
    const movers = layers.map((l) => [
      gsap.quickTo(l, "x", { duration: follow, ease: "power3" }),
      gsap.quickTo(l, "y", { duration: follow, ease: "power3" }),
    ]);

    // Magnetic buttons: the hovered button leans toward the pointer.
    let magnet: HTMLElement | null = null;
    const release = () => {
      if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      magnet = null;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      movers.forEach(([xTo, yTo]) => {
        xTo(e.clientX);
        yTo(e.clientY);
      });
      setHidden(false);

      if (reduced) return;
      const btn = (e.target as Element).closest<HTMLElement>(".btn, .nav__cta");
      if (btn !== magnet) release();
      if (btn) {
        magnet = btn;
        const r = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.28,
          y: (e.clientY - (r.top + r.height / 2)) * 0.35,
          duration: 0.4,
          ease: "power3.out",
        });
      }
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as Element;
      const interactive = t.closest(INTERACTIVE);
      if (interactive) {
        setMode("link");
        setLabel(labelFor(interactive));
      } else if (t.closest(CARD)) {
        setMode("card");
      } else if (t.closest(TEXT)) {
        setMode("text");
      } else {
        setMode("caret");
      }
    };

    const onDown = () =>
      gsap.to(inners, { scaleX: 1.35, scaleY: 0.7, duration: 0.08, ease: "power2.out", overwrite: true });
    const onUp = () =>
      gsap.to(inners, {
        scaleX: 1,
        scaleY: 1,
        duration: reduced ? 0.15 : 0.6,
        ease: reduced ? "none" : "elastic.out(1, 0.35)",
        overwrite: true,
      });
    const onLeave = () => setHidden(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      release();
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const state = `cursor--${mode}${hidden ? " cursor--hidden" : ""}`;
  return (
    <>
      <div ref={blendLayer} className={`cursor cursor--blend ${state}`} aria-hidden="true">
        <div className="cursor__inner">
          <span className="cursor__caret" />
          <span className="cursor__bracket cursor__bracket--l">{"{"}</span>
          <span className="cursor__bracket cursor__bracket--r">{"}"}</span>
        </div>
      </div>
      <div ref={pillLayer} className={`cursor ${state}`} aria-hidden="true">
        <div className="cursor__inner">
          <span className="cursor__pill">{label}</span>
        </div>
      </div>
    </>
  );
};

export default Cursor;
