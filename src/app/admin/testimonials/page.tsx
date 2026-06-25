"use client";

import React, { useEffect, useState } from "react";
import { dbService } from "@/lib/db";
import { Testimonial } from "@/lib/seedData";
import { toast } from "react-hot-toast";
import {
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Save,
  X,
  Star
} from "lucide-react";

export default function TestimonialsCMSPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTest, setEditingTest] = useState<Partial<Testimonial> | null>(null);

  const fetchTestimonials = async () => {
    try {
      const data = await dbService.getTestimonials();
      setTestimonials(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load testimonials database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleCreateNew = () => {
    setEditingTest({
      clientName: "",
      company: "",
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
      message: "",
      rating: 5,
      order: testimonials.length + 1
    });
  };

  const handleEdit = (test: Testimonial) => {
    setEditingTest({ ...test });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial review?")) return;
    try {
      await dbService.deleteTestimonial(id);
      toast.success("Review deleted successfully.");
      fetchTestimonials();
    } catch (e) {
      console.error(e);
      toast.error("Deletion failed.");
    }
  };

  const handleCloudinaryUpload = () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!(window as any).cloudinary) {
      toast.error("Cloudinary SDK not loaded.");
      return;
    }

    if (!preset) {
      const manualUrl = prompt("Enter a client photo URL manually:", editingTest?.photoUrl);
      if (manualUrl) {
        setEditingTest((prev) => prev ? { ...prev, photoUrl: manualUrl } : null);
      }
      return;
    }

    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: preset,
        sources: ["local", "url", "camera"],
        multiple: false,
        cropping: true,
        croppingAspectRatio: 1, // square headshots
        clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          toast.success("Client photo uploaded successfully!");
          setEditingTest((prev) => prev ? { ...prev, photoUrl: result.info.secure_url } : null);
        }
      }
    );
    widget.open();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest || !editingTest.clientName || !editingTest.company || !editingTest.message) {
      toast.error("All text fields are required.");
      return;
    }

    try {
      const payload: Omit<Testimonial, "id"> = {
        clientName: editingTest.clientName,
        company: editingTest.company,
        photoUrl: editingTest.photoUrl || "",
        message: editingTest.message,
        rating: editingTest.rating || 5,
        order: editingTest.order || 1
      };

      await dbService.saveTestimonial(editingTest.id || null, payload);
      toast.success("Testimonial review saved.");
      setEditingTest(null);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes.");
    }
  };

  const handleShiftOrder = async (index: number, direction: "up" | "down") => {
    const list = [...testimonials];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    // Swap items
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    // Re-index order field
    try {
      setTestimonials(list);
      for (let i = 0; i < list.length; i++) {
        const { id, clientName, company, photoUrl, message, rating } = list[i];
        await dbService.saveTestimonial(id, {
          clientName, company, photoUrl, message, rating, order: i + 1
        });
      }
      toast.success("Ordering updated.");
      fetchTestimonials();
    } catch (e) {
      console.error(e);
      toast.error("Ordering alignment failed.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Querying testimonials directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Testimonials Manager</h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide mt-1 uppercase">
            Edit customer reviews, star ratings, and display hierarchy
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Plus size={14} />
          Add Testimonial
        </button>
      </div>

      {/* Reviews Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase tracking-wider bg-slate-950/40">
                <th className="p-4">Client Details</th>
                <th className="p-4">Review Message</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Position</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/50">
              {testimonials.map((test, index) => (
                <tr key={test.id} className="text-slate-300 hover:bg-slate-950/20 transition-colors">
                  <td className="p-4 flex items-center gap-4 shrink-0">
                    <img src={test.photoUrl} alt={test.clientName} className="w-10 h-10 rounded-full object-cover border border-slate-800" />
                    <div>
                      <span className="font-bold text-white block text-sm">{test.clientName}</span>
                      <span className="text-slate-500 text-[10px] block mt-0.5">{test.company}</span>
                    </div>
                  </td>
                  <td className="p-4 font-light max-w-xs md:max-w-md">
                    <p className="truncate hover:whitespace-normal transition-all">"{test.message}"</p>
                  </td>
                  <td className="p-4 font-semibold text-amber-500">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: test.rating }).map((_, i) => (
                        <Star key={i} size={10} className="fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-slate-400">
                      <span className="font-bold mr-2 text-slate-300">#{test.order}</span>
                      <button
                        onClick={() => handleShiftOrder(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => handleShiftOrder(index, "down")}
                        disabled={index === testimonials.length - 1}
                        className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEdit(test)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
                        title="Edit testimonial"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(test.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors"
                        title="Remove review"
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
      {editingTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="absolute inset-0 bg-[#06060a]/80 backdrop-blur-sm" onClick={() => setEditingTest(null)} />
          <div className="relative w-full max-w-lg bg-[#0a0a0f] border-l border-slate-900 h-full shadow-2xl p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <h3 className="text-lg font-black text-white tracking-tight">
                  {editingTest.id ? "Edit Review Card" : "New Review Card"}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingTest(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Headshot image */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-900">
                <img src={editingTest.photoUrl} alt="Reviewer Avatar" className="w-14 h-14 rounded-full object-cover border border-slate-800" />
                <div>
                  <button
                    type="button"
                    onClick={handleCloudinaryUpload}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-white border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                  >
                    <ImageIcon size={12} />
                    Upload Image
                  </button>
                  <p className="text-[9px] text-slate-500 mt-1.5">Square headshot (PNG/JPG up to 2MB)</p>
                </div>
              </div>

              {/* Client Name */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Client Name</label>
                <input
                  type="text"
                  value={editingTest.clientName || ""}
                  onChange={(e) => setEditingTest({ ...editingTest, clientName: e.target.value })}
                  placeholder="Sophia Martinez"
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all font-bold"
                  required
                />
              </div>

              {/* Company */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Company / Role</label>
                <input
                  type="text"
                  value={editingTest.company || ""}
                  onChange={(e) => setEditingTest({ ...editingTest, company: e.target.value })}
                  placeholder="CEO, SwiftCart Apparel"
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all"
                  required
                />
              </div>

              {/* Rating */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Star Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditingTest({ ...editingTest, rating: star })}
                      className="p-1 rounded hover:bg-slate-900 transition-colors"
                    >
                      <Star
                        size={20}
                        className={
                          star <= (editingTest.rating || 5)
                            ? "fill-amber-500 text-amber-500"
                            : "text-slate-600"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review message */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Review Quote Message</label>
                <textarea
                  value={editingTest.message || ""}
                  onChange={(e) => setEditingTest({ ...editingTest, message: e.target.value })}
                  rows={5}
                  placeholder="Enter the client's direct review or quote feedback here..."
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all font-light leading-relaxed"
                  required
                />
              </div>

              <div className="border-t border-slate-900 pt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTest(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 transition-colors text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <Save size={12} />
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
