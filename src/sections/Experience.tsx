import { useLayoutEffect, useRef } from "react";
import { formatPeriod, workRoles } from "../data/site";
import { gsap, FULL_MOTION } from "../lib/motion";
import { spectrumDark } from "../lib/color";
import Words from "../ui/Words";
import "./Experience.css";

/** Show the location only when the company name doesn't already say it. */
const placeFor = (company: string, location: string) =>
  company.includes(location.split(",")[0]) ? null : location;

const Experience = () => {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(FULL_MOTION, () => {
      const timeline = el.querySelector(".timeline");
      gsap.fromTo(
        el.querySelector(".timeline__fill"),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: timeline, start: "top 62%", end: "bottom 62%", scrub: true },
        }
      );

      gsap.utils.toArray<HTMLElement>(".role", el).forEach((role) => {
        gsap.fromTo(
          role.querySelector(".role__card"),
          { y: 80, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: role, start: "top 92%", end: "top 58%", scrub: 0.5 },
          }
        );
        gsap.to(role, {
          scrollTrigger: { trigger: role, start: "top 62%", end: "max", toggleClass: "is-active" },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={root}
      className="experience section sheet section-dark"
      data-nav-theme="dark"
      aria-labelledby="experience-title"
    >
      <div data-exit>
        <div className="container experience__grid">
          <header className="experience__head">
            <p className="eyebrow" data-reveal="up">
              Experience
            </p>
            <Words as="h2" id="experience-title" className="headline" text="Where I've built." data-reveal="words" />
            <p className="subhead" data-reveal="up">
              {workRoles.length} roles, most recent first.
            </p>
          </header>

          <ol className="timeline">
            <li className="timeline__rail" aria-hidden="true">
              <span className="timeline__fill" />
            </li>
            {workRoles.map((r, i) => {
              const place = placeFor(r.company, r.location);
              return (
                <li
                  className="role"
                  key={`${r.company}-${r.period}`}
                  style={{ ["--dot" as string]: spectrumDark[i % spectrumDark.length] }}
                >
                  <span className="role__dot" aria-hidden="true" />
                  <article className="role__card">
                    <p className="role__period">
                      {formatPeriod(r.period)}
                      {place && <span> · {place}</span>}
                    </p>
                    <h3 className="role__title">{r.position}</h3>
                    <p className="role__company">{r.company}</p>
                    <p className="role__desc">{r.description}</p>
                    <details className="role__details">
                      <summary>What I did</summary>
                      <ul>
                        {r.responsibilities.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </details>
                    <ul className="tags" aria-label="Technologies">
                      {r.technologies.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Experience;
