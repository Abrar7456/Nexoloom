"use client";

import React, { useEffect, useState } from "react";
import { dbService } from "@/lib/db";
import { Inquiry, TeamMember, Project } from "@/lib/seedData";
import {
  Mail,
  Users,
  Briefcase,
  Layers,
  TrendingUp,
  Clock,
  ArrowUpRight,
  FileSpreadsheet
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import Link from "next/link";

const COLORS = ["#8b5cf6", "#3b82f6", "#06b6d4", "#ec4899"];

export default function AdminDashboardPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [teamCount, setTeamCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inqs = await dbService.getInquiries();
        const team = await dbService.getTeam();
        const portfolio = await dbService.getPortfolio();

        setInquiries(inqs);
        setTeamCount(team.length);
        setProjectCount(portfolio.length);
      } catch (e) {
        console.error("Error loading dashboard data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute charts data
  const getTimelineData = () => {
    if (inquiries.length === 0) {
      return [
        { date: "June 18", count: 2 },
        { date: "June 19", count: 4 },
        { date: "June 20", count: 3 },
        { date: "June 21", count: 7 },
        { date: "June 22", count: 5 },
        { date: "June 23", count: 8 },
      ];
    }

    // Group inquiries by date
    const groups: Record<string, number> = {};
    const sorted = [...inquiries].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    sorted.forEach((inq) => {
      const d = new Date(inq.createdAt);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      groups[label] = (groups[label] || 0) + 1;
    });

    return Object.entries(groups).map(([date, count]) => ({ date, count }));
  };

  const getServiceBreakdown = () => {
    if (inquiries.length === 0) {
      return [
        { name: "E-commerce Development", value: 3 },
        { name: "Digital Marketing", value: 4 },
        { name: "Graphic Design & Branding", value: 2 },
      ];
    }

    const counts: Record<string, number> = {};
    inquiries.forEach((inq) => {
      const s = inq.service || "Other / Custom Support";
      counts[s] = (counts[s] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const timelineData = getTimelineData();
  const breakdownData = getServiceBreakdown();
  const recentInquiries = inquiries.slice(0, 4);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Compiling analytics metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Executive Dashboard</h1>
        <p className="text-xs text-slate-400 font-medium tracking-wide mt-1 uppercase">
          Real-time insights & content monitoring metrics
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-violet-500/5 rounded-bl-3xl" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-600/10 text-violet-400 rounded-xl">
              <Mail size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Inquiries</span>
              <span className="text-3xl font-black text-white">{inquiries.length}</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-3xl" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/10 text-blue-400 rounded-xl">
              <Users size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Team Members</span>
              <span className="text-3xl font-black text-white">{teamCount}</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-bl-3xl" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-600/10 text-cyan-400 rounded-xl">
              <Briefcase size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Case Studies</span>
              <span className="text-3xl font-black text-white">{projectCount}</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/5 rounded-bl-3xl" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-600/10 text-teal-400 rounded-xl">
              <Layers size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">New Leads Today</span>
              <span className="text-3xl font-black text-white">
                {inquiries.filter((i) => {
                  const d = new Date(i.createdAt);
                  const today = new Date();
                  return d.toDateString() === today.toDateString();
                }).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Graph Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline area */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <TrendingUp size={16} className="text-violet-400" />
            Inquiries Timeline
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0a0a0f",
                    borderColor: "#1e293b",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="count" name="Submissions" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Breakdown */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Service Interest</h3>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={breakdownData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0a0a0f",
                    borderColor: "#1e293b",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            {breakdownData.map((d, index) => (
              <div key={index} className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-slate-300 truncate max-w-[160px]">{d.name}</span>
                </div>
                <span className="text-slate-400 font-bold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom recent activity panel */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Clock size={16} className="text-violet-400" />
            Recent Inquiry Logs
          </h3>
          <Link href="/admin/inquiries" className="text-xs font-bold uppercase tracking-wider text-violet-400 hover:text-violet-300 flex items-center gap-1">
            Manage Leads
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {recentInquiries.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Mail className="mx-auto w-10 h-10 opacity-30 mb-3" />
            <p className="text-xs">No client inquiries registered yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Service Requested</th>
                  <th className="pb-3">Submitted</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50">
                {recentInquiries.map((inq) => (
                  <tr key={inq.id} className="text-slate-300">
                    <td className="py-4">
                      <span className="font-bold text-white block">{inq.name}</span>
                      <span className="text-slate-500 text-[10px]">{inq.email}</span>
                    </td>
                    <td className="py-4 font-medium">{inq.service}</td>
                    <td className="py-4 font-light text-slate-400">
                      {new Date(inq.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-4 text-right">
                      <span className={`inline-block px-2.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        inq.status === "NEW"
                          ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                          : inq.status === "READ"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-slate-800 text-slate-400"
                      }`}>
                        {inq.status}
                      </span>
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
