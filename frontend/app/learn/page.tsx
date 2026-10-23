"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Shield,
  Binary,
  Layers,
  Cpu,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Radio,
  FileCheck2,
  Atom,
} from "lucide-react";

const VIVA_QUESTIONS = [
  {
    q: "1. What is QuantumShield Lab?",
    a: "QuantumShield Lab is an educational and experimental testbed connecting discrete mathematics foundations (modular arithmetic, polynomial quotient rings, lattices, hash functions) to standardized post-quantum cryptography (NIST FIPS 203, 204, 205) and measuring reproducible performance metrics on local host hardware.",
  },
  {
    q: "2. Why is this fundamentally a Discrete Mathematics project?",
    a: "Every post-quantum cryptographic primitive relies directly on discrete mathematical structures: modular congruences over finite fields (Z_q), quotient polynomial rings R_q = Z_q[X]/(X^256 + 1), high-dimensional Euclidean lattice geometries (Module-LWE and Module-SIS), discrete error distributions, and computational complexity reductions (worst-case lattice problems).",
  },
  {
    q: "3. What does ML-KEM do, and what does it NOT do?",
    a: "ML-KEM (NIST FIPS 203) is a Key Encapsulation Mechanism. It securely establishes a shared 256-bit symmetric secret between two parties over an insecure channel. It DOES NOT encrypt arbitrary files or documents directly. The established shared key is subsequently used with high-speed symmetric ciphers like AES-256-GCM.",
  },
  {
    q: "4. What do ML-DSA and SLH-DSA do?",
    a: "ML-DSA (FIPS 204) and SLH-DSA (FIPS 205) are post-quantum digital signature algorithms. They ensure message integrity and sender authenticity. Signatures do not conceal or encrypt the plaintext; rather, they mathematically prove that the payload has not been modified in transit.",
  },
  {
    q: "5. Are quantum computers currently breaking RSA in production today?",
    a: "No. Current quantum devices are Noisy Intermediate-Scale Quantum (NISQ) processors with limited physical qubits and high noise rates. They cannot execute Shor's algorithm on production key lengths like RSA-2048 or ECC P-256. The urgent concern is 'Harvest Now, Decrypt Later', where adversaries intercept and store encrypted data today to decrypt once a fault-tolerant Cryptanalytically Relevant Quantum Computer (CRQC) is realized.",
  },
  {
    q: "6. Are you inventing a new cryptographic algorithm?",
    a: "No. Attempting to design new cryptographic primitives from scratch without decades of peer cryptanalysis is unsafe. QuantumShield Lab implements genuine, established algorithms directly according to official NIST FIPS standards, focusing on educational transparency, mathematical exploration, and repeatable empirical evaluation.",
  },
  {
    q: "7. How does the benchmark engine ensure fairness and accuracy?",
    a: "We do not fabricate performance figures. Timing is gathered with high-precision monotonic timers (time.perf_counter). To eliminate CPU cold-cache anomalies, initial warm-up iterations are strictly discarded from final metrics. Every sample is recorded, and we report median latency, min, max, and spread.",
  },
  {
    q: "8. What is the difference between Quantum Cryptography and Post-Quantum Cryptography?",
    a: "Quantum Cryptography (e.g., Quantum Key Distribution / QKD) relies on physical quantum phenomena (photon polarization, Heisenberg uncertainty) and requires specialized optical fiber hardware. Post-Quantum Cryptography (PQC) consists of mathematical algorithms executed entirely on standard classical computers, but designed with mathematical hardness assumptions that quantum algorithms cannot easily solve.",
  },
];

