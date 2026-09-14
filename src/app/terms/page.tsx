import { Metadata } from "next";
import Link from "next/link";
import { FileText, CheckCircle2, AlertCircle, Scale, Mail, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for participating in the CodeKrafters SRM tech community and recruitment process.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsOfServicePage() {
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
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Terms of Service</h1>
            <p className="text-xs text-[#FFEFB4]/60 mt-1">Effective Date: September 2026</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-[#FFEFB4]/80 mb-8">
          Welcome to CodeKrafters SRM. By accessing our website, creating an account, or participating in recruitment and events, you agree to comply with and be bound by the following Terms of Service.
        </p>

        <div className="space-y-8 text-sm text-[#FFEFB4]/80">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#F2A516]" /> 1. Community Membership & Eligibility
            </h2>
            <p className="leading-relaxed">
              CodeKrafters is open to students of SRM Institute of Science and Technology. All recruitment submissions must represent authentic student credentials. Misrepresentation of academic standing, impersonation, or providing fraudulent project portfolios will result in immediate disqualification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#F2A516]" /> 2. Code of Conduct & Fair Play
            </h2>
            <p className="leading-relaxed">
              Our community thrives on collaboration, peer learning, and respectful discourse across all 7 domains. We maintain a zero-tolerance policy against harassment, discrimination, hate speech, plagiarism, or unauthorized exploitation of community infrastructure.
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#FFEFB4]/70">
              <li><strong className="text-white">Task Submissions:</strong> All code, design, or written submissions for recruitment tasks must be original or appropriately attributed.</li>
              <li><strong className="text-white">System Security:</strong> Any attempt to compromise server endpoints, probe private APIs, or tamper with application databases without authorization is strictly prohibited.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#F2A516]" /> 3. Intellectual Property
            </h2>
            <p className="leading-relaxed">
              Applicants retain full ownership of the intellectual property in their original project submissions and portfolios. CodeKrafters branding, domain assets, website source code, and logo marks remain the property of CodeKrafters SRM.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Account Responsibilities & Termination</h2>
            <p className="leading-relaxed">
              You are responsible for maintaining the confidentiality of your login credentials. We reserve the right to suspend or terminate accounts that violate community standards, engage in automated spamming, or breach these terms.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-white/10">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#F2A516]" /> 5. Questions & Feedback
            </h2>
            <p className="leading-relaxed">
              For inquiries regarding community policies or terms of service, reach out to our team at:
            </p>
            <div className="text-xs bg-[#1A1A1A] p-4 rounded-xl border border-[#F2A516]/20">
              <p><strong className="text-white">CodeKrafters SRM Tech Community</strong></p>
              <p className="text-[#FFEFB4]/70">SRM Institute of Science and Technology, Ramapuram, Chennai</p>
              <p className="mt-1">Email: <a href="mailto:support@codekraftersrmp.in" className="text-[#F2A516] underline">support@codekraftersrmp.in</a></p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
