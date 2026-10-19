import { gsap, ScrollTrigger, FULL_MOTION } from "./motion";

/**
 * Page-wide scroll scenes, set up once after every section has mounted:
 *
 *  - Sheet transitions: each `.sheet` section slides up over the previous one
 *    with rounded corners that flatten as it arrives, while the section it
 *    covers sinks back (scale + fade), so every hand-off feels like one motion.
 *  - Generic reveals: `[data-reveal]` fades up, `[data-reveal="words"]` lifts
 *    each word out of its mask. All scrubbed by scroll position.
 *
 * Returns a cleanup function. With reduced motion nothing animates.
 */
export function initPageScenes(root: HTMLElement) {
  const mm = gsap.matchMedia();

  mm.add(FULL_MOTION, () => {
    root.querySelectorAll<HTMLElement>(".sheet").forEach((sheet) => {
      gsap.fromTo(
        sheet,
        { "--r": "44px" },
        {
          "--r": "0px",
          ease: "none",
          scrollTrigger: { trigger: sheet, start: "top bottom", end: "top top", scrub: true },
        }
      );

      const prev = sheet.previousElementSibling?.querySelector<HTMLElement>(":scope > [data-exit]");
      if (!prev) return;
      gsap.fromTo(
        prev,
        { y: 0, scale: 1, opacity: 1 },
        {
          y: () => window.innerHeight * 0.18,
          scale: 0.94,
          opacity: 0.25,
          ease: "none",
          transformOrigin: "50% 100%",
          scrollTrigger: {
            trigger: sheet,
            start: "top bottom",
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    root.querySelectorAll<HTMLElement>('[data-reveal="up"]').forEach((el) => {
      gsap.fromTo(
        el,
        { y: 56, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", end: "top 62%", scrub: 0.5 },
        }
      );
    });

    root.querySelectorAll<HTMLElement>('[data-reveal="words"]').forEach((el) => {
      gsap.fromTo(
        el.querySelectorAll(".w__in"),
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", end: "top 50%", scrub: 0.5 },
        }
      );
    });
  });

  // Images and fonts can change section heights; re-measure once settled.
  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener("load", refresh, { once: true });

  return () => {
    window.removeEventListener("load", refresh);
    mm.revert();
  };
}
