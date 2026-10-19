import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const FULL_MOTION = "(prefers-reduced-motion: no-preference)";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION).matches;

export const isTouchDevice = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none), (pointer: coarse)").matches;

let lenis: Lenis | null = null;

export const getLenis = () => lenis;

/**
 * One frame loop for everything: Lenis is driven by GSAP's ticker and feeds
 * ScrollTrigger on every scroll, so scrubbed timelines never lag a frame.
 * Skipped entirely for reduced motion (native scrolling).
 */
export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return () => {};

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    anchors: true, // in-page #links glide instead of jumping
  });

  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

/** Smooth-scroll to an in-page anchor, falling back to native behaviour. */
export function scrollToHash(hash: string) {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;
  if (lenis) {
    lenis.scrollTo(target, { offset: 0, duration: 1.4 });
  } else {
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }
  // Move focus for keyboard and screen-reader users.
  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}
