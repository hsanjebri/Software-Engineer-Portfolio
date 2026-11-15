import { useEffect, type CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import { config } from "../config";
import { caseStudies } from "../data/caseStudies";
import { stackOf } from "../data/site";
import { palette, withAlpha } from "../lib/color";
import { prefersReducedMotion } from "../lib/motion";
import Img from "../ui/Img";
import Cursor from "../ui/Cursor";
import Agent from "../ui/agent/Agent";
import "./CaseStudy.css";

const pad = (n: number) => String(n).padStart(2, "0");

const NotFound = () => (
  <main className="cs-missing">
    <h1>That case study doesn't exist.</h1>
    <Link to="/#work" className="btn">
      See all work
    </Link>
  </main>
);

const CaseStudy = () => {
  const { slug } = useParams();
  const index = caseStudies.findIndex((c) => c.slug === slug);
  const cs = caseStudies[index];
  const project = cs && config.projects.find((p) => p.id === cs.projectId);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (project) document.title = `${project.title} · Case study · ${config.developer.fullName}`;
    return () => {
      document.title = `${config.developer.fullName} · ${config.developer.title}`;
    };
  }, [project]);

  if (!cs || !project) return <NotFound />;

  const next = caseStudies[(index + 1) % caseStudies.length];
  const nextProject = config.projects.find((p) => p.id === next.projectId);
  const h = palette[cs.hue];
  const vars = {
    "--cs-c": h.light,
    "--cs-cd": h.dark,
    "--cs-tint": withAlpha(h.base, 0.1),
    "--cs-glow": withAlpha(h.base, 0.28),
  } as CSSProperties;
  const autoplay = !prefersReducedMotion();

  return (
    <div className="cs" style={vars}>
      <header className="cs-bar">
        <Link to="/#work" className="cs-bar__back">
          <span aria-hidden="true">‹</span> All work
        </Link>
        <span className="cs-bar__title">{project.title}</span>
        <a className="cs-bar__cta" href={cs.links[0].href} target="_blank" rel="noopener noreferrer">
          Open
          <span className="sr-only"> {project.title} (new tab)</span>
        </a>
      </header>

      <main id="main">
        {/* ---------- hero ---------- */}
        <section className="cs-hero container">
          <p className="cs-eyebrow">Case study · {project.category}</p>
          <h1 className="cs-title">{project.title}</h1>
          <p className="cs-tagline">{cs.tagline}</p>

          <dl className="cs-meta">
            <div>
              <dt>Role</dt>
              <dd>{cs.role}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{cs.year}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <i className="cs-live" aria-hidden="true" /> {cs.status}
              </dd>
            </div>
          </dl>

          <div className="cs-actions">
            {cs.links.map((l, i) => (
              <a
                key={l.href}
                className={`btn${i ? " btn--ghost" : ""}`}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
        </section>

        <div className="cs-stage container">
          <div className="cs-window">
            <div className="cs-window__bar" aria-hidden="true">
              <i />
              <i />
              <i />
              <span>{cs.links[0].href.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
            </div>
            {cs.video ? (
              <video
                className="cs-window__media"
                src={cs.video.src}
                poster={cs.video.poster}
                autoPlay={autoplay}
                controls={!autoplay}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={`Scrolling through the ${project.title} site`}
              />
            ) : (
              <Img className="cs-window__media" src={project.image} alt={`${project.title} preview`} eager />
            )}
          </div>
        </div>

        {/* ---------- results ---------- */}
        <section className="cs-results section-dark" aria-label="Results">
          <ul className="container">
            {cs.results.map((r) => (
              <li key={r.label}>
                <strong>{r.value}</strong>
                <span>{r.label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- story ---------- */}
        <section className="cs-story container">
          <div className="cs-row">
            <h2 className="cs-h2">The problem</h2>
            <div className="cs-prose">
              {cs.problem.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <div className="cs-row">
            <h2 className="cs-h2">What I built</h2>
            <div className="cs-prose">
              {cs.built.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- architecture ---------- */}
        <section className="cs-arch section-alt" aria-labelledby="cs-arch-title">
          <div className="container">
            <p className="cs-eyebrow">Architecture</p>
            <h2 className="cs-h2" id="cs-arch-title">
              How it fits together.
            </h2>
            <ol className="cs-diagram">
              {cs.diagram.map((col) => (
                <li className="cs-col" key={col.title}>
                  <p className="cs-col__title">{col.title}</p>
                  <ul>
                    {col.nodes.map((n) => (
                      <li className="cs-node" key={n.label}>
                        <strong>{n.label}</strong>
                        {n.note && <span>{n.note}</span>}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- hard parts ---------- */}
        <section className="cs-hard container" aria-labelledby="cs-hard-title">
          <p className="cs-eyebrow">The hard parts</p>
          <h2 className="cs-h2" id="cs-hard-title">
            And how I solved them.
          </h2>
          <ol className="cs-cards">
            {cs.hard.map((item, i) => (
              <li className="cs-card" key={item.title}>
                <span className="cs-card__n">{pad(i + 1)}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- gallery ---------- */}
        <section className="cs-gallery container" aria-label="Screenshots">
          {cs.gallery.map((g) => (
            <figure key={g.src}>
              <Img src={g.src} alt={g.alt} sizes="(min-width: 1240px) 1200px, 94vw" />
              <figcaption>{g.caption}</figcaption>
            </figure>
          ))}
        </section>

        {/* ---------- stack ---------- */}
        <section className="cs-stack container" aria-labelledby="cs-stack-title">
          <h2 className="cs-h3" id="cs-stack-title">
            Built with
          </h2>
          <ul className="tags">
            {stackOf(project).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        {/* ---------- next ---------- */}
        <nav className="cs-next container" aria-label="More case studies">
          {nextProject && next.slug !== cs.slug && (
            <Link to={`/work/${next.slug}`} className="cs-next__card">
              <span className="cs-next__label">Next case study</span>
              <span className="cs-next__title">{nextProject.title}</span>
              <span className="cs-next__tag">{next.tagline}</span>
            </Link>
          )}
          <div className="cs-cta">
            <p>Want something like this built?</p>
            <a className="btn" href={`mailto:${config.contact.email}`}>
              Email Hassan
            </a>
            <Link className="link-arrow" to="/#work">
              Back to all work
            </Link>
          </div>
        </nav>
      </main>

      <Agent />
      <Cursor />
    </div>
  );
};

export default CaseStudy;
