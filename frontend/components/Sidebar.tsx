"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  Binary,
  Activity,
  Scale,
  History,
  BookOpen,
  Shield,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Crypto Workbench", href: "/crypto-workbench", icon: ShieldCheck },
  { name: "Mathematical Lab", href: "/math-lab", icon: Binary },
  { name: "Benchmark Studio", href: "/benchmark-studio", icon: Activity },
  { name: "Algorithm Comparison", href: "/algorithm-comparison", icon: Scale },
  { name: "Experiment History", href: "/experiment-history", icon: History },
  { name: "Learn & Documentation", href: "/learn-docs", icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#090e1a] border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400/60 transition-colors">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  QuantumShield
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Lab
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-tight">
                Discrete Math &amp; PQC
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4">
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Modules
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-300 font-semibold border-l-2 border-cyan-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? "text-cyan-400"
                          : "text-slate-500"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Course & Team Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-[#070b14]/50">
        <div className="rounded-lg bg-slate-900/40 border border-slate-800/80 p-3 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-slate-300">Course Project</span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
              Discrete Math
            </span>
          </div>
          <div className="pt-1.5 border-t border-slate-800/60 text-[10px] text-slate-400 flex justify-between">
            <span className="text-slate-500">Team:</span>
            <span className="text-slate-300 font-medium">Shaurya · Shaunak · Soham · Shantnu</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
