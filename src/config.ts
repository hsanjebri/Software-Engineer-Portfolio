export const config = {
    developer: {
        name: "Hassan",
        fullName: "Hassan Jebri",
        title: "Software Engineer",
        description:
            "Software Engineer building scalable applications and modern web experiences. Passionate about clean engineering, system integration, and shipping production-ready solutions."
    },
    social: {
        github: "https://github.com/hsanjebri",
        email: "jebrihassan66@gmail.com",
        location: "Tunisia"
    },
    about: {
        title: "About Me",
        description:
            "I'm a full-stack software engineer with 2+ years of freelance experience building scalable applications. I focus on API development, system integrations, and shipping end-to-end features that are reliable, fast, and production-ready. I'm self-learning, always improving through hands-on work, and currently building projects that blend engineering with smart automation ideas.",
        // Condensed from the description above for the big About statement.
        statement:
            "I build scalable applications and ship features that are reliable, fast, and production-ready. End to end.",
        photo: "/images/hassan-profile-img.jpg",
        stats: [
            { value: "2+", label: "years of freelance experience" }, // about.description
            { value: "2,800+", label: "restaurants on Leggy, the delivery platform I built" }, // Legy role
            { value: "2025", label: "Software Engineering degree, ESPRIT" } // ESPRIT education
        ]
    },
    experiences: [
        {
            position: "Education",
            company: "IPEIG Tunis, Gafsa",
            period: "Sep. 2020 - Jul. 2022",
            location: "Gafsa, Tunisia",
            description:
                "Preparatory engineering studies at IPEIG Tunis, Gafsa.",
            responsibilities: [
                "Studying preparatory engineering coursework",
                "Building strong foundations for engineering studies",
                "Working on structured academic projects"
            ],
            technologies: ["Engineering Foundations", "Preparatory Studies"]
        },
        {
            position: "Education",
            company: "ESPRIT Tunis, Ariana",
            period: "Sep. 2022 - Oct. 2025",
            location: "Ariana, Tunisia",
            description:
                "Software Engineering degree at ESPRIT — graduated Oct. 2025.",
            responsibilities: [
                "Studying core software engineering and computer science fundamentals",
                "Working on practical engineering projects",
                "Graduating as a Software Engineer (Oct. 2025)"
            ],
            technologies: ["Computer Science", "Software Engineering", "Engineering Projects"]
        },
        {
            position: "Full Stack Developer",
            company: "Accompany Consulting Tunis, Menzah 4",
            period: "Jul. 2023 - Aug. 2023",
            location: "Tunis, Tunisia",
            description:
                "Built a nutrition tracking app with recipe search, meal planning, and user-generated content using Spring Boot and Angular.",
            responsibilities: [
                "Developing Spring Boot services for nutrition and recipes",
                "Implementing Angular UI for search, browsing, and meal planning",
                "Building REST APIs with optimized filtering and search",
                "Managing UGC with moderation workflow",
                "Handling media uploads and adaptive streaming"
            ],
            technologies: ["Spring Boot", "Angular", "REST APIs", "Cloud Storage", "Adaptive Streaming"]
        },
        {
            position: "Full Stack Developer",
            company: "Accompany Consulting Tunis, Menzah 4",
            period: "Jun. 2024 - Aug. 2024",
            location: "Tunis, Tunisia",
            description:
                "Built an internal HR management module with Angular 17 — employee dashboards, leave requests, and real-time notifications via WebSockets — backed by Spring Boot 3.2 REST APIs for user management, role assignment, and reporting with JWT-secured endpoints and PostgreSQL.",
            responsibilities: [
                "Built internal HR management module with Angular 17, including employee dashboards, leave requests, and real-time notifications via WebSockets",
                "Developed Spring Boot 3.2 REST APIs for user management, role assignment, and data reporting, with JWT-secured endpoints and PostgreSQL persistence"
            ],
            technologies: ["Angular 17", "Spring Boot 3.2", "WebSockets", "JWT", "PostgreSQL", "REST APIs"]
        },
        {
            position: "Full Stack Developer",
            company: "Legy Tunis, Tunisia",
            period: "Feb. 2025 - Oct. 2025",
            location: "Tunis, Tunisia",
            description:
                "Developed Leggy, a full-stack food delivery platform using Spring Boot and Angular serving +2800 restaurants. Integrated a custom Python recommendation engine with ML (BERT, PyTorch) and Kafka to provide real-time personalized food and product suggestions.",
            responsibilities: [
                "Building Angular UI/UX components for core e-commerce flows",
                "Developing Spring Boot REST APIs for restaurant and order domains",
                "Integrating payments (Stripe), maps (Google Maps), and auth (Firebase)",
                "Implementing S3 media storage with CDN distribution",
                "Adding AI recommendations and exposing personalized UI experiences",
                "Delivering real-time tracking with WebSockets, Redis, and Kafka",
                "Operating deployments on OVH with Kubernetes and Docker"
            ],
            technologies: [
                "BERT",
                "PyTorch",
                "NLP",
                "VADER",
                "Flask",
                "Angular",
                "Spring Boot",
                "REST APIs",
                "Stripe",
                "Google Maps",
                "Firebase",
                "Amazon S3",
                "CDN",
                "WebSockets",
                "Redis",
                "Kafka",
                "Kubernetes (K8s)",
                "Docker"
            ]
        },
        {
            position: "Software Engineer",
            company: "Freelance",
            period: "Oct. 2025 - Present",
            location: "Tunis / Remote",
            description:
                "Working full-time as a freelancer since graduating. Building web applications and integrating AI/ML features based on project needs.",
            responsibilities: [
                "Developing web applications end-to-end",
                "Integrating APIs, databases, and authentication",
                "Delivering production-ready features with clean architecture",
                "Collaborating with clients on requirements and timelines"
            ],
            technologies: ["APIs", "Databases", "Authentication"]
        },
        {
            position: "Software Engineer",
            company: "DinoByte Information Technology, Dubai, UAE (Remote)",
            period: "Sep. 2025 - Jul. 2026",
            location: "Dubai, UAE (Remote)",
            description:
                "Worked as a core full-time Software Engineer for DinoByte Information Technology (Dubai, UAE), contributing to the company's technology projects with a full-time commitment (40h/week).",
            responsibilities: [
                "Front-end and back-end architecture and development",
                "API design, integration, and maintenance",
                "Blockchain and smart contract integration",
                "Database design and optimization",
                "DevOps coordination and deployment support",
                "Performance optimization and security implementation",
                "Technical documentation and architecture planning"
            ],
            technologies: [
                "Spring Boot",
                "Angular",
                "Blockchain",
                "Smart Contracts",
                "PostgreSQL",
                "REST APIs",
                "DevOps"
            ]
        }
    ],
    projects: [
        {
            id: 18,
            title: "AgentPet (Noodle)",
            category: "Desktop App / Developer Tools",
            technologies: "Electron, TypeScript, React, Vite, Supabase, electron-builder, electron-updater, Vitest, Claude Code hooks",
            image: "/images/agentpet.png",
            link: "https://noodle-gray.vercel.app/",
            description:
                "A desktop pet that babysits your AI coding agent. Noodle is a pixel cat that floats above every window: he sleeps while Claude Code is idle, works while it works, hops and meows when it needs your approval, and farts a rainbow when the task is done. Free, open source (MIT) and cross-platform.\n\n✨ Key Features\n✅ Approve / Deny Claude Code permission requests straight from his speech bubble, via local hooks (curl → 127.0.0.1) that fail silently when the app isn't running\n🙀 Hisses at risky actions: .env edits, rm -rf, git push --force, deleted tests, 25+ files touched\n📊 Session usage bar for the 5-hour Claude limit, hover status, click to jump to the terminal, and opt-in phone pings via ntfy\n🍅 Pomodoro, distraction guard that sits on YouTube / Instagram / TikTok, study streaks and exam countdowns\n💧 Healthy habits: water and stretch reminders, bedtime mode, weather outfits, prayer times and Ramadan mode\n🎩 Grows from kitten to senior cat with XP, unlockable accessories, three skins (Noodle, Mochi, Zitouna) and S / M / L sizes\n👥 Opt-in friends: friend codes, online status, and cats that visit each other's desktops\n🔒 No account, no telemetry; installers for Windows, macOS and Linux with auto-updates\n\nSource: github.com/hsanjebri/agentpet"
        },
        {
            id: 17,
            title: "AA-VTC",
            category: "Business / Booking",
            technologies: "HTML, CSS, JavaScript, Leaflet, Vercel Serverless Functions, IGN Géoplateforme API",
            image: "/images/AA-VTC.png",
            link: "https://aa-vtc.vercel.app/",
            description:
                "\"Anywhere, Anytime.\" A single-page booking site for AA-VTC, a private chauffeur business in Normandy — built as static HTML/CSS/JS with a single Vercel serverless function, no API keys or billing account needed.\n\n✨ Key Features\n🗺️ Free-data map (Leaflet + IGN Plan tiles) showing the service area, tinted to the brand\n📍 Live address suggestions via IGN Géoplateforme geocoding (BAN addresses + places)\n💶 Real-time fare estimator: road-distance pricing via IGN routing, with forfait packages (1h/4h/8h) suggested automatically when they're cheaper\n💬 WhatsApp-first booking flow, with a graceful fallback to pre-filled WhatsApp messages if suggestions, routing or the map are unavailable\n🔒 Rate-limited, same-site-only fare API (20 estimates/min per visitor)"
        },
        {
            id: 16,
            title: "Rowan Hawthorne",
            category: "Portfolio / Animation",
            technologies: "Next.js (App Router), TypeScript, GSAP, ScrollTrigger, SplitText, Lenis",
            image: "/images/roman-portfolio.png",
            link: "https://rowan-hawthorne.vercel.app/",
            description:
                "A concept portfolio for a fictional wildlife photographer, built to showcase scroll-driven animation and motion design. Next.js App Router with strict TypeScript, GSAP + ScrollTrigger + SplitText for the animation system, and Lenis for smooth scrolling — no UI or CSS libraries.\n\n✨ Key Features\n🎬 Timed hero sequence (a bird lands at a configurable second before any typography moves)\n🖼️ Curated photo pipeline: subjects matched against Unsplash by tags, EXIF and orientation, de-duplicated across series, cached and re-curated every 24h\n🎞️ Optional Films section via the Pexels API\n🌗 Dominant-colour + BlurHash placeholders that fade into the full image via next/image\n🖱️ Custom cursor, lightbox with photographer credits, and a dedicated /credits page\n\nLive demo: rowan-hawthorne.vercel.app"
        },
        {
            id: 15,
            title: "Logsy",
            category: "DevOps / CI Intelligence",
            technologies: "Node.js 22, TypeScript, Fastify, Drizzle ORM, PostgreSQL, Redis, BullMQ, Turborepo, Next.js 15",
            image: "/images/logsy.jpg",
            link: "https://github.com/hsanjebri/Logsy",
            description:
                "Intelligent, noise-free CI failure analysis for GitHub Actions. Logsy pinpoints the root cause in thousands of log lines, redacts secrets, and posts one concise, actionable PR comment.\n\n✨ Key Features\n🛡️ Zero secret leaks: multi-pass regex + entropy redaction before anything is cached, stored, or sent to an LLM\n🎯 Error normalization and SHA-256 fingerprints to recognize recurring breakages\n⚡ Rules first, LLM second: deterministic matches for Node, Maven, Gradle, Python, Docker; Claude, OpenAI, or local Ollama only when needed\n💬 A single updatable PR comment that flips to a green badge when the build passes\n📊 Flaky test intelligence from test history\n🔒 Self-hostable with Docker Compose; HMAC SHA-256 webhook verification\n🏛️ pnpm + Turborepo monorepo: Fastify server, BullMQ workers, Next.js dashboard, pluggable LLM package"
        },
        {
            id: 14,
            title: "SEBN TN3 Rework Quality Dashboard",
            category: "Industrial / Real-time Analytics",
            technologies: "NestJS, TypeORM, React, Socket.io, PostgreSQL, SQLite, Railway, Vercel",
            image: "/images/rework-banner.png",
            link: "https://github.com/hsanjebri/ksk-scraper",
            description:
                "Live quality dashboard for the SEBN TN3 rework zone (Mercedes-Benz programme). A NestJS service reads the plant's legacy PHP rework application, stores every record, and pushes new records and closures to a React dashboard over WebSockets.\n\n✨ Highlights\n🔄 Full history sync of 5,939 real records in 107 s with 0 failures; new records reach the dashboard in 3.5 s\n🌉 Cloud bridge: a plant PC agent pushes pages out over HTTPS to a Railway + Vercel deployment, so nothing inside the network is exposed\n🧪 113 passing unit tests, parsers verified against captured live HTML\n🔐 Fail-closed ingest endpoints secured by a shared secret\n🈶 Charset detection for accented French comments (0 corrupted out of 260)\n📈 Three-stage rework flow tracking, error-code analytics, and estimated rework rate / first pass yield"
        },
        {
            id: 12,
            title: "Dosya دوسيا",
            category: "Civic Tech / AI",
            technologies: "Spring Boot 4, Angular 19, PostgreSQL, pgvector, Gemini, Ollama, RAG, Leaflet",
            image: "/images/Capture d'écran 2026-07-17 145703.png",
            link: "https://github.com/hsanjebri/dossia-",
            description:
                "Stop guessing. Start knowing.\n\nDosya (دوسيا — \"file / dossier\" in Tunisian Arabic) is a civic tech platform that helps Tunisian citizens navigate government bureaucracy — passeport, CIN, équivalence de diplôme, résidence, and more. Every answer is grounded in verified procedure data stored in PostgreSQL — not improvised by AI.\n\nTalk in French, English, or Tunisian Derja with voice guides Sofia · Yasmine · Alex. Ask where to go, what papers you need, and get step-by-step guidance with sources and nearest offices on a map.\n\n✨ Key Features\n📚 Verified procedure catalog with sourceUrl + lastVerifiedAt\n🤖 RAG chatbot (Gemini / Ollama) over Procedure records only — offline DB fallback when LLMs are down\n🎤 Voice agents: Sofia (FR), Yasmine (Tunisian Derja), Alex (EN) with browser STT/TTS\n🗺️ Office locator with Leaflet + OSRM routing\n🔐 JWT HttpOnly cookie auth, chat history, and admin verify/publish workflow\n🕷️ Python scraper pipeline (demarches.tn → draft → human verify → embed)"
        },
        {
            id: 13,
            title: "Care for Elders",
            category: "Healthcare / Alzheimer",
            technologies: "Spring Boot, Angular, Healthcare, Patient Care",
            image: "/images/Capture d'écran 2026-07-17 174513.png",
            link: "https://github.com/hsanjebri/care4elders",
            description:
                "A healthcare platform that connects Alzheimer's patients with their doctors to ensure better, continuous medical treatment. Helps families and caregivers coordinate care, track treatment, and keep patients linked to the right medical support."
        },
        {
            id: 11,
            title: "3keys",
            category: "Investment Platform",
            technologies: "Spring Boot 3.4, Angular 19, PostgreSQL, Sumsub KYC/AML",
            image: "/images/image.png",
            link: "https://3keys-front-8sk4.vercel.app/",
            description:
                "Investment platform for fractional real estate and car assets. Built with Spring Boot 3.4 and Angular 19 — secure REST APIs for portfolio management and real-time transaction tracking, Sumsub KYC/AML for investor verification, optimized PostgreSQL schemas for portfolios and wallets (35% faster queries), and a multi-layer recommendation system (semantic similarity, exact match, tag-based boosting) that surfaces personalized opportunities from portfolio and wallet balance."
        },
        {
            id: 9,
            title: "JARVIS",
            category: "AI Assistant",
            technologies: "Python, LLMs, NLP, APIs, Multi-agent Systems",
            image: "/images/jarvis.png",
            link: "https://github.com/hsanjebri/jarvis",
            description:
                "Why JARVIS?\nAs a Software Engineer, I found myself overwhelmed by back-to-back meetings, fragmented communications across Slack and WhatsApp, and a never-ending stream of tasks. I needed a tool for myself—a true second brain that didn't just record, but understood my workflow.\n\nJARVIS was built to solve this. From real-time meeting assistance to cross-platform message summarization, JARVIS ensures you stay in the flow, focus on coding, and never miss a critical detail again.\n\n✨ Key Features\n🎤 Meeting Agent: Joins Google Meet/Zoom, provides real-time transcription, and generates actionable meeting notes.\n💬 Message Agent (Beta): Intelligent monitoring of Slack, WhatsApp, and Email with automated summarization.\n✅ Task Agent (Working): Automated GitHub PR reviews, dependency management, and file organization.\n🌍 Multilingual Support: Fluent in English, French, and Tunisian Arabic.\n🛡️ Stealth Mode: Localized browser processing for privacy during sensitive meetings."
        },
        {
            id: 10,
            title: "Leggy Food Delivery Platform",
            category: "Food Delivery",
            technologies: "Python, PyTorch, BERT, Kafka, Flask, Redis, Spring Boot, Angular",
            image: "/images/oranger.png",
            link: "https://github.com/hsanjebri/leggy_client_web",
            description:
                "A comprehensive food delivery platform (Spring Boot/Angular) featuring a custom ML-based recommendation microservice. Uses Python, BERT, and Kafka to deliver real-time personalized suggestions for a network of +2800 restaurants."
        },
        {
            id: 1,
            title: "Dari Real Estate Platform",
            category: "Real Estate / AI",
            technologies: "Spring Boot, Angular, TensorFlow, Firebase",
            image: "/images/dari.png",
            link: "https://github.com/hsanjebri/Dari",
            description:
                "A comprehensive real estate application offering property listings, advanced search, filtering, and recommendation services. Integrated TensorFlow for predictive analytics (price estimation) and leveraged Firebase for secure real-time data synchronization and authentication."
        },
        {
            id: 2,
            title: "Clinivia",
            category: "AI / Healthcare",
            technologies: "Spring Boot, Angular, AI (Predictive Analytics), Microservices",
            image: "/images/clinivia.png",
            description:
                "An AI-driven elderly care management platform enabling real-time patient monitoring and personalized care plans. Built with a microservices architecture for scalable handling of patient, caregiver, and analytics modules, with AI-powered dashboards for proactive decision-making."
        },
        {
            id: 3,
            title: "Morent",
            category: "Car Rental",
            technologies: "Web Application",
            image: "/images/morent.png",
            description:
                "A car rental platform with a booking flow for pick-up and drop-off, vehicle selection, and a catalog of available cars for quick rental decisions."
        },
        {
            id: 4,
            title: "Jobit",
            category: "Job Search",
            technologies: "PHP, Laravel, React, CSS",
            image: "/images/jobit.png",
            description:
                "A job search platform for developers featuring latest job posts, recommended listings, and structured job cards for fast browsing and discovery."
        },
        {
            id: 5,
            title: "TripGuide",
            category: "Travel Booking",
            technologies: "Web Application",
            image: "/images/tripguide.png",
            description:
                "A travel booking platform supporting hotels, flights, and car rentals. Provides search interfaces to plan trips with route and option selections."
        },
        {
            id: 6,
            title: "LearnQuest",
            category: "E-Learning",
            technologies: "Web Application",
            image: "/images/learnquest.png",
            description:
                "LearnQuest - an e-learning project built to support structured learning and discovery through a modern web experience."
        },
        {
            id: 7,
            title: "Crypo",
            category: "Crypto Exchange",
            technologies: "Web Application",
            image: "/images/crypo-trading.jpeg",
            description:
                "A crypto exchange trading dashboard with market listings, trading charts, and an order book interface for exchange-style interactions."
        },
    ],
    certificates: [
        {
            id: 1,
            title: "Google Project Management Professional Certificate",
            issuer: "Google / Coursera",
            date: "Nov 4, 2024",
            image: "/images/google-project-management.png",
            file: "/images/google-project-management.pdf",
            link: "https://coursera.org/verify/professional-cert/ZWXZ4DELLPPN"
        },
        {
            id: 2,
            title: "IBM Full Stack Software Developer Professional Certificate",
            issuer: "IBM / Coursera",
            date: "Dec 30, 2024",
            image: "/images/ibm-fullstack.png",
            link: "https://coursera.org/verify/professional-cert/6Z6TN1YYE584"
        },
        {
            id: 3,
            title: "Angular - The Complete Guide (2025 Edition)",
            issuer: "Udemy",
            date: "Feb 25, 2025",
            image: "/images/angular-certif.png",
            link: "https://ude.my/UC-4aac3d72-20ec-4c1c-b992-91a32c2ee38b"
        },
        {
            id: 4,
            title: "IELTS Academic – Overall Band 7.0 (CEFR C1)",
            issuer: "IELTS",
            date: "Dec 21, 2025",
            image: "/images/ielts-scren.png",
            file: "/images/ielts-result.pdf",
            scores: {
                overall: "7.0",
                listening: "8.0",
                reading: "7.5",
                writing: "6.0",
                speaking: "6.0"
            }
        }
    ],
    contact: {
        email: "jebrihassan66@gmail.com",
        github: "https://github.com/hsanjebri",
        linkedin: "https://www.linkedin.com/in/hassan-jebri-27b232265/",
        twitter: "https://x.com/HsanJebri",
        facebook: "https://www.facebook.com/hassan.jebri.5",
        instagram: ""
    },
    skills: {
        develop: {
            title: "SOFTWARE ENGINEER",
            description: "Building scalable applications and reliable systems",
            details: "Developing AI agents, chatbots, and machine learning models using Python, TensorFlow, and PyTorch. Specializing in LLMs, NLP, deep learning, and autonomous systems.",
            tools: ["Python", "TensorFlow", "PyTorch", "OpenCV", "Scikit-learn", "LLMs", "NLP", "Deep Learning", "Chatbots", "AI Agents"]
        },
        design: {
            title: "FULL-STACK",
            description: "Modern web development & scalable applications",
            details: "Building responsive and performant web applications using React, Next.js, Node.js, and databases. Creating seamless user experiences with modern UI/UX principles.",
            tools: ["Angular", "Spring Boot", "React", "Next.js", "Node.js", "TypeScript", "Flutter", "Kafka", "Kubernetes", "MongoDB", "PostgreSQL", "TailwindCSS", "REST APIs", "Docker", "Git"]
        }
    }
};


