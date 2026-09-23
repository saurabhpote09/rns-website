"use client";

import { useRef } from "react";
import { m, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { cn } from "cn";

/**
 * Subtle pointer-tracked 3D tilt for imagery/graphics — mirrors Magnetic's
 * spring + mouse-only + reduced-motion guard, applied to rotation instead of position.
 */
function Tilt({
  children,
  strength = 8,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });

  function onMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * strength);
    rotateX.set(-py * strength);
  }

  function onLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <m.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("will-change-transform", className)}
    >
      {children}
    </m.div>
  );
}

export { Tilt };
