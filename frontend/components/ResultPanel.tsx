"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal, Code2, ShieldAlert, ShieldCheck } from "lucide-react";

interface ResultPanelProps {
  title: string;
  data: any;
  statusBadge?: string;
  statusType?: "success" | "warning" | "error" | "info";
  executionTimeMs?: number;
  subtitle?: string;
}

export default function ResultPanel({
  title,
  data,
  statusBadge,
  statusType = "success",
  executionTimeMs,
  subtitle,
}: ResultPanelProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"formatted" | "json">("formatted");

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const badgeStyles = {
    success: "bg-emerald-950/60 text-emerald-400 border-emerald-500/40",
    warning: "bg-amber-950/60 text-amber-400 border-amber-500/40",
    error: "bg-rose-950/60 text-rose-400 border-rose-500/40",
    info: "bg-cyan-950/60 text-cyan-400 border-cyan-500/40",
  }[statusType];

  return (
    <div className="rounded-xl bg-[#0a0f1d] border border-slate-800 overflow-hidden shadow-xl">
      {/* Panel Header */}
      <div className="px-4 py-3 bg-[#0d1424] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {title}
          </span>
          {statusBadge && (
            <span
              className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded border ${badgeStyles}`}
            >
              {statusBadge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {executionTimeMs !== undefined && (
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {executionTimeMs} ms
            </span>
          )}

          <div className="flex rounded-md bg-slate-900 border border-slate-800 p-0.5">
            <button
              onClick={() => setActiveTab("formatted")}
              className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                activeTab === "formatted"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Formatted
            </button>
            <button
              onClick={() => setActiveTab("json")}
              className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                activeTab === "json"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              JSON
            </button>
          </div>

          <button
            onClick={copyJson}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Copy Raw JSON"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {subtitle && (
        <div className="px-4 py-1.5 bg-slate-900/40 border-b border-slate-800 text-[11px] text-slate-400">
          {subtitle}
        </div>
      )}

      {/* Content Body */}
      <div className="p-4 max-h-96 overflow-y-auto font-mono text-xs text-slate-300">
        {activeTab === "json" ? (
          <pre className="text-emerald-400/90 whitespace-pre-wrap leading-relaxed">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <div className="space-y-3 font-sans">
            {Object.entries(data).map(([key, val]) => {
              if (typeof val === "object" && val !== null) {
                return (
                  <div
                    key={key}
                    className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80"
                  >
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      {key.replace(/_/g, " ")}
                    </div>
                    <pre className="font-mono text-xs text-cyan-300/90 whitespace-pre-wrap">
                      {JSON.stringify(val, null, 2)}
                    </pre>
                  </div>
                );
              }
              return (
                <div
                  key={key}
                  className="flex items-start justify-between py-1 border-b border-slate-800/60 text-xs"
                >
                  <span className="text-slate-400 capitalize">
                    {key.replace(/_/g, " ")}:
                  </span>
                  <span className="font-mono text-slate-200 font-medium text-right max-w-[70%] break-all">
                    {String(val)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
