// Plain mutable object, not React state — read every frame inside useFrame
// without triggering re-renders (GSAP ScrollTrigger and pointermove write
// into it directly; see hooks/use-scroll-progress-store.ts).
type SceneStore = {
  /** 0..1 scroll progress across the section's ScrollTrigger span. */
  progress: number;
  /** Raw normalized device coords (-1..1), written by the pointermove listener. */
  mouseX: number;
  mouseY: number;
};

function createSceneStore(): SceneStore {
  return {
    progress: 0,
    mouseX: 0,
    mouseY: 0,
  };
}

export { createSceneStore };
export type { SceneStore };
