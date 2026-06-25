"use client";

import React from "react";

/* ============================================================
   ANIMATED LOGO — Geometric 'A' that draws itself on load
   ============================================================ */
export const AnimatedLogo: React.FC<{ className?: string; size?: number }> = ({
  className = "",
  size = 48,
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <filter id="logoGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Outer triangle */}
      <path
        d="M50 5 L95 90 L5 90 Z"
        fill="url(#logoGrad)"
        stroke="url(#logoGrad)"
        strokeWidth="2"
        strokeLinejoin="round"
        filter="url(#logoGlow)"
        className="animate-draw-stroke animate-fill-in"
      />
      {/* Inner inverted triangle */}
      <path
        d="M50 40 L30 75 L70 75 Z"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.6"
        className="animate-draw-stroke"
        style={{ animationDelay: "0.8s" }}
      />
      {/* Horizontal bar of A */}
      <line
        x1="32"
        y1="68"
        x2="68"
        y2="68"
        stroke="white"
        strokeWidth="2"
        opacity="0.4"
        className="animate-draw-stroke"
        style={{ animationDelay: "1.2s" }}
      />
    </svg>
  );
};

/* ============================================================
   FLOATING SHAPES — Geometric SVGs floating with CSS keyframes
   ============================================================ */
export const FloatingShapes: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Triangle */}
      <svg
        className="absolute top-[15%] left-[8%] w-16 h-16 animate-float-1 opacity-20 dark:opacity-15"
        viewBox="0 0 64 64"
      >
        <defs>
          <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <polygon
          points="32,4 60,58 4,58"
          fill="url(#triGrad)"
          opacity="0.5"
        />
      </svg>

      {/* Hexagon */}
      <svg
        className="absolute top-[60%] right-[12%] w-20 h-20 animate-float-2 opacity-15 dark:opacity-10"
        viewBox="0 0 80 80"
      >
        <defs>
          <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <polygon
          points="40,5 72,22 72,58 40,75 8,58 8,22"
          fill="url(#hexGrad)"
          opacity="0.4"
        />
      </svg>

      {/* Circle ring */}
      <svg
        className="absolute top-[30%] right-[25%] w-12 h-12 animate-float-3 opacity-25 dark:opacity-15"
        viewBox="0 0 48 48"
      >
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2"
          opacity="0.6"
        />
        <circle
          cx="24"
          cy="24"
          r="10"
          fill="#8b5cf6"
          opacity="0.15"
        />
      </svg>

      {/* Diamond */}
      <svg
        className="absolute bottom-[25%] left-[20%] w-14 h-14 animate-float-4 opacity-20 dark:opacity-12"
        viewBox="0 0 56 56"
      >
        <defs>
          <linearGradient id="diaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <rect
          x="14"
          y="14"
          width="28"
          height="28"
          rx="4"
          fill="url(#diaGrad)"
          opacity="0.35"
          transform="rotate(45 28 28)"
        />
      </svg>

      {/* Small cross / plus */}
      <svg
        className="absolute top-[70%] left-[60%] w-10 h-10 animate-float-5 opacity-20 dark:opacity-15"
        viewBox="0 0 40 40"
      >
        <line x1="20" y1="5" x2="20" y2="35" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
        <line x1="5" y1="20" x2="35" y2="20" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      </svg>

      {/* Small circle dot */}
      <svg
        className="absolute top-[45%] left-[75%] w-6 h-6 animate-float-1 opacity-30 dark:opacity-20"
        viewBox="0 0 24 24"
        style={{ animationDelay: "5s" }}
      >
        <circle cx="12" cy="12" r="8" fill="#6366f1" opacity="0.4" />
      </svg>
    </div>
  );
};

/* ============================================================
   WAVE DIVIDER — Animated undulating SVG separator
   ============================================================ */
