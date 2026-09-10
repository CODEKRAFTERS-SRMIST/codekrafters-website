import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KraftersLink — Link Hub",
  description:
    "All CodeKrafters SRM social media, community links, and resources in one place. Follow us on Instagram, LinkedIn, GitHub, and more.",
  alternates: { canonical: "/krafterslink" },
  openGraph: {
    title: "KraftersLink | CodeKrafters SRM",
    description:
      "All official CodeKrafters SRM links — social media, GitHub, community platforms, and resources.",
    url: "https://codekraftersrmp.in/krafterslink",
  },
};

export default function KraftersLinkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
