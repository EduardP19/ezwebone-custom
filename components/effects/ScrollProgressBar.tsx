"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin mango-gradient bar fixed to the top of the viewport, tracking scroll
 * progress through the whole document. Purely decorative — aria-hidden,
 * no interaction, no layout impact.
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    mass: 0.2,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[130] h-[3px] w-full origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, var(--color-accent), var(--color-primary))",
      }}
    />
  );
}
