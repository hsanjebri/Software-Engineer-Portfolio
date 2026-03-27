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
            "I'm a full-stack software engineer with 2+ years of freelance experience building scalable applications. I focus on API development, system integrations, and shipping end-to-end features that are reliable, fast, and production-ready. I'm self-learning, always improving through hands-on work, and currently building projects that blend engineering with smart automation ideas."
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
            position: "Mobile Developer",
            company: "Accompany Consulting Tunis, Menzah 4",
            period: "Jun. 2024 - Aug. 2024",
            location: "Tunis, Tunisia",
            description:
                "Developed an internal communication app with real-time video/voice calling and chat using Flutter, Firebase, and Laravel.",
            responsibilities: [
                "Building Flutter mobile features for real-time communication",
                "Developing Laravel APIs for users, calls, and sessions",
                "Integrating Firebase Auth, Firestore, and Storage",
                "Implementing presence, notifications, and message sync"
            ],
            technologies: ["Flutter", "Firebase", "Laravel", "REST APIs", "Firestore", "Storage"]
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
            position: "Freelancer",
            company: "Freelance",
            period: "Oct. 2025 - Present",
            location: "Tunis / Remote",
            description:
                "Working full-time as a freelancer since graduating. Building web applications and integrating AI/ML features based on project needs.",
            responsibilities: [
                "Developing full-stack web applications end-to-end",
                "Integrating APIs, databases, and authentication",
                "Delivering production-ready features with clean architecture",
                "Collaborating with clients on requirements and timelines"
            ],
            technologies: ["Full-Stack", "APIs", "Databases", "Authentication"]
        }
    ],
    projects: [
        {
            id: 9,
            title: "JARVIS",
            category: "AI Assistant",
            technologies: "Python, LLMs, NLP, APIs, Multi-agent Systems",
            image: "/images/jarvis.png",
            description:
                "Why JARVIS?\nAs a Software Engineer, I found myself overwhelmed by back-to-back meetings, fragmented communications across Slack and WhatsApp, and a never-ending stream of tasks. I needed a tool for myself—a true second brain that didn't just record, but understood my workflow.\n\nJARVIS was built to solve this. From real-time meeting assistance to cross-platform message summarization, JARVIS ensures you stay in the flow, focus on coding, and never miss a critical detail again.\n\n✨ Key Features\n🎤 Meeting Agent: Joins Google Meet/Zoom, provides real-time transcription, and generates actionable meeting notes.\n💬 Message Agent (Beta): Intelligent monitoring of Slack, WhatsApp, and Email with automated summarization.\n✅ Task Agent (Working): Automated GitHub PR reviews, dependency management, and file organization.\n🌍 Multilingual Support: Fluent in English, French, and Tunisian Arabic.\n🛡️ Stealth Mode: Localized browser processing for privacy during sensitive meetings."
        },
        {
            id: 10,
            title: "Leggy Food Delivery Platform",
            category: "Food Delivery",
            technologies: "Python, PyTorch, BERT, Kafka, Flask, Redis, Spring Boot, Angular",
            image: "/images/oranger.png",
            description:
                "A comprehensive food delivery platform (Spring Boot/Angular) featuring a custom ML-based recommendation microservice. Uses Python, BERT, and Kafka to deliver real-time personalized suggestions for a network of +2800 restaurants."
        },
        {
            id: 1,
            title: "Dari Real Estate Platform",
            category: "Real Estate / AI",
            technologies: "Spring Boot, Angular, TensorFlow, Firebase",
            image: "/images/dari.png",
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
        {
            id: 8,
            title: "Drishti",
            category: "AI / LLM",
            technologies: "Python, PyTorch, Transformers, FastAPI, React, MongoDB",
            image: "/images/drishti.png",
            description:
                "Bangladesh's first intelligent advanced AI chatbot powered by a custom Large Language Model. Features natural language understanding, contextual conversations, and multilingual support including Bengali."
        },
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


