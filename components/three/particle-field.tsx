"use client";

import { useMemo, useRef, useState, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneStore } from "@/lib/three/scroll-store";

type ParticleFieldProps = {
  store: RefObject<SceneStore>;
  curve: THREE.CatmullRomCurve3;
  interactive: boolean;
  count?: number;
  /** Added to store.progress before the curve->mesh morph blend — lets the CTA variant start already-meshed. */
  morphOffset?: number;
  polyhedronRadius?: number;
  polyhedronDetail?: number;
  color?: string;
};

/**
 * A sparse drifting field that morphs from "points scattered along the trust
 * path" (detection forming) to "points redistributed onto the perimeter's
 * vertices" (a resolved trust mesh) as scroll progress advances.
 */
function ParticleField({
  store,
  curve,
  interactive,
  count = 500,
  morphOffset = 0,
  polyhedronRadius = 2.6,
  polyhedronDetail = 1,
  color = "#ffffff",
}: ParticleFieldProps) {
  const { camera } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useMemo(() => new THREE.Vector2(), []);
  const mouseWorld = useMemo(() => new THREE.Vector3(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0.5), []);

  // Random per-particle jitter/phase only needs to be picked once, ever — a
  // lazy useState initializer (unlike useMemo) is guaranteed to run exactly
  // once per mount, which is what makes Math.random() here safe/pure-enough.
  const [{ stateA, stateB, phases, current }] = useState(() => {
    const a = new Float32Array(count * 3);
    const b = new Float32Array(count * 3);
    const ph = new Float32Array(count * 2); // [phase, speed] pairs
    const cur = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const p = curve.getPointAt(THREE.MathUtils.clamp(t, 0, 0.999));
      const jitter = 0.5;
      a[i * 3] = p.x + (Math.random() - 0.5) * jitter;
      a[i * 3 + 1] = p.y + (Math.random() - 0.5) * jitter;
      a[i * 3 + 2] = p.z + (Math.random() - 0.5) * jitter;
      ph[i * 2] = Math.random() * Math.PI * 2;
      ph[i * 2 + 1] = 0.15 + Math.random() * 0.25;
    }

    const poly = new THREE.IcosahedronGeometry(polyhedronRadius, polyhedronDetail);
    const polyPos = poly.getAttribute("position");
    for (let i = 0; i < count; i++) {
      const vi = i % polyPos.count;
      b[i * 3] = polyPos.getX(vi) + 0.5;
      b[i * 3 + 1] = polyPos.getY(vi);
      b[i * 3 + 2] = polyPos.getZ(vi) - 1.5;
    }
    poly.dispose();

    cur.set(a);
    return { stateA: a, stateB: b, phases: ph, current: cur };
  });

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(current, 3));
    return g;
  }, [current]);

  useFrame(({ clock }) => {
    if (interactive) {
      pointer.set(store.current.mouseX, store.current.mouseY);
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(plane, mouseWorld);
    }

    const morphT = THREE.MathUtils.smoothstep(
      THREE.MathUtils.clamp(store.current.progress + morphOffset, 0, 1),
      0,
      1
    );
    const time = clock.elapsedTime;
    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const phase = phases[i * 2];
      const speed = phases[i * 2 + 1];
      const driftX = Math.sin(time * speed + phase) * 0.12;
      const driftY = Math.cos(time * speed * 0.8 + phase) * 0.12;

      let x = THREE.MathUtils.lerp(stateA[ix], stateB[ix], morphT) + driftX;
      let y = THREE.MathUtils.lerp(stateA[ix + 1], stateB[ix + 1], morphT) + driftY;
      const z = THREE.MathUtils.lerp(stateA[ix + 2], stateB[ix + 2], morphT);

      if (interactive) {
        const dx = x - mouseWorld.x;
        const dy = y - mouseWorld.y;
        const dist = Math.hypot(dx, dy);
        const reach = 1.4;
        if (dist < reach) {
          const push = (1 - dist / reach) * 0.35;
          x += (dx / (dist || 1)) * push;
          y += (dy / (dist || 1)) * push;
        }
      }

      posAttr.setXYZ(i, x, y, z);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color={color}
        size={0.025}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export { ParticleField };
