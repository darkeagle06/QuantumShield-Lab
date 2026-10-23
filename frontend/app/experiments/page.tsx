"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FlaskConical,
  Activity,
  Scale,
  History,
  Play,
  RotateCw,
  Save,
  Cpu,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  Eye,
  CheckSquare,
  Square,
  Info,
} from "lucide-react";
import { api } from "@/lib/api";
import { storage } from "@/lib/storage";
import { BenchmarkResult, ExperimentRecord } from "@/lib/types";
import ResultPanel from "@/components/ResultPanel";
import EmptyState from "@/components/EmptyState";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";

const COMPARISON_DATA = [
  {
    name: "ML-KEM-768",
    standard: "FIPS 203",
    type: "KEM",
    math: "Module-LWE",
    nistLevel: "Category 3 (AES-192)",
    quantumSafe: true,
    publicKeyBytes: 1184,
    outputBytes: 1088,
    outputLabel: "Ciphertext",
    advantages: "Fast keygen & decapsulation, tight lattice proofs.",
    tradeoffs: "Larger public key (1.18 KB) than RSA (256 B).",
  },
  {
    name: "ML-DSA-65",
    standard: "FIPS 204",
    type: "Signature",
    math: "Module-SIS / LWE",
    nistLevel: "Category 3 (AES-192)",
    quantumSafe: true,
    publicKeyBytes: 1952,
    outputBytes: 3309,
    outputLabel: "Signature",
    advantages: "Moderate signature size (~3.3 KB), efficient verification.",
    tradeoffs: "Rejection sampling during signing requires care against side channels.",
  },
  {
    name: "SLH-DSA-128s",
    standard: "FIPS 205",
    type: "Signature",
    math: "Stateless Hash Trees",
    nistLevel: "Category 1 (AES-128)",
    quantumSafe: true,
    publicKeyBytes: 32,
    outputBytes: 7856,
    outputLabel: "Signature",
    advantages: "Tiny public key (32 B), conservative security relying only on SHA-2/SHAKE.",
    tradeoffs: "Very large signature (~7.8 KB), slower signing latency.",
  },
  {
    name: "RSA-2048",
    standard: "Classical (PKCS #1)",
    type: "KEM / Signature",
    math: "Integer Factorization",
    nistLevel: "0 Bits (Vulnerable to Shor)",
    quantumSafe: false,
    publicKeyBytes: 256,
    outputBytes: 256,
    outputLabel: "Ciphertext / Sig",
    advantages: "Extremely compact keys & signatures, decades of deployment.",
    tradeoffs: "Fundamentally insecure against quantum computers running Shor's algorithm.",
  },
  {
    name: "ECDSA P-256",
    standard: "Classical (ANSI X9.62)",
    type: "Signature",
    math: "Elliptic Curve DLP",
    nistLevel: "0 Bits (Vulnerable to Shor)",
    quantumSafe: false,
    publicKeyBytes: 64,
    outputBytes: 64,
    outputLabel: "Signature",
    advantages: "Compact 64-byte signatures, fast operations.",
    tradeoffs: "Vulnerable to polynomial-time period finding by Shor's quantum algorithm.",
  },
];

function ExperimentsContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"benchmark" | "comparison" | "history">("benchmark");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "benchmark" || tab === "comparison" || tab === "history") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // --- Benchmark Tab State ---
  const [benchmarkAlgo, setBenchmarkAlgo] = useState<string>("ML-KEM-768");
  const [repetitions, setRepetitions] = useState<number>(10);
  const [warmups, setWarmups] = useState<number>(2);
  const [benchLoading, setBenchLoading] = useState<boolean>(false);
  const [benchResult, setBenchResult] = useState<BenchmarkResult | null>(null);
  const [benchSaved, setBenchSaved] = useState<boolean>(false);
  const [benchNotes, setBenchNotes] = useState<string>("");

  const handleRunBenchmark = async () => {
    setBenchLoading(true);
    setBenchSaved(false);
    try {
      const data = await api.runBenchmark({
        algorithm: benchmarkAlgo,
        repetitions,
        warmups,
      });
      setBenchResult(data);
    } catch (err: any) {
      alert(err.message || "Benchmark failed");
    } finally {
      setBenchLoading(false);
    }
  };

  const handleSaveBenchmark = () => {
    if (!benchResult) return;
    storage.saveExperiment({
      title: `Benchmark: ${benchResult.algorithm} (${benchResult.repetitions} reps)`,
      type: "benchmark",
      algorithm: benchResult.algorithm,
      duration_ms: benchResult.summary_median_ms,
      metrics: {
        summary_median_ms: benchResult.summary_median_ms,
        repetitions: benchResult.repetitions,
        warmups: benchResult.warmups,
        sizes_bytes: benchResult.sizes_bytes,
        operations: benchResult.operations,
        operation_breakdown: benchResult.operation_breakdown,
      },
      notes: benchNotes || "Controlled micro-benchmark in Experiments Lab",
      environment: benchResult.environment,
    });
    setBenchSaved(true);
    refreshHistory();
  };

  // --- Comparison Tab State ---
  const [compFilter, setCompFilter] = useState<"all" | "pqc" | "classical">("all");
  const filteredCompData = COMPARISON_DATA.filter((item) => {
    if (compFilter === "pqc") return item.quantumSafe;
    if (compFilter === "classical") return !item.quantumSafe;
    return true;
  });

  const chartData = filteredCompData.map((d) => ({
    name: d.name,
    "Public Key (Bytes)": d.publicKeyBytes,
    "Output Size (Bytes)": d.outputBytes,
  }));

  // --- History Tab State ---
  const [experiments, setExperiments] = useState<ExperimentRecord[]>([]);
  const [selectedExp, setSelectedExp] = useState<ExperimentRecord | null>(null);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const refreshHistory = () => {
    setExperiments(storage.getExperiments());
  };

  useEffect(() => {
    refreshHistory();
  }, []);

  const toggleCompare = (id: string) => {
    if (selectedCompareIds.includes(id)) {
      setSelectedCompareIds(selectedCompareIds.filter((item) => item !== id));
    } else {
      setSelectedCompareIds([...selectedCompareIds, id]);
    }
  };

  const handleDelete = (id: string) => {
    storage.deleteExperiment(id);
    setSelectedCompareIds(selectedCompareIds.filter((item) => item !== id));
    if (selectedExp?.id === id) setSelectedExp(null);
    refreshHistory();
  };

  const handleClearAll = () => {
    storage.clearAllExperiments();
    setSelectedCompareIds([]);
    setSelectedExp(null);
    setShowClearConfirm(false);
    refreshHistory();
  };

  const handleExportCsv = () => {
    const csvContent = storage.exportAsCsv();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `quantumshield_experiments_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    const jsonContent = storage.exportAsJson();
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `quantumshield_experiments_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const compareItems = experiments.filter((e) => selectedCompareIds.includes(e.id));

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0c1322] border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-white">Experiments &amp; Benchmarks</h1>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Conduct reproducible performance testing on local hardware, evaluate key size and ciphertext tradeoffs across classical and post-quantum ciphers, and review locally saved experiment history.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab("benchmark")}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "benchmark"
              ? "border-cyan-400 text-cyan-300 bg-cyan-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Micro-Benchmark Runner</span>
        </button>

        <button
          onClick={() => setActiveTab("comparison")}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "comparison"
              ? "border-violet-400 text-violet-300 bg-violet-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Algorithm Comparison Matrix</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("history");
            refreshHistory();
          }}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "history"
              ? "border-emerald-400 text-emerald-300 bg-emerald-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Saved History ({experiments.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. BENCHMARK RUNNER */}
      {/* ========================================================================= */}
      {activeTab === "benchmark" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Parameters */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-6 rounded-xl bg-[#0c1322] border border-cyan-500/20 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Benchmark Configuration
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Target Algorithm
                  </label>
                  <select
                    value={benchmarkAlgo}
                    onChange={(e) => setBenchmarkAlgo(e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                  >
                    <optgroup label="ML-KEM (NIST FIPS 203)">
                      <option value="ML-KEM-512">ML-KEM-512 (Category 1)</option>
                      <option value="ML-KEM-768">ML-KEM-768 (Category 3 · Standard)</option>
                      <option value="ML-KEM-1024">ML-KEM-1024 (Category 5)</option>
                    </optgroup>
                    <optgroup label="ML-DSA (NIST FIPS 204)">
                      <option value="ML-DSA-44">ML-DSA-44 (Category 2)</option>
                      <option value="ML-DSA-65">ML-DSA-65 (Category 3 · Standard)</option>
                      <option value="ML-DSA-87">ML-DSA-87 (Category 5)</option>
                    </optgroup>
                    <optgroup label="SLH-DSA (NIST FIPS 205)">
                      <option value="SLH-DSA-SHA2-128s">SLH-DSA-SHA2-128s (Small signatures)</option>
                      <option value="SLH-DSA-SHA2-128f">SLH-DSA-SHA2-128f (Fast signing)</option>
                    </optgroup>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Repetitions
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={repetitions}
                      onChange={(e) => setRepetitions(parseInt(e.target.value) || 1)}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Warm-ups
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      value={warmups}
                      onChange={(e) => setWarmups(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={benchNotes}
                    onChange={(e) => setBenchNotes(e.target.value)}
                    placeholder="e.g. Host CPU test run"
                    className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  onClick={handleRunBenchmark}
                  disabled={benchLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all"
                >
                  {benchLoading ? (
                    <RotateCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                  <span>{benchLoading ? "Measuring Latencies..." : "Run Micro-Benchmark"}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300 block">Monotonic Timer Protocol:</span>
                <p>
                  Execution times are sampled via Python's high-resolution <code className="text-cyan-300 font-mono">time.perf_counter</code>. Warmups are strictly excluded to avoid cold cache skews.
                </p>
              </div>
            </div>

            {/* Benchmark Results */}
            <div className="lg:col-span-8 space-y-6">
              {benchResult ? (
                <div className="space-y-5">
                  {/* Summary Metric Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#0c1322] border border-cyan-500/30">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Overall Median
                      </span>
                      <div className="text-xl font-bold text-cyan-300 font-mono mt-0.5">
                        {benchResult.summary_median_ms} ms
                      </div>
                      <span className="text-[10px] text-slate-500">{benchResult.repetitions} repetitions</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0c1322] border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Algorithm
                      </span>
                      <div className="text-sm font-bold text-white font-mono mt-1">
                        {benchResult.algorithm}
                      </div>
                      <span className="text-[10px] text-slate-500">Genuine PQC implementation</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0c1322] border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Platform OS
                      </span>
                      <div className="text-xs font-bold text-slate-300 font-mono mt-1 truncate">
                        {benchResult.environment.os}
                      </div>
                      <span className="text-[10px] text-slate-500">Local CPU host</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0c1322] border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Python Runtime
                      </span>
                      <div className="text-xs font-bold text-slate-300 font-mono mt-1">
                        {benchResult.environment.python_version}
                      </div>
                      <span className="text-[10px] text-slate-500">CInterpreted engine</span>
                    </div>
                  </div>

                  {/* Operation Breakdown Table */}
                  {benchResult.operation_breakdown && (
                    <div className="rounded-xl bg-[#0c1322] border border-slate-800 overflow-hidden">
                      <div className="p-3 bg-[#090e1a] border-b border-slate-800 text-xs font-semibold text-slate-200">
                        Per-Operation Statistical Breakdown
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                              <th className="p-3">Operation</th>
                              <th className="p-3">Median</th>
                              <th className="p-3">Min</th>
                              <th className="p-3">Max</th>
                              <th className="p-3">Std Dev</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {benchResult.operation_breakdown.map((op) => (
                              <tr key={op.operation} className="hover:bg-slate-800/30">
                                <td className="p-3 text-cyan-300 font-sans font-medium">{op.operation}</td>
                                <td className="p-3 font-bold text-white">{op.median_ms} ms</td>
                                <td className="p-3 text-emerald-400">{op.min_ms} ms</td>
                                <td className="p-3 text-amber-400">{op.max_ms} ms</td>
                                <td className="p-3 text-slate-400">±{op.std_dev_ms} ms</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveBenchmark}
                      disabled={benchSaved}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{benchSaved ? "Saved to History ✓" : "Save Run to History"}</span>
                    </button>
                  </div>

                  <ResultPanel
                    title="Benchmark JSON Payload"
                    data={benchResult}
                    statusBadge="BENCHMARKED"
                    statusType="info"
                    executionTimeMs={benchResult.summary_median_ms}
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-800 p-14 text-center text-slate-500 text-xs space-y-2">
                  <Activity className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-300">
                    Ready to Measure Cryptographic Operations
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Select an algorithm and click &quot;Run Micro-Benchmark&quot; to measure execution timings on your local processor.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ALGORITHM COMPARISON MATRIX */}
      {/* ========================================================================= */}
      {activeTab === "comparison" && (
        <div className="space-y-6">
          <div className="flex gap-2">
            <button
              onClick={() => setCompFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                compFilter === "all"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
              }`}
            >
              All Algorithms (5)
            </button>
            <button
              onClick={() => setCompFilter("pqc")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                compFilter === "pqc"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
              }`}
            >
              Post-Quantum Only (FIPS 203/204/205)
            </button>
            <button
              onClick={() => setCompFilter("classical")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                compFilter === "classical"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
              }`}
            >
              Classical Baselines (RSA / ECC)
            </button>
          </div>

          {/* Table */}
          <div className="rounded-xl bg-[#0c1322] border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#090e1a] text-slate-400 uppercase font-semibold text-[11px] tracking-wider">
                    <th className="p-4">Algorithm / Standard</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Mathematical Problem</th>
                    <th className="p-4">Quantum Safety</th>
                    <th className="p-4">Public Key</th>
                    <th className="p-4">Ciphertext / Signature</th>
                    <th className="p-4">Tradeoff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredCompData.map((algo) => (
                    <tr key={algo.name} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-mono font-semibold text-white">
                        <div>{algo.name}</div>
                        <div className="text-[10px] text-slate-500 font-sans">{algo.standard}</div>
                      </td>
                      <td className="p-4 text-slate-300">{algo.type}</td>
                      <td className="p-4 text-cyan-300 font-mono text-[11px]">{algo.math}</td>
                      <td className="p-4">
                        {algo.quantumSafe ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            Quantum Safe
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-400 border border-rose-500/30 text-[10px] font-semibold">
                            <AlertTriangle className="w-3 h-3" />
                            Broken by Shor
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-slate-200 font-bold">{algo.publicKeyBytes.toLocaleString()} B</td>
                      <td className="p-4 font-mono text-slate-200 font-bold">{algo.outputBytes.toLocaleString()} B</td>
                      <td className="p-4 text-slate-400 text-[11px] max-w-xs leading-relaxed">{algo.tradeoffs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Size Chart */}
          <div className="p-6 rounded-xl bg-[#0c1322] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Data Footprint Comparison (Public Keys vs. Output Payload Bytes)
            </h3>
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit=" B" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  <Bar dataKey="Public Key (Bytes)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Output Size (Bytes)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SAVED HISTORY & COMPARISON */}
      {/* ========================================================================= */}
      {activeTab === "history" && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0c1322] border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                Saved Experiments: <strong className="text-white font-mono">{experiments.length}</strong>
              </span>
              {selectedCompareIds.length >= 2 && (
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="ml-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow cursor-pointer transition-colors"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Compare Selected ({selectedCompareIds.length})</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCsv}
                disabled={experiments.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handleExportJson}
                disabled={experiments.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export JSON</span>
              </button>
              {experiments.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          {/* Records Grid */}
          {experiments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {experiments.map((exp) => {
                const isSelected = selectedCompareIds.includes(exp.id);
                return (
                  <div
                    key={exp.id}
                    className={`rounded-xl bg-[#0c1322] border p-4 space-y-3 flex flex-col justify-between transition-all ${
                      isSelected
                        ? "border-cyan-500 bg-[#0d1627]"
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleCompare(exp.id)}
                            className="text-slate-400 hover:text-cyan-400 cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-cyan-400" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-600" />
                            )}
                          </button>
                          <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                            {exp.algorithm}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(exp.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white line-clamp-1">{exp.title}</h4>
                      {exp.notes && (
                        <p className="text-[11px] text-slate-400 line-clamp-2">{exp.notes}</p>
                      )}

                      {exp.duration_ms !== undefined && (
                        <div className="flex justify-between text-xs font-mono pt-1 border-t border-slate-800/80">
                          <span className="text-slate-500">Latency / Median:</span>
                          <span className="text-emerald-400 font-bold">{exp.duration_ms} ms</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedExp(exp)}
                        className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Payload</span>
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={History}
              title="No Experiment Records Found"
              description="You have not saved any benchmark runs or cryptographic handshakes to local storage yet."
            />
          )}

          {/* Details Modal */}
          {selectedExp && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#090e1a] border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white">{selectedExp.title}</h3>
                  <button
                    onClick={() => setSelectedExp(null)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <ResultPanel title="Recorded Experiment Data" data={selectedExp} />
              </div>
            </div>
          )}

          {/* Compare Modal */}
          {showCompareModal && compareItems.length >= 2 && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#090e1a] border border-cyan-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Scale className="w-4 h-4 text-cyan-400" />
                    <span>Comparative Run Analysis ({compareItems.length} selected)</span>
                  </h3>
                  <button
                    onClick={() => setShowCompareModal(false)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="p-3">Metric</th>
                        {compareItems.map((item) => (
                          <th key={item.id} className="p-3 text-cyan-300 font-bold">
                            {item.algorithm}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      <tr>
                        <td className="p-3 font-sans text-slate-400">Type</td>
                        {compareItems.map((item) => (
                          <td key={item.id} className="p-3 text-white uppercase">{item.type}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-sans text-slate-400">Latency / Median</td>
                        {compareItems.map((item) => (
                          <td key={item.id} className="p-3 text-emerald-400 font-bold">{item.duration_ms} ms</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-sans text-slate-400">Public Key Size</td>
                        {compareItems.map((item) => {
                          const pk = item.metrics?.public_key_bytes ?? item.metrics?.sizes_bytes?.public_key_bytes;
                          return (
                            <td key={item.id} className="p-3 text-cyan-300">
                              {pk !== undefined ? `${pk} B` : "N/A"}
                            </td>
                          );
                        })}
                      </tr>
                      <tr>
                        <td className="p-3 font-sans text-slate-400">Ciphertext / Signature</td>
                        {compareItems.map((item) => {
                          const sz = item.metrics?.ciphertext_bytes ?? item.metrics?.signature_bytes ?? item.metrics?.sizes_bytes?.ciphertext_bytes ?? item.metrics?.sizes_bytes?.signature_bytes;
                          return (
                            <td key={item.id} className="p-3 text-amber-300">
                              {sz !== undefined ? `${sz} B` : "N/A"}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Clear Confirmation Modal */}
          {showClearConfirm && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0c1322] border border-rose-500/40 rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Clear Experiment History?</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Are you sure you want to delete all {experiments.length} recorded runs? This will remove them from browser localStorage.
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
                  >
                    Yes, Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExperimentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-slate-400">Loading Experiments...</div>}>
      <ExperimentsContent />
    </Suspense>
  );
}
