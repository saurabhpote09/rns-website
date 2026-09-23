"use client";

import type { RefObject } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { SceneStore } from "@/lib/three/scroll-store";

/**
 * Drives store.progress from a scrubbed ScrollTrigger — the single source of
 * truth the 3D scene's useFrame loop reads every frame. Kept out of React
 * state so scrolling never triggers a re-render of the scene tree.
 */
function useScrollProgressStore({
  store,
  triggerRef,
  start,
  end,
  onUpdate,
}: {
  store: RefObject<SceneStore>;
  triggerRef: RefObject<HTMLElement | null>;
  start: string;
  end: string;
  /** Called after each progress write — used to invalidate a "demand" frameloop under reduced motion. */
  onUpdate?: () => void;
}) {
  useGSAP(
    () => {
      if (!triggerRef.current) return;
      const trigger = ScrollTrigger.create({
        trigger: triggerRef.current,
        start,
        end,
        scrub: true,
        onUpdate: (self) => {
          store.current.progress = self.progress;
          onUpdate?.();
        },
      });
      return () => trigger.kill();
    },
    { scope: triggerRef, dependencies: [start, end] }
  );
}

export { useScrollProgressStore };
