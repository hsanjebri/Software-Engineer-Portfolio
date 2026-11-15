/**
 * Case studies for /work/:slug. The card data (title, stack, image) comes from
 * config.projects via projectId; this file holds the long-form story.
 * Keep every fact checkable against the project's README or live site.
 */
import type { Hue } from "../lib/color";

export type CaseStudy = {
  slug: string;
  projectId: number;
  hue: Hue;
  tagline: string;
  role: string;
  year: string;
  status: string;
  links: { label: string; href: string }[];
  video?: { src: string; poster: string };
  results: { value: string; label: string }[];
  problem: string[];
  built: string[];
  /** Left-to-right columns of the architecture diagram. */
  diagram: { title: string; nodes: { label: string; note?: string }[] }[];
  hard: { title: string; body: string }[];
  gallery: { src: string; alt: string; caption: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "italian-dream",
    projectId: 19,
    hue: "orange",
    tagline:
      "A cinematic, trilingual lead engine for a study-in-Italy agency, with the back-office and student portal to run it.",
    role: "Full-stack development",
    year: "2026",
    status: "Live",
    links: [{ label: "Visit the site", href: "https://italian-dream-eight.vercel.app/en" }],
    video: { src: "/videos/italian-dream.mp4", poster: "/videos/italian-dream-poster.jpg" },
    results: [
      { value: "3", label: "languages, with Arabic fully right-to-left" },
      { value: "6", label: "questions to a personal eligibility result" },
      { value: "12", label: "steps tracked for every student file" },
      { value: "3", label: "roles enforced by the database, not the UI" },
    ],
    problem: [
      "Studying in Italy is affordable for Tunisian students, but the road there is long: choosing a program, Universitaly pre-enrolment, DOV / CIMEA diploma recognition, the regional DSU scholarship, the student visa and housing.",
      "Italian Dream, an agency with offices in Tunis, Sfax and Kairouan, guides students through all of it. They needed a site that turns curious visitors into qualified leads in French, Arabic and English, and a way to follow each student's file once they sign up.",
    ],
    built: [
      "A cinematic marketing site: a video hero cross-fading four Italian cities, scroll storytelling, a real Natural Earth map where flight paths draw from Tunis to each city, and a wall of real students holding their visas.",
      "An eligibility checker: a 6-step animated quiz feeds a rules-based matcher (programs, cities, DSU likelihood), then a lead form saves to Supabase and emails the agency through Resend. A cost calculator and a full journey page answer the next two questions every student asks.",
      "In the same Next.js app, a back-office for admins and advisers and a portal for students: a 12-step timeline, document review with private storage, applications, deadlines, payments, tasks and live messages between a student and their adviser.",
    ],
    diagram: [
      {
        title: "People",
        nodes: [
          { label: "Visitors", note: "French, Arabic or English" },
          { label: "Students", note: "Portal: progress, documents" },
          { label: "Agency team", note: "Admins and advisers" },
        ],
      },
      {
        title: "Next.js 15 on Vercel",
        nodes: [
          { label: "Marketing pages", note: "next-intl, Motion, Lenis" },
          { label: "Eligibility matcher", note: "Rules: programs, cities, DSU" },
          { label: "/api/leads", note: "Zod, honeypot, rate limit" },
        ],
      },
      {
        title: "Services",
        nodes: [
          { label: "Supabase Postgres", note: "Leads and student files, RLS" },
          { label: "Supabase Auth + Storage", note: "Logins, private documents" },
          { label: "Resend", note: "New-lead emails to the agency" },
        ],
      },
    ],
    hard: [
      {
        title: "Arabic, fully right-to-left",
        body: "Arabic isn't just translated strings. With next-intl handling French, Arabic and English, the whole layout flips to right-to-left in Arabic, with IBM Plex Sans Arabic set alongside the Latin typefaces.",
      },
      {
        title: "Heavy animation that stays smooth",
        body: "Videos, parallax and scroll scenes on every screen, so the motion layer is strict: Motion with LazyMotion, only transform and opacity animated, Lenis for scrolling, tilt and magnetic effects off on touch, and prefers-reduced-motion respected.",
      },
      {
        title: "Leads that never get lost",
        body: "Every form is validated with Zod in the browser and again on the server, behind a honeypot and a rate limit with hashed IPs. If the database or email keys are missing in production, the API refuses the submission instead of silently dropping it.",
      },
      {
        title: "Access control in the database",
        body: "Admin, adviser and student roles are enforced with Postgres row-level security. An adviser only ever sees the students assigned to them, and a student only their own file, even if a screen had a bug.",
      },
    ],
    gallery: [
      {
        src: "/images/cases/italian-dream-1.png",
        alt: "Eligibility checker: the first question, current level of study",
        caption: "The eligibility checker: six questions to programs, cities and a DSU estimate.",
      },
      {
        src: "/images/cases/italian-dream-2.png",
        alt: "Budget calculator with city cards and a monthly budget of 960 euros",
        caption: "The budget calculator updates live, in euros and dinars.",
      },
      {
        src: "/images/cases/italian-dream-3.png",
        alt: "Journey page: twelve steps from Tunis to Italy",
        caption: "The journey page: twelve steps, the documents for each and their timing.",
      },
    ],
  },
  {
    slug: "ej-vtc",
    projectId: 17,
    hue: "yellow",
    tagline:
      "A chauffeur booking site rebuilt in Angular 20, with a real-time fare estimator priced on the server.",
    role: "Full-stack development",
    year: "2026",
    status: "Live",
    links: [
      { label: "Visit the Angular version", href: "https://ej-vtc.vercel.app/" },
      { label: "Production site", href: "https://ej-vtc.fr/" },
    ],
    video: { src: "/videos/ej-vtc.mp4", poster: "/videos/ej-vtc-poster.jpg" },
    results: [
      { value: "63 kB", label: "of JavaScript over the wire (gzip)" },
      { value: "20", label: "unit tests (Karma + Jasmine)" },
      { value: "15", label: "estimates per minute per visitor, then a polite limit" },
    ],
    problem: [
      "EJ-VTC is a private chauffeur in Le Havre and Normandy: airport and station transfers, hourly hire, D-Day and Loire Valley tours. Visitors want an honest price before they call, and pricing has rules: per kilometre locally, flat rates to airports and cities, hourly packages that are sometimes cheaper.",
      "The production site (ej-vtc.fr) is plain HTML, CSS and JavaScript. This project rebuilds the same product in modern Angular, with the same design, content and prices, without losing speed or behaviour.",
    ],
    built: [
      "The whole interface as Angular 20 standalone components driven by signals, with no NgModules and no zone.js. Each page section is one component; the original stylesheet is reused as is.",
      "A fare estimator: an accessible address combobox with live IGN Géoplateforme suggestions, a server that measures the real road distance and applies the tariff rules, and a suggestion when a flat rate or hourly package beats the per-kilometre price. A Leaflet + IGN map draws the route.",
      "WhatsApp-first booking with pre-filled messages, deployed on Vercel with a serverless fare function that is the same code as the production Cloudflare Worker.",
    ],
    diagram: [
      {
        title: "Browser",
        nodes: [
          { label: "Angular 20 app", note: "Standalone, signals, zoneless" },
          { label: "Address combobox", note: "WAI-ARIA, live suggestions" },
          { label: "Route map", note: "Leaflet, loaded on demand" },
        ],
      },
      {
        title: "Vercel",
        nodes: [
          { label: "Static Angular build", note: "Hashed bundles, long cache" },
          { label: "/api/fare", note: "Same-site check, rate limit" },
          { label: "Tariff rules", note: "Per km, flat rates, packages" },
        ],
      },
      {
        title: "IGN Géoplateforme",
        nodes: [
          { label: "Geocoding", note: "Addresses and places" },
          { label: "Road routing", note: "Distance and duration" },
          { label: "Map tiles", note: "Free, no API key" },
        ],
      },
    ],
    hard: [
      {
        title: "The price is never computed in the browser",
        body: "The browser only asks; the server measures the route and applies the tariff, so a quote can't be edited before booking. The typed pricing rules in the app exist to label and explain a quote, never to produce one.",
      },
      {
        title: "Places the geocoder gets wrong",
        body: "The public geocoder ranks some landmarks badly (\"Mont-Saint-Michel\" can resolve to a summit in Savoie), so known Normandy destinations are matched first. And if routing snaps a point to a road more than 3 km away, at sea or abroad, the quote is refused rather than priced wrong.",
      },
      {
        title: "Signals instead of zone.js",
        body: "The UI runs zoneless. The address field uses model() two-way binding, switchMap cancels a stale autocomplete request where the original code managed an AbortController by hand, and Leaflet only downloads for visitors who open the estimator.",
      },
      {
        title: "A bug found while shipping",
        body: "Deploying the port surfaced a real bug: an address typed without picking a suggestion went out as a bare string, which the API rejects. It now sends { address } like the original site, verified end to end on the live deployment.",
      },
    ],
    gallery: [
      {
        src: "/images/cases/ej-vtc-1.png",
        alt: "Services section: local transfers, airport transfers, hourly hire and tours",
        caption: "Services, each with its starting price.",
      },
      {
        src: "/images/cases/ej-vtc-2.png",
        alt: "Price list: per kilometre, hourly packages and flat rates",
        caption: "A clear price list: per kilometre, hourly packages, flat rates from Le Havre.",
      },
      {
        src: "/images/cases/ej-vtc-3.png",
        alt: "Fare estimator showing a price and the route on a map",
        caption: "The estimator: road distance, price and route, computed on the server.",
      },
    ],
  },
  {
    slug: "noodle",
    projectId: 18,
    hue: "green",
    tagline:
      "A pixel cat that babysits your AI coding agent: approve Claude Code's permission requests straight from his speech bubble.",
    role: "Creator, solo developer",
    year: "2026",
    status: "471 users",
    links: [
      { label: "Visit the site", href: "https://noodle-gray.vercel.app/" },
      { label: "Source on GitHub", href: "https://github.com/hsanjebri/agentpet" },
    ],
    video: { src: "/videos/noodle.mp4", poster: "/videos/noodle-poster.jpg" },
    results: [
      { value: "471", label: "people use Noodle across Tunisia and Europe" },
      { value: "3", label: "platforms: Windows, macOS and Linux" },
      { value: "0", label: "accounts or telemetry required" },
    ],
    problem: [
      "AI coding agents run for minutes at a time, then quietly stop to ask for a permission while you're in another window. You come back to find nothing happened.",
      "Noodle floats above everything, so you see at a glance whether Claude is working, done, or waiting for you, and you can say yes without going back to the terminal.",
    ],
    built: [
      "An Electron desktop app (React, TypeScript, Zustand) with a tiny local server. Claude Code's hooks hand each event to it with a curl call, and the cat's mood follows: asleep when idle, coffee mug while working, hopping and meowing when it needs approval, a rainbow when the task is done.",
      "Approve or deny from the bubble, a session usage bar fed by the status line, warnings on risky actions, and an opt-in phone ping. Around it, everything that keeps people coming back: Pomodoro with a distraction guard, water and stretch reminders, skins, levels and unlockable accessories.",
      "Opt-in friends with visits between desktops, installers for Windows, macOS and Linux with auto-updates, and a small C# helper for music on Windows.",
    ],
    diagram: [
      {
        title: "Claude Code",
        nodes: [
          { label: "Hooks", note: "One curl call per event" },
          { label: "Status line", note: "Feeds the usage bar" },
        ],
      },
      {
        title: "AgentPet (Electron)",
        nodes: [
          { label: "Local server", note: "127.0.0.1:7777" },
          { label: "Main process", note: "Permissions, risk checks, sessions" },
          { label: "Renderer", note: "React + Zustand pixel cat" },
        ],
      },
      {
        title: "Opt-in services",
        nodes: [
          { label: "Supabase", note: "Friends and visits" },
          { label: "ntfy", note: "Phone ping" },
          { label: "Open-Meteo", note: "Weather outfits" },
        ],
      },
    ],
    hard: [
      {
        title: "Never block the agent",
        body: "Events run in the background, so Claude never waits for them. Permission requests wait for a click, but \"answer in terminal\" or two minutes of silence hands the question back. When the app isn't running, the hooks fail silently in a second and Claude Code works exactly as before.",
      },
      {
        title: "Editing someone's settings.json safely",
        body: "Connecting shows exactly what it adds to ~/.claude/settings.json and backs the file up first. It recognises its own entries by agentpet-send, never touches other hooks, and the uninstaller restores the previous status line.",
      },
      {
        title: "Spotting risky actions",
        body: "Noodle puffs up and hisses, and says why, when the agent edits .env, runs rm -rf or git push --force, deletes tests, or touches more than 25 files.",
      },
      {
        title: "Private by default",
        body: "No account and no telemetry. Prayer times are calculated on the computer, the distraction guard reads window titles only locally during a Pomodoro, and every internet feature stays off until it's switched on.",
      },
    ],
    gallery: [
      {
        src: "/images/cases/noodle-1.png",
        alt: "For developers: approve or deny Claude Code requests from the cat's bubble",
        caption: "For developers: approvals, risky-action warnings and the usage bar.",
      },
      {
        src: "/images/cases/noodle-2.png",
        alt: "Focus features: Pomodoro, distraction guard, streaks and countdowns",
        caption: "Focus: Pomodoro with a nap, a distraction guard, streaks and countdowns.",
      },
      {
        src: "/images/cases/noodle-3.png",
        alt: "Three cats to pick from, accessories and sizes",
        caption: "Three cats, unlockable accessories and three sizes.",
      },
    ],
  },
];

export const caseStudyFor = (projectId: number) => caseStudies.find((c) => c.projectId === projectId);
