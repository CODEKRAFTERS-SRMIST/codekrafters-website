import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join CodeKrafters SRM | Apply for 2026 Student Recruitment",
  description:
    "Applications are open for CodeKrafters SRM! Choose from 7 specialized domains in tech, design, and management. Take the domain challenge and apply today.",
  alternates: { canonical: "/join" },
  keywords: [
    "Join CodeKrafters SRM",
    "SRM tech club recruitment",
    "coding club application SRM",
    "SRM Ramapuram tech recruitment 2026",
    "student developer club Chennai",
  ],
  openGraph: {
    title: "Join CodeKrafters SRM | Apply for 2026 Student Recruitment",
    description:
      "Applications are open! Select your domain — AI, Web Dev, Cybersecurity, Design, Content, PR, or Operations — and join SRM Ramapuram's premier community.",
    url: "https://codekraftersrmp.in/join",
    siteName: "CodeKrafters SRM",
    images: [
      {
        url: "https://codekraftersrmp.in/logo.png",
        width: 1200,
        height: 630,
        alt: "Join CodeKrafters SRM",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join CodeKrafters SRM | Apply for 2026 Student Recruitment",
    description:
      "Applications are open! Join CodeKrafters across 7 technical and creative domains at SRM Ramapuram.",
    images: ["https://codekraftersrmp.in/logo.png"],
  },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
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
        name: "Join Us",
        item: "https://codekraftersrmp.in/join",
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
