"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BusinessJourney } from "@/components/sections/BusinessJourney";
import { ParticleNetwork } from "@/components/sections/ParticleNetwork";
import { CALENDLY_BOOKING_URL } from "@/lib/links";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const TRUST_IMAGES = [
  "/clients/client1.png",
  "/clients/client2.png",
  "/clients/client3.png",
];

export function Hero() {
  return (
    <section className="section-shell relative min-h-[100svh] bg-[color:var(--color-bg-dark)] pt-28 md:pt-32">
      <ParticleNetwork className="opacity-50" count={80} maxDistance={150} interactive />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,color-mix(in_srgb,var(--color-primary)_10%,transparent),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_80%,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent)]" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-4 pb-20 md:px-6">
        <motion.div
          className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.92fr)]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-3xl">
            <motion.p
              variants={itemVariants}
              className="mono-label inline-flex items-center gap-3 text-xs text-[color:var(--color-text-secondary)]"
            >
              <span className="live-dot" />
              Building the future of small business
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="mt-6 text-5xl font-semibold leading-[0.95] tracking-tight text-[color:var(--color-text-primary)] md:text-7xl lg:text-8xl"
            >
              Websites. Automations.
              <br />
              AI Agents. Growth.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--color-text-secondary)] md:text-xl"
            >
              We design, build, and automate digital systems that bring your business more clients - not more work.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col items-start gap-4 sm:flex-row"
            >
              <a href={CALENDLY_BOOKING_URL} target="_blank" rel="noreferrer">
                <Button size="lg">Book a Free Call</Button>
              </a>
              <Link href="/portfolio">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2"
                >
                  See Our Work
                  <ArrowDown size={16} />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-10 inline-flex flex-wrap items-center gap-4 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)]/70 px-4 py-3 backdrop-blur-xl"
            >
              <div className="flex items-center">
                {TRUST_IMAGES.map((image, index) => (
                  <Image
                    key={image}
                    src={image}
                    alt=""
                    width={40}
                    height={40}
                    className={`h-10 w-10 rounded-full border-2 border-[color:var(--color-bg-dark)] object-cover ${index === 0 ? "" : "-ml-2.5"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-[color:var(--color-text-primary)]">
                110+ Happy Clients
              </span>
              <span className="hidden text-[color:var(--color-text-secondary)] sm:inline">·</span>
              <span className="text-sm text-[color:var(--color-text-secondary)]">
                <span className="text-[color:var(--color-text-primary)]">★★★★★</span> 5.0 on Google
              </span>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="w-full">
            <BusinessJourney />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
