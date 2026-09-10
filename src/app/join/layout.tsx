import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join CodeKrafters — Apply Now",
  description:
    "Apply to join CodeKrafters, SRM's premier student developer community. Choose your domain — AI, Web Dev, Cybersecurity, Design, Content, PR, or Events — and kickstart your tech career.",
  alternates: { canonical: "/join" },
  openGraph: {
    title: "Join CodeKrafters SRM — Open Recruitment",
    description:
      "Applications are open! Choose from 7 domains and join SRM Ramapuram's most active tech community.",
    url: "https://codekraftersrmp.in/join",
  },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

