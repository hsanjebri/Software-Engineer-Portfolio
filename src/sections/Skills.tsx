import { useLayoutEffect, useRef } from "react";
import { skillGroups } from "../data/site";
import { gsap, FULL_MOTION } from "../lib/motion";
import { palette } from "../lib/color";
import Words from "../ui/Words";
import "./Skills.css";

// Each card flies in from its own direction, one after another.
const ENTRY = [
  { x: -90, y: 140, rotate: -5 },
  { x: 90, y: 180, rotate: 5 },
  { x: -70, y: 160, rotate: 4 },
  { x: 70, y: 160, rotate: -4 },
];

const Skills = () => {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(FULL_MOTION, () => {
      gsap.utils.toArray<HTMLElement>(".bento__card", el).forEach((card, i) => {
        const from = ENTRY[i % ENTRY.length];
        gsap.fromTo(
          card,
          { ...from, scale: 0.9, opacity: 0 },
          {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top bottom", end: "top 62%", scrub: 0.6 },
          }
        );
        gsap.fromTo(
          card.querySelectorAll(".logo, .bento__extras li"),
          { y: 28, scale: 0.6, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            stagger: 0.05,
            ease: "back.out(1.6)",
            scrollTrigger: { trigger: card, start: "top 80%", end: "top 40%", scrub: 0.6 },
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="skills" ref={root} className="skills section sheet section-alt" aria-labelledby="skills-title">
      <div data-exit>
        <div className="container">
          <header className="section-head">
            <p className="eyebrow" data-reveal="up">
              Skills
            </p>
            <Words
              as="h2"
              id="skills-title"
              className="headline"
              text="Front end. Back end. Data. AI."
              data-reveal="words"
              gradient={{ stops: [palette.blue.light, palette.green.light, palette.cyan.light, palette.orange.light] }}
            />
            <p className="subhead" data-reveal="up">
              The tools I use to take an idea from API to interface to model.
            </p>
          </header>

          <ul className="bento">
            {skillGroups.map((g) => {
              const logos = g.items.filter((t) => t.icon);
              const extras = g.items.filter((t) => !t.icon);
              return (
                <li key={g.id} className={`bento__card bento__card--${g.layout} hue--${g.hue}`}>
                  <h3 className="bento__title">{g.title}</h3>
                  <p className="bento__blurb">{g.blurb}</p>
                  <ul className="logos" aria-label={`${g.title} technologies`}>
                    {logos.map(({ name, icon: Icon, color }) => (
                      <li className="logo" key={name} style={{ ["--brand" as string]: color }}>
                        <span className="logo__mark">{Icon && <Icon aria-hidden="true" />}</span>
                        <span className="logo__name">{name}</span>
                      </li>
                    ))}
                  </ul>
                  {extras.length > 0 && (
                    <ul className="tags bento__extras" aria-label={`More ${g.title}`}>
                      {extras.map((t) => (
                        <li key={t.name}>{t.name}</li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Skills;
