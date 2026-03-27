"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";

const STEPS = [
  {
    title: "Discovery Call (Day 1)",
    description: "Tell us about your business, goals, and what you need. We ask the right questions so nothing gets missed.",
  },
  {
    title: "Design & Build (Days 2–4)",
    description: "We design and build your full site. You get daily updates and can request changes at any point.",
  },
  {
    title: "Review & Launch (Day 5)",
    description: "You review the final site. We make any last tweaks. Then we go live and hand everything over to you.",
  },
  {
    title: "You're in Control",
    description: "Your domain. Your hosting. Your website. We give you a full handover and training so you can manage it yourself.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-brand-warm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4">Our Process</Badge>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-brand-black">
            From brief to live in 5 days.
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center relative z-10">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-full bg-brand-black text-white flex items-center justify-center font-bold mb-6">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold text-brand-black mb-4">{step.title}</h3>
                <p className="text-sm text-brand-gray leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
