"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue } from "framer-motion";
import { Search, Compass, Edit3, Code, Rocket, LifeBuoy } from "lucide-react";

const steps = [
  {
    phase: "01",
    title: "Discovery & Audit",
    desc: "We analyze your existing workflows, audit competitor positions, define clear business goals, and document scope specifications.",
    icon: Search,
    color: "from-violet-600 to-indigo-600",
  },
  {
    phase: "02",
    title: "Strategic Blueprint",
    desc: "We map out content clusters, architectural designs, server routes, user journeys, and selected integrations.",
    icon: Compass,
    color: "from-indigo-600 to-blue-600",
  },
  {
    phase: "03",
    title: "High-Fidelity Design",
    desc: "We craft responsive layouts, typographic hierarchies, UI component systems, and interactive clickable wireframes.",
    icon: Edit3,
    color: "from-blue-600 to-cyan-600",
  },
  {
    phase: "04",
    title: "Modern Development",
    desc: "Our engineering squad codes your stack using modern, clean patterns, writing serverless endpoints and indexing databases.",
    icon: Code,
    color: "from-cyan-600 to-teal-600",
  },
  {
    phase: "05",
    title: "Optimization & Launch",
    desc: "We run page-speed compression audits, inspect HTTPS headers, configure CDN caches, and push your platform live.",
    icon: Rocket,
    color: "from-teal-600 to-violet-600",
  },
  {
    phase: "06",
    title: "Continuous Support",
    desc: "Direct integration channels, server monitoring, security auditing, and monthly recommendations for conversion growth.",
    icon: LifeBuoy,
    color: "from-violet-600 to-blue-600",
  },
];

const ProcessCard: React.FC<{
  step: any;
  isEven: boolean;
  idx: number;
}> = ({ step, isEven, idx }) => {
  const IconComp = step.icon;
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for Y/X axis tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(y, { stiffness: 120, damping: 20 });
  const rotateY = useSpring(x, { stiffness: 120, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set((mouseX / width) * 10); // Rotate up to 10deg on Y
    y.set(-(mouseY / height) * 10); // Rotate up to 10deg on X
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, x: isEven ? 40 : -40, rotateY: isEven ? -25 : 25 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="w-full md:w-[45%] ml-12 md:ml-0 p-6 rounded-3xl bg-slate-900/30 border border-white/5 shadow-xl hover:border-violet-500/20 hover:glow-purple transition-all duration-300 cursor-pointer"
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="flex flex-col items-start md:items-stretch">
        <div className={`inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr ${step.color} text-white mb-4 shadow-lg`}>
          <IconComp size={22} />
        </div>
        
        <div className={`flex items-center gap-3 mb-2 justify-start ${isEven ? "md:justify-start" : "md:justify-end"}`}>
          <span className="text-3xl font-black text-slate-700 tracking-tight">{step.phase}</span>
          <h3 className="text-xl font-extrabold text-white tracking-tight">{step.title}</h3>
        </div>
        
        <p className="text-slate-400 font-light leading-relaxed text-sm">
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
};

export const Process: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of the process section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="process" className="py-24 bg-[#030307] relative overflow-hidden" ref={containerRef}>
      {/* Background glow */}
      <div className="absolute top-[40%] right-0 w-[450px] h-[450px] bg-violet-950/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">How We Work</span>
          <h2 className="text-3xl md:text-5xl font-black mt-2 tracking-tight text-white">Our Development Process</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-violet-600 to-blue-500 mx-auto mt-4 mb-8 rounded-full" />
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical central path line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-1 bg-slate-900 rounded-full" />
          
          {/* Animated central path line */}
          <motion.div
            style={{ scaleY, originY: 0 }}
            className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-violet-600 via-blue-500 to-violet-500 rounded-full shadow-lg shadow-violet-550/50"
          />

          {/* Timeline steps */}
          <div className="space-y-16">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div key={idx} className="relative flex flex-col md:flex-row items-start md:items-center">
                  {/* Outer point marker */}
                  <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full bg-[#030307] border-4 border-slate-900 flex items-center justify-center z-20">
                    <div className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50" />
                  </div>

                  {/* Desktop layout columns */}
                  <div className={`w-full flex ${isEven ? "md:flex-row-reverse" : "md:flex-row"}`}>
                    <ProcessCard step={step} isEven={isEven} idx={idx} />

                    {/* Placeholder space on opposite side for grid balance */}
                    <div className="hidden md:block w-[10%]" />
                    <div className="hidden md:block w-[45%]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
