"use client";

import { useRef, type MutableRefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const ROW_1 = [
  "CloudSEK",
  "Palo Alto Networks",
  "Akamai",
  "Check Point",
  "Forcepoint",
  "CrowdStrike",
];
const ROW_2 = [
  "Elastic",
  "Rapid7",
  "SailPoint",
  "Checkmarx",
  "Saviynt",
  "SentinelOne",
];

function LogoCard({ name }: { name: string }) {
  return (
    <div className="flex h-24 w-56 shrink-0 items-center justify-center rounded-xl border border-border px-4 text-center text-sm font-semibold text-foreground/70">
      {name}
    </div>
  );
}

function MarqueeRow({
  items,
  reverse = false,
  tweenRef,
}: {
  items: string[];
  reverse?: boolean;
  tweenRef: MutableRefObject<gsap.core.Tween | null>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!trackRef.current) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = reverse
          ? gsap.fromTo(
              trackRef.current,
              { xPercent: -50 },
              { xPercent: 0, ease: "none", duration: 28, repeat: -1 }
            )
          : gsap.to(trackRef.current, {
              xPercent: -50,
              ease: "none",
              duration: 28,
              repeat: -1,
            });
        tweenRef.current = tween;
        return () => tween.kill();
      });
      return () => mm.revert();
    },
    { scope: trackRef }
  );

  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => tweenRef.current?.pause()}
      onMouseLeave={() => tweenRef.current?.resume()}
    >
      <div ref={trackRef} className="flex w-max gap-4">
        {doubled.map((name, i) => (
          <LogoCard key={`${name}-${i}`} name={name} />
        ))}
      </div>
    </div>
  );
}

function PartnerLogos() {
  const tween1 = useRef<gsap.core.Tween | null>(null);
  const tween2 = useRef<gsap.core.Tween | null>(null);

  return (
    <section
      className="overflow-hidden bg-background py-16"
      aria-label="Technology partners"
    >
      <div className="flex flex-col gap-4">
        <MarqueeRow items={ROW_1} tweenRef={tween1} />
        <MarqueeRow items={ROW_2} reverse tweenRef={tween2} />
      </div>
    </section>
  );
}

export { PartnerLogos };
