"use client";

import React, { useEffect, useState } from "react";
import { dbService } from "@/lib/db";
import { TeamMember } from "@/lib/seedData";
import { Users } from "lucide-react";

export const Team: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await dbService.getTeam();
        setTeam(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const leftBranch = team.filter((m) => m.branch === "Left");
  const centerBranch = team.filter((m) => m.branch === "Center");
  const rightBranch = team.filter((m) => m.branch === "Right");

  if (loading) {
    return (
      <section id="team" className="py-24 relative overflow-hidden bg-transparent">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">Who We Work With</span>
            <h2 className="text-3xl md:text-5xl font-black mt-2 tracking-tight text-white">Meet The Experts</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-violet-600 to-blue-500 mx-auto mt-4 mb-8 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-2xl bg-slate-800/10 border border-slate-750/20 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="py-24 relative overflow-hidden bg-transparent">
      <div className="absolute top-[20%] left-0 w-[400px] h-[400px] bg-violet-950/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">Who We Work With</span>
          <h2 className="text-3xl md:text-5xl font-black mt-2 tracking-tight text-white">Our Team Map</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-violet-600 to-blue-500 mx-auto mt-4 mb-8 rounded-full" />
        </div>

        {/* CEO / Top-level */}
        <div className="flex justify-center mb-12">
          {centerBranch.filter(m => m.hierarchyLevel === 'CEO').map((ceo) => (
            <div key={ceo.id} className="flex flex-col items-center gap-3">
              <img src={ceo.photoUrl} alt={ceo.name} className="w-28 h-28 rounded-full object-cover border border-slate-800" />
              <div className="text-center">
                <div className="font-bold text-white">{ceo.name}</div>
                <div className="text-xs text-slate-400">{ceo.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Branch columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          {/* Left */}
          <div className="w-full max-w-md">
            <h4 className="text-sm font-bold text-slate-300 mb-4">Left Branch</h4>
            <div className="space-y-4">
              {leftBranch.map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                  <img src={m.photoUrl} alt={m.name} className="w-12 h-12 rounded-lg object-cover border border-slate-800" />
                  <div>
                    <div className="font-bold text-white text-sm">{m.name}</div>
                    <div className="text-xs text-slate-400">{m.role} — <span className="font-mono text-[10px]">{m.hierarchyLevel}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center */}
          <div className="w-full max-w-md">
            <h4 className="text-sm font-bold text-slate-300 mb-4">Center Branch</h4>
            <div className="space-y-4">
              {centerBranch.filter(m => m.hierarchyLevel !== 'CEO').map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                  <img src={m.photoUrl} alt={m.name} className="w-12 h-12 rounded-lg object-cover border border-slate-800" />
                  <div>
                    <div className="font-bold text-white text-sm">{m.name}</div>
                    <div className="text-xs text-slate-400">{m.role} — <span className="font-mono text-[10px]">{m.hierarchyLevel}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="w-full max-w-md">
            <h4 className="text-sm font-bold text-slate-300 mb-4">Right Branch</h4>
            <div className="space-y-4">
              {rightBranch.map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                  <img src={m.photoUrl} alt={m.name} className="w-12 h-12 rounded-lg object-cover border border-slate-800" />
                  <div>
                    <div className="font-bold text-white text-sm">{m.name}</div>
                    <div className="text-xs text-slate-400">{m.role} — <span className="font-mono text-[10px]">{m.hierarchyLevel}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
