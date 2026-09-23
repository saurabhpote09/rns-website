"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneStore } from "@/lib/three/scroll-store";

// Node positions along the curve (parametric t) — spaced away from the very
// ends so nodes don't sit exactly at the path's start/finish.
const NODE_TS = [0.12, 0.32, 0.52, 0.72, 0.9];
// A couple of cross-links beyond the adjacent chain so it reads as a mesh
// forming, not a single strand — mirrors the "additional connections appear" beat.
const EXTRA_LINKS: [number, number][] = [
  [0, 2],
  [2, 4],
];

const PROXIMITY_RADIUS = 1.1;

type EndpointNodesProps = {
  store: RefObject<SceneStore>;
  curve: THREE.CatmullRomCurve3;
  revealOffset?: number;
  interactive: boolean;
  color?: string;
};

function EndpointNodes({
  store,
  curve,
  revealOffset = 0,
  interactive,
  color = "#22c55e",
}: EndpointNodesProps) {
  const { camera } = useThree();
  const positions = useMemo(
    () => NODE_TS.map((t) => curve.getPointAt(t)),
    [curve]
  );
  const links = useMemo(
    () => [
      ...NODE_TS.slice(0, -1).map((_, i): [number, number] => [i, i + 1]),
      ...EXTRA_LINKS,
    ],
    []
  );
  const meanZ = useMemo(
    () => positions.reduce((sum, p) => sum + p.z, 0) / positions.length,
    [positions]
  );
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), -meanZ),
    [meanZ]
  );
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useMemo(() => new THREE.Vector2(), []);
  const mouseWorld = useMemo(() => new THREE.Vector3(), []);

  const coreRefs = useRef<(THREE.Mesh | null)[]>([]);
  const wireRefs = useRef<(THREE.Mesh | null)[]>([]);
  const activation = useRef<number[]>(NODE_TS.map(() => 0));

  const lines = useMemo(
    () =>
      links.map(([a, b]) => {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          positions[a],
          positions[b],
        ]);
        const material = new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0,
        });
        return new THREE.Line(geometry, material);
      }),
    [links, positions, color]
  );

  useFrame(() => {
    if (interactive) {
      pointer.set(store.current.mouseX, store.current.mouseY);
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(plane, mouseWorld);
    }

    const progress = THREE.MathUtils.clamp(store.current.progress + revealOffset, 0, 1);

    NODE_TS.forEach((t, i) => {
      const revealed = THREE.MathUtils.smoothstep(progress, t - 0.08, t + 0.02);
      const proximity = interactive
        ? THREE.MathUtils.smoothstep(
            PROXIMITY_RADIUS - mouseWorld.distanceTo(positions[i]),
            0,
            PROXIMITY_RADIUS
          )
        : 0;
      activation.current[i] = revealed;

      const scale = revealed * (1 + proximity * 0.7);
      const core = coreRefs.current[i];
      const wire = wireRefs.current[i];
      if (core) {
        core.scale.setScalar(THREE.MathUtils.damp(core.scale.x, scale, 6, 0.016));
        const mat = core.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.3 + revealed * 0.35 + proximity * 0.9;
        mat.opacity = revealed * 0.85;
      }
      if (wire) {
        wire.scale.setScalar(THREE.MathUtils.damp(wire.scale.x, scale, 5, 0.016));
        (wire.material as THREE.MeshBasicMaterial).opacity = revealed * 0.3;
      }
    });

    links.forEach(([a, b], i) => {
      const mat = lines[i].material as THREE.LineBasicMaterial;
      const target =
        Math.min(activation.current[a], activation.current[b]) * 0.35;
      mat.opacity = THREE.MathUtils.damp(mat.opacity, target, 5, 0.016);
    });
  });

  return (
    <group>
      {positions.map((p, i) => (
        <group key={i} position={p}>
          <mesh
            ref={(el) => {
              coreRefs.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
              transparent
              opacity={0}
              toneMapped={false}
            />
          </mesh>
          <mesh
            ref={(el) => {
              wireRefs.current[i] = el;
            }}
          >
            <icosahedronGeometry args={[0.19, 0]} />
            <meshBasicMaterial color={color} wireframe transparent opacity={0} />
          </mesh>
        </group>
      ))}
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  );
}

export { EndpointNodes };
