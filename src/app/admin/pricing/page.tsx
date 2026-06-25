"use client";

import React, { useEffect, useState } from "react";
import { dbService } from "@/lib/db";
import { PricingTier } from "@/lib/seedData";
import { toast } from "react-hot-toast";
import {
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Save,
  X,
  Check,
  Award
} from "lucide-react";

export default function PricingCMSPage() {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTier, setEditingTier] = useState<Partial<PricingTier> | null>(null);
  const [newFeature, setNewFeature] = useState("");

  const fetchPricing = async () => {
    try {
      const data = await dbService.getPricing();
      setTiers(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load pricing database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const handleCreateNew = () => {
    setEditingTier({
      name: "",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [],
      isPopular: false,
      order: tiers.length + 1
    });
  };

  const handleEdit = (tier: PricingTier) => {
    setEditingTier({ ...tier });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this pricing plan?")) return;
    try {
      await dbService.deletePricingTier(id);
      toast.success("Pricing plan deleted.");
      fetchPricing();
    } catch (e) {
      console.error(e);
      toast.error("Deletion failed.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTier || !editingTier.name) {
      toast.error("Plan Name is required.");
      return;
    }

    try {
      const payload: Omit<PricingTier, "id"> = {
        name: editingTier.name,
        monthlyPrice: Number(editingTier.monthlyPrice || 0),
        yearlyPrice: Number(editingTier.yearlyPrice || 0),
        features: editingTier.features || [],
        isPopular: !!editingTier.isPopular,
        order: editingTier.order || 1
      };

      await dbService.savePricingTier(editingTier.id || null, payload);
      toast.success("Pricing tier saved.");
      setEditingTier(null);
      fetchPricing();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save plan changes.");
    }
  };

  const handleAddFeature = () => {
    if (!newFeature || !editingTier) return;
    const feats = [...(editingTier.features || [])];
    if (feats.includes(newFeature)) {
      toast.error("Feature parameter already listed.");
      return;
    }
    feats.push(newFeature);
    setEditingTier({ ...editingTier, features: feats });
    setNewFeature("");
  };

  const handleRemoveFeature = (feat: string) => {
    if (!editingTier) return;
    const feats = (editingTier.features || []).filter((f) => f !== feat);
    setEditingTier({ ...editingTier, features: feats });
  };

  const handleShiftOrder = async (index: number, direction: "up" | "down") => {
    const list = [...tiers];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    // Swap items
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    // Re-index order field
    try {
      setTiers(list);
      for (let i = 0; i < list.length; i++) {
        const { id, name, monthlyPrice, yearlyPrice, features, isPopular } = list[i];
        await dbService.savePricingTier(id, {
          name, monthlyPrice, yearlyPrice, features, isPopular, order: i + 1
        });
      }
      toast.success("Ordering alignment updated.");
      fetchPricing();
    } catch (e) {
      console.error(e);
      toast.error("Ordering alignment failed.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Querying billing matrices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Pricing Plan Settings</h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide mt-1 uppercase">
            Adjust monthly/yearly pricing rates, features metrics, and highlighting indicators
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Plus size={14} />
          Add Tier
        </button>
      </div>

      {/* Pricing list table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase tracking-wider bg-slate-950/40">
                <th className="p-4">Billing Plan</th>
                <th className="p-4">Monthly Rate</th>
                <th className="p-4">Yearly Rate</th>
                <th className="p-4">Position</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/50">
              {tiers.map((tier, index) => (
                <tr key={tier.id} className="text-slate-300 hover:bg-slate-950/20 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <span className="font-bold text-white text-sm">{tier.name}</span>
                    {tier.isPopular && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        <Award size={10} /> Popular
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    ${tier.monthlyPrice.toLocaleString()}/mo
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-400">
                    ${tier.yearlyPrice.toLocaleString()}/mo
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-slate-400">
                      <span className="font-bold mr-2 text-slate-300">#{tier.order}</span>
                      <button
                        onClick={() => handleShiftOrder(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => handleShiftOrder(index, "down")}
                        disabled={index === tiers.length - 1}
                        className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEdit(tier)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
                        title="Edit tier rates"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(tier.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors"
                        title="Delete plan"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer Editor Panel */}
      {editingTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="absolute inset-0 bg-[#06060a]/80 backdrop-blur-sm" onClick={() => setEditingTier(null)} />
          <div className="relative w-full max-w-lg bg-[#0a0a0f] border-l border-slate-900 h-full shadow-2xl p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <h3 className="text-lg font-black text-white tracking-tight">
                  {editingTier.id ? "Edit Billing Tier" : "New Billing Tier"}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingTier(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Name */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Plan Name</label>
                <input
                  type="text"
                  value={editingTier.name || ""}
                  onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                  placeholder="Growth Package"
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all font-bold"
                  required
                />
              </div>

              {/* Price rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Monthly Amount ($)</label>
                  <input
                    type="number"
                    value={editingTier.monthlyPrice || ""}
                    onChange={(e) => setEditingTier({ ...editingTier, monthlyPrice: Number(e.target.value) })}
                    placeholder="2499"
                    className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Yearly Amount (Monthly basis $)</label>
                  <input
                    type="number"
                    value={editingTier.yearlyPrice || ""}
                    onChange={(e) => setEditingTier({ ...editingTier, yearlyPrice: Number(e.target.value) })}
                    placeholder="1999"
                    className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all font-mono"
                    required
                  />
                </div>
              </div>

              {/* Highlight checkbox */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <input
                  type="checkbox"
                  id="pop-check"
                  checked={!!editingTier.isPopular}
                  onChange={(e) => setEditingTier({ ...editingTier, isPopular: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 focus:ring-violet-500 text-violet-600 cursor-pointer"
                />
                <label htmlFor="pop-check" className="text-xs font-semibold text-slate-300 cursor-pointer select-none">
                  Highlight as "Most Popular" on the Marketing Website
                </label>
              </div>

              {/* Features list tags editor */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Deliverables & Features</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="e.g. Weekly SEO sync reports"
                    className="w-full px-4 py-2.5 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wide cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 pt-2 max-h-[220px] overflow-y-auto pr-1">
                  {editingTier.features?.map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-900 text-xs text-slate-300 font-light">
                      <div className="flex items-center gap-2">
                        <Check size={12} className="text-violet-400" />
                        <span>{feat}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feat)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-900 pt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTier(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 transition-colors text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <Save size={12} />
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
