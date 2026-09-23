"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneStore } from "@/lib/three/scroll-store";

const VERTEX_SHADER = /* glsl */ `
  attribute float aArcLength;
  varying float vArcLength;
  varying vec3 vNormal;
  void main() {
    vArcLength = aArcLength;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uProgress;
  uniform vec3 uColor;
  uniform vec3 uGlowColor;
  varying float vArcLength;
  varying vec3 vNormal;
  void main() {
    if (vArcLength > uProgress) discard;
    float leading = 1.0 - smoothstep(0.0, 0.1, uProgress - vArcLength);
    float rim = pow(1.0 - abs(vNormal.z), 2.0);
    vec3 finalColor = mix(uColor, uGlowColor, leading * 0.6) + rim * uGlowColor * 0.12;
    float alpha = smoothstep(0.0, 0.04, uProgress - vArcLength) * 0.5 + leading * 0.3;
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

/**
 * Per-segment tangent/normal/binormal frames, computed with a fixed-reference
 * fallback rather than three.js's built-in `Curve.computeFrenetFrames`.
 * Frenet propagation normalizes raw tangent/cross-product vectors that can
 * degenerate to zero-length for some CatmullRomCurve3 shapes (a momentary
 * zero-velocity point, or nearly-parallel consecutive tangents), silently
 * producing NaN that poisons the whole tube. Picking whichever of two
 * orthogonal reference axes is least parallel to the tangent avoids that
 * degeneracy entirely, at the cost of the frame not being torsion-minimizing —
 * invisible on a thin round tube.
 */
function computeStableFrames(curve: THREE.CatmullRomCurve3, segments: number) {
  const worldUp = new THREE.Vector3(0, 1, 0);
  const altUp = new THREE.Vector3(1, 0, 0);
  const normals: THREE.Vector3[] = [];
  const binormals: THREE.Vector3[] = [];

  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const tangent = curve.getTangentAt(THREE.MathUtils.clamp(u, 0, 1));
    if (!Number.isFinite(tangent.lengthSq()) || tangent.lengthSq() < 1e-10) {
      const next = curve.getPointAt(Math.min(1, u + 1 / segments));
      const prev = curve.getPointAt(Math.max(0, u - 1 / segments));
      tangent.copy(next).sub(prev);
      if (tangent.lengthSq() < 1e-10) tangent.set(1, 0, 0);
    }
    tangent.normalize();

    const reference = Math.abs(tangent.dot(worldUp)) > 0.9 ? altUp : worldUp;
    const normal = new THREE.Vector3().crossVectors(reference, tangent);
    if (normal.lengthSq() < 1e-10) normal.set(1, 0, 0);
    normal.normalize();
    const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

    normals.push(normal);
    binormals.push(binormal);
  }

  return { normals, binormals };
}

/** A TubeGeometry equivalent using computeStableFrames instead of computeFrenetFrames. */
function buildTubeGeometry(
  curve: THREE.CatmullRomCurve3,
  tubularSegments: number,
  radius: number,
  radialSegments: number
) {
  const { normals, binormals } = computeStableFrames(curve, tubularSegments);
  const positions: number[] = [];
  const normalArray: number[] = [];
  const uvs: number[] = [];
  const arcLengths: number[] = [];
  const indices: number[] = [];

  const point = new THREE.Vector3();
  const vertex = new THREE.Vector3();
  const normalVec = new THREE.Vector3();

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    point.copy(curve.getPointAt(t));
    const N = normals[i];
    const B = binormals[i];

    for (let j = 0; j <= radialSegments; j++) {
      const v = (j / radialSegments) * Math.PI * 2;
      const sin = Math.sin(v);
      const cos = -Math.cos(v);

      normalVec.set(
        cos * N.x + sin * B.x,
        cos * N.y + sin * B.y,
        cos * N.z + sin * B.z
      );
      normalVec.normalize();

      vertex.copy(point).addScaledVector(normalVec, radius);

      positions.push(vertex.x, vertex.y, vertex.z);
      normalArray.push(normalVec.x, normalVec.y, normalVec.z);
      uvs.push(t, j / radialSegments);
      arcLengths.push(t);
    }
  }

  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = (radialSegments + 1) * i + j;
      const b = (radialSegments + 1) * (i + 1) + j;
      const c = (radialSegments + 1) * (i + 1) + (j + 1);
      const d = (radialSegments + 1) * i + (j + 1);
      indices.push(a, b, d, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normalArray, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("aArcLength", new THREE.Float32BufferAttribute(arcLengths, 1));
  return geometry;
}

type TrustPathProps = {
  store: RefObject<SceneStore>;
  curve: THREE.CatmullRomCurve3;
  /** Added to store.progress before clamping — lets the CTA variant start more "formed". */
  revealOffset?: number;
  tubularSegments?: number;
  radius?: number;
  color?: string;
  glowColor?: string;
};

function TrustPath({
  store,
  curve,
  revealOffset = 0,
  tubularSegments = 96,
  radius = 0.03,
  color = "#c30000",
  glowColor = "#ff5a5a",
}: TrustPathProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(
    () => buildTubeGeometry(curve, tubularSegments, radius, 8),
    [curve, tubularSegments, radius]
  );

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uGlowColor: { value: new THREE.Color(glowColor) },
    }),
    [color, glowColor]
  );

  useFrame(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uProgress.value = THREE.MathUtils.clamp(
      store.current.progress + revealOffset,
      0,
      1
    );
  });

  return (
    <mesh geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

const GLOW_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GLOW_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    float dist = distance(vUv, vec2(0.5));
    float falloff = smoothstep(0.5, 0.0, dist);
    gl_FragColor = vec4(uColor, falloff * uIntensity);
  }
`;

type TravelingSignalProps = {
  store: RefObject<SceneStore>;
  curve: THREE.CatmullRomCurve3;
  revealOffset?: number;
  color?: string;
};

/**
 * The "detection signal" traveling the trust path — a small bright core, a
 * soft procedural billboard glow (no texture), and a point light that lets
 * it cast real light on nearby endpoint nodes as it passes.
 */
function TravelingSignal({
  store,
  curve,
  revealOffset = 0,
  color = "#ffb3b3",
}: TravelingSignalProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const glowUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uIntensity: { value: 0.55 },
    }),
    [color]
  );

  useFrame(({ camera }) => {
    const t = THREE.MathUtils.clamp(store.current.progress + revealOffset, 0, 1);
    const point = curve.getPointAt(t < 1 ? t : 0.999);
    coreRef.current?.position.copy(point);
    glowRef.current?.position.copy(point);
    lightRef.current?.position.copy(point);
    glowRef.current?.quaternion.copy(camera.quaternion);
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={glowRef}>
        <planeGeometry args={[0.45, 0.45]} />
        <shaderMaterial
          vertexShader={GLOW_VERTEX_SHADER}
          fragmentShader={GLOW_FRAGMENT_SHADER}
          uniforms={glowUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight ref={lightRef} color={color} intensity={1.4} distance={2.5} decay={2} />
    </group>
  );
}

export { TrustPath, TravelingSignal };
