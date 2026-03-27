"use client";

import { motion } from "framer-motion";

const CLIENTS = [
  "Say I Do Weddings",
  "The Memory Corners",
  "Txengo",
  "ProveIt",
  "Study and Succeed",
];

export function TrustBar() {
  return (
    <section className="bg-brand-warm py-12 border-y border-brand-border overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-bold uppercase tracking-widest text-brand-gray mb-8"
        >
          Trusted by small businesses across the UK
        </motion.p>
        
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-40 grayscale">
          {CLIENTS.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="font-display font-extrabold text-xl md:text-2xl text-brand-black whitespace-nowrap"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
