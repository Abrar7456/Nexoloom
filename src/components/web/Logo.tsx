"use client";

import React, { useRef, useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";

// SVG Logo Icons — each is a mini animated SVG art piece
const LogoIconCircuit: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="5" stroke="white" strokeWidth="1.5" />
    <circle cx="14" cy="14" r="2" fill="white" />
    {/* Circuit lines */}
    <line x1="14" y1="2" x2="14" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="14" y1="19" x2="14" y2="26" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2" y1="14" x2="9" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="19" y1="14" x2="26" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    {/* Corner nodes */}
    <circle cx="14" cy="2" r="1.5" fill="white" fillOpacity="0.7" />
    <circle cx="14" cy="26" r="1.5" fill="white" fillOpacity="0.7" />
    <circle cx="2" cy="14" r="1.5" fill="white" fillOpacity="0.7" />
    <circle cx="26" cy="14" r="1.5" fill="white" fillOpacity="0.7" />
    {/* Diagonal accents */}
    <line x1="6" y1="6" x2="9.8" y2="9.8" stroke="white" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />
    <line x1="22" y1="6" x2="18.2" y2="9.8" stroke="white" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />
    <line x1="6" y1="22" x2="9.8" y2="18.2" stroke="white" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />
    <line x1="22" y1="22" x2="18.2" y2="18.2" stroke="white" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />
  </svg>
);

const LogoIconSphere: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="11" stroke="white" strokeWidth="1.5" />
    {/* Horizontal ellipse */}
    <ellipse cx="14" cy="14" rx="11" ry="5" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
    {/* Vertical ellipse */}
    <ellipse cx="14" cy="14" rx="5" ry="11" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
    {/* Poles */}
    <line x1="14" y1="3" x2="14" y2="25" stroke="white" strokeWidth="0.75" strokeOpacity="0.3" />
    <line x1="3" y1="14" x2="25" y2="14" stroke="white" strokeWidth="0.75" strokeOpacity="0.3" />
    <circle cx="14" cy="14" r="2" fill="white" />
  </svg>
);

const LogoIconTriangle: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer triangle */}
    <polygon points="14,3 25,24 3,24" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    {/* Inner triangle (inverted) */}
    <polygon points="14,21 8,10 20,10" stroke="white" strokeWidth="1" strokeLinejoin="round" fill="white" fillOpacity="0.15" />
    {/* Center dot */}
    <circle cx="14" cy="14.5" r="2" fill="white" />
    {/* Corner glows */}
    <circle cx="14" cy="3" r="1.5" fill="white" fillOpacity="0.8" />
    <circle cx="25" cy="24" r="1.5" fill="white" fillOpacity="0.8" />
    <circle cx="3" cy="24" r="1.5" fill="white" fillOpacity="0.8" />
  </svg>
);

const LogoIconText: React.FC<{ acronym: string }> = ({ acronym }) => (
  <span className="text-white font-black text-sm tracking-tighter leading-none">{acronym}</span>
);

export const Logo: React.FC<{ className?: string; size?: "sm" | "md" | "lg" }> = ({
  className = "",
  size = "md",
}) => {
  const { settings } = useSettings();
  const { logoStyle, title } = settings;

  const words = title.split(" ");
  const firstName = words[0] || "NEXOLOOM";
  const restName = words.slice(1).join(" ");

  const acronym = words
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "NX";

  const iconSize = size === "lg" ? 32 : size === "sm" ? 20 : 26;
  const containerPad = size === "lg" ? "p-2.5" : size === "sm" ? "p-1.5" : "p-2";
  const textSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";
  const subSize = size === "sm" ? "text-[8px]" : "text-[9px]";

  return (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {/* Logo Icon */}
      <div
        className={`relative ${containerPad} rounded-xl bg-gradient-to-br from-violet-600 via-violet-500 to-blue-500 shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/60 transition-all duration-500 group-hover:scale-110 shrink-0 overflow-hidden`}
      >
        {/* Inner shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-xl" />
        {/* Animated ring on hover */}
        <div className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 transition-colors duration-300" />

        {logoStyle === "circuit" && <LogoIconCircuit size={iconSize} />}
        {logoStyle === "sphere" && <LogoIconSphere size={iconSize} />}
        {logoStyle === "triangle" && <LogoIconTriangle size={iconSize} />}
        {logoStyle === "text" && <LogoIconText acronym={acronym} />}
      </div>

      {/* Brand Name */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`font-black tracking-tight ${textSize} bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:from-violet-200 group-hover:via-white group-hover:to-blue-200 transition-all duration-500`}
        >
          {firstName}
        </span>
        {restName && (
          <span className={`${subSize} font-semibold tracking-[0.2em] text-violet-400 uppercase mt-0.5 group-hover:text-violet-300 transition-colors duration-300`}>
            {restName}
          </span>
        )}
      </div>
    </div>
  );
};
