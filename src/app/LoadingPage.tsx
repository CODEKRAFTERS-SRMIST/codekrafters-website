"use client";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0D0D0D]">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.7; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .anim-fade-up {
          animation: fadeUp 0.8s ease-out forwards;
        }
        .anim-fade-in {
          opacity: 0;
          animation: fadeIn 0.6s ease-out 0.6s forwards;
        }
        .shimmer-bar {
          animation: shimmer 1.2s ease-in-out infinite;
        }
      `}</style>

      <div className="flex flex-col items-center gap-6">
        <h1 className="anim-fade-up text-[#F9B000] text-3xl md:text-5xl font-extrabold tracking-widest">
          CODEKRAFTERS
        </h1>

        <p className="anim-fade-in text-[#FFEFB4] text-sm tracking-wide">
          IT'S MORE THAN A CLUB
        </p>

        <div className="w-40 h-[2px] bg-[#2a2a2a] overflow-hidden rounded">
          <div className="shimmer-bar h-full w-1/2 bg-[#F2B200]" />
        </div>
      </div>
    </div>
  );
}