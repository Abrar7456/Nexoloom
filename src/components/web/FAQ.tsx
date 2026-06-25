"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What technology stack do you specialize in?",
    answer: "We specialize in modern full-stack JavaScript architectures, primarily using Next.js, React, Tailwind CSS, Node.js, and Firebase or Postgres databases. We build headless commerce architectures to deliver maximum speed, SEO benefits, and flexible integrations.",
  },
  {
    question: "Do I own the full intellectual property rights to the final code?",
    answer: "Yes, absolutely. Once the project is signed off and payment is finalized, 100% of the custom codebase, branding designs, visual assets, and content materials are transferred directly to you. We do not charge licensing fees.",
  },
  {
    question: "What is the typical timeline for an E-commerce Development project?",
    answer: "A bespoke storefront typically takes between 4 to 8 weeks from research and wireframing to engineering and final release. Smaller setups or landing campaign projects can take 2 to 3 weeks.",
  },
  {
    question: "How do you track the success of Digital Marketing campaigns?",
    answer: "We configure robust analytics tracking using Google Analytics 4, pixel triggers, and server-side logs. We send you comprehensive weekly reports tracking conversion rate metrics, CPC improvements, search ranking gains, and total revenue returns.",
  },
  {
    question: "What are your post-launch support models?",
    answer: "We offer several monthly support plans, ranging from standard SLA server health monitoring to growth retainers that include active monthly engineering hours, design adjustments, and active SEO/marketing campaign tuning.",
  },
];

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border-b border-slate-800 pb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left font-bold tracking-tight text-white hover:text-violet-400 transition-colors cursor-pointer"
      >
        <span className="text-base md:text-lg">{question}</span>
        <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-white transition-all">
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-slate-400 leading-relaxed font-light pb-4 pr-6">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-transparent border-t border-slate-900">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">Have Questions?</span>
          <h2 className="text-3xl md:text-5xl font-black mt-2 tracking-tight text-white">Frequently Asked Questions</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-violet-600 to-blue-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Accordion List */}
        <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl space-y-2">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === idx}
              onToggle={() => handleToggle(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
