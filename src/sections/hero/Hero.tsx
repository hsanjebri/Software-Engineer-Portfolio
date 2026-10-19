import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { config } from "../../config";
import { heroTiles } from "../../data/site";
import { gsap, FULL_MOTION, prefersReducedMotion } from "../../lib/motion";
import MacBook from "./mac/MacBook";
import "./Hero.css";

const nameWords = config.developer.fullName.split(" ");
// The old landing showed both roles; config only stores the first.
const roles = [config.developer.title, "Full-Stack Developer"];

/**
 * Hero: the name rises in among floating logos; on scroll a laptop rises, its
 * lid swings open and it boots into a small desktop people can play with.
 */
const Hero = () => {
  const root = useRef<HTMLElement>(null);
  const [booted, setBooted] = useState(prefersReducedMotion);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    // ---------- Load: name, roles, logo tiles ----------
    mm.add(FULL_MOTION, () => {
      gsap
        .timeline({ defaults: { ease: "expo.out" }, delay: 0.15 })
        .fromTo(
          q(".hero__word"),
          { yPercent: 105, opacity: 0, filter: "blur(10px)" },
          { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 1.4, stagger: 0.12 }
        )
        .fromTo(q(".hero__subtitle"), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, "-=1.0")
        .fromTo(q(".hero__hint"), { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.6")
        .fromTo(q(".hero__glow"), { opacity: 0 }, { opacity: 1, duration: 2.4, ease: "power2.out" }, 0);

      (q(".tile") as HTMLElement[]).forEach((tile, i) => {
        const fromX = (50 - Number(tile.dataset.x)) / 100;
        const fromY = (50 - Number(tile.dataset.y)) / 100;
        gsap.fromTo(
          tile.querySelector(".tile__in"),
          {
            x: () => fromX * window.innerWidth,
            y: () => fromY * window.innerHeight,
            scale: 0.2,
            rotate: gsap.utils.random(-50, 50),
            opacity: 0,
            filter: "blur(12px)",
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            rotate: Number(tile.dataset.tilt),
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.8,
            ease: "expo.out",
            delay: 0.55 + i * 0.07,
          }
        );
      });
    });

    // ---------- Scroll: laptop rises, lid opens, it boots ----------
    mm.add(FULL_MOTION, () => {
      const stage = q(".hero__stage")[0] as HTMLElement;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
      });

      tl.to(q(".hero__intro"), { yPercent: -12, scale: 0.94, opacity: 0, ease: "power1.in", duration: 0.6 }, 0)
        .fromTo(q(".hero__glow"), { scale: 0.85 }, { scale: 1.2, duration: 5 }, 0)
        .to(q(".hero__glow"), { opacity: 0.6, duration: 1 }, 1.4);

      // The logos fly past the camera to make room for the laptop.
      (q(".tile") as HTMLElement[]).forEach((tile) => {
        const d = Number(tile.dataset.depth);
        const dx = (Number(tile.dataset.x) - 50) / 50;
        const dy = (Number(tile.dataset.y) - 50) / 50;
        tl.to(
          tile,
          {
            x: () => dx * window.innerWidth * 0.75,
            y: () => dy * window.innerHeight * 0.75,
            scale: 2 + d * 1.6,
            opacity: 0,
            ease: "power2.in",
            duration: 1.3,
          },
          0.1 + (1 - d) * 0.35
        );
      });

      // The laptop rises with its screen leaned far back (seen from above),
      // then swings upright to face the viewer, Apple-keynote style.
      tl.fromTo(
        q(".mac"),
        { y: () => stage.clientHeight * 0.45, scale: 0.82, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, ease: "power2.out", duration: 1.4 },
        0.1
      )
        .fromTo(q(".mac__lid"), { rotationX: 64 }, { rotationX: 0, ease: "power2.inOut", duration: 1.5 }, 0.2)
        // Once it faces us, the machine boots (a timed sequence, not scrubbed).
        .call(() => setBooted(true), [], 1.6)
        .fromTo(q(".hero__claim"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, ease: "power2.out", duration: 0.7 }, 2.3)
        .to(q(".hero__claim-b"), { opacity: 1, duration: 0.5 }, 2.7)
        // Hold: the laptop stays put so people can play with it.
        .to({}, { duration: 1.6 }, 3.4);
    });

    // Pointer parallax on the depth layer (fine pointers only).
    mm.add(`${FULL_MOTION} and (hover: hover) and (pointer: fine)`, () => {
      const layer = q(".hero__depth")[0] as HTMLElement;
      const xTo = gsap.quickTo(layer, "x", { duration: 1.2, ease: "power3" });
      const yTo = gsap.quickTo(layer, "y", { duration: 1.2, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        xTo((e.clientX / window.innerWidth - 0.5) * -24);
        yTo((e.clientY / window.innerHeight - 0.5) * -16);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={root} aria-labelledby="hero-title">
      <div className="hero__stage">
        <div className="hero__depth" aria-hidden="true">
          <div className="hero__glow" />
          {heroTiles.map((t, i) => {
            const tilt = ((i * 37) % 17) - 8; // resting tilt, -8°…8°
            return (
              <span
                key={t.name}
                className={`tile${t.m ? "" : " tile--desktop"}${t.depth < 0.55 ? " tile--far" : ""}`}
                data-depth={t.depth}
                data-x={t.x}
                data-y={t.y}
                data-tilt={tilt}
                style={
                  {
                    "--x": `${t.x}%`,
                    "--y": `${t.y}%`,
                    "--mx": `${t.m?.[0] ?? t.x}%`,
                    "--my": `${t.m?.[1] ?? t.y}%`,
                    "--size": `${Math.round(54 + t.depth * 30)}px`,
                    "--bob": `${(4.5 + (1 - t.depth) * 3).toFixed(2)}s`,
                    "--delay": `${(-i * 0.73).toFixed(2)}s`,
                    "--tilt": `${tilt}deg`,
                    "--brand": t.color,
                  } as CSSProperties
                }
              >
                <span className="tile__in">
                  <span className="tile__bob">
                    <t.icon />
                  </span>
                </span>
              </span>
            );
          })}
        </div>

        <div className="hero__intro">
          <h1 id="hero-title" className="hero__name">
            {nameWords.map((w, i) => (
              <span className="hero__mask" key={w}>
                <span className="hero__word">{w}</span>
                {i < nameWords.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
          <p className="hero__subtitle">
            {roles.map((r, i) => (
              <span key={r}>
                {i > 0 && <span className="hero__sep"> · </span>}
                <span className="hero__role">{r}</span>
              </span>
            ))}
          </p>
          <p className="hero__hint" aria-hidden="true">
            <span>Scroll</span>
          </p>
        </div>

        <p className="hero__claim">
          Go ahead. <span className="hero__claim-b text-gradient">Click around.</span>
        </p>

        <div className="hero__device-wrap">
          <MacBook booted={booted} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
