"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Quote,
  DollarSign,
  Settings,
  Menu,
  X,
  LogOut,
  FolderOpen,
  Mail,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Services", href: "/admin/services", icon: TrendingUp },
  { name: "Team Members", href: "/admin/team", icon: Users },
  { name: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
  { name: "Testimonials", href: "/admin/testimonials", icon: Quote },
  { name: "Inquiries", href: "/admin/inquiries", icon: Mail },
  { name: "Site Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, isFallback } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // If not loading and no user, send to login page
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, loading, pathname, router]);

  // Bypass layout wrapping for the login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06060a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Checking Session...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#06060a] flex text-slate-100 font-sans">
      {/* Fallback Mode warning indicator */}
      {isFallback && (
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-amber-500 z-[60] flex items-center justify-center">
          <span className="hidden sm:inline-block text-[8px] font-black uppercase tracking-wider text-slate-950">
            Fallback Mode: Operating in Offline Simulated State (localStorage-based DB)
          </span>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col justify-between border-r border-slate-900 bg-[#0a0a0f] transition-all duration-300 ${
          isFallback ? "pt-1.5" : ""
        } ${collapsed ? "w-20" : "w-64"}`}
      >
        <div>
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-900">
            {!collapsed && (
              <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                NX SYSTEM
              </span>
            )}
            {collapsed && <ShieldCheck size={18} className="text-violet-400 mx-auto" />}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900"
            >
              <Menu size={16} />
            </button>
          </div>

          {/* Links */}
          <nav className="p-4 space-y-1.5">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              const IconComp = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-violet-600/10 text-violet-400 border border-violet-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                  }`}
                  title={collapsed ? link.name : ""}
                >
                  <IconComp size={16} className={isActive ? "text-violet-400" : "text-slate-400"} />
                  {!collapsed && <span>{link.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer log out */}
        <div className="p-4 border-t border-slate-900">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
            title={collapsed ? "Logout" : ""}
          >
            <LogOut size={16} />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0a0f] border-b border-slate-900 flex items-center justify-between px-6 z-40">
        <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
          NEXOLOOM ADMIN
        </span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 top-16 z-30 md:hidden w-64 bg-[#0a0a0f] border-r border-slate-900 flex flex-col justify-between p-4"
          >
            <nav className="space-y-1.5">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                const IconComp = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? "bg-violet-600/10 text-violet-400 border border-violet-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                    }`}
                  >
                    <IconComp size={16} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={() => {
                setMobileOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content frame */}
      <main className={`flex-1 flex flex-col overflow-y-auto px-6 py-8 mt-16 md:mt-0 ${
        isFallback ? "pt-10 md:pt-14" : ""
      }`}>
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
