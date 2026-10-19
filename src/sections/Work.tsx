import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { excerpt, featuredProjects, linkLabel, mediaFit, moreProjects, stackOf } from "../data/site";
import { gsap, FULL_MOTION } from "../lib/motion";
import { hueAt, palette, withAlpha } from "../lib/color";
import Img from "../ui/Img";
import Words from "../ui/Words";
import "./Work.css";

const pad = (n: number) => String(n).padStart(2, "0");

/** Each project gets its own colour: index, category and a soft glow. */
const hueVars = (i: number) => {
  const h = palette[hueAt(i)];
  return {
    "--hue-text": h.light,
    "--hue-glow": withAlpha(h.base, 0.38),
    "--hue-tint": withAlpha(h.base, 0.1),
  } as CSSProperties;
};
const total = featuredProjects.length;

/** Desktop-sized viewports get the stacked, one-per-screen deck. */
const DECK = "(min-width: 900px) and (min-height: 620px)";

const ExternalLink = ({ href, className }: { href: string; className: string }) => (
  <a className={className} href={href} target="_blank" rel="noopener noreferrer" data-cursor-label="Open">
    {linkLabel(href)}
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

const Work = () => {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    const items = gsap.utils.toArray<HTMLElement>(".stack__item", el);

    // Deck: each card sticks; the one it covers sinks back and dims.
    // Smaller screens: cards fly up one by one in normal flow.
    // (Neither query matches with reduced motion.)
    mm.add(
      {
        deck: `${FULL_MOTION} and ${DECK}`,
        narrow: `${FULL_MOTION} and (max-width: 899px)`,
        short: `${FULL_MOTION} and (max-height: 619px)`,
      },
      (ctx) => {
        if (ctx.conditions?.deck) deck();
        else flow();
      }
    );

    function deck() {
      items.forEach((item, i) => {
        const next = items[i + 1];
        if (!next) return;
        gsap.fromTo(
          item.querySelector(".card"),
          { scale: 1, y: 0 },
          {
            scale: 0.9,
            y: -28,
            ease: "none",
            transformOrigin: "50% 0%",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
          }
        );
        gsap.fromTo(
          item.querySelector(".card__shade"),
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
          }
        );
      });

      // The first card rises out of the headline area.
      gsap.fromTo(
        items[0].querySelector(".card"),
        { y: 120, scale: 0.92, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: items[0], start: "top bottom", end: "top 30%", scrub: 0.6 },
        }
      );
    }

    function flow() {
      items.forEach((item) => {
        gsap.fromTo(
          item.querySelector(".card"),
          { y: 90, scale: 0.94, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top bottom", end: "top 55%", scrub: 0.5 },
          }
        );
      });
    }

    // Gentle 3D tilt that follows the pointer.
    mm.add(`${FULL_MOTION} and (hover: hover) and (pointer: fine)`, () => {
      const cleanups = gsap.utils.toArray<HTMLElement>(".card__tilt, .mini", el).map((card) => {
        gsap.set(card, { transformPerspective: 1400 });
        const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3" });
        const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3" });
        const strength = card.classList.contains("mini") ? 8 : 5;
        const move = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * strength);
          rx(-((e.clientY - r.top) / r.height - 0.5) * strength);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        return () => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        };
      });
      return () => cleanups.forEach((c) => c());
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="work" ref={root} className="work section sheet" aria-labelledby="work-title">
      <div data-exit>
        <div className="container">
          <header className="section-head">
            <p className="eyebrow" data-reveal="up">
              Work
            </p>
            <Words
              as="h2"
              id="work-title"
              className="headline"
              text="Things I've built."
              data-reveal="words"
              gradient={{ stops: [palette.orange.light, palette.pink.light], from: 2 }}
            />
            <p className="subhead" data-reveal="up">
              Selected projects, one at a time.
            </p>
          </header>
        </div>

        <ol className="stack container" aria-label="Selected projects">
          {featuredProjects.map((p, i) => {
            const { fit, stage } = mediaFit(p);
            return (
              <li className="stack__item" key={p.id}>
                <article
                  className={`card${i % 2 ? " card--flip" : ""}`}
                  aria-labelledby={`project-${p.id}`}
                  style={hueVars(i)}
                >
                  <div className="card__tilt">
                    <div className={`card__media card__media--${fit} card__media--${stage}`}>
                      <Img src={p.image} alt={`${p.title} preview`} sizes="(min-width: 900px) 58vw, 92vw" />
                    </div>
                    <div className="card__body">
                      <p className="card__index">
                        {pad(i + 1)} <span>/ {pad(total)}</span>
                      </p>
                      <p className="card__category">{p.category}</p>
                      <h3 className="card__title" id={`project-${p.id}`}>
                        {p.title}
                      </h3>
                      <p className="card__text">{excerpt(p)}</p>
                      <ul className="tags" aria-label="Stack">
                        {stackOf(p).map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                      {p.link && <ExternalLink href={p.link} className="btn card__cta" />}
                    </div>
                  </div>
                  <div className="card__shade" aria-hidden="true" />
                </article>
              </li>
            );
          })}
        </ol>

        <div className="container more">
          <h3 className="more__title" data-reveal="up">
            More projects
          </h3>
          <ul className="more__grid">
            {moreProjects.map((p, i) => {
              const { fit, stage } = mediaFit(p);
              return (
                <li className="mini" key={p.id} data-reveal="up" style={hueVars(i + featuredProjects.length)}>
                  <div className={`mini__media card__media--${fit} card__media--${stage}`}>
                    <Img src={p.image} alt={`${p.title} preview`} sizes="(min-width: 900px) 30vw, 92vw" />
                  </div>
                  <div className="mini__body">
                    <p className="card__category">{p.category}</p>
                    <h4 className="mini__title">{p.title}</h4>
                    <p className="mini__text">{excerpt(p, 80, 200)}</p>
                    <ul className="tags" aria-label="Stack">
                      {stackOf(p).map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    {p.link && <ExternalLink href={p.link} className="mini__link link-arrow" />}
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="more__all" data-reveal="up">
            <Link to="/myworks" className="link-arrow">
              Read every project in full
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Work;
