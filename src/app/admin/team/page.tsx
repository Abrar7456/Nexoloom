"use client";

import React, { useEffect, useState } from "react";
import { dbService } from "@/lib/db";
import { TeamMember } from "@/lib/seedData";
import { toast } from "react-hot-toast";
import {
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Save,
  X
} from "lucide-react";

export default function TeamCMSPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);

  const fetchTeam = async () => {
    try {
      const data = await dbService.getTeam();
      setTeam(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load team database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleCreateNew = () => {
    setEditingMember({
      name: "",
      role: "",
      department: "Development",
      photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400",
      bio: "",
      socials: { linkedin: "", github: "", instagram: "" },
      order: team.length + 1
    });
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember({ ...member });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;
    try {
      await dbService.deleteTeamMember(id);
      toast.success("Team member removed.");
      fetchTeam();
    } catch (e) {
      console.error(e);
      toast.error("Deletion failed.");
    }
  };

  const handleCloudinaryUpload = () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!(window as any).cloudinary) {
      toast.error("Cloudinary SDK is not loaded. Try again in a moment.");
      return;
    }

    if (!preset) {
      // Prompt user with instructions or use fallback dummy
      const demoUrl = prompt("Enter a image URL manually (or set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to activate Upload Widget):", editingMember?.photoUrl);
      if (demoUrl) {
        setEditingMember((prev) => prev ? { ...prev, photoUrl: demoUrl } : null);
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
        croppingAspectRatio: 1,
        clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          toast.success("Image uploaded successfully!");
          setEditingMember((prev) => prev ? { ...prev, photoUrl: result.info.secure_url } : null);
        }
      }
    );
    widget.open();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name || !editingMember.role) {
      toast.error("Name and Role are required.");
      return;
    }

    try {
      const payload: Omit<TeamMember, "id"> = {
        name: editingMember.name,
        role: editingMember.role,
        department: editingMember.department || "Development",
        photoUrl: editingMember.photoUrl || "",
        bio: editingMember.bio || "",
        socials: editingMember.socials || {},
        order: editingMember.order || 1
      };

      await dbService.saveTeamMember(editingMember.id || null, payload);
      toast.success("Team member profile saved.");
      setEditingMember(null);
      fetchTeam();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes.");
    }
  };

  const handleShiftOrder = async (index: number, direction: "up" | "down") => {
    const list = [...team];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    // Swap items
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    // Re-index order field
    try {
      setTeam(list); // optimistic UI update
      for (let i = 0; i < list.length; i++) {
        const { id, name, role, department, photoUrl, bio, socials } = list[i];
        await dbService.saveTeamMember(id, {
          name, role, department, photoUrl, bio, socials, order: i + 1
        });
      }
      toast.success("Ordering updated.");
      fetchTeam();
    } catch (e) {
      console.error(e);
      toast.error("Re-ordering failed.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Querying team directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Team Directory Manager</h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide mt-1 uppercase">
            Edit profiles, departments, and order alignment
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Plus size={14} />
          Add Member
        </button>
      </div>

      {/* Directory Table Grid */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase tracking-wider bg-slate-950/40">
                <th className="p-4">Staff Details</th>
                <th className="p-4">Department</th>
                <th className="p-4">Order Position</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/50">
              {team.map((member, index) => (
                <tr key={member.id} className="text-slate-300 hover:bg-slate-950/20 transition-colors">
                  <td className="p-4 flex items-center gap-4">
                    <img src={member.photoUrl} alt={member.name} className="w-10 h-10 rounded-xl object-cover border border-slate-800" />
                    <div>
                      <span className="font-bold text-white block text-sm">{member.name}</span>
                      <span className="text-slate-500 text-[10px] block">{member.role}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-300">
                      {member.department}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-slate-400">
                      <span className="font-bold mr-2 text-slate-300">#{member.order}</span>
                      <button
                        onClick={() => handleShiftOrder(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-900"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => handleShiftOrder(index, "down")}
                        disabled={index === team.length - 1}
                        className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-900"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEdit(member)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
                        title="Edit profile"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors"
                        title="Remove member"
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

      {/* Slide-in Edit / Create Drawer Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="absolute inset-0 bg-[#06060a]/80 backdrop-blur-sm" onClick={() => setEditingMember(null)} />
          <div className="relative w-full max-w-lg bg-[#0a0a0f] border-l border-slate-900 h-full shadow-2xl p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <h3 className="text-lg font-black text-white tracking-tight">
                  {editingMember.id ? "Edit Team Member" : "New Team Member"}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Avatar Photo field */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-900">
                <img src={editingMember.photoUrl} alt="Avatar Preview" className="w-16 h-16 rounded-2xl object-cover border border-slate-800" />
                <div>
                  <button
                    type="button"
                    onClick={handleCloudinaryUpload}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-white border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                  >
                    <ImageIcon size={12} />
                    Upload Image
                  </button>
                  <p className="text-[9px] text-slate-500 mt-1.5">Square aspect ratio (PNG/JPG up to 2MB)</p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Full Name</label>
                <input
                  type="text"
                  value={editingMember.name || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  placeholder="Sarah Connor"
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all"
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Corporate Role</label>
                <input
                  type="text"
                  value={editingMember.role || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  placeholder="Lead Backend Engineer"
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all"
                  required
                />
              </div>

              {/* Department */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Department Category</label>
                <select
                  value={editingMember.department || "Development"}
                  onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value as any })}
                  className="w-full px-4 py-3 text-xs text-slate-300 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              {/* Bio */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Short Bio</label>
                <textarea
                  value={editingMember.bio || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  rows={4}
                  placeholder="Briefly state their expertise, achievements, and technology focus..."
                  className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>

              {/* Socials */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block -mb-2">Social Parameters</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={editingMember.socials?.linkedin || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        socials: { ...editingMember.socials, linkedin: e.target.value }
                      })
                    }
                    placeholder="LinkedIn Profile URL"
                    className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all"
                  />
                  <input
                    type="text"
                    value={editingMember.socials?.github || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        socials: { ...editingMember.socials, github: e.target.value }
                      })
                    }
                    placeholder="GitHub Profile URL"
                    className="w-full px-4 py-3 text-xs text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all"
                  />
                </div>
              </div>

              <div className="border-t border-slate-900 pt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 transition-colors text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <Save size={12} />
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
