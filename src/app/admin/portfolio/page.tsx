"use client";

import React, { useEffect, useState } from "react";
import { dbService } from "@/lib/db";
import { Project } from "@/lib/seedData";
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
  ExternalLink
} from "lucide-react";

export default function PortfolioCMSPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);

  const fetchPortfolio = async () => {
    try {
      const data = await dbService.getPortfolio();
      setProjects(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load portfolio database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleCreateNew = () => {
    setEditingProject({
      title: "",
      category: "E-commerce",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
      description: "",
      client: "",
      results: "",
      liveLink: "",
      order: projects.length + 1
    });
  };

  const handleEdit = (project: Project) => {
    setEditingProject({ ...project });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this case study?")) return;
    try {
      await dbService.deleteProject(id);
      toast.success("Project removed from case studies.");
      fetchPortfolio();
    } catch (e) {
      console.error(e);
      toast.error("Deletion failed.");
    }
  };

  const handleCloudinaryUpload = () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!(window as any).cloudinary) {
      toast.error("Cloudinary SDK is not loaded yet.");
      return;
    }

    if (!preset) {
      const manually = prompt("Enter a mockup URL manually (or configure Cloudinary Preset):", editingProject?.imageUrl);
      if (manually) {
        setEditingProject((prev) => prev ? { ...prev, imageUrl: manually } : null);
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
        croppingAspectRatio: 1.5, // rectangular mockups
        clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          toast.success("Mockup uploaded successfully!");
          setEditingProject((prev) => prev ? { ...prev, imageUrl: result.info.secure_url } : null);
        }
      }
    );
    widget.open();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title || !editingProject.client) {
      toast.error("Title and Client Name are required.");
      return;
    }

    try {
      const payload: Omit<Project, "id"> = {
        title: editingProject.title,
        category: editingProject.category || "E-commerce",
        imageUrl: editingProject.imageUrl || "",
        description: editingProject.description || "",
        client: editingProject.client,
        results: editingProject.results || "",
        liveLink: editingProject.liveLink || "",
        order: editingProject.order || 1
      };

      await dbService.saveProject(editingProject.id || null, payload);
      toast.success("Case study saved.");
      setEditingProject(null);
      fetchPortfolio();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes.");
    }
  };

  const handleShiftOrder = async (index: number, direction: "up" | "down") => {
    const list = [...projects];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    // Swap items
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    // Re-index order field
    try {
      setProjects(list);
      for (let i = 0; i < list.length; i++) {
        const { id, title, category, imageUrl, description, client, results, liveLink } = list[i];
        await dbService.saveProject(id, {
          title, category, imageUrl, description, client, results, liveLink, order: i + 1
        });
      }
      toast.success("Portfolio ordering updated.");
      fetchPortfolio();
    } catch (e) {
      console.error(e);
      toast.error("Re-ordering failed.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Querying project matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Portfolio Manager</h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide mt-1 uppercase">
            Edit case studies, metrics, live URLs, and page layout priorities
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Plus size={14} />
          Add Project
        </button>
      </div>

      {/* Case studies list table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase tracking-wider bg-slate-950/40">
                <th className="p-4">Project Mockup & Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Metrics Results</th>
                <th className="p-4">Position</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/50">
              {projects.map((project, index) => (
                <tr key={project.id} className="text-slate-300 hover:bg-slate-950/20 transition-colors">
                  <td className="p-4 flex items-center gap-4 max-w-xs sm:max-w-sm">
                    <img src={project.imageUrl} alt={project.title} className="w-16 h-10 rounded-lg object-cover border border-slate-800 shrink-0" />
                    <div>
                      <span className="font-bold text-white block text-sm truncate">{project.title}</span>
                      <span className="text-slate-500 text-[10px] block mt-0.5">Client: {project.client}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-300">
                      {project.category}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-violet-400 max-w-[120px] truncate">
                    {project.results}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-slate-400">
                      <span className="font-bold mr-2 text-slate-300">#{project.order}</span>
                      <button
                        onClick={() => handleShiftOrder(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-900"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => handleShiftOrder(index, "down")}
                        disabled={index === projects.length - 1}
                        className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-900"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
                        title="Edit project parameters"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors"
                        title="Delete project"
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

      {/* Slide-in Edit/Create Panel */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="absolute inset-0 bg-[#06060a]/80 backdrop-blur-sm" onClick={() => setEditingProject(null)} />
          <div className="relative w-full max-w-lg bg-[#0a0a0f] border-l border-slate-900 h-full shadow-2xl p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <h3 className="text-lg font-black text-white tracking-tight">
                  {editingProject.id ? "Edit Case Study" : "New Case Study"}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Graphic upload preview */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-900">
                <img src={editingProject.imageUrl} alt="Banner Preview" className="w-24 h-16 rounded-xl object-cover border border-slate-800" />
                <div>
                  <button
                    type="button"
                    onClick={handleCloudinaryUpload}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-white border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                  >
                    <ImageIcon size={12} />
                    Upload Banner
                  </button>
                  <p className="text-[9px] text-slate-500 mt-1.5">Rectangular mockups (PNG/JPG/WEBP)</p>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Project Title</label>
                <input
                  type="text"
                  value={editingProject.title || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="SwiftCart Redesign App"
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all font-bold"
                  required
                />
              </div>

              {/* Client */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Client Brand Name</label>
                <input
                  type="text"
                  value={editingProject.client || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                  placeholder="SwiftCart Co."
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Project Category</label>
                  <select
                    value={editingProject.category || "E-commerce"}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full px-4 py-3 text-xs text-slate-300 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="E-commerce">E-commerce</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                  </select>
                </div>

                {/* Metrics */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Metrics Results</label>
                  <input
                    type="text"
                    value={editingProject.results || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, results: e.target.value })}
                    placeholder="+140% Conversions"
                    className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Description / Objective</label>
                <textarea
                  value={editingProject.description || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  rows={4}
                  placeholder="Summarize client objectives, strategies deployed, and development stacks implemented..."
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all font-light leading-relaxed"
                />
              </div>

              {/* Live link */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Live Website URL</label>
                <input
                  type="text"
                  value={editingProject.liveLink || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, liveLink: e.target.value })}
                  placeholder="https://company.com"
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>

              <div className="border-t border-slate-900 pt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 transition-colors text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <Save size={12} />
                  Save Case Study
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
