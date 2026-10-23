"use client";

import React from "react";
import { usePathname } from "next/navigation";
import StatusIndicator from "./StatusIndicator";
import { Terminal, BookOpen, Layers } from "lucide-react";
import Link from "next/link";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Laboratory Overview",
    subtitle: "Discrete Mathematics & Post-Quantum Cryptography Research Hub",
  },
  "/crypto-workbench": {
    title: "Cryptographic Workbench",
    subtitle: "Interactive KEM & Signature Workflows (FIPS 203, 204, 205)",
  },
  "/math-lab": {
    title: "Discrete Mathematics Lab",
    subtitle: "Modular Arithmetic, LWE Noisy Equations, and Hash Avalanche Properties",
  },
  "/benchmark-studio": {
    title: "Benchmark Studio",
    subtitle: "Controlled Micro-benchmarks, Operation Latencies & Output Sizes",
  },
  "/algorithm-comparison": {
    title: "Algorithm Comparison Matrix",
    subtitle: "Architectural & Mathematical Tradeoffs: NIST PQC vs. Classical RSA/ECC",
  },
  "/experiment-history": {
    title: "Experiment History & Audit Trail",
    subtitle: "Local Experiment Store, Reproducible Records & Metric Aggregation",
  },
  "/learn-docs": {
    title: "Documentation & Viva Preparation",
    subtitle: "Mathematical Explanations, Threat Models, and Defense Q&A",
  },
};

export default function Topbar() {
  const pathname = usePathname();
  const current = PAGE_TITLES[pathname] || {
    title: "QuantumShield Lab",
    subtitle: "Research testbed",
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#090e1a]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex flex-col">
        <h1 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <span>{current.title}</span>
        </h1>
        <p className="text-xs text-slate-400 hidden sm:block">
          {current.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <StatusIndicator />

        <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

        <a
          href="http://127.0.0.1:8000/docs"
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-cyan-300 hover:bg-slate-800/60 border border-slate-800 transition-colors"
          title="Open FastAPI Swagger Interactive API Documentation"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>API Docs</span>
        </a>

        <Link
          href="/learn-docs"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/60 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Viva Guide</span>
        </Link>
      </div>
    </header>
  );
}
