"use client";

import React, { useState, useEffect } from "react";
import { Russo_One } from "next/font/google";
import { UserSession } from "@/types/join";
import { ShieldCheck, User } from "lucide-react";

const russoOne = Russo_One({ subsets: ["latin"], weight: "400" });

export default function PresidentPanel() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const rawSession = localStorage.getItem("codekrafters_user_session");
    if (rawSession) {
      const parsed: UserSession = JSON.parse(rawSession);
      if (parsed.admin_level === "PRESIDENT") {
        setSession(parsed);
        fetchUsers();
      } else {
        window.location.href = "/";
      }
    } else {
      window.location.href = "/admin/events";
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRole = async (userId: string, role: string, admin_level?: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role, admin_level }),
      });
      if (res.ok) {
        fetchUsers(); // refresh the list
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFEFB4] flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D0D0D]"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#FFEFB4] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`${russoOne.className} text-4xl font-black text-[#0D0D0D]`}>
            President Panel
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="bg-gray-200 text-[#0D0D0D] font-bold py-2 px-6 rounded-full border-2 border-[#0D0D0D] shadow-[4px_4px_0_#0D0D0D] hover:-translate-y-1 transition-transform"
            >
              Back
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("codekrafters_user_session");
                window.location.href = "/";
              }}
              className="bg-red-500 text-white font-bold py-2 px-6 rounded-full border-2 border-[#0D0D0D] shadow-[4px_4px_0_#0D0D0D] hover:-translate-y-1 transition-transform"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 shadow-[6px_6px_0_#0D0D0D] text-[#0D0D0D]">
          <h2 className="text-2xl font-bold mb-6">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#0D0D0D] text-[#FFEFB4]">
                  <th className="p-4 text-left rounded-tl-xl font-bold">User</th>
                  <th className="p-4 text-left font-bold">Email</th>
                  <th className="p-4 text-left font-bold">Role</th>
                  <th className="p-4 text-left font-bold">Level</th>
                  <th className="p-4 text-left rounded-tr-xl font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr
                    key={u.id}
                    className={`border-b-2 border-[#0D0D0D]/20 ${
                      i % 2 === 0 ? "bg-white/50" : "bg-transparent"
                    }`}
                  >
                    <td className="p-4 font-bold flex items-center gap-2">
                      {u.role === "ADMIN" ? (
                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                      ) : (
                        <User className="w-5 h-5 text-gray-500" />
                      )}
                      {u.fullName}
                    </td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4 font-bold">
                      <span
                        className={`px-3 py-1 rounded-full text-xs uppercase ${
                          u.role === "ADMIN"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : "bg-gray-200 text-gray-800 border border-gray-400"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 font-bold">
                      {u.admin_level ? (
                        <span className="text-[#F2A516] bg-black px-2 py-1 rounded-md text-xs">
                          {u.admin_level}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-4 flex gap-2">
                      {/* Don't allow modifying oneself */}
                      {u.id !== session.id && u.role !== "ADMIN" && (
                        <>
                          <button
                            onClick={() => updateRole(u.id, "ADMIN", "LEAD")}
                            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1.5 rounded-lg font-bold border border-blue-300"
                          >
                            Make LEAD
                          </button>
                          <button
                            onClick={() => updateRole(u.id, "ADMIN", "HEAD")}
                            className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-1.5 rounded-lg font-bold border border-purple-300"
                          >
                            Make HEAD
                          </button>
                        </>
                      )}
                      {u.id !== session.id && u.role === "ADMIN" && (
                        <button
                          onClick={() => updateRole(u.id, "APPLICANT", undefined)}
                          className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 rounded-lg font-bold border border-red-300"
                        >
                          Remove Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
