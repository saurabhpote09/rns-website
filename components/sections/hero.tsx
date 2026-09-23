import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceholderGraphic } from "@/components/ui/placeholder-graphic";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { Magnetic } from "@/components/motion/magnetic";
import { Tilt } from "@/components/motion/tilt";
import { HeroScene } from "@/components/three/hero-scene";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const ARROW_CLASS =
  "static inset-auto my-0 size-11 shrink-0 translate-x-0 rounded-full border-surface-foreground/15 bg-transparent text-surface-foreground hover:bg-surface-foreground/10";

function Hero() {
  return (
    <section
      id="discover"
      className="relative overflow-hidden bg-surface text-surface-foreground"
    >
      <Parallax speed={40} className="pointer-events-none absolute inset-0">
        <div className="h-full w-full bg-[radial-gradient(circle_at_30%_35%,color-mix(in_srgb,var(--brand)_25%,transparent),transparent_60%)]" />
      </Parallax>
      <div className="absolute inset-0">
        <HeroScene className="absolute inset-0 h-full w-full" />
      </div>
      <Carousel opts={{ loop: true }} className="relative mx-auto max-w-[1440px]">
        <CarouselContent>
          <CarouselItem>
            <div className="grid gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-12 lg:py-28">
              <StaggerGroup onMount>
                <StaggerItem className="mb-6 flex items-center gap-2 text-sm font-medium text-surface-foreground/90 italic">
                  <span className="size-1.5 rounded-full bg-brand" />
                  Zero Trust. AI-Ready. Always Resilient.
                </StaggerItem>

                <StaggerItem
                  as="h1"
                  className="font-heading text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl"
                >
                  AI That Detects.
                  <br />
                  <span className="text-brand">Zero Trust</span> That
                  <br />
                  Defends.
                </StaggerItem>

                <StaggerItem className="mt-6 max-w-lg text-base text-surface-muted-foreground sm:text-lg">
                  RNS designs, builds and operates AI-driven Zero Trust
                  security architectures for the Middle East&apos;s most
                  critical enterprises and government entities.
                </StaggerItem>

                <StaggerItem className="mt-10 flex flex-wrap items-center gap-4">
                  <Magnetic>
                    <Button size="lg" className="rounded-full px-6">
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                      Book a Security Consultation
                    </Button>
                  </Magnetic>
                  <Magnetic>
                    <Button
                      size="lg"
                      variant="glass"
                      className="rounded-full px-6"
                    >
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                      Explore Our Solutions
                    </Button>
                  </Magnetic>
                </StaggerItem>

                <StaggerItem className="mt-16 flex items-center gap-3">
                  <CarouselPrevious className={ARROW_CLASS} />
                  <CarouselNext className={ARROW_CLASS} />
                </StaggerItem>
              </StaggerGroup>

              <Parallax speed={24}>
                <Reveal onMount delay={0.3} y={0} scale={0.97}>
                  <Tilt>
                    <PlaceholderGraphic
                      icon={ShieldCheck}
                      tone="red"
                      label="Hero illustration"
                      className="aspect-square w-full lg:aspect-[4/3]"
                    />
                  </Tilt>
                </Reveal>
              </Parallax>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </section>
  );
}

export { Hero };
