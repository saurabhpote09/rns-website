"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { cn } from "cn";
import { createSceneStore, type SceneStore } from "@/lib/three/scroll-store";
import { getSceneCapabilities, type SceneCapabilities } from "@/lib/three/capabilities";
import { useScrollProgressStore } from "@/hooks/use-scroll-progress-store";
import { TrustMeshScene } from "@/components/three/trust-mesh-scene";

/**
 * The closing bookend of the trust-mesh journey — same system as HeroScene,
 * framed as the resolved state. See hero-scene.tsx for the mount/lifecycle
 * rationale (kept in sync with this file intentionally).
 */
function CtaScene({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const storeRef = useRef(createSceneStore());
  const [capabilities] = useState(() => getSceneCapabilities());
  const [everMounted, setEverMounted] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isIntersecting = false;
    function syncActive() {
      setActive(isIntersecting && !document.hidden);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) setEverMounted(true);
        syncActive();
      },
      { rootMargin: "200px" }
    );
    io.observe(container);
    document.addEventListener("visibilitychange", syncActive);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", syncActive);
    };
  }, []);

  useEffect(() => {
    if (capabilities.coarsePointer || capabilities.reducedMotion) return;
    function onPointerMove(e: PointerEvent) {
      storeRef.current.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      storeRef.current.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [capabilities]);

  const interactive = !capabilities.coarsePointer && !capabilities.reducedMotion;

  return (
    <div ref={containerRef} className={cn("pointer-events-none", className)} aria-hidden>
      {everMounted && (
        <SceneCanvas
          store={storeRef}
          capabilities={capabilities}
          active={active}
          interactive={interactive}
          triggerRef={containerRef}
        />
      )}
    </div>
  );
}

function SceneCanvas({
  store,
  capabilities,
  active,
  interactive,
  triggerRef,
}: {
  store: RefObject<SceneStore>;
  capabilities: SceneCapabilities;
  active: boolean;
  interactive: boolean;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const invalidateRef = useRef<() => void>(() => {});

  useScrollProgressStore({
    store,
    triggerRef,
    start: "top bottom",
    end: "bottom top",
    onUpdate: () => invalidateRef.current(),
  });

  const frameloop = capabilities.reducedMotion ? "demand" : active ? "always" : "never";

  return (
    <Canvas
      className="h-full w-full"
      dpr={capabilities.dpr}
      frameloop={frameloop}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.8, 5.4], fov: 45, near: 0.1, far: 50 }}
      onCreated={({ invalidate }) => {
        invalidateRef.current = invalidate;
      }}
    >
      <TrustMeshScene
        store={store}
        variant="cta"
        interactive={interactive}
        simplified={capabilities.isMobile}
      />
    </Canvas>
  );
}

export { CtaScene };
