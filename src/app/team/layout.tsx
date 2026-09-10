import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the passionate students behind CodeKrafters SRM — leads, domain heads, and core members driving innovation across 7 technical domains at SRM Ramapuram.",
  alternates: { canonical: "/team" },
  openGraph: {
    title: "Meet the Team | CodeKrafters SRM",
    description:
      "The people behind CodeKrafters — student leaders, domain heads, and innovators at SRM Ramapuram.",
    url: "https://codekraftersrmp.in/team",
  },
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
