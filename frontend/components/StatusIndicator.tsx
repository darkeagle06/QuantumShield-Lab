"use client";

import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { HealthData } from "../lib/types";
import { Activity, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

export default function StatusIndicator() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const data = await api.getHealth();
      const roundtrip = Math.round(performance.now() - start);
      setHealth(data);
      setLatency(roundtrip);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Backend offline");
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 20000); // 20s heartbeat
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      {health ? (
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          <span className="font-semibold text-emerald-200">FastAPI Online</span>
          {latency !== null && (
            <span className="text-[10px] text-emerald-400/80 font-mono">
              {latency}ms
            </span>
          )}
          <span className="text-[10px] text-slate-400 border-l border-emerald-800/60 pl-2">
            Py {health.python_version}
          </span>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs shadow-[0_0_12px_rgba(245,158,11,0.15)]">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium text-amber-200">Backend Offline</span>
          <button
            onClick={checkStatus}
            disabled={loading}
            className="hover:text-amber-100 p-0.5 rounded transition-transform active:rotate-180"
            title="Retry connecting to FastAPI"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 text-xs">
          <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
          <span>Connecting...</span>
        </div>
      )}
    </div>
  );
}
