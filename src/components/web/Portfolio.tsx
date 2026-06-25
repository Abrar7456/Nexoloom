"use client";

import React, { useEffect, useState, useRef } from "react";
import { dbService } from "@/lib/db";
import { Project } from "@/lib/mockData";
import { ExternalLink, Layers, Award, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

const categories = ["All", "E-commerce", "Marketing", "Design"];

const ProjectCard: React.FC<{
  project: Project;
  getOptimizedImage: (url: string) => string;
  onClick: () => void;
}> = ({ project, getOptimizedImage, onClick }) => {
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
    x.set((mouseX / width) * 12); // max 12deg Y rotation
    y.set(-(mouseY / height) * 12); // max 12deg X rotation
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
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-white/5 shadow-2xl hover:border-violet-500/20 hover:glow-purple transition-all duration-350 cursor-pointer aspect-video"
    >
      {/* Background Project Image */}
      <img
        src={getOptimizedImage(project.imageUrl)}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />

      {/* Dark transparent gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-300 z-0" />

      {/* Information Overlay */}
      <div 
        className="absolute inset-0 p-6 flex flex-col justify-end z-10"
        style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}
      >
        <span 
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-violet-400 bg-violet-950/80 border border-violet-500/20 w-fit mb-3"
          style={{ transform: "translateZ(10px)" }}
        >
          <Sparkles size={10} />
          {project.category}
        </span>
        <h3 className="text-xl md:text-2xl font-black tracking-tight text-white group-hover:text-violet-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-xs text-slate-350 font-light tracking-wide mt-2 line-clamp-1">
          {project.description}
        </p>
        <div 
          className="mt-4 flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ transform: "translateZ(15px)" }}
        >
          View Case Study
          <ExternalLink size={14} className="translate-y-[-1px]" />
        </div>
      </div>
    </motion.div>
  );
};

export const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await dbService.getPortfolio();
        setProjects(data);
        setFilteredProjects(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((p) => p.category === activeCategory));
    }
  }, [activeCategory, projects]);

  const getOptimizedImage = (url: string) => {
    if (!url) return "/api/placeholder/600/400";
    if (url.includes("cloudinary.com")) {
      return url.replace("/upload/", "/upload/f_auto,q_auto,w_800/");
    }
    return url;
  };

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden bg-[#030307] border-t border-slate-900">
      {/* Background blobs */}
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-blue-950/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">Our Masterpieces</span>
          <h2 className="text-3xl md:text-5xl font-black mt-2 tracking-tight text-white">Recent Work & Case Studies</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-violet-600 to-blue-500 mx-auto mt-4 mb-8 rounded-full" />

          {/* Categories Menu */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:text-white bg-slate-900/40"
                  }`}
                >
                  {cat}
                  {isActive && (
                    <motion.div
                      layoutId="activeCatBg"
                      className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-800/10 border border-slate-700/20 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  getOptimizedImage={getOptimizedImage}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Layers className="mx-auto w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">No portfolio items matching this category yet.</p>
          </div>
        )}
      </div>

      {/* Project Case Study Lightbox Popup */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-[#06060a]/90 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="relative w-full max-w-4xl bg-[#0a0a0f] border border-slate-800 rounded-3xl shadow-2xl z-10 overflow-hidden"
            >
              {/* Media banner */}
              <div className="relative aspect-video max-h-[350px] w-full overflow-hidden">
                <img
                  src={getOptimizedImage(selectedProject.imageUrl)}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-slate-900/10 to-transparent" />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2.5 text-slate-400 hover:text-white rounded-full bg-slate-950/80 backdrop-blur-sm border border-slate-800 hover:scale-105 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Detail Content */}
              <div className="p-6 md:p-10">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-violet-400 bg-violet-950/60 border border-violet-500/20">
                    {selectedProject.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <span className="font-semibold text-slate-300">Client:</span> {selectedProject.client}
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-4">
                  {selectedProject.title}
                </h3>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 font-light">
                  {selectedProject.description}
                </p>

                {/* Key Metrics / Results Section */}
                <div className="p-6 rounded-2xl bg-violet-600/5 border border-violet-500/10 flex items-start gap-4 mb-8">
                  <div className="p-3 bg-violet-600/10 text-violet-400 rounded-xl shrink-0">
                    <Award size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide mb-1">Delivered Results & Metrics</h4>
                    <p className="text-sm text-violet-400 font-extrabold tracking-tight">
                      {selectedProject.results}
                    </p>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-900 pt-6">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 transition-colors text-sm font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Close
                  </button>
                  {selectedProject.liveLink && (
                    <a
                      href={selectedProject.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:scale-105 transition-all duration-300 text-sm font-bold shadow-lg inline-flex items-center gap-2 cursor-pointer"
                    >
                      Visit Live Project
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
