import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore open-source projects, tools, and experiments built by CodeKrafters SRM students across AI, web development, cybersecurity, and design domains.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Student Projects | CodeKrafters SRM",
    description:
      "Real-world projects built by student developers at SRM Ramapuram — spanning AI, web, security, and creative tech.",
    url: "https://codekraftersrmp.in/projects",
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
