import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read technical articles, tutorials, and project breakdowns from CodeKrafters SRM student developers. Covering AI, web dev, cybersecurity, and more.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "CodeKrafters Blog — Tech Articles by SRM Students",
    description:
      "Deep-dives, tutorials, and project showcases from student developers at SRM Ramapuram.",
    url: "https://codekraftersrmp.in/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
