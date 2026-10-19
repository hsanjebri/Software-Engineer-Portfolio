import { useState, type CSSProperties, type FormEvent } from "react";
import { IoGrid, IoSend, IoStar, IoTrashOutline } from "react-icons/io5";
import { config } from "../../../config";
import {
  education,
  excerpt,
  featuredProjects,
  formatPeriod,
  linkLabel,
  mediaFit,
  moreProjects,
  socials,
  stackLayers,
  stackOf,
  workRoles,
} from "../../../data/site";
import { palette } from "../../../lib/color";
import { scrollToHash } from "../../../lib/motion";
import Img from "../../../ui/Img";
import StackMatch from "../../play/StackMatch";

export type Project = (typeof config.projects)[number];

const allProjects = [...featuredProjects, ...moreProjects];
const shortCompany = (c: string) => c.split(",")[0];

/* ---------- About (like "About This Mac") ---------- */

export const AboutApp = () => {
  const now = workRoles.filter((r) => r.period.includes("Present"));
  const school = education[0];
  const years = config.about.stats[0];
  return (
    <div className="app-about">
      <Img src={config.about.photo} alt={`Portrait of ${config.developer.fullName}`} className="app-about__photo" sizes="160px" />
      <h2 className="app-about__name">{config.developer.fullName}</h2>
      <p className="app-about__role">{config.developer.title}</p>
      <dl className="app-about__specs">
        <div>
          <dt>Now</dt>
          <dd>{now.map((r) => shortCompany(r.company)).join(" & ")}</dd>
        </div>
        <div>
          <dt>Based in</dt>
          <dd>{config.social.location}</dd>
        </div>
        <div>
          <dt>Experience</dt>
          <dd>
            {years.value} {years.label}
          </dd>
        </div>
        <div>
          <dt>Education</dt>
          <dd>
            {shortCompany(school.company)} · {formatPeriod(school.period)}
          </dd>
        </div>
      </dl>
      <button type="button" className="mac-btn" onClick={() => scrollToHash("#about")}>
        More about me
      </button>
    </div>
  );
};

/* ---------- Projects (a Finder-style folder) ---------- */

export const ProjectsApp = ({ onOpen }: { onOpen: (p: Project) => void }) => {
  const [view, setView] = useState<"featured" | "all">("featured");
  const [query, setQuery] = useState("");
  const source = view === "featured" ? featuredProjects : allProjects;
  const q = query.trim().toLowerCase();
  const list = q
    ? allProjects.filter((p) => `${p.title} ${p.category} ${p.technologies}`.toLowerCase().includes(q))
    : source;

  return (
    <div className="app-finder">
      <aside className="app-finder__side">
        <p className="app-finder__label">Favorites</p>
        <button type="button" aria-pressed={!q && view === "featured"} onClick={() => { setView("featured"); setQuery(""); }}>
          <IoStar aria-hidden="true" /> Featured <span>{featuredProjects.length}</span>
        </button>
        <button type="button" aria-pressed={!q && view === "all"} onClick={() => { setView("all"); setQuery(""); }}>
          <IoGrid aria-hidden="true" /> All projects <span>{allProjects.length}</span>
        </button>
      </aside>
      <div className="app-finder__main">
        <div className="app-finder__tools">
          <strong>{q ? `Search: “${query}”` : view === "featured" ? "Featured" : "All projects"}</strong>
          <input
            type="search"
            placeholder="Search"
            aria-label="Search projects"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <ul className="app-finder__grid" data-lenis-prevent>
          {list.map((p) => (
            <li key={p.id}>
              <button type="button" className="file" onClick={() => onOpen(p)} data-cursor-label="Open">
                <span className={`file__thumb card__media--${mediaFit(p).fit} card__media--${mediaFit(p).stage}`}>
                  <Img src={p.image} alt="" sizes="120px" />
                </span>
                <span className="file__name">{p.title}</span>
              </button>
            </li>
          ))}
        </ul>
        {list.length === 0 && <p className="app-finder__empty">No projects match “{query}”.</p>}
      </div>
    </div>
  );
};

