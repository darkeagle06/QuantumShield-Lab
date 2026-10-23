"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Binary,
  KeyRound,
  FlaskConical,
  Home,
  Terminal,
  Menu,
  X,
  BookOpen,
  BarChart3,
  Info,
} from "lucide-react";
import StatusIndicator from "./StatusIndicator";

const NAV_ITEMS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Learn", href: "/learn", icon: BookOpen },
  { name: "Mathematics Lab", href: "/math-lab", icon: Binary },
  { name: "Cryptography Lab", href: "/crypto-lab", icon: KeyRound },
  { name: "Experiments", href: "/experiments", icon: FlaskConical },
  { name: "Results", href: "/results", icon: BarChart3 },
  { name: "About", href: "/about", icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCurrent = (href: string) => {
    if (href === "/") return pathname === "/";
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`) ||
      (href === "/crypto-lab" && pathname.startsWith("/crypto-workbench")) ||
      (href === "/learn" && pathname.startsWith("/learn-docs")) ||
      (href === "/experiments" &&
        (pathname.startsWith("/benchmark-studio") ||
          pathname.startsWith("/algorithm-comparison"))) ||
      (href === "/results" && pathname.startsWith("/experiment-history"))
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(255,255,255,0.08)] bg-[#0d0f18]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#7164E8]/10 border border-[#7164E8]/30 flex items-center justify-center text-[#7164E8] group-hover:border-[#7164E8]/60 group-hover:bg-[#7164E8]/20 transition-all shadow-[0_0_15px_rgba(113,100,232,0.15)]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-tight text-[#F7F7F5] group-hover:text-white transition-colors">
                QuantumShield Lab
              </span>
              <span className="text-[10px] font-mono uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-[#7164E8]/15 text-[#DCD9FA] border border-[#7164E8]/30">
                PQC &amp; DM
              </span>
            </div>
            <p className="text-[10px] text-[#737373] tracking-tight hidden sm:block">
              Discrete Mathematics &amp; Post-Quantum Cryptography
            </p>
          </div>
        </Link>

        {/* Desktop Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = isCurrent(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? "bg-[#7164E8]/15 text-[#DCD9FA] border border-[#7164E8]/40 shadow-[0_0_12px_rgba(113,100,232,0.15)] font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    active ? "text-[#7164E8]" : "text-slate-400"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Medium Screen Compact Navigation */}
        <nav className="hidden md:flex lg:hidden items-center gap-1">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const active = isCurrent(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? "bg-[#7164E8]/15 text-[#DCD9FA] border border-[#7164E8]/40"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    active ? "text-[#7164E8]" : "text-slate-400"
                  }`}
                />
                <span>{item.name.replace(" Lab", "")}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Tools: Status & API Docs */}
        <div className="hidden sm:flex items-center gap-3">
          <StatusIndicator />

          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
            title="FastAPI Swagger Interactive Documentation"
          >
            <Terminal className="w-3.5 h-3.5 text-[#7164E8]" />
            <span>API Docs</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-2">
          <StatusIndicator />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#121522] px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isCurrent(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? "bg-[#7164E8]/20 text-[#DCD9FA] font-semibold border-l-2 border-[#7164E8]"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${active ? "text-[#7164E8]" : "text-slate-400"}`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-white/10">
            <a
              href="http://127.0.0.1:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-white"
            >
              <Terminal className="w-4 h-4 text-[#7164E8]" />
              <span>Swagger API Docs (Port 8000)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
