"use client";

import React, { useState } from "react";
import {
  Binary,
  Grid,
  Hash,
  Key,
  Layers,
  Play,
  RotateCw,
  RotateCcw,
  Info,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/api";
import ResultPanel from "@/components/ResultPanel";
import LatticeVisualizer from "@/components/LatticeVisualizer";
import RsaFlowchart from "@/components/RsaFlowchart";

export default function MathLabPage() {
  const [activeTab, setActiveTab] = useState<"modular" | "rsa" | "matrix" | "lattice" | "hash">("modular");

  // ==========================================
  // MODULE 1: MODULAR ARITHMETIC STATE
  // ==========================================
  const [modOp, setModOp] = useState<"add" | "sub" | "mul" | "congruence" | "exp" | "gcd" | "inv" | "prime">("add");
  const [modA, setModA] = useState<number>(17);
  const [modB, setModB] = useState<number>(12);
  const [modQ, setModQ] = useState<number>(7);
  const [primeN, setPrimeN] = useState<number>(61);
  const [modLoading, setModLoading] = useState<boolean>(false);
  const [modResult, setModResult] = useState<any>(null);
  const [modError, setModError] = useState<string | null>(null);

  const resetModule1 = () => {
    setModOp("add");
    setModA(17);
    setModB(12);
    setModQ(7);
    setPrimeN(61);
    setModResult(null);
    setModError(null);
  };

  const applyModPreset = (preset: "add_example" | "congruence_example" | "exp_example" | "sub_example" | "inv_example" | "gcd_example" | "prime_example") => {
    setModError(null);
    if (preset === "add_example") {
      setModOp("add");
      setModA(17);
      setModB(12);
      setModQ(7);
    } else if (preset === "congruence_example") {
      setModOp("congruence");
      setModA(17);
      setModQ(5);
    } else if (preset === "exp_example") {
      setModOp("exp");
      setModA(5);
      setModB(3);
      setModQ(7);
    } else if (preset === "sub_example") {
      setModOp("sub");
      setModA(17);
      setModB(12);
      setModQ(7);
    } else if (preset === "inv_example") {
      setModOp("inv");
      setModA(3);
      setModQ(7);
    } else if (preset === "gcd_example") {
      setModOp("gcd");
      setModA(17);
      setModB(7);
    } else if (preset === "prime_example") {
      setModOp("prime");
      setPrimeN(61);
    }
  };

  const handleComputeModular = async () => {
    setModLoading(true);
    setModError(null);
    try {
      let res;
      if (modOp === "add") res = await api.modularAdd(modA, modB, modQ);
      else if (modOp === "sub") res = await api.modularSub(modA, modB, modQ);
      else if (modOp === "mul") res = await api.modularMul(modA, modB, modQ);
      else if (modOp === "congruence") res = await api.congruence(modA, modQ);
      else if (modOp === "exp") res = await api.modularExp(modA, modB, modQ);
      else if (modOp === "gcd") res = await api.gcd(modA, modB);
      else if (modOp === "inv") res = await api.modularInv(modA, modQ);
      else if (modOp === "prime") res = await api.primality(primeN);
      setModResult(res);
    } catch (err: any) {
      setModError(err.message || "Calculation failed");
    } finally {
      setModLoading(false);
    }
  };

  // ==========================================
  // MODULE 2: EDUCATIONAL RSA STATE
  // ==========================================
  const [rsaP, setRsaP] = useState<number>(61);
  const [rsaQ, setRsaQ] = useState<number>(53);
  const [rsaM, setRsaM] = useState<number>(65);
  const [rsaE, setRsaE] = useState<number>(17);
  const [rsaLoading, setRsaLoading] = useState<boolean>(false);
  const [rsaResult, setRsaResult] = useState<any>(null);
  const [rsaError, setRsaError] = useState<string | null>(null);

  const resetModule2 = () => {
    setRsaP(61);
    setRsaQ(53);
    setRsaM(65);
    setRsaE(17);
    setRsaResult(null);
    setRsaError(null);
  };

  const handleComputeRsa = async () => {
    setRsaLoading(true);
    setRsaError(null);
    try {
      const res = await api.rsaToy(rsaP, rsaQ, rsaM, rsaE);
      setRsaResult(res);
    } catch (err: any) {
      setRsaError(err.message || "RSA computation failed");
    } finally {
      setRsaLoading(false);
    }
  };

  // ==========================================
  // MODULE 3: MATRIX & VECTOR OPERATIONS STATE
  // ==========================================
  const [matrixOp, setMatrixOp] = useState<"add" | "mul" | "vector" | "reduce">("add");
  const [matrixA, setMatrixA] = useState<number[][]>([[1, 2], [3, 4]]);
  const [matrixB, setMatrixB] = useState<number[][]>([[5, 6], [7, 8]]);
  const [vectorV, setVectorV] = useState<number[]>([1, 2]);
  const [matrixQ, setMatrixQ] = useState<number>(7);
  const [matrixLoading, setMatrixLoading] = useState<boolean>(false);
  const [matrixResult, setMatrixResult] = useState<any>(null);
  const [matrixError, setMatrixError] = useState<string | null>(null);

  const applyMatrixPreset = (type: "2x2" | "2x3_mul" | "incompatible") => {
    setMatrixError(null);
    if (type === "2x2") {
      setMatrixOp("add");
      setMatrixA([[1, 2], [3, 4]]);
      setMatrixB([[5, 6], [7, 8]]);
      setMatrixQ(7);
    } else if (type === "2x3_mul") {
      setMatrixOp("mul");
      setMatrixA([[1, 2, 3], [4, 5, 6]]);
      setMatrixB([[7, 8], [9, 1], [2, 3]]);
      setMatrixQ(7);
    } else if (type === "incompatible") {
      setMatrixOp("mul");
      setMatrixA([[1, 2, 3], [4, 5, 6]]); // 2x3
      setMatrixB([[1, 2], [3, 4]]);        // 2x2 -> Incompatible!
      setMatrixQ(7);
    }
  };

  const handleComputeMatrix = async () => {
    setMatrixLoading(true);
    setMatrixError(null);
    try {
      let res;
      if (matrixOp === "add") res = await api.matrixAdd(matrixA, matrixB, matrixQ);
      else if (matrixOp === "mul") res = await api.matrixMul(matrixA, matrixB, matrixQ);
      else if (matrixOp === "vector") res = await api.matrixVector(matrixA, vectorV, matrixQ);
      else if (matrixOp === "reduce") res = await api.matrixReduce(matrixA, matrixQ);
      setMatrixResult(res);
    } catch (err: any) {
      setMatrixError(err.message || "Matrix operation failed");
    } finally {
      setMatrixLoading(false);
    }
  };

  // ==========================================
  // MODULE 4: LATTICE NOISY EQUATION (LWE) STATE
  // ==========================================
  const [latA00, setLatA00] = useState<number>(2);
  const [latA01, setLatA01] = useState<number>(1);
  const [latA10, setLatA10] = useState<number>(1);
  const [latA11, setLatA11] = useState<number>(3);
  const [latS0, setLatS0] = useState<number>(1);
  const [latS1, setLatS1] = useState<number>(2);
  const [latE0, setLatE0] = useState<number>(1);
  const [latE1, setLatE1] = useState<number>(0);
  const [latQ, setLatQ] = useState<number>(7);
  const [latLoading, setLatLoading] = useState<boolean>(false);
  const [latResult, setLatResult] = useState<any>(null);
  const [latError, setLatError] = useState<string | null>(null);

  const resetModule4 = () => {
    setLatA00(2);
    setLatA01(1);
    setLatA10(1);
    setLatA11(3);
    setLatS0(1);
    setLatS1(2);
    setLatE0(1);
    setLatE1(0);
    setLatQ(7);
    setLatResult(null);
    setLatError(null);
  };

  const handleComputeLattice = async () => {
    setLatLoading(true);
    setLatError(null);
    try {
      const mat = [
        [latA00, latA01],
        [latA10, latA11],
      ];
      const s = [latS0, latS1];
      const e = [latE0, latE1];
      const res = await api.noisyEquation(mat, s, e, latQ);
      setLatResult(res);
    } catch (err: any) {
      setLatError(err.message || "LWE evaluation failed");
    } finally {
      setLatLoading(false);
    }
  };

  // ==========================================
  // MODULE 5: HASH DEMONSTRATION STATE
  // ==========================================
  const [hashInput1, setHashInput1] = useState<string>("QuantumShield Lab FIPS 203");
  const [hashInput2, setHashInput2] = useState<string>("Quantumshield Lab FIPS 203");
  const [hashLoading, setHashLoading] = useState<boolean>(false);
  const [hashResult, setHashResult] = useState<any>(null);
  const [hashError, setHashError] = useState<string | null>(null);

  const resetModule5 = () => {
    setHashInput1("QuantumShield Lab FIPS 203");
    setHashInput2("Quantumshield Lab FIPS 203");
    setHashResult(null);
    setHashError(null);
  };

  const handleComputeHash = async () => {
    setHashLoading(true);
    setHashError(null);
    try {
      const res = await api.hashAvalanche(hashInput1, hashInput2);
      setHashResult(res);
    } catch (err: any) {
      setHashError(err.message || "Hash analysis failed");
    } finally {
      setHashLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Educational Header */}
      <div className="p-6 rounded-2xl bg-[#0c1322] border border-slate-800 space-y-2">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Binary className="w-5 h-5 text-cyan-400" />
          <span>Mathematics Lab</span>
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Explore the discrete mathematical principles powering modern cryptography.
          Compute modular congruences, derive Extended Euclidean inverses, simulate textbook RSA, calculate matrix products over ℤ_q, analyze noisy LWE lattice geometry, and observe SHA-256 bit avalanche.
        </p>
      </div>

      {/* 5 Module Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab("modular")}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "modular"
              ? "border-cyan-400 text-cyan-300 bg-cyan-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Binary className="w-4 h-4" />
          <span>1. Modular Arithmetic</span>
        </button>

        <button
          onClick={() => setActiveTab("rsa")}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "rsa"
              ? "border-amber-400 text-amber-300 bg-amber-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Key className="w-4 h-4" />
          <span>2. Educational RSA</span>
        </button>

        <button
          onClick={() => setActiveTab("matrix")}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "matrix"
              ? "border-emerald-400 text-emerald-300 bg-emerald-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3. Matrix &amp; Vector Ops</span>
        </button>

        <button
          onClick={() => setActiveTab("lattice")}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "lattice"
              ? "border-violet-400 text-violet-300 bg-violet-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>4. Lattices &amp; Noise (LWE)</span>
        </button>

        <button
          onClick={() => setActiveTab("hash")}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "hash"
              ? "border-blue-400 text-blue-300 bg-blue-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>5. Hash Demonstration</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODULE 1: MODULAR ARITHMETIC & NUMBER THEORY */}
      {/* ========================================================================= */}
      {activeTab === "modular" && (
        <div className="space-y-6">
          {/* Quick Presets Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#0c1322] border border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-semibold mr-1">Examples from Course Guide:</span>
              <button
                onClick={() => applyModPreset("add_example")}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
              >
                (17 + 12) mod 7 = 1
              </button>
              <button
                onClick={() => applyModPreset("congruence_example")}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
              >
                17 mod 5 = 2
              </button>
              <button
                onClick={() => applyModPreset("exp_example")}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
              >
                5³ mod 7 = 6
              </button>
              <button
                onClick={() => applyModPreset("sub_example")}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
              >
                (17 − 12) mod 7 = 5
              </button>
              <button
                onClick={() => applyModPreset("inv_example")}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
              >
                3⁻¹ mod 7 = 5
              </button>
              <button
                onClick={() => applyModPreset("prime_example")}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
              >
                Primality: 61
              </button>
            </div>

            <button
              onClick={resetModule1}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-xl bg-[#0c1322] border border-cyan-500/20 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Select Operation
                  </h3>
                  <p className="text-xs text-slate-400">
                    Calculates dynamically and reveals the division algorithm, congruences, or Extended Euclidean traces.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                  <button
                    onClick={() => setModOp("add")}
                    className={`py-1.5 px-2 rounded border font-semibold transition-colors ${
                      modOp === "add" ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    (a + b) mod q
                  </button>
                  <button
                    onClick={() => setModOp("sub")}
                    className={`py-1.5 px-2 rounded border font-semibold transition-colors ${
                      modOp === "sub" ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    (a − b) mod q
                  </button>
                  <button
                    onClick={() => setModOp("mul")}
                    className={`py-1.5 px-2 rounded border font-semibold transition-colors ${
                      modOp === "mul" ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    (a × b) mod q
                  </button>
                  <button
                    onClick={() => setModOp("exp")}
                    className={`py-1.5 px-2 rounded border font-semibold transition-colors ${
                      modOp === "exp" ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    aᵇ mod q
                  </button>
                  <button
                    onClick={() => setModOp("congruence")}
                    className={`py-1.5 px-2 rounded border font-semibold transition-colors ${
                      modOp === "congruence" ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    a mod q
                  </button>
                  <button
                    onClick={() => setModOp("gcd")}
                    className={`py-1.5 px-2 rounded border font-semibold transition-colors ${
                      modOp === "gcd" ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    gcd(a, b)
                  </button>
                  <button
                    onClick={() => setModOp("inv")}
                    className={`py-1.5 px-2 rounded border font-semibold transition-colors ${
                      modOp === "inv" ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    a⁻¹ mod q
                  </button>
                  <button
                    onClick={() => setModOp("prime")}
                    className={`py-1.5 px-2 rounded border font-semibold transition-colors ${
                      modOp === "prime" ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    Prime Test
                  </button>
                </div>

                {/* Input Fields */}
                <div className="pt-2 space-y-3">
                  {modOp === "prime" ? (
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Integer to Test (n)
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={primeN}
                        onChange={(e) => setPrimeN(parseInt(e.target.value) || 1)}
                        className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          {modOp === "exp" ? "Base (a)" : "Operand a"}
                        </label>
                        <input
                          type="number"
                          value={modA}
                          onChange={(e) => setModA(parseInt(e.target.value) || 0)}
                          className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      {modOp !== "congruence" && modOp !== "inv" && (
                        <div>
                          <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                            {modOp === "exp" ? "Exponent (b)" : "Operand b"}
                          </label>
                          <input
                            type="number"
                            value={modB}
                            onChange={(e) => setModB(parseInt(e.target.value) || 0)}
                            className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      )}

                      {modOp !== "gcd" && (
                        <div className={modOp === "congruence" || modOp === "inv" ? "col-span-1" : "col-span-2"}>
                          <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                            Modulus (q)
                          </label>
                          <input
                            type="number"
                            min={2}
                            value={modQ}
                            onChange={(e) => setModQ(parseInt(e.target.value) || 2)}
                            className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {modError && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{modError}</span>
                  </div>
                )}

                <button
                  onClick={handleComputeModular}
                  disabled={modLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all"
                >
                  {modLoading ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>Compute Expression</span>
                </button>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-7">
              {modResult ? (
                <div className="space-y-4">
                  {/* Primary Result Banner */}
                  <div className="p-5 rounded-xl bg-[#0c1322] border border-cyan-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Calculated Result
                      </span>
                      <div className="text-3xl font-extrabold text-cyan-300 font-mono mt-1">
                        {modResult.result !== undefined
                          ? modResult.result
                          : modResult.gcd !== undefined
                          ? `gcd = ${modResult.gcd}`
                          : modResult.is_prime !== undefined
                          ? (modResult.is_prime ? "PRIME" : "COMPOSITE")
                          : modResult.inverse ?? "No inverse"}
                      </div>
                    </div>
                    {modResult.formula && (
                      <div className="text-right">
                        <span className="text-xs font-mono text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                          {modResult.formula}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Mathematical Step Explanation */}
                  <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 text-xs text-slate-300 space-y-2">
                    <span className="font-semibold text-cyan-400 uppercase text-[10px] tracking-wider block">
                      Mathematical Step Explanation
                    </span>
                    <p className="leading-relaxed">{modResult.explanation}</p>
                    {modResult.bezout_identity && (
                      <p className="font-mono text-cyan-300 pt-1">
                        Bézout Identity: {modResult.bezout_identity}
                      </p>
                    )}
                  </div>

                  {/* Step Table for Exponentiation or Extended Euclidean */}
                  {modResult.steps && modResult.steps.length > 0 && (
                    <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 space-y-2 text-xs">
                      <span className="font-semibold text-slate-200 uppercase text-[10px] tracking-wider block">
                        Algorithm Intermediate Trace ({modResult.steps.length} steps)
                      </span>
                      <div className="overflow-x-auto max-h-60">
                        <table className="w-full text-left font-mono text-[11px]">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                              {Object.keys(modResult.steps[0]).map((k) => (
                                <th key={k} className="p-1.5 capitalize">{k}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {modResult.steps.map((st: any, idx: number) => (
                              <tr key={idx} className="border-b border-slate-800/40 text-slate-300">
                                {Object.values(st).map((v: any, cIdx: number) => (
                                  <td key={cIdx} className="p-1.5">{String(v)}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <ResultPanel title="Evaluation Data" data={modResult} />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center text-slate-500 text-xs space-y-2">
                  <Binary className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>Select an operation or click a preset above, then click "Compute Expression".</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 2: EDUCATIONAL TEXTBOOK RSA */}
      {/* ========================================================================= */}
      {activeTab === "rsa" && (
        <div className="space-y-6">
          {/* Disclaimer Header */}
          <div className="rounded-xl bg-amber-950/30 border border-amber-500/30 p-4 flex items-start gap-3 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white uppercase tracking-wider mr-1">
                Educational Textbook Model Disclaimer:
              </span>
              This module demonstrates small-number RSA for teaching number theory (Euler's totient, Extended Euclidean inverse, and trapdoor functions).
              It is NOT secure production encryption. Real RSA requires 2048-bit primes and padding schemes (OAEP/PSS).
              Furthermore, a fault-tolerant quantum computer running Shor's algorithm can factor n in polynomial time.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-xl bg-[#0c1322] border border-amber-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    RSA Key &amp; Message Parameters
                  </h3>
                  <button
                    onClick={resetModule2}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Prime Number p
                    </label>
                    <input
                      type="number"
                      value={rsaP}
                      onChange={(e) => setRsaP(parseInt(e.target.value) || 2)}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-slate-500">e.g., 61, 47, 17</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Prime Number q
                    </label>
                    <input
                      type="number"
                      value={rsaQ}
                      onChange={(e) => setRsaQ(parseInt(e.target.value) || 2)}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-slate-500">e.g., 53, 59, 19</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Public Exponent e
                    </label>
                    <input
                      type="number"
                      value={rsaE}
                      onChange={(e) => setRsaE(parseInt(e.target.value) || 17)}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-slate-500">coprime to φ(n)</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Plaintext Message m
                    </label>
                    <input
                      type="number"
                      value={rsaM}
                      onChange={(e) => setRsaM(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-slate-500">must be &lt; n (p×q)</span>
                  </div>
                </div>

                {rsaError && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{rsaError}</span>
                  </div>
                )}

                <button
                  onClick={handleComputeRsa}
                  disabled={rsaLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all"
                >
                  {rsaLoading ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>Simulate RSA Keygen, Encrypt &amp; Decrypt</span>
                </button>
              </div>
            </div>

            {/* Right Column: Keygen & Roundtrip Result */}
            <div className="lg:col-span-7">
              {rsaResult ? (
                <div className="space-y-4">
                  {/* Summary Metric Strip */}
                  <div className="p-5 rounded-xl bg-[#0c1322] border border-amber-500/30">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                      <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400">Modulus n = p×q</div>
                        <div className="text-base font-bold text-white mt-1">{rsaResult.modulus_n}</div>
                      </div>
                      <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400">Euler's φ(n)</div>
                        <div className="text-base font-bold text-white mt-1">{rsaResult.totient_phi}</div>
                      </div>
                      <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400">Ciphertext c = mᵉ</div>
                        <div className="text-base font-bold text-amber-400 mt-1">{rsaResult.ciphertext_c}</div>
                      </div>
                      <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400">Recovered m' = cᵈ</div>
                        <div className="text-base font-bold text-emerald-400 mt-1">{rsaResult.recovered_m}</div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Keys:</span>
                        <span className="font-mono text-cyan-300">Public: (e={rsaResult.public_key.e}, n={rsaResult.public_key.n})</span>
                        <span className="font-mono text-violet-300">Private: (d={rsaResult.private_key.d})</span>
                      </div>
                      <span className="font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Roundtrip Verified
                      </span>
                    </div>
                  </div>

                  {/* Step-by-Step Narrative */}
                  <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 space-y-3 text-xs">
                    <span className="font-bold uppercase tracking-wider text-slate-200 text-[11px] block">
                      Textbook RSA Step-by-Step Derivation
                    </span>
                    <div className="space-y-2">
                      {rsaResult.steps.map((st: any) => (
                        <div key={st.step_number} className="p-2.5 rounded bg-slate-900/70 border border-slate-800/60">
                          <div className="flex items-center justify-between font-semibold text-slate-200 mb-1">
                            <span>Step {st.step_number}: {st.title}</span>
                            <span className="font-mono text-cyan-400">{st.formula}</span>
                          </div>
                          <p className="text-slate-400">{st.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <ResultPanel title="Educational RSA Output Data" data={rsaResult} />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center text-slate-500 text-xs space-y-2">
                  <Key className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>Click "Simulate RSA Keygen, Encrypt &amp; Decrypt" to observe the full trapdoor handshake.</p>
                </div>
              )}
            </div>
          </div>

          {/* Educational Process Flowchart */}
          <RsaFlowchart
            p={rsaResult ? rsaResult.primes.p : rsaP}
            q={rsaResult ? rsaResult.primes.q : rsaQ}
            n={rsaResult ? rsaResult.modulus_n : rsaP * rsaQ}
            phi={rsaResult ? rsaResult.totient_phi : (rsaP - 1) * (rsaQ - 1)}
            e={rsaResult ? rsaResult.public_key.e : rsaE}
            d={rsaResult ? rsaResult.private_key.d : undefined}
            m={rsaResult ? rsaResult.plaintext_m : rsaM}
            c={rsaResult ? rsaResult.ciphertext_c : undefined}
            recoveredM={rsaResult ? rsaResult.recovered_m : undefined}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 3: MATRIX AND VECTOR OPERATIONS */}
      {/* ========================================================================= */}
      {activeTab === "matrix" && (
        <div className="space-y-6">
          {/* Presets */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#0c1322] border border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-semibold mr-1">Matrix Presets:</span>
              <button
                onClick={() => applyMatrixPreset("2x2")}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 cursor-pointer"
              >
                2×2 Matrix Addition
              </button>
              <button
                onClick={() => applyMatrixPreset("2x3_mul")}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 cursor-pointer"
              >
                (2×3) × (3×2) Multiplication
              </button>
              <button
                onClick={() => applyMatrixPreset("incompatible")}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-800/40 cursor-pointer"
              >
                Test Incompatible Dimensions
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-xl bg-[#0c1322] border border-emerald-500/20 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Matrix Operation Configuration
                  </h3>
                  <p className="text-xs text-slate-400">
                    Supports addition, multiplication, matrix-vector product, and modular reduction.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setMatrixOp("add")}
                    className={`py-1.5 px-2 rounded border font-semibold transition-colors ${
                      matrixOp === "add" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    A + B (mod q)
                  </button>
                  <button
                    onClick={() => setMatrixOp("mul")}
                    className={`py-1.5 px-2 rounded border font-semibold transition-colors ${
                      matrixOp === "mul" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    A × B (mod q)
                  </button>
                  <button
                    onClick={() => setMatrixOp("vector")}
                    className={`py-1.5 px-2 rounded border font-semibold transition-colors ${
                      matrixOp === "vector" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    A × v (mod q)
                  </button>
                  <button
                    onClick={() => setMatrixOp("reduce")}
                    className={`py-1.5 px-2 rounded border font-semibold transition-colors ${
                      matrixOp === "reduce" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    A mod q
                  </button>
                </div>

                {/* Matrix A JSON/Grid Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Matrix A (JSON 2D Array)
                  </label>
                  <textarea
                    rows={3}
                    value={JSON.stringify(matrixA)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        if (Array.isArray(parsed)) setMatrixA(parsed);
                      } catch {}
                    }}
                    className="w-full bg-[#080d1a] border border-slate-700 rounded p-2 text-xs font-mono text-cyan-300"
                  />
                </div>

                {/* Matrix B or Vector input */}
                {matrixOp !== "reduce" && matrixOp !== "vector" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Matrix B (JSON 2D Array)
                    </label>
                    <textarea
                      rows={3}
                      value={JSON.stringify(matrixB)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          if (Array.isArray(parsed)) setMatrixB(parsed);
                        } catch {}
                      }}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded p-2 text-xs font-mono text-emerald-300"
                    />
                  </div>
                )}

                {matrixOp === "vector" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Vector v (JSON 1D Array)
                    </label>
                    <input
                      type="text"
                      value={JSON.stringify(vectorV)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          if (Array.isArray(parsed)) setVectorV(parsed);
                        } catch {}
                      }}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded p-2 text-xs font-mono text-emerald-300"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Modulus q
                  </label>
                  <input
                    type="number"
                    min={2}
                    value={matrixQ}
                    onChange={(e) => setMatrixQ(parseInt(e.target.value) || 7)}
                    className="w-full bg-[#080d1a] border border-slate-700 rounded p-2 text-xs font-mono text-white"
                  />
                </div>

                {matrixError && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{matrixError}</span>
                  </div>
                )}

                <button
                  onClick={handleComputeMatrix}
                  disabled={matrixLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all"
                >
                  {matrixLoading ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>Execute Matrix Operation</span>
                </button>
              </div>
            </div>

            {/* Right Column: Step Breakdown */}
            <div className="lg:col-span-7">
              {matrixResult ? (
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-[#0c1322] border border-emerald-500/30">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Resulting Matrix / Vector
                    </span>
                    <pre className="text-2xl font-bold text-emerald-300 font-mono mt-2 overflow-x-auto">
                      {JSON.stringify(matrixResult.result)}
                    </pre>
                    <p className="text-xs text-slate-400 mt-2">{matrixResult.explanation}</p>
                  </div>

                  {/* Cell by Cell Calculation Steps */}
                  {matrixResult.cell_steps && (
                    <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 space-y-2 text-xs">
                      <span className="font-bold uppercase tracking-wider text-slate-200 text-[11px] block">
                        Cell-by-Cell Calculation Steps
                      </span>
                      <div className="space-y-1.5 max-h-60 overflow-y-auto font-mono">
                        {matrixResult.cell_steps.flat().map((c: any, idx: number) => (
                          <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                            <span className="text-cyan-400">{c.position}:</span>
                            <span className="text-slate-200">{c.formula}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Row by row steps for vector */}
                  {matrixResult.row_steps && (
                    <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 space-y-2 text-xs">
                      <span className="font-bold uppercase tracking-wider text-slate-200 text-[11px] block">
                        Row-by-Row Dot Product Steps
                      </span>
                      <div className="space-y-1.5 font-mono">
                        {matrixResult.row_steps.map((r: any, idx: number) => (
                          <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                            <span className="text-cyan-400">Row {r.row}:</span>
                            <span className="text-slate-200">{r.formula}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <ResultPanel title="Matrix Artifacts" data={matrixResult} />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center text-slate-500 text-xs space-y-2">
                  <Layers className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>Configure matrices on the left and click "Execute Matrix Operation".</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 4: LATTICES & NOISY EQUATION (LWE) */}
      {/* ========================================================================= */}
      {activeTab === "lattice" && (
        <div className="space-y-6">
          <div className="p-3 rounded-xl bg-[#0c1322] border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300">
              Prompt Specification: <span className="font-mono text-cyan-300">A = [[2,1],[1,3]], s = [1,2], e = [1,0], q = 7 ⇒ b = [5, 0]</span>
            </span>
            <button
              onClick={resetModule4}
              className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Controls */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-xl bg-[#0c1322] border border-violet-500/20 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    LWE Equation Parameters: b = As + e (mod q)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Recovering secret s from (A, b) is the Learning With Errors problem.
                  </p>
                </div>

                {/* Matrix A */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Matrix A (2×2)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={latA00}
                      onChange={(e) => setLatA00(parseInt(e.target.value) || 0)}
                      className="bg-[#080d1a] border border-slate-700 rounded p-2 text-center text-sm font-mono text-cyan-300"
                    />
                    <input
                      type="number"
                      value={latA01}
                      onChange={(e) => setLatA01(parseInt(e.target.value) || 0)}
                      className="bg-[#080d1a] border border-slate-700 rounded p-2 text-center text-sm font-mono text-cyan-300"
                    />
                    <input
                      type="number"
                      value={latA10}
                      onChange={(e) => setLatA10(parseInt(e.target.value) || 0)}
                      className="bg-[#080d1a] border border-slate-700 rounded p-2 text-center text-sm font-mono text-cyan-300"
                    />
                    <input
                      type="number"
                      value={latA11}
                      onChange={(e) => setLatA11(parseInt(e.target.value) || 0)}
                      className="bg-[#080d1a] border border-slate-700 rounded p-2 text-center text-sm font-mono text-cyan-300"
                    />
                  </div>
                </div>

                {/* Secret s and Noise e */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">Secret s</label>
                    <div className="flex gap-1.5">
                      <input
                        type="number"
                        value={latS0}
                        onChange={(e) => setLatS0(parseInt(e.target.value) || 0)}
                        className="w-1/2 bg-[#080d1a] border border-slate-700 rounded p-2 text-center text-sm font-mono text-violet-300"
                      />
                      <input
                        type="number"
                        value={latS1}
                        onChange={(e) => setLatS1(parseInt(e.target.value) || 0)}
                        className="w-1/2 bg-[#080d1a] border border-slate-700 rounded p-2 text-center text-sm font-mono text-violet-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">Noise e</label>
                    <div className="flex gap-1.5">
                      <input
                        type="number"
                        value={latE0}
                        onChange={(e) => setLatE0(parseInt(e.target.value) || 0)}
                        className="w-1/2 bg-[#080d1a] border border-slate-700 rounded p-2 text-center text-sm font-mono text-amber-300"
                      />
                      <input
                        type="number"
                        value={latE1}
                        onChange={(e) => setLatE1(parseInt(e.target.value) || 0)}
                        className="w-1/2 bg-[#080d1a] border border-slate-700 rounded p-2 text-center text-sm font-mono text-amber-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Modulus q</label>
                  <input
                    type="number"
                    min={2}
                    value={latQ}
                    onChange={(e) => setLatQ(parseInt(e.target.value) || 2)}
                    className="w-full bg-[#080d1a] border border-slate-700 rounded p-2 text-sm font-mono text-white"
                  />
                </div>

                {latError && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{latError}</span>
                  </div>
                )}

                <button
                  onClick={handleComputeLattice}
                  disabled={latLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_15px_rgba(139,92,246,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all"
                >
                  {latLoading ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>Evaluate LWE Equation &amp; Render Lattice</span>
                </button>
              </div>
            </div>

            {/* Right Column: Visualization & Results */}
            <div className="lg:col-span-7 space-y-4">
              {/* Result Bar */}
              <div className="p-5 rounded-xl bg-[#0c1322] border border-violet-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Resulting Vector b
                  </span>
                  <div className="text-3xl font-extrabold text-violet-300 font-mono mt-1">
                    {latResult ? `[${latResult.result_vector_b.join(", ")}]` : "[5, 0]"}
                  </div>
                </div>
                <div className="text-right text-xs font-mono text-slate-400">
                  <div>A @ s = {latResult ? `[${latResult.intermediate_steps.matrix_mult_As.join(", ")}]` : "[4, 7]"}</div>
                  <div className="text-amber-400">+ e = {latResult ? `[${latResult.intermediate_steps.noisy_sum_As_plus_e.join(", ")}]` : "[5, 7]"}</div>
                  <div className="text-violet-300">mod {latQ} = {latResult ? `[${latResult.result_vector_b.join(", ")}]` : "[5, 0]"}</div>
                </div>
              </div>

              {/* 2D Lattice SVG Visualizer */}
              <LatticeVisualizer
                matrixA={[[latA00, latA01], [latA10, latA11]]}
                secretS={[latS0, latS1]}
                noiseE={[latE0, latE1]}
                modulusQ={latQ}
                resultB={latResult ? latResult.result_vector_b : [5, 0]}
                latticePoints={latResult?.lattice_sample_points}
              />

              {/* Intuition Box */}
              <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 text-xs text-slate-300 space-y-2">
                <span className="font-semibold text-violet-400 uppercase text-[10px] tracking-wider block">
                  Why Learning With Errors (LWE) Underpins Post-Quantum Cryptography
                </span>
                <p className="leading-relaxed">
                  {latResult?.educational_context?.hardness ||
                    "Given public matrix A and noisy result b = (As + e) mod q, recovering secret vector s is computationally intractable when error e is drawn from a discrete small noise distribution. Without noise (e = 0), this is simple Gaussian elimination. With noise e, it directly reduces to worst-case geometric lattice problems."}
                </p>
                <p className="text-[11px] text-slate-500 pt-1 italic">
                  Note: This 2D model provides geometric intuition. Standardized ML-KEM and ML-DSA operate over high-dimensional module polynomial quotient rings Z_q[X]/(X^256 + 1) with q = 3329.
                </p>
              </div>

              {latResult && <ResultPanel title="LWE Pipeline Artifacts" data={latResult} />}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 5: HASH DEMONSTRATION & PARADIGMS */}
      {/* ========================================================================= */}
      {activeTab === "hash" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-xl bg-[#0c1322] border border-blue-500/20 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    SHA-256 Avalanche Effect Demo
                  </h3>
                  <p className="text-xs text-slate-400">
                    Change even 1 character between Message A and Message B to observe unpredictable bit flips.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Message A</label>
                  <input
                    type="text"
                    value={hashInput1}
                    onChange={(e) => setHashInput1(e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-700 rounded p-2 text-xs font-mono text-cyan-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Message B (Changed by 1 character)
                  </label>
                  <input
                    type="text"
                    value={hashInput2}
                    onChange={(e) => setHashInput2(e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-700 rounded p-2 text-xs font-mono text-emerald-300"
                  />
                </div>

                {hashError && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{hashError}</span>
                  </div>
                )}

                <button
                  onClick={handleComputeHash}
                  disabled={hashLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-[0_0_15px_rgba(59,130,246,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all"
                >
                  {hashLoading ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>Compute SHA-256 Digests</span>
                </button>
              </div>

              {/* Three Paradigms Breakdown Box */}
              <div className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-3 text-xs">
                <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] block">
                  Hashing vs. Encryption vs. Digital Signatures
                </span>

                <div className="space-y-2 text-[11px]">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="font-bold text-cyan-400">1. Cryptographic Hash (SHA-256)</span>
                    <p className="text-slate-400 mt-0.5">
                      One-way, deterministic, fixed-length fingerprint. Non-reversible, uses no key. Used for data integrity and Merkle trees (SLH-DSA).
                    </p>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="font-bold text-violet-400">2. Encryption (AES-GCM / ML-KEM)</span>
                    <p className="text-slate-400 mt-0.5">
                      Two-way reversible transformation using a key. Guarantees confidentiality; only key holders can recover original plaintext.
                    </p>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="font-bold text-emerald-400">3. Digital Signatures (ML-DSA / SLH-DSA)</span>
                    <p className="text-slate-400 mt-0.5">
                      Proves authenticity &amp; integrity. Does NOT encrypt the payload; anyone can read the signed message, but unauthorized edits break verification.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Digest Comparison */}
            <div className="lg:col-span-7">
              {hashResult ? (
                <div className="space-y-4">
                  {/* Metric Strip */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Bits Flipped
                      </span>
                      <div className="text-2xl font-bold text-white font-mono mt-1">
                        {hashResult.avalanche_analysis.output_bits_flipped} / {hashResult.avalanche_analysis.total_output_bits}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {hashResult.avalanche_analysis.input_characters_changed} char difference
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Avalanche Ratio
                      </span>
                      <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                        {hashResult.avalanche_analysis.avalanche_percentage}%
                      </div>
                      <span className="text-[10px] text-emerald-400/80 font-mono">
                        Ideal: ~50%
                      </span>
                    </div>
                  </div>

                  {/* Hash Digests */}
                  <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 space-y-3 font-mono text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Message A SHA-256 Digest:</span>
                      <div className="text-cyan-300 break-all bg-slate-900 p-2 rounded border border-slate-800/80 mt-1">
                        {hashResult.input_a.sha256_hex}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Message B SHA-256 Digest:</span>
                      <div className="text-emerald-300 break-all bg-slate-900 p-2 rounded border border-slate-800/80 mt-1">
                        {hashResult.input_b.sha256_hex}
                      </div>
                    </div>
                  </div>

                  <ResultPanel title="SHA-256 Avalanche Metrics" data={hashResult} />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center text-slate-500 text-xs space-y-2">
                  <Hash className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>Click "Compute SHA-256 Digests" to calculate real hashes and compare bit variations.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
