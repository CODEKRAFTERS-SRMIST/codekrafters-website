import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Events & Hackathons 2026 | CodeKrafters SRM",
  description:
    "Explore developer hackathons, Web3 bootcamps, and technical workshops hosted by CodeKrafters at SRM Ramapuram. Build, learn, and win national bounties.",
  alternates: { canonical: "/events" },
  keywords: [
    "CodeKrafters SRM events",
    "hackathons SRM Ramapuram",
    "Chennai student hackathons",
    "tech workshops SRMIST",
    "Launchpad hackathon",
    "Web3 developer bootcamp",
  ],
  openGraph: {
    title: "Tech Events & Hackathons 2026 | CodeKrafters SRM",
    description:
      "Flagship hackathons, developer bootcamps, speaker sessions, and national competitions hosted by CodeKrafters at SRM Ramapuram.",
    url: "https://codekraftersrmp.in/events",
    siteName: "CodeKrafters SRM",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CodeKrafters SRM Tech Events",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Events & Hackathons 2026 | CodeKrafters SRM",
    description:
      "Join coding workshops, student hackathons, and developer meetups hosted by CodeKrafters SRM.",
    images: ["/opengraph-image"],
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
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
        name: "Events",
        item: "https://codekraftersrmp.in/events",
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
