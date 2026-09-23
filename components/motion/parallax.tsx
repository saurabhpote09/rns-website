"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "motion/react";
import { cn } from "cn";

type ParallaxProps = {
  children: React.ReactNode;
  /** Pixels of vertical travel from scroll start to scroll end. */
  speed?: number;
  className?: string;
};

function Parallax({ children, speed = 60, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [-speed, speed]
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      <m.div style={{ y }} className="h-full w-full">
        {children}
      </m.div>
    </div>
  );
}

export { Parallax };
