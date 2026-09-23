type SceneCapabilities = {
  /** prefers-reduced-motion: reduce — static frame, scroll-only updates, no idle loop. */
  reducedMotion: boolean;
  /** Touch/coarse-pointer device — no cursor parallax or proximity reactions. */
  coarsePointer: boolean;
  /** Narrow viewport — simplified geometry (fewer particles/segments). */
  isMobile: boolean;
  /** Capped device pixel ratio, cheaper on mobile/high-DPR screens. */
  dpr: [number, number];
};

const MOBILE_BREAKPOINT = 768;

/**
 * One-shot snapshot taken at mount — deliberately not a reactive hook.
 * Reconfiguring a live WebGL canvas on every resize/breakpoint crossing
 * (as a stateful useIsMobile would trigger) is wasteful; the scene reads
 * this once and lives with it, matching ParticleNetwork's inline pattern.
 */
function getSceneCapabilities(): SceneCapabilities {
  if (typeof window === "undefined") {
    return { reducedMotion: false, coarsePointer: false, isMobile: false, dpr: [1, 1] };
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const dpr: [number, number] = isMobile
    ? [1, 1.5]
    : [1, Math.min(window.devicePixelRatio || 1, 2)];

  return { reducedMotion, coarsePointer, isMobile, dpr };
}

export { getSceneCapabilities };
export type { SceneCapabilities };
