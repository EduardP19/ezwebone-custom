"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { getServices } from "@/lib/site-content";

export function Services() {
  const { locale, dictionary } = useI18n();
  const services = getServices(locale);

  return (
    <section id="services" className="section-shell section-shift section-shift-cyan bg-[color:var(--color-bg-dark)] py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.14),transparent_32%)]" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-3xl">
          <p className="mono-label text-xs text-[color:var(--color-text-accent)]">
            {dictionary.home.services.badge}
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-6xl">
            {dictionary.home.services.title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-[color:var(--color-text-secondary)]">
            {dictionary.home.services.body}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
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
