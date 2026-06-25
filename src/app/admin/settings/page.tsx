"use client";

import React, { useEffect, useState } from "react";
import { dbService } from "@/lib/db";
import { SiteSettings } from "@/lib/seedData";
import { toast } from "react-hot-toast";
import { Save, Settings, ShieldAlert, Sparkles } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function SettingsCMSPage() {
  const { refresh } = useSettings();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await dbService.getSettings();
        setSettings(data);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load site configurations.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      await dbService.saveSettings(settings);
      // Refresh context cache so theme/logo apply immediately on the page
      await refresh();
      toast.success("Site settings applied successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update site settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleKeywordChange = (value: string) => {
    if (!settings) return;
    const list = value.split(",").map((kw) => kw.trim()).filter((kw) => !!kw);
    setSettings({ ...settings, seoKeywords: list });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Retrieving configurations...</p>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Site Configuration</h1>
        <p className="text-xs text-slate-400 font-medium tracking-wide mt-1 uppercase">
          Manage branding metadata, contact points, SEO parameters, and accents
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: General branding and SEO */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* General Branding */}
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-violet-400" />
              General Branding
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Agency Title Name</label>
                <input
                  type="text"
                  value={settings.title}
                  onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                  placeholder="Apex Digital"
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Color Preset Accent</label>
                <div className="grid grid-cols-4 gap-2 mb-5">
                  {[
                    { value: "violet", label: "Violet", from: "from-violet-600", to: "to-blue-500", glow: "shadow-violet-500/30" },
                    { value: "indigo", label: "Indigo", from: "from-indigo-600", to: "to-slate-500", glow: "shadow-indigo-500/30" },
                    { value: "blue", label: "Blue", from: "from-blue-600", to: "to-cyan-500", glow: "shadow-blue-500/30" },
                    { value: "emerald", label: "Emerald", from: "from-emerald-500", to: "to-teal-500", glow: "shadow-emerald-500/30" },
                    { value: "rose", label: "Rose", from: "from-rose-500", to: "to-orange-500", glow: "shadow-rose-500/30" },
                    { value: "cyan", label: "Cyan", from: "from-cyan-500", to: "to-blue-500", glow: "shadow-cyan-500/30" },
                    { value: "amber", label: "Amber", from: "from-amber-500", to: "to-yellow-400", glow: "shadow-amber-500/30" },
                  ].map((accent) => (
                    <button
                      key={accent.value}
                      type="button"
                      onClick={() => setSettings({ ...settings, themeAccent: accent.value })}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${
                        settings.themeAccent === accent.value
                          ? "border-white/30 bg-white/5 scale-105"
                          : "border-slate-800 hover:border-slate-600"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${accent.from} ${accent.to} shadow-md ${settings.themeAccent === accent.value ? accent.glow : ""}`} />
                      <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">{accent.label}</span>
                    </button>
                  ))}
                </div>

                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Logo Icon Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "circuit", label: "Circuit", desc: "Precision nodes",
                      icon: (
                        <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                          <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" />
                          <circle cx="14" cy="14" r="2" fill="currentColor" />
                          <line x1="14" y1="2" x2="14" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="14" y1="19" x2="14" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="2" y1="14" x2="9" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="19" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <circle cx="14" cy="2" r="1.5" fill="currentColor" fillOpacity="0.6" />
                          <circle cx="14" cy="26" r="1.5" fill="currentColor" fillOpacity="0.6" />
                          <circle cx="2" cy="14" r="1.5" fill="currentColor" fillOpacity="0.6" />
                          <circle cx="26" cy="14" r="1.5" fill="currentColor" fillOpacity="0.6" />
                        </svg>
                      )
                    },
                    { value: "sphere", label: "Sphere", desc: "Holographic orb",
                      icon: (
                        <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                          <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.5" />
                          <ellipse cx="14" cy="14" rx="11" ry="5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
                          <ellipse cx="14" cy="14" rx="5" ry="11" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
                          <circle cx="14" cy="14" r="2" fill="currentColor" />
                        </svg>
                      )
                    },
                    { value: "triangle", label: "Prism", desc: "Geometric prism",
                      icon: (
                        <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                          <polygon points="14,3 25,24 3,24" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                          <polygon points="14,21 8,10 20,10" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" />
                          <circle cx="14" cy="14.5" r="2" fill="currentColor" />
                        </svg>
                      )
                    },
                    { value: "text", label: "Text", desc: "Monogram only",
                      icon: (
                        <span className="text-lg font-black tracking-tighter leading-none">NX</span>
                      )
                    },
                  ].map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => setSettings({ ...settings, logoStyle: style.value as any })}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        settings.logoStyle === style.value
                          ? "border-violet-500/50 bg-violet-600/10 text-violet-400"
                          : "border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-white/2"
                      }`}
                    >
                      <div className="w-8 h-8 flex items-center justify-center shrink-0">{style.icon}</div>
                      <div>
                        <div className="text-[11px] font-bold tracking-wide">{style.label}</div>
                        <div className="text-[9px] text-slate-500">{style.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-3">Contact Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Primary Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  placeholder="hello@company.com"
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Primary Phone</label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Office Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="100 Innovation St, Suite A, SF"
                className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Social connections */}
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-3">Social Link Matrix</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">LinkedIn URL</label>
                <input
                  type="text"
                  value={settings.socialLinks.linkedin}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, linkedin: e.target.value }
                    })
                  }
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">GitHub URL</label>
                <input
                  type="text"
                  value={settings.socialLinks.github}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, github: e.target.value }
                    })
                  }
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Twitter URL</label>
                <input
                  type="text"
                  value={settings.socialLinks.twitter}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, twitter: e.target.value }
                    })
                  }
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: SEO Configurations & Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* SEO Parameters */}
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-3">Search Engine Optimization</h3>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Meta Description</label>
              <textarea
                value={settings.seoDescription}
                onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                rows={4}
                placeholder="Brief summary used by Google search crawlers..."
                className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all font-light leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Index Keywords</label>
              <input
                type="text"
                defaultValue={settings.seoKeywords.join(", ")}
                onBlur={(e) => handleKeywordChange(e.target.value)}
                placeholder="ecommerce, agency, branding, code"
                className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all"
              />
              <span className="text-[9px] text-slate-500 mt-1.5 block">Separate keywords with commas</span>
            </div>
          </div>

          {/* Action Module */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-3 flex items-center gap-2">
              <Settings size={16} />
              Save Configuration
            </h3>
            
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold tracking-wide text-xs flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg shadow-violet-500/10 hover:shadow-violet-500/25 transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
              ) : (
                <>
                  <Save size={14} />
                  Apply Parameters
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
