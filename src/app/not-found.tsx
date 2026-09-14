import Link from "next/link";
import { Compass, Home, Sparkles, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-[#FFEFB4] flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#F2A516]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#FFA500]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10 border border-[#F2A516]/20 bg-[#0D0D0D]/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(242,165,22,0.1)]">
        {/* Animated Icon Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F2A516]/20 to-transparent border border-[#F2A516]/40 text-[#F2A516] mb-6 shadow-[0_0_20px_rgba(242,165,22,0.2)]">
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: "12s" }} />
        </div>

        <div className="inline-block px-3 py-1 mb-4 rounded-full bg-[#F2A516]/10 border border-[#F2A516]/30 text-xs font-mono tracking-widest text-[#F2A516] uppercase">
          404: Coordinate Lost
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          Lost in <span className="text-[#F2A516]">Cyberspace</span>?
        </h1>

        <p className="text-sm md:text-base text-[#FFEFB4]/70 leading-relaxed mb-8">
          The page you are looking for has been refactored, moved to another realm, or never existed in this timeline.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#F2A516] text-[#0D0D0D] font-semibold text-sm shadow-[3px_3px_0_#000] hover:shadow-[5px_5px_0_#000] transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>

          <Link
            href="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white hover:border-[#F2A516]/50 hover:bg-[#F2A516]/10 font-medium text-sm transition-all group"
          >
            <Sparkles className="w-4 h-4 text-[#F2A516]" />
            Explore Events
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  );
}
