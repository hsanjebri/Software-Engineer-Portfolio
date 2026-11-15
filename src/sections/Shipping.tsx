import { useEffect, useMemo, useRef, useState } from "react";
import { config } from "../config";
import { palette } from "../lib/color";
import Words from "../ui/Words";
import "./Shipping.css";

type Day = { date: string; level: number; count: number };
type Repo = {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  pushedAt: string;
};
type Activity = {
  profile: string;
  days: Day[];
  stats: { total: number; activeDays: number; streak: number; longestStreak: number } | null;
  repos: Repo[];
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#e8c400", Python: "#3776ab", Java: "#e76f00",
  HTML: "#e34f26", CSS: "#1572b6", Dart: "#0175c2", "C#": "#239120", Go: "#00add8",
};

const fmt = (n: number) => n.toLocaleString("en-US");

function ago(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  const units: [number, string][] = [[86400 * 30, "month"], [86400 * 7, "week"], [86400, "day"], [3600, "hour"], [60, "minute"]];
  for (const [size, name] of units) {
    const n = Math.floor(s / size);
    if (n >= 1) return `${n} ${name}${n > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

/** Columns of 7 days (Sunday first), padded so the first column starts on Sunday. */
function toWeeks(days: Day[]) {
  if (!days.length) return [];
  const lead = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const cells: (Day | null)[] = [...Array(lead).fill(null), ...days];
  const weeks: (Day | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const Shipping = () => {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Activity | null>(null);
  const [failed, setFailed] = useState(false);

  // Fetch once the section gets close to the viewport.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctrl = new AbortController();
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        fetch("/api/github", { signal: ctrl.signal })
          .then((r) => (r.ok && r.headers.get("content-type")?.includes("json") ? r.json() : Promise.reject()))
          .then((d: Activity) => setData(d))
          .catch(() => !ctrl.signal.aborted && setFailed(true));
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      ctrl.abort();
    };
  }, []);

  const weeks = useMemo(() => toWeeks(data?.days ?? []), [data]);

  // On narrow screens the graph scrolls sideways; show the latest weeks first.
  useEffect(() => {
    if (grid.current) grid.current.scrollLeft = grid.current.scrollWidth;
  }, [weeks]);

  // A month's label sits on the first week that contains its 1st day.
  const months = useMemo(
    () =>
      weeks.map((w) => {
        const first = w.find((d) => d?.date.endsWith("-01"));
        return first ? MONTHS[Number(first.date.slice(5, 7)) - 1] : "";
      }),
    [weeks]
  );

  const stats = data?.stats;
  const profile = data?.profile ?? config.contact.github;

  return (
    <section
      id="shipping"
      ref={root}
      className="shipping section sheet section-dark"
      data-nav-theme="dark"
      aria-labelledby="shipping-title"
    >
      <div data-exit>
        <div className="container">
          <header className="section-head shipping__head">
            <p className="eyebrow" data-reveal="up">
              <i className="shipping__pulse" aria-hidden="true" /> Live from GitHub
            </p>
            <Words
              as="h2"
              id="shipping-title"
              className="headline"
              text="What I'm shipping."
              data-reveal="words"
              gradient={{ stops: [palette.green.dark, palette.cyan.dark], from: 2 }}
            />
            <p className="subhead" data-reveal="up">
              {stats
                ? `${fmt(stats.total)} contributions in the last year. ${stats.streak > 1 ? `On a ${stats.streak}-day streak right now.` : `Longest streak: ${stats.longestStreak} days.`}`
                : failed
                  ? "My latest work, straight from GitHub."
                  : "Loading the latest from GitHub…"}
            </p>
          </header>

          {/* ---------- contribution graph ---------- */}
          <figure className="graph" aria-busy={!data && !failed}>
            <div className="graph__scroll" ref={grid}>
              <div className="graph__months" aria-hidden="true">
                {(weeks.length ? months : Array(53).fill("")).map((m, i) => (
                  <span key={i}>{m}</span>
                ))}
              </div>
              <div className="graph__grid" role="img" aria-label={stats ? `${stats.total} contributions in the last year` : "Contribution graph"}>
                {(weeks.length ? weeks : Array.from({ length: 53 }, () => Array(7).fill(null))).map((w, i) => (
                  <div className="graph__week" key={i}>
                    {Array.from({ length: 7 }, (_, d) => {
                      const day = w[d];
                      return (
                        <span
                          key={d}
                          className={`graph__day${day ? ` l${day.level}` : weeks.length ? " is-empty" : " is-loading"}`}
                          title={day ? `${day.count || "No"} contribution${day.count === 1 ? "" : "s"} on ${day.date}` : undefined}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <figcaption className="graph__foot">
              {stats && (
                <span>
                  {fmt(stats.activeDays)} active days · longest streak {stats.longestStreak} days
                </span>
              )}
              <span className="graph__legend" aria-hidden="true">
                Less <i className="graph__day l0" />
                <i className="graph__day l1" />
                <i className="graph__day l2" />
                <i className="graph__day l3" />
                <i className="graph__day l4" /> More
              </span>
            </figcaption>
          </figure>

          {/* ---------- recently pushed ---------- */}
          {data && data.repos.length > 0 && (
            <>
              <h3 className="shipping__sub">Recently pushed</h3>
              <ul className="repos">
                {data.repos.map((r) => (
                  <li key={r.name}>
                    <a className="repo" href={r.url} target="_blank" rel="noopener noreferrer" data-cursor-label="Open">
                      <span className="repo__name">{r.name}</span>
                      {r.description && <span className="repo__desc">{r.description}</span>}
                      <span className="repo__meta">
                        {r.language && (
                          <span>
                            <i style={{ background: LANG_COLORS[r.language] ?? "#8e8e93" }} /> {r.language}
                          </span>
                        )}
                        <span>Pushed {ago(r.pushedAt)}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="shipping__all">
            <a className="link-arrow" href={profile} target="_blank" rel="noopener noreferrer">
              Follow along on GitHub
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Shipping;
