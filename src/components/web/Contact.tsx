"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { dbService } from "@/lib/db";
import { toast } from "react-hot-toast";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone must be at least 6 digits"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export const Contact: React.FC = () => {
  const { settings } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await dbService.addInquiry({
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        message: data.message,
      });

      // Send email via our Next.js API route
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          contactEmail: settings.contactEmail
        })
      });

      setSubmitSuccess(true);
      toast.success("Inquiry received! We'll contact you within 24 hours.");
      reset();
      // Hide success screen after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (e) {
      console.error(e);
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thanks for subscribing to our digital insights!");
    setNewsletterEmail("");
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-transparent border-t border-slate-900">
      {/* Background glow */}
      <div className="absolute top-[20%] left-0 w-[400px] h-[400px] bg-blue-950/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">Get In Touch</span>
          <h2 className="text-3xl md:text-5xl font-black mt-2 tracking-tight text-white">Initiate Your Sprint</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-violet-600 to-blue-500 mx-auto mt-4 mb-8 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Panel: Contact info & Map */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white tracking-tight">Contact Information</h3>
              <p className="text-slate-400 font-light leading-relaxed text-sm">
                Ready to transform your online presence? Drop us a line, send an email, or swing by our headquarters. We are ready to build.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-600/10 text-violet-400 flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">Email Address</span>
                    <a href={`mailto:${settings.contactEmail}`} className="text-sm text-slate-200 hover:text-violet-400 font-medium transition-colors">
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 text-blue-400 flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">Phone Line</span>
                    <a href={`tel:${settings.contactPhone}`} className="text-sm text-slate-200 hover:text-blue-400 font-medium transition-colors">
                      {settings.contactPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-600/10 text-violet-400 flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">Headquarters</span>
                    <span className="text-sm text-slate-200 font-medium">
                      {settings.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Dark Google Map */}
            <div className="h-64 w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative">
              <iframe
                title="Nexoloom Office Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0863878174415!2d-122.40428588468205!3d37.78564177975878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1m3!1d1576!2d-122.4019!3d37.784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1655000000000!5m2!1sen!2sus"
                className="w-full h-full border-0 grayscale invert opacity-70 contrast-125"
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Panel: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!submitSuccess ? (
                  <motion.form
                    key="contact-form"
                    onSubmit={handleSubmit(onSubmit)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          {...register("name")}
                          placeholder="John Doe"
                          className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-violet-500 transition-all ${
                            errors.name ? "border-red-500/50" : "border-slate-800"
                          }`}
                        />
                        {errors.name && (
                          <span className="text-red-400 text-xs mt-1 block flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.name.message}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          {...register("email")}
                          placeholder="john@example.com"
                          className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-violet-500 transition-all ${
                            errors.email ? "border-red-500/50" : "border-slate-800"
                          }`}
                        />
                        {errors.email && (
                          <span className="text-red-400 text-xs mt-1 block flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.email.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          {...register("phone")}
                          placeholder="+1 (555) 123-4567"
                          className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-violet-500 transition-all ${
                            errors.phone ? "border-red-500/50" : "border-slate-800"
                          }`}
                        />
                        {errors.phone && (
                          <span className="text-red-400 text-xs mt-1 block flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.phone.message}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                          Service Interested In
                        </label>
                        <select
                          id="service-select"
                          {...register("service")}
                          className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-sm text-slate-300 focus:outline-none focus:border-violet-500 transition-all cursor-pointer ${
                            errors.service ? "border-red-500/50" : "border-slate-800"
                          }`}
                        >
                          <option value="">Select a service...</option>
                          <option value="E-commerce Development">E-commerce Development</option>
                          <option value="Digital Marketing">Digital Marketing</option>
                          <option value="Graphic Design & Branding">Graphic Design & Branding</option>
                          <option value="Other / Custom Support">Other / Custom Support</option>
                        </select>
                        {errors.service && (
                          <span className="text-red-400 text-xs mt-1 block flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.service.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Message Details
                      </label>
                      <textarea
                        id="message-input"
                        {...register("message")}
                        rows={5}
                        placeholder="Tell us about your project goals, timelines, and requirements..."
                        className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-violet-500 transition-all ${
                          errors.message ? "border-red-500/50" : "border-slate-800"
                        }`}
                      />
                      {errors.message && (
                        <span className="text-red-400 text-xs mt-1 block flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.message.message}
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold tracking-wide text-sm flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg shadow-violet-500/10 hover:shadow-violet-500/25 transition-all duration-300 disabled:opacity-50 disabled:scale-100 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="w-5 h-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
                      ) : (
                        <>
                          Send Message
                          <Send size={16} />
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center text-center py-16"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-20 h-20 bg-green-500/10 text-green-400 flex items-center justify-center rounded-full mb-6"
                    >
                      <CheckCircle2 size={44} className="stroke-[1.5]" />
                    </motion.div>
                    <h3 className="text-2xl font-extrabold text-white mb-2">Message Dispatched!</h3>
                    <p className="text-sm text-slate-400 max-w-sm">
                      Our strategists are analyzing your inquiry. We'll follow up shortly via the email address provided.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Newsletter Signup Banner */}
        <div className="mt-20 border-t border-slate-900 pt-16 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-950/20 p-8 rounded-3xl border border-slate-900">
          <div>
            <h4 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <MessageSquare size={18} className="text-violet-400" />
              Subscribe to Insights
            </h4>
            <p className="text-slate-400 text-xs font-light mt-1">
              Receive updates on conversion design tactics, web performance trends, and growth metrics.
            </p>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="flex w-full md:w-auto items-center gap-2 max-w-md shrink-0">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="newsletter@company.com"
              className="px-4 py-3 text-sm text-white rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-violet-500 w-full md:w-64"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-750 font-bold text-sm text-white tracking-wide transition-all shadow-md shrink-0 cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
