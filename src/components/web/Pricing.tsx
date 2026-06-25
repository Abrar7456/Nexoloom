"use client";

import React, { useEffect, useState } from "react";
import { dbService } from "@/lib/db";
import { PricingTier } from "@/lib/seedData";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export const Pricing: React.FC = () => {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const data = await dbService.getPricing();
        setTiers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  const handleSelectPlan = (planName: string) => {
    const messageEl = document.getElementById("message-input") as HTMLTextAreaElement | null;
    const contactEl = document.getElementById("contact");
    if (messageEl) {
      messageEl.value = `Hi Nexoloom Team, I am interested in the ${planName} pricing tier. Please provide more details on next steps.`;
    }
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-transparent border-t border-slate-900">
      {/* Background radial glow */}
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-violet-950/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">Pricing Options</span>
          <h2 className="text-3xl md:text-5xl font-black mt-2 tracking-tight text-white">Flexible Service Plans</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-violet-600 to-blue-500 mx-auto mt-4 mb-8 rounded-full" />

          {/* Billing Switcher */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-semibold tracking-wide transition-colors ${billingPeriod === "monthly" ? "text-white" : "text-slate-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
              className="relative w-14 h-8 bg-slate-950 rounded-full border border-slate-800 p-1 flex items-center cursor-pointer transition-colors duration-300"
            >
              <motion.div
                layout
                className="w-5 h-5 rounded-full bg-gradient-to-tr from-violet-600 to-blue-600"
                animate={{ x: billingPeriod === "monthly" ? 0 : 22 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1.5 ${billingPeriod === "yearly" ? "text-white" : "text-slate-500"}`}>
              Yearly
              <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-500/25 border border-violet-500/30 text-violet-400 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[480px] rounded-3xl bg-slate-800/10 border border-slate-700/20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {tiers.map((tier, idx) => {
              const currentPrice = billingPeriod === "monthly" ? tier.monthlyPrice : tier.yearlyPrice;
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                  className={`group relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-500 ${
                    tier.isPopular
                      ? "bg-slate-900/60 border-2 border-violet-500 shadow-2xl hover:glow-purple"
                      : "bg-slate-900/30 border border-white/5 shadow-2xl hover:glow-blue hover:border-violet-500/20"
                  }`}
                >
                  {/* Popular tier indicator badge */}
                  {tier.isPopular && (
                    <span className="absolute top-0 right-8 -translate-y-1/2 px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-white bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-white mb-2">{tier.name}</h3>
                    
                    {/* Dynamic Price Display */}
                    <div className="flex items-baseline gap-1 mt-4 mb-6">
                      <span className="text-sm font-semibold text-slate-500">$</span>
                      <span className="text-4xl md:text-5xl font-black text-white tracking-tight transition-all duration-300">
                        {currentPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 font-medium lowercase">
                        /{billingPeriod === "monthly" ? "mo" : "mo"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-6 border-b border-slate-800 pb-4">
                      What's Included:
                    </p>

                    {/* Features list */}
                    <ul className="space-y-4">
                      {tier.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 text-sm text-slate-300 font-light">
                          <Check size={16} className="text-violet-400 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 border-t border-slate-800 pt-6">
                    <button
                      onClick={() => handleSelectPlan(tier.name)}
                      className={`w-full py-4.5 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                        tier.isPopular
                          ? "bg-gradient-to-r from-violet-600 to-blue-600 hover:scale-[1.03] text-white shadow-lg"
                          : "bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      Get Started
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
