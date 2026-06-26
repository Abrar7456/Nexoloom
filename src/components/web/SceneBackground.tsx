"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { useSettings } from "@/context/SettingsContext";

/* ─── theme → RGB colour map ────────────────────────────────────────────── */
const ACCENT_COLORS: Record<string, [number, number, number]> = {
  violet:  [139, 92,  246],
  indigo:  [99,  102, 241],
  blue:    [59,  130, 246],
  emerald: [16,  185, 129],
  rose:    [244, 63,  94],
  cyan:    [6,   182, 212],
  amber:   [245, 158, 11],
};

/* ─── lerp helper ───────────────────────────────────────────────────────── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ─── Particle ──────────────────────────────────────────────────────────── */
interface Particle {
  x: number; y: number; z: number;
  ox: number; oy: number; oz: number; // original positions
  vx: number; vy: number; vz: number; // velocity (wander)
  size: number;
}

const PARTICLE_COUNT = 180;
const CONNECTION_DIST = 140;       // max distance for drawing connections
const FIELD_HALF = 700;            // world-space half-size

function makeParticles(): Particle[] {
  const pts: Particle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const x = (Math.random() - 0.5) * FIELD_HALF * 2;
    const y = (Math.random() - 0.5) * FIELD_HALF * 2;
    const z = (Math.random() - 0.5) * FIELD_HALF * 2;
    pts.push({
      x, y, z, ox: x, oy: y, oz: z,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      vz: (Math.random() - 0.5) * 0.15,
      size: 1.2 + Math.random() * 2.4,
    });
  }
  return pts;
}

export const SceneBackground: React.FC = () => {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const frameRef    = useRef<number>(0);
  const [smoothScroll, setSmoothScroll] = useState(0);
  const rafRef = useRef<number>(0);
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const timeRef     = useRef(0);
  const ptRef       = useRef<Particle[]>(makeParticles());
  const colorRef    = useRef<[number, number, number]>([139, 92, 246]);
  const targetColor = useRef<[number, number, number]>([139, 92, 246]);

  const { settings } = useSettings();

  /* update target color when theme changes */
  useEffect(() => {
    const c = ACCENT_COLORS[settings.themeAccent] ?? ACCENT_COLORS.violet;
    targetColor.current = c;
  }, [settings.themeAccent]);

  /* track scroll */
  useEffect(() => {
    const onScroll = () => {
      targetScroll.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─── main draw loop ─────────────────────────────────────────────────── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    /* smooth color interpolation */
    const cc = colorRef.current;
    const tc = targetColor.current;
    cc[0] = lerp(cc[0], tc[0], 0.025);
    cc[1] = lerp(cc[1], tc[1], 0.025);
    cc[2] = lerp(cc[2], tc[2], 0.025);
    const [r, g, b] = cc.map(Math.round);

    timeRef.current += 0.004;
    const t = timeRef.current;

    /* smooth scroll interpolation */
    currentScroll.current = lerp(currentScroll.current, targetScroll.current, 0.06);
    const scrollFrac = Math.min(currentScroll.current / 3000, 1);
    const rotX = scrollFrac * 0.55;
    const rotY = t * 0.12 + scrollFrac * 0.3;
    const depth = 600 + scrollFrac * 300;

    /* clear */
    ctx.clearRect(0, 0, W, H);

    /* very subtle radial gradient background */
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
    bg.addColorStop(0,   `rgba(${r},${g},${b},0.04)`);
    bg.addColorStop(0.5, "rgba(3,3,10,0)");
    bg.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* ── project 3-D point → 2-D screen coord ── */
    const project = (px: number, py: number, pz: number): [number, number, number] => {
      // rotation around Y
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      let x1 = px * cosY + pz * sinY;
      let z1 = -px * sinY + pz * cosY;

      // rotation around X
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      let y1 = py * cosX - z1 * sinX;
      let z2 = py * sinX + z1 * cosX;

      // perspective divide
      // guard against points behind the camera (depth + z2 <= 0), which
      // would otherwise flip fov negative and corrupt every size/position
      // derived from it downstream (radius, radius * 3.5, etc.)
      const denom = depth + z2;
      const fov = denom > 0.0001 ? depth / denom : 0;
      const sx = cx + x1 * fov;
      const sy = cy + y1 * fov;
      return [sx, sy, fov];
    };

    /* ── update & collect projected particles ── */
    const projected: { sx: number; sy: number; fov: number; p: Particle }[] = [];

    for (const p of ptRef.current) {
      // gentle wander
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;

      // elastic pull back toward origin (soft boundary)
      p.vx += (p.ox - p.x) * 0.0008;
      p.vy += (p.oy - p.y) * 0.0008;
      p.vz += (p.oz - p.z) * 0.0008;
      p.vx *= 0.995;
      p.vy *= 0.995;
      p.vz *= 0.995;

      const [sx, sy, fov] = project(p.x, p.y, p.z);
      projected.push({ sx, sy, fov, p });
    }

    /* ── draw connections ── */
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const a = projected[i];
        const b = projected[j];
        if (a.fov <= 0 || b.fov <= 0) continue; // skip points behind the camera
        const dx = a.sx - b.sx;
        const dy = a.sy - b.sy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * Math.min(a.fov, b.fov) * 0.5;
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
          ctx.lineWidth = alpha * 1.2;
          ctx.stroke();
        }
      }
    }

    /* ── draw particles ── */
    for (const { sx, sy, fov, p } of projected) {
      if (fov <= 0) continue; // behind the camera this frame — skip entirely

      const radius = p.size * fov;
      const alpha = Math.min(fov * 0.85, 0.85);

      const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius * 3.5);
      grd.addColorStop(0,   `rgba(${r},${g},${b},${(alpha * 0.4).toFixed(3)})`);
      grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(sx, sy, radius * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // core dot
      ctx.beginPath();
      ctx.arc(sx, sy, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.round(lerp(r, 255, 0.55))},${Math.round(lerp(g, 255, 0.55))},${Math.round(lerp(b, 255, 0.55))},${alpha.toFixed(3)})`;
      ctx.fill();
    }

    /* ── draw grid floor ── */
    const gridSize = 10;
    const gridSpacing = 120;
    const gridAlpha = 0.07 + scrollFrac * 0.06;
    ctx.strokeStyle = `rgba(${r},${g},${b},${gridAlpha})`;
    ctx.lineWidth = 0.5;

    for (let xi = -gridSize; xi <= gridSize; xi++) {
      const [sx1, sy1] = project(xi * gridSpacing, FIELD_HALF * 0.5, -gridSize * gridSpacing);
      const [sx2, sy2] = project(xi * gridSpacing, FIELD_HALF * 0.5,  gridSize * gridSpacing);
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(sx2, sy2);
      ctx.stroke();
    }
    for (let zi = -gridSize; zi <= gridSize; zi++) {
      const [sx1, sy1] = project(-gridSize * gridSpacing, FIELD_HALF * 0.5, zi * gridSpacing);
      const [sx2, sy2] = project( gridSize * gridSpacing, FIELD_HALF * 0.5, zi * gridSpacing);
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(sx2, sy2);
      ctx.stroke();
    }

    frameRef.current = requestAnimationFrame(draw);
  }, []);

  /* ─── resize handler ─────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    frameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
      style={{ mixBlendMode: "screen" }}
    />
  );
};