/* ---------- Preview (one project) ---------- */

export const PreviewApp = ({ project: p }: { project: Project }) => {
  const { fit, stage } = mediaFit(p);
  return (
    <div className="app-preview" data-lenis-prevent>
      <div className={`app-preview__media card__media--${fit} card__media--${stage}`}>
        <Img src={p.image} alt={`${p.title} preview`} sizes="520px" />
      </div>
      <div className="app-preview__body">
        <p className="app-preview__cat">{p.category}</p>
        <h3>{p.title}</h3>
        <p>{excerpt(p, 160, 360)}</p>
        <ul className="tags">
          {stackOf(p).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {p.link && (
          <a className="mac-btn mac-btn--primary" href={p.link} target="_blank" rel="noopener noreferrer">
            {linkLabel(p.link)}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </div>
  );
};

/* ---------- Experience (a Notes-style app) ---------- */

const notes = [...workRoles, ...education];

export const ExperienceApp = () => {
  const [sel, setSel] = useState(0);
  const n = notes[sel];
  return (
    <div className="app-notes">
      <ul className="app-notes__list" data-lenis-prevent>
        {notes.map((r, i) => (
          <li key={`${r.company}-${r.period}`}>
            <button type="button" aria-pressed={sel === i} onClick={() => setSel(i)}>
              <strong>{r.position}</strong>
              <span>{shortCompany(r.company)}</span>
              <small>{formatPeriod(r.period)}</small>
            </button>
          </li>
        ))}
      </ul>
      <article className="app-notes__page" data-lenis-prevent>
        <p className="app-notes__date">
          {formatPeriod(n.period)} · {n.location}
        </p>
        <h3>{n.position}</h3>
        <p className="app-notes__company">{n.company}</p>
        <p>{n.description}</p>
        <ul>
          {n.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </div>
  );
};

/* ---------- Stack ---------- */

export const StackApp = () => (
  <div className="app-stack" data-lenis-prevent>
    {stackLayers.map((l) => (
      <section key={l.id}>
        <h4 style={{ color: palette[l.hue].light }}>{l.title}</h4>
        <ul>
          {l.items.map((t) => {
            const Icon = t.icon;
            return (
              <li key={t.name} style={{ "--brand": t.color } as CSSProperties}>
                <Icon aria-hidden="true" />
                <span>{t.name}</span>
              </li>
            );
          })}
        </ul>
      </section>
    ))}
  </div>
);

/* ---------- Mail (compose → the visitor's own mail app) ---------- */

export const MailApp = () => {
  const [subject, setSubject] = useState("Hello Hassan");
  const [body, setBody] = useState("");
  const send = (e: FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:${config.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <form className="app-mail" onSubmit={send}>
      <div className="app-mail__row">
        <span>To:</span>
        <span className="app-mail__to">
          {config.developer.fullName} &lt;{config.contact.email}&gt;
        </span>
      </div>
      <label className="app-mail__row">
        <span>Subject:</span>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </label>
      <textarea
        aria-label="Message"
        placeholder="Write your message… Send opens it in your mail app."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="app-mail__foot">
        <span className="app-mail__links">
          {socials.map((s) => (
            <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </span>
        <button type="submit" className="mac-btn mac-btn--primary" data-cursor-label="Send">
          <IoSend aria-hidden="true" /> Send
        </button>
      </div>
    </form>
  );
};

/* ---------- Play ---------- */

export const PlayApp = () => (
  <div className="app-play">
    <StackMatch dealOnMount />
  </div>
);

/* ---------- Trash ---------- */

export const TrashApp = () => (
  <div className="app-trash">
    <IoTrashOutline aria-hidden="true" />
    <p>Trash is empty.</p>
  </div>
);
