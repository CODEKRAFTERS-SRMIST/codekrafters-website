export interface TaskMilestone {
  phaseNumber: number;
  date: string;
  phase: string;
  status: "completed" | "active" | "upcoming";
  description: string;
}

export interface DomainTaskDetail {
  slug: string;
  domainName: string;
  category: "Technical" | "Non-Technical" | "Creative";
  tagline: string;
  deadline: string;
  whatsappLink: string;
  submissionLink: string;
  overview: string;
  tracks?: { title: string; desc: string; requirements: string[] }[];
  deliverables: string[];
  evaluationCriteria: { title: string; weight: string; desc: string }[];
  faq: { q: string; a: string }[];
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
    tagline: "Build responsive, high-performance web applications with modern tech stacks.",
    deadline: "Thursday, September 24, 2026 • 11:59 PM IST",
    whatsappLink: "https://chat.whatsapp.com/KZdCE6slyu14CtM7whD6SH?s=cl&p=i&mlu=0&ilr=4",
    submissionLink: "https://forms.gle/CodeKraftersWebDevSubmission",
    overview:
      "Craft a modern, responsive web application or interactive component system. We evaluate clean code architecture, design craft, state management, and user experience.",
    tracks: [
      {
        title: "Track A: Frontend / Creative Developer",
        desc: "Build an interactive Developer Showcase or Event Hub with fluid animations, micro-interactions, and dark/light modes.",
        requirements: [
          "Use React, Next.js, or modern vanilla JS with Tailwind or custom CSS.",
          "Implement smooth micro-animations (Framer Motion, GSAP, or CSS animations).",
          "Ensure 100% mobile responsiveness and accessible semantic HTML.",
          "Deploy to Vercel, Netlify, or GitHub Pages.",
        ],
      },
      {
        title: "Track B: Fullstack / Backend Engineer",
        desc: "Build a robust REST or GraphQL API for a club resource manager with authentication, rate limiting, and database persistence.",
        requirements: [
          "Node.js (Express/NestJS) or Go / Python (FastAPI).",
          "PostgreSQL, Supabase, or MongoDB for data modeling.",
          "JWT or session-based authentication with role authorization.",
          "Well-documented API endpoints (Postman collection or Swagger).",
        ],
      },
    ],
    deliverables: [
      "Public GitHub repository with a clean, structured README.md.",
      "Live deployment link (Vercel / Netlify / Render).",
      "Short 60-second video demo or GIF showcasing key features.",
    ],
    evaluationCriteria: [
      { title: "Code Quality & Architecture", weight: "35%", desc: "Clean modular code, type safety, and proper file structuring." },
      { title: "UI/UX & Responsiveness", weight: "30%", desc: "Aesthetics, visual hierarchy, mobile adaptability, and polish." },
      { title: "Feature Completeness", weight: "20%", desc: "Implementation of track requirements and error handling." },
      { title: "Documentation & Git Hygiene", weight: "15%", desc: "Clear README setup instructions and atomic Git commits." },
    ],
    faq: [
      { q: "Can I use libraries like Tailwind or Framer Motion?", a: "Yes! Modern libraries and component packages are encouraged as long as the core logic and styling are your own work." },
      { q: "Can I do both frontend and backend?", a: "Absolutely. Fullstack submissions are highly valued and scored for both layers." },
    ],
  },
  web3: {
    slug: "web3",
    domainName: "Web3 & Blockchain",
    category: "Technical",
    tagline: "Pioneer decentralized applications, smart contracts, and Web3 primitives.",
    deadline: "Thursday, September 24, 2026 • 11:59 PM IST",
    whatsappLink: "https://chat.whatsapp.com/G8H3ufbl0CC0kaI0MNIeGy?s=cl&p=i&mlu=0&ilr=4",
    submissionLink: "https://forms.gle/CodeKraftersWeb3Submission",
    overview:
      "Design and implement a decentralized smart contract system or interactive dApp frontend that demonstrates your understanding of on-chain protocols and wallet interactions.",
    tracks: [
      {
        title: "Track A: Smart Contract Engineer",
        desc: "Write, test, and deploy a secure smart contract on an Ethereum testnet (Sepolia, Arbitrum Sepolia, or Polygon Amoy).",
        requirements: [
          "Solidity with Hardhat / Foundry framework.",
          "Use ERC-20, ERC-721, or custom escrow / voting protocol.",
          "Include comprehensive automated unit tests (minimum 80% coverage).",
          "Verify contract code on Etherscan or block explorer.",
        ],
      },
      {
        title: "Track B: dApp Frontend & Integration",
        desc: "Build an intuitive decentralized frontend interacting with a deployed smart contract.",
        requirements: [
          "Next.js / React with Wagmi, Viem, or Ethers.js.",
          "Wallet connection (RainbowKit, AppKit, or MetaMask).",
          "Read contract state and write transaction triggers with loading & error toasts.",
        ],
      },
    ],
    deliverables: [
      "GitHub repo with contract code, test scripts, and README.",
      "Verified contract address on testnet block explorer.",
      "Live dApp URL or screen recording demonstrating wallet interactions.",
    ],
    evaluationCriteria: [
      { title: "Smart Contract Security & Gas Optimization", weight: "40%", desc: "Reentrancy guards, proper access control, and gas-efficient patterns." },
      { title: "Testing & Verification", weight: "30%", desc: "Exhaustive unit test suites and verifiable contract deployments." },
      { title: "Frontend Integration", weight: "20%", desc: "Seamless Web3 wallet connect and state management." },
      { title: "Documentation", weight: "10%", desc: "Clear explanation of architecture and test execution commands." },
    ],
    faq: [
      { q: "What testnet should I use?", a: "Sepolia, Arbitrum Sepolia, Base Sepolia, or Polygon Amoy are all accepted." },
      { q: "Can I use Foundry?", a: "Yes, Foundry or Hardhat are both welcomed." },
    ],
  },
  cybersecurity: {
    slug: "cybersecurity",
    domainName: "Cybersecurity",
    category: "Technical",
    tagline: "Defend systems, analyze threats, and master defensive/offensive security.",
    deadline: "Thursday, September 24, 2026 • 11:59 PM IST",
    whatsappLink: "https://chat.whatsapp.com/FJgGeB5v6bm3jGYxxdz0rA?s=cl&p=i&mlu=0&ilr=4",
    submissionLink: "https://forms.gle/CodeKraftersCyberSecSubmission",
    overview:
      "Perform a security assessment, solve targeted CTF challenges, or build an automated security scanner/script.",
    tracks: [
      {
        title: "Track A: Web Security Audit & Report",
        desc: "Audit a sample target application or build a detailed security posture review covering OWASP Top 10 vulnerabilities.",
        requirements: [
          "Document discovered vulnerabilities with reproduction steps and CVSS scores.",
          "Provide concrete code-level remediation guidance.",
        ],
      },
      {
        title: "Track B: Security Tooling & Scripting",
        desc: "Develop a Python/Go tool for port scanning, directory fuzzing, or log anomaly detection.",
        requirements: [
          "Clean CLI interface with configurable flags.",
          "Threaded/asynchronous networking.",
          "Structured JSON/CLI reporting.",
        ],
      },
    ],
    deliverables: [
      "GitHub repo with code or PDF Vulnerability Assessment Report.",
      "Proof of Concept (PoC) scripts or screenshots.",
      "Detailed defense remediation roadmap.",
    ],
    evaluationCriteria: [
      { title: "Technical Depth & Threat Understanding", weight: "40%", desc: "Accuracy of vulnerability analysis and root cause identification." },
      { title: "Actionable Remediation", weight: "30%", desc: "Practical, code-level patches and prevention mechanisms." },
      { title: "Tooling / Scripting Proficiency", weight: "20%", desc: "Robust CLI or automation code quality." },
      { title: "Clarity of Documentation", weight: "10%", desc: "Executive summary and technical report structure." },
    ],
    faq: [
      { q: "Can I submit CTF writeups?", a: "Yes! High-quality writeups from recent CTF competitions are valid." },
    ],
  },
  competitiveprogramming: {
    slug: "competitiveprogramming",
    domainName: "Competitive Programming",
    category: "Technical",
    tagline: "Master algorithms, data structures, and high-speed problem solving.",
    deadline: "Thursday, September 24, 2026 • 11:59 PM IST",
    whatsappLink: "https://chat.whatsapp.com/DzNZwqzsEde2dl5cqkVQ4k?s=cl&p=i&mlu=0&ilr=4",
    submissionLink: "https://forms.gle/CodeKraftersCPSubmission",
    overview:
      "Solve a curated set of algorithmic challenges and provide well-documented, optimal solutions with mathematical time/space complexity proofs.",
    tracks: [
      {
        title: "Algorithmic Mastery Track",
        desc: "Submit optimized implementations for 5 challenging algorithmic problems across dynamic programming, graph algorithms, and data structures.",
        requirements: [
          "Languages: C++, Java, or Python (C++ preferred).",
          "Include asymptotic complexity analysis (Big-O) for time and space.",
          "Write clean, modular code with descriptive variable naming and comments explaining key logic.",
        ],
      },
    ],
    deliverables: [
      "GitHub repository containing solution files and an explanation markdown file.",
      "Links to your Codeforces / LeetCode / CodeChef profiles.",
    ],
    evaluationCriteria: [
      { title: "Correctness & Optimality", weight: "45%", desc: "Optimal time and memory bounds without TLE or MLE." },
      { title: "Complexity Analysis", weight: "30%", desc: "Rigorous mathematical proof of asymptotic runtime." },
      { title: "Code Readability", weight: "15%", desc: "Clean variable naming, modular structure, and clear comments." },
      { title: "Competitive Track Record", weight: "10%", desc: "Profile activity and contest consistency." },
    ],
    faq: [
      { q: "Is C++ mandatory?", a: "No, C++, Java, or Python are allowed, though C++ is recommended for performance." },
    ],
  },
  creatives: {
    slug: "creatives",
    domainName: "Creatives & UI/UX",
    category: "Creative",
    tagline: "Design captivating digital experiences, design systems, and visual identities.",
    deadline: "Thursday, September 24, 2026 • 11:59 PM IST",
    whatsappLink: "https://chat.whatsapp.com/GLszP8zeUsB79YP3h6lzpj?s=cl&p=i&mlu=0&ilr=4",
    submissionLink: "https://forms.gle/CodeKraftersCreativesSubmission",
    overview:
      "Create a high-fidelity Figma UI/UX prototype and design system for a designated CodeKrafters product concept.",
    tracks: [
      {
        title: "Track A: UI/UX & Design System",
        desc: "Design a comprehensive desktop & mobile interface for the CodeKrafters Project Portal or Hackathon Platform.",
        requirements: [
          "Consistent typography scale, color tokens, and spacing grid.",
          "Reusable Figma components with auto-layout and interactive variants.",
          "High-fidelity interactive prototype with realistic micro-animations.",
        ],
      },
      {
        title: "Track B: Brand Identity & Motion Graphics",
        desc: "Create an event branding pack including 3 social posters, animated teaser video/GIF, and logo variations.",
        requirements: [
          "Cohesive color palette and typography hierarchy.",
          "Exported production-ready assets (SVG/PNG/MP4).",
        ],
      },
    ],
    deliverables: [
      "Public Figma file link (view/comment permissions enabled).",
      "Short 2-minute video walkthrough explaining design decisions.",
      "High-resolution presentation export (PDF or Behance link).",
    ],
    evaluationCriteria: [
      { title: "Visual Aesthetics & Innovation", weight: "35%", desc: "Distinctive design stance, visual hierarchy, and craft." },
      { title: "User Experience & Usability", weight: "30%", desc: "Intuitive user flows, accessibility, and ergonomic layouts." },
      { title: "Figma Craft & Design System", weight: "25%", desc: "Auto-layout proficiency, component tokens, and organized layers." },
      { title: "Design Rationale Presentation", weight: "10%", desc: "Clarity in explaining design choices in the walkthrough." },
    ],
    faq: [
      { q: "Must I make it interactive?", a: "Yes, an interactive Figma prototype demonstrating page transitions is required." },
    ],
  },
  content: {
    slug: "content",
    domainName: "Content & Editorial",
    category: "Non-Technical",
    tagline: "Craft compelling stories, technical narratives, and developer articles.",
    deadline: "Thursday, September 24, 2026 • 11:59 PM IST",
    whatsappLink: "https://chat.whatsapp.com/Dm3E60crOin4kJgS19stQn?s=cl&p=i&mlu=0&ilr=4",
    submissionLink: "https://forms.gle/CodeKraftersContentSubmission",
    overview:
      "Write a high-impact technical article or brand editorial explaining a complex tech concept in an engaging, accessible manner.",
    tracks: [
      {
        title: "Track A: Technical Deep Dive",
        desc: "Write an 800-1200 word deep-dive into an emerging technology (e.g. LLM Reasoning, Zero-Knowledge Rollups, Rust in Systems).",
        requirements: [
          "Accurate technical details with real-world examples.",
          "Clear subheadings, code snippets, and custom diagrams/tables.",
          "Engaging hook and memorable takeaways.",
        ],
      },
      {
        title: "Track B: Social Campaign & Newsletter",
        desc: "Craft a 3-part LinkedIn/Twitter campaign thread plus a club newsletter edition announcing a major tech event.",
        requirements: [
          "Engaging hooks with high viral potential.",
          "Call-to-action (CTA) optimization.",
        ],
      },
    ],
    deliverables: [
      "Google Doc / Notion link with editing/comment permissions.",
      "List of sources, research references, and optional visual assets.",
    ],
    evaluationCriteria: [
      { title: "Clarity & Tone of Voice", weight: "35%", desc: "Engaging, professional, yet punchy developer-friendly voice." },
      { title: "Technical Accuracy", weight: "30%", desc: "Well-researched concepts with precise terminology." },
      { title: "Structure & Readability", weight: "20%", desc: "Skimmable headers, bullet points, and narrative progression." },
      { title: "Originality & Engagement", weight: "15%", desc: "Unique perspective avoiding generic regurgitations." },
    ],
    faq: [
      { q: "Can I use AI to write?", a: "Submissions must be original. AI may be used for research, but AI-generated copy is disqualified." },
    ],
  },
  prmanagement: {
    slug: "prmanagement",
    domainName: "PR & Management",
    category: "Non-Technical",
    tagline: "Drive partnerships, orchestrate events, and scale developer communities.",
    deadline: "Thursday, September 24, 2026 • 11:59 PM IST",
    whatsappLink: "https://chat.whatsapp.com/LfMxoRQlh299cv1L5RDLCS?s=cl&p=i&mlu=0&ilr=4",
    submissionLink: "https://forms.gle/CodeKraftersPRSubmission",
    overview:
      "Design a comprehensive event proposal and sponsorship outreach strategy for an upcoming flagship CodeKrafters tech summit.",
    tracks: [
      {
        title: "Community Outreach & Event Blueprint",
        desc: "Develop a complete 3-day hackathon or conference operations plan including schedule, logistics, speaker outreach, and volunteer management.",
        requirements: [
          "Targeted sponsor tier package ($500 / $1,000 / $2,500).",
          "Cold outreach email templates customized for potential tech sponsors.",
          "Contingency plan and day-of-event timeline.",
        ],
      },
    ],
    deliverables: [
      "Pitch deck or proposal document (Google Slides / PDF / Notion).",
      "Draft sponsorship outreach email sequence.",
      "Budget breakdown spreadsheet.",
    ],
    evaluationCriteria: [
      { title: "Strategic Thinking & Viability", weight: "35%", desc: "Realistic timelines, practical budgets, and professional proposals." },
      { title: "Communication & Pitch Craft", weight: "35%", desc: "Persuasive sponsorship tiers and compelling value propositions." },
      { title: "Organizational Polish", weight: "20%", desc: "Clear formatting, professional aesthetics, and structured thinking." },
      { title: "Problem Solving", weight: "10%", desc: "Proactive contingency planning for event risks." },
    ],
    faq: [
      { q: "Do I need real sponsors?", a: "No, this is a simulated proposal to evaluate your strategy, outreach copy, and operational planning." },
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
