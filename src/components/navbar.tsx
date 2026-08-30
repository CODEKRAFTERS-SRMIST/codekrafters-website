"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Users,
  FolderKanban,
  BookOpen,
  Link as LinkIcon,
  UserPlus,
  User,
} from "lucide-react";
import { UserSession } from "@/types/join";

export function Navbar() {
  const pathname = usePathname();

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);

  const updateSession = () => {
    try {
      const raw = localStorage.getItem("codekrafters_user_session");
      if (raw) setSession(JSON.parse(raw));
      else setSession(null);
    } catch (e) {}
  };

  useEffect(() => {
    updateSession();
    window.addEventListener("storage", updateSession);
    window.addEventListener("auth_change", updateSession);
    return () => {
      window.removeEventListener("storage", updateSession);
      window.removeEventListener("auth_change", updateSession);
    };
  }, []);

  const navLinks = [
    { label: "HOME", href: "/", id: "home", icon: Home },
    { label: "EVENTS", href: "/events", id: "events", icon: Calendar },
    { label: "OUR TEAM", href: "/team", id: "team", icon: Users },
    { label: "PROJECTS", href: "/projects", id: "projects", icon: FolderKanban },
    { label: "BLOG", href: "https://ck-blog-platform.vercel.app/", id: "blog", icon: BookOpen },
    { label: "KRAFTERSLINK", href: "/krafterslink", id: "krafterslink", icon: LinkIcon },
    { label: "JOIN US", href: "/join", id: "join", icon: UserPlus },
    { label: "PROFILE", href: "/profile", id: "profile", icon: User },
  ];

  useEffect(() => {
    const current = navLinks.find(
      (l) => l.href === pathname || (l.id === "blog" && pathname.startsWith("/blog"))
    );
    if (current) setActiveLink(current.id);
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 pt-safe pointer-events-none">
      <div className="flex justify-center w-full pt-4 relative">
        <div
          className="flex flex-col items-center pb-4 relative"
          onMouseEnter={() => {
            if (window.innerWidth >= 768) setIsExpanded(true);
          }}
          onMouseLeave={() => {
            if (window.innerWidth >= 768) setIsExpanded(false);
            setHoveredLink(null);
          }}
        >
          {/* Stable Hover Hitbox to prevent flickering when logo shrinks */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 h-[56px] pointer-events-auto z-20 cursor-pointer"
            style={{ width: "180px" }}
            onClick={() => {
              if (window.innerWidth < 768) setIsExpanded((p) => !p);
            }}
          />

          {/* Main Logo Button */}
          <div
            onClick={() => {
              if (window.innerWidth < 768) setIsExpanded((p) => !p);
            }}
            className="flex items-center justify-center cursor-pointer pointer-events-auto"
            style={{
              backgroundColor: "#0D0D0D",
              width: isExpanded ? "56px" : "180px",
              height: isExpanded ? "48px" : "56px",
              borderRadius: isExpanded ? "12px" : "24px",
              border: "1px solid rgba(242,242,242,0.15)",
              transition: "all 700ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <Image
              src="/ck_logo.svg"
              alt="CK Logo"
              width={36}
              height={28}
              className="object-contain pointer-events-none"
            />
          </div>

          {/* Links Container */}
          <div
            className="pt-2"
            style={{
              opacity: isExpanded ? 1 : 0,
              pointerEvents: isExpanded ? "auto" : "none",
              transform: isExpanded
                ? "translateY(0) scale(1)"
                : "translateY(-14px) scale(0.95)",
              transition:
                "opacity 300ms cubic-bezier(0.16,1,0.3,1), transform 300ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="flex flex-col md:flex-row gap-1 md:gap-2 bg-[#0D0D0D] p-3 rounded-2xl border border-[#2a2a2a] shadow-xl min-w-[200px] md:min-w-0">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeLink === link.id;
                const isHovered = hoveredLink === link.id;
                const isExternal = link.href.startsWith("http");



                return (
                  <a
                    key={link.id}
                    href={link.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    onClick={() => {
                      setActiveLink(link.id);
                      // Don't set isExpanded to false immediately to prevent pointerEvents none from cancelling click
                    }}
                    onMouseEnter={() => setHoveredLink(link.id)}
                    onMouseLeave={() => setHoveredLink(null)}
                    title={link.label}
                    className={`relative flex items-center gap-3 md:gap-0 justify-start md:justify-center px-4 md:px-3 py-3 md:py-2 cursor-pointer rounded-xl md:rounded-none transition-colors ${isActive || isHovered ? 'bg-[#1a1a1a] md:bg-transparent' : 'hover:bg-[#1a1a1a] md:hover:bg-transparent'}`}
                  >
                    <Icon className="w-5 h-5 shrink-0 md:hidden transition-colors" style={{ color: isActive || isHovered ? "#F2A516" : "#F2F2F2" }} />

                    <span
                      className="text-xs sm:text-sm font-medium tracking-wider transition-colors"
                      style={{
                        color: isActive || isHovered ? "#F2A516" : "#F2F2F2",
                      }}
                    >
                      {link.label}
                    </span>

                    <div
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300 hidden md:block"
                      style={{
                        width: isActive || isHovered ? "70%" : "0%",
                        height: "2px",
                        backgroundColor: "#F2A516",
                      }}
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