export default function LearnPage() {
  const [openViva, setOpenViva] = useState<number | null>(0);

  const toggleViva = (idx: number) => {
    setOpenViva(openViva === idx ? null : idx);
  };

  return (
    <div className="space-y-12 pb-16 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl glass-panel-violet space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7164E8]/20 border border-[#7164E8]/40 text-[#DCD9FA] text-xs font-mono font-medium">
          <BookOpen className="w-3.5 h-3.5 text-[#7164E8]" />
          <span>COURSE CURRICULUM &amp; KNOWLEDGE BASE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F7F7F5] tracking-tight">
          Theoretical Foundations of Post-Quantum Cryptography
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Explore why quantum computing fundamentally disrupts legacy public-key
          cryptosystems (RSA &amp; ECC), how discrete mathematics provides the
          hardness foundations for post-quantum defense, and how standardized algorithms operate.
        </p>
      </div>

      {/* Section 1: The Three Cryptographic Paradigms */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Atom className="w-5 h-5 text-[#7164E8]" />
          <h2 className="text-xl font-bold text-[#F7F7F5]">
            The Three Cryptographic Paradigms
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Understanding the vital distinction between classical, physical quantum, and post-quantum mathematical systems.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl card-elevated space-y-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-mono text-sm font-bold">
              01
            </div>
            <h3 className="text-sm font-bold text-white">Classical Cryptography</h3>
            <div className="text-[11px] font-mono text-slate-400">
              Schemes: RSA, Diffie-Hellman, ECDSA
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Runs on conventional computers. Relies on integer factorization and discrete logarithms. Both problems are solvable in polynomial time $O((\log n)^3)$ using Shor's algorithm on a quantum computer.
            </p>
            <div className="text-[11px] text-rose-400 font-medium">
              Status: Vulnerable to CRQC
            </div>
          </div>

          <div className="p-5 rounded-xl card-elevated space-y-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono text-sm font-bold">
              02
            </div>
            <h3 className="text-sm font-bold text-white">Quantum Cryptography (QKD)</h3>
            <div className="text-[11px] font-mono text-slate-400">
              Schemes: BB84, E91, Optical QKD
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Uses physical quantum mechanics (photon polarization, no-cloning theorem). Requires dedicated dark fiber or satellite laser channels. Does not replace digital signatures or public internet software infrastructure.
            </p>
            <div className="text-[11px] text-amber-400 font-medium">
              Status: Hardware-bound, niche utility
            </div>
          </div>

          <div className="p-5 rounded-xl card-elevated border-[#7164E8]/40 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#7164E8]/20 border border-[#7164E8]/50 flex items-center justify-center text-[#7164E8] font-mono text-sm font-bold">
              03
            </div>
            <h3 className="text-sm font-bold text-white">Post-Quantum Cryptography</h3>
            <div className="text-[11px] font-mono text-[#DCD9FA]">
              Schemes: ML-KEM, ML-DSA, SLH-DSA
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Runs directly on ordinary classical CPUs and existing networks. Built on mathematical problems (lattices, polynomial rings, hash preimages) for which no efficient classical OR quantum algorithm is known.
            </p>
            <div className="text-[11px] text-[#7164E8] font-semibold">
              Status: Standardized global solution (NIST FIPS)
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Quantum Algorithms Impact Analysis */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#7164E8]" />
          <h2 className="text-xl font-bold text-[#F7F7F5]">
            Quantum Algorithms: Shor vs. Grover
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-xl card-elevated space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 px-2 py-1 rounded border border-rose-800/40">
                Shor's Algorithm (1994)
              </span>
              <span className="text-xs text-slate-400 font-mono">Exponential Impact</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Complete Collapse of Number-Theoretic Public-Key Cryptography
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Peter Shor discovered that quantum Fourier transforms can determine the period of modular exponentiation functions in polynomial time:
            </p>
            <div className="p-3 rounded-lg bg-black/40 font-mono text-xs text-rose-300 border border-rose-900/40">
              Classical Best: O(exp(c · (log n)⅓ · (log log n)⅔)) (GNFS)<br />
              Shor's Quantum: O((log n)³) — Polynomial Time
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Because RSA relies on integer factorization and ECC relies on discrete logarithms, both break entirely once sufficiently large fault-tolerant quantum computers exist.
            </p>
          </div>

          <div className="p-6 rounded-xl card-elevated space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/40">
                Grover's Algorithm (1996)
              </span>
              <span className="text-xs text-slate-400 font-mono">Quadratic Speedup</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Key Halving for Symmetric Ciphers &amp; Hashes
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Lov Grover developed a quantum search algorithm that searches an unsorted database of N items in O(√N) iterations instead of classical O(N):
            </p>
            <div className="p-3 rounded-lg bg-black/40 font-mono text-xs text-emerald-300 border border-emerald-900/40">
              AES-128: 2¹²⁸ classical operations → 2⁶⁴ quantum operations (Vulnerable)<br />
              AES-256: 2²⁵⁶ classical operations → 2¹²⁸ quantum operations (Safe)
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Symmetric cryptography does NOT require mathematical restructuring. Increasing key lengths (AES-256) and hash outputs (SHA-384 / SHA-512) retains full post-quantum security.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: The Threat Model: Harvest Now, Decrypt Later */}
      <section className="p-6 rounded-2xl glass-panel border-amber-500/30 space-y-3">
        <div className="flex items-center gap-2 text-amber-400">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-base font-bold text-white">
            The Urgency: "Harvest Now, Decrypt Later" (HNDL)
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Many organizations assume quantum threats are decades away and therefore require no action today. This overlooks the HNDL threat model:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
            <div className="text-xs font-bold text-[#F7F7F5]">1. Harvest (Present)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              State-level adversaries record TLS handshakes, diplomatic traffic, and intellectual property today.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
            <div className="text-xs font-bold text-[#F7F7F5]">2. Store (Future)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Encrypted blobs are archived until Cryptanalytically Relevant Quantum Computers (CRQC) exist.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
            <div className="text-xs font-bold text-[#F7F7F5]">3. Decrypt (Retroactive)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Historical master secrets are solved via Shor's algorithm, exposing decades of confidential communications.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Interactive Discrete Math to PQC Map */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Binary className="w-5 h-5 text-[#7164E8]" />
            <h2 className="text-xl font-bold text-[#F7F7F5]">
              Discrete Mathematics Mapping Matrix
            </h2>
          </div>
          <Link
            href="/math-lab"
            className="text-xs font-semibold text-[#7164E8] hover:text-[#DCD9FA] inline-flex items-center gap-1"
          >
            <span>Open Math Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl card-elevated space-y-2">
            <div className="text-xs font-mono font-bold text-[#7164E8]">
              Modular Arithmetic
            </div>
            <h4 className="text-xs font-bold text-white">Congruence in Z_q</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Underpins all ring computations. The prime modulus $q = 3329$ used in ML-KEM ensures clean modular reductions and inverse coefficients.
            </p>
            <Link
              href="/math-lab"
              className="text-[11px] text-[#7164E8] font-medium inline-flex items-center gap-1 hover:underline pt-1"
            >
              Test in Math Lab →
            </Link>
          </div>

          <div className="p-4 rounded-xl card-elevated space-y-2">
            <div className="text-xs font-mono font-bold text-[#7164E8]">
              Lattice Geometry
            </div>
            <h4 className="text-xs font-bold text-white">Learning With Errors (LWE)</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              $b = As + e \pmod q$. With noise vector $e$, solving for secret $s$ reduces directly to the Closest Vector Problem (CVP) on discrete lattices.
            </p>
            <Link
              href="/math-lab"
              className="text-[11px] text-[#7164E8] font-medium inline-flex items-center gap-1 hover:underline pt-1"
            >
              Explore 2D Lattice Demo →
            </Link>
          </div>

          <div className="p-4 rounded-xl card-elevated space-y-2">
            <div className="text-xs font-mono font-bold text-[#7164E8]">
              Hash Functions
            </div>
            <h4 className="text-xs font-bold text-white">Merkle Tree Signatures</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              SLH-DSA relies on preimage resistance of SHA-256 and SHAKE. Even if lattice assumptions are weakened, hash-based signatures remain secure.
            </p>
            <Link
              href="/math-lab"
              className="text-[11px] text-[#7164E8] font-medium inline-flex items-center gap-1 hover:underline pt-1"
            >
              Inspect SHA-256 Avalanche →
            </Link>
          </div>
        </div>
      </section>

      {/* Section 5: Course Viva Voce Study Guide */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#7164E8]" />
          <h2 className="text-xl font-bold text-[#F7F7F5]">
            Course Viva Voce Examination Guide
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Curated theoretical and practical questions frequently asked during discrete mathematics laboratory defense.
        </p>

        <div className="space-y-3">
          {VIVA_QUESTIONS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl card-elevated overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleViva(idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <span className="text-xs sm:text-sm font-semibold text-[#F7F7F5]">
                  {item.q}
                </span>
                {openViva === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#7164E8] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openViva === idx && (
                <div className="p-4 pt-1 border-t border-white/5 text-xs text-slate-300 leading-relaxed bg-black/20">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Navigation Footer */}
      <div className="p-6 rounded-2xl glass-panel flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Ready to test these concepts?</h3>
          <p className="text-xs text-slate-400">
            Execute actual FIPS 203, 204, and 205 operations in the Cryptography Lab.
          </p>
        </div>
        <Link
          href="/crypto-lab"
          className="btn-primary inline-flex items-center gap-2 text-xs"
        >
          <span>Open Cryptography Lab</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
