"use client";

import { m, type HTMLMotionProps, type Variants } from "motion/react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

type StaggerGroupProps = HTMLMotionProps<"div"> & { onMount?: boolean };

function StaggerGroup({ onMount = false, children, ...props }: StaggerGroupProps) {
  const trigger = onMount
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: true, amount: 0.2 } };

  return (
    <m.div variants={container} initial="hidden" {...trigger} {...props}>
      {children}
    </m.div>
  );
}

type StaggerItemProps = HTMLMotionProps<"div"> & {
  hover?: boolean;
  as?: "div" | "h1" | "h2" | "h3" | "p" | "li";
};

function StaggerItem({
  hover = false,
  as = "div",
  children,
  ...props
}: StaggerItemProps) {
  const Component = m[as];
  return (
    <Component
      variants={item}
      whileHover={
        hover
          ? { y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }
          : undefined
      }
      {...(props as Record<string, unknown>)}
    >
      {children}
    </Component>
  );
}

export { StaggerGroup, StaggerItem };
