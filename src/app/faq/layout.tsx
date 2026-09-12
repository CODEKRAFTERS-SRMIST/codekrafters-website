import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | CodeKrafters SRM",
  description:
    "Find answers to frequently asked questions about CodeKrafters SRM — recruitment process, 7 engineering domains, hackathons, workshops, and how to join at SRM Ramapuram.",
  alternates: { canonical: "/faq" },
  keywords: [
    "CodeKrafters SRM FAQ",
    "CodeKrafters questions",
    "how to join CodeKrafters SRM",
    "SRM tech club recruitment FAQ",
    "coding club SRM Ramapuram questions",
  ],
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | CodeKrafters SRM",
    description:
      "Everything you need to know about CodeKrafters SRM: domains, eligibility, recruitment tasks, hackathons, and community culture.",
    url: "https://codekraftersrmp.in/faq",
    siteName: "CodeKrafters SRM",
    images: [
      {
        url: "https://codekraftersrmp.in/logo.png",
        width: 1200,
        height: 630,
        alt: "CodeKrafters SRM FAQ",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions (FAQ) | CodeKrafters SRM",
    description:
      "Everything you need to know about CodeKrafters SRM: domains, recruitment tasks, hackathons, and events.",
    images: ["https://codekraftersrmp.in/logo.png"],
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
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
        name: "FAQ",
        item: "https://codekraftersrmp.in/faq",
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
