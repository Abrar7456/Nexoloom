"use client";

import React, { useEffect, useState } from "react";
import { dbService } from "@/lib/db";
import { SiteSettings } from "@/lib/mockData";
import { toast } from "react-hot-toast";
import { Save, Settings, ShieldAlert, Sparkles } from "lucide-react";

export default function SettingsCMSPage() {
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
                <select
                  value={settings.themeAccent}
                  onChange={(e) => setSettings({ ...settings, themeAccent: e.target.value })}
                  className="w-full px-4 py-3 text-xs text-slate-300 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="violet">Violet Accent (Purple Glow)</option>
                  <option value="indigo">Indigo Accent (Sleek Slate)</option>
                  <option value="blue">Blue Accent (Corporate Tech)</option>
                  <option value="emerald">Emerald Accent (Organic Growth)</option>
                </select>
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
