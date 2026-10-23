"use client";

import React, { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Shield,
  Binary,
  Layers,
  Cpu,
  CheckCircle2,
} from "lucide-react";

const VIVA_QUESTIONS = [
  {
    q: "1. What is QuantumShield Lab?",
    a: "QuantumShield Lab is an interactive educational and experimental laboratory designed to connect discrete mathematics foundations to standardized post-quantum cryptography (NIST FIPS 203, 204, 205) and measure controlled cryptographic performance on local hardware.",
  },
  {
    q: "2. Why is this primarily a Discrete Mathematics project?",
    a: "Because modern post-quantum cryptography is built directly upon discrete mathematical structures: modular congruences, prime fields, polynomial quotient rings (Z_q[X]/(X^256 + 1)), linear algebra over lattices (Module-LWE and Module-SIS), error distributions, and computational complexity theory. Statistical concepts (median, spread) are also applied to evaluate benchmark distributions.",
  },
  {
    q: "3. What does ML-KEM do, and what does it NOT do?",
    a: "ML-KEM (NIST FIPS 203) is a Key Encapsulation Mechanism. It securely establishes a shared 256-bit symmetric secret between two parties over an insecure channel. It DOES NOT directly encrypt arbitrary bulk documents or files. Instead, the established shared secret is used with symmetric ciphers like AES-256-GCM or ChaCha20-Poly1305.",
  },
  {
    q: "4. What do ML-DSA and SLH-DSA do?",
    a: "ML-DSA (FIPS 204) and SLH-DSA (FIPS 205) are post-quantum digital signature algorithms. They provide data integrity and sender authenticity. Digital signatures DO NOT encrypt or conceal the message payload; anyone can read the signed message, but any unauthorized modification invalidates the mathematical signature verification relation.",
  },
  {
    q: "5. Are quantum computers currently breaking RSA in the real world?",
    a: "No. Existing Noisy Intermediate-Scale Quantum (NISQ) computers lack the physical qubit count and fault-tolerant quantum error correction necessary to execute Shor's algorithm on production key lengths (such as RSA-2048 or ECC P-256). The immediate operational threat is 'Harvest Now, Decrypt Later', where adversaries store encrypted traffic today to decrypt once Cryptanalytically Relevant Quantum Computers (CRQCs) emerge.",
  },
  {
    q: "6. Are you inventing a new cryptographic algorithm?",
    a: "No. Attempting to invent new cryptography is dangerous and contrary to academic best practices. The project contribution lies in educational visualization, bridging discrete mathematics with software implementation, building a clean full-stack workbench, and conducting rigorous, reproducible benchmarks under documented conditions.",
  },
  {
    q: "7. How do you ensure benchmark fairness and scientific honesty?",
    a: "We do not fabricate benchmark metrics. Measurements are taken directly from the running environment using high-precision counters (time.perf_counter). To eliminate cold-cache anomalies, we perform initial warm-up passes, run repeated iterations, record every individual sample, and report median latency and spread rather than easily skewed arithmetic averages.",
  },
  {
    q: "8. What is the fundamental difference between Classical, Quantum, and Post-Quantum cryptography?",
    a: "Classical cryptography (RSA, ECC) runs on ordinary classical computers and relies on integer factoring or discrete logs. Quantum cryptography (QKD) relies on physical quantum mechanics (photons, Heisenberg uncertainty) and requires specialized quantum hardware. Post-quantum cryptography (ML-KEM, ML-DSA) runs on ordinary, standard classical computers but is mathematically designed to resist attacks from both classical and quantum computers.",
  },
];

export default function LearnDocsPage() {
  const [openViva, setOpenViva] = useState<number | null>(0);

  const toggleViva = (idx: number) => {
    setOpenViva(openViva === idx ? null : idx);
  };

  return (
    <div className="space-y-10 pb-12 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-[#0c1322] border border-slate-800 space-y-2">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <span>Documentation &amp; Viva Voce Guide</span>
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed">
          Comprehensive project handbook covering theoretical foundations, standard
          specifications, discrete mathematics connections, and direct answers for course viva examinations.
        </p>
      </div>

      {/* Section 1: Three Cryptographic Paradigms */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Three Distinct Cryptographic Paradigms</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] block">
              1. Classical Cryptography
            </span>
            <p className="text-slate-400 leading-relaxed">
              Runs on conventional computers. Schemes: RSA, ECC, AES. Relies on mathematical
              problems (integer factorization, discrete logarithms) that are vulnerable to polynomial-time quantum algorithms.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] block">
              2. Quantum Cryptography
            </span>
            <p className="text-slate-400 leading-relaxed">
              Uses physical phenomena of quantum mechanics (Quantum Key Distribution - QKD).
              Requires specialized fiber-optic or laser transmission hardware. Does not replace public-key software infrastructure.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0c1322] border border-cyan-500/30 space-y-2 text-xs">
            <span className="font-bold text-cyan-300 uppercase tracking-wider text-[11px] block">
              3. Post-Quantum Cryptography
            </span>
            <p className="text-slate-300 leading-relaxed">
              Runs on ordinary conventional computers and standard networks! Algorithms (ML-KEM, ML-DSA, SLH-DSA)
              are engineered with mathematical hardness (lattices, hash trees) resistant to both classical and quantum attacks.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Viva Voce Q&A Accordion */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Viva Voce Examination Preparation</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            8 Standard Questions &amp; Model Answers
          </span>
        </div>

        <div className="space-y-3">
          {VIVA_QUESTIONS.map((item, idx) => {
            const isOpen = openViva === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#0c1322] border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleViva(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-semibold text-slate-200">
                    {item.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 bg-[#090e1a]/60 font-sans">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Official NIST Standards Links */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-cyan-400" />
          <span>Official References &amp; Standards</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <a
            href="https://csrc.nist.gov/pubs/fips/203/final"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 hover:border-cyan-500/40 p-4 space-y-1 block group transition-colors"
          >
            <div className="flex items-center justify-between text-cyan-400 font-bold">
              <span>NIST FIPS 203</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 font-sans text-[11px]">
              Module-Lattice-Based Key-Encapsulation Mechanism Standard (ML-KEM)
            </p>
          </a>

          <a
            href="https://csrc.nist.gov/pubs/fips/204/final"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 hover:border-violet-500/40 p-4 space-y-1 block group transition-colors"
          >
            <div className="flex items-center justify-between text-violet-400 font-bold">
              <span>NIST FIPS 204</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 font-sans text-[11px]">
              Module-Lattice-Based Digital Signature Standard (ML-DSA)
            </p>
          </a>

          <a
            href="https://csrc.nist.gov/pubs/fips/205/final"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 hover:border-blue-500/40 p-4 space-y-1 block group transition-colors"
          >
            <div className="flex items-center justify-between text-blue-400 font-bold">
              <span>NIST FIPS 205</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 font-sans text-[11px]">
              Stateless Hash-Based Digital Signature Standard (SLH-DSA)
            </p>
          </a>

          <a
            href="https://openquantumsafe.org/"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 hover:border-emerald-500/40 p-4 space-y-1 block group transition-colors"
          >
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span>Open Quantum Safe (OQS)</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 font-sans text-[11px]">
              Open-source project for prototyping and evaluating quantum-resistant cryptography
            </p>
          </a>
        </div>
      </section>
    </div>
  );
}
