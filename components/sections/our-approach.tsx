"use client";

import { useRef, useState } from "react";
import { Search, Settings, Code2, BarChart3, PenTool } from "lucide-react";
import { SectionTag } from "@/components/ui/section-tag";
import { Logo } from "@/components/ui/logo";
import { Reveal } from "@/components/motion/reveal";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "cn";

const STAGES = [
  {
    id: "01",
    label: "Assess",
    icon: Search,
    top: "2%",
    left: "50%",
    description:
      "Map risk exposure, architectural gaps and regulatory obligations against your real environment.",
    deliverable: "Risk & Gap Assessments",
    duration: "2-3 Weeks",
  },
  {
    id: "02",
    label: "Design",
    icon: PenTool,
    top: "27%",
    left: "88%",
    description:
      "Translate the target state into a concrete architecture — platforms, integrations, and the sequence that gets you there.",
    deliverable: "Target Architecture & Roadmap",
    duration: "2-4 Weeks",
  },
  {
    id: "03",
    label: "Implement",
    icon: Code2,
    top: "80%",
    left: "74%",
    description:
      "Build and integrate the platforms, migrate policies, and wire detection into the environment you actually run.",
    deliverable: "Deployed Architecture",
    duration: "6-12 Weeks",
  },
  {
    id: "04",
    label: "Operate",
    icon: Settings,
    top: "80%",
    left: "26%",
    description:
      "24/7 monitoring, tuning and incident response against contractual MTTD and MTTR SLAs.",
    deliverable: "SOC Operations & SLAs",
    duration: "Continuous",
  },
  {
    id: "05",
    label: "Optimize",
    icon: BarChart3,
    top: "27%",
    left: "12%",
    description:
      "Quarterly reviews against new threats, new regulation and what the last 90 days actually taught us.",
    deliverable: "Quarterly Improvement Reports",
    duration: "Ongoing",
  },
];

const PIN_START = "top top+=80";
const PIN_END = "+=150%";

// Stage positions, reused as the track's control points (percent → 0-100 viewBox units).
const NODE_POINTS = STAGES.map((s) => ({
  x: parseFloat(s.left),
  y: parseFloat(s.top),
}));

// Closed Catmull-Rom spline through the node points, converted to cubic beziers —
// gives the marker a smooth orbit to travel rather than straight pentagon edges.
function buildOrbitPath(points: { x: number; y: number }[]) {
  const n = points.length;
  let d = `M ${points[0].x} ${points[0].y} `;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += `C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y} `;
  }
  return d + "Z";
}

const ORBIT_PATH = buildOrbitPath(NODE_POINTS);

