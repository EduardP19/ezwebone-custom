"use client";

import * as React from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const LETTERS = "mangobeat".split("");
const LETTER_STAGGER = 0.05;
const LETTER_DURATION = 0.18;

const letterVariants: Variants = {
  idle: { scale: 1 },
  play: (i: number) => ({
    scale: [1, 1.32, 1],
    transition: { duration: LETTER_DURATION, delay: i * LETTER_STAGGER, ease: "easeOut" },
  }),
};

const dotVariants: Variants = {
  idle: { scale: 1 },
  play: {
    scale: [1, 1.55, 1],
    transition: {
      duration: 0.55,
      delay: LETTERS.length * LETTER_STAGGER + 0.15,
      repeat: 1,
      ease: "easeInOut",
    },
  },
};

interface WordmarkProps {
  className?: string;
}

/**
 * Text-based brand wordmark: "mangobeat." — the trailing period is a
 * deliberate stylistic mark, tinted with the brand primary color.
 *
 * Animation: each letter enlarges slightly in sequence, then the trailing
 * dot "beats" twice. Plays once whenever the wordmark scrolls into
 * view, and replays on every hover. Remounting the letter group (via
 * `key`) is what makes the sequence replay reliably on repeated triggers.
 */
export function Wordmark({ className }: WordmarkProps) {
  const containerRef = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { amount: 0.4, once: false });
  const wasInView = React.useRef(false);
  const [playKey, setPlayKey] = React.useState(0);

  React.useEffect(() => {
    if (isInView && !wasInView.current) {
      setPlayKey((key) => key + 1);
    }
    wasInView.current = isInView;
  }, [isInView]);

  const replay = React.useCallback(() => {
    setPlayKey((key) => key + 1);
  }, []);

  return (
    <span
      ref={containerRef}
      onMouseEnter={replay}
      className={cn(
        "inline-flex items-baseline font-display font-semibold tracking-[-0.02em] text-[color:var(--color-text-primary)]",
        className
      )}
    >
      <span key={playKey} className="inline-flex items-baseline">
        {LETTERS.map((letter, i) => (
          <motion.span
            key={i}
            custom={i}
            initial="idle"
            animate="play"
            variants={letterVariants}
            className="inline-block"
          >
            {letter}
          </motion.span>
        ))}
        <motion.span
          initial="idle"
          animate="play"
          variants={dotVariants}
          className="inline-block text-[color:var(--color-primary)]"
        >
          .
        </motion.span>
      </span>
    </span>
  );
}
