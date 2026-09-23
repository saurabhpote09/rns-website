"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneStore } from "@/lib/three/scroll-store";

type PerimeterPolyhedronProps = {
  store: RefObject<SceneStore>;
  /** 0 = fully open/unassembled, 1 = fully closed/solid — the "perimeter" resolving. */
  baseClosure?: number;
  radius?: number;
  detail?: number;
  color?: string;
  position?: [number, number, number];
};

/**
 * A slowly rotating wireframe perimeter — subtle depth cue, not a hero shape.
 * Scales and brightens gradually with scroll progress, standing in for the
 * Zero Trust perimeter solidifying as the trust path completes.
 */
function PerimeterPolyhedron({
  store,
  baseClosure = 0,
  radius = 2.6,
  detail = 1,
  color = "#8a8f98",
  position = [0.5, 0, -1.5],
}: PerimeterPolyhedronProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(radius, detail),
    [radius, detail]
  );

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.rotation.y += delta * 0.035;
    mesh.rotation.x += delta * 0.012;
    const closure = THREE.MathUtils.clamp(baseClosure + store.current.progress * 0.4, 0, 1);
    const targetScale = 0.75 + closure * 0.25;
    mesh.scale.setScalar(THREE.MathUtils.damp(mesh.scale.x, targetScale, 4, delta));
    const mat = mesh.material as THREE.MeshBasicMaterial;
    mat.opacity = THREE.MathUtils.damp(mat.opacity, 0.08 + closure * 0.22, 4, delta);
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={position}>
      <meshBasicMaterial color={color} wireframe transparent opacity={0.08} />
    </mesh>
  );
}

export { PerimeterPolyhedron };