function OurApproach() {
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [markerHovered, setMarkerHovered] = useState(false);

  // Park the traveling marker at the first stage before scroll-linked
  // motion (or on mobile/reduced-motion, where it never activates) takes over.
  useGSAP(
    () => {
      if (!markerRef.current) return;
      gsap.set(markerRef.current, { x: NODE_POINTS[0].x, y: NODE_POINTS[0].y });
    },
    { scope: pinRef }
  );

  // Pin the diagram while scrolling and advance the active stage in sync,
  // drawing the connecting track and carrying a glowing marker along it —
  // desktop + motion-ok only; smaller/reduced-motion viewports keep the
  // static "Assess" default below.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 1024px)",
        () => {
          const steps = STAGES.length;
          const pinTrigger = ScrollTrigger.create({
            trigger: pinRef.current,
            start: PIN_START,
            end: PIN_END,
            pin: true,
            scrub: 1,
            onUpdate(self) {
              const idx = Math.min(steps - 1, Math.floor(self.progress * steps));
              setActiveIndex((prev) => (prev === idx ? prev : idx));
            },
          });

          let lineTween: gsap.core.Tween | undefined;
          let markerTween: gsap.core.Tween | undefined;
          if (progressPathRef.current && markerRef.current) {
            lineTween = gsap.to(progressPathRef.current, {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: pinRef.current,
                start: PIN_START,
                end: PIN_END,
                scrub: 1.2,
              },
            });
            markerTween = gsap.to(markerRef.current, {
              motionPath: {
                path: progressPathRef.current,
                align: progressPathRef.current,
                alignOrigin: [0.5, 0.5],
                autoRotate: true,
              },
              ease: "none",
              scrollTrigger: {
                trigger: pinRef.current,
                start: PIN_START,
                end: PIN_END,
                scrub: 1.2,
              },
            });
          }

          return () => {
            pinTrigger.kill();
            lineTween?.scrollTrigger?.kill();
            lineTween?.kill();
            markerTween?.scrollTrigger?.kill();
            markerTween?.kill();
          };
        }
      );
      return () => mm.revert();
    },
    { scope: pinRef }
  );

  // Crossfade the detail card whenever the active stage changes.
  useGSAP(
    () => {
      if (!cardRef.current) return;
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );
    },
    { dependencies: [activeIndex], scope: pinRef }
  );

  // Pulse the node the marker has just arrived at.
  useGSAP(
    () => {
      const el = nodeRefs.current[activeIndex];
      if (!el) return;
      gsap.fromTo(
        el,
        { scale: 1 },
        { scale: 1.12, duration: 0.25, ease: "power2.out", yoyo: true, repeat: 1 }
      );
    },
    { dependencies: [activeIndex], scope: pinRef }
  );

  const stage = STAGES[activeIndex];

  return (
    <section id="approach" className="bg-surface py-24 text-surface-foreground">
      <div ref={pinRef} className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[340px_1fr] lg:items-center">
          <Reveal>
            <SectionTag className="text-surface-muted-foreground">
              Our Approach
            </SectionTag>
            <h2 className="mt-6 font-heading text-3xl leading-tight font-bold sm:text-4xl">
              How an RNS engagement actually runs
            </h2>
            <p className="mt-4 text-sm text-surface-muted-foreground">
              Security does not get deployed. It gets engineered, then
              operated, then improved. Scroll to walk through the five
              stages.
            </p>
          </Reveal>

          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center">
            <div className="relative aspect-square w-full max-w-lg shrink-0">
              <svg
                viewBox="0 0 100 100"
                className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block"
                aria-hidden
              >
                <path
                  d={ORBIT_PATH}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={0.12}
                  strokeWidth={1.5}
                  className="text-surface-foreground"
                />
                <path
                  ref={progressPathRef}
                  d={ORBIT_PATH}
                  fill="none"
                  stroke="var(--brand)"
                  strokeOpacity={0.55}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1}
                />
                <g
                  ref={markerRef}
                  className="pointer-events-auto cursor-pointer"
                  style={{ filter: "drop-shadow(0 0 6px var(--brand))" }}
                  onMouseEnter={() => setMarkerHovered(true)}
                  onMouseLeave={() => setMarkerHovered(false)}
                >
                  <circle r={10} fill="transparent" />
                  <circle
                    r={markerHovered ? 9 : 6}
                    style={{
                      fill: "var(--brand)",
                      opacity: 0.35,
                      filter: "blur(4px)",
                      transition: "r 0.3s ease",
                    }}
                  />
                  <path d="M -3 -2 L -3 2 L 2.6 0 Z" style={{ fill: "var(--brand)" }} />
                  <circle r={1.8} style={{ fill: "var(--brand)" }} />
                </g>
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Reveal
                  scale={0.8}
                  y={0}
                  className="flex flex-col items-center gap-2"
                >
                  <Logo className="scale-90" />
                  <p className="text-xs font-semibold tracking-[0.2em] text-surface-muted-foreground uppercase">
                    RNS Lifecycle
                  </p>
                </Reveal>
              </div>

              {STAGES.map((s, i) => {
                const active = i === activeIndex;
                return (
                  <div
                    key={s.id}
                    className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3"
                    style={{ top: s.top, left: s.left }}
                  >
                    <span
                      className={cn(
                        "rounded-full bg-brand px-3 py-1 text-[10px] font-semibold tracking-wide text-brand-foreground uppercase transition-opacity duration-300",
                        active ? "opacity-100" : "opacity-0"
                      )}
                    >
                      You Are Here
                    </span>
                    <span
                      ref={(el) => {
                        nodeRefs.current[i] = el;
                      }}
                      className={cn(
                        "flex size-24 flex-col items-center justify-center gap-1 rounded-full border text-center transition-colors duration-300",
                        active
                          ? "border-brand bg-brand/20 text-surface-foreground"
                          : "border-surface-foreground/10 bg-panel text-surface-foreground/80",
                        active && markerHovered && "ring-2 ring-brand/60"
                      )}
                    >
                      <s.icon className="size-5" />
                      <span
                        className={cn(
                          "text-xs font-bold transition-colors duration-300",
                          active ? "text-brand" : "text-brand/80"
                        )}
                      >
                        {s.id}
                      </span>
                      <span className="text-[11px] font-medium tracking-wide uppercase">
                        {s.label}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              ref={cardRef}
              className="w-full max-w-xs shrink-0 rounded-xl border border-surface-foreground/10 bg-panel-maroon p-5 text-left lg:mt-4"
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-surface-foreground">
                <stage.icon className="size-4" />
                {stage.label}
              </p>
              <p className="mt-3 text-sm text-surface-muted-foreground">
                {stage.description}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-surface-foreground/10 pt-4 text-xs text-surface-muted-foreground">
                <div>
                  <p className="uppercase">Deliverables</p>
                  <p className="mt-1 text-surface-foreground/80">
                    {stage.deliverable}
                  </p>
                </div>
                <div>
                  <p className="uppercase">Typical Duration</p>
                  <p className="mt-1 text-surface-foreground/80">
                    {stage.duration}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { OurApproach };
