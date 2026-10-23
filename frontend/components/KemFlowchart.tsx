"use client";

import React, { useState } from "react";
import {
  KeyRound,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  ArrowDown,
  Binary,
  CheckCircle2,
  Lock,
  Unlock,
  Zap,
} from "lucide-react";

interface KemFlowchartProps {
  algorithm?: string;
  publicKeyBytes?: number;
  ciphertextBytes?: number;
  totalTimeMs?: number;
  verified?: boolean;
}

export default function KemFlowchart({
  algorithm = "ML-KEM-768",
  publicKeyBytes = 1184,
  ciphertextBytes = 1088,
  totalTimeMs,
  verified = true,
}: KemFlowchartProps) {
  const [activeTab, setActiveTab] = useState<"flow" | "math" | "quantum">("flow");

  const kemSteps = [
    {
      id: 1,
      actor: "Alice (Receiver)",
      actorColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
      stepTitle: "1. KeyGen() — Generate Module-LWE Keypair",
      formula: "A ← R_q^(k×k),  s, e ← χ_η  ⟹  b = A·s + e",
      output: `ek = (A, b) [${publicKeyBytes} B],  dk = s [Private]`,
      description:
        "Alice samples a public polynomial matrix A and secret small error polynomials (s, e) from a centered binomial distribution. She computes public vector b. Solvability without e is easy, but noisy b = As + e is NP-hard (Learning With Errors).",
      discreteMath: "Polynomial Quotient Ring R_q = ℤ_q[X]/(X²⁵⁶ + 1) with q = 3329",
    },
    {
      id: 2,
      actor: "Network Transmission",
      actorColor: "text-slate-400 border-slate-700 bg-slate-800/60",
      stepTitle: "2. Public Key Distribution",
      formula: "Alice publishes Encapsulation Key (ek)",
      output: `Public key ek sent to Bob (${publicKeyBytes} Bytes)`,
      description:
        "The public matrix seed and compressed polynomial vector b are transmitted across the open network. An eavesdropper Eve sees ek, but cannot deduce secret vector s due to lattice hardness.",
      discreteMath: "Module-LWE Hardness Assumption (Reduction to Shortest Vector Problem)",
    },
    {
      id: 3,
      actor: "Bob (Sender)",
      actorColor: "text-sky-400 border-sky-500/30 bg-sky-500/10",
      stepTitle: "3. Encaps(ek) — Encapsulate Shared Secret",
      formula: "u = Aᵀ·r + e₁,  v = bᵀ·r + e₂ + ⌈q/2⌉·m",
      output: `ct = (u, v) [${ciphertextBytes} B],  Shared Key K_B = KDF(m, ek)`,
      description:
        "Bob generates random 256-bit message m and small random vectors r, e₁, e₂. He computes ciphertext tuple (u, v) embedding m via modular rounding ⌈q/2⌉. He hashes m to derive 256-bit symmetric key K_B.",
      discreteMath: "Error-Tolerant Modular Rounding & Fujisaki-Okamoto Transform",
    },
    {
      id: 4,
      actor: "Network Transmission",
      actorColor: "text-slate-400 border-slate-700 bg-slate-800/60",
      stepTitle: "4. Ciphertext Transmission",
      formula: "Bob transmits Ciphertext ct = (u, v)",
      output: `Ciphertext ct sent to Alice (${ciphertextBytes} Bytes)`,
      description:
        "Bob sends ciphertext (u, v) back to Alice over the insecure channel. Eavesdropper Eve cannot separate message m from noisy vectors without Alice's secret key s.",
      discreteMath: "IND-CCA2 Security (Indistinguishability Under Adaptive Chosen Ciphertext Attack)",
    },
    {
      id: 5,
      actor: "Alice (Receiver)",
      actorColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      stepTitle: "5. Decaps(ct, dk) — Decapsulate & Harmonize",
      formula: "v - sᵀ·u = ⌈q/2⌉·m + (noise) ⟹ Decode(m) ⟹ K_A = KDF(m, ek)",
      output: "Shared Key K_A derived | Verified: K_A == K_B ✓",
      description:
        "Alice subtracts sᵀ·u from v. Because sᵀ·(Aᵀ·r + e₁) ≈ (sᵀ·Aᵀ)·r, the large terms cancel out, leaving ⌈q/2⌉·m plus small noise. Alice rounds the coefficients to decode m exactly, deriving the identical 256-bit symmetric key K_A.",
      discreteMath: "Noise Bounds: ||e_total||_∞ < q/4 ensures zero decryption failure",
    },
  ];

  return (
    <div className="rounded-2xl bg-[#090e1a] border border-cyan-500/30 p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-wide">
              ML-KEM Key Encapsulation: Process Flowchart (FIPS 203)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Educational protocol trace demonstrating how Alice and Bob negotiate a 256-bit symmetric key using Module Learning With Errors over polynomial quotient rings.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab("flow")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "flow"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Protocol Flowchart
          </button>
          <button
            onClick={() => setActiveTab("math")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "math"
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Lattice Math Derivation
          </button>
          <button
            onClick={() => setActiveTab("quantum")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "quantum"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Post-Quantum Hardness
          </button>
        </div>
      </div>

      {/* Tab 1: Protocol Flowchart */}
      {activeTab === "flow" && (
        <div className="space-y-5">
          {/* Active Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono">
            <div className="p-2.5 rounded-lg bg-[#0d1527] border border-cyan-500/30 text-center">
              <span className="text-slate-400 text-[10px] block">Standard</span>
              <span className="text-cyan-300 font-bold">{algorithm}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0d1527] border border-slate-700 text-center">
              <span className="text-slate-400 text-[10px] block">Public Key (ek)</span>
              <span className="text-slate-200 font-bold">{publicKeyBytes} Bytes</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0d1527] border border-slate-700 text-center">
              <span className="text-slate-400 text-[10px] block">Ciphertext (ct)</span>
              <span className="text-slate-200 font-bold">{ciphertextBytes} Bytes</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0d1527] border border-emerald-500/30 text-center">
              <span className="text-slate-400 text-[10px] block">Key Output</span>
              <span className="text-emerald-300 font-bold">256-bit AES-GCM Key</span>
            </div>
          </div>

          {/* Vertical Step Nodes */}
          <div className="space-y-3">
            {kemSteps.map((st, idx) => (
              <div key={st.id} className="relative">
                <div className="rounded-xl border border-slate-800 bg-[#0b1222] p-4 hover:border-cyan-500/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${st.actorColor}`}
                      >
                        {st.actor}
                      </span>
                      <h4 className="text-sm font-bold text-white">{st.stepTitle}</h4>
                    </div>

                    <span className="text-[11px] font-mono text-cyan-400 bg-slate-900/90 px-2.5 py-1 rounded border border-slate-800">
                      {st.formula}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2.5 border-t border-slate-800/70 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                    <div className="md:col-span-8 text-slate-300 leading-relaxed">
                      {st.description}
                      <div className="text-[11px] font-mono text-amber-300 font-semibold mt-1">
                        Artifact: {st.output}
                      </div>
                    </div>
                    <div className="md:col-span-4 bg-slate-900/70 p-2 rounded-lg border border-slate-800/80 flex items-center gap-2">
                      <Binary className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="text-[11px] text-slate-400">
                        <strong className="text-slate-300">Discrete Math: </strong>
                        {st.discreteMath}
                      </span>
                    </div>
                  </div>
                </div>

                {idx < kemSteps.length - 1 && (
                  <div className="flex justify-center py-1 text-slate-600">
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Lattice Math Derivation */}
      {activeTab === "math" && (
        <div className="space-y-4 text-xs text-slate-300 font-mono">
          <div className="p-4 rounded-xl bg-[#0b1222] border border-cyan-500/30 space-y-2 font-sans">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Binary className="w-4 h-4 text-cyan-400" />
              <span>Algebraic Noise Cancellation Derivation</span>
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              Why does Alice's decapsulation reconstruct Bob's exact message m without knowing Bob's randomness r?
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] text-cyan-400 uppercase font-bold">Step 1: Alice computes inner product difference</span>
            <div className="p-2.5 rounded bg-slate-950 text-slate-200 text-[11px]">
              w = v - sᵀ · u
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] text-cyan-400 uppercase font-bold">Step 2: Expand Bob's ciphertext components</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Substitute v = bᵀ·r + e₂ + ⌈q/2⌉·m and u = Aᵀ·r + e₁:
            </p>
            <div className="p-2.5 rounded bg-slate-950 text-cyan-300 text-[11px] space-y-1">
              <div>w = (bᵀ·r + e₂ + ⌈q/2⌉·m) - sᵀ·(Aᵀ·r + e₁)</div>
              <div>Since b = A·s + e, then bᵀ = sᵀ·Aᵀ + eᵀ:</div>
              <div className="text-amber-300">
                w = (sᵀ·Aᵀ·r + eᵀ·r + e₂ + ⌈q/2⌉·m) - (sᵀ·Aᵀ·r + sᵀ·e₁)
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] text-cyan-400 uppercase font-bold">Step 3: Large Algebraic Terms Cancel</span>
            <p className="text-slate-400 text-[11px] font-sans">
              The dominant matrix product sᵀ·Aᵀ·r cancels completely from both sides:
            </p>
            <div className="p-2.5 rounded bg-slate-950 text-emerald-400 font-bold text-[11px]">
              w = ⌈q/2⌉·m + (eᵀ·r + e₂ - sᵀ·e₁)  (mod q)
            </div>
            <p className="text-slate-400 text-[11px] font-sans pt-1">
              The noise term E = eᵀ·r + e₂ - sᵀ·e₁ is bounded well below q/4 (since error polynomials are sampled from small distributions). Alice applies coefficient threshold rounding: if a coefficient is closer to ⌈q/2⌉ = 1665, it decodes to 1; if closer to 0, it decodes to 0. The message m is recovered with 100% fidelity!
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Post-Quantum Hardness */}
      {activeTab === "quantum" && (
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
            <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Why Quantum Computers Cannot Break ML-KEM</span>
            </h4>
            <p className="leading-relaxed text-slate-300 text-xs">
              Shor's algorithm breaks RSA and ECC because those ciphers rely on finding periods in abelian groups (period-finding on ℤ_n* or elliptic curve points).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0b1222] border border-slate-800 space-y-2">
              <span className="text-amber-400 font-mono font-bold text-xs">
                RSA Abelian Group (Broken by Shor)
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                RSA uses f(x) = a^x mod n. The period r satisfies f(x+r) = f(x). Quantum Fourier Transform finds r in polynomial time O((log n)³) because the underlying group is commutative (abelian).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0b1222] border border-emerald-500/30 space-y-2">
              <span className="text-emerald-400 font-mono font-bold text-xs">
                Lattice Geometry (Secure Against Shor)
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Module-LWE points form a 256·k dimensional lattice. The presence of discrete noise e creates the Closest Vector Problem (CVP) with no periodic structure. Finding the secret vector s is equivalent to solving the Shortest Independent Vectors Problem (SIVP), which remains exponential O(2^(0.292·d)) for quantum computers!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
