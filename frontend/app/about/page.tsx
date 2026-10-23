"use client";

import React from "react";
import Link from "next/link";
import {
  Info,
  Shield,
  Binary,
  Layers,
  Scale,
  Award,
  Users,
  Database,
  ExternalLink,
  Lock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-12 pb-16 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="p-8 rounded-2xl glass-panel-violet space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7164E8]/20 border border-[#7164E8]/40 text-[#DCD9FA] text-xs font-mono font-medium">
          <Info className="w-3.5 h-3.5 text-[#7164E8]" />
          <span>PROJECT METHODOLOGY &amp; ARCHITECTURE SPECIFICATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F7F7F5] tracking-tight">
          About QuantumShield Lab
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          A Discrete Mathematics Approach to Post-Quantum Cryptography — an educational laboratory testbed designed to bridge theoretical discrete mathematics, genuine standardized cryptographic engineering, and controlled empirical performance analysis.
        </p>
      </div>

      {/* Student Contributors */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#7164E8]" />
          <h2 className="text-xl font-bold text-[#F7F7F5]">
            Course Project Contributors
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Shaurya Vardhan", role: "Cryptographic Engineering & Full-Stack Integration" },
            { name: "Shaunak", role: "Discrete Mathematics & Modular Ring Theory" },
            { name: "Soham", role: "Lattice Algebra & Benchmark Methodology" },
            { name: "Shantnu", role: "Frontend Architecture & Scientific Visualization" },
          ].map((student, i) => (
            <div key={i} className="p-4 rounded-xl card-elevated space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#7164E8]/15 border border-[#7164E8]/30 flex items-center justify-center text-[#7164E8] font-bold text-xs">
                0{i + 1}
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white">{student.name}</h3>
              <p className="text-[11px] text-slate-400 leading-snug">{student.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Academic Integrity & Core Principles */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#7164E8]" />
          <h2 className="text-xl font-bold text-[#F7F7F5]">
            Engineering &amp; Academic Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl card-elevated space-y-3">
            <div className="text-xs font-mono font-bold text-[#7164E8]">
              Standardized Implementations
            </div>
            <h3 className="text-sm font-bold text-white">No Homemade Cryptography</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We strictly adhere to official NIST Post-Quantum Cryptography standards (FIPS 203, FIPS 204, FIPS 205). We do not create experimental ad-hoc ciphers. The system uses genuine Python implementations adhering to published specifications.
            </p>
          </div>

          <div className="p-5 rounded-xl card-elevated space-y-3">
            <div className="text-xs font-mono font-bold text-[#7164E8]">
              Empirical Rigor
            </div>
            <h3 className="text-sm font-bold text-white">No Fabricated Metrics</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Timing metrics are measured directly on your host CPU using Python's high-resolution monotonic timer (<code className="text-[#DCD9FA]">time.perf_counter</code>). Warm-up operations are strictly excluded, and all samples are preserved for statistical analysis.
            </p>
          </div>

          <div className="p-5 rounded-xl card-elevated space-y-3">
            <div className="text-xs font-mono font-bold text-[#7164E8]">
              Secret Hygiene
            </div>
            <h3 className="text-sm font-bold text-white">Zero Secret Leakage</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Decapsulation private keys and encapsulated shared secrets are processed strictly in server-side memory. They are never transmitted to the frontend, never logged, and never persisted in database records.
            </p>
          </div>
        </div>
      </section>

      {/* Database Schema Specification */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-[#7164E8]" />
          <h2 className="text-xl font-bold text-[#F7F7F5]">
            Relational Persistence Architecture
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          The backend implements an ACID-compliant relational SQLite database (`quantumshield.db`) matching the course specification:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl card-elevated space-y-2">
            <span className="text-xs font-mono font-bold text-[#7164E8]">Table: experiments</span>
            <ul className="text-xs text-slate-300 space-y-1 font-mono">
              <li>• experiment_id (TEXT PRIMARY KEY)</li>
              <li>• name (TEXT NOT NULL)</li>
              <li>• description (TEXT)</li>
              <li>• created_at (TEXT ISO 8601)</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl card-elevated space-y-2">
            <span className="text-xs font-mono font-bold text-[#7164E8]">Table: algorithm_configurations</span>
            <ul className="text-xs text-slate-300 space-y-1 font-mono">
              <li>• configuration_id (TEXT PRIMARY KEY)</li>
              <li>• algorithm (TEXT)</li>
              <li>• parameter_set (TEXT)</li>
              <li>• library_version (TEXT)</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl card-elevated space-y-2">
            <span className="text-xs font-mono font-bold text-[#7164E8]">Table: benchmark_runs</span>
            <ul className="text-xs text-slate-300 space-y-1 font-mono">
              <li>• run_id (TEXT PRIMARY KEY)</li>
              <li>• experiment_id (FK → experiments)</li>
              <li>• configuration_id (FK → configurations)</li>
              <li>• machine_info (TEXT)</li>
              <li>• repetitions (INTEGER)</li>
              <li>• timestamp (TEXT)</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl card-elevated space-y-2">
            <span className="text-xs font-mono font-bold text-[#7164E8]">Table: benchmark_measurements</span>
            <ul className="text-xs text-slate-300 space-y-1 font-mono">
              <li>• measurement_id (TEXT PRIMARY KEY)</li>
              <li>• run_id (FK → benchmark_runs)</li>
              <li>• operation (TEXT)</li>
              <li>• duration_ms (REAL)</li>
              <li>• output_size_bytes (INTEGER)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Official Standards & References */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#7164E8]" />
          <h2 className="text-xl font-bold text-[#F7F7F5]">
            Official Standards &amp; Regulatory References
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              title: "NIST FIPS 203 (Final, August 2024)",
              name: "Module-Lattice Key Encapsulation Mechanism (ML-KEM)",
              url: "https://csrc.nist.gov/pubs/fips/203/final",
              desc: "Primary global standard for post-quantum public-key encryption and key exchange. Derived from CRYSTALS-Kyber.",
            },
            {
              title: "NIST FIPS 204 (Final, August 2024)",
              name: "Module-Lattice Digital Signature Algorithm (ML-DSA)",
              url: "https://csrc.nist.gov/pubs/fips/204/final",
              desc: "Primary global standard for post-quantum digital signatures. Derived from CRYSTALS-Dilithium.",
            },
            {
              title: "NIST FIPS 205 (Final, August 2024)",
              name: "Stateless Hash-Based Digital Signature Algorithm (SLH-DSA)",
              url: "https://csrc.nist.gov/pubs/fips/205/final",
              desc: "Conservative post-quantum signature standard relying exclusively on hash function security. Derived from SPHINCS+.",
            },
            {
              title: "NSA Commercial National Security Algorithm Suite 2.0 (CNSA 2.0)",
              name: "Quantum-Resilient Security Migration Roadmap",
              url: "https://www.nsa.gov/Cybersecurity/Post-Quantum-Cybersecurity-Resources/",
              desc: "Mandates transition to ML-KEM-1024 and ML-DSA-87 for National Security Systems by 2033.",
            },
          ].map((ref, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl card-elevated flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#7164E8]">
                    {ref.title}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white">{ref.name}</h4>
                <p className="text-xs text-slate-400">{ref.desc}</p>
              </div>
              <a
                href={ref.url}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 text-xs font-semibold text-[#7164E8] hover:text-[#DCD9FA] inline-flex items-center gap-1 border border-[#7164E8]/30 px-3 py-1.5 rounded-lg hover:bg-[#7164E8]/10 transition-colors"
              >
                <span>View Standard</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Lab CTAs */}
      <div className="p-6 rounded-2xl glass-panel flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Experience the Project Live</h3>
          <p className="text-xs text-slate-400">
            Launch interactive calculations or execute genuine PQC handshakes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/math-lab" className="btn-secondary text-xs">
            Mathematics Lab
          </Link>
          <Link href="/crypto-lab" className="btn-primary text-xs">
            Cryptography Lab
          </Link>
        </div>
      </div>
    </div>
  );
}
