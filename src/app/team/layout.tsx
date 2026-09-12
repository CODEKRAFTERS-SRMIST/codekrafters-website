import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team & Domain Leads | CodeKrafters SRM",
  description:
    "Meet the visionary student leaders, domain heads, and core developers driving innovation across 7 tech tracks at CodeKrafters SRMIST Ramapuram.",
  alternates: { canonical: "/team" },
  keywords: [
    "CodeKrafters SRM team",
    "Sanjay Ganesh",
    "Satya Lohith",
    "student tech leads Chennai",
    "SRM Ramapuram developers",
    "student club leads SRMIST",
  ],
  openGraph: {
    title: "Our Team & Domain Leads | CodeKrafters SRM",
    description:
      "The student leaders and engineers behind CodeKrafters — driving innovation across AI, Web Dev, Cybersecurity, Web3, and Design at SRM Ramapuram.",
    url: "https://codekraftersrmp.in/team",
    siteName: "CodeKrafters SRM",
    images: [
      {
        url: "https://codekraftersrmp.in/logo.png",
        width: 1200,
        height: 630,
        alt: "CodeKrafters SRM Team",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Team & Domain Leads | CodeKrafters SRM",
    description:
      "Meet the student leaders and domain heads driving CodeKrafters at SRM Ramapuram.",
    images: ["https://codekraftersrmp.in/logo.png"],
  },
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
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
        name: "Our Team",
        item: "https://codekraftersrmp.in/team",
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
