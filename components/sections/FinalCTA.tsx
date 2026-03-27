"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Star, ShieldCheck, Zap } from "lucide-react";

interface FinalCTAProps {
  variant?: "black" | "purple" | "orange" | "glass";
}

export function FinalCTA({ variant = "black" }: FinalCTAProps) {
  const bgStyles = {
    black: "bg-[#060410]",
    purple: "bg-[#08051a]",
    orange: "bg-[#1a0f05]", // Dark variant for orange mesh
    glass: "bg-[#060410]",
  };

  return (
    <section className={`py-12 bg-[#060410] relative overflow-hidden`}>
      {/* Background Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(139,92,246,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(14,165,233,0.1),transparent_70%)] pointer-events-none" />
      
      {/* Animated Glow Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-48 -left-48 w-[800px] h-[800px] bg-brand-purple/20 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-48 -right-48 w-[800px] h-[800px] bg-brand-blue/15 rounded-full blur-[140px]"
        />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Trust Elements */}
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-1 text-yellow-500 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="currentColor" />
              ))}
            </div>
            <p className="text-sm font-bold text-white/60 uppercase tracking-widest">
              Excellent 4.9/5 based on 50+ UK businesses
            </p>
          </div>

          <h2 className="text-4xl md:text-7xl font-display font-bold tracking-tight text-white mb-8 leading-tight">
            Ready to <span className="text-brand-purple italic">automate</span> your business?
          </h2>
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Book a free 20-minute call. We'll show you exactly how to automate your lead capture, website, and admin. No pressure, just a clear plan.
          </p>

          <div className="flex flex-col items-center gap-8">
            <Link href="/contact">
              <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90 text-white border-none shadow-[0_20px_50px_rgba(124,58,237,0.3)] transition-all hover:scale-105 px-10 py-8 text-lg rounded-2xl">
                Book a Free Consultation
              </Button>
            </Link>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 pt-8 border-t border-white/10 w-full max-w-3xl">
              <div className="flex items-center justify-center gap-2 text-white/50">
                <ShieldCheck size={18} className="text-brand-purple" />
                <span className="text-xs font-bold uppercase tracking-widest">No Commitment</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/50">
                <Zap size={18} className="text-brand-purple" />
                <span className="text-xs font-bold uppercase tracking-widest">Fast Delivery</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/50 col-span-2 md:col-span-1 border-t border-white/10 md:border-none pt-4 md:pt-0">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest">Spots Available</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Shapes */}
      <div className="absolute -right-40 -top-40 w-96 h-96 bg-brand-purple/10 rounded-full blur-[120px]" />
      <div className="absolute -left-40 -bottom-40 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px]" />
    </section>
  );
}
