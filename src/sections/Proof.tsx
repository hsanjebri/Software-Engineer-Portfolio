import { Link } from "react-router-dom";
import { config } from "../config";
import { palette, type Hue } from "../lib/color";
import Words from "../ui/Words";
import "./Proof.css";

const { stats, testimonials } = config.proof;
const hues: Hue[] = ["green", "orange", "blue"];

/** Numbers strip: real usage, then client quotes once there are any. */
const Proof = () => (
  <section id="proof" className="proof section sheet" aria-labelledby="proof-title">
    <div data-exit>
      <div className="container">
        <header className="section-head proof__head">
          <p className="eyebrow" data-reveal="up">
            In production
          </p>
          <Words
            as="h2"
            id="proof-title"
            className="headline"
            text="Real people use this."
            data-reveal="words"
            gradient={{ stops: [palette.green.light, palette.blue.light], from: 2 }}
          />
        </header>

        <ul className="proof__stats">
          {stats.map((s, i) => {
            const h = palette[hues[i % hues.length]];
            const body = (
              <>
                <strong style={{ backgroundImage: `linear-gradient(90deg, ${h.light}, ${h.base})` }}>{s.value}</strong>
                <span>{s.label}</span>
              </>
            );
            return (
              <li key={s.label} data-reveal="up">
                {"href" in s && s.href ? (
                  <Link to={s.href} className="proof__stat proof__stat--link" data-cursor-label="Read">
                    {body}
                  </Link>
                ) : (
                  <div className="proof__stat">{body}</div>
                )}
              </li>
            );
          })}
        </ul>

        {testimonials.length > 0 && (
          <ul className="proof__quotes">
            {testimonials.map((t) => (
              <li key={t.name} data-reveal="up">
                <figure className="quote">
                  <blockquote>“{t.quote}”</blockquote>
                  <figcaption>
                    <strong>{t.name}</strong> · {t.role}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </section>
);

export default Proof;
