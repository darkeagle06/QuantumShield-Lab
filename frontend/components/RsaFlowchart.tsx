"use client";

import React, { useState } from "react";
import {
  Key,
  Lock,
  Unlock,
  ArrowRight,
  ArrowDown,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Binary,
  Layers,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  Zap,
  RotateCcw,
} from "lucide-react";

interface RsaFlowchartProps {
  p?: number;
  q?: number;
  n?: number;
  phi?: number;
  e?: number;
  d?: number;
  m?: number;
  c?: number;
  recoveredM?: number;
}

export default function RsaFlowchart({
  p = 61,
  q = 53,
  n = 3233,
  phi = 3120,
  e = 17,
  d = 2753,
  m = 65,
  c = 2790,
  recoveredM = 65,
}: RsaFlowchartProps) {
  const [activeView, setActiveView] = useState<"flowchart" | "proof" | "quantum">("flowchart");
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const steps = [
    {
      id: 1,
      phase: "Key Generation",
      phaseColor: "border-amber-500/40 bg-amber-500/5 text-amber-300",
      actor: "Setup / Key Authority",
      title: "1. Prime Selection (p, q)",
      formula: "p, q ∈ Primes (p ≠ q)",
      currentValues: `p = ${p}, q = ${q}`,
      description:
        "Select two distinct large prime numbers. In textbook demonstrations these are small primes; in production RSA, p and q are 1024-bit primes generated via probabilistic primality tests.",
      concept: "Fundamental Theorem of Arithmetic & Primality Testing",
    },
    {
      id: 2,
      phase: "Key Generation",
      phaseColor: "border-amber-500/40 bg-amber-500/5 text-amber-300",
      actor: "Setup / Key Authority",
      title: "2. Modulus & Totient (n, φ(n))",
      formula: "n = p × q,  φ(n) = (p - 1)(q - 1)",
      currentValues: `n = ${n},  φ(n) = ${phi}`,
      description:
        "Compute the public modulus n and Euler's totient φ(n). Multiplying p × q is easy, but factoring n without knowing p and q is computationally hard for classical computers.",
      concept: "Trapdoor One-Way Function & Euler's Phi Function",
    },
    {
      id: 3,
      phase: "Key Generation",
      phaseColor: "border-amber-500/40 bg-amber-500/5 text-amber-300",
      actor: "Setup / Key Authority",
      title: "3. Derive Key Pair (e, d)",
      formula: "gcd(e, φ(n)) = 1,  d ≡ e⁻¹ (mod φ(n))",
      currentValues: `Public: (e=${e}, n=${n}),  Private: d=${d}`,
      description:
        "Choose public exponent e coprime to φ(n). Calculate private exponent d via the Extended Euclidean Algorithm (EEA) such that e · d ≡ 1 (mod φ(n)).",
      concept: "Bézout's Identity & Extended Euclidean Algorithm",
    },
    {
      id: 4,
      phase: "Encryption",
      phaseColor: "border-cyan-500/40 bg-cyan-500/5 text-cyan-300",
      actor: "Sender (Alice)",
      title: "4. Message Encryption (m → c)",
      formula: "c ≡ mᵉ (mod n)",
      currentValues: `m = ${m}  →  c = ${m}^${e} mod ${n} = ${c}`,
      description:
        "Alice encodes plaintext as integer m < n. Using Bob's public key (e, n), she computes ciphertext c via modular exponentiation (repeated squaring).",
      concept: "Binary Modular Exponentiation in ℤ_n",
    },
    {
      id: 5,
      phase: "Transmission",
      phaseColor: "border-slate-600 bg-slate-900/60 text-slate-300",
      actor: "Public Insecure Channel",
      title: "5. Channel Transmission & Eavesdropper",
      formula: "Adversary observes: (c, e, n)",
      currentValues: `c = ${c}, e = ${e}, n = ${n}`,
      description:
        "Ciphertext c travels over the untrusted network. Eavesdropper Eve sees c, e, and n. To decrypt, Eve must compute the e-th root of c modulo n, which requires factoring n.",
      concept: "The RSA Problem (Factoring Assumption)",
    },
    {
      id: 6,
      phase: "Decryption",
      phaseColor: "border-emerald-500/40 bg-emerald-500/5 text-emerald-300",
      actor: "Receiver (Bob)",
      title: "6. Decryption via Secret Trapdoor (c → m')",
      formula: "m' ≡ cᵈ (mod n)",
      currentValues: `c = ${c}  →  m' = ${c}^${d} mod ${n} = ${recoveredM}`,
      description:
        "Bob uses his private exponent d. He computes c^d mod n. By Euler's Totient Theorem, (m^e)^d ≡ m^(ed) ≡ m^(1 + k·φ(n)) ≡ m (mod n), recovering the exact message.",
      concept: "Euler's Totient Theorem & Group Theory (ℤ_n*)",
    },
  ];

  return (
    <div className="rounded-2xl bg-[#090e1a] border border-amber-500/30 p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Key className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-wide">
              RSA Cryptosystem: Complete Process Flowchart
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Educational trace mapping discrete mathematics theorems (primes, modular rings, Extended Euclidean inverses, Euler's totient) directly into cryptographic operations.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveView("flowchart")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeView === "flowchart"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Process Flowchart
          </button>
          <button
            onClick={() => setActiveView("proof")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeView === "proof"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Mathematical Proof
          </button>
          <button
            onClick={() => setActiveView("quantum")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeView === "quantum"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Shor's Quantum Threat
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. VISUAL FLOWCHART VIEW */}
      {/* ===================================================================== */}
      {activeView === "flowchart" && (
        <div className="space-y-6">
          {/* Quick Flow Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px] font-mono">
            <div className="p-2.5 rounded-lg bg-[#0d1527] border border-amber-500/30 text-center">
              <span className="text-slate-400 text-[10px] block">Primes (Secret)</span>
              <span className="text-amber-300 font-bold">p={p}, q={q}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0d1527] border border-amber-500/30 text-center">
              <span className="text-slate-400 text-[10px] block">Modulus &amp; Totient</span>
              <span className="text-slate-200 font-bold">n={n}, φ={phi}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0d1527] border border-cyan-500/30 text-center">
              <span className="text-slate-400 text-[10px] block">Public Key</span>
              <span className="text-cyan-300 font-bold">(e={e}, n={n})</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0d1527] border border-violet-500/30 text-center">
              <span className="text-slate-400 text-[10px] block">Private Key</span>
              <span className="text-violet-300 font-bold">d={d}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0d1527] border border-sky-500/30 text-center">
              <span className="text-slate-400 text-[10px] block">Ciphertext</span>
              <span className="text-sky-300 font-bold">c={c}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0d1527] border border-emerald-500/30 text-center">
              <span className="text-slate-400 text-[10px] block">Decrypted Message</span>
              <span className="text-emerald-300 font-bold">m'={recoveredM}</span>
            </div>
          </div>

          {/* Sequential Step Cards with Directional Connectors */}
          <div className="space-y-3">
            {steps.map((st, idx) => {
              const isSelected = selectedStep === st.id;
              return (
                <div key={st.id} className="relative">
                  <div
                    onClick={() => setSelectedStep(isSelected ? null : st.id)}
                    className={`rounded-xl border p-4 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#111c33] border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                        : "bg-[#0b1222] border-slate-800 hover:border-slate-700 hover:bg-[#0e172a]"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${st.phaseColor}`}
                        >
                          {st.phase}
                        </span>
                        <h4 className="text-sm font-bold text-white">{st.title}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-cyan-400 bg-slate-900/90 px-2.5 py-1 rounded border border-slate-800">
                          {st.formula}
                        </span>
                        <span className="text-[11px] font-mono text-amber-300 font-bold bg-amber-950/40 px-2.5 py-1 rounded border border-amber-800/40">
                          {st.currentValues}
                        </span>
                      </div>
                    </div>

                    {/* Step Body */}
                    <div className="mt-2.5 pt-2.5 border-t border-slate-800/70 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                      <div className="md:col-span-8 text-slate-300 leading-relaxed">
                        <span className="text-slate-400 mr-1.5 font-semibold">Role ({st.actor}):</span>
                        {st.description}
                      </div>
                      <div className="md:col-span-4 bg-slate-900/70 p-2 rounded-lg border border-slate-800/80 flex items-center gap-2">
                        <Binary className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="text-[11px] text-slate-400">
                          <strong className="text-slate-300">Discrete Math: </strong>
                          {st.concept}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Flow Arrow between steps */}
                  {idx < steps.length - 1 && (
                    <div className="flex justify-center py-1 text-slate-600">
                      <ArrowDown className="w-4 h-4 animate-bounce" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Three-Column Operational Architecture (Actors) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            {/* Alice (Sender) */}
            <div className="p-4 rounded-xl bg-[#0c1426] border border-cyan-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                  Alice (Sender)
                </h5>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1 font-mono">
                <li>1. Encodes message: m = {m}</li>
                <li>2. Fetches public key: (e={e}, n={n})</li>
                <li>3. Computes: c ≡ {m}^{e} (mod {n})</li>
                <li className="text-cyan-400 font-bold">4. Emits ciphertext: c = {c}</li>
              </ul>
            </div>

            {/* Insecure Channel (Public Network) */}
            <div className="p-4 rounded-xl bg-[#0c1426] border border-slate-700/50 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                  Public Channel (Eve)
                </h5>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1 font-mono">
                <li>• Public parameters: n = {n}, e = {e}</li>
                <li>• Intercepted ciphertext: c = {c}</li>
                <li className="text-rose-400">• Eve cannot factor n = {n} into ({p} × {q}) classically</li>
                <li className="text-amber-400">• Without φ(n)={phi}, Eve cannot derive d={d}</li>
              </ul>
            </div>

            {/* Bob (Receiver) */}
            <div className="p-4 rounded-xl bg-[#0c1426] border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Unlock className="w-3.5 h-3.5" />
                </div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                  Bob (Receiver)
                </h5>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1 font-mono">
                <li>1. Receives ciphertext: c = {c}</li>
                <li>2. Holds secret trapdoor: d = {d}</li>
                <li>3. Computes: m' ≡ {c}^{d} (mod {n})</li>
                <li className="text-emerald-400 font-bold">4. Decrypted plaintext: m' = {recoveredM} ✓</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. MATHEMATICAL PROOF VIEW */}
      {/* ===================================================================== */}
      {activeView === "proof" && (
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-[#0b1222] border border-cyan-500/30 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Binary className="w-4 h-4 text-cyan-400" />
              <span>Rigorous Mathematical Proof: Why Decryption Recovers Plaintext</span>
            </h4>
            <p className="leading-relaxed">
              RSA decryption relies entirely on <strong>Euler's Totient Theorem</strong> in the multiplicative group of integers modulo n, denoted ℤ_n*.
            </p>
          </div>

          <div className="space-y-3 font-mono">
            {/* Step 1 */}
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-cyan-400 uppercase font-bold">Step 1: Key Inversion Relation</span>
              <p className="text-slate-200">
                By construction via the Extended Euclidean Algorithm:
              </p>
              <div className="p-2 rounded bg-slate-950 text-amber-300 text-[11px]">
                e · d ≡ 1 (mod φ(n))  ⟹  e · d = 1 + k · φ(n)  for some integer k ≥ 1
              </div>
              <p className="text-slate-400 text-[11px]">
                For our active values: {e} · {d} = 1 + {Math.round((e * d - 1) / phi)} · {phi} = {e * d}.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-cyan-400 uppercase font-bold">Step 2: Substitution into Decryption Operation</span>
              <p className="text-slate-200">
                Bob computes m' ≡ cᵈ (mod n). Substituting Alice's ciphertext c ≡ mᵉ (mod n):
              </p>
              <div className="p-2 rounded bg-slate-950 text-cyan-300 text-[11px]">
                cᵈ ≡ (mᵉ)ᵈ ≡ m^(e · d) ≡ m^(1 + k · φ(n)) ≡ m · (m^φ(n))^k (mod n)
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-cyan-400 uppercase font-bold">Step 3: Invoking Euler's Totient Theorem</span>
              <p className="text-slate-200">
                Euler's Theorem states: If gcd(m, n) = 1, then:
              </p>
              <div className="p-2 rounded bg-slate-950 text-emerald-300 text-[11px]">
                m^φ(n) ≡ 1 (mod n)
              </div>
              <p className="text-slate-400 text-[11px]">
                Substituting m^φ(n) ≡ 1 into our equation:
              </p>
              <div className="p-2 rounded bg-slate-950 text-emerald-400 font-bold text-[11px]">
                m' ≡ m · (1)^k ≡ m · 1 ≡ m (mod n)
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1 font-sans">
              <span className="text-[10px] text-cyan-400 uppercase font-bold font-mono">Case 2: When gcd(m, n) &gt; 1</span>
              <p className="text-slate-300 leading-relaxed text-xs">
                If gcd(m, n) ≠ 1, then either p divides m or q divides m (since n = p × q is square-free). Using the Chinese Remainder Theorem (CRT), m^(ed) ≡ m (mod p) and m^(ed) ≡ m (mod q) hold simultaneously, ensuring m' ≡ m (mod n) holds universally for all m &lt; n!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. SHOR'S QUANTUM THREAT VIEW */}
      {/* ===================================================================== */}
      {activeView === "quantum" && (
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2">
            <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-rose-400" />
              <span>How Shor's Algorithm Breaks the RSA Flowchart in Polynomial Time</span>
            </h4>
            <p className="leading-relaxed text-slate-300">
              The entire security of the RSA flowchart relies on the assumption that factoring n = p × q is computationally intractable. Peter Shor's 1994 quantum algorithm reduces integer factoring to <strong>period finding</strong> on a quantum register.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Classical Factoring */}
            <div className="p-4 rounded-xl bg-[#0b1222] border border-slate-800 space-y-2.5">
              <div className="text-xs font-mono font-bold text-amber-400">
                Classical Attack: General Number Field Sieve (GNFS)
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                The fastest known classical factoring algorithm runs in sub-exponential time:
              </p>
              <div className="p-2 rounded bg-slate-950 font-mono text-amber-300 text-[11px]">
                O(exp(c · (ln n)^(1/3) · (ln ln n)^(2/3)))
              </div>
              <p className="text-slate-400 text-[11px]">
                For a 2048-bit modulus n, classical factoring requires billions of CPU core-years, making RSA safe against classical supercomputers today.
              </p>
            </div>

            {/* Quantum Factoring */}
            <div className="p-4 rounded-xl bg-[#0b1222] border border-rose-500/30 space-y-2.5">
              <div className="text-xs font-mono font-bold text-rose-400">
                Quantum Attack: Shor's Algorithm (1994)
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                A quantum computer evaluates the periodic function f(x) = a^x mod n in quantum superposition and applies the Quantum Fourier Transform (QFT):
              </p>
              <div className="p-2 rounded bg-slate-950 font-mono text-rose-300 text-[11px]">
                O((log n)³) quantum gate operations (Polynomial Time!)
              </div>
              <p className="text-slate-400 text-[11px]">
                For a 2048-bit modulus, Shor's algorithm finds the order r in roughly 2048³ ≈ 8.5 billion gate steps (seconds on a fault-tolerant quantum computer).
              </p>
            </div>
          </div>

          {/* Shor's Step-by-Step Factoring Pipeline */}
          <div className="p-4 rounded-xl bg-[#0b1222] border border-slate-800 space-y-2.5 font-mono text-xs">
            <span className="text-[10px] text-cyan-400 uppercase font-bold block">
              Shor's Factoring Reduction Pipeline:
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                1. Pick random integer a &lt; n. If gcd(a, n) &gt; 1, factor is already found.
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                2. Quantum Register prepares superposition: ∑ |x⟩ |a^x mod n⟩.
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                3. Quantum Fourier Transform measures the exact period r such that a^r ≡ 1 (mod n).
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                4. If r is even, then a^r - 1 = (a^(r/2) - 1)(a^(r/2) + 1) = k · n.
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-rose-300 font-bold">
                5. Compute gcd(a^(r/2) ± 1, n) via Euclidean Algorithm ⟹ Instantly reveals primes p and q!
              </div>
            </div>
            <div className="pt-2 text-slate-400 text-[11px] font-sans">
              Conclusion: Once p and q are exposed, Euler's totient φ(n) and private key d are trivial to compute. This is why our project transitions from classical integer factorization to <strong>Lattice-Based Post-Quantum Cryptography (ML-KEM and ML-DSA)</strong>!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
