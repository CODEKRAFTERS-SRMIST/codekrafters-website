"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export interface KrafterLinkItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imagePath: string;
  url: string;
  category: "projects" | "tasks";
}

export const KRAFTER_LINKS: KrafterLinkItem[] = [
  {
    id: "launchpad-3",
    title: "Launchpad 3.0 Website",
    subtitle: "PROJECT LINK",
    description: "Official website for Launchpad 3.0 - CodeKrafters' flagship annual tech event.",
    imagePath: "/launchpad/launchpad-003.png",
    url: "https://launchpad-ck.vercel.app/",
    category: "projects",
  },
  {
    id: "web-dev-task",
    title: "Web Development Task",
    subtitle: "DEVELOPMENT TASK",
    description: "Interactive web development challenge and guidelines for Krafters.",
    imagePath: "/ck-core.jpg",
    url: "https://launch-pad-task.vercel.app",
    category: "tasks",
  },
  {
    id: "web3-den",
    title: "Web3-Den",
    subtitle: "WEB3 DOMAIN",
    description: "Showcase of our Web3 domain projects and innovations.",
    imagePath: "/ck-core.jpg",
    url: "https://web3den.vercel.app/",
    category: "projects",
  },
];

/**
 * Security: Validates and sanitizes link URLs to defend against XSS vectors
 * (e.g. javascript:, data:, or malformed protocols) and enforces tab isolation.
 */
function getSanitizedLinkProps(url: string) {
  if (!url || typeof url !== "string") {
    return { safeUrl: "#", isExternal: false };
  }

  const trimmed = url.trim();

  // Allow safe relative paths and local anchors
  if (trimmed.startsWith("/") || trimmed === "#") {
    return { safeUrl: trimmed, isExternal: false };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return { safeUrl: parsed.href, isExternal: true };
    }
  } catch {
    // Return safe fallback if URL parsing fails
    return { safeUrl: "#", isExternal: false };
  }

  return { safeUrl: "#", isExternal: false };
}

