// Live GitHub activity for the "Shipping" section: the public contribution
// calendar (parsed from github.com, no token needed) and the most recently
// pushed public repos. Cached at Vercel's edge so GitHub is hit rarely.

const USER = process.env.GITHUB_USER || "hsanjebri";
const SKIP_REPOS = new Set([USER.toLowerCase()]); // the profile README repo
const TIMEOUT_MS = 8000;

const withTimeout = (url, headers = {}) =>
  fetch(url, { headers: { "User-Agent": `${USER}-portfolio`, ...headers }, signal: AbortSignal.timeout(TIMEOUT_MS) });

/** "No contributions on…" / "1 contribution on…" / "12 contributions on…" */
const countFrom = (text) => {
  const m = /^([\d,]+) contributions? on/.exec(text.trim());
  return m ? Number(m[1].replace(/,/g, "")) : 0;
};

export function parseCalendar(html) {
  const counts = new Map();
  for (const m of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    counts.set(m[1], countFrom(m[2]));
  }
  const days = [];
  for (const m of html.matchAll(/<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*>/g)) {
    const tag = m[0];
    const id = /\bid="([^"]+)"/.exec(tag)?.[1];
    const level = Number(/\bdata-level="(\d)"/.exec(tag)?.[1] ?? 0);
    days.push({ date: m[1], level, count: id ? counts.get(id) ?? 0 : 0 });
  }
  return days.sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function summarize(days) {
  const total = days.reduce((n, d) => n + d.count, 0);
  const activeDays = days.filter((d) => d.count > 0).length;
  let best = null;
  for (const d of days) if (!best || d.count > best.count) best = d;

  // Current streak: today may still be empty, so start from yesterday in that case.
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  let streak = 0;
  for (; i >= 0 && days[i].count > 0; i--) streak++;

  let longest = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  return { total, activeDays, streak, longestStreak: longest, bestDay: best && best.count ? best : null };
}

async function getCalendar() {
  const r = await withTimeout(`https://github.com/users/${USER}/contributions`);
  if (!r.ok) throw new Error(`contributions HTTP ${r.status}`);
  return parseCalendar(await r.text());
}

async function getRepos() {
  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const r = await withTimeout(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=12&type=owner`, headers);
  if (!r.ok) throw new Error(`repos HTTP ${r.status}`);
  const repos = await r.json();
  return repos
    .filter((x) => !x.fork && !x.archived && !SKIP_REPOS.has(x.name.toLowerCase()))
    .slice(0, 6)
    .map((x) => ({
      name: x.name,
      description: x.description,
      url: x.html_url,
      homepage: x.homepage || null,
      language: x.language,
      pushedAt: x.pushed_at,
      stars: x.stargazers_count,
    }));
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });

  // Either half can fail on its own; the section shows whatever arrived.
  const [calendar, repos] = await Promise.allSettled([getCalendar(), getRepos()]);
  if (calendar.status === "rejected" && repos.status === "rejected") {
    console.error("github: both sources failed", calendar.reason?.message, repos.reason?.message);
    res.setHeader("Cache-Control", "public, s-maxage=60");
    return res.status(502).json({ error: "upstream" });
  }

  const days = calendar.status === "fulfilled" ? calendar.value : [];
  res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=86400");
  return res.status(200).json({
    user: USER,
    profile: `https://github.com/${USER}`,
    days,
    stats: days.length ? summarize(days) : null,
    repos: repos.status === "fulfilled" ? repos.value : [],
    updatedAt: new Date().toISOString(),
  });
}
