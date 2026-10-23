import React from "react";
import Link from "next/link";
import { Shield, BookOpen, ExternalLink, Binary, KeyRound, FlaskConical, Scale, Info, BarChart3 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#0d0f18] text-xs text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Project Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#7164E8]/10 border border-[#7164E8]/30 flex items-center justify-center text-[#7164E8]">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-white">QuantumShield Lab</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              An interactive course project demonstrating how discrete mathematics (modular congruences, prime fields, matrix algebra, and lattices) forms the foundation of modern post-quantum cryptography.
            </p>
            <div className="text-[11px] text-slate-500 pt-1">
              <span>Course: </span>
              <span className="text-[#DCD9FA] font-medium">Discrete Mathematics &amp; Cryptography</span>
            </div>
          </div>

          {/* Col 2: Four Core Sections */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-200">
              Navigation &amp; Labs
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/" className="hover:text-[#DCD9FA] transition-colors inline-flex items-center gap-1.5">
                  <span>Home Overview</span>
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-[#DCD9FA] transition-colors inline-flex items-center gap-1.5">
                  <span>Learn &amp; Viva Voce Guide</span>
                </Link>
              </li>
              <li>
                <Link href="/math-lab" className="hover:text-[#DCD9FA] transition-colors inline-flex items-center gap-1.5">
                  <span>Mathematics Lab</span>
                </Link>
              </li>
              <li>
                <Link href="/crypto-lab" className="hover:text-[#DCD9FA] transition-colors inline-flex items-center gap-1.5">
                  <span>Cryptography Lab</span>
                </Link>
              </li>
              <li>
                <Link href="/experiments" className="hover:text-[#DCD9FA] transition-colors inline-flex items-center gap-1.5">
                  <span>Benchmark Studio</span>
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-[#DCD9FA] transition-colors inline-flex items-center gap-1.5">
                  <span>Results &amp; History</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#DCD9FA] transition-colors inline-flex items-center gap-1.5">
                  <span>About &amp; Methodology</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Mathematical Foundations */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-200">
              Discrete Mathematics Topics
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>• Division Algorithm &amp; Congruences (a ≡ b mod m)</li>
              <li>• Extended Euclidean Algorithm &amp; Bézout's Identity</li>
              <li>• Euler's Totient φ(n) &amp; Trapdoor One-Way Functions</li>
              <li>• Matrices over ℤ_q &amp; Module Lattices</li>
              <li>• Learning With Errors (b = As + e mod q)</li>
              <li>• Strict Avalanche Criterion (SAC) in SHA-256</li>
            </ul>
          </div>

          {/* Col 4: Official Standards & Authors */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-200">
              NIST Standards &amp; Team
            </h4>
            <ul className="space-y-1 text-[11px]">
              <li>
                <a
                  href="https://csrc.nist.gov/pubs/fips/203/final"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#DCD9FA] inline-flex items-center gap-1 font-mono"
                >
                  <span>FIPS 203: ML-KEM</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://csrc.nist.gov/pubs/fips/204/final"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#DCD9FA] inline-flex items-center gap-1 font-mono"
                >
                  <span>FIPS 204: ML-DSA</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://csrc.nist.gov/pubs/fips/205/final"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#DCD9FA] inline-flex items-center gap-1 font-mono"
                >
                  <span>FIPS 205: SLH-DSA</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
            </ul>
            <div className="pt-2 border-t border-white/10 text-[11px]">
              <div className="text-slate-500">Student Contributors:</div>
              <div className="text-[#DCD9FA] font-medium mt-0.5">
                Shaurya · Shaunak · Soham · Shantnu
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            Educational Demonstration Testbed · Academic Coursework
          </div>
          <div className="flex items-center gap-4">
            <span>FastAPI Backend (Port 8000)</span>
            <span>Next.js Frontend (Port 3000)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
