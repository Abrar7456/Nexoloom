"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ArrowRight, Play, ShoppingBag, TrendingUp, Palette } from "lucide-react";
import { FloatingShapes, MorphingBlob, GlowingOrb, CircuitPattern } from "./SVGAnimations";

export const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 120, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    // Calculate values from -1 to 1
    const x = (e.clientX - rect.left - width / 2) / (width / 2);
    const y = (e.clientY - rect.top - height / 2) / (height / 2);
    
    mouseX.set(x * 12); // Rotate max 12deg on Y axis
    mouseY.set(-y * 12); // Rotate max 12deg on X axis
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Scroll tracking for 3D depth and rotations
  const { scrollY } = useScroll();
  const scrollSpring = useSpring(scrollY, { stiffness: 150, damping: 30 });

  // Transforms for the entire 3D deck container on scroll
  const containerRotateX = useTransform(scrollSpring, [0, 800], [22, 5]);
  const containerRotateY = useTransform(scrollSpring, [0, 800], [-32, -5]);
  const containerRotateZ = useTransform(scrollSpring, [0, 800], [12, 0]);
  const containerScale = useTransform(scrollSpring, [0, 800], [0.95, 1.15]);
  const containerTranslateY = useTransform(scrollSpring, [0, 800], [0, 100]);

  // Transform depth of individual cards (exploding parallax along Z axis on scroll)
  const ecommerceZ = useTransform(scrollSpring, [0, 800], [50, 180]);
  const marketingZ = useTransform(scrollSpring, [0, 800], [0, 100]);
  const designZ = useTransform(scrollSpring, [0, 800], [-50, 10]);

  // Floating animations for individual layers to make it feel alive
  const floatAnimEcommerce = {
    y: [0, -10, 0],
    rotateZ: [0, 1, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const }
  };
  const floatAnimMarketing = {
    y: [0, 12, 0],
    rotateZ: [0, -1, 0],
    transition: { duration: 7, repeat: Infinity, ease: "easeInOut" as const, delay: 0.5 }
  };
  const floatAnimDesign = {
    y: [0, -8, 0],
    rotateZ: [0, 1.5, 0],
    transition: { duration: 8, repeat: Infinity, ease: "easeInOut" as const, delay: 1 }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: -1000, y: -1000, radius: 180 };

    const handleCanvasMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleCanvasMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleCanvasMouseMove);
    window.addEventListener("mouseleave", handleCanvasMouseLeave);
    window.addEventListener("resize", handleResize);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 2 + 0.8;
        this.color = Math.random() > 0.5 ? "rgba(139, 92, 246, 0.25)" : "rgba(59, 130, 246, 0.25)";
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
      }
    }

    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw(ctx);

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = ((110 - dist) / 110) * 0.12;
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", handleCanvasMouseMove);
      window.removeEventListener("mouseleave", handleCanvasMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleCTA = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent py-20"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      {/* Interactive canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />



      <FloatingShapes />
      <MorphingBlob className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-40" size={600} />

      <div className="absolute bottom-[2%] left-0 right-0 z-0 px-12 hidden lg:block">
        <CircuitPattern />
      </div>

      <div className="relative max-w-7xl w-full mx-auto px-6 z-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Side: Staggered Content */}
        <div className="lg:col-span-6 text-left flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/3 border border-white/8 mb-8 text-xs font-semibold uppercase tracking-widest text-violet-400"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Next-Gen 3D Production Studio
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tight leading-none mb-6"
          >
            <span className="block text-slate-100 mb-2">We Forge</span>
            <span className="block bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
              Digital Authority
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg text-slate-400 max-w-xl mb-10 font-light leading-relaxed"
          >
            A premium full-stack studio building custom high-conversion E-commerce architectures, growth marketing algorithms, and high-fidelity visual branding systems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <button
              onClick={() => handleCTA("#contact")}
              className="group w-full sm:w-auto relative inline-flex items-center justify-center px-8 py-4 text-base font-bold tracking-wide text-white bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl overflow-hidden shadow-lg shadow-violet-500/25 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              Start Project
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleCTA("#portfolio")}
              className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold tracking-wide text-slate-300 hover:text-white rounded-xl border border-slate-700/50 hover:border-violet-500/50 hover:bg-slate-900/40 hover:glow-purple transition-all duration-300 cursor-pointer"
            >
              View Portfolios
              <Play className="ml-2 w-4 h-4 fill-slate-300 group-hover:fill-white transition-all" />
            </button>
          </motion.div>
        </div>

        {/* Right Side: Epic 3D Interactive Showcase */}
        <div className="lg:col-span-6 flex items-center justify-center relative min-h-[480px] lg:min-h-[580px] w-full z-20">
          <motion.div
            style={{
              perspective: 1200,
              transformStyle: "preserve-3d",
              rotateX: springY,
              rotateY: springX,
            }}
            className="relative w-full max-w-[450px] aspect-[4/5] flex items-center justify-center"
          >
            {/* The 3D Scroll-controlled rotating wrapper */}
            <motion.div
              style={{
                transformStyle: "preserve-3d",
                rotateX: containerRotateX,
                rotateY: containerRotateY,
                rotateZ: containerRotateZ,
                scale: containerScale,
                y: containerTranslateY,
              }}
              className="w-full h-full relative"
            >
              
              {/* E-commerce Layer (Top) */}
              <motion.div
                style={{
                  transformStyle: "preserve-3d",
                  z: ecommerceZ,
                }}
                animate={floatAnimEcommerce}
                className="absolute top-[5%] left-[5%] w-[85%] h-[40%] rounded-2xl bg-slate-900/80 border border-violet-500/30 backdrop-blur-xl shadow-2xl p-5"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-violet-500/10 text-violet-400 rounded-lg">
                      <ShoppingBag size={16} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">E-Commerce Module</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">Active</span>
                </div>
                
                <div className="space-y-2">
                  <div className="h-4 bg-slate-950 rounded-lg flex items-center justify-between px-3 text-[10px] text-slate-400">
                    <span>Checkout Flow Initialized</span>
                    <span className="text-violet-400">$1,420.00</span>
                  </div>
                  <div className="h-10 bg-gradient-to-r from-violet-600/10 to-blue-600/10 border border-slate-800 rounded-lg flex items-center justify-between px-3">
                    <div className="flex gap-2 items-center">
                      <div className="w-6 h-4 bg-slate-800 rounded flex items-center justify-center text-[6px] font-black text-slate-500">VISA</div>
                      <span className="text-[10px] text-slate-300 font-mono">**** 4290</span>
                    </div>
                    <div className="w-12 h-5 bg-gradient-to-r from-violet-600 to-blue-600 rounded-md flex items-center justify-center text-[8px] font-black text-white">PAY</div>
                  </div>
                </div>
              </motion.div>

              {/* Digital Marketing Layer (Middle) */}
              <motion.div
                style={{
                  transformStyle: "preserve-3d",
                  z: marketingZ,
                }}
                animate={floatAnimMarketing}
                className="absolute top-[32%] right-[5%] w-[85%] h-[40%] rounded-2xl bg-slate-950/90 border border-blue-500/30 backdrop-blur-xl shadow-2xl p-5"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
                      <TrendingUp size={16} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Growth Algorithm</span>
                  </div>
                  <span className="text-[10px] text-blue-400 font-extrabold">+324% ROI</span>
                </div>
                
                {/* SVG Graph rendering dynamic analytics */}
                <div className="relative h-20 w-full">
                  <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,50 Q25,20 50,45 T100,15 T150,30 T200,5 L200,60 L0,60 Z"
                      fill="url(#chartGrad)"
                    />
                    <path
                      d="M0,50 Q25,20 50,45 T100,15 T150,30 T200,5"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                    <circle cx="100" cy="15" r="4" fill="#60a5fa" className="animate-pulse" />
                  </svg>
                </div>
              </motion.div>

              {/* Graphic Design Layer (Bottom) */}
              <motion.div
                style={{
                  transformStyle: "preserve-3d",
                  z: designZ,
                }}
                animate={floatAnimDesign}
                className="absolute bottom-[5%] left-[8%] w-[85%] h-[40%] rounded-2xl bg-slate-900/70 border border-violet-500/20 backdrop-blur-xl shadow-2xl p-5"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                      <Palette size={16} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Identity Blueprint</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="aspect-square bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center p-2">
                    <svg className="w-full h-full text-violet-400 opacity-60" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="0.5" />
                      <line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="0.5" />
                    </svg>
                  </div>
                  <div className="aspect-square bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center p-2">
                    <svg className="w-full h-full text-indigo-400 opacity-60" viewBox="0 0 40 40">
                      <polygon points="20,4 36,36 4,36" fill="none" stroke="currentColor" strokeWidth="1" />
                      <circle cx="20" cy="24" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                    </svg>
                  </div>
                  <div className="aspect-square bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center p-2">
                    <svg className="w-full h-full text-blue-400 opacity-60" viewBox="0 0 40 40">
                      <rect x="6" y="6" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1" />
                      <line x1="6" y1="6" x2="34" y2="34" stroke="currentColor" strokeWidth="0.5" />
                    </svg>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </motion.div>
        </div>

      </div>

      <GlowingOrb className="hidden lg:block absolute top-[18%] left-[3%]" size={110} color="#8b5cf6" />
      <GlowingOrb className="hidden lg:block absolute bottom-[18%] right-[5%]" size={90} color="#3b82f6" />

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-30"
        onClick={() => handleCTA("#services")}
      >
        <span className="text-xs tracking-widest text-slate-500 font-semibold uppercase">Scroll Down</span>
        <div className="w-6 h-10 rounded-full border border-slate-700 flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 bg-violet-400 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};
