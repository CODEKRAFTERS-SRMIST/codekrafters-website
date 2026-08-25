import type { Metadata } from "next";
import "./globals.css";

import AppShell from "./AppShell";
import { DevToolsBlocker } from "@/components/DevToolsBlocker";

export const metadata: Metadata = {
  metadataBase: new URL("https://codekrafters.tech"),
  title: "CodeKrafters | Premier SRM Tech Community & Developer Club",
  description:
    "Join CodeKrafters, the leading SRM tech community. Explore 7 dynamic domains, attend coding workshops, and build real-world student developer projects.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "CodeKrafters SRM RMP",
    description:
      "IT’S MORE THAN A CLUB — A student community with 7 technical and non-technical domains driving innovation, creativity, and leadership.",
    url: "https://codekrafters.tech/",
    siteName: "CodeKrafters SRM RMP",
    images: [
      {
        url: "https://codekrafters.tech/og.jpg",
        width: 1200,
        height: 630,
        alt: "CodeKrafters SRM RMP",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "CodeKrafters SRM RMP",
    description:
      "IT’S MORE THAN A CLUB — Learn, build, and grow across 7 diverse domains.",
    images: ["https://codekrafters.tech/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CodeKrafters SRM RMP",
    url: "https://codekrafters.tech/",
    logo: "https://codekrafters.tech/logo.png",
    description: "A student community with 7 technical and non-technical domains driving innovation, creativity, and leadership.",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="antialiased bg-black text-white dark">
        <DevToolsBlocker />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
