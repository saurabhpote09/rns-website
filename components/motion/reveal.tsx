"use client";

import { m, type HTMLMotionProps } from "motion/react";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  /** Initial scale (e.g. 0.96 to scale up into place); defaults to no scale change. */
  scale?: number;
  /** Play immediately on mount instead of on scroll into view (use for above-the-fold content). */
  onMount?: boolean;
  /** Lift slightly on hover — for card-like elements. */
  hover?: boolean;
};

function Reveal({
  delay = 0,
  y = 24,
  scale = 1,
  onMount = false,
  hover = false,
  children,
  ...props
}: RevealProps) {
  const trigger = onMount
    ? { initial: { opacity: 0, y, scale }, animate: { opacity: 1, y: 0, scale: 1 } }
    : {
        initial: { opacity: 0, y, scale },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: { once: true, amount: 0.3 },
      };

  return (
    <m.div
      {...trigger}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={
        hover
          ? { y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }
          : undefined
      }
      {...props}
    >
      {children}
    </m.div>
  );
}

export { Reveal };
