/**
 * Presentation layer for the redesign. Content lives in config.ts; this file
 * only decides how it is grouped, ordered and shown.
 */
import type { IconType } from "react-icons";
import { FaJava } from "react-icons/fa";
import {
  SiAdobephotoshop, SiAmazonwebservices, SiAngular, SiApachekafka, SiBootstrap,
  SiCss3, SiDart, SiDjango, SiDocker, SiFastapi, SiFigma, SiFirebase, SiFlask,
  SiFlutter, SiGit, SiGithub, SiHtml5, SiHuggingface, SiJavascript, SiKubernetes,
  SiLinux, SiMongodb, SiMysql, SiNestjs, SiNextdotjs, SiNodedotjs, SiNumpy,
  SiOpencv, SiPandas, SiPostgresql, SiPython, SiPytorch, SiReact, SiRedis,
  SiScikitlearn, SiSpringboot, SiTailwindcss, SiTensorflow, SiTypescript,
  SiAnthropic, SiDrizzle, SiFastify, SiGooglegemini, SiGreensock, SiJsonwebtokens, SiLeaflet,
  SiOpenai, SiPnpm, SiRailway, SiSocketdotio, SiStripe, SiTurborepo, SiTypeorm, SiVercel, SiVite,
} from "react-icons/si";
import { config } from "../config";
import { imageManifest } from "./imageManifest";
import type { Hue } from "../lib/color";

export type Tech = { name: string; icon?: IconType; color?: string };

/**
 * Official brand colours (Simple Icons). Brands whose colour is purple or
 * indigo (Bootstrap, OpenCV, Pandas) use the neutral text colour instead.
 */
const brand: Record<string, string> = {
  Java: "#e76f00", "Spring Boot": "#6db33f", "Node.js": "#5fa04e", NestJS: "#e0234e",
  Python: "#3776ab", Django: "#092e20", Flask: "#1d1d1f", FastAPI: "#009688",
  Angular: "#dd0031", React: "#149eca", "Next.js": "#1d1d1f", TypeScript: "#3178c6",
  JavaScript: "#e8c400", HTML: "#e34f26", CSS: "#1572b6", Tailwind: "#06b6d4",
  Bootstrap: "#1d1d1f", Flutter: "#02569b", Dart: "#0175c2", Figma: "#f24e1e",
  Photoshop: "#31a8ff", PyTorch: "#ee4c2c", TensorFlow: "#ff6f00", "Hugging Face": "#ffb000",
  "scikit-learn": "#f7931e", OpenCV: "#1d1d1f", NumPy: "#013243", Pandas: "#1d1d1f",
  PostgreSQL: "#4169e1", MySQL: "#4479a1", MongoDB: "#47a248", Redis: "#dc382d",
  Firebase: "#ffa000", Kafka: "#1d1d1f", Docker: "#2496ed", Kubernetes: "#326ce5",
  AWS: "#ff9900", Git: "#f05032", GitHub: "#1d1d1f", Linux: "#1d1d1f",
  // Tools from project stacks (Stripe, Vite, Gemini, OpenAI are purple-ish: neutral)
  "Socket.io": "#1d1d1f", Fastify: "#1d1d1f", TypeORM: "#fe0803", Drizzle: "#8fb51a",
  JWT: "#1d1d1f", Stripe: "#1d1d1f", GSAP: "#6aa802", Leaflet: "#199900", Vite: "#1d1d1f",
  Gemini: "#1d1d1f", OpenAI: "#1d1d1f", Claude: "#d97757", Vercel: "#1d1d1f",
  Railway: "#1d1d1f", Turborepo: "#ef4444", pnpm: "#f69220",
};
const t = (name: string, icon?: IconType): Tech => ({ name, icon, color: brand[name] });

// ---------- Skills (bento) ----------
// Sources: the old Tech Stack section, config.skills tools, and project stacks
// (NestJS: SEBN dashboard).

