"use client";

import { useEffect, useRef } from "react";
import { cn } from "cn";

type Particle = { x: number; y: number; vx: number; vy: number };

type ParticleNetworkProps = {
  className?: string;
  /** CSS color (rgb/rgba/hex) for dots and connecting lines. */
  color?: string;
  /** Particles per px^2 of canvas area — tuned for a sparse, premium network, not a swarm. */
  density?: number;
  /** Max distance (px) at which two particles connect with a line. */
  maxDistance?: number;
};

/**
 * A quiet, drifting node network — particles connect to nearby neighbours
 * and to the cursor. Pauses off-screen and on hidden tabs; renders a single
 * static frame (no animation loop) under prefers-reduced-motion.
 */
function ParticleNetwork({
  className,
  color = "rgba(195, 0, 0, 0.55)",
  density = 0.00006,
  maxDistance = 140,
}: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      const rect = parent!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(20, Math.min(90, Math.round(width * height * density)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < maxDistance) {
            ctx!.globalAlpha = (1 - dist / maxDistance) * 0.5;
            ctx!.strokeStyle = color;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }

        const dm = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
        const reach = maxDistance * 1.3;
        if (dm < reach) {
          ctx!.globalAlpha = (1 - dm / reach) * 0.7;
          ctx!.strokeStyle = color;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(particles[i].x, particles[i].y);
          ctx!.lineTo(mouse.x, mouse.y);
          ctx!.stroke();
        }
      }

      ctx!.globalAlpha = 0.9;
      ctx!.fillStyle = color;
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    function step() {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
      draw();
      if (running) raf = requestAnimationFrame(step);
    }

    function start() {
      if (running || reduceMotion) return;
      running = true;
      raf = requestAnimationFrame(step);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    resize();
    draw();
    if (!reduceMotion) start();

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(parent);

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onPointerLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(canvas);

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [color, density, maxDistance]);

  return (
    <canvas ref={canvasRef} className={cn("block", className)} aria-hidden />
  );
}

export { ParticleNetwork };
