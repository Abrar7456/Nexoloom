"use client";

import React, { useEffect, useState } from "react";
import { dbService } from "@/lib/db";
import { TeamMember } from "@/lib/seedData";
import { Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const departments = ["All", "Development", "Design", "Marketing"];

export const Team: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [filteredTeam, setFilteredTeam] = useState<TeamMember[]>([]);
  const [activeDept, setActiveDept] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await dbService.getTeam();
        setTeam(data);
        setFilteredTeam(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  useEffect(() => {
    if (activeDept === "All") {
      setFilteredTeam(team);
    } else {
      setFilteredTeam(team.filter((member) => member.department === activeDept));
    }
  }, [activeDept, team]);

  // Cloudinary image optimizer helper
  const getOptimizedImage = (url: string) => {
    if (!url) return "/api/placeholder/400/400";
    if (url.includes("cloudinary.com")) {
      // Inject transformation params right after /upload/
      return url.replace("/upload/", "/upload/f_auto,q_auto,w_400,c_fill,g_face/");
    }
    return url;
  };

  return (
    <section id="team" className="py-24 relative overflow-hidden bg-transparent">
      {/* Background glow */}
      <div className="absolute top-[20%] left-0 w-[400px] h-[400px] bg-violet-950/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">Who We Work With</span>
          <h2 className="text-3xl md:text-5xl font-black mt-2 tracking-tight text-white">Meet The Experts</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-violet-600 to-blue-500 mx-auto mt-4 mb-8 rounded-full" />

          {/* Department Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {departments.map((dept) => {
              const isActive = activeDept === dept;
              return (
                <button
                  key={dept}
                  onClick={() => setActiveDept(dept)}
                  className={`relative px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    isActive ? "text-white" : "text-slate-400 hover:text-white bg-slate-900/40"
                  }`}
                >
                  {dept}
                  {isActive && (
                    <motion.div
                      layoutId="activeDeptBg"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[420px] rounded-2xl bg-slate-800/10 border border-slate-750/20 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredTeam.map((member) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={member.id}
                  className="group relative h-[420px] rounded-2xl overflow-hidden glass shadow-xl hover:glow-purple transition-all duration-300"
                >
                  {/* Team image */}
                  <img
                    src={getOptimizedImage(member.photoUrl)}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Glass Card Details Overlay (Static on bottom, fully expands on hover) */}
                  <div className="absolute inset-x-4 bottom-4 p-5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-850/80 transition-all duration-500 group-hover:inset-4 group-hover:flex group-hover:flex-col group-hover:justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">
                        {member.role}
                      </span>
                      <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">{member.name}</h3>

                      {/* Bio visible only on hover/expansion */}
                      <p className="text-xs text-slate-300 leading-relaxed font-light mt-3 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-opacity duration-300">
                        {member.bio}
                      </p>
                    </div>

                    {/* Social links drawer */}
                    <div className="flex items-center gap-3 mt-4 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-opacity duration-300">
                      {member.socials.linkedin && (
                        <a
                          href={member.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      )}
                      {member.socials.github && (
                        <a
                          href={member.socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </a>
                      )}
                      {member.socials.instagram && (
                        <a
                          href={member.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                        >
                          <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredTeam.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Users className="mx-auto w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">No team members registered under this department yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};
