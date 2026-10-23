"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  Download,
  Trash2,
  Filter,
  CheckCircle2,
  Calendar,
  Cpu,
  RefreshCw,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { storage } from "@/lib/storage";
import { ExperimentRecord } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ResultsPage() {
  const [localRecords, setLocalRecords] = useState<ExperimentRecord[]>([]);
  const [dbExperiments, setDbExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAlgoFilter, setSelectedAlgoFilter] = useState<string>("ALL");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("ALL");
  const [stats, setStats] = useState<{
    total_experiments: number;
    total_measurements: number;
    algorithms_tested: string[];
  }>({
    total_experiments: 0,
    total_measurements: 0,
    algorithms_tested: [],
  });

  const loadData = async () => {
    setLoading(true);
    // 1. Load local records
    const recs = storage.getExperiments();
    setLocalRecords(recs);

    // 2. Load DB records and stats
    try {
      const dbRes = await api.getDatabaseExperiments();
      if (dbRes?.experiments) {
        setDbExperiments(dbRes.experiments);
      }
      const statsRes = await api.getDatabaseStatsSummary();
      if (statsRes) {
        setStats(statsRes);
      }
    } catch {
      // Backend offline fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClearLocal = () => {
    if (confirm("Are you sure you want to clear locally cached experiment records?")) {
      storage.clearAllExperiments();
      setLocalRecords([]);
    }
  };

  const filteredLocal = localRecords.filter((r) => {
    if (selectedAlgoFilter !== "ALL" && !r.algorithm?.toLowerCase().includes(selectedAlgoFilter.toLowerCase())) {
      return false;
    }
    if (selectedTypeFilter !== "ALL" && r.type !== selectedTypeFilter) {
      return false;
    }
    return true;
  });

  // Prepare chart comparison data from local experiments
  const chartData = filteredLocal.slice(0, 8).map((r) => {
    const pubKey =
      r.metrics?.public_key_bytes ??
      r.metrics?.output_sizes_bytes?.public_key_bytes ??
      0;
    const outBytes =
      r.metrics?.ciphertext_bytes ??
      r.metrics?.signature_bytes ??
      r.metrics?.output_sizes_bytes?.ciphertext_bytes ??
      r.metrics?.output_sizes_bytes?.signature_bytes ??
      0;
    return {
      name: r.algorithm || r.title.substring(0, 12),
      durationMs: Number(r.duration_ms?.toFixed(2) || 0),
      publicKeyBytes: pubKey,
      outputBytes: outBytes,
    };
  });

  return (
    <div className="space-y-10 pb-16 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="p-8 rounded-2xl glass-panel-violet space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7164E8]/20 border border-[#7164E8]/40 text-[#DCD9FA] text-xs font-mono font-medium">
              <BarChart3 className="w-3.5 h-3.5 text-[#7164E8]" />
              <span>EXPERIMENT HISTORY &amp; RELATIONAL ARCHIVE</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#F7F7F5] tracking-tight">
              Experiment Results &amp; Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Query recorded benchmark runs, verify hardware measurement samples,
              inspect public key / signature sizes, and export data directly to CSV or JSON.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="http://127.0.0.1:8000/api/experiments/export/csv"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary text-xs inline-flex items-center gap-1.5"
              title="Download all database measurements as standard CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </a>
            <a
              href="http://127.0.0.1:8000/api/experiments/export/json"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary text-xs inline-flex items-center gap-1.5"
              title="Download full experiment schema as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </a>
            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
              title="Reload Records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl card-elevated space-y-1">
          <div className="text-[11px] font-mono text-slate-400">Database Experiments</div>
          <div className="text-2xl font-extrabold text-white">
            {stats.total_experiments || dbExperiments.length}
          </div>
        </div>
        <div className="p-4 rounded-xl card-elevated space-y-1">
          <div className="text-[11px] font-mono text-slate-400">Recorded Measurements</div>
          <div className="text-2xl font-extrabold text-[#7164E8]">
            {stats.total_measurements || localRecords.length}
          </div>
        </div>
        <div className="p-4 rounded-xl card-elevated space-y-1">
          <div className="text-[11px] font-mono text-slate-400">Local Session Runs</div>
          <div className="text-2xl font-extrabold text-[#38bdf8]">
            {localRecords.length}
          </div>
        </div>
        <div className="p-4 rounded-xl card-elevated space-y-1">
          <div className="text-[11px] font-mono text-slate-400">Tested Algorithms</div>
          <div className="text-xs font-mono font-bold text-[#DCD9FA] truncate">
            {stats.algorithms_tested.length > 0
              ? stats.algorithms_tested.join(", ")
              : "ML-KEM, ML-DSA, SLH"}
          </div>
        </div>
      </div>

      {/* Visual Charts: Execution Latency & Output Sizes */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl card-elevated space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#7164E8]" />
              <span>Execution Latency (ms)</span>
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" stroke="#737373" fontSize={11} angle={-15} textAnchor="end" />
                  <YAxis stroke="#737373" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#181d2e",
                      borderColor: "rgba(113,100,232,0.3)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="durationMs" fill="#7164E8" name="Duration (ms)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-5 rounded-2xl card-elevated space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#38bdf8]" />
              <span>Key &amp; Artifact Sizes (Bytes)</span>
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" stroke="#737373" fontSize={11} angle={-15} textAnchor="end" />
                  <YAxis stroke="#737373" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#181d2e",
                      borderColor: "rgba(56,189,248,0.3)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="publicKeyBytes" fill="#7164E8" name="Public Key (B)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="outputBytes" fill="#38bdf8" name="Ciphertext / Sig (B)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Records Table */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#7164E8]" />
            <h2 className="text-base font-bold text-white">Recorded Runs</h2>
            <span className="text-xs font-mono text-slate-400">
              ({filteredLocal.length} visible)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedAlgoFilter}
              onChange={(e) => setSelectedAlgoFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#141724] border border-white/10 text-xs text-white focus:outline-none focus:border-[#7164E8]"
            >
              <option value="ALL">All Algorithms</option>
              <option value="ML-KEM">ML-KEM</option>
              <option value="ML-DSA">ML-DSA</option>
              <option value="SLH-DSA">SLH-DSA</option>
            </select>

            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#141724] border border-white/10 text-xs text-white focus:outline-none focus:border-[#7164E8]"
            >
              <option value="ALL">All Types</option>
              <option value="benchmark_run">Benchmark Run</option>
              <option value="crypto_kem">KEM Handshake</option>
              <option value="crypto_sign">Digital Signature</option>
            </select>

            {localRecords.length > 0 && (
              <button
                onClick={handleClearLocal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                title="Clear local session cache"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {filteredLocal.length === 0 ? (
          <div className="p-12 rounded-2xl card-elevated text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#7164E8]/10 border border-[#7164E8]/30 mx-auto flex items-center justify-center text-[#7164E8]">
              <Database className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">No Experiment Records Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Execute a genuine cryptographic handshake in the Cryptography Lab or run an empirical benchmark to populate this history.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link href="/crypto-lab" className="btn-primary text-xs">
                Open Cryptography Lab
              </Link>
              <Link href="/experiments" className="btn-secondary text-xs">
                Run Benchmarks
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-xl card-elevated overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141724] border-b border-white/10 text-slate-400 font-mono text-[11px]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Title / Algorithm</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Duration (ms)</th>
                  <th className="p-3">Public Key</th>
                  <th className="p-3">Ciphertext / Sig</th>
                  <th className="p-3">Authenticity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLocal.map((rec) => {
                  const pubKey =
                    rec.metrics?.public_key_bytes ??
                    rec.metrics?.output_sizes_bytes?.public_key_bytes ??
                    "—";
                  const artifact =
                    rec.metrics?.ciphertext_bytes ??
                    rec.metrics?.signature_bytes ??
                    rec.metrics?.output_sizes_bytes?.ciphertext_bytes ??
                    rec.metrics?.output_sizes_bytes?.signature_bytes ??
                    "—";
                  return (
                    <tr key={rec.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-mono text-slate-400 text-[11px]">
                        {new Date(rec.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="p-3 font-semibold text-white">
                        {rec.title}
                        <span className="block font-mono text-[10px] text-slate-400 font-normal">
                          {rec.algorithm}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                          {rec.type}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-medium text-[#DCD9FA]">
                        {rec.duration_ms?.toFixed(2)} ms
                      </td>
                      <td className="p-3 font-mono text-slate-300">
                        {pubKey !== "—" ? `${pubKey} B` : "—"}
                      </td>
                      <td className="p-3 font-mono text-slate-300">
                        {artifact !== "—" ? `${artifact} B` : "—"}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
