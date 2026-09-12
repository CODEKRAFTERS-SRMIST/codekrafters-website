import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KraftersLink — Official Community Directory | CodeKrafters SRM",
  description:
    "Connect with CodeKrafters SRM across all platforms. Access official Discord, GitHub, LinkedIn, Instagram, and community resources in one place.",
  alternates: { canonical: "/krafterslink" },
  keywords: [
    "CodeKrafters SRM links",
    "KraftersLink directory",
    "CodeKrafters discord",
    "CodeKrafters GitHub",
    "SRM Ramapuram tech club social links",
  ],
  openGraph: {
    title: "KraftersLink — Official Directory | CodeKrafters SRM",
    description:
      "All official CodeKrafters SRM links — Discord, GitHub, LinkedIn, Instagram, announcements, and developer tools.",
    url: "https://codekraftersrmp.in/krafterslink",
    siteName: "CodeKrafters SRM",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "KraftersLink Directory",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KraftersLink — Official Directory | CodeKrafters SRM",
    description:
      "All official CodeKrafters SRM links — social media, GitHub, and community platforms.",
    images: ["/logo.png"],
  },
};

export default function KraftersLinkLayout({ children }: { children: React.ReactNode }) {
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
        name: "KraftersLink",
        item: "https://codekraftersrmp.in/krafterslink",
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
