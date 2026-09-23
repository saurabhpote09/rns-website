"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

type SplitHeadlineProps = {
  as?: "h1" | "h2" | "h3";
  className?: string;
  children: string;
};

/**
 * Splits the headline into lines and reveals them with a masked slide-up,
 * staggered per line. Falls back to plain static text under reduced motion.
 */
function SplitHeadline({ as = "h2", className, children }: SplitHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const Tag = as;

  useGSAP(
    () => {
      if (!ref.current) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(ref.current, {
          type: "lines",
          mask: "lines",
          aria: "auto",
        });
        gsap.set(split.lines, { yPercent: 110 });
        const tween = gsap.to(split.lines, {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            once: true,
          },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          split.revert();
        };
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

export { SplitHeadline };
