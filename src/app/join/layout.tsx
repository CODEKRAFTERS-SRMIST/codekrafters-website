import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Our Tech Community | CodeKrafters SRM",
  description: "Apply to join CodeKrafters, the premier tech community and student developer club at SRM. Find your domain and grow your skills.",
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
