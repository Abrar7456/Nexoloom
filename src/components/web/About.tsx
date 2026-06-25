"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Zap, Clock, ShieldCheck, Target } from "lucide-react";

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
}

const StatCounter: React.FC<StatItemProps> = ({ value, suffix, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000; // 2 seconds
    const increment = value / (duration / 16); // ~60fps
    let timer: NodeJS.Timeout;

    const run = () => {
      start += increment;
      if (start >= value) {
        setCount(value);
      } else {
        setCount(Math.floor(start));
        timer = setTimeout(run, 16);
      }
    };

    run();

    return () => clearTimeout(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center p-6 bg-slate-900/20 border border-white/5 rounded-2xl shadow-lg">
      <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-2 font-sans">
        {count}
        {suffix}
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
    </div>
  );
};

const AboutCard: React.FC<{
  icon: any;
  title: string;
  desc: string;
  delay: number;
  glowClass: string;
  iconColorClass: string;
}> = ({ icon: Icon, title, desc, delay, glowClass, iconColorClass }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(y, { stiffness: 125, damping: 20 });
  const rotateY = useSpring(x, { stiffness: 125, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set((mouseX / width) * 12);
    y.set(-(mouseY / height) * 12);
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
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      className={`p-8 rounded-3xl bg-slate-900/30 border border-white/5 shadow-xl hover:border-violet-500/20 transition-all duration-300 ${glowClass} cursor-pointer`}
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${iconColorClass}`}>
          <Icon size={22} />
        </div>
        <h3 className="text-lg font-bold tracking-tight mb-2 text-white">{title}</h3>
        <p className="text-sm text-slate-400 font-light leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  );
};

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-transparent border-t border-slate-900">
      {/* Floating Blobs */}
      <div className="absolute right-0 top-[20%] w-[30vw] h-[30vw] rounded-full bg-blue-900/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Story */}
          <div>
            <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">Who We Are</span>
            <h2 className="text-3xl md:text-5xl font-black mt-2 tracking-tight text-white">
              We Shape The Future of Digital Products
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-violet-600 to-blue-500 mt-4 mb-8 rounded-full" />
            
            <p className="text-slate-300 font-light leading-relaxed mb-6">
              Nexoloom is a digital creative agency that brings together developers, designers, and marketers under one banner. We reject standard templates to build custom high-performance web ecosystems, custom-crafted brands, and ROI-centric campaigns.
            </p>
            <p className="text-slate-400 font-light leading-relaxed mb-10 text-sm">
              Our engineering team implements modern, fast architectures (like Next.js and Firebase) that load instantly and drive conversion. Our creative side crafts distinct visuals, while our marketing experts optimize search visibility and pay-per-click strategies.
            </p>

            {/* Counters Grid */}
            <div className="grid grid-cols-2 gap-4">
              <StatCounter value={10} suffix="+" label="Years of Dev" />
              <StatCounter value={250} suffix="+" label="Websites Built" />
              <StatCounter value={99} suffix="%" label="Client Retention" />
              <StatCounter value={15} suffix="+" label="Expert Minds" />
            </div>
          </div>

          {/* Right: Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:pl-6">
            <AboutCard
              icon={Zap}
              title="Rapid Execution"
              desc="We deliver robust digital products on time using modular agile sprint cycles."
              delay={0.1}
              glowClass="hover:glow-purple"
              iconColorClass="bg-violet-600/10 text-violet-400"
            />
            <AboutCard
              icon={Clock}
              title="24/7 Connectivity"
              desc="Direct Slack and phone access to our lead engineers and strategy planners."
              delay={0.2}
              glowClass="hover:glow-blue"
              iconColorClass="bg-blue-600/10 text-blue-400"
            />
            <AboutCard
              icon={ShieldCheck}
              title="Full Transparency"
              desc="No black boxes. Detailed weekly metrics on traffic, conversions, and build sprints."
              delay={0.3}
              glowClass="hover:glow-purple"
              iconColorClass="bg-violet-600/10 text-violet-400"
            />
            <AboutCard
              icon={Target}
              title="ROI Oriented"
              desc="Every design pixel and code block is built to increase your conversion metrics."
              delay={0.4}
              glowClass="hover:glow-blue"
              iconColorClass="bg-blue-600/10 text-blue-400"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
