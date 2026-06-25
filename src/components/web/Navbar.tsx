"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Menu, X, Sun, Moon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "#hero" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Team", href: "#team" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Process", href: "#process" },
  { name: "Pricing", href: "#pricing" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "#contact" },
];

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Simple active link tracking
      const sections = navLinks.map((l) => l.href.substring(1));
      let currentSection = "hero";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "py-4 glass-dark dark:bg-[#0a0a0f]/80 bg-white/80 shadow-lg backdrop-blur-md"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick("#hero");
            }}
            className="flex items-center gap-2 text-xl font-bold tracking-wider text-slate-100 dark:text-slate-100 text-slate-900 group"
          >
            <div className="relative p-2 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-lg text-white">
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="font-extrabold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-blue-400">
              AURA
            </span>
            <span className="text-xs tracking-widest font-light text-slate-500 uppercase -ml-1 mt-1 hidden sm:inline-block">
              Digital
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300 ${
                    isActive
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-slate-600 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-violet-600 to-blue-500 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* CTA Button */}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("#contact");
              }}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-sm font-bold tracking-wide text-white bg-gradient-to-r from-violet-600 to-blue-600 rounded-full shadow-lg hover:shadow-violet-500/20 transition-all duration-300 hover:scale-105"
            >
              Let's Talk
            </a>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[72px] z-40 lg:hidden w-full h-[calc(100vh-72px)] dark:bg-[#0a0a0f]/95 bg-white/95 backdrop-blur-lg flex flex-col justify-between p-8"
          >
            <nav className="flex flex-col gap-4 text-center">
              {navLinks.map((link, idx) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`text-xl font-bold py-2 ${
                      isActive
                        ? "text-violet-600 dark:text-violet-400"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {link.name}
                  </motion.a>
                );
              })}
            </nav>

            <div className="flex flex-col gap-4">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick("#contact");
                }}
                className="w-full text-center py-4 font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl"
              >
                Get a Quote
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
