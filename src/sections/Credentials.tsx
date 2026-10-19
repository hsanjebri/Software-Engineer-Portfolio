import { useLayoutEffect, useRef } from "react";
import { config } from "../config";
import { education, formatPeriod } from "../data/site";
import { gsap, FULL_MOTION } from "../lib/motion";
import Img from "../ui/Img";
import { palette } from "../lib/color";
import Words from "../ui/Words";
import "./Credentials.css";

const scoreLabels = [
  ["listening", "Listening"],
  ["reading", "Reading"],
  ["writing", "Writing"],
  ["speaking", "Speaking"],
] as const;

const Credentials = () => {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(FULL_MOTION, () => {
      gsap.utils.toArray<HTMLElement>(".school, .cert", el).forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 120, x: i % 2 ? 40 : -40, rotateX: 14, scale: 0.92, opacity: 0, transformPerspective: 1200 },
          {
            y: 0,
            x: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top bottom", end: "top 65%", scrub: 0.6 },
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="credentials"
      ref={root}
      className="credentials section sheet section-alt"
      aria-labelledby="credentials-title"
    >
      <div data-exit>
        <div className="container">
          <header className="section-head">
            <p className="eyebrow" data-reveal="up">
              Education &amp; credentials
            </p>
            <Words
              as="h2"
              id="credentials-title"
              className="headline"
              text="Always learning."
              data-reveal="words"
              gradient={{ stops: [palette.blue.light, palette.cyan.light, palette.green.light], from: 1 }}
            />
          </header>

          <h3 className="cred__label" data-reveal="up">
            Education
          </h3>
          <ul className="schools">
            {education.map((s) => (
              <li className="school" key={s.company}>
                <p className="school__period">
                  {formatPeriod(s.period)} · {s.location}
                </p>
                <h4 className="school__name">{s.company}</h4>
                <p className="school__desc">{s.description}</p>
                <ul className="school__list">
                  {s.responsibilities.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <ul className="tags" aria-label="Focus">
                  {s.technologies.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <h3 className="cred__label" data-reveal="up">
            Certificates
          </h3>
          <ul className="certs">
            {config.certificates.map((c) => (
              <li className="cert" key={c.id}>
                <div className="cert__media">
                  <Img src={c.image} alt={`${c.title} certificate`} sizes="(min-width: 900px) 25vw, 90vw" />
                </div>
                <div className="cert__body">
                  <h4 className="cert__title">{c.title}</h4>
                  <p className="cert__meta">
                    {c.issuer} · {c.date}
                  </p>
                  {c.scores && (
                    <dl className="cert__scores">
                      <div className="cert__overall">
                        <dt>Overall</dt>
                        <dd>{c.scores.overall}</dd>
                      </div>
                      {scoreLabels.map(([key, label]) => (
                        <div key={key}>
                          <dt>{label}</dt>
                          <dd>{c.scores?.[key]}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <p className="cert__links">
                    {c.link && (
                      <a href={c.link} target="_blank" rel="noopener noreferrer" className="link-arrow">
                        Verify<span className="sr-only"> {c.title} (opens in a new tab)</span>
                      </a>
                    )}
                    {c.file && (
                      <a href={c.file} target="_blank" rel="noopener noreferrer" className="link-arrow">
                        PDF<span className="sr-only"> of {c.title} (opens in a new tab)</span>
                      </a>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Credentials;
