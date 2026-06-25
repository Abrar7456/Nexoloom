"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminLoginPage() {
  const { user, login, resetPassword, loading, isFallback } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  useEffect(() => {
    // If user is already authenticated, send straight to dashboard
    if (!loading && user) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || (!isResetMode && !password)) {
      setAuthError("All fields are required.");
      return;
    }

    setAuthError("");
    setSubmitting(true);

    try {
      if (isResetMode) {
        await resetPassword(email);
        toast.success("Password reset email sent!");
        setIsResetMode(false);
      } else {
        await login(email, password);
        toast.success("Welcome back, administrator!");
        router.push("/admin");
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#06060a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Login Box */}
      <div className="relative w-full max-w-md bg-[#0a0a0f] border border-slate-900 rounded-3xl p-8 shadow-2xl z-10">
        
        {/* Brand/Heading */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="p-3 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-2xl text-white mb-4">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isResetMode ? "Reset Admin Password" : "Aura Portal System"}
          </h2>
          <p className="text-xs text-slate-500 font-medium tracking-wide mt-1">
            {isResetMode
              ? "Submit your email to receive recovery parameters"
              : "Access the agency content management console"}
          </p>
        </div>

        {/* Warning Indicator for Fallback Mode */}
        {isFallback && !isResetMode && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-light leading-relaxed">
            <span className="font-extrabold uppercase block tracking-wider mb-1">Demo / Fallback Mode</span>
            Firebase Config is not set. Use the default credential parameters below:
            <div className="mt-2 text-[10px] font-semibold font-mono bg-slate-950/50 p-2 rounded border border-slate-800/80">
              Email: admin@agency.com <br />
              Password: admin123
            </div>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {authError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-start gap-2.5 leading-relaxed">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Email input */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Corporate Email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-slate-500" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@agency.com"
                className="w-full pl-12 pr-4 py-3 text-sm text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Password input */}
          {!isResetMode && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Password Key
                </label>
                <button
                  type="button"
                  onClick={() => setIsResetMode(true)}
                  className="text-[10px] font-bold text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-wider"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-slate-500" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 text-sm text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold tracking-wide text-sm flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg shadow-violet-500/10 hover:shadow-violet-500/25 transition-all duration-300 disabled:opacity-50 disabled:scale-100 cursor-pointer"
          >
            {submitting ? (
              <span className="w-5 h-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
            ) : isResetMode ? (
              "Send Reset Parameter"
            ) : (
              "Verify Credentials"
            )}
          </button>

          {isResetMode && (
            <button
              type="button"
              onClick={() => {
                setAuthError("");
                setIsResetMode(false);
              }}
              className="w-full text-center text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider mt-4"
            >
              Back to Login
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
