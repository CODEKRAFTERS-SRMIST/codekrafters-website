import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#0D0D0D] text-[#FFEFB4] pt-10 pb-10 px-6 md:px-12">
      {/* Top Divider */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F2A516] to-transparent" />

      <div
        className="
          max-w-7xl mx-auto
          grid grid-cols-2 lg:grid-cols-12
          gap-x-12 gap-y-10
          text-center lg:text-left
        "
      >
        {/* Brand (more space after this) */}
        <div className="col-span-2 lg:col-span-3 flex justify-center lg:justify-start">
          <div className="flex flex-col items-center lg:items-start">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <Image
                src="https://ik.imagekit.io/ysfz8n1no/public/logo.png"
                alt="CodeKrafters Logo"
                width={36}
                height={36}
                className="object-contain"
              />
              <h2 className="text-2xl font-normal">
                <span className="text-white">Code</span>
                <span className="text-[#F2A516]">Krafters</span>
              </h2>
            </div>

            <p className="mt-3 text-sm text-[#FFEFB4]/70 text-center lg:text-left leading-relaxed">
              <span>A student-driven tech community</span>
              <span className="text-[#FFEFB4]/80 mt-1">
                {" "}at SRM Ramapuram
              </span>
            </p>
            <address className="mt-2 not-italic text-xs text-[#FFEFB4]/60 text-center lg:text-left leading-relaxed">
              SRM Institute of Science & Technology<br />
              Bharathi Salai, Ramapuram, Chennai 600089
            </address>

            {/* Help & Queries Contact */}
            <div className="mt-4 flex items-center gap-2 text-xs text-[#FFEFB4]/80 bg-[#1A1A1A] px-3 py-1.5 rounded-lg border border-[#FFEFB4]/20">
              <Mail className="w-3.5 h-3.5 text-[#F2A516] shrink-0" />
              <span>Queries:</span>
              <a
                href="mailto:support@codekraftersrmp.in"
                className="text-[#F2A516] hover:underline font-medium"
              >
                support@codekraftersrmp.in
              </a>
            </div>
          </div>
        </div>

        {/* Explore */}
        <div className="lg:col-span-2 flex flex-col items-center lg:items-start">
          <h3 className="text-[#F2A516] text-sm mb-4 font-normal">
            Explore
          </h3>
          <ul className="space-y-2 text-sm text-white">
            <li><Link href="/events" className="hover:text-[#F2A516]">Events</Link></li>
            <li><Link href="/projects" className="hover:text-[#F2A516]">Projects</Link></li>
            <li><Link href="/team" className="hover:text-[#F2A516]">Team</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div className="lg:col-span-2 flex flex-col items-center lg:items-start">
          <h3 className="text-[#F2A516] text-sm mb-4 font-normal">
            Social
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="https://www.instagram.com/codekrafterssrm/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-[#F2A516]"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/codekrafters-srm/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-[#F2A516]"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://github.com/CODEKRAFTERS-SRMIST"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-[#F2A516]"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </li>
          </ul>
        </div>

        {/* Resources & Support */}
        <div className="lg:col-span-2 flex flex-col items-center lg:items-start">
          <h3 className="text-[#F2A516] text-sm mb-4 font-normal">
            Resources & Help
          </h3>
          <ul className="space-y-2 text-sm text-white">
            <li><a href="https://ck-blog-platform.vercel.app/" className="hover:text-[#F2A516]">Blog</a></li>
            <li><Link href="/krafterslink" className="hover:text-[#F2A516]">KraftersLink</Link></li>
            <li><Link href="/faq" className="hover:text-[#F2A516]">FAQ</Link></li>
            <li>
              <a
                href="mailto:support@codekraftersrmp.in"
                className="text-[#F2A516] hover:underline flex items-center gap-1 mt-1 text-xs font-semibold"
              >
                <Mail className="w-3 h-3" /> Get Support
              </a>
            </li>
          </ul>
        </div>

        {/* Join */}
        <div className="lg:col-span-3 flex flex-col items-center lg:items-start">
          <h3 className="text-[#F2A516] text-sm mb-4 font-normal">
            Be a part of
          </h3>
          <Link
            href="/join"
            className="
              inline-block mt-2 px-6 py-3 rounded-xl
              bg-[#F2A516] text-[#0D0D0D] font-normal text-sm
              shadow-[3px_3px_0_#000]
              hover:shadow-[5px_5px_0_#000]
              transition-all
            "
          >
            Join Our Club
          </Link>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-5 pt-6 border-t border-[#FFEFB4]/20 text-center text-xs text-[#FFEFB4]/60 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <div>
          © {new Date().getFullYear()}{" "}
          <span className="text-white">Code</span>
          <span className="text-[#F2A516]">Krafters</span>. All rights reserved.
        </div>
        <div>
          Support & Inquiries:{" "}
          <a
            href="mailto:support@codekraftersrmp.in"
            className="text-[#F2A516] hover:underline"
          >
            support@codekraftersrmp.in
          </a>
        </div>
      </div>
    </footer>
  );
}