export const skillGroups: {
  id: string;
  title: string;
  blurb: string;
  layout: "wide" | "tall" | "square";
  hue: Hue;
  items: Tech[];
}[] = [
  {
    id: "backend",
    title: "Backend",
    blurb: "APIs, real-time services and system integrations, built to hold up in production.",
    layout: "wide",
    hue: "green",
    items: [
      t("Java", FaJava), t("Spring Boot", SiSpringboot), t("Node.js", SiNodedotjs), t("NestJS", SiNestjs),
      t("Python", SiPython), t("Django", SiDjango), t("Flask", SiFlask), t("FastAPI", SiFastapi),
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    blurb: "Responsive, performant interfaces built on modern UI/UX principles.",
    layout: "tall",
    hue: "blue",
    items: [
      t("Angular", SiAngular), t("React", SiReact), t("Next.js", SiNextdotjs), t("TypeScript", SiTypescript),
      t("JavaScript", SiJavascript), t("HTML", SiHtml5), t("CSS", SiCss3), t("Tailwind", SiTailwindcss),
      t("Bootstrap", SiBootstrap), t("Flutter", SiFlutter), t("Dart", SiDart), t("Figma", SiFigma),
      t("Photoshop", SiAdobephotoshop),
    ],
  },
  {
    id: "ai",
    title: "AI / ML",
    blurb: "AI agents, chatbots and models: LLMs, NLP and deep learning.",
    layout: "square",
    hue: "orange",
    items: [
      t("PyTorch", SiPytorch), t("TensorFlow", SiTensorflow), t("Hugging Face", SiHuggingface),
      t("scikit-learn", SiScikitlearn), t("OpenCV", SiOpencv), t("NumPy", SiNumpy), t("Pandas", SiPandas),
      t("LLMs"), t("NLP"), t("AI Agents"),
    ],
  },
  {
    id: "data",
    title: "Data / DevOps",
    blurb: "Databases, streaming and deployment, from Kafka to Kubernetes.",
    layout: "square",
    hue: "cyan",
    items: [
      t("PostgreSQL", SiPostgresql), t("MySQL", SiMysql), t("MongoDB", SiMongodb), t("Redis", SiRedis),
      t("Firebase", SiFirebase), t("Kafka", SiApachekafka), t("Docker", SiDocker), t("Kubernetes", SiKubernetes),
      t("AWS", SiAmazonwebservices), t("Git", SiGit), t("GitHub", SiGithub), t("Linux", SiLinux),
    ],
  },
];

// ---------- Tech stack sphere ----------
// Everything in Skills plus tools named in project/experience stacks:
// JWT (Accompany), Stripe (Leggy), Socket.io/TypeORM/Railway/Vercel (SEBN),
// Fastify/Drizzle/Turborepo/pnpm/Claude/OpenAI (Logsy), GSAP (Rowan Hawthorne),
// Leaflet/Gemini (Dosya, AA-VTC), Vite (this site).
const stackExtras: Record<string, Tech[]> = {
  backend: [t("Socket.io", SiSocketdotio), t("Fastify", SiFastify), t("TypeORM", SiTypeorm), t("Drizzle", SiDrizzle), t("JWT", SiJsonwebtokens), t("Stripe", SiStripe)],
  frontend: [t("GSAP", SiGreensock), t("Leaflet", SiLeaflet), t("Vite", SiVite)],
  ai: [t("Gemini", SiGooglegemini), t("OpenAI", SiOpenai), t("Claude", SiAnthropic)],
  data: [t("Vercel", SiVercel), t("Railway", SiRailway), t("Turborepo", SiTurborepo), t("pnpm", SiPnpm)],
};

export const stackLayers = skillGroups.map((g) => ({
  id: g.id,
  title: g.title,
  hue: g.hue,
  items: [...g.items.filter((i) => i.icon), ...(stackExtras[g.id] ?? [])] as Required<Tech>[],
}));

// ---------- Hero flying tiles ----------
// x/y are % of the stage; m = position on phones (omit to hide there).

export const heroTiles: (Tech & {
  icon: IconType;
  x: number;
  y: number;
  depth: number;
  m?: [number, number];
})[] = [
  { ...t("TypeScript", SiTypescript), icon: SiTypescript, x: 15, y: 24, depth: 0.9, m: [14, 18] },
  { ...t("React", SiReact), icon: SiReact, x: 83, y: 20, depth: 0.6, m: [86, 16] },
  { ...t("Spring Boot", SiSpringboot), icon: SiSpringboot, x: 90, y: 53, depth: 1 },
  { ...t("Angular", SiAngular), icon: SiAngular, x: 9, y: 57, depth: 0.7 },
  { ...t("PostgreSQL", SiPostgresql), icon: SiPostgresql, x: 23, y: 83, depth: 0.5, m: [16, 80] },
  { ...t("Docker", SiDocker), icon: SiDocker, x: 70, y: 86, depth: 0.8, m: [84, 82] },
  { ...t("Python", SiPython), icon: SiPython, x: 35, y: 13, depth: 0.4, m: [50, 12] },
  { ...t("Kafka", SiApachekafka), icon: SiApachekafka, x: 63, y: 11, depth: 0.5 },
  { ...t("Kubernetes", SiKubernetes), icon: SiKubernetes, x: 91, y: 84, depth: 0.65 },
  { ...t("PyTorch", SiPytorch), icon: SiPytorch, x: 6, y: 86, depth: 0.85 },
];

// ---------- Experience ----------

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "Sep. 2025 - Present" → sortable start value (year * 12 + month). */
const startOf = (period: string) => {
  const [month, year] = period.split(" - ")[0].replace(".", "").split(" ");
  return Number(year) * 12 + MONTHS.indexOf(month.toLowerCase().slice(0, 3));
};

type Experience = (typeof config.experiences)[number];
const byStartDesc = (a: Experience, b: Experience) => startOf(b.period) - startOf(a.period);

export const workRoles = config.experiences.filter((e) => e.position !== "Education").sort(byStartDesc);
export const education = config.experiences.filter((e) => e.position === "Education").sort(byStartDesc);

export const formatPeriod = (period: string) => period.replace(" - ", " – ");

// ---------- Projects ----------

type Project = (typeof config.projects)[number];

/** Shown one per screen; the rest go in the "More projects" grid. */
const FEATURED = [17, 16, 15, 14, 12, 11, 9, 10];
/** Poster-style art that should sit on a dark stage. */
const DARK_STAGE = new Set([9]);

export const featuredProjects = FEATURED.map((id) => config.projects.find((p) => p.id === id)!).filter(Boolean);
export const moreProjects = config.projects.filter((p) => !FEATURED.includes(p.id));

/** Wide screenshots fill the frame; logos and posters sit centred on a stage. */
export const mediaFit = (p: Project) => {
  const meta = imageManifest[p.image];
  const wide = meta ? meta.width >= 1000 && meta.width / meta.height >= 1.35 : true;
  return { fit: wide ? "cover" : "contain", stage: DARK_STAGE.has(p.id) ? "dark" : "light" } as const;
};

export const stackOf = (p: Project) => p.technologies.split(",").map((t) => t.trim());

/** First sentences of the description, before any feature list. */
export const excerpt = (p: Project, min = 140, max = 320) => {
  const intro = p.description.split(/\n\s*✨/)[0];
  const text = intro
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !/^[^.!]*\?$/.test(l)) // drop "Why JARVIS?"-style headings
    .join(" ");
  const sentences = text.split(/(?<=[.!?])\s+/);
  let out = "";
  for (const s of sentences) {
    if (out && (out + " " + s).length > max) break;
    out = out ? `${out} ${s}` : s;
    if (out.length >= min) break;
  }
  return out;
};

export const linkLabel = (url: string) =>
  url.includes("github.com") ? "View on GitHub" : "Visit site";

// ---------- Socials ----------

export const socials = [
  { name: "GitHub", href: config.contact.github },
  { name: "LinkedIn", href: config.contact.linkedin },
  { name: "X", href: config.contact.twitter },
  { name: "Facebook", href: config.contact.facebook },
  { name: "Instagram", href: config.contact.instagram },
].filter((s) => s.href);
