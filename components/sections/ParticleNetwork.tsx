"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

interface ParticleNetworkProps {
  className?: string;
  count?: number;
  maxDistance?: number;
  interactive?: boolean;
}

export function ParticleNetwork({
  className,
  count = 80,
  maxDistance = 150,
  interactive = true,
}: ParticleNetworkProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const mediaQuery = window.matchMedia("(pointer: fine)");
    const pointer = { x: -9999, y: -9999, active: false };
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let particles: Particle[] = [];

    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      radius: Math.random() * 1.2 + 0.8,
    });

    const buildParticles = () => {
      particles = Array.from({ length: count }, createParticle);
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x <= 0 || particle.x >= width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= height) particle.vy *= -1;
      }

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];

        for (let j = i + 1; j < particles.length; j += 1) {
          const neighbor = particles[j];
          const dx = neighbor.x - particle.x;
          const dy = neighbor.y - particle.y;
          const distance = Math.hypot(dx, dy);

          if (distance > maxDistance) continue;

          const opacity = 1 - distance / maxDistance;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(neighbor.x, neighbor.y);
          context.strokeStyle = `rgba(167, 139, 250, ${opacity * 0.22})`;
          context.lineWidth = 1;
          context.stroke();
        }

        let dotOpacity = 0.34;
        let glowStrength = 0;

        if (interactive && mediaQuery.matches && pointer.active) {
          const pointerDistance = Math.hypot(pointer.x - particle.x, pointer.y - particle.y);

          if (pointerDistance < 200) {
            const interactionOpacity = 1 - pointerDistance / 200;
            dotOpacity = 0.34 + interactionOpacity * 0.5;
            glowStrength = interactionOpacity;

            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(pointer.x, pointer.y);
            context.strokeStyle = `rgba(124, 58, 237, ${interactionOpacity * 0.28})`;
            context.lineWidth = 1;
            context.stroke();
          }
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(245, 245, 247, ${dotOpacity})`;
        context.shadowBlur = glowStrength ? 16 : 0;
        context.shadowColor = "rgba(167, 139, 250, 0.8)";
        context.fill();
        context.shadowBlur = 0;
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    setCanvasSize();
    buildParticles();
    draw();

    window.addEventListener("resize", setCanvasSize);

    if (interactive && mediaQuery.matches) {
      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerleave", handlePointerLeave);
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", setCanvasSize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [count, interactive, maxDistance]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  );
}
