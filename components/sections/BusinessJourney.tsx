"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { getBusinessStages } from "@/lib/site-content";

export function BusinessJourney() {
  const { locale } = useI18n();
  const stages = getBusinessStages(locale);

  return (
    <div className="surface-elevated rounded-[2rem] border border-white/10 p-5 md:p-6">
      <div className="relative">
        <div className="absolute left-[1.15rem] top-12 bottom-12 w-px bg-gradient-to-b from-[color:var(--color-primary-light)] via-[color:var(--color-primary)] to-[color:var(--color-primary-dark)]" />
        <motion.div
          className="absolute left-[0.9rem] top-12 w-2.5 rounded-full bg-[color:var(--color-primary-light)] shadow-[0_0_18px_rgba(167,139,250,0.8)]"
          animate={{ y: [0, 144, 290], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ height: 10 }}
        />

        <div className="space-y-4">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.title}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative rounded-[1.5rem] border border-white/10 bg-[rgba(17,17,24,0.9)] p-5 pl-12 shadow-[0_18px_50px_rgba(0,0,0,0.22)]"
            >
              <div className="absolute left-3 top-6 flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(124,58,237,0.5)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-accent)]">
                <stage.icon size={14} />
              </div>

              <p className="mono-label text-[11px] text-[color:var(--color-text-accent)]">
                {stage.title}
              </p>
              <p className="mt-2 text-lg font-semibold text-[color:var(--color-text-primary)]">
                {stage.bundle}
              </p>
              <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
                {stage.tagline}
              </p>

              {index < stages.length - 1 && (
                <ChevronDown
                  size={18}
                  className="absolute bottom-[-1.15rem] left-3 z-10 rounded-full bg-[color:var(--color-bg-dark)] text-[color:var(--color-text-accent)]"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
