"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Footer";

interface Project {
  title: string;
  description: string;
  image: string;
  url: string;
}

const projects: Project[] = [
  {
    title: "CODEARENA",
    description: "A LeetCode-based leaderboard tracker for CodeKrafters community members. Track rankings, submissions, and competitive programming progress in real-time.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
    url: "https://ckfrontend.vercel.app/",
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative bg-white/70 backdrop-blur-md border border-white/50 rounded-xl overflow-hidden hover:border-[#F2B200] transition-all duration-300 hover:shadow-[0_0_30px_rgba(242,165,22,0.25)] hover:-translate-y-1"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220]/90 via-[#0b1220]/30 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white group-hover:text-[#F2B200] transition-colors duration-300">
            {project.title}
          </h3>
        </div>
      </div>

      <div className="p-5">
        <p className="text-[#0b1220]/70 text-sm leading-relaxed mb-4">
          {project.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#0b1220]/60 bg-[#0b1220]/10 px-3 py-1 rounded-full">
            Live Project
          </span>
          <div className="flex items-center text-[#F2B200] font-semibold text-sm group-hover:gap-2 transition-all duration-300">
            <span>Explore</span>
            <svg
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-[#F2B200] text-[#0b1220] px-3 py-1 rounded-full text-xs font-bold">
        LIVE
      </div>
    </a>
  );
}

export default function ProjectsPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#F2F0D8",
        backgroundImage: `
          linear-gradient(to right, rgba(11, 18, 32, 0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(11, 18, 32, 0.08) 1px, transparent 1px)
        `,
        backgroundSize: "24px 24px",
      }}
    >
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <span className="inline-block text-[#F2B200] text-sm font-bold tracking-widest uppercase mb-4">
            Our Work
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
            <span className="text-[#0b1220]">CodeKrafters </span>
            <span className="text-[#F2B200]">Projects</span>
          </h1>
          <p className="text-[#0b1220]/70 text-lg max-w-2xl mx-auto">
            From dev tools to community apps — explore what we have built.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#0b1220]/70 text-lg">
              No projects yet. Stay tuned!
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}