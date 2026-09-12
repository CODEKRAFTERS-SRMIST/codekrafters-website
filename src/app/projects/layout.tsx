import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Developer Projects & Open Source | CodeKrafters SRM",
  description:
    "Discover open-source software, prototypes, and developer tools crafted by CodeKrafters student engineers at SRM Ramapuram across AI, Web, and Cybersecurity.",
  alternates: { canonical: "/projects" },
  keywords: [
    "CodeKrafters SRM projects",
    "student open source India",
    "SRM student developers",
    "SRMIST software projects",
    "developer tools Chennai",
  ],
  openGraph: {
    title: "Student Developer Projects & Open Source | CodeKrafters SRM",
    description:
      "Real-world builds, open-source repositories, and developer tools created by students at CodeKrafters SRMIST Ramapuram.",
    url: "https://codekraftersrmp.in/projects",
    siteName: "CodeKrafters SRM",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CodeKrafters SRM Projects",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Developer Projects & Open Source | CodeKrafters SRM",
    description:
      "Explore software and tools built by CodeKrafters student engineers at SRM Ramapuram.",
    images: ["/opengraph-image"],
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://codekraftersrmp.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: "https://codekraftersrmp.in/projects",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
