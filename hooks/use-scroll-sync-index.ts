"use client";

import { useRef, useState, type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Tracks which of `count` items is currently centered in the viewport while
 * scrolling, so a sidebar/list can highlight in sync with the item in view.
 * Attach `itemRefs.current[i]` to each item's DOM node.
 */
function useScrollSyncIndex(count: number, scope: RefObject<HTMLElement | null>) {
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const triggers = itemRefs.current.map((el, i) => {
          if (!el) return null;
          return ScrollTrigger.create({
            trigger: el,
            start: "top center",
            end: "bottom center",
            onEnter: () => setActiveIndex(i),
            onEnterBack: () => setActiveIndex(i),
          });
        });
        return () => triggers.forEach((t) => t?.kill());
      });
      return () => mm.revert();
    },
    { scope, dependencies: [count] }
  );

  return { itemRefs, activeIndex };
}

export { useScrollSyncIndex };
