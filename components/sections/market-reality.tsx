"use client";

import { useRef } from "react";
import { Bug, ShieldAlert } from "lucide-react";
import { SectionTag } from "@/components/ui/section-tag";
import { PlaceholderGraphic } from "@/components/ui/placeholder-graphic";
import { Counter } from "@/components/motion/counter";
import { Tilt } from "@/components/motion/tilt";
import { SplitHeadline } from "@/components/motion/split-headline";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const STAT_CARDS = [
  {
    value: <Counter to={31} suffix="%" />,
    label: "31% of breaches now start with vulnerability exploitation.",
  },
  {
    value: <Counter to={43} suffix=" Days" />,
    label: "43 days median time to patch",
  },
  {
    value: <Counter to={7.2} decimals={1} prefix="USD " suffix="M" />,
    label: "USD 7.2M average Middle East breach cost",
  },
  {
    value: <Counter to={94} suffix="%" />,
    label:
      "94% of leaders name AI the biggest force reshaping security in 2026",
  },
];

function MarketReality() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<SVGPathElement>(null);
  const line2Ref = useRef<SVGPathElement>(null);
  const barRowRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Trend lines draw in and the stat bars fill as the section scrolls
  // through view — the graphics carry the motion, the cards just sit there.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const triggers: ScrollTrigger[] = [];

        [line1Ref.current, line2Ref.current].forEach((line) => {
          if (!line) return;
          const tween = gsap.fromTo(
            line,
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: line,
                start: "top 85%",
                end: "top 45%",
                scrub: 1,
              },
            }
          );
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        });

        const bars = barRefs.current.filter((el): el is HTMLSpanElement => !!el);
        if (bars.length && barRowRef.current) {
          const tween = gsap.fromTo(
            bars,
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: "left center",
              stagger: 0.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: barRowRef.current,
                start: "top 85%",
                end: "top 45%",
                scrub: 1,
              },
            }
          );
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        }

        return () => triggers.forEach((t) => t.kill());
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section className="bg-surface py-24 text-surface-foreground">
      <div ref={sectionRef} className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <SectionTag className="text-surface-muted-foreground">
          The Market Reality
        </SectionTag>
        <SplitHeadline className="mt-6 max-w-3xl font-heading text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
          The Attack Surface Changed. Most Programmes Did Not.
        </SplitHeadline>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-brand/30 p-8">
            <Tilt>
              <PlaceholderGraphic
                icon={Bug}
                tone="red"
                className="mb-8 aspect-[16/9] w-full"
              />
            </Tilt>
            <p className="text-sm font-semibold tracking-wider text-brand uppercase">
              What Changed
            </p>
            <p className="mt-4 text-surface-muted-foreground">
              For the first time in <strong className="text-surface-foreground">19 years</strong> of
              Verizon breach data, exploiting a known vulnerability not
              stealing a password is the most common way in:{" "}
              <strong className="text-surface-foreground">31% of breaches</strong>, up{" "}
              <strong className="text-surface-foreground">55% year</strong> on year. Median time to
              patch stretched from <strong className="text-surface-foreground">32 days to 43</strong>.
            </p>
            <p className="mt-4 text-surface-muted-foreground">
              Attackers got faster. Remediation got slower. The gap between
              them is where breaches live.
            </p>
            <svg
              viewBox="0 0 100 30"
              preserveAspectRatio="none"
              className="mt-6 h-10 w-full overflow-visible"
              aria-hidden
            >
              <path
                d="M0,26 L20,22 L40,23 L55,14 L75,10 L100,4"
                fill="none"
                stroke="color-mix(in srgb, var(--brand) 30%, transparent)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                ref={line1Ref}
                d="M0,26 L20,22 L40,23 L55,14 L75,10 L100,4"
                fill="none"
                stroke="var(--brand)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
              />
            </svg>
          </div>

          <div className="rounded-2xl border border-accent-green/30 p-8">
            <Tilt>
              <PlaceholderGraphic
                icon={ShieldAlert}
                tone="green"
                className="mb-8 aspect-[16/9] w-full"
              />
            </Tilt>
            <p className="text-sm font-semibold tracking-wider text-accent-green uppercase">
              What It Costs
            </p>
            <p className="mt-4 text-surface-muted-foreground">
              The global average breach now costs{" "}
              <strong className="text-surface-foreground">USD 4.99 million</strong> a record,{" "}
              <strong className="text-surface-foreground">12% up</strong> on last year.
            </p>
            <p className="mt-4 text-surface-muted-foreground">
              In the Middle East it is <strong className="text-surface-foreground">USD 7.2 million</strong>,
              and <strong className="text-surface-foreground">USD 9.1 million</strong> in financial
              services. Regionally, third-party compromise is the most
              common entry point at <strong className="text-surface-foreground">17% of incidents</strong>.
            </p>
            <svg
              viewBox="0 0 100 30"
              preserveAspectRatio="none"
              className="mt-6 h-10 w-full overflow-visible"
              aria-hidden
            >
              <path
                d="M0,24 L25,20 L50,15 L70,12 L85,7 L100,4"
                fill="none"
                stroke="color-mix(in srgb, var(--accent-green) 30%, transparent)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                ref={line2Ref}
                d="M0,24 L25,20 L50,15 L70,12 L85,7 L100,4"
                fill="none"
                stroke="var(--accent-green)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
              />
            </svg>
          </div>
        </div>

        <div ref={barRowRef} className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_CARDS.map((stat, i) => (
            <div
              key={stat.label}
              style={{ rotate: i % 2 === 0 ? "-1deg" : "1deg" }}
              className="rounded-xl bg-panel p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="font-heading text-3xl font-bold">{stat.value}</p>
              <p className="mt-2 text-sm text-surface-muted-foreground">
                {stat.label}
              </p>
              <span
                ref={(el) => {
                  barRefs.current[i] = el;
                }}
                className="mt-4 block h-0.5 w-full rounded-full bg-brand/50"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { MarketReality };
