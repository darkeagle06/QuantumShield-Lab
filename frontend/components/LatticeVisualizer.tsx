"use client";

import React, { useState } from "react";
import { Info, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface LatticeVisualizerProps {
  matrixA: number[][];
  secretS: number[];
  noiseE: number[];
  modulusQ: number;
  resultB: number[];
  latticePoints?: Array<{ x: number; y: number; c1: number; c2: number; is_origin?: boolean; is_secret_target?: boolean }>;
}

export default function LatticeVisualizer({
  matrixA,
  secretS,
  noiseE,
  modulusQ,
  resultB,
  latticePoints = [],
}: LatticeVisualizerProps) {
  const [zoom, setZoom] = useState<number>(18); // pixels per unit
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  // SVG canvas dimensions
  const width = 500;
  const height = 400;
  const cx = width / 2;
  const cy = height / 2;

  // Transform mathematical coordinates (x, y) to SVG coordinates (px, py)
  const toSvgX = (x: number) => cx + x * zoom;
  const toSvgY = (y: number) => cy - y * zoom;

  // Basis vectors: columns of matrix A
  const v1 = [matrixA[0]?.[0] ?? 2, matrixA[1]?.[0] ?? 1];
  const v2 = [matrixA[0]?.[1] ?? 1, matrixA[1]?.[1] ?? 3];

  // As = A @ s
  const As = [
    matrixA[0][0] * secretS[0] + matrixA[0][1] * secretS[1],
    matrixA[1][0] * secretS[0] + matrixA[1][1] * secretS[1],
  ];

  // As + e
  const As_plus_e = [As[0] + noiseE[0], As[1] + noiseE[1]];

  // Fallback lattice points if not passed
  const points = latticePoints.length > 0
    ? latticePoints
    : [];
  if (points.length === 0) {
    for (let c1 = -3; c1 <= 3; c1++) {
      for (let c2 = -3; c2 <= 3; c2++) {
        points.push({
          x: c1 * v1[0] + c2 * v2[0],
          y: c1 * v1[1] + c2 * v2[1],
          c1,
          c2,
          is_origin: c1 === 0 && c2 === 0,
          is_secret_target: c1 === secretS[0] && c2 === secretS[1],
        });
      }
    }
  }

  return (
    <div className="rounded-xl bg-[#080d18] border border-violet-500/30 p-4 space-y-3">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">
            2D Lattice Geometric Visualization
          </span>
          <span className="text-[11px] text-slate-400">
            Grid of integer linear combinations $\Lambda(A) = c_1 v_1 + c_2 v_2$
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setZoom((z) => Math.max(10, z - 3))}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(18)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(35, z + 3))}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="relative border border-slate-800 rounded-xl overflow-hidden bg-[#050811] flex items-center justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-80 select-none cursor-crosshair"
        >
          {/* Defs for arrowheads */}
          <defs>
            <marker
              id="arrow-cyan"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#06b6d4" />
            </marker>
            <marker
              id="arrow-violet"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#a855f7" />
            </marker>
            <marker
              id="arrow-amber"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Coordinate axes */}
          <line
            x1={0}
            y1={cy}
            x2={width}
            y2={cy}
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <line
            x1={cx}
            y1={0}
            x2={cx}
            y2={height}
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Grid of Discrete Lattice Points */}
          {points.map((pt, idx) => {
            const sx = toSvgX(pt.x);
            const sy = toSvgY(pt.y);
            const isTarget = pt.is_secret_target;
            const isOrigin = pt.is_origin;

            return (
              <g
                key={idx}
                onMouseEnter={() =>
                  setHoveredPoint(`Lattice Point (${pt.x}, ${pt.y}) [c₁=${pt.c1}, c₂=${pt.c2}]`)
                }
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={sx}
                  cy={sy}
                  r={isOrigin ? 4 : isTarget ? 5 : 2.5}
                  fill={isOrigin ? "#94a3b8" : isTarget ? "#38bdf8" : "#475569"}
                  opacity={0.85}
                  className="transition-all hover:scale-150 cursor-pointer"
                />
              </g>
            );
          })}

          {/* Basis Vector 1 (Cyan Arrow) */}
          <line
            x1={cx}
            y1={cy}
            x2={toSvgX(v1[0])}
            y2={toSvgY(v1[1])}
            stroke="#06b6d4"
            strokeWidth="2.5"
            markerEnd="url(#arrow-cyan)"
          />
          <text
            x={toSvgX(v1[0]) + 8}
            y={toSvgY(v1[1]) - 4}
            fill="#22d3ee"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            v₁({v1[0]},{v1[1]})
          </text>

          {/* Basis Vector 2 (Violet Arrow) */}
          <line
            x1={cx}
            y1={cy}
            x2={toSvgX(v2[0])}
            y2={toSvgY(v2[1])}
            stroke="#a855f7"
            strokeWidth="2.5"
            markerEnd="url(#arrow-violet)"
          />
          <text
            x={toSvgX(v2[0]) + 8}
            y={toSvgY(v2[1]) - 4}
            fill="#c084fc"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            v₂({v2[0]},{v2[1]})
          </text>

          {/* Vector As (Secret Linear Combination) */}
          <line
            x1={cx}
            y1={cy}
            x2={toSvgX(As[0])}
            y2={toSvgY(As[1])}
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Noise Vector e (Amber Arrow from As to As + e) */}
          {(noiseE[0] !== 0 || noiseE[1] !== 0) && (
            <line
              x1={toSvgX(As[0])}
              y1={toSvgY(As[1])}
              x2={toSvgX(As_plus_e[0])}
              y2={toSvgY(As_plus_e[1])}
              stroke="#f59e0b"
              strokeWidth="2"
              markerEnd="url(#arrow-amber)"
            />
          )}

          {/* Target Noiseless Point (As) */}
          <circle
            cx={toSvgX(As[0])}
            cy={toSvgY(As[1])}
            r="5"
            fill="#0284c7"
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <text
            x={toSvgX(As[0]) + 8}
            y={toSvgY(As[1]) + 4}
            fill="#38bdf8"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            As({As[0]},{As[1]})
          </text>

          {/* Noisy Perturbed Point (As + e) */}
          {(noiseE[0] !== 0 || noiseE[1] !== 0) && (
            <g>
              <circle
                cx={toSvgX(As_plus_e[0])}
                cy={toSvgY(As_plus_e[1])}
                r="6"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="2 2"
              />
              <circle
                cx={toSvgX(As_plus_e[0])}
                cy={toSvgY(As_plus_e[1])}
                r="3"
                fill="#f59e0b"
              />
              <text
                x={toSvgX(As_plus_e[0]) + 8}
                y={toSvgY(As_plus_e[1]) + 12}
                fill="#fbbf24"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                As+e({As_plus_e[0]},{As_plus_e[1]})
              </text>
            </g>
          )}

          {/* Origin */}
          <circle cx={cx} cy={cy} r="3" fill="#cbd5e1" />
          <text x={cx + 5} y={cy + 12} fill="#64748b" fontSize="9" fontFamily="monospace">
            (0,0)
          </text>
        </svg>

        {hoveredPoint && (
          <div className="absolute top-2 left-2 bg-slate-900/90 border border-slate-700 px-2 py-1 rounded text-[11px] font-mono text-cyan-300 pointer-events-none">
            {hoveredPoint}
          </div>
        )}
      </div>

      {/* Visual Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
          <span>v₁ = ({v1[0]},{v1[1]})</span>
        </div>
        <div className="flex items-center gap-1.5 text-violet-400">
          <span className="w-2.5 h-0.5 bg-violet-400 inline-block" />
          <span>v₂ = ({v2[0]},{v2[1]})</span>
        </div>
        <div className="flex items-center gap-1.5 text-sky-400">
          <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
          <span>As = ({As[0]},{As[1]})</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400">
          <span className="w-2 h-2 rounded-full border border-amber-400 inline-block" />
          <span>As + e = ({As_plus_e[0]},{As_plus_e[1]})</span>
        </div>
      </div>
    </div>
  );
}
