"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, ArrowUp, Heart } from "lucide-react";
import { Logo } from "./Logo";
import { useSettings } from "@/context/SettingsContext";

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-transparent border-t border-slate-900 pt-16 pb-8 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-950/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Bio */}
          <div className="space-y-4">
            <a
              href="#hero"
              onClick={(e) => handleLinkClick(e, "#hero")}
              className="hover:scale-105 transition-transform inline-block"
            >
              <Logo />
            </a>
            <p className="text-xs text-slate-405 leading-relaxed font-light">
              {settings.seoDescription || "Bespoke e-commerce architectures, ROI-oriented digital marketing strategies, and premium visual identities built to grow conversions."}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-violet-500/30 hover:scale-105 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-violet-500/30 hover:scale-105 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-violet-500/30 hover:scale-105 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Nexoloom</h5>
            <ul className="space-y-2.5 text-xs text-slate-400 font-light">
              <li>
                <a href="#services" onClick={(e) => handleLinkClick(e, "#services")} className="hover:text-white transition-colors">
                  Capabilities
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleLinkClick(e, "#about")} className="hover:text-white transition-colors">
                  About Story
                </a>
              </li>
              <li>
                <a href="#portfolio" onClick={(e) => handleLinkClick(e, "#portfolio")} className="hover:text-white transition-colors">
                  Portfolio Grid
                </a>
              </li>
              <li>
                <a href="#team" onClick={(e) => handleLinkClick(e, "#team")} className="hover:text-white transition-colors">
                  Expert Team
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Core Services</h5>
            <ul className="space-y-2.5 text-xs text-slate-400 font-light">
              <li>
                <a href="#services" onClick={(e) => handleLinkClick(e, "#services")} className="hover:text-white transition-colors">
                  E-commerce Engineering
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => handleLinkClick(e, "#services")} className="hover:text-white transition-colors">
                  Digital Performance Marketing
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => handleLinkClick(e, "#services")} className="hover:text-white transition-colors">
                  Graphic & Identity Design
                </a>
              </li>
              <li>
                <a href="#pricing" onClick={(e) => handleLinkClick(e, "#pricing")} className="hover:text-white transition-colors">
                  Service Tiers
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Contact</h5>
            <ul className="space-y-2.5 text-xs text-slate-400 font-light">
              <li>{settings.address}</li>
              <li>{settings.contactPhone}</li>
              <li>
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors">
                  {settings.contactEmail}
                </a>
              </li>
              <li>
                <a href="/admin" className="text-violet-405 hover:text-violet-300 font-semibold tracking-wide flex items-center gap-1 mt-2">
                  Admin System Panel &rarr;
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
          <p>&copy; {new Date().getFullYear()} Nexoloom Digital. All rights reserved.</p>
          <p className="flex items-center gap-1.5 lowercase">
            Designed with <Heart size={10} className="fill-violet-500 text-violet-500 animate-pulse" /> by Nexoloom Studio
          </p>
        </div>
      </div>

      {/* Floating Scroll Top button */}
      {showScrollTop && (
        <button
          onClick={handleScrollTop}
          className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl shadow-lg cursor-pointer hover:scale-110 transition-all z-40"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </footer>
  );
};
