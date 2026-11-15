import { config } from "../../config";

// Offline answers straight from config, used when /api/ask is unavailable
// (no API key, rate limit, local dev). Keyword routing, nothing clever.

const { developer, social, about, experiences, projects, certificates, contact, skills } = config;

const firstParagraph = (text: string) => text.split("\n\n")[0].trim();
const has = (q: string, words: string[]) => words.some((w) => q.includes(w));

const jobs = experiences.filter((e) => e.position !== "Education");
const schools = experiences.filter((e) => e.position === "Education");

function projectAnswer(q: string) {
  const p = projects.find((p) =>
    p.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .some((w) => w.length > 3 && q.includes(w))
  );
  if (!p) return null;
  const link = "link" in p && p.link ? `\n\nSee it here: ${p.link}` : "";
  return `**${p.title}** (${p.category})\n\n${firstParagraph(p.description)}\n\nBuilt with ${p.technologies}.${link}`;
}

export function localAnswer(question: string): string {
  const q = question.toLowerCase();

  const project = projectAnswer(q);
  if (project) return project;

  if (has(q, ["contact", "email", "mail", "reach", "hire", "linkedin", "available", "freelance", "open to"])) {
    return `Hassan is currently working as a freelance Software Engineer. The best way to reach him is email: ${contact.email}\n\n- LinkedIn: ${contact.linkedin}\n- GitHub: ${contact.github}`;
  }
  if (has(q, ["project", "built", "build", "portfolio", "made", "work on", "working on"])) {
    const list = projects
      .slice(0, 6)
      .map((p) => `- **${p.title}**: ${p.category}`)
      .join("\n");
    return `Some of Hassan's latest projects:\n\n${list}\n\nAsk me about any of them for details.`;
  }
  if (has(q, ["experience", "job", "career", "company", "worked", "employ", "dinobyte", "legy", "accompany"])) {
    const list = jobs
      .slice()
      .reverse()
      .map((e) => `- **${e.position}**, ${e.company} (${e.period})`)
      .join("\n");
    return `Hassan's experience, newest first:\n\n${list}`;
  }
  if (has(q, ["stack", "skill", "tech", "language", "framework", "tools", "know"])) {
    return Object.values(skills)
      .map((s) => `**${s.title}**: ${s.tools.join(", ")}`)
      .join("\n\n");
  }
  if (has(q, ["study", "studied", "degree", "education", "university", "school", "esprit", "graduat"])) {
    return schools.map((e) => `- **${e.company}** (${e.period}): ${e.description}`).join("\n");
  }
  if (has(q, ["certif", "ielts", "english", "coursera", "udemy"])) {
    return certificates.map((c) => `- **${c.title}**, ${c.issuer} (${c.date})`).join("\n");
  }
  if (has(q, ["where", "location", "based", "live", "country", "from"])) {
    return `Hassan is based in ${social.location} and works remotely with clients and teams abroad.`;
  }
  if (has(q, ["who", "about", "yourself", "himself", "hassan", "summary", "introduce"])) {
    return `${developer.fullName} is a ${developer.title.toLowerCase()} based in ${social.location}. ${about.description}`;
  }

  return `I can tell you about Hassan's projects, experience, tech stack, education, certificates, or how to contact him. For anything else, email him at ${contact.email}.`;
}
