import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Events & Workshops | CodeKrafters SRM",
  description: "Join coding workshops, student hackathons, and developer meetups hosted by CodeKrafters. Discover the latest tech events at SRM.",
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
