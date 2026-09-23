"use client";

import { useMemo, type RefObject } from "react";
import * as THREE from "three";
import type { SceneStore } from "@/lib/three/scroll-store";
import { TrustPath, TravelingSignal } from "@/components/three/trust-path";
import { EndpointNodes } from "@/components/three/endpoint-nodes";
import { ParticleField } from "@/components/three/particle-field";
import { PerimeterPolyhedron } from "@/components/three/perimeter-polyhedron";
import { CameraRig } from "@/components/three/camera-rig";

type Variant = "hero" | "cta";

type TrustMeshSceneProps = {
  store: RefObject<SceneStore>;
  variant: Variant;
  interactive: boolean;
  /** Mobile — trims segment/particle counts instead of removing the scene. */
  simplified: boolean;
};

const VARIANT_CONFIG: Record<
  Variant,
  {
    controlPoints: [number, number, number][];
    revealOffset: number;
    morphOffset: number;
    positionKeyframes: [number, number, number][];
    lookAtKeyframes: [number, number, number][];
    polyhedron: {
      baseClosure: number;
      radius: number;
      position: [number, number, number];
    };
  }
> = {
  // Opening chapter — detection forming: curve starts undrawn, camera moves
  // forward "through" the mesh as it scrolls.
  hero: {
    controlPoints: [
      [-4.5, 1.1, -2.5],
      [-2.3, -0.7, 0.4],
      [-0.2, 0.9, -1.2],
      [2.1, -0.5, 1.1],
      [4.4, 1.0, -1.8],
    ],
    revealOffset: 0,
    morphOffset: -0.25,
    positionKeyframes: [
      [0, 0.4, 6.5],
      [1.0, 0.6, 3.6],
      [-0.6, 0.3, 1.6],
    ],
    lookAtKeyframes: [
      [0, 0, 0],
      [0.5, 0.1, -0.5],
      [1.6, 0.2, -1.6],
    ],
    polyhedron: { baseClosure: 0, radius: 2.8, position: [0.8, 0, -2] },
  },
  // Closing chapter — the trust mesh resolved: curve already mostly drawn,
  // camera holds back and breathes gently rather than travelling far.
  cta: {
    controlPoints: [
      [-3.0, 0.6, -1.5],
      [-1.3, -0.3, 0.5],
      [0.3, 0.5, -0.5],
      [1.6, -0.2, 0.8],
      [3.0, 0.7, -1.2],
    ],
    revealOffset: 0.5,
    morphOffset: 0.5,
    positionKeyframes: [
      [0, 0.8, 5.4],
      [0.35, 0.5, 4.9],
      [0, 0.9, 5.5],
    ],
    lookAtKeyframes: [
      [0.15, 0, -0.2],
      [0.15, 0, -0.2],
      [0.15, 0, -0.2],
    ],
    polyhedron: { baseClosure: 0.6, radius: 2.4, position: [0.3, 0, -1.2] },
  },
};

function TrustMeshScene({ store, variant, interactive, simplified }: TrustMeshSceneProps) {
  const config = VARIANT_CONFIG[variant];
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        config.controlPoints.map((p) => new THREE.Vector3(...p))
      ),
    [config.controlPoints]
  );

  const particleCount = simplified ? 150 : 500;
  const tubularSegments = simplified ? 48 : 96;
  const polyhedronDetail = simplified ? 0 : 1;

  return (
    <>
      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#4a4a4a", "#050505", 0.5]} />

      <TrustPath
        store={store}
        curve={curve}
        revealOffset={config.revealOffset}
        tubularSegments={tubularSegments}
      />
      <TravelingSignal store={store} curve={curve} revealOffset={config.revealOffset} />
      <EndpointNodes
        store={store}
        curve={curve}
        revealOffset={config.revealOffset}
        interactive={interactive}
      />
      <ParticleField
        store={store}
        curve={curve}
        interactive={interactive}
        count={particleCount}
        morphOffset={config.morphOffset}
        polyhedronRadius={config.polyhedron.radius}
        polyhedronDetail={polyhedronDetail}
      />
      <PerimeterPolyhedron
        store={store}
        baseClosure={config.polyhedron.baseClosure}
        radius={config.polyhedron.radius}
        detail={polyhedronDetail}
        position={config.polyhedron.position}
      />
      <CameraRig
        store={store}
        interactive={interactive}
        positionKeyframes={config.positionKeyframes}
        lookAtKeyframes={config.lookAtKeyframes}
      />
    </>
  );
}

export { TrustMeshScene };
export type { Variant };
