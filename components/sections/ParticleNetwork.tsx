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
  count = 110,
  maxDistance = 180,
  interactive = true,
}: ParticleNetworkProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const mediaQuery = window.matchMedia("(pointer: fine)");
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const tabletQuery = window.matchMedia("(min-width: 768px)");
    const pointer = { x: -9999, y: -9999, active: false };
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let particles: Particle[] = [];
    let particleCount = count;
    let connectionDistance = maxDistance;
    let baseLineOpacity = 0.34;

    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cssParticleCount = Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--particle-count").trim(),
        10
      );
      const baseCount = Number.isFinite(cssParticleCount) ? cssParticleCount : count;

      if (desktopQuery.matches) {
        const referenceArea = 390 * 844;
        const areaScale = Math.sqrt(Math.max((width * height) / referenceArea, 1));
        const desktopScale = Math.min(2.15, Math.max(1.35, areaScale));
        particleCount = Math.max(1, Math.round(baseCount * desktopScale));
        connectionDistance = maxDistance * 1.32;
        baseLineOpacity = 0.48;
      } else if (tabletQuery.matches) {
        particleCount = Math.max(1, Math.round(baseCount * 1.1));
        connectionDistance = maxDistance * 1.12;
        baseLineOpacity = 0.4;
      } else {
        particleCount = Math.max(1, baseCount);
        connectionDistance = maxDistance;
        baseLineOpacity = 0.34;
      }
    };

    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      radius: Math.random() * 1.45 + 0.95,
    });

    const buildParticles = () => {
      particles = Array.from({ length: particleCount }, createParticle);
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

          if (distance > connectionDistance) continue;

          const opacity = 1 - distance / connectionDistance;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(neighbor.x, neighbor.y);
          const lineColor = getComputedStyle(document.documentElement).getPropertyValue("--particle-line").trim() || "196, 181, 253";
          context.strokeStyle = `rgba(${lineColor}, ${opacity * baseLineOpacity})`;
          context.lineWidth = 1.15;
          context.stroke();
        }

        let dotOpacity = 0.5;
        let glowStrength = 0;

        if (interactive && mediaQuery.matches && pointer.active) {
          const pointerDistance = Math.hypot(pointer.x - particle.x, pointer.y - particle.y);

          if (pointerDistance < 220) {
            const interactionOpacity = 1 - pointerDistance / 220;
            dotOpacity = 0.5 + interactionOpacity * 0.35;
            glowStrength = interactionOpacity;

            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(pointer.x, pointer.y);
            const hoverColor = getComputedStyle(document.documentElement).getPropertyValue("--particle-hover-line").trim() || "167, 139, 250";
            context.strokeStyle = `rgba(${hoverColor}, ${interactionOpacity * 0.42})`;
            context.lineWidth = 1.25;
            context.stroke();
          }
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        const dotColor = getComputedStyle(document.documentElement).getPropertyValue("--particle-dot").trim() || "245, 245, 247";
        const shadowColor = getComputedStyle(document.documentElement).getPropertyValue("--particle-line").trim() || "196, 181, 253";
        context.fillStyle = `rgba(${dotColor}, ${dotOpacity})`;
        context.shadowBlur = glowStrength ? 20 : 10;
        context.shadowColor = `rgba(${shadowColor}, 0.88)`;
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

    const handleResize = () => {
      setCanvasSize();
      buildParticles();
    };

    window.addEventListener("resize", handleResize);

    if (interactive && mediaQuery.matches) {
      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerleave", handlePointerLeave);
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
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