export default function KraftersLinkComponent() {
  // Performance optimization: Memoize sanitized link properties
  const sanitizedLinks = useMemo(() => {
    return KRAFTER_LINKS.map((link) => ({
      ...link,
      linkProps: getSanitizedLinkProps(link.url),
    }));
  }, []);

  return (
    <section
      id="krafterslink"
      className="relative w-full bg-[#FFEFB4] min-h-screen overflow-hidden flex flex-col justify-between pt-24 pb-8"
    >
      {/* Header title section */}
      <div className="absolute top-3 sm:top-6 right-3 sm:right-10 text-right z-20">
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0D0D0D] uppercase tracking-tight">
          Krafters{" "}
          <span className="text-[#F2A516] underline decoration-[#0D0D0D] decoration-2 sm:decoration-3 md:decoration-4 underline-offset-2 sm:underline-offset-4">
            Link
          </span>
        </h1>
        <p className="text-[#333333] mt-1 sm:mt-2 text-xs sm:text-sm font-medium">
          The central hub for CodeKrafters links & tasks
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-16 sm:pt-20 md:pt-24 pb-6 z-10 w-full max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="mb-8 sm:mb-14 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0D0D0D] uppercase tracking-wide text-center">
            ALL LINKS
          </h2>
          <div className="h-1 sm:h-[2px] md:h-[3px] w-8 sm:w-12 md:w-16 bg-[#0D0D0D] mx-auto rounded-full mt-1.5 sm:mt-2"></div>
        </div>

        {/* Cards Grid */}
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12 w-full px-2 sm:px-4">
          {sanitizedLinks.map((link, index) => {
            const { safeUrl, isExternal } = link.linkProps;

            return (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group"
              >
                {/* Card Container */}
                <div
                  className={`
                    ck-card relative bg-[#f9f7e5]
                    border-2 sm:border-3 border-[#0D0D0D] rounded-2xl sm:rounded-3xl
                    shadow-[3px_3px_0_#0D0D0D] sm:shadow-[6px_6px_0_#0D0D0D]
                    group-hover:shadow-[5px_5px_0_#0D0D0D] sm:group-hover:shadow-[10px_10px_0_#0D0D0D]
                    transition-all duration-300 p-4 sm:p-5 md:p-6
                    flex flex-col items-center text-center w-64 sm:w-72 md:w-80
                    h-80 sm:h-96 md:h-[410px] flex-shrink-0 justify-between
                  `}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Floating circle indicator */}
                  <div className="absolute -top-3 sm:-top-5 w-14 sm:w-18 md:w-20 h-14 sm:h-18 md:h-20 bg-[#F2A516]/30 rounded-full blur-lg sm:blur-xl opacity-70 group-hover:scale-110 transition-transform" />

                  {/* Circle Image Container */}
                  <div className="w-24 sm:w-28 md:w-32 lg:w-36 h-24 sm:h-28 md:h-32 lg:h-36 overflow-hidden rounded-full border-2 border-[#0D0D0D] mb-2 sm:mb-3 bg-[#FFF2C6] shadow-inner flex-shrink-0 relative flex items-center justify-center">
                    <Image
                      src={link.imagePath}
                      alt={link.title}
                      width={140}
                      height={140}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-[#0D0D0D] group-hover:scale-105 transition-transform line-clamp-2">
                    {link.title}
                  </h3>

                  {/* Subtitle / Role Tag */}
                  <p className="text-[#F2A516] font-bold text-[10px] sm:text-xs md:text-sm uppercase mb-1.5 sm:mb-2 tracking-wide line-clamp-1">
                    {link.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-[#333333] text-xs sm:text-sm font-medium line-clamp-2 px-1">
                    {link.description}
                  </p>

                  {/* External Action Button with Security Hardening */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                    <a
                      href={safeUrl}
                      target={isExternal ? "_blank" : "_self"}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="social-btn flex items-center gap-2 font-bold text-xs sm:text-sm uppercase"
                    >
                      <span>OPEN LINK</span>
                      <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </a>
                  </div>
                </div>

                {/* Shadow Hole */}
                <div className="w-28 sm:w-32 md:w-40 h-3 sm:h-4 md:h-5 mx-auto mt-2 sm:mt-3 bg-black/20 blur-lg sm:blur-xl rounded-full scale-75 sm:scale-90 group-hover:scale-100 sm:group-hover:scale-110 transition-all" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Status Pill Badge */}
      <div className="w-full py-4 sm:py-6 flex items-center justify-center overflow-x-auto px-2 sm:px-4 z-20">
        <div className="relative bg-[#0D0D0D] border-2 sm:border-3 border-[#F2A516] rounded-full shadow-[4px_4px_0_#0D0D0D] sm:shadow-[8px_8px_0_#0D0D0D] px-6 py-2 sm:py-3 flex items-center justify-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#F2A516] animate-pulse"></span>
          <span className="font-bold text-xs sm:text-sm uppercase text-[#FFEFB4] tracking-wide">
            ALL LINKS
          </span>
        </div>
      </div>

      {/* Scoped Paper Texture Styling */}
      <style jsx>{`
        section::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("https://www.transparenttextures.com/patterns/paper-fibers.png");
          opacity: 0.12;
          pointer-events: none;
        }

        .social-btn {
          padding: 8px 16px;
          background: #0d0d0d;
          color: #ffefb4;
          border-radius: 9999px;
          box-shadow: 3px 3px 0 #f2a516;
          transition: 0.25s ease;
        }

        .social-btn:hover {
          transform: translateY(-2px);
          box-shadow: 5px 5px 0 #f2a516;
          color: #f2a516;
        }

        @media (min-width: 768px) {
          .social-btn {
            padding: 10px 20px;
            box-shadow: 3px 3px 0 #f2a516;
          }

          .social-btn:hover {
            transform: translateY(-3px);
            box-shadow: 5px 5px 0 #f2a516;
          }
        }
      `}</style>
    </section>
  );
}
