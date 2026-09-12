"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "What is CodeKrafters SRM and who can join?",
    answer:
      "CodeKrafters is the premier student developer collective and technical society at SRM Institute of Science and Technology, Ramapuram Campus (Chennai, India). Founded in 2022, our mission is to empower student engineers and designers to build production-grade software, compete in national hackathons, and contribute to open-source ecosystems. Any enrolled student at SRM Ramapuram with a passion for software development, system design, or creative media is eligible to join during our recruitment cycles, regardless of their academic branch or prior experience level.",
  },
  {
    question: "What technical and creative domains exist within CodeKrafters?",
    answer:
      "CodeKrafters operates across 7 specialized domains: Artificial Intelligence & Machine Learning (AI/ML models, LLM agents, and computer vision), Full-Stack Web Development (modern frameworks, scalable APIs, and cloud microservices), Cyber Security (penetration testing, network defense, and CTF challenges), Competitive Programming (data structures, algorithms, and contest preparation), Web3 & Blockchain (decentralized applications, smart contracts, and on-chain protocols), UI/UX Design & Creatives (interface architecture, branding, and motion design), and Public Relations, Operations & Event Management (community outreach, hackathon logistics, and industry sponsorships).",
  },
  {
    question: "How does the student recruitment and task challenge process work?",
    answer:
      "Recruitment begins with an online application through the official CodeKrafters portal (/join). Candidates choose their preferred domain and are assigned hands-on, practical domain tasks designed to test problem-solving, engineering aptitude, and creative execution rather than rote theoretical knowledge. After submitting task deliverables on GitHub or Figma, candidates undergo a technical and cultural interview with domain leads and the executive board to evaluate team collaboration, curiosity, and commitment to community peer learning.",
  },
  {
    question: "What major hackathons, workshops, and bounties has CodeKrafters organized?",
    answer:
      "CodeKrafters actively hosts flagship hackathons, developer bootcamps, and technical meetups at SRM Ramapuram, including our annual Launchpad hackathon series, Arbitrum Web3 summits, and Frontier Build Stations. Our community members regularly compete in premier national and international hackathons including ETHIndia, DevsHouse, Aptos Hackathons, and ICP Developer Days, having secured over ₹5 Lakh+ in cumulative hackathon prizes and developer bounties while collaborating with leading tech sponsors such as Devfolio, Polygon, and CoinEx.",
  },
  {
    question: "Do I need prior coding or development experience to apply?",
    answer:
      "No prior professional experience is strictly required to apply. While familiarity with basic programming fundamentals is helpful for technical tracks, CodeKrafters evaluates candidates primarily on curiosity, problem-solving mindset, and willingness to learn. During the recruitment challenge, we provide guidance and resources so passionate candidates can learn new concepts while completing their domain task submissions.",
  },
  {
    question: "Can members collaborate across multiple domains or work on cross-track projects?",
    answer:
      "Absolutely. While every member selects a primary domain track upon joining, CodeKrafters strongly encourages interdisciplinary collaboration. For example, Full-Stack developers collaborate with AI/ML engineers to deploy intelligent web applications, Web3 builders work alongside Cybersecurity specialists to audit smart contracts, and Design and PR tracks coordinate with all engineering teams to launch products and organize hackathons.",
  },
];

interface FaqSectionProps {
  isStandalone?: boolean;
}

export default function FaqSection({ isStandalone = false }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const HeadingTag = isStandalone ? "h1" : "h2";

  return (
    <section
      id="faq"
      className={`relative w-full bg-[#FFEFB4] text-[#0D0D0D] overflow-hidden ${
        isStandalone
          ? "pt-32 sm:pt-36 pb-20 sm:pb-28 min-h-screen flex flex-col justify-center"
          : "py-16 sm:py-24 border-t-2 sm:border-t-3 border-[#0D0D0D]"
      }`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 w-full">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D0D0D] text-[#FFEFB4] text-xs font-mono uppercase tracking-widest mb-4 shadow-[2px_2px_0_#F2A516]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2A516]" />
            <span>KNOWLEDGE BASE & FAQ</span>
          </div>

          <HeadingTag className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#0D0D0D]">
            Frequently Asked{" "}
            <span className="text-[#F2A516] underline decoration-[#0D0D0D] decoration-3 sm:decoration-4 underline-offset-4">
              Questions
            </span>
          </HeadingTag>

          <p className="mt-3 sm:mt-4 text-[#333333] text-sm sm:text-base max-w-xl font-medium">
            Everything you need to know about CodeKrafters SRM — community culture, technical tracks, recruitment, and events.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 sm:space-y-5">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`bg-[#FFF7D6] border-2 sm:border-3 border-[#0D0D0D] rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "shadow-[6px_6px_0_#0D0D0D] -translate-y-0.5"
                    : "shadow-[3px_3px_0_#0D0D0D] hover:shadow-[5px_5px_0_#0D0D0D]"
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#0D0D0D] text-[#FFEFB4] font-mono text-xs sm:text-sm font-bold flex items-center justify-center shadow-[1px_1px_0_#F2A516]">
                      0{idx + 1}
                    </span>
                    <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-[#0D0D0D] tracking-tight">
                      {item.question}
                    </h2>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-[#0D0D0D] bg-[#FFF0BB] flex items-center justify-center text-[#0D0D0D]"
                  >
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 border-t-2 border-[#0D0D0D]/10">
                        <p className="text-sm sm:text-base text-[#222222] font-medium leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
