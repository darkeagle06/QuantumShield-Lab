"use client";

import React, { useEffect, useRef } from "react";

interface ShaderBackgroundProps {
  className?: string;
  intensity?: "subtle" | "medium" | "vibrant";
  interactive?: boolean;
}

export default function ShaderBackground({
  className = "",
  intensity = "medium",
  interactive = true,
}: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse coordinates for gentle interactive illumination
    let mouseX = width * 0.5;
    let mouseY = height * 0.4;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    // Mathematical lattice nodes
    const cols = 14;
    const rows = 8;
    const gridPoints: Array<{ x: number; y: number; originX: number; originY: number; phase: number }> = [];

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const ox = (i / (cols - 1)) * width;
        const oy = (j / (rows - 1)) * height;
        gridPoints.push({
          x: ox,
          y: oy,
          originX: ox,
          originY: oy,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    let time = 0;

    const render = () => {
      time += prefersReducedMotion ? 0 : 0.008;

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Base background clear
      ctx.clearRect(0, 0, width, height);

      // 1. Organic Violet-to-Indigo Fluid Field
      const g1X = width * 0.35 + Math.sin(time * 0.8) * (width * 0.15);
      const g1Y = height * 0.35 + Math.cos(time * 0.6) * (height * 0.15);
      const grad1 = ctx.createRadialGradient(g1X, g1Y, 10, g1X, g1Y, width * 0.65);
      grad1.addColorStop(0, "rgba(113, 100, 232, 0.28)"); // #7164E8
      grad1.addColorStop(0.5, "rgba(88, 80, 210, 0.12)");
      grad1.addColorStop(1, "rgba(13, 15, 24, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // 2. Cyan / Blue Accent Diffused Light
      const g2X = width * 0.75 + Math.cos(time * 0.7) * (width * 0.12);
      const g2Y = height * 0.55 + Math.sin(time * 0.9) * (height * 0.12);
      const grad2 = ctx.createRadialGradient(g2X, g2Y, 20, g2X, g2Y, width * 0.5);
      grad2.addColorStop(0, "rgba(56, 189, 248, 0.16)"); // Cyan-400
      grad2.addColorStop(0.6, "rgba(30, 58, 138, 0.06)");
      grad2.addColorStop(1, "rgba(13, 15, 24, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 3. Pointer-Responsive Soft Luminous Glow
      if (interactive) {
        const mouseGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 280);
        mouseGrad.addColorStop(0, "rgba(220, 217, 250, 0.14)"); // Pale violet #DCD9FA
        mouseGrad.addColorStop(0.5, "rgba(113, 100, 232, 0.08)");
        mouseGrad.addColorStop(1, "rgba(13, 15, 24, 0)");
        ctx.fillStyle = mouseGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 4. Subtle Discrete Mathematics Lattice Structure (Section 3.3)
      ctx.strokeStyle = "rgba(113, 100, 232, 0.08)";
      ctx.lineWidth = 1;

      // Update positions of lattice nodes with subtle harmonic wave displacement
      for (const p of gridPoints) {
        const wave = Math.sin(time * 1.5 + p.phase) * 6;
        p.x = p.originX + wave;
        p.y = p.originY + Math.cos(time * 1.2 + p.phase) * 6;
      }

      // Draw faint lattice connections
      ctx.beginPath();
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const idx = i * rows + j;
          const p = gridPoints[idx];

          // Horizontal link
          if (i < cols - 1) {
            const rightIdx = (i + 1) * rows + j;
            const rightP = gridPoints[rightIdx];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(rightP.x, rightP.y);
          }

          // Vertical link
          if (j < rows - 1) {
            const downIdx = i * rows + (j + 1);
            const downP = gridPoints[downIdx];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(downP.x, downP.y);
          }
        }
      }
      ctx.stroke();

      // Draw discrete lattice points
      for (const p of gridPoints) {
        const distToMouse = Math.hypot(p.x - mouseX, p.y - mouseY);
        const isNear = distToMouse < 180;
        ctx.fillStyle = isNear ? "rgba(220, 217, 250, 0.55)" : "rgba(113, 100, 232, 0.22)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, isNear ? 2.5 : 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [interactive, intensity]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-90 transition-opacity duration-1000"
      />
      {/* Subtle fine noise texture layer */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
}
