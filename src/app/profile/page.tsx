"use client";

import React, { useState, useEffect } from "react";
import { Russo_One } from "next/font/google";
import { UserSession } from "@/types/join";
import { User, LogOut } from "lucide-react";

const russoOne = Russo_One({ subsets: ["latin"], weight: "400" });

export default function UserProfile() {
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    const rawSession = localStorage.getItem("codekrafters_user_session");
    if (rawSession) {
      setSession(JSON.parse(rawSession));
    } else {
      window.location.href = "/admin/events";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("codekrafters_user_session");
    window.location.href = "/";
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#FFEFB4] flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D0D0D]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFEFB4] p-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-8 shadow-[8px_8px_0_#0D0D0D] text-[#0D0D0D]">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-[#F2A516] rounded-full border-2 border-[#0D0D0D] flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-[#0D0D0D]" />
          </div>
          <h1 className={`${russoOne.className} text-3xl font-black text-center`}>
            {session.fullName || session.email.split("@")[0]}
          </h1>
          <p className="text-[#333333] font-bold mt-1 bg-white px-3 py-1 rounded-full border-2 border-[#0D0D0D]">
            {session.email}
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white border-2 border-[#0D0D0D] rounded-xl flex justify-between items-center">
            <span className="font-bold text-sm">Account Type</span>
            <span className="text-xs uppercase font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-md border border-blue-300">
              {session.role === "ADMIN" ? "Admin" : "User"}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full mt-4 bg-red-500 text-white font-bold py-3 px-6 rounded-xl border-2 border-[#0D0D0D] shadow-[4px_4px_0_#0D0D0D] hover:-translate-y-1 transition-transform flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
