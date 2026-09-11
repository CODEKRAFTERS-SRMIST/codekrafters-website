"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PresidentPanelRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/join?tab=users");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FFEFB4] flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D0D0D]"></div>
    </div>
  );
}
