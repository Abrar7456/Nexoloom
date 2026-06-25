"use client";

import React, { useEffect, useState } from "react";
import { dbService } from "@/lib/db";
import { Service } from "@/lib/mockData";
import { toast } from "react-hot-toast";
import { Edit2, HelpCircle, Save, ShoppingBag, TrendingUp, Palette, Trash2, Plus, X } from "lucide-react";

const iconOptions = ["ShoppingBag", "TrendingUp", "Palette"];

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  ShoppingBag: ShoppingBag,
  TrendingUp: TrendingUp,
  Palette: Palette,
};

export default function ServicesCMSPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newSubService, setNewSubService] = useState("");

  const fetchServices = async () => {
    try {
      const data = await dbService.getServices();
      setServices(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load services database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service: Service) => {
    setEditingService({ ...service });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      const { id, ...rest } = editingService;
      await dbService.saveService(id, rest);
      toast.success("Service changes saved.");
      setEditingService(null);
      fetchServices();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update service details.");
    }
  };

  const handleAddSub = () => {
    if (!newSubService || !editingService) return;
    const subs = [...(editingService.subServices || [])];
    if (subs.includes(newSubService)) {
      toast.error("Sub-service already exists.");
      return;
    }
    subs.push(newSubService);
    setEditingService({ ...editingService, subServices: subs });
    setNewSubService("");
  };

  const handleRemoveSub = (sub: string) => {
    if (!editingService) return;
    const subs = (editingService.subServices || []).filter((s) => s !== sub);
    setEditingService({ ...editingService, subServices: subs });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Querying agency capabilities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Capabilities Manager</h1>
        <p className="text-xs text-slate-400 font-medium tracking-wide mt-1 uppercase">
          Modify core services descriptions and individual sub-offerings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Services lists */}
        <div className="lg:col-span-6 space-y-4">
          {services.map((s) => {
            const IconComp = iconMap[s.icon] || HelpCircle;
            return (
              <div key={s.id} className="glass-card rounded-2xl p-6 flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="p-3.5 bg-slate-900 border border-slate-800 text-violet-400 rounded-xl shrink-0">
                    <IconComp size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white tracking-tight">{s.title}</h3>
                    <p className="text-xs text-slate-400 font-light mt-1 mb-4 leading-relaxed">{s.description}</p>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {s.subServices.map((sub, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-slate-950 border border-slate-900 text-[10px] text-slate-400 font-semibold rounded-lg">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleEdit(s)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl border border-transparent hover:border-slate-800 transition-all shrink-0 cursor-pointer"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Side: Editor Drawer/Block */}
        <div className="lg:col-span-6">
          {editingService ? (
            <form onSubmit={handleSave} className="glass-card rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Editing: {editingService.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Service Title</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 font-bold"
                  required
                />
              </div>

              {/* Icon dropdown */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Service Icon</label>
                <select
                  value={editingService.icon}
                  onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                  className="w-full px-4 py-3 text-xs text-slate-300 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Capabilities Bio</label>
                <textarea
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 leading-relaxed font-light"
                  required
                />
              </div>

              {/* Sub-services list editor */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Sub-offerings List</label>
                
                {/* Text input to add new */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubService}
                    onChange={(e) => setNewSubService(e.target.value)}
                    placeholder="Add e.g. Shopify Custom Liquid"
                    className="w-full px-4 py-2.5 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSub}
                    className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wide cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {/* Listing current subservices with delete icon */}
                <div className="space-y-1.5 pt-2">
                  {editingService.subServices?.map((sub, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-900 text-xs text-slate-300 font-light">
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSub(sub)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold tracking-wide text-xs flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg hover:shadow-violet-500/20 transition-all duration-300 cursor-pointer"
              >
                <Save size={14} />
                Save Changes
              </button>
            </form>
          ) : (
            <div className="h-64 rounded-2xl bg-slate-950/20 border border-slate-900 border-dashed flex flex-col items-center justify-center text-slate-500 text-center p-6">
              <Edit2 size={24} className="opacity-30 mb-3" />
              <p className="text-xs">Select a service category card to modify contents.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
