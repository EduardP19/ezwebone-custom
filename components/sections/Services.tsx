"use client";

import { motion } from "framer-motion";
import { SERVICES } from "@/lib/site-content";
import { ServiceCard } from "@/components/ui/ServiceCard";

export function Services() {
  return (
    <section id="services" className="section-shell bg-[color:var(--color-bg-dark)] py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(154,124,255,0.18),transparent_34%)]" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-3xl">
          <p className="mono-label text-xs text-[color:var(--color-text-accent)]">Services</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-6xl">
            What We Actually Do
          </h2>
          <p className="mt-5 text-lg leading-8 text-[color:var(--color-text-secondary)]">
            Six services. No fluff. Each one designed to move your business forward.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
            >
              <ServiceCard
                title={service.title}
                description={service.shortDescription}
                icon={service.icon}
                compact
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
