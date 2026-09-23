"use client";

import { useRef } from "react";
import { Building2, ShieldCheck, Users } from "lucide-react";
import { Counter } from "@/components/motion/counter";
import { Parallax } from "@/components/motion/parallax";
import { gsap, useGSAP } from "@/lib/gsap";

const STATS = [
  { icon: ShieldCheck, value: 10, suffix: " +", label: "Years" },
  { icon: Building2, value: 500, suffix: " +", label: "Organizations" },
  { icon: Users, value: 1, suffix: "", label: "Discipline" },
];

function StatsBanner() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  // A grounding line draws itself beneath the stats as the section scrolls
  // into view, instead of the row fading/sliding in as a block.
  useGSAP(
    () => {
      if (!lineRef.current) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
        const tween = gsap.to(lineRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section className="relative overflow-hidden bg-surface py-20">
      <Parallax speed={30} className="pointer-events-none absolute inset-0">
        <div className="h-full w-full bg-gradient-to-t from-brand/15 via-transparent to-transparent" />
      </Parallax>
      <div ref={sectionRef} className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex flex-wrap justify-center gap-16">
          {STATS.map(({ icon: Icon, value, suffix, label }) => (
            <div key={label} className="flex items-center gap-4">
              <span className="relative flex size-20 shrink-0 items-center justify-center">
                <span
                  aria-hidden
                  className="absolute inset-0 animate-[spin_18s_linear_infinite] rounded-full border border-dashed border-brand/25 motion-reduce:animate-none"
                />
                <span className="flex size-16 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-panel text-brand">
                  <Icon className="size-6" />
                </span>
              </span>
              <div>
                <p className="font-heading text-3xl font-bold text-brand">
                  <Counter to={value} suffix={suffix} />
                </p>
                <p className="text-sm text-surface-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>
        <div
          ref={lineRef}
          className="mx-auto mt-10 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-brand/40 to-transparent"
        />
      </div>
    </section>
  );
}

export { StatsBanner };
