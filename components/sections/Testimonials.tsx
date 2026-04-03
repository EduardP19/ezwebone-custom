"use client";

import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/site-content";
import { TestimonialCard } from "@/components/ui/TestimonialCard";

export function Testimonials() {
  return (
    <section className="section-shell bg-[color:var(--color-bg-dark)] py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(154,124,255,0.16),transparent_34%)]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-3xl">
          <p className="mono-label text-xs text-[color:var(--color-text-accent)]">Testimonials</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-6xl">
            Don&apos;t Take Our Word For It
          </h2>
        </div>

        <div className="-mx-4 mt-14 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
          <div className="flex gap-5 md:contents">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="min-w-[18rem] snap-start md:min-w-0"
              >
                <TestimonialCard {...testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
