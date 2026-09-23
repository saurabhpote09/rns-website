"use client";

import { useRef } from "react";
import { Gavel, ShieldCheck, Swords, UsersRound } from "lucide-react";
import { SectionTag } from "@/components/ui/section-tag";
import { Button } from "@/components/ui/button";
import { PlaceholderGraphic } from "@/components/ui/placeholder-graphic";
import { Reveal } from "@/components/motion/reveal";
import { PathProgressDot } from "@/components/motion/path-progress-dot";
import { useScrollSyncIndex } from "@/hooks/use-scroll-sync-index";
import { cn } from "cn";

const SERVICES = [
  {
    icon: ShieldCheck,
    label: "IntelliShield™",
    kicker: "IntelliShield™ — MDR",
    headline: "You Can't Roster Your Way to 24/7 With Four Analysts.",
    body: "24/7 SOC · SIEM and SOAR tuning · UEBA · AI-assisted triage · threat hunting · contractual MTTD and MTTR SLAs",
  },
  {
    icon: Swords,
    label: "IntelliStrike™",
    kicker: "IntelliStrike™ — Offensive Security",
    headline: "Somebody Is Already Testing You. They Just Won't Send Findings.",
    body: "VAPT · red teaming · web, mobile and API testing · cloud and Kubernetes · OWASP, PTES and MITRE ATT&CK methodology",
  },
  {
    icon: Gavel,
    label: "IntelliAssure™",
    kicker: "IntelliAssure™ — GRC",
    headline: "Compliance as a Byproduct, Not a Project.",
    body: "ISO 27001 and 22301 · UAE NESA · PDPL and GDPR · PCI DSS · SWIFT CSP · NIST CSF · ISMS design · risk register",
  },
  {
    icon: UsersRound,
    label: "IntelliDeploy™",
    kicker: "IntelliDeploy™ — Talent",
    headline: "Certified on the Platform You Actually Bought.",
    body: "CISSP, CISM, OSCP-certified · L1–L3 SOC · SIEM and IAM engineers · cloud and DevSecOps · GRC consultants",
  },
];

function OurServices() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { itemRefs, activeIndex } = useScrollSyncIndex(
    SERVICES.length,
    sectionRef
  );

  return (
    <section id="services" className="bg-background py-24">
      <div ref={sectionRef} className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <SectionTag className="text-muted-foreground">
              Our Services
            </SectionTag>
            <h2 className="mt-6 max-w-2xl font-heading text-3xl leading-tight font-bold text-foreground sm:text-4xl lg:text-5xl">
              Architecture Is the Design. These Four Keep It Alive.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground lg:mt-2">
            Security is not a deployment. It is an operating discipline
            running continuously, evidenced monthly.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[280px_1fr]">
          <div className="sticky top-28 hidden self-start lg:block">
            <PathProgressDot
              progress={activeIndex / (SERVICES.length - 1)}
              className="text-brand"
              dotClassName="drop-shadow-[0_0_6px_var(--brand)]"
            />
            <div className="flex flex-col gap-4 pl-8">
              {SERVICES.map((service, i) => (
                <div
                  key={service.label}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-4 transition-colors duration-300",
                    activeIndex === i
                      ? "border-brand/60 bg-blush"
                      : "border-brand/20 bg-blush/60"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full border text-brand transition-colors duration-300",
                      activeIndex === i
                        ? "border-brand bg-brand/10"
                        : "border-brand/40"
                    )}
                  >
                    <service.icon className="size-4" />
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      activeIndex === i
                        ? "text-foreground"
                        : "text-foreground/60"
                    )}
                  >
                    {service.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {SERVICES.map((service, i) => (
              <div
                key={service.label}
                ref={(el: HTMLDivElement | null) => {
                  itemRefs.current[i] = el;
                }}
                className={cn(
                  "rounded-2xl bg-blush p-8 ring-1 transition-all duration-300 hover:-translate-y-1.5",
                  activeIndex === i ? "ring-brand/30" : "ring-transparent"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-brand">
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <span>{service.kicker}</span>
                    </p>
                    <h3 className="mt-3 font-heading text-xl font-semibold text-foreground sm:text-2xl">
                      {service.headline}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                      {service.body}
                    </p>
                  </div>
                  <PlaceholderGraphic
                    icon={service.icon}
                    tone="red"
                    className="hidden size-16 shrink-0 sm:flex"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Button size="lg" className="rounded-full px-6">
            Explore All Five Domains
          </Button>
          <Button size="lg" variant="secondary" className="rounded-full px-6">
            Request an Architecture Review
          </Button>
        </div>

        <p className="mt-8 text-sm font-semibold text-foreground">
          IntelliShield watches. IntelliStrike tests. IntelliAssure governs.
          IntelliDeploy scales.
        </p>
      </div>
    </section>
  );
}

export { OurServices };
