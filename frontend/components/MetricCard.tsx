"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  accent?: "cyan" | "violet" | "emerald" | "amber";
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  accent = "cyan",
}: MetricCardProps) {
  const accentStyles = {
    cyan: {
      border: "border-cyan-500/20 hover:border-cyan-500/40",
      iconBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      glow: "hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]",
    },
    violet: {
      border: "border-violet-500/20 hover:border-violet-500/40",
      iconBg: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      glow: "hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]",
    },
    emerald: {
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      glow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    },
    amber: {
      border: "border-amber-500/20 hover:border-amber-500/40",
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]",
    },
  }[accent];

  return (
    <div
      className={`rounded-xl bg-[#0c1322] border ${accentStyles.border} p-5 transition-all duration-300 ${accentStyles.glow} relative overflow-hidden group`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div
          className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-transform group-hover:scale-105 ${accentStyles.iconBg}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white font-mono">
          {value}
        </span>
        {badge && (
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-400 mt-1 leading-normal font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
}
