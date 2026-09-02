"use client";

import * as React from "react";

type Sparkle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
  color: string;
};

const COLORS = [
  "255, 122, 26", // mango orange (--color-primary, dark theme)
  "255, 197, 49", // mango gold (--color-accent, dark theme)
  "255, 221, 115", // warm cream-gold highlight
];

/**
 * Site-wide cursor "sparkle" trail: a fixed canvas overlay that spawns
 * small glowing mango-colored particles as the pointer moves, plus a soft
 * ring that eases toward the cursor. Desktop / fine-pointer only, and
 * fully disabled under prefers-reduced-motion — mirrors the gating
 * convention already used by ParticleNetwork.tsx.
 */
export function CursorSparkle() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(fine.matches && !reduced.matches);
  }, []);

  React.useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrame = 0;
    let sparkles: Sparkle[] = [];
    const ring = { x: -9999, y: -9999 };
    const pointer = { x: -9999, y: -9999, active: false };

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnSparkle = () => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      sparkles.push({
        x: pointer.x + (Math.random() - 0.5) * 6,
        y: pointer.y + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.9 - 0.2,
        radius: Math.random() * 1.8 + 1,
        life: 0,
        maxLife: Math.random() * 300 + 420,
        color,
      });

      if (sparkles.length > 140) {
        sparkles = sparkles.slice(sparkles.length - 140);
      }
    };

    let lastSpawn = 0;

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      if (pointer.active && time - lastSpawn > 28) {
        spawnSparkle();
        lastSpawn = time;
      }

      ring.x += (pointer.x - ring.x) * 0.22;
      ring.y += (pointer.y - ring.y) * 0.22;

      if (pointer.active) {
        context.beginPath();
        context.arc(ring.x, ring.y, 13, 0, Math.PI * 2);
        context.strokeStyle = "rgba(255, 197, 49, 0.55)";
        context.lineWidth = 1.5;
        context.shadowBlur = 14;
        context.shadowColor = "rgba(255, 122, 26, 0.65)";
        context.stroke();
        context.shadowBlur = 0;
      }

      sparkles = sparkles.filter((sparkle) => sparkle.life < sparkle.maxLife);

      for (const sparkle of sparkles) {
        sparkle.life += 16;
        sparkle.x += sparkle.vx;
        sparkle.y += sparkle.vy;

        const progress = sparkle.life / sparkle.maxLife;
        const opacity = Math.max(0, 1 - progress) * 0.85;
        const radius = sparkle.radius * (1 - progress * 0.6);

        context.beginPath();
        context.arc(sparkle.x, sparkle.y, Math.max(radius, 0.2), 0, Math.PI * 2);
        context.fillStyle = `rgba(${sparkle.color}, ${opacity})`;
        context.shadowBlur = 8;
        context.shadowColor = `rgba(${sparkle.color}, ${opacity})`;
        context.fill();
        context.shadowBlur = 0;
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handleResize = () => setCanvasSize();

    setCanvasSize();
    animationFrame = window.requestAnimationFrame(draw);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[200]"
    />
  );
}
