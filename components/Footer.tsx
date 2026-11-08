import Link from "next/link";
import Logo from "./Logo";
import { LEGAL_NAME, NAV_LINKS } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-[#0a0e17] border-t border-white/[0.07] py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Logo className="w-5 h-5" />
          <span className="text-white/35 text-sm">
            &copy; {new Date().getFullYear()} {LEGAL_NAME}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/35 hover:text-white/70 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://www.linkedin.com/company/summit-initiative-solutions/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/35 hover:text-white/70 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