export const WaveDivider: React.FC<{ flip?: boolean; className?: string }> = ({
  flip = false,
  className = "",
}) => {
  return (
    <div
      className={`relative w-full overflow-hidden h-16 md:h-24 ${
        flip ? "rotate-180" : ""
      } ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 128"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full animate-wave-undulate"
      >
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <path
          d="M0,64 C120,90 240,30 360,64 C480,98 600,30 720,64 C840,98 960,30 1080,64 C1200,98 1320,30 1440,64 L1440,128 L0,128 Z"
          fill="url(#waveGrad)"
        />
      </svg>
      {/* Second layer for depth */}
      <svg
        viewBox="0 0 1440 128"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full animate-wave-undulate"
        style={{ animationDelay: "-4s" }}
      >
        <path
          d="M0,80 C160,50 320,100 480,70 C640,40 800,90 960,60 C1120,30 1280,80 1440,50 L1440,128 L0,128 Z"
          fill="url(#waveGrad)"
          opacity="0.5"
        />
      </svg>
    </div>
  );
};

/* ============================================================
   MORPHING BLOB — Organic shape that continuously morphs
   ============================================================ */
export const MorphingBlob: React.FC<{
  className?: string;
  size?: number;
}> = ({ className = "", size = 400 }) => {
  return (
    <div
      className={`animate-morph-blob ${className}`}
      style={{
        width: size,
        height: size,
        background:
          "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.12) 50%, rgba(6,182,212,0.08) 100%)",
        filter: "blur(40px)",
      }}
      aria-hidden="true"
    />
  );
};

/* ============================================================
   CIRCUIT PATTERN — Constellation / circuit board pattern
   ============================================================ */
export const CircuitPattern: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const nodes = [
    { cx: 60, cy: 40 },
    { cx: 180, cy: 70 },
    { cx: 120, cy: 150 },
    { cx: 280, cy: 50 },
    { cx: 320, cy: 130 },
    { cx: 200, cy: 180 },
    { cx: 400, cy: 80 },
    { cx: 50, cy: 160 },
    { cx: 360, cy: 170 },
    { cx: 240, cy: 110 },
  ];

  const connections = [
    [0, 1], [1, 3], [1, 2], [2, 5], [3, 4],
    [4, 6], [5, 8], [0, 7], [7, 2], [3, 9],
    [9, 5], [4, 8], [6, 8],
  ];

  return (
    <svg
      viewBox="0 0 450 220"
      className={`w-full h-auto opacity-20 dark:opacity-10 ${className}`}
      aria-hidden="true"
    >
      {/* Connection lines */}
      {connections.map(([a, b], idx) => (
        <line
          key={`conn-${idx}`}
          x1={nodes[a].cx}
          y1={nodes[a].cy}
          x2={nodes[b].cx}
          y2={nodes[b].cy}
          stroke="url(#circuitLineGrad)"
          strokeWidth="1"
          className="animate-circuit-dash"
          style={{ animationDelay: `${idx * 0.3}s` }}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node, idx) => (
        <g key={`node-${idx}`}>
          {/* Outer glow */}
          <circle
            cx={node.cx}
            cy={node.cy}
            r="8"
            fill="rgba(139,92,246,0.15)"
            className="animate-node-pulse"
            style={{ animationDelay: `${idx * 0.4}s` }}
          />
          {/* Core dot */}
          <circle
            cx={node.cx}
            cy={node.cy}
            r="3"
            fill="#8b5cf6"
            className="animate-node-pulse"
            style={{ animationDelay: `${idx * 0.4}s` }}
          />
        </g>
      ))}

      <defs>
        <linearGradient id="circuitLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/* ============================================================
   GLOWING ORB — Radial gradient circle with glow pulses
   ============================================================ */
export const GlowingOrb: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className = "", size = 120, color = "#8b5cf6" }) => {
  return (
    <div
      className={`animate-pulse-glow rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 40% 40%, ${color}40, ${color}15, transparent 70%)`,
        boxShadow: `0 0 60px ${color}20, 0 0 120px ${color}10`,
      }}
      aria-hidden="true"
    />
  );
};

/* ============================================================
   SECTION DECORATION — A decorative SVG accent for section tops
   ============================================================ */
export const SectionDecoration: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <svg
      viewBox="0 0 200 20"
      className={`w-48 h-5 mx-auto ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="decoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1="10" x2="200" y2="10" stroke="url(#decoGrad)" strokeWidth="1" />
      <circle cx="100" cy="10" r="3" fill="#8b5cf6" opacity="0.5" />
      <circle cx="80" cy="10" r="1.5" fill="#6366f1" opacity="0.3" />
      <circle cx="120" cy="10" r="1.5" fill="#3b82f6" opacity="0.3" />
    </svg>
  );
};
