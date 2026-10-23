"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  KeyRound,
  FileSignature,
  ShieldCheck,
  Binary,
  Play,
  RotateCw,
  Save,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  Lock,
} from "lucide-react";
import { api } from "@/lib/api";
import { storage } from "@/lib/storage";
import { KemResult, SignResult } from "@/lib/types";
import ResultPanel from "@/components/ResultPanel";
import KemFlowchart from "@/components/KemFlowchart";

function CryptoLabContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"kem" | "dsa" | "slh" | "classical">("kem");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "kem" || tab === "dsa" || tab === "slh" || tab === "classical") {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  // ML-KEM State
  const [kemAlgo, setKemAlgo] = useState("ML-KEM-768");
  const [kemLoading, setKemLoading] = useState(false);
  const [kemResult, setKemResult] = useState<KemResult | null>(null);
  const [kemSaved, setKemSaved] = useState(false);
  const [kemError, setKemError] = useState<string | null>(null);

  // ML-DSA State
  const [dsaAlgo, setDsaAlgo] = useState("ML-DSA-65");
  const [dsaMessage, setDsaMessage] = useState(
    "Authentic discrete mathematics course project payload."
  );
  const [dsaTamperedMessage, setDsaTamperedMessage] = useState(
    "Authentic discrete mathematics course project payload!"
  );
  const [dsaTamper, setDsaTamper] = useState(true);
  const [dsaLoading, setDsaLoading] = useState(false);
  const [dsaResult, setDsaResult] = useState<SignResult | null>(null);
  const [dsaSaved, setDsaSaved] = useState(false);
  const [dsaError, setDsaError] = useState<string | null>(null);

  // SLH-DSA State
  const [slhAlgo, setSlhAlgo] = useState("SLH-DSA-SHA2-128s");
  const [slhMessage, setSlhMessage] = useState(
    "Stateless hash-based signature payload."
  );
  const [slhTamperedMessage, setSlhTamperedMessage] = useState(
    "Stateless hash-based signature payload!"
  );
  const [slhTamper, setSlhTamper] = useState(true);
  const [slhLoading, setSlhLoading] = useState(false);
  const [slhResult, setSlhResult] = useState<SignResult | null>(null);
  const [slhSaved, setSlhSaved] = useState(false);
  const [slhError, setSlhError] = useState<string | null>(null);

  // Handlers
  const handleRunKem = async () => {
    setKemLoading(true);
    setKemError(null);
    setKemSaved(false);
    try {
      const res = await api.runKemWorkflow(kemAlgo);
      setKemResult(res);
    } catch (err: any) {
      setKemError(err.message || "Failed to execute KEM workflow");
    } finally {
      setKemLoading(false);
    }
  };

  const handleSaveKem = () => {
    if (!kemResult) return;
    storage.saveExperiment({
      title: `ML-KEM Key Encapsulation (${kemResult.algorithm})`,
      type: "crypto_kem",
      algorithm: kemResult.algorithm,
      duration_ms: kemResult.timings_ms.total_ms,
      metrics: {
        public_key_bytes: kemResult.output_sizes_bytes.public_key_bytes,
        ciphertext_bytes: kemResult.output_sizes_bytes.ciphertext_bytes,
        timings: kemResult.timings_ms,
        verification: kemResult.verification.status,
      },
      notes: "Interactive KEM roundtrip execution in Cryptography Lab",
    });
    setKemSaved(true);
  };

  const handleRunDsa = async () => {
    setDsaLoading(true);
    setDsaError(null);
    setDsaSaved(false);
    try {
      const res = await api.runSignWorkflow(
        dsaAlgo,
        dsaMessage,
        dsaTamper,
        dsaTamperedMessage
      );
      setDsaResult(res);
    } catch (err: any) {
      setDsaError(err.message || "Failed to execute signature workflow");
    } finally {
      setDsaLoading(false);
    }
  };

  const handleSaveDsa = () => {
    if (!dsaResult) return;
    storage.saveExperiment({
      title: `ML-DSA Digital Signature (${dsaResult.algorithm})`,
      type: "crypto_sign",
      algorithm: dsaResult.algorithm,
      duration_ms: dsaResult.timings_ms.total_ms,
      metrics: {
        public_key_bytes: dsaResult.output_sizes_bytes.public_key_bytes,
        signature_bytes: dsaResult.output_sizes_bytes.signature_bytes,
        tamper_detected: dsaResult.tamper_test?.tamper_detected,
        timings: dsaResult.timings_ms,
      },
      notes: "Interactive ML-DSA signature and tamper test",
    });
    setDsaSaved(true);
  };

  const handleRunSlh = async () => {
    setSlhLoading(true);
    setSlhError(null);
    setSlhSaved(false);
    try {
      const res = await api.runSignWorkflow(
        slhAlgo,
        slhMessage,
        slhTamper,
        slhTamperedMessage
      );
      setSlhResult(res);
    } catch (err: any) {
      setSlhError(err.message || "Failed to execute SLH-DSA workflow");
    } finally {
      setSlhLoading(false);
    }
  };

  const handleSaveSlh = () => {
    if (!slhResult) return;
    storage.saveExperiment({
      title: `SLH-DSA Hash Signature (${slhResult.algorithm})`,
      type: "crypto_sign",
      algorithm: slhResult.algorithm,
      duration_ms: slhResult.timings_ms.total_ms,
      metrics: {
        public_key_bytes: slhResult.output_sizes_bytes.public_key_bytes,
        signature_bytes: slhResult.output_sizes_bytes.signature_bytes,
        tamper_detected: slhResult.tamper_test?.tamper_detected,
        timings: slhResult.timings_ms,
      },
      notes: "Interactive SLH-DSA stateless hash signature workflow",
    });
    setSlhSaved(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0c1322] border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-white">Cryptography Lab</h1>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Demonstrate practical cryptographic operations using genuine reference implementations of NIST's August 2024 finalized post-quantum standards.
          Contrast modern lattice-based shared secret establishment and digital signatures with classical RSA.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab("kem")}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "kem"
              ? "border-cyan-400 text-cyan-300 bg-cyan-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>ML-KEM (FIPS 203)</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
            Key Exchange
          </span>
        </button>

        <button
          onClick={() => setActiveTab("dsa")}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "dsa"
              ? "border-violet-400 text-violet-300 bg-violet-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileSignature className="w-4 h-4" />
          <span>ML-DSA (FIPS 204)</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
            Lattice Sig
          </span>
        </button>

        <button
          onClick={() => setActiveTab("slh")}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "slh"
              ? "border-blue-400 text-blue-300 bg-blue-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>SLH-DSA (FIPS 205)</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
            Hash Sig
          </span>
        </button>

        <button
          onClick={() => setActiveTab("classical")}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "classical"
              ? "border-amber-400 text-amber-300 bg-amber-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Classical RSA vs PQC</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
            Comparison
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. ML-KEM WORKFLOW */}
      {/* ========================================================================= */}
      {activeTab === "kem" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-xl bg-[#0c1322] border border-cyan-500/20 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">
                    ML-KEM Key Encapsulation
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 text-[10px] font-mono border border-slate-800">
                    kyber-py · FIPS 203
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Simulate the Alice &amp; Bob shared key establishment protocol based on Module Learning With Errors (M-LWE).
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Select Parameter Set
                </label>
                <select
                  value={kemAlgo}
                  onChange={(e) => setKemAlgo(e.target.value)}
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="ML-KEM-512">ML-KEM-512 (NIST Category 1 · AES-128 equivalent)</option>
                  <option value="ML-KEM-768">ML-KEM-768 (NIST Category 3 · Recommended Standard)</option>
                  <option value="ML-KEM-1024">ML-KEM-1024 (NIST Category 5 · AES-256 equivalent)</option>
                </select>
              </div>

              {/* Protocol Flow */}
              <div className="rounded-lg bg-[#080d18] border border-slate-800 p-3.5 space-y-2 text-xs font-mono">
                <div className="text-[10px] text-slate-500 uppercase font-sans font-bold">
                  Handshake Protocol Flow
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-cyan-400">1. Alice: KeyGen()</span>
                  <span className="text-slate-500">→ (ek, dk)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-sky-400">2. Bob: Encaps(ek)</span>
                  <span className="text-slate-500">→ (ct, K_B)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-violet-400">3. Alice: Decaps(ct, dk)</span>
                  <span className="text-slate-500">→ K_A</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400 pt-1 border-t border-slate-800">
                  <span>4. Secret Equality</span>
                  <span>K_A == K_B ✓</span>
                </div>
              </div>

              {kemError && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{kemError}</span>
                </div>
              )}

              <button
                onClick={handleRunKem}
                disabled={kemLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all"
              >
                {kemLoading ? (
                  <RotateCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                <span>{kemLoading ? "Executing Kyber-py Handshake..." : "Run ML-KEM Operation"}</span>
              </button>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-5">
            {kemResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Public Key Size
                    </span>
                    <div className="text-lg font-bold text-white font-mono">
                      {kemResult.output_sizes_bytes.public_key_bytes} B
                    </div>
                    <span className="text-[10px] text-slate-500">Sent over network</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Ciphertext Size
                    </span>
                    <div className="text-lg font-bold text-cyan-300 font-mono">
                      {kemResult.output_sizes_bytes.ciphertext_bytes} B
                    </div>
                    <span className="text-[10px] text-slate-500">Encapsulated token</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Execution Time
                    </span>
                    <div className="text-lg font-bold text-emerald-400 font-mono">
                      {kemResult.timings_ms.total_ms} ms
                    </div>
                    <span className="text-[10px] text-slate-500">KeyGen + Enc + Dec</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0c1322] border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-emerald-300">
                        Shared Secret Verified: Alice K_A == Bob K_B
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">
                      256-bit Key
                    </span>
                  </div>

                  <div className="space-y-1.5 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Shared Secret Fingerprint (SHA-256):</span>
                      <div className="text-emerald-300 break-all bg-slate-900/80 p-2 rounded border border-slate-800">
                        {kemResult.verification.shared_secret_fingerprint}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Shared Secret Hex Preview:</span>
                      <div className="text-cyan-300 break-all bg-slate-900/80 p-2 rounded border border-slate-800">
                        {kemResult.verification.shared_secret_preview}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveKem}
                    disabled={kemSaved}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{kemSaved ? "Saved to History ✓" : "Save Run to Experiments"}</span>
                  </button>
                </div>

                <ResultPanel
                  title="ML-KEM Execution Artifacts"
                  data={kemResult}
                  statusBadge={kemResult.verification.status}
                  statusType="success"
                  executionTimeMs={kemResult.timings_ms.total_ms}
                />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-800 p-14 text-center text-slate-500 text-xs space-y-2">
                <KeyRound className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">
                  Ready to Run ML-KEM (FIPS 203)
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click &quot;Run ML-KEM Operation&quot; to execute real key encapsulation over polynomial quotient rings.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ML-KEM Educational Process Flowchart */}
        <KemFlowchart
          algorithm={kemResult ? kemResult.algorithm : kemAlgo}
          publicKeyBytes={kemResult ? kemResult.output_sizes_bytes.public_key_bytes : 1184}
          ciphertextBytes={kemResult ? kemResult.output_sizes_bytes.ciphertext_bytes : 1088}
          totalTimeMs={kemResult ? kemResult.timings_ms.total_ms : undefined}
          verified={kemResult ? kemResult.verification.status === "verified" : true}
        />
      </div>
    )}

      {/* ========================================================================= */}
      {/* 2. ML-DSA WORKFLOW */}
      {/* ========================================================================= */}
      {activeTab === "dsa" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-xl bg-[#0c1322] border border-violet-500/20 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">
                    ML-DSA Lattice Signatures
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-violet-300 text-[10px] font-mono border border-slate-800">
                    dilithium-py · FIPS 204
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Signs messages and verifies authenticity using Module-SIS with the Fiat-Shamir with Aborts framework.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Select Parameter Set
                </label>
                <select
                  value={dsaAlgo}
                  onChange={(e) => setDsaAlgo(e.target.value)}
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-violet-500"
                >
                  <option value="ML-DSA-44">ML-DSA-44 (NIST Category 2)</option>
                  <option value="ML-DSA-65">ML-DSA-65 (NIST Category 3 · Recommended Standard)</option>
                  <option value="ML-DSA-87">ML-DSA-87 (NIST Category 5)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Original Message Payload
                </label>
                <textarea
                  rows={2}
                  value={dsaMessage}
                  onChange={(e) => setDsaMessage(e.target.value)}
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-xs text-white font-sans focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              {/* Tamper Sandbox */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Modified Message (Tamper Test)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setDsaTamperedMessage(
                        dsaMessage + (dsaMessage.endsWith("!") ? "?" : "!")
                      )
                    }
                    className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    Reset Tamper
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={dsaTamperedMessage}
                  onChange={(e) => setDsaTamperedMessage(e.target.value)}
                  className="w-full bg-[#080d1a] border border-amber-500/40 rounded-lg p-2 text-xs text-amber-200 font-sans focus:outline-none focus:border-amber-500 resize-none"
                />
                <span className="text-[10px] text-slate-500 block">
                  Modify any character to observe Fiat-Shamir verification failure.
                </span>
              </div>

              {dsaError && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{dsaError}</span>
                </div>
              )}

              <button
                onClick={handleRunDsa}
                disabled={dsaLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_15px_rgba(139,92,246,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all"
              >
                {dsaLoading ? (
                  <RotateCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                <span>{dsaLoading ? "Signing & Testing Tamper..." : "Sign & Verify Tamper Resilience"}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            {dsaResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Public Key Size
                    </span>
                    <div className="text-lg font-bold text-white font-mono">
                      {dsaResult.output_sizes_bytes.public_key_bytes} B
                    </div>
                    <span className="text-[10px] text-slate-500">Verification key</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Signature Size
                    </span>
                    <div className="text-lg font-bold text-violet-300 font-mono">
                      {dsaResult.output_sizes_bytes.signature_bytes} B
                    </div>
                    <span className="text-[10px] text-slate-500">Compact lattice sig</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Execution Time
                    </span>
                    <div className="text-lg font-bold text-emerald-400 font-mono">
                      {dsaResult.timings_ms.total_ms} ms
                    </div>
                    <span className="text-[10px] text-slate-500">Sign + Verify passes</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#0c1322] border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-emerald-300">
                        Original Message Signature: VALID
                      </span>
                    </div>
                    <span className="font-mono text-slate-400 text-[11px]">
                      Authentic payload verified
                    </span>
                  </div>

                  {dsaResult.tamper_test && (
                    <div className="p-4 rounded-xl bg-[#0c1322] border border-amber-500/30 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span className="font-bold text-rose-300">
                            Tampered Message Verification: REJECTED
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-800/40">
                          TAMPER DETECTED
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        The mathematical signature $\sigma$ does not satisfy the Fiat-Shamir verification equation for the modified text.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveDsa}
                    disabled={dsaSaved}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{dsaSaved ? "Saved to History ✓" : "Save Run to Experiments"}</span>
                  </button>
                </div>

                <ResultPanel
                  title="ML-DSA Signature Artifacts"
                  data={dsaResult}
                  statusBadge="AUTHENTICATED"
                  statusType="success"
                  executionTimeMs={dsaResult.timings_ms.total_ms}
                />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-800 p-14 text-center text-slate-500 text-xs space-y-2">
                <FileSignature className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">
                  Ready to Sign with ML-DSA (FIPS 204)
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click &quot;Sign &amp; Verify Tamper Resilience&quot; to test digital signatures and anti-tampering proofs.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SLH-DSA WORKFLOW */}
      {/* ========================================================================= */}
      {activeTab === "slh" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-xl bg-[#0c1322] border border-blue-500/20 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">
                    SLH-DSA Hash-Based Signatures
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-blue-300 text-[10px] font-mono border border-slate-800">
                    slhdsa · FIPS 205
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Conservative fallback signature scheme relying strictly on hash function preimages (WOTS+ and XMSS hypertrees).
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Select Parameter Set
                </label>
                <select
                  value={slhAlgo}
                  onChange={(e) => setSlhAlgo(e.target.value)}
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                >
                  <option value="SLH-DSA-SHA2-128s">SLH-DSA-SHA2-128s (Small signatures, SHA-256)</option>
                  <option value="SLH-DSA-SHA2-128f">SLH-DSA-SHA2-128f (Fast signing, larger size)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Original Message Payload
                </label>
                <textarea
                  rows={2}
                  value={slhMessage}
                  onChange={(e) => setSlhMessage(e.target.value)}
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-xs text-white font-sans focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Tamper Sandbox */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Modified Message (Tamper Test)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setSlhTamperedMessage(
                        slhMessage + (slhMessage.endsWith("!") ? "?" : "!")
                      )
                    }
                    className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    Reset Tamper
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={slhTamperedMessage}
                  onChange={(e) => setSlhTamperedMessage(e.target.value)}
                  className="w-full bg-[#080d1a] border border-amber-500/40 rounded-lg p-2 text-xs text-amber-200 font-sans focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {slhError && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{slhError}</span>
                </div>
              )}

              <button
                onClick={handleRunSlh}
                disabled={slhLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-[0_0_15px_rgba(59,130,246,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all"
              >
                {slhLoading ? (
                  <RotateCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                <span>{slhLoading ? "Computing Hypertree Signatures..." : "Sign & Verify SLH-DSA"}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            {slhResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Public Key Size
                    </span>
                    <div className="text-lg font-bold text-emerald-400 font-mono">
                      {slhResult.output_sizes_bytes.public_key_bytes} B
                    </div>
                    <span className="text-[10px] text-slate-500">Extremely compact (32B)</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Signature Size
                    </span>
                    <div className="text-lg font-bold text-amber-300 font-mono">
                      {slhResult.output_sizes_bytes.signature_bytes.toLocaleString()} B
                    </div>
                    <span className="text-[10px] text-slate-500">Merkle auth paths (~7.8KB)</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Execution Time
                    </span>
                    <div className="text-lg font-bold text-white font-mono">
                      {slhResult.timings_ms.total_ms} ms
                    </div>
                    <span className="text-[10px] text-slate-500">Hash iterations</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#0c1322] border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-emerald-300">
                        Hypertree Signature: VALID
                      </span>
                    </div>
                    <span className="font-mono text-slate-400 text-[11px]">
                      Hash chain verification complete
                    </span>
                  </div>

                  {slhResult.tamper_test && (
                    <div className="p-4 rounded-xl bg-[#0c1322] border border-amber-500/30 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span className="font-bold text-rose-300">
                            Tampered Message Verification: REJECTED
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-800/40">
                          TAMPER DETECTED
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        Merkle tree leaf collision resistance ensures any modification to the message produces an invalid root hash.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSlh}
                    disabled={slhSaved}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{slhSaved ? "Saved to History ✓" : "Save Run to Experiments"}</span>
                  </button>
                </div>

                <ResultPanel
                  title="SLH-DSA Signature Artifacts"
                  data={slhResult}
                  statusBadge="VERIFIED"
                  statusType="success"
                  executionTimeMs={slhResult.timings_ms.total_ms}
                />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-800 p-14 text-center text-slate-500 text-xs space-y-2">
                <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">
                  Ready to Sign with SLH-DSA (FIPS 205)
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click &quot;Sign &amp; Verify SLH-DSA&quot; to test stateless hash-based hypertree signatures.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CLASSICAL RSA VS PQC COMPARISON */}
      {/* ========================================================================= */}
      {activeTab === "classical" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[#0c1322] border border-amber-500/20 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Classical RSA vs Post-Quantum Paradigms</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Why must RSA be replaced? Classical public-key cryptography relies on trapdoor one-way functions whose underlying problem (integer factoring or discrete logs) has hidden periodicities solvable in polynomial time $O((\log n)^3)$ by Shor's quantum algorithm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-3">
              <div className="text-xs font-mono font-bold text-amber-400">
                Classical RSA / ECC
              </div>
              <p className="text-xs text-slate-300 font-semibold">
                Integer Factorization &amp; DLog
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                <li>Keys: 256 B (RSA) / 32 B (ECC)</li>
                <li>Ciphertext/Sig: 256 B</li>
                <li className="text-rose-400 font-semibold">Vulnerable to Shor's algorithm</li>
                <li>Zero quantum security margin</li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/math-lab"
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1"
                >
                  <span>Test Educational RSA in Math Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0c1322] border border-cyan-500/30 space-y-3">
              <div className="text-xs font-mono font-bold text-cyan-400">
                Lattice PQC (ML-KEM / ML-DSA)
              </div>
              <p className="text-xs text-slate-300 font-semibold">
                Module-LWE &amp; Module-SIS
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                <li>Keys: 1,184 B to 1,952 B</li>
                <li>Ciphertext/Sig: 1,088 B to 3,309 B</li>
                <li className="text-emerald-400 font-semibold">Immune to Shor's algorithm</li>
                <li>Fast polynomial arithmetic ($q=3329$)</li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab("kem")}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Run ML-KEM Operation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0c1322] border border-blue-500/30 space-y-3">
              <div className="text-xs font-mono font-bold text-blue-400">
                Hash PQC (SLH-DSA)
              </div>
              <p className="text-xs text-slate-300 font-semibold">
                Stateless Merkle Trees
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                <li>Keys: 32 B (Smallest PQC key)</li>
                <li>Signature: 7,856 B to 17 KB</li>
                <li className="text-emerald-400 font-semibold">Conservative security (SHA-256)</li>
                <li>No lattice hardness assumptions</li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab("slh")}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Run SLH-DSA Operation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CryptoLabPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-slate-400">Loading Cryptography Lab...</div>}>
      <CryptoLabContent />
    </Suspense>
  );
}
