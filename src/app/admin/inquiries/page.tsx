"use client";

import React, { useEffect, useState } from "react";
import { dbService } from "@/lib/db";
import { Inquiry } from "@/lib/seedData";
import { toast } from "react-hot-toast";
import {
  Mail,
  Search,
  Check,
  Archive,
  Download,
  AlertCircle,
  Clock,
  Trash2
} from "lucide-react";

const statuses: Array<Inquiry["status"] | "ALL"> = ["ALL", "NEW", "READ", "REPLIED", "ARCHIVED"];

export default function InquiriesCMSPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState<Inquiry["status"] | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const data = await dbService.getInquiries();
      setInquiries(data);
      setFilteredInquiries(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load inquiries list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    let result = inquiries;

    if (statusFilter !== "ALL") {
      result = result.filter((i) => i.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(query) ||
          i.email.toLowerCase().includes(query) ||
          i.message.toLowerCase().includes(query)
      );
    }

    setFilteredInquiries(result);
  }, [statusFilter, searchQuery, inquiries]);

  const handleUpdateStatus = async (id: string, status: Inquiry["status"]) => {
    try {
      await dbService.updateInquiryStatus(id, status);
      toast.success(`Inquiry status updated to ${status}`);
      fetchInquiries();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update inquiry status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this inquiry?")) return;
    try {
      await dbService.deleteInquiry(id);
      toast.success("Inquiry deleted successfully.");
      fetchInquiries();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete inquiry.");
    }
  };

  // CSV Exporter client-side helper
  const handleExportCSV = () => {
    if (filteredInquiries.length === 0) {
      toast.error("No inquiries available to export.");
      return;
    }

    const headers = ["ID", "Name", "Email", "Phone", "Requested Service", "Message", "Status", "Created At"];
    const rows = filteredInquiries.map((i) => [
      i.id,
      i.name.replace(/"/g, '""'),
      i.email,
      i.phone,
      i.service,
      i.message.replace(/\n/g, " ").replace(/"/g, '""'),
      i.status,
      i.createdAt
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nexoloom_inquiries_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export dispatched!");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Querying inquiries logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Leads & Inquiries</h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide mt-1 uppercase">
            Receive and coordinate customer outreach submissions
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:border-violet-500/20 shadow-md hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Filter and Search actions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="md:col-span-4 relative flex items-center">
          <Search className="absolute left-4 text-slate-500" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries name, email, query..."
            className="w-full pl-12 pr-4 py-2.5 text-xs text-white rounded-xl bg-slate-950 border border-slate-900 focus:outline-none focus:border-violet-500 transition-all font-medium"
          />
        </div>

        {/* Status tags filters */}
        <div className="md:col-span-8 flex flex-wrap gap-1.5 items-center justify-start md:justify-end">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-violet-600/10 text-violet-400 border border-violet-500/30"
                  : "bg-slate-950 border border-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Mail className="mx-auto w-12 h-12 opacity-30 mb-3" />
            <p className="text-sm">No client inquiries found matching search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase tracking-wider bg-slate-950/40">
                  <th className="p-4">Contact</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">Requested Category</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="text-slate-300 hover:bg-slate-950/20 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-white block text-sm">{inq.name}</span>
                      <span className="text-slate-500 font-mono text-[10px] block mt-0.5">{inq.email}</span>
                      <span className="text-slate-500 font-mono text-[10px]">{inq.phone}</span>
                    </td>
                    <td className="p-4 font-light leading-relaxed max-w-xs md:max-w-md">
                      <p className="whitespace-pre-line truncate hover:whitespace-normal transition-all">{inq.message}</p>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-300">
                        {inq.service}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-500 font-medium">
                      {new Date(inq.createdAt).toLocaleDateString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {inq.status === "NEW" && (
                          <button
                            onClick={() => handleUpdateStatus(inq.id, "READ")}
                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-900 rounded-lg transition-colors"
                            title="Mark as Read"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        {inq.status !== "REPLIED" && (
                          <button
                            onClick={() => handleUpdateStatus(inq.id, "REPLIED")}
                            className="p-2 text-slate-400 hover:text-green-400 hover:bg-slate-900 rounded-lg transition-colors"
                            title="Mark as Replied"
                          >
                            <Mail size={16} />
                          </button>
                        )}
                        {inq.status !== "ARCHIVED" && (
                          <button
                            onClick={() => handleUpdateStatus(inq.id, "ARCHIVED")}
                            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-colors"
                            title="Archive Inquiry"
                          >
                            <Archive size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(inq.id)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
