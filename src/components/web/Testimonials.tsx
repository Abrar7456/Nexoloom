"use client";

import React, { useEffect, useState, useRef } from "react";
import { dbService } from "@/lib/db";
import { Testimonial } from "@/lib/seedData";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await dbService.getTestimonials();
        setTestimonials(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const resetAutoplay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 6000);
  };

  useEffect(() => {
    if (testimonials.length > 0) {
      resetAutoplay();
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [testimonials, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      handlePrev();
    } else if (info.offset.x < -swipeThreshold) {
      handleNext();
    }
  };

  const getOptimizedImage = (url: string) => {
    if (!url) return "/api/placeholder/150/150";
    if (url.includes("cloudinary.com")) {
      return url.replace("/upload/", "/upload/f_auto,q_auto,w_150,c_fill,g_face/");
    }
    return url;
  };

  if (loading) {
    return (
      <section id="testimonials" className="py-24 bg-transparent">
        <div className="max-w-4xl mx-auto px-6 h-80 rounded-3xl bg-slate-800/10 border border-slate-700/20 animate-pulse" />
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  const currentItem = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-transparent border-t border-slate-900">
      {/* Background decoration */}
      <div className="absolute top-[40%] right-0 w-[300px] h-[300px] bg-violet-950/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-black mt-2 tracking-tight text-white">What Clients Say</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-violet-600 to-blue-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Carousel Box wrapper */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="bg-slate-900/30 border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col items-center text-center cursor-grab active:cursor-grabbing"
            >
              {/* Quote Mark */}
              <div className="w-12 h-12 bg-violet-600/10 text-violet-400 flex items-center justify-center rounded-2xl mb-6">
                <Quote size={20} className="fill-violet-400 text-violet-400" />
              </div>

              {/* Client message */}
              <p className="text-lg md:text-xl text-slate-200 font-light italic leading-relaxed mb-8 max-w-2xl">
                "{currentItem.message}"
              </p>

              {/* Ratings */}
              <div className="flex items-center gap-1 mb-6 text-amber-500">
                {Array.from({ length: currentItem.rating }).map((_, idx) => (
                  <Star key={idx} size={16} className="fill-amber-500" />
                ))}
              </div>

              {/* Client Profile */}
              <div className="flex flex-col items-center">
                <img
                  src={getOptimizedImage(currentItem.photoUrl)}
                  alt={currentItem.clientName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-violet-500 mb-3 shadow-lg"
                />
                <h4 className="text-base font-bold text-white tracking-tight">{currentItem.clientName}</h4>
                <span className="text-xs text-slate-500 font-medium tracking-wide mt-0.5">{currentItem.company}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => {
                handlePrev();
                resetAutoplay();
              }}
              className="p-3 text-slate-400 hover:text-white rounded-full border border-slate-850 hover:bg-slate-900 transition-all shadow-md cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    resetAutoplay();
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx ? "w-6 bg-violet-500" : "w-1.5 bg-slate-900"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                handleNext();
                resetAutoplay();
              }}
              className="p-3 text-slate-400 hover:text-white rounded-full border border-slate-850 hover:bg-slate-900 transition-all shadow-md cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
