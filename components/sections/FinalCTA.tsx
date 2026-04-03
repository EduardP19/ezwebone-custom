"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ParticleNetwork } from "@/components/sections/ParticleNetwork";

interface FinalCTAProps {
  variant?: "black" | "purple" | "orange" | "glass";
}

export function FinalCTA({ variant = "black" }: FinalCTAProps) {
  void variant;

  return (
    <section className="section-shell bg-[color:var(--color-bg-dark)] pt-20 pb-14 md:pt-24 md:pb-18">
      <ParticleNetwork count={46} maxDistance={130} interactive={false} className="opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(154,124,255,0.24),transparent_30%)]" />

      <div className="relative mx-auto max-w-5xl px-4 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <h2 className="text-4xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-6xl">
            Ready to Build Something That Actually Works?
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[color:var(--color-text-secondary)]">
            Book a free 15-minute call. No pitch. No pressure. Just a conversation about what your business needs.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            <Link href="/contact">
              <Button size="lg">Book a Free Call</Button>
            </Link>

            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-[color:var(--color-text-secondary)] backdrop-blur-xl">
              <span className="text-[color:var(--color-text-primary)]">★★★★★</span>
              <span className="mx-2">Rated 5.0 on Google</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
