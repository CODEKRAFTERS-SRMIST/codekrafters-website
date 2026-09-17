export interface TaskMilestone {
  phaseNumber: number;
  date: string;
  phase: string;
  status: "completed" | "active" | "upcoming";
  description: string;
}

export interface TrackSubTask {
  title: string;
  desc: string;
  requirements: string[];
}

export interface DomainTrack {
  title: string;
  desc: string;
  requirements?: string[];
  tasks?: TrackSubTask[];
  submissionStructure?: string;
  candidateProfiles?: {
    desc: string;
    required: string[];
    note?: string;
  };
}

export interface DomainTaskDetail {
  slug: string;
  domainName: string;
  category: "Technical" | "Non-Technical" | "Creative";
  tagline: string;
  deadline: string;
  whatsappLink: string;
  submissionLink?: string;
  overview: string;
  tracks?: DomainTrack[];
  deliverables?: string[];
  evaluationCriteria?: { title: string; weight: string; desc: string }[];
  faq?: { q: string; a: string }[];
}

export const RECRUITMENT_TIMELINE_STEPS: TaskMilestone[] = [
  {
    phaseNumber: 1,
    date: "Until Thursday, 17 Sep",
    phase: "Phase 1: Registrations Open",
    status: "active",
    description: "Portal registrations, applicant profile setup, and domain applications.",
  },
  {
    phaseNumber: 2,
    date: "17 September 2026",
    phase: "Phase 2: Round 1 Task Launch",
    status: "upcoming",
    description: "Domain leads release customized recruitment challenges for all applied domains.",
  },
  {
    phaseNumber: 3,
    date: "24 September (11:59 PM)",
    phase: "Phase 3: Task Submission Deadline",
    status: "upcoming",
    description: "Final deadline to submit project links, repos, Figma files, and documentation.",
  },
  {
    phaseNumber: 4,
    date: "25 September 2026",
    phase: "Phase 4: Shortlist Announcement",
    status: "upcoming",
    description: "Shortlisted candidates announced on candidate portal and invited for interview rounds.",
  },
  {
    phaseNumber: 5,
    date: "26 – 27 September 2026",
    phase: "Phase 5: Online Interviews",
    status: "upcoming",
    description: "1-on-1 and panel technical/domain interviews with CodeKrafters domain leads.",
  },
  {
    phaseNumber: 6,
    date: "28 September 2026",
    phase: "Phase 6: Final Results & Onboarding",
    status: "upcoming",
    description: "Official welcome to the CodeKrafters Core Team and kickoff orientation.",
  },
];

export function getTimelineSteps(currentPhase: number = 1): TaskMilestone[] {
  return RECRUITMENT_TIMELINE_STEPS.map((step) => {
    let status: "completed" | "active" | "upcoming" = "upcoming";
    if (step.phaseNumber < currentPhase) {
      status = "completed";
    } else if (step.phaseNumber === currentPhase) {
      status = "active";
    } else {
      status = "upcoming";
    }
    return { ...step, status };
  });
}

