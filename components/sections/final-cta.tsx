import { ArrowRight, ShieldHalf } from "lucide-react";
import { SectionTag } from "@/components/ui/section-tag";
import { Button } from "@/components/ui/button";
import { PlaceholderGraphic } from "@/components/ui/placeholder-graphic";
import { Parallax } from "@/components/motion/parallax";
import { Magnetic } from "@/components/motion/magnetic";
import { ParticleNetwork } from "@/components/motion/particle-network";
import { SplitHeadline } from "@/components/motion/split-headline";

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-surface py-24 text-surface-foreground">
      <Parallax speed={30} className="pointer-events-none absolute inset-0">
        <div className="h-full w-full bg-gradient-to-tr from-brand/20 via-transparent to-transparent" />
      </Parallax>
      <div className="absolute inset-0">
        <ParticleNetwork className="absolute inset-0 h-full w-full" density={0.00004} />
      </div>
      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-6 lg:grid-cols-2 lg:items-center lg:px-12">
        <Parallax speed={16}>
          <PlaceholderGraphic
            icon={ShieldHalf}
            tone="red"
            label="RNS mark"
            className="aspect-square w-full max-w-md"
          />
        </Parallax>

        <div>
          <SectionTag className="text-surface-muted-foreground">
            Get Started
          </SectionTag>
          <SplitHeadline className="mt-6 font-heading text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
            Start With a Conversation. Not a Proposal.
          </SplitHeadline>
          <p className="mt-4 max-w-lg text-surface-muted-foreground">
            Ninety minutes with an RNS architect. We map your exposure,
            your regulatory obligations and the three things worth fixing
            first. No obligation, no product pitch.
          </p>
          <Magnetic className="mt-8">
            <Button size="lg" className="rounded-full px-6">
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
              Book a Security Consultation
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

export { FinalCta };
