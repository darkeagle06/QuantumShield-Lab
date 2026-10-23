"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Binary,
  KeyRound,
  FlaskConical,
  Shield,
  ArrowRight,
  Layers,
  Cpu,
  Lock,
  Hash,
  Scale,
  CheckCircle2,
  Sparkles,
  BarChart3,
  BookOpen,
} from "lucide-react";
import ShaderBackground from "@/components/ShaderBackground";
import { storage } from "@/lib/storage";
import { api } from "@/lib/api";

export default function HomePage() {
  const [dbSummary, setDbSummary] = useState<{
    totalExperiments: number;
    totalMeasurements: number;
  }>({
    totalExperiments: 0,
    totalMeasurements: 0,
  });

  useEffect(() => {
    api
      .getDatabaseStatsSummary()
      .then((data) => {
        if (data) {
          setDbSummary({
            totalExperiments: data.total_experiments,
            totalMeasurements: data.total_measurements,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Master Hero Section (Section 3.2) */}
      <section className="relative -mt-4 py-16 px-6 sm:px-10 rounded-3xl overflow-hidden glass-panel-violet border border-[rgba(113,100,232,0.35)] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {/* Dynamic Shader-Inspired Animated Background */}
        <ShaderBackground className="opacity-95" interactive={true} />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6 text-center sm:text-left">
          {/* Subtle Technical Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7164E8]/20 border border-[#7164E8]/40 text-[#DCD9FA] text-xs font-mono font-medium badge-shimmer">
            <Shield className="w-3.5 h-3.5 text-[#7164E8]" />
            <span>NIST STANDARDS · FIPS 203 · FIPS 204 · FIPS 205</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F7F7F5] leading-[1.1]">
            The mathematics of a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DCD9FA] via-[#7164E8] to-[#38bdf8]">
              quantum-resilient
            </span>{" "}
            future.
          </h1>

          {/* Supporting Copy */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Explore post-quantum cryptography through interactive mathematics,
            established cryptographic implementations, and measurable experiments.
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-center sm:justify-start">
            <Link
              href="/crypto-lab"
              className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm shadow-[0_4px_25px_rgba(113,100,232,0.4)]"
            >
              <span>Enter Cryptography Lab</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/math-lab"
              className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm"
            >
              <Binary className="w-4 h-4 text-[#7164E8]" />
              <span>Explore the Mathematics</span>
            </Link>
          </div>

          {/* Academic Meta Badge */}
          <div className="pt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Course Project · Discrete Mathematics
            </span>
            <span>•</span>
            <span>Contributors: Shaurya · Shaunak · Soham · Shantnu</span>
            {dbSummary.totalMeasurements > 0 && (
              <>
                <span>•</span>
                <span className="text-[#DCD9FA]">
                  {dbSummary.totalMeasurements} Benchmarks Logged in SQLite
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. Four Primary Course Laboratories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F7F7F5]">
              Core Educational Laboratories
            </h2>
            <p className="text-xs text-slate-400">
              Interactive platforms bridging mathematical theory, cryptographic standards, and empirical experiments.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Lab 1: Mathematics Lab */}
          <Link
            href="/math-lab"
            className="group rounded-2xl card-elevated p-6 flex flex-col justify-between hover:border-[#7164E8]/60 transition-all shadow-md"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#7164E8]/10 border border-[#7164E8]/30 flex items-center justify-center text-[#7164E8] group-hover:scale-105 transition-transform">
                <Binary className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#DCD9FA] transition-colors">
                Mathematics Lab
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Step-by-step modular congruences, Extended Euclidean inverses, matrix operations over ℤ_q, 2D lattice geometry with LWE noise, and SHA-256 bit avalanche.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-[#7164E8] group-hover:translate-x-1 transition-transform">
              <span>Open Math Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Lab 2: Cryptography Lab */}
          <Link
            href="/crypto-lab"
            className="group rounded-2xl card-elevated p-6 flex flex-col justify-between hover:border-[#7164E8]/60 transition-all shadow-md"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#7164E8]/10 border border-[#7164E8]/30 flex items-center justify-center text-[#7164E8] group-hover:scale-105 transition-transform">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#DCD9FA] transition-colors">
                Cryptography Lab
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Execute genuine post-quantum algorithms: FIPS 203 ML-KEM key exchange, FIPS 204 ML-DSA lattice signatures with tamper testing, and FIPS 205 SLH-DSA hash signatures.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-[#7164E8] group-hover:translate-x-1 transition-transform">
              <span>Open Crypto Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Lab 3: Benchmark Studio */}
          <Link
            href="/experiments"
            className="group rounded-2xl card-elevated p-6 flex flex-col justify-between hover:border-[#7164E8]/60 transition-all shadow-md"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] group-hover:scale-105 transition-transform">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                Benchmark Studio
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Run repeated, monotonic micro-benchmarks on your local CPU. Warmups excluded; compute median latency and compare key and artifact sizes against classical baselines.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-[#38bdf8] group-hover:translate-x-1 transition-transform">
              <span>Run Benchmarks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Lab 4: Results & History */}
          <Link
            href="/results"
            className="group rounded-2xl card-elevated p-6 flex flex-col justify-between hover:border-[#7164E8]/60 transition-all shadow-md"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#DCD9FA]/10 border border-[#DCD9FA]/30 flex items-center justify-center text-[#DCD9FA] group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#DCD9FA] transition-colors">
                Results &amp; History
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Query persistent SQLite experiment runs, filter by algorithm and operation, inspect hardware metadata, and export full measurement datasets to CSV and JSON.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-[#DCD9FA] group-hover:translate-x-1 transition-transform">
              <span>View Results</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. The Quantum Threat Context */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#7164E8]" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#F7F7F5]">
            The Quantum Threat to Public-Key Cryptography
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl card-elevated space-y-3">
            <span className="text-[11px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40 font-semibold">
              Shor's Algorithm (1994)
            </span>
            <h3 className="text-sm font-bold text-white">Breaks Factoring &amp; DLog</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides an exponential speedup in $O((\log n)^3)$ quantum gate steps. Factoring integers ($n = p \cdot q$) and finding discrete logarithms ($g^x \equiv y$) become trivial, breaking RSA, DSA, Diffie-Hellman, and ECDSA.
            </p>
          </div>

          <div className="p-6 rounded-2xl card-elevated space-y-3">
            <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40 font-semibold">
              Harvest Now, Decrypt Later
            </span>
            <h3 className="text-sm font-bold text-white">Present-Day Interception</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adversaries can record confidential network traffic today. Once a Cryptanalytically Relevant Quantum Computer (CRQC) is realized in the future, archived sessions can be retroactively decrypted unless migrated to PQC.
            </p>
          </div>

          <div className="p-6 rounded-2xl card-elevated space-y-3">
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 font-semibold">
              Grover's Algorithm (1996)
            </span>
            <h3 className="text-sm font-bold text-white">Quadratic Search Speedup</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Searches an unstructured database of size N in O(√N) time. For symmetric ciphers (AES) and hashes (SHA-256), doubling the key size to 256 bits retains full 128-bit quantum security without algorithm replacement.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Mathematics-to-Cryptography Mapping (Section 2.2.E) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#7164E8]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#F7F7F5]">
              Discrete Mathematics: The Engine of Post-Quantum Defense
            </h2>
          </div>
          <Link
            href="/learn"
            className="text-xs font-semibold text-[#7164E8] hover:text-[#DCD9FA] inline-flex items-center gap-1"
          >
            <span>Read Curriculum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl card-elevated space-y-2">
            <div className="text-xs font-mono font-bold text-[#7164E8]">
              1. Modular Arithmetic
            </div>
            <p className="text-xs text-slate-200 font-semibold">Congruences &amp; Inverses</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Arithmetic over ℤ_q. Bézout's identity via the Extended Euclidean Algorithm derives multiplicative inverses (a · x ≡ 1 mod q) when gcd(a, q) = 1.
            </p>
            <Link href="/math-lab" className="text-[11px] text-[#7164E8] font-medium hover:underline inline-block pt-1">
              Test in Math Lab →
            </Link>
          </div>

          <div className="p-5 rounded-2xl card-elevated space-y-2">
            <div className="text-xs font-mono font-bold text-[#7164E8]">
              2. Polynomial Rings
            </div>
            <p className="text-xs text-slate-200 font-semibold">Quotient Ring $R_q$</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              ML-KEM and ML-DSA compute within R_q = ℤ_q[X]/(X²⁵⁶ + 1) with prime q = 3329, where cyclic convolution enables compact key representation and high efficiency.
            </p>
            <Link href="/learn" className="text-[11px] text-[#7164E8] font-medium hover:underline inline-block pt-1">
              Read Ring Theory →
            </Link>
          </div>

          <div className="p-5 rounded-2xl card-elevated space-y-2">
            <div className="text-xs font-mono font-bold text-[#7164E8]">
              3. Lattice Hardness (LWE)
            </div>
            <p className="text-xs text-slate-200 font-semibold">Noisy Linear Systems</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              $b = As + e \pmod q$. Without noise $e$, Gaussian elimination solves $s$ instantly. With noise, recovering $s$ reduces to the NP-hard Closest Vector Problem (CVP) on geometric lattices.
            </p>
            <Link href="/math-lab" className="text-[11px] text-[#7164E8] font-medium hover:underline inline-block pt-1">
              Launch Lattice Demo →
            </Link>
          </div>

          <div className="p-5 rounded-2xl card-elevated space-y-2">
            <div className="text-xs font-mono font-bold text-[#7164E8]">
              4. Hash Preimages
            </div>
            <p className="text-xs text-slate-200 font-semibold">Stateless Merkle Trees</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              SLH-DSA relies solely on one-way hash resistance (SHA-256 / SHAKE). Even if quantum algorithms undermine lattice assumptions, hash-based trees offer a conservative mathematical fallback.
            </p>
            <Link href="/crypto-lab" className="text-[11px] text-[#7164E8] font-medium hover:underline inline-block pt-1">
              Run SLH Signatures →
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Course Guide Banner */}
      <section className="rounded-2xl glass-panel p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#7164E8]" />
            <h3 className="text-base font-bold text-white">
              Course Viva Voce Examination &amp; Curriculum Guide
            </h3>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Review comprehensive theoretical foundations, algorithm design trade-offs, and 8 curated answers for course defense examinations.
          </p>
        </div>

        <Link
          href="/learn"
          className="btn-primary shrink-0 text-xs inline-flex items-center gap-2"
        >
          <span>Open Viva Guide</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