export const DOMAIN_TASKS_DATA: Record<string, DomainTaskDetail> = {
  webdevelopment: {
    slug: "webdevelopment",
    domainName: "Web Development",
    category: "Technical",
    tagline: "Build responsive, interactive, and modern web applications using practical web development skills.",
    deadline: "Thursday, September 24, 2026 • 11:59 PM IST",
    whatsappLink: "https://chat.whatsapp.com/KZdCE6slyu14CtM7whD6SH?s=cl&p=i&mlu=0&ilr=4",
    submissionLink: "https://forms.gle/GmrX7YstP22Gc81cA",
    overview:
      "Choose a task based on your year and skill level. First-year participants will focus on frontend fundamentals, responsive design, and basic JavaScript interactions, while second-year participants will work on full-stack systems, public API integrations, databases, authentication, and AI-powered applications.",
    tracks: [
      {
        title: "1st Year: Beginner Web Developer",
        desc: "Build a responsive and visually appealing frontend project while demonstrating HTML, CSS, JavaScript, and basic UI/UX skills.",
        tasks: [
          {
            title: "Task 1: Personal Portfolio Website",
            desc: "Create a personal portfolio website that showcases your profile, skills, projects, and achievements in a clean and responsive design.",
            requirements: [
              "About Me section",
              "Skills section",
              "Projects section",
              "Achievements section",
              "Contact section",
              "Responsive design for mobile and desktop",
              "Basic animations and hover effects",
            ],
          },
          {
            title: "Task 2: Food Ordering Interface",
            desc: "Design a modern and responsive food ordering interface where users can browse food items, explore categories, and add items to a cart.",
            requirements: [
              "Home page with restaurant or brand banner",
              "Food categories such as Pizza, Burgers, Drinks, etc.",
              "Food cards with image, name, price, and description",
              "Add to Cart functionality",
              "Cart displaying selected items and total price",
              "Basic JavaScript interactions",
              "Responsive design for mobile and desktop",
              "Basic animations and hover effects",
            ],
          },
        ],
      },
      {
        title: "2nd Year: Full-Stack / Advanced Web Developer",
        desc: "Build functional web applications involving frontend development, backend APIs, databases, authentication, public API integrations, and AI-powered features.",
        tasks: [
          {
            title: "Task 1: DevHub — GitHub Developer & Repository Analytics",
            desc: "Build a full-stack platform that allows users to search GitHub developers and repositories, explore repository statistics, and maintain personalized collections.",
            requirements: [
              "User registration and login",
              "Search GitHub users",
              "Search GitHub repositories",
              "Developer profile page",
              "Repository details page",
              "Display repository statistics such as stars, forks, issues, and languages",
              "Display contributor information",
              "Display repository activity information",
              "Language distribution or other useful analytics",
              "Save favourite developers",
              "Save favourite repositories",
              "User dashboard",
              "Backend REST API",
              "Database persistence",
              "GitHub API integration",
              "Responsive frontend",
              "Loading and error states",
              "Bonus: Repository comparison",
              "Bonus: Compare two developers",
              "Bonus: API caching and rate-limit handling",
            ],
          },
          {
            title: "Task 2: AI Study Assistant",
            desc: "Build an AI-powered study assistant where students can enter a topic and get explanations, notes, quizzes, and personalized study plans.",
            requirements: [
              "Responsive frontend",
              "User registration and login",
              "AI-powered chat interface",
              "Enter a topic and receive an explanation",
              "Generate concise study notes",
              "Generate MCQs or quiz questions",
              "Generate personalized study plans",
              "Difficulty selection such as Beginner, Intermediate, and Advanced",
              "Backend API for communicating with an LLM",
              "Secure API-key handling using environment variables",
              "Store chat history in a database",
              "Store generated notes or study plans",
              "Multiple conversation support",
              "Loading and error states",
              "Basic prompt engineering",
              "Bonus: Upload a text or PDF file",
              "Bonus: Ask questions about uploaded content",
              "Bonus: Export notes or quizzes",
            ],
          },
        ],
      },
    ],
    deliverables: [
      "Public GitHub repository with a clean, structured README.md.",
      "Live deployment link where applicable.",
      "Short 60-second video demo or GIF showcasing key features.",
    ],
    evaluationCriteria: [
      {
        title: "Code Quality & Architecture",
        weight: "35%",
        desc: "Clean, modular code, appropriate project structure, reusable components, and good development practices.",
      },
      {
        title: "UI/UX & Responsiveness",
        weight: "30%",
        desc: "Visual design, usability, responsiveness, accessibility, and overall polish.",
      },
      {
        title: "Feature Completeness",
        weight: "20%",
        desc: "Successful implementation of the selected task requirements, functionality, and error handling.",
      },
      {
        title: "Documentation & Git Hygiene",
        weight: "15%",
        desc: "Clear README, setup instructions, meaningful commits, and organized GitHub repository.",
      },
    ],
    faq: [
      {
        q: "Can I use libraries and frameworks?",
        a: "Yes! You can use modern libraries and frameworks such as React, Next.js, Tailwind CSS, Express, FastAPI, MongoDB, PostgreSQL, and other relevant tools.",
      },
      {
        q: "Can I choose any task?",
        a: "Choose a task according to your year and skill level. First-year participants should select from the beginner tasks, while second-year participants should select from the advanced tasks.",
      },
      {
        q: "Can I build a full-stack version of a first-year task?",
        a: "Yes, you may extend the basic requirements, but the core task requirements must still be completed.",
      },
      {
        q: "Can I do both frontend and backend?",
        a: "Absolutely. Full-stack implementations are encouraged for participants who are comfortable working across both layers.",
      },
      {
        q: "Can I use external APIs?",
        a: "Yes. Second-year participants are encouraged to integrate publicly available APIs such as the GitHub API. Use free-tier or publicly accessible APIs wherever possible.",
      },
      {
        q: "Can I use any LLM provider for the AI Study Assistant?",
        a: "Yes. Participants may use any suitable LLM API that provides a free tier or free usage option. API keys must be kept secure using environment variables and must not be exposed in the frontend or committed to GitHub.",
      },
      {
        q: "Is the Food Ordering Interface a full-stack project?",
        a: "No. The Food Ordering Interface is a frontend-only task. Backend, database, authentication, and payment integration are not required.",
      },
    ],
  },
  web3: {
    slug: "web3",
    domainName: "Web3 & Blockchain",
    category: "Technical",
    tagline: "Pioneer decentralized applications, smart contracts, and Web3 primitives.",
    deadline: "Thursday, September 24, 2026 • 11:59 PM IST",
    whatsappLink: "https://chat.whatsapp.com/G8H3ufbl0CC0kaI0MNIeGy?s=cl&p=i&mlu=0&ilr=4",
    submissionLink: "https://forms.gle/iJ9HF91eFmUo8rWL8",
    overview:
      "Create a modern, responsive landing page that introduces users to Web3 through interesting facts, concepts, and visuals. As an optional bonus, participants can implement a cryptocurrency wallet connection to demonstrate basic interaction with Web3.",
    tracks: [
      {
        title: "Track A: Web3 Landing Page",
        desc: "Build a creative Web3-themed landing page using HTML and CSS that introduces users to the concepts and possibilities of the decentralized web.",
        requirements: [
          "Build a responsive landing page using HTML and CSS.",
          "Include Web3-based content such as blockchain, decentralization, cryptocurrencies, smart contracts, NFTs, DAOs, or other relevant concepts.",
          "Present the information in a creative and beginner-friendly manner.",
          "Use appropriate sections, icons, animations, or other visual elements to make the page engaging.",
          "Ensure the website is responsive and works well across different screen sizes.",
          "Maintain a clean layout, readable typography, and consistent visual design.",
          "Optional Bonus: Implement a Web3 wallet integration (e.g., MetaMask connection) to earn extra bonus points.",
        ],
      },
    ],
    deliverables: [
      "Public GitHub repository containing the complete source code.",
      "Live deployment link.",
      "Short 60-second video demo or GIF showcasing the key features.",
      "README.md containing a brief description of the project and the Web3 concepts used.",
    ],
    evaluationCriteria: [
      {
        title: "Web3 Content & Understanding",
        weight: "30%",
        desc: "Accuracy, clarity and relevance of the Web3 concepts and information presented.",
      },
      {
        title: "UI/UX & Responsiveness",
        weight: "30%",
        desc: "Visual appeal, creativity, layout, readability, responsiveness, and overall user experience.",
      },
      {
        title: "HTML/CSS Implementation & Git Hygiene",
        weight: "30%",
        desc: "Clean structure, proper use of HTML and CSS, Clear README, organized repository, and meaningful commit history.",
      },
      {
        title: "Wallet Integration",
        weight: "10%",
        desc: "Optional bonus for successfully implementing a wallet.",
      },
    ],
    faq: [
      {
        q: "Is prior Web3 knowledge required?",
        a: "No. The challenge is designed to be beginner-friendly. You can research the required Web3 concepts while working on the task.",
      },
      {
        q: "Do I need to build a complete Web3 application?",
        a: "No. You only need to create the Web3-themed landing page for the main challenge. Building a wallet connection is an optional bonus.",
      },
    ],
  },
  cybersecurity: {
    slug: "cybersecurity",
    domainName: "Cybersecurity",
    category: "Technical",
    tagline: "Defend systems, hunt threats, and master offensive/defensive security fundamentals.",
    deadline: "Thursday, September 24, 2026 • 11:59 PM IST",
    whatsappLink: "https://chat.whatsapp.com/FJgGeB5v6bm3jGYxxdz0rA?s=cl&p=i&mlu=0&ilr=4",
    submissionLink:
      "https://docs.google.com/forms/d/e/1FAIpQLSeoqgR8j9Qi7v6TjWnBxg1DF_2qRhyHUETQ_6E4OFz57LS5Og/viewform?usp=publish-editor",
    overview:
      "Choose a task based on your year. First-year participants complete a TryHackMe walkthrough and a core-concepts explainer, both submitted as Word documents pushed to a public GitHub repo. Second-year participants complete an OWASP Juice Shop exploitation challenge and a Wireshark traffic-analysis task, each documented the same way, and also share their GitHub, TryHackMe, and Hack The Box profiles for general review.",
    tracks: [
      {
        title: "1st Year: Beginner Cyber Security",
        desc: "No prior security experience needed — a guided TryHackMe walkthrough plus a plain-language explainer task.",
        tasks: [
          {
            title: "Task 1: CTF Challenge Walkthroughs (TryHackMe)",
            desc: "Complete these 2 TryHackMe rooms and submit a Word document (.docx) explaining what you did and what you learned.",
            requirements: [
              "Complete both rooms: 'What is Networking?' (https://tryhackme.com/room/whatisnetworking) and 'Intro to Networking' (https://tryhackme.com/room/introtonetworking).",
              "Submit ONE Word document (.docx) covering both rooms — no PDFs, slides, or other formats.",
              "For each room, write a step-by-step account of what you did and a separate section on what you learned — don't merge the two.",
              "Include at least 4 screenshots per room: your progress at key stages plus the final completion screen. A single completion screenshot per room is not sufficient.",
              "Include a direct link to your TryHackMe profile in the document so we can verify both rooms are marked complete.",
              "Push the document to a public GitHub repository (see submission structure below).",
              "Write it so someone unfamiliar with the room could follow your reasoning — this documentation is how we'll know you actually did the work and understood it.",
            ],
          },
          {
            title: "Task 2: Core Security Concepts Explainer",
            desc: "Explain core cybersecurity concepts, like the CIA Triad, in plain, beginner-friendly language using a real-world scenario — submitted as a Word document.",
            requirements: [
              "Explain the CIA Triad (Confidentiality, Integrity, Availability) plus 2 more core concepts of your choice (e.g. authentication vs authorization, encryption vs hashing, threat vs vulnerability vs risk).",
              "For each concept, walk through one concrete real-world scenario (not just a one-line analogy) where that concept applies or is violated, and explain why.",
              "Submit as a single Word document (.docx) — slide decks and infographics will not be accepted for this task.",
              "Include at least one original diagram, screenshot, or illustration per concept (5 concepts total = at least 5 images) — recycled stock images or unlabeled diagrams won't count.",
              "Push the document to the same public GitHub repository as Task 1 (see submission structure below).",
              "Keep it beginner-friendly: avoid unexplained jargon, or explain any term the moment you use it.",
            ],
          },
        ],
        submissionStructure:
          "Create ONE public GitHub repository named <yourname>-cybersec-firstyear. Put both Word documents in the repo root as Task1_TryHackMe.docx and Task2_ConceptsExplainer.docx. Add a README.md with your name, your TryHackMe profile link, and one line per task summarizing what you submitted. Submit the repo link, not the files, via the submission form.",
      },
      {
        title: "2nd Year: Intermediate Cyber Security",
        desc: "Applied, low-setup tasks using free public tools — OWASP Juice Shop and Wireshark. Documentation of your process and learnings is required for both.",
        tasks: [
          {
            title: "Task 1: OWASP Juice Shop Challenge",
            desc: "Set up the free, intentionally-vulnerable OWASP Juice Shop app yourself, exploit a set of its vulnerabilities, and document what you did and what you learned.",
            requirements: [
              "Download and run OWASP Juice Shop locally yourself (free, open-source — Docker or npm install, your choice).",
              "Successfully exploit at least 4 distinct vulnerabilities/challenges within the app (e.g. from categories like injection, broken authentication, XSS, sensitive data exposure).",
              "Submit ONE Word document (.docx). For each vulnerability, document: what it was, your exploitation steps with screenshots/PoC, and the real-world risk it represents.",
              "Include a short summary section of what security concepts you learned overall — this is how we verify the work is genuinely yours and that you understood it.",
              "Push the document to a public GitHub repository (see submission structure below).",
            ],
          },
          {
            title: "Task 2: Basic Wireshark Traffic Capture & Analysis",
            desc: "Capture your own network traffic using Wireshark and analyze it to identify basic patterns and protocols.",
            requirements: [
              "Install Wireshark and capture your own traffic for a short session (e.g. while browsing a few websites).",
              "Identify and document at least 4 different protocols seen in the capture (e.g. HTTP, HTTPS/TLS, DNS, ARP, TCP handshake).",
              "Pick one interesting exchange (e.g. a DNS lookup or a TCP handshake) and walk through it packet-by-packet, explaining what's happening.",
              "Submit ONE Word document (.docx) with the protocol breakdown, the packet walkthrough, and a short summary of what you learned about your own traffic — including anything unencrypted you noticed being sent.",
              "Include screenshots of your Wireshark capture as proof.",
              "Push the document to the same public GitHub repository as Task 1 (see submission structure below).",
              "Only capture your own traffic on your own device/network — never capture traffic on networks you don't own or have permission to monitor.",
            ],
          },
        ],
        submissionStructure:
          "Create ONE public GitHub repository named <yourname>-cybersec-secondyear. Put both Word documents in the repo root as Task1_JuiceShop.docx and Task2_Wireshark.docx. Add a README.md with your name and a one-line summary of each task.",
        candidateProfiles: {
          desc: "In addition to the task submissions, share links to the following so we can review your broader security activity:",
          required: ["GitHub profile", "TryHackMe profile", "Hack The Box profile"],
          note: "These are for our general review of your track record — they are separate from, and not required to complete, Task 1 or Task 2.",
        },
      },
    ],
    deliverables: [
      "One public GitHub repository per participant, containing your Word document(s) as specified in your track's submission structure.",
      "A README.md summarizing what was submitted (and, for 2nd years, links to GitHub, TryHackMe, and Hack The Box profiles).",
      "Screenshots embedded within the Word documents as evidence, per each task's requirements.",
    ],
    evaluationCriteria: [
      {
        title: "Technical Depth & Understanding",
        weight: "40%",
        desc: "Accuracy of analysis, problem-solving, and grasp of the underlying security concept.",
      },
      {
        title: "Actionable Findings / Fixes",
        weight: "30%",
        desc: "Practical, concrete recommendations or fixes where applicable.",
      },
      {
        title: "Effort & Independent Sourcing",
        weight: "20%",
        desc: "Quality of self-sourced materials, code, or investigative technique used.",
      },
      {
        title: "Clarity of Documentation",
        weight: "10%",
        desc: "Clear write-up, structure, and presentation.",
      },
    ],
    faq: [
      {
        q: "Which track should I pick?",
        a: "Choose based on your year — first-years pick from the beginner track, second-years from the intermediate track.",
      },
      {
        q: "Do I need to do both tasks in my track?",
        a: "Check with the recruitment team, but generally completing both tasks in your track strengthens your application.",
      },
      {
        q: "What format should I submit in?",
        a: "All written work must be a single Word document (.docx) per task, pushed to a public GitHub repository as described in your track's submission structure. PDFs, slide decks, and infographics are not accepted for these tasks.",
      },
      {
        q: "Is prior cybersecurity experience required for 1st years?",
        a: "No, both 1st-year tasks are beginner-friendly, but you're expected to research and gather what you need yourself.",
      },
      {
        q: "Can 2nd years use paid CTF platforms or premium TryHackMe rooms?",
        a: "No, stick to free public rooms so the task stays accessible to everyone.",
      },
      {
        q: "Do we need to submit documentation for the Juice Shop and Wireshark tasks?",
        a: "Yes — both 2nd-year tasks require a written documentation of your process and what you learned. This is how we verify the work is genuinely yours and that you understood it.",
      },
      {
        q: "Why do 2nd years need to share a Hack The Box profile if it's not used in either task?",
        a: "It's not graded as part of Task 1 or Task 2 — we ask for it, alongside your GitHub and TryHackMe profiles, purely as a general look at your existing security activity.",
      },
    ],
  },
  competitiveprogramming: {
    slug: "competitiveprogramming",
    domainName: "Competitive Programming",
    category: "Technical",
    tagline: "Test your programming fundamentals, DSA knowledge, and problem-solving speed.",
    deadline: "Thursday, September 24, 2026 • 11:59 PM IST",
    whatsappLink: "https://chat.whatsapp.com/DzNZwqzsEde2dl5cqkVQ4k?s=cl&p=i&mlu=0&ilr=4",
    submissionLink: "",
    overview:
      "We are going to have three rounds, and Round 1 will be a quiz. For First Years, the quiz will cover basics of programming, basics of Python, basics of DSA, and basics of SQL. For Second Years, the quiz will cover basics of DSA and questions related to C++, C, and Python.",
    tracks: [
      {
        title: "Round 1 — First Years",
        desc: "An easy-level objective quiz covering basics of programming, basics of Python, basics of DSA, and basics of SQL.",
        requirements: [
          "Difficulty: Easy.",
          "Language: Python only. No other programming language will be asked.",
          "Task 1 quiz link and instructions will be shared via email.",
          "Task 2 will follow after Task 1, with all details and updates communicated via email and the official WhatsApp group.",
        ],
      },
      {
        title: "Round 1 — Second Years",
        desc: "A medium-level objective quiz covering basics of DSA and programming questions related to C++, C, and Python.",
        requirements: [
          "Difficulty: Medium.",
          "Languages: C++, C, and Python.",
          "Task 1 quiz link and instructions will be shared via email.",
          "Task 2 will follow after Task 1, with all details and updates communicated via email and the official WhatsApp group.",
        ],
      },
    ],
    deliverables: [],
    evaluationCriteria: [],
    faq: [
      {
        q: "How will I receive the Task 1 quiz link and instructions?",
        a: "The quiz link and instructions for attending Task 1 will be sent to you via email. Please keep an eye on your email.",
      },
      {
        q: "When will Task 2 happen and how will it be communicated?",
        a: "Task 2 will follow after Task 1. All details, timelines, and updates for Task 2 will be shared via email and announced in the official WhatsApp group.",
      },
      {
        q: "How do I get updates about the task?",
        a: "The email will contain the WhatsApp group link. Click the link and join the WhatsApp group to receive all task-related updates.",
      },
      {
        q: "Where will I find out when the task goes live?",
        a: "The date and time when the task will go live will be mentioned in the WhatsApp group.",
      },
      {
        q: "What topics will be asked for First Years?",
        a: "For First Years, the quiz will cover basics of programming, Python, DSA, and SQL.",
      },
      {
        q: "What language will be asked for First Years?",
        a: "For First Years, only Python will be asked as a programming language. No other programming language will be included.",
      },
      {
        q: "What languages will be asked for Second Years?",
        a: "For Second Years, questions may be related to C++, C, and Python, along with basics of DSA.",
      },
      {
        q: "What is the difficulty level?",
        a: "The difficulty level will be Easy for First Years and Medium for Second Years.",
      },
    ],
  },
  creatives: {
    slug: "creatives",
    domainName: "Creatives",
    category: "Creative",
    tagline: "Create visually compelling designs and cinematic experiences through strong visual storytelling, composition, and creative execution.",
    deadline: "Thursday, September 24, 2026 • 11:59 PM IST",
    whatsappLink: "https://chat.whatsapp.com/GLszP8zeUsB79YP3h6lzpj?s=cl&p=i&mlu=4&ilr=4",
    submissionLink: "https://docs.google.com/forms/d/e/1FAIpQLSf5ywLcrOKBzakbsf9LALZITH5CiCj2EptxYzTpvnglhJdfQA/viewform",
    overview:
      "Choose from the creative tasks below and demonstrate your ability to transform ideas into visually engaging designs and experiences. The tasks focus on visual composition, typography, color, branding, emotion, video editing, motion, and creative storytelling.",
    tracks: [
      {
        title: "Creative Design",
        desc: "Demonstrate your ability to improve visual communication, create strong compositions, and use design elements intentionally to convey emotion and meaning.",
        tasks: [
          {
            title: "Task 1: Bad Design Surgery",
            desc: "Transform a deliberately poorly designed poster into a professional and visually compelling design without redesigning it from scratch. Retain the original concept, event/message, and core visual elements while improving the overall visual communication.",
            requirements: [
              "Base Canva Project Link: https://canva.link/m8kh6ixeajn6l97",
              "How to duplicate & edit: Open the link above, go to 'File' in the top-left menu, and click 'Make a copy' to create your own editable project copy.",
              "Edit the copied project in Canva or rebuild/enhance in your preferred tool (Figma, Photoshop, Illustrator).",
              "Improve typography and font pairing",
              "Establish clear visual hierarchy",
              "Improve spacing, alignment, scale, and composition",
              "Refine colors and image treatment",
              "Improve cropping and positioning of visual elements",
              "Create a clear emotional tone and overall vibe",
              "Do not completely redesign the original concept",
              "Do not remove or replace the core visual elements",
              "Do not use a generic pre-made template",
              "Include a short explanation of the major design decisions",
            ],
          },
        ],
      },
      {
        title: "Video Editing & Motion",
        desc: "Demonstrate your ability to create rhythm, emotion, atmosphere, and storytelling through professional video editing and motion techniques.",
        tasks: [
          {
            title: "Task 2: “Day in My Life” Cinematic Reel",
            desc: "Create a cinematic “Day in My Life” reel by transforming ordinary everyday moments into a visually engaging story. The final edit should feel intentional, immersive, and professionally crafted.",
            requirements: [
              "Cinematic shot selection and framing",
              "Creative cuts and transitions",
              "Smooth pacing and visual rhythm",
              "Speed ramps where appropriate",
              "Creative use of sound design",
              "Background music that complements the story",
              "Consistent color grading",
              "Appropriate visual effects and motion elements",
              "Natural flow between scenes",
              "Clear storytelling and emotional atmosphere",
            ],
          },
        ],
      },
    ],
    deliverables: [
      "Final exported design/video in high resolution.",
      "Before and after comparison for the Bad Design Surgery task.",
      "Short design breakdown explaining the major creative decisions.",
      "Public link to the submitted work where applicable.",
    ],
    evaluationCriteria: [
      {
        title: "Creativity & Originality",
        weight: "20%",
        desc: "Original thinking, creative execution, experimentation, and ability to approach the task beyond obvious solutions.",
      },
      {
        title: "Emotion & Visual Storytelling",
        weight: "20%",
        desc: "Ability to communicate a clear emotion, atmosphere, vibe, or story through intentional visual and editing choices.",
      },
      {
        title: "Composition & Visual Hierarchy",
        weight: "15%",
        desc: "Effective use of layout, spacing, scale, alignment, balance, framing, and visual hierarchy.",
      },
      {
        title: "Typography & Color",
        weight: "15%",
        desc: "Appropriate typography, font pairing, color relationships, contrast, readability, and overall visual consistency.",
      },
      {
        title: "Technical Execution",
        weight: "15%",
        desc: "Quality of editing, effects, transitions, image treatment, export quality, and attention to technical details.",
      },
      {
        title: "Attention to Detail",
        weight: "10%",
        desc: "Polish, consistency, refinement, and care taken across the final output.",
      },
      {
        title: "Design Reasoning",
        weight: "5%",
        desc: "Ability to clearly explain creative decisions and demonstrate intentional thinking behind the final work.",
      },
    ],
    faq: [
      {
        q: "Can I use any design or editing software?",
        a: "Yes! You may use tools such as Figma, Photoshop, Illustrator, Canva, Affinity, Premiere Pro, After Effects, DaVinci Resolve, CapCut, or other relevant tools.",
      },
      {
        q: "Can I use templates for the Bad Design Surgery task?",
        a: "No. The task is intended to evaluate your ability to make intentional design decisions, so pre-made templates should not be used.",
      },
      {
        q: "Can I completely redesign the poster?",
        a: "No. You must preserve the original concept, event/message, and core visual elements while improving the design.",
      },
      {
        q: "Can I use my own footage for the Day in My Life reel?",
        a: "Yes. You are encouraged to shoot your own footage and creatively transform ordinary moments into a cinematic visual story.",
      },
      {
        q: "Do I need professional camera equipment?",
        a: "No. A smartphone is completely acceptable. The task focuses on your creative eye, editing, storytelling, and technical execution rather than expensive equipment.",
      },
      {
        q: "Can I use AI tools?",
        a: "AI tools may be used where appropriate, but the final work must demonstrate your own creative decisions, editing, and execution.",
      },
    ],
  },
  content: {
    slug: "content",
    domainName: "Content",
    category: "Non-Technical",
    tagline: "We create stories that refuse to be boring",
    deadline: "Thursday, September 24, 2026 • 11:59 PM IST",
    whatsappLink: "https://chat.whatsapp.com/Dm3E60crOin4kJgS19stQn?s=cl&p=i&mlu=0&ilr=4",
    submissionLink: "https://drive.google.com/drive/folders/1ZfzU8Hqjx4AzAh07o5I4-bYVc1m3c9hC",
    overview:
      "Write a creative story paragraph that connects a given beginning and ending in an engaging, logical, and unexpected way.",
    tracks: [
      {
        title: "Track A: The Missing Paragraph",
        desc: "Write a 150-200 word creative paragraph that fills the missing middle of a story, connecting the given beginning and ending.",
        requirements: [
          "Beginning: At exactly 11:47 PM, Arjun received a message from his own number: “Don’t open the door.” Three seconds later, someone knocked.",
          "Ending: The next morning, Arjun found the same message saved on his phone—but this time, the timestamp was tomorrow’s date.",
          "Write the missing middle paragraph in 150-200 words, connecting the beginning and ending while building a creative and suspenseful plot.",
        ],
      },
      {
        title: "Track B: Event Timeline Creation",
        desc: "Create an imaginary technical event of your choice and prepare a timeline covering the whole event from start to finish.",
        requirements: [
          "Create an imaginary event with a name, brief description, date, venue, and duration.",
          "Prepare a clear timeline of all the activities taking place at the event, along with their respective timings.",
        ],
      },
    ],
    deliverables: [
      "Google Doc / Notion link with editing/comment permissions.",
      "In case of handwritten work, a clear and properly taken picture of the writing.",
    ],
    evaluationCriteria: [
      {
        title: "Creativity & Originality",
        weight: "35%",
        desc: "Shows imagination, originality, and thoughtful ideas suited to the task.",
      },
      {
        title: "Structure & Flow",
        weight: "30%",
        desc: "Content is logically organized with a smooth flow and well-connected details.",
      },
      {
        title: "Engagement & Detail",
        weight: "20%",
        desc: "Keeps the reader interested while providing relevant and meaningful details.",
      },
      {
        title: "Clarity & Presentation",
        weight: "15%",
        desc: "Clear, well-written, and easy to understand with a polished presentation.",
      },
    ],
    faq: [
      {
        q: "Can I use AI to write?",
        a: "Submissions must be original. AI may be used for research, but AI-generated copies are disqualified.",
      },
    ],
  },
  prmanagement: {
    slug: "prmanagement",
    domainName: "PR & Management",
    category: "Non-Technical",
    tagline: "You’re the product. The reviews are in.",
    deadline: "Thursday, September 24, 2026 • 11:59 PM IST",
    whatsappLink: "https://chat.whatsapp.com/LfMxoRQlh299cv1L5RDLCS?s=cl&p=i&mlu=0&ilr=4",
    submissionLink:
      "https://docs.google.com/forms/d/e/1FAIpQLSfwPTwRMm5eIZWEh2JSm_12lC47MPLocwDYGLH5JswHZeDWpw/viewform?usp=dialog",
    overview:
      "You are an Amazon product with a 3.5-star rating and 847 reviews. Your job is to figure out what customers are saying about you.",
    tracks: [
      {
        title: "Task Challenge: Not Quite 5 Stars (Video Pitch)",
        desc:
          "Imagine yourself listed as a product on Amazon with a rating of 3.5/5 based on 847 reviews. Through a short video, present yourself as this product and explain what your reviews would say about you.",
        requirements: [
          "Submit a 1-to-2 minute video of yourself presenting your response to the prompt.",
          "Base your response around the 3.5-star, 847-review premise.",
          "Clearly communicate both your strengths and weaknesses through customer review narratives.",
          "Keep the presentation engaging, genuine, and original.",
          "Props, editing, visual elements, or creative hooks may be used, but are not mandatory.",
        ],
      },
    ],
    deliverables: [
      "1 short video submission (Maximum duration: 2 minutes, format: MP4/MOV).",
      "Direct video file upload or shareable Google Drive / unlisted link via the official Google Form.",
      "Clear articulation of strengths, weaknesses, and self-awareness framed around the Amazon review prompt.",
    ],
    evaluationCriteria: [
      {
        title: "Creativity & Concept Interpretation",
        weight: "20%",
        desc: "How uniquely and thoughtfully you interpret the Amazon 3.5-star / 847-review concept.",
      },
      {
        title: "Communication & Delivery",
        weight: "20%",
        desc: "Clarity, confidence, vocal presence, and overall effectiveness of your delivery.",
      },
      {
        title: "Self-Awareness",
        weight: "15%",
        desc: "How genuinely and insightfully you identify your strengths and areas for growth.",
      },
      {
        title: "Audience Engagement",
        weight: "15%",
        desc: "How well you capture, entertain, and hold the viewer’s attention throughout the video.",
      },
      {
        title: "Personality & Authenticity",
        weight: "15%",
        desc: "How naturally your unique individuality, enthusiasm, and perspective come through.",
      },
      {
        title: "Execution & Structure",
        weight: "15%",
        desc: "How effectively you turn the given prompt into a cohesive, well-paced, and complete response.",
      },
    ],
    faq: [
      {
        q: "Do I need to actually use an Amazon-style format?",
        a: "Not necessarily. The Amazon concept is the framework. How you present it is up to you.",
      },
      {
        q: "Do I have to mention exactly 847 reviews?",
        a: "Yes. The 3.5-star rating and 847 reviews are part of the premise and should be incorporated into your response.",
      },
      {
        q: "Do I need to list specific strengths and weaknesses?",
        a: "Yes, but don't simply make a “strengths vs weaknesses” list. Think of how those qualities would appear in your customer reviews.",
      },
      {
        q: "Can I use props or editing?",
        a: "Absolutely! Creativity is encouraged, but fancy editing isn't required.",
      },
      {
        q: "What are you looking for in the video?",
        a: "We want to see how you think, communicate, and present yourself—not whether you can make a polished advertisement.",
      },
      {
        q: "Is there a right answer?",
        a: "No. There is no fixed “correct” product. Your interpretation is the answer.",
      },
    ],
  },
};

export function normalizeDomainKey(domain: string): string {
  const norm = domain.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (norm.includes("webdev") || norm.includes("webdevelopment")) return "webdevelopment";
  if (norm.includes("web3") || norm.includes("blockchain")) return "web3";
  if (norm.includes("cyber") || norm.includes("security")) return "cybersecurity";
  if (norm.includes("cp") || norm.includes("competitive")) return "competitiveprogramming";
  if (norm.includes("creative") || norm.includes("design") || norm.includes("uiux")) return "creatives";
  if (norm.includes("content") || norm.includes("editorial")) return "content";
  if (norm.includes("pr") || norm.includes("management") || norm.includes("operations")) return "prmanagement";
  return "webdevelopment";
}
