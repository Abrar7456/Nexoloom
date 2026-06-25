"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { dbService } from "@/lib/db";
import { SiteSettings, defaultSettings } from "@/lib/seedData";

const CACHE_KEY = "nx_settings_cache";
const CACHE_VERSION = "v2";

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refresh: async () => {},
});

export const useSettings = () => useContext(SettingsContext);

function readCache(): SiteSettings | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.__version !== CACHE_VERSION) return null;
    return parsed.data as SiteSettings;
  } catch {
    return null;
  }
}

function writeCache(data: SiteSettings) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ __version: CACHE_VERSION, data }));
  } catch {}
}

/**
 * Compute a <style> string from an accent color name.
 * This is a pure function — identical output for identical input, on both server and client.
 */
function getThemeStyles(accent: string): string {
  const themes: Record<string, [string, string, string, string, string, string, string]> = {
    // [rgb, hex, c400, c500, c600, s400, s500, s600] (7 values)
    violet:  ["139,92,246",  "#8b5cf6", "#a78bfa", "#8b5cf6", "#7c3aed", "#60a5fa", "#3b82f6"],
    indigo:  ["99,102,241",  "#6366f1", "#818cf8", "#6366f1", "#4f46e5", "#94a3b8", "#64748b"],
    blue:    ["59,130,246",  "#3b82f6", "#60a5fa", "#3b82f6", "#2563eb", "#67e8f9", "#06b6d4"],
    emerald: ["16,185,129",  "#10b981", "#34d399", "#10b981", "#059669", "#2dd4bf", "#14b8a6"],
    rose:    ["244,63,94",   "#f43f5e", "#fb7185", "#f43f5e", "#e11d48", "#fb923c", "#f97316"],
    cyan:    ["6,182,212",   "#06b6d4", "#22d3ee", "#06b6d4", "#0891b2", "#60a5fa", "#3b82f6"],
    amber:   ["245,158,11",  "#f59e0b", "#fbbf24", "#f59e0b", "#d97706", "#facc15", "#eab308"],
  };

  const t = themes[accent] ?? themes.violet;
  const [rgb, hex, c400, c500, c600, s400, s500] = t;

  return `
    :root{--primary-accent:${hex};--primary-accent-rgb:${rgb};--secondary-accent:${s500};--color-violet-400:${c400};--color-violet-500:${c500};--color-violet-600:${c600};--color-blue-400:${s400};--color-blue-500:${s500}}
    .text-violet-400{color:var(--color-violet-400)!important}
    .text-violet-500{color:var(--color-violet-500)!important}
    .bg-violet-500{background-color:var(--color-violet-500)!important}
    .bg-violet-600{background-color:var(--color-violet-600)!important}
    .border-violet-500{border-color:var(--color-violet-500)!important}
    .ring-violet-500{--tw-ring-color:var(--color-violet-500)!important}
    .from-violet-600{--tw-gradient-from:var(--color-violet-600) var(--tw-gradient-from-position)!important}
    .via-violet-500{--tw-gradient-via:var(--color-violet-500) var(--tw-gradient-via-position)!important}
    .to-violet-400{--tw-gradient-to:var(--color-violet-400) var(--tw-gradient-to-position)!important}
    .to-blue-500{--tw-gradient-to:var(--color-blue-500) var(--tw-gradient-to-position)!important}
    .to-blue-600{--tw-gradient-to:var(--color-blue-600) var(--tw-gradient-to-position)!important}
    .from-blue-600{--tw-gradient-from:var(--color-blue-600) var(--tw-gradient-from-position)!important}
    .text-blue-400{color:var(--color-blue-400)!important}
    .fill-violet-500{fill:var(--color-violet-500)!important}
    .shadow-violet-500\\/25{--tw-shadow-color:rgba(${rgb},0.25)!important}
    .shadow-violet-500\\/50{--tw-shadow-color:rgba(${rgb},0.50)!important}
    .glow-purple{box-shadow:0 0 40px -5px rgba(${rgb},0.25)}
    .text-gradient{background:linear-gradient(135deg,${c400} 0%,${s500} 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  `;
}

export { getThemeStyles };

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always start with defaultSettings — same on server AND client, no hydration mismatch
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  // Track whether we've hydrated (mounted on client)
  const [mounted, setMounted] = useState(false);

  const fetchAndApply = async () => {
    try {
      const data = await dbService.getSettings();
      setSettings(data);
      writeCache(data);
    } catch (error) {
      console.error("Failed to load settings from Firestore:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    // First: apply localStorage cache instantly (no network wait)
    const cached = readCache();
    if (cached) {
      setSettings(cached);
      setLoading(false);
    }
    // Then: always refresh from Firestore in the background
    fetchAndApply();
  }, []);

  // On the server (and on first client render before mount), always emit the
  // default violet theme so server HTML === initial client HTML. After mount,
  // the real (cached / fetched) accent is used.
  const accent = mounted ? settings.themeAccent : defaultSettings.themeAccent;

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh: fetchAndApply }}>
      {/* suppressHydrationWarning is a safety net; the mounted gate above should
          already prevent mismatches, but this stops React from throwing even if
          the accent happens to differ between render passes. */}
      <style id="nx-theme" suppressHydrationWarning>
        {getThemeStyles(accent)}
      </style>
      {children}
    </SettingsContext.Provider>
  );
};
