import type { Metadata } from "next";
import "./globals.css";

import AppShell from "./AppShell";
import { DevToolsBlocker } from "@/components/DevToolsBlocker";

export const metadata: Metadata = {
  metadataBase: new URL("https://codekraftersrmp.in"),
  title: {
    default: "CodeKrafters | Premier SRM Tech Community & Developer Club",
    template: "%s | CodeKrafters SRM",
  },
  description:
    "CodeKrafters is SRM's premier student tech community. Join 7 dynamic domains — AI, Web Dev, Cybersecurity, Design, Content, PR & Events. Build real projects, attend hackathons, and grow with 500+ student developers.",
  keywords: [
    "CodeKrafters SRM",
    "SRM tech club",
    "SRM developer community",
    "student coding club Chennai",
    "SRM RMP tech society",
    "coding club SRM Ramapuram",
    "student hackathon SRM",
    "tech community India",
  ],
  authors: [{ name: "CodeKrafters SRM", url: "https://codekraftersrmp.in" }],
  creator: "CodeKrafters SRM",
  publisher: "CodeKrafters SRM",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "CodeKrafters — SRM's Premier Tech Community",
    description:
      "IT'S MORE THAN A CLUB — 7 domains. Real projects. Student developers. Join CodeKrafters at SRM Ramapuram and build your tech career.",
    url: "https://codekraftersrmp.in/",
    siteName: "CodeKrafters SRM",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CodeKrafters SRM — Premier Student Tech Community & Developer Club",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeKrafters SRM — Premier Student Tech Community",
    description:
      "7 domains. Real projects. 500+ student developers. Join CodeKrafters at SRM Ramapuram.",
    images: ["/opengraph-image"],
    creator: "@codekrafterssrm",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "Organization"],
    name: "CodeKrafters SRM",
    alternateName: ["CodeKrafters", "CodeKrafters SRMIST", "CodeKrafters Ramapuram"],
    url: "https://codekraftersrmp.in/",
    logo: {
      "@type": "ImageObject",
      url: "https://codekraftersrmp.in/logo.png",
      width: 200,
      height: 200,
    },
    description:
      "CodeKrafters is the premier student tech community and developer collective at SRM Ramapuram, fostering innovation across 7 engineering and creative domains.",
    foundingDate: "2022",
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "SRM Institute of Science and Technology, Ramapuram",
      url: "https://srmrmp.edu.in/",
      sameAs: [
        "https://en.wikipedia.org/wiki/SRM_Institute_of_Science_and_Technology",
        "https://www.wikidata.org/wiki/Q1429402",
      ],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bharathi Salai, Ramapuram",
      addressLocality: "Chennai",
      addressRegion: "Tamil Nadu",
      postalCode: "600089",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 13.0324,
      longitude: 80.1802,
    },
    leader: [
      {
        "@type": "Person",
        name: "Sanjay Ganesh",
        jobTitle: "President",
        sameAs: "https://www.linkedin.com/in/sanjay-ganesh-k-barade-675b38324/",
      },
      {
        "@type": "Person",
        name: "Satya Lohith",
        jobTitle: "Vice President",
        sameAs: "https://www.linkedin.com/in/satyalohith455",
      },
    ],
    sameAs: [
      "https://www.instagram.com/codekrafterssrm/",
      "https://www.linkedin.com/company/codekrafters-srm/",
      "https://github.com/CODEKRAFTERS-SRMIST",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "codekraftersrmp@gmail.com",
      contactType: "student organization",
      areaServed: "IN",
      availableLanguage: ["English", "Tamil", "Hindi"],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CodeKrafters SRM",
    url: "https://codekraftersrmp.in/",
    description:
      "Premier student tech community at SRM Ramapuram — 7 domains, real projects, hackathons.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://codekraftersrmp.in/?s={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="antialiased bg-black text-white dark">
        <DevToolsBlocker />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

