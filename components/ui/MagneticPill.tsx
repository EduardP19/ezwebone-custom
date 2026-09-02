"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const ATTRACT_RANGE = 75;
const MAX_PULL = 12;
const PULL_STRENGTH = 0.45;

/** Shortest distance from a point to a rect — 0 when the point is inside it. */
function distanceToRect(px: number, py: number, rect: DOMRect) {
  const dx = Math.max(rect.left - px, 0, px - rect.right);
  const dy = Math.max(rect.top - py, 0, py - rect.bottom);
  return Math.hypot(dx, dy);
}

interface MagneticPillProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

/**
 * A pill that leans toward the cursor once it comes within ATTRACT_RANGE
 * of its edge, springs back when the cursor moves away, gently "beats"
 * while idle, and shakes more intensely while being attracted.
 * Desktop / fine-pointer only.
 */
export function MagneticPill({ children, className, index = 0 }: MagneticPillProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [attracted, setAttracted] = React.useState(false);
  const [motionEnabled, setMotionEnabled] = React.useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  React.useEffect(() => {
    setMotionEnabled(
      window.matchMedia("(pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  React.useEffect(() => {
    if (!motionEnabled) return;

    const handlePointerMove = (event: PointerEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const distance = distanceToRect(event.clientX, event.clientY, rect);

      if (distance <= ATTRACT_RANGE) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const pullX = Math.max(Math.min((event.clientX - centerX) * PULL_STRENGTH, MAX_PULL), -MAX_PULL);
        const pullY = Math.max(Math.min((event.clientY - centerY) * PULL_STRENGTH, MAX_PULL), -MAX_PULL);
        x.set(pullX);
        y.set(pullY);
        setAttracted(true);
      } else {
        x.set(0);
        y.set(0);
        setAttracted(false);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [motionEnabled, x, y]);

  if (!motionEnabled) {
    return (
      <span ref={ref} className={className}>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      ref={ref}
      style={{ x: springX, y: springY }}
      animate={
        attracted
          ? { scale: [1, 1.16, 1.02, 1.14, 1], rotate: [0, -3, 2, -2, 0] }
          : { scale: [1, 1.06, 1], rotate: 0 }
      }
      transition={
        attracted
          ? { duration: 0.45, repeat: Infinity, ease: "easeInOut" }
          : { duration: 2.2, repeat: 1, ease: "easeInOut", delay: index * 0.15 }
      }
      className={className}
    >
      {children}
    </motion.span>
  );
}
