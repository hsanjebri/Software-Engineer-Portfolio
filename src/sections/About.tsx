import { useLayoutEffect, useRef } from "react";
import { config } from "../config";
import { gsap, FULL_MOTION } from "../lib/motion";
import { spectrumDark } from "../lib/color";
import Img from "../ui/Img";
import Words from "../ui/Words";
import "./About.css";

const { statement, description, photo, stats } = config.about;
// The closing phrase ("End to end.") lights up in the full spectrum.
const gradientFrom = statement.split(" ").length - 3;
const statHues = ["blue", "green", "orange"];

const About = () => {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(FULL_MOTION, () => {
      // The statement lights up word by word while it is pinned.
      gsap.fromTo(
        q(".about__big .w__in"),
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: q(".about__statement")[0],
            start: "top 35%",
            end: "bottom bottom",
            scrub: 0.4,
          },
        }
      );

      // The portrait flies in, then drifts slower than the page.
      gsap.fromTo(
        q(".about__photo"),
        { y: 140, rotate: -6, scale: 0.86, opacity: 0 },
        {
          y: 0,
          rotate: 0,
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: q(".about__body")[0], start: "top 95%", end: "top 40%", scrub: 0.6 },
        }
      );
      gsap.fromTo(
        q(".about__photo img"),
        { yPercent: -5 },
        {
          yPercent: 5, // stays inside the 112%-tall image's spare room
          ease: "none",
          scrollTrigger: { trigger: q(".about__photo")[0], start: "top bottom", end: "bottom top", scrub: true },
        }
      );

      // Stats count up once when they arrive (years stay as they are).
      (q(".stat__value") as HTMLElement[]).forEach((node) => {
        const raw = node.dataset.value ?? "";
        const match = raw.match(/^([\d,]+)(\+?)$/);
        if (!match || /^\d{4}$/.test(raw)) return;
        const target = Number(match[1].replace(/,/g, ""));
        const counter = { v: 0 };
        node.textContent = `0${match[2]}`;
        gsap.to(counter, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: node, start: "top 85%", once: true },
          onUpdate: () => {
            node.textContent = `${Math.round(counter.v).toLocaleString("en-US")}${match[2]}`;
          },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="about"
      ref={root}
      className="about sheet section-dark"
      data-nav-theme="dark"
      aria-labelledby="about-title"
    >
      <div data-exit>
        <div className="about__statement">
          <div className="about__sticky">
            <div className="container">
              <h2 className="eyebrow" id="about-title">
                About
              </h2>
              <Words
                as="p"
                className="about__big"
                text={statement}
                mask={false}
                gradient={{ stops: spectrumDark, from: gradientFrom }}
              />
            </div>
          </div>
        </div>

        <div className="container about__body">
          <figure className="about__photo">
            <Img
              src={photo}
              alt={`Portrait of ${config.developer.fullName}`}
              sizes="(min-width: 900px) 40vw, 90vw"
            />
          </figure>

          <div className="about__text">
            <p className="about__para" data-reveal="up">
              {description}
            </p>
            <dl className="about__stats">
              {stats.map((s, i) => (
                <div className={`stat stat--${statHues[i % statHues.length]}`} key={s.label} data-reveal="up">
                  <dt className="stat__label">{s.label}</dt>
                  <dd className="stat__value" data-value={s.value}>
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="about__where" data-reveal="up">
              Based in {config.social.location}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
