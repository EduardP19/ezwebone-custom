"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";
import { Phone, MessageSquare, Calendar, ArrowUpRight } from "lucide-react";

export function AITeaser() {
  return (
    <section className="py-12 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          {/* Spotlight Card */}
          <div className="relative bg-[#060410] rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-white/10 p-6 md:p-12">
            {/* Ad Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(139,92,246,0.3),transparent_60%)] pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-brand-purple/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-brand-purple/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10 text-left">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <Badge className="bg-brand-purple text-white border-none px-3 py-0.5 text-[9px] font-black uppercase tracking-widest">
                    Product Spotlight
                  </Badge>
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                    v2.0 Now Live
                  </span>
                </div>

                <Image 
                  src="/resevia/logo.svg" 
                  alt="Resevia Logo" 
                  width={140} 
                  height={32} 
                  className="mb-6 brightness-0 invert"
                />
                
                <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-white mb-5 leading-tight">
                  Your AI receptionist. <br />
                  <span className="text-brand-purple">Never miss a booking.</span>
                </h2>
                
                <p className="text-base text-white/50 mb-8 max-w-lg leading-relaxed">
                  We've built Resevia to help service businesses automate their front desk. It's the first AI agent specifically trained for UK salons and clinics.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
                  <a href="https://resevia.co.uk" target="_blank" rel="noopener noreferrer" className="group">
                    <Button size="md" className="bg-white text-brand-black hover:bg-brand-warm rounded-full px-8 flex items-center gap-2 transition-all">
                      Explore Resevia
                      <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Button>
                  </a>
                </div>
              </div>

              {/* Feature Box */}
              <div className="w-full lg:w-72 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <h3 className="text-white font-bold mb-5 text-[10px] uppercase tracking-widest opacity-40">Core Features</h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center border border-brand-purple/20">
                      <Phone size={14} className="text-brand-purple" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Voice AI</p>
                      <p className="text-[10px] text-white/30">Natural voice calls</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center border border-brand-purple/20">
                      <Calendar size={14} className="text-brand-purple" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Calendar</p>
                      <p className="text-[10px] text-white/30">Live syncing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                      <MessageSquare size={14} className="text-white/60" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Omnichannel</p>
                      <p className="text-[10px] text-white/30">WhatsApp & Web</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative dots/grid for "ad" feel */}
      <div className="absolute top-1/2 left-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}
