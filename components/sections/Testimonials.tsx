"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { getTestimonials } from "@/lib/site-content";

export function Testimonials() {
  const { locale, dictionary } = useI18n();
  const testimonials = getTestimonials(locale);

  return (
    <section className="section-shell bg-[color:var(--color-bg-dark)] py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.12),transparent_32%)]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-3xl">
          <p className="mono-label text-xs text-[color:var(--color-text-accent)]">
            {dictionary.home.testimonials.badge}
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-6xl">
            {dictionary.home.testimonials.title}
          </h2>
        </div>

        <div className="-mx-4 mt-14 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
          <div className="flex gap-5 md:contents">
            {testimonials.map((testimonial, index) => (
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
