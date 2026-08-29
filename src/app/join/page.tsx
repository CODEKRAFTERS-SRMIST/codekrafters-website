"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Footer";
import { LoginCard } from "@/components/join/LoginCard";
import { ApplicationForm } from "@/components/join/ApplicationForm";
import { ApplicationStatusCard } from "@/components/join/ApplicationStatusCard";
import { AdminDashboard } from "@/components/join/AdminDashboard";
import { Application, UserSession } from "@/types/join";
import { fetchApplications } from "@/lib/api";

export default function JoinPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [userApp, setUserApp] = useState<Application | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check saved session on mount
  useEffect(() => {
    try {
      const rawSession = localStorage.getItem("codekrafters_user_session");
      if (rawSession) {
        const parsed: UserSession = JSON.parse(rawSession);
        setSession(parsed);
        findUserApplication(parsed.id, parsed.email);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const findUserApplication = async (userId: string, email: string) => {
    setIsLoading(true);
    try {
      const apps = await fetchApplications(userId, email);
      const found = apps.find(
        (a) => a.userId === userId || a.email.toLowerCase() === email.toLowerCase()
      );
      setUserApp(found || null);
    } catch (e) {
      console.error("Failed to load application:", e);
    }
    setIsLoading(false);
  };

  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    try {
      localStorage.setItem("codekrafters_user_session", JSON.stringify(newSession));
    } catch (e) {}
    findUserApplication(newSession.id, newSession.email);
  };

  const handleLogout = () => {
    setSession(null);
    setUserApp(null);
    setIsEditing(false);
    try {
      localStorage.removeItem("codekrafters_user_session");
    } catch (e) {}
  };

  const handleApplicationSubmitted = (app: Application) => {
    setUserApp(app);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen relative bg-[#FFEFB4] overflow-x-hidden flex flex-col justify-between pt-24 font-sans">
      {/* Paper Fiber Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15 -z-10"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")`,
        }}
      />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(13, 13, 13, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(13, 13, 13, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />

      <Navbar />

      <main className="flex-1 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full my-6">
        {!session ? (
          /* State 1: Unauthenticated -> Login Card */
          <div className="py-6 sm:py-12">
            <LoginCard onLoginSuccess={handleLoginSuccess} />
          </div>
        ) : isLoading ? (
          /* State 2: Loading applicant data */
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D0D0D]"></div>
          </div>
        ) : session.role === "ADMIN" ? (
          /* State 3: Admin Session -> Admin Panel */
          <div className="py-4">
            <AdminDashboard session={session} onLogout={handleLogout} />
          </div>
        ) : userApp && !isEditing ? (
          /* State 4: Logged in Applicant with submitted application */
          <div className="py-6 sm:py-10">
            <ApplicationStatusCard
              application={userApp}
              session={session}
              onEditRequested={() => setIsEditing(true)}
              onLogout={handleLogout}
            />
          </div>
        ) : (
          /* State 5: Logged in Applicant submitting form */
          <div className="py-4 sm:py-8">
            <ApplicationForm
              session={session}
              existingApplication={userApp}
              onApplicationSubmitted={handleApplicationSubmitted}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
