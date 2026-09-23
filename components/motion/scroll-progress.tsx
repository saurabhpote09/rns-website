"use client";

import { m, useScroll, useSpring, useTransform } from "motion/react";

/**
 * A persistent, page-wide indicator of where the reader is in the journey —
 * not a per-section reveal cue. The lead dot travels continuously with
 * scroll, echoing the same "marker travelling a track" language used inside
 * sections (see PathProgressDot / the Our Approach orbit).
 */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const left = useTransform(smooth, (v) => `${v * 100}%`);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5" aria-hidden>
      <m.div style={{ scaleX: smooth }} className="h-full w-full origin-left bg-brand" />
      <m.div
        style={{ left }}
        className="absolute top-1/2 size-2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-brand shadow-[0_0_8px_1px_var(--brand)]"
      />
    </div>
  );
}

export { ScrollProgress };
