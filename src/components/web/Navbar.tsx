"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowUpRight, Zap } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring, useTransform } from "framer-motion";
import { Logo } from "./Logo";

const navLinks = [
  { name: "Home",         href: "#hero",         emoji: "⚡" },
  { name: "Services",     href: "#services",     emoji: "🚀" },
  { name: "About",        href: "#about",        emoji: "✦"  },
  { name: "Team",         href: "#team",         emoji: "👥" },
  { name: "Portfolio",    href: "#portfolio",    emoji: "🎨" },
  { name: "Process",      href: "#process",      emoji: "🔄" },
  { name: "Testimonials", href: "#testimonials", emoji: "⭐" },
  { name: "Contact",      href: "#contact",      emoji: "📬" },
];

/* ─── tiny animated glow cursor that trails on the nav ─── */
const NavGlow: React.FC<{ x: number; visible: boolean }> = ({ x, visible }) => (
  <motion.div
    className="pointer-events-none absolute top-0 h-full w-24 rounded-full"
    style={{
      left: x - 48,
      background: "radial-gradient(ellipse at center, rgba(139,92,246,0.18) 0%, transparent 70%)",
      filter: "blur(6px)",
    }}
    animate={{ opacity: visible ? 1 : 0 }}
    transition={{ duration: 0.2 }}
  />
);

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [hoveredLink, setHoveredLink]   = useState<string | null>(null);
  const [glowX, setGlowX]               = useState(0);
  const [glowVisible, setGlowVisible]   = useState(false);
  const navRef                           = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const rawProgress = useSpring(0, { stiffness: 200, damping: 30 });
  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 60);
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    rawProgress.set(docH > 0 ? v / docH : 0);
  });

  useEffect(() => {
    const allSections = navLinks.map((l) => l.href.substring(1));
    const handleScroll = () => {
      let current = "hero";
      for (const id of allSections) {
        const el = document.getElementById(id);
        if (el) {
          const { top, bottom } = el.getBoundingClientRect();
          if (top <= 140 && bottom >= 140) { current = id; break; }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    setGlowX(e.clientX - rect.left);
  };

  /* Spring-driven scroll progress bar */
  const progressWidth = useTransform(rawProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      {/* ─────────────────── HEADER ─────────────────── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className="fixed top-0 left-0 w-full z-50"
      >
        {/* Scroll-progress bar */}
        <motion.div
          className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-violet-600 via-blue-500 to-violet-400 z-50"
          style={{ width: progressWidth }}
        />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
          <motion.nav
            ref={navRef}
            onMouseMove={handleNavMouseMove}
            onMouseEnter={() => setGlowVisible(true)}
            onMouseLeave={() => setGlowVisible(false)}
            animate={{
              backgroundColor: scrolled ? "rgba(3,3,7,0.88)" : "rgba(3,3,7,0)",
              backdropFilter: scrolled ? "blur(24px) saturate(160%)" : "blur(0px)",
              borderColor: scrolled ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0)",
              boxShadow: scrolled
                ? "0 8px 40px -8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)"
                : "none",
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative flex items-center justify-between gap-2 px-4 py-2.5 rounded-2xl border overflow-hidden"
          >
            {/* Ambient glow trailing cursor */}
            <NavGlow x={glowX} visible={glowVisible && scrolled} />

            {/* ── Logo ── */}
            <a
              href="#hero"
              onClick={(e) => { e.preventDefault(); handleLinkClick("#hero"); }}
              className="flex-shrink-0 relative z-10"
            >
              <Logo />
            </a>

            {/* ── Desktop Links ── */}
            <nav className="hidden xl:flex items-center gap-0.5 relative z-10">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.href.substring(1);
                const isHovered = hoveredLink === link.name;
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.04, duration: 0.3, ease: "easeOut" }}
                    className="relative px-3 py-2 text-[13px] font-medium tracking-wide group cursor-pointer"
                  >
                    {/* Hover background */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.span
                          layoutId="navBg"
                          key="navBg"
                          className="absolute inset-0 rounded-xl bg-white/[0.06]"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.18 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Active background */}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavBg"
                        className="absolute inset-0 rounded-xl bg-violet-600/[0.12] border border-violet-500/20"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}

                    <span className={`relative z-10 transition-colors duration-200 ${
                      isActive ? "text-violet-300 font-semibold" : "text-slate-400 group-hover:text-slate-100"
                    }`}>
                      {link.name}
                    </span>

                    {/* Active underline glow */}
                    {isActive && (
                      <motion.span
                        layoutId="activeLine"
                        className="absolute bottom-0.5 left-3 right-3 h-px rounded-full bg-gradient-to-r from-violet-500 to-blue-500 blur-[1px]"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </motion.a>
                );
              })}
            </nav>

            {/* ── CTA + Hamburger ── */}
            <div className="flex items-center gap-2.5 relative z-10">
              <motion.a
                href="#contact"
                onClick={(e) => { e.preventDefault(); handleLinkClick("#contact"); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-bold text-white rounded-xl relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                  boxShadow: "0 0 20px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                {/* Animated shimmer */}
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                />
                <Zap size={13} className="relative fill-white" />
                <span className="relative">Get Started</span>
                <ArrowUpRight size={13} className="relative opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </motion.a>

              {/* Hamburger */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
                className="xl:hidden w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-slate-300 hover:text-white hover:border-violet-500/40 hover:bg-violet-600/10 transition-all duration-200"
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.span key="x"
                      initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}
                    >
                      <X size={18} />
                    </motion.span>
                  ) : (
                    <motion.span key="menu"
                      initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}
                    >
                      <Menu size={18} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.nav>
        </div>
      </motion.header>

      {/* ─────────────────── MOBILE MENU ─────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop blur overlay */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 xl:hidden bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-3 top-[72px] z-40 xl:hidden rounded-2xl overflow-hidden"
              style={{
                background: "rgba(6,6,15,0.97)",
                backdropFilter: "blur(28px) saturate(180%)",
                border: "1px solid rgba(139,92,246,0.15)",
                boxShadow: "0 24px 60px -8px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03)",
              }}
            >
              {/* Top accent line */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

              {/* Logo mini header */}
              <div className="px-5 pt-4 pb-3 border-b border-white/[0.05]">
                <Logo size="sm" />
              </div>

              <div className="p-4 grid grid-cols-2 gap-2">
                {navLinks.map((link, idx) => {
                  const isActive = activeSection === link.href.substring(1);
                  return (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.22 }}
                      className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-violet-600/15 text-violet-300 border border-violet-500/20"
                          : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200 border border-transparent"
                      }`}
                    >
                      <span className="text-base leading-none">{link.emoji}</span>
                      <span>{link.name}</span>
                      {isActive && (
                        <motion.span
                          layoutId="mobileDot"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0"
                        />
                      )}
                    </motion.a>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <div className="px-4 pb-5">
                <motion.a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); handleLinkClick("#contact"); }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.32 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 font-bold text-white text-sm rounded-xl relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                    boxShadow: "0 4px 24px rgba(139,92,246,0.35)",
                  }}
                >
                  <Zap size={14} className="fill-white" />
                  Get a Free Quote
                  <ArrowUpRight size={14} />
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
