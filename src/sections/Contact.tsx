import { useLayoutEffect, useRef } from "react";
import type { IconType } from "react-icons";
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { config } from "../config";
import { socials } from "../data/site";
import { gsap, FULL_MOTION } from "../lib/motion";
import { spectrumDark } from "../lib/color";
import Words from "../ui/Words";
import "./Contact.css";

// Hover colours: each network's own brand colour.
const brandBg: Record<string, string> = {
  GitHub: "#f5f5f7",
  LinkedIn: "#0a66c2",
  X: "#f5f5f7",
  Facebook: "#0866ff",
  Instagram: "#e1306c",
};
const brandFg: Record<string, string> = { GitHub: "#000", X: "#000" };

const icons: Record<string, IconType> = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedinIn,
  X: FaXTwitter,
  Facebook: FaFacebookF,
  Instagram: FaInstagram,
};

const Contact = () => {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(FULL_MOTION, () => {
      // Social tiles fly in from scattered points and land in a row.
      gsap.utils.toArray<HTMLElement>(".social", el).forEach((tile, i, all) => {
        const spread = i - (all.length - 1) / 2;
        gsap.fromTo(
          tile,
          { x: spread * 70, y: 140 + Math.abs(spread) * 40, rotate: spread * 14, scale: 0.5, opacity: 0 },
          {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            ease: "back.out(1.4)",
            scrollTrigger: { trigger: el.querySelector(".contact__socials"), start: "top bottom", end: "top 70%", scrub: 0.6 },
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={root}
      className="contact section sheet section-dark"
      data-nav-theme="dark"
      aria-labelledby="contact-title"
    >
      <div data-exit>
        <div className="container contact__inner">
          <p className="eyebrow" data-reveal="up">
            Contact
          </p>
          <Words
            as="h2"
            id="contact-title"
            className="contact__title"
            text="Let's build something."
            data-reveal="words"
            gradient={{ stops: spectrumDark }}
          />
          <p className="subhead" data-reveal="up">
            Email is the fastest way to reach me.
          </p>

          <a className="contact__email" href={`mailto:${config.contact.email}`} data-reveal="up" data-cursor-label="Email">
            {config.contact.email}
          </a>

          <div className="contact__ctas" data-reveal="up">
            <a className="btn" href={`mailto:${config.contact.email}`} data-cursor-label="Email">
              Email me
            </a>
            <a className="link-arrow" href={config.contact.linkedin} target="_blank" rel="noopener noreferrer">
              Hire me on LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>

          <ul className="contact__socials" aria-label="Social profiles">
            {socials.map(({ name, href }) => {
              const Icon = icons[name];
              return (
                <li key={name}>
                  <a
                    className="social"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} (opens in a new tab)`}
                    style={{ ["--bb" as string]: brandBg[name], ["--bf" as string]: brandFg[name] ?? "#fff" }}
                  >
                    {Icon && <Icon aria-hidden="true" />}
                  </a>
                </li>
              );
            })}
          </ul>

          <p className="contact__meta" data-reveal="up">
            Based in {config.social.location}.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
