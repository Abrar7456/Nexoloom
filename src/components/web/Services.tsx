"use client";

import React, { useEffect, useState, useRef } from "react";
import { dbService } from "@/lib/db";
import { Service } from "@/lib/seedData";
import { ShoppingBag, TrendingUp, Palette, ArrowRight, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  ShoppingBag: ShoppingBag,
  TrendingUp: TrendingUp,
  Palette: Palette,
};

const ServiceCard: React.FC<{
  service: Service;
  index: number;
  handleServiceSelect: (s: Service) => void;
}> = ({ service, index, handleServiceSelect }) => {
  const IconComp = iconMap[service.icon] || ShoppingBag;
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for tilt
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
    x.set((mouseX / width) * 15); // max 15deg Y rotation
    y.set(-(mouseY / height) * 15); // max 15deg X rotation
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
      onClick={() => handleServiceSelect(service)}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative rounded-3xl bg-slate-900/40 border border-white/5 p-8 flex flex-col justify-between hover:border-violet-500/30 hover:glow-purple transition-all duration-300 min-h-[340px] cursor-pointer"
    >
      <div style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}>
        {/* Icon container */}
        <div className="w-14 h-14 rounded-2xl bg-violet-600/10 text-violet-400 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-violet-600 group-hover:to-blue-600 group-hover:text-white transition-all duration-500 mb-6 shadow-md">
          <IconComp size={28} />
        </div>

        <h3 className="text-xl font-bold tracking-tight mb-3 text-slate-100 group-hover:text-white transition-colors">
          {service.title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed font-light mb-6">
          {service.description}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleServiceSelect(service);
        }}
        className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-violet-400 group-hover:text-violet-300 transition-colors mt-auto cursor-pointer"
        style={{ transform: "translateZ(20px)" }}
      >
        Explore Core Features
        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await dbService.getServices();
        setServices(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  const handleClose = () => {
    setSelectedService(null);
  };

  const handleInquire = (serviceTitle: string) => {
    setSelectedService(null);
    const selectEl = document.getElementById("service-select") as HTMLSelectElement | null;
    const contactEl = document.getElementById("contact");
    if (selectEl) {
      selectEl.value = serviceTitle;
    }
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-transparent">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-950/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-widest text-violet-400 uppercase"
          >
            What We Do
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black mt-2 tracking-tight text-white"
          >
            High-Performance Capabilities
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-violet-600 to-blue-500 mx-auto mt-4 rounded-full"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-3xl bg-slate-800/10 border border-slate-700/20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                handleServiceSelect={handleServiceSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* Accordion / Details Lightbox Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-[#06060a]/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#0a0a0f] border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 z-10 overflow-hidden"
            >
              {/* Corner Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2.5 text-slate-400 hover:text-white rounded-full bg-slate-800/20 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-violet-600/10 text-violet-400 rounded-xl">
                  {React.createElement(iconMap[selectedService.icon] || ShoppingBag, { size: 24 })}
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight text-white">{selectedService.title}</h3>
              </div>

              <p className="text-slate-350 text-sm leading-relaxed mb-6 font-light">
                {selectedService.description}
              </p>

              <div className="border-t border-slate-800/80 pt-6">
                <h4 className="text-xs font-bold tracking-widest text-slate-450 uppercase mb-4">
                  Core Sub-Services:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {selectedService.subServices.map((sub, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300 font-light">
                      <CheckCircle size={16} className="text-violet-400 mt-0.5 shrink-0" />
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4">
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-850 hover:bg-slate-900 transition-colors text-sm font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => handleInquire(selectedService.title)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:scale-105 transition-all duration-300 text-sm font-bold shadow-lg cursor-pointer"
                >
                  Request Service
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
