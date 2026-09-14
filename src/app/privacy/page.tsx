import { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, Eye, Mail, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how CodeKrafters SRM collects, protects, and uses student application and member data.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-[#FFEFB4] pt-28 pb-20 px-6 md:px-16 max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[#F2A516] hover:text-[#FFEFB4] transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Home
      </Link>

      <div className="border border-[#F2A516]/20 bg-[#0D0D0D]/80 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-[#F2A516]/10 border border-[#F2A516]/30 text-[#F2A516]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
            <p className="text-xs text-[#FFEFB4]/60 mt-1">Last Updated: September 2026</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-[#FFEFB4]/80 mb-8">
          CodeKrafters (&quot;we&quot;, &quot;our&quot;, or &quot;the club&quot;) is a student-driven tech community operating at SRM Institute of Science and Technology, Ramapuram. We are committed to protecting the privacy of student applicants, community members, and website visitors. This Privacy Policy details the types of information we collect, how it is secured, and your rights.
        </p>

        <div className="space-y-8 text-sm text-[#FFEFB4]/80">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#F2A516]" /> 1. Information We Collect
            </h2>
            <p className="leading-relaxed">
              When you interact with our website or submit recruitment applications, we may collect:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#FFEFB4]/70">
              <li><strong className="text-white">Applicant Information:</strong> Full name, university email, phone number, department, year of study, technical domains of interest, resume URL, GitHub profile, LinkedIn profile, and portfolio links.</li>
              <li><strong className="text-white">Account & Authentication Data:</strong> Encrypted password hashes, session tokens, and IP addresses used for login rate-limiting and account protection.</li>
              <li><strong className="text-white">Event & Activity Data:</strong> Registrations for hackathons, workshops, and domain task submissions.</li>
              <li><strong className="text-white">Technical Usage Data:</strong> Anonymous telemetry, device browser info, and essential session cookies required for core site functionality.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#F2A516]" /> 2. How We Use & Protect Your Data
            </h2>
            <p className="leading-relaxed">
              We use collected information solely for internal club recruitment evaluations, organizing events, notifying applicants about status updates, and securing our web services.
            </p>
            <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
              <p className="text-xs text-[#FFEFB4]/90"><strong className="text-[#F2A516]">Strict Confidentiality:</strong> We do NOT sell, rent, or commercialize your personal information to third parties or advertisers.</p>
              <p className="text-xs text-[#FFEFB4]/90"><strong className="text-[#F2A516]">Database Security:</strong> Data is protected behind strict PostgreSQL Row-Level Security (RLS), encrypted tokens, and cryptographic password hashing.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Cookies & Local Storage</h2>
            <p className="leading-relaxed">
              We use essential HTTP-only cookies to maintain secure sessions and <code className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-[#F2A516]">localStorage</code> to save your user preferences (such as cookie consent). You can clear your browser storage or cookies at any time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Data Retention & Applicant Rights</h2>
            <p className="leading-relaxed">
              Recruitment application records are archived at the conclusion of the academic recruitment cycle. You have the right to request access to your submitted data, request correction of inaccurate records, or request complete deletion of your applicant account.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-white/10">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#F2A516]" /> 5. Contact & Privacy Inquiries
            </h2>
            <p className="leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact our team:
            </p>
            <div className="text-xs bg-[#1A1A1A] p-4 rounded-xl border border-[#F2A516]/20">
              <p><strong className="text-white">CodeKrafters SRM Tech Community</strong></p>
              <p className="text-[#FFEFB4]/70">SRM Institute of Science and Technology, Ramapuram, Chennai - 600089</p>
              <p className="mt-1">Email: <a href="mailto:support@codekraftersrmp.in" className="text-[#F2A516] underline">support@codekraftersrmp.in</a></p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
