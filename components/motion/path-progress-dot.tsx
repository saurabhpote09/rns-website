"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "cn";

// A gentle vertical wave, 5 waypoints (0/25/50/75/100%) — tuned to line up
// with a 5-row sidebar list. Traversed via GSAP MotionPathPlugin.
const PATH_D =
  "M12,8 C22,50 2,90 12,132 C22,174 2,214 12,256 C22,298 2,338 12,380";

function PathProgressDot({
  progress,
  className,
  dotClassName,
}: {
  /** 0..1 position along the path. */
  progress: number;
  className?: string;
  dotClassName?: string;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useGSAP(
    () => {
      if (!pathRef.current || !dotRef.current) return;
      gsap.to(dotRef.current, {
        motionPath: {
          path: pathRef.current,
          align: pathRef.current,
          alignOrigin: [0.5, 0.5],
          end: Math.min(1, Math.max(0, progress)),
        },
        duration: 0.6,
        ease: "power2.inOut",
      });
    },
    { dependencies: [progress] }
  );

  return (
    <svg
      viewBox="0 0 24 388"
      preserveAspectRatio="none"
      className={cn("absolute top-0 left-0 h-full w-6", className)}
      aria-hidden
    >
      <path
        ref={pathRef}
        d={PATH_D}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.18}
        strokeWidth={2}
      />
      <circle ref={dotRef} r={4} className={cn("fill-current", dotClassName)} />
    </svg>
  );
}

export { PathProgressDot };
