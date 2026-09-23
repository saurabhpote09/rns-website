"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneStore } from "@/lib/three/scroll-store";

type CameraRigProps = {
  store: RefObject<SceneStore>;
  interactive: boolean;
  /** Camera positions to travel through, in scroll order. */
  positionKeyframes: [number, number, number][];
  /** Points the camera looks toward, in scroll order (same length as positions). */
  lookAtKeyframes: [number, number, number][];
  parallaxStrength?: number;
};

/**
 * Cinematic scroll-driven camera: travels a smooth Catmull-Rom path through
 * the keyframes as scroll progress advances, damped rather than snapped to
 * the raw scroll value, plus a small additive mouse-parallax offset.
 */
function CameraRig({
  store,
  interactive,
  positionKeyframes,
  lookAtKeyframes,
  parallaxStrength = 0.35,
}: CameraRigProps) {
  const { camera } = useThree();
  const dampedProgress = useRef(0);
  // Local to this component (not the shared store) — only useRef-owned state
  // created in the same component may be mutated inside a useFrame callback.
  const mouseXDamped = useRef(0);
  const mouseYDamped = useRef(0);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  const positionCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        positionKeyframes.map((p) => new THREE.Vector3(...p))
      ),
    [positionKeyframes]
  );
  const lookAtCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        lookAtKeyframes.map((p) => new THREE.Vector3(...p))
      ),
    [lookAtKeyframes]
  );

  useFrame((_, delta) => {
    dampedProgress.current = THREE.MathUtils.damp(
      dampedProgress.current,
      store.current.progress,
      3,
      delta
    );
    const t = THREE.MathUtils.clamp(dampedProgress.current, 0, 1);
    const targetPosition = positionCurve.getPointAt(t < 1 ? t : 0.999);
    lookTarget.copy(lookAtCurve.getPointAt(t < 1 ? t : 0.999));

    if (interactive) {
      mouseXDamped.current = THREE.MathUtils.damp(
        mouseXDamped.current,
        store.current.mouseX,
        4,
        delta
      );
      mouseYDamped.current = THREE.MathUtils.damp(
        mouseYDamped.current,
        store.current.mouseY,
        4,
        delta
      );
      targetPosition.x += mouseXDamped.current * parallaxStrength;
      targetPosition.y += mouseYDamped.current * parallaxStrength * 0.6;
    }

    camera.position.copy(targetPosition);
    camera.lookAt(lookTarget);
  });

  return null;
}

export { CameraRig };
