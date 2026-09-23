"use client";

import { useRef } from "react";
import {
  ArrowUpRight,
  Cloud,
  Code2,
  Database,
  Laptop,
  UserRound,
} from "lucide-react";
import { SectionTag } from "@/components/ui/section-tag";
import { Button } from "@/components/ui/button";
import { PlaceholderGraphic } from "@/components/ui/placeholder-graphic";
import { Reveal } from "@/components/motion/reveal";
import { PathProgressDot } from "@/components/motion/path-progress-dot";
import { useScrollSyncIndex } from "@/hooks/use-scroll-sync-index";
import { cn } from "cn";

const DOMAINS = [
  {
    icon: UserRound,
    label: "Identity Protection",
    headline: "Steal the Credential. Inherit Nothing.",
    body: "Phishing-resistant MFA · IGA lifecycle automation · PAM with just-in-time elevation · CIAM · AI-driven ITDR",
    tag: "100+ identity programmes",
  },
  {
    icon: Laptop,
    label: "Endpoint Protection",
    headline: "One Laptop Gets Hit. The Other Five Thousand Never Know.",
    body: "EDR/XDR mapped to MITRE ATT&CK · sub-minute host isolation · anti-ransomware rollback · risk-based patching",
    tag: "23,800+ endpoints protected",
  },
  {
    icon: Cloud,
    label: "Cloud & Network Protection",
    headline: "Your Worst Cloud Risk Shipped as a Default Setting.",
    body: "CNAPP and CSPM · ZTNA and SASE · micro-segmentation · NDR · IaC and entitlement drift detection",
    tag: "AWS, Azure, Google Cloud",
  },
  {
    icon: Code2,
    label: "Application Protection",
    headline: "Shift Left or Shift Blame.",
    body: "SAST · DAST · SCA and SBOM · secrets detection · container and IaC scanning · API discovery · ASPM prioritisation",
    tag: "Code to container to API",
  },
  {
    icon: Database,
    label: "Data Protection",
    headline: "Your Data Doesn't Leak. It Walks Out With Permission.",
    body: "AI-powered classification · endpoint and network DLP · CASB · encryption and KMS · generative-AI data controls",
    tag: "PDPL, NESA, ISO 27001, PCI DSS",
  },
];

function FiveDomains() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { itemRefs, activeIndex } = useScrollSyncIndex(
    DOMAINS.length,
    sectionRef
  );

  return (
    <section id="solution" className="bg-surface py-24 text-surface-foreground">
      <div ref={sectionRef} className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <SectionTag className="text-surface-muted-foreground">
              Our Solution
            </SectionTag>
            <h2 className="mt-6 max-w-2xl font-heading text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              Five Domains. One Architecture. Nothing Trusted by Default.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-surface-muted-foreground lg:mt-2">
            Most organizations do not have a tooling problem. They have an
            integration problem. RNS designs the target architecture first,
            then aligns AI-driven platforms to it.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[280px_1fr]">
          <div className="sticky top-28 hidden self-start lg:block">
            <PathProgressDot
              progress={activeIndex / (DOMAINS.length - 1)}
              className="text-accent-green"
              dotClassName="drop-shadow-[0_0_6px_var(--accent-green)]"
            />
            <div className="flex flex-col gap-4 pl-8">
              {DOMAINS.map((domain, i) => (
                <div
                  key={domain.label}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-4 transition-colors duration-300",
                    activeIndex === i
                      ? "border-accent-green/60 bg-panel"
                      : "border-accent-green/20 bg-panel/60"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full border text-accent-green transition-colors duration-300",
                      activeIndex === i
                        ? "border-accent-green bg-accent-green/10"
                        : "border-accent-green/40"
                    )}
                  >
                    <domain.icon className="size-4" />
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      activeIndex === i
                        ? "text-surface-foreground"
                        : "text-surface-foreground/60"
                    )}
                  >
                    {domain.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {DOMAINS.map((domain, i) => (
              <div
                key={domain.label}
                ref={(el: HTMLDivElement | null) => {
                  itemRefs.current[i] = el;
                }}
                className={cn(
                  "rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1.5",
                  activeIndex === i
                    ? "border-accent-green/40"
                    : "border-surface-foreground/10"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-accent-green">
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <span>{domain.label}</span>
                    </p>
                    <h3 className="mt-3 font-heading text-xl font-semibold sm:text-2xl">
                      {domain.headline}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm text-surface-muted-foreground">
                      {domain.body}
                    </p>
                  </div>
                  <PlaceholderGraphic
                    icon={domain.icon}
                    tone="green"
                    className="hidden size-16 shrink-0 sm:flex"
                  />
                </div>
                <p className="mt-6 flex items-center gap-1 text-sm font-medium text-accent-green">
                  {domain.tag}
                  <ArrowUpRight className="size-4" />
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Button size="lg" className="rounded-full px-6">
            Explore All Five Domains
          </Button>
          <Button
            size="lg"
            variant="glass"
            className="rounded-full px-6"
          >
            Request an Architecture Review
          </Button>
        </div>
      </div>
    </section>
  );
}

export { FiveDomains };
