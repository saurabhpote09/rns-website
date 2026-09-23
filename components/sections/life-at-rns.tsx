import { Award, Calendar, Globe, Users } from "lucide-react";
import { SectionTag } from "@/components/ui/section-tag";
import { Button } from "@/components/ui/button";
import { PlaceholderGraphic } from "@/components/ui/placeholder-graphic";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { Counter } from "@/components/motion/counter";

const STATS = [
  { icon: Award, value: 200, label: "Certified Specialists" },
  { icon: Calendar, value: 725, label: "Combined Years" },
  { icon: Globe, value: 7, label: "Countries" },
];

function LifeAtRns() {
  return (
    <section className="bg-surface py-24 text-surface-foreground">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 lg:grid-cols-2 lg:items-center lg:px-12">
        <Reveal>
          <SectionTag className="text-surface-muted-foreground">
            Life at RNS
          </SectionTag>
          <h2 className="mt-6 font-heading text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
            Architecture Is Designed by People. Meet Ours.
          </h2>
          <p className="mt-4 max-w-md text-surface-muted-foreground">
            Two hundred certified specialists across the Middle East and
            APAC. The engineers who design your architecture build it and
            answer at 3am.
          </p>

          <div className="mt-8 flex flex-wrap gap-8">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="size-6 shrink-0 text-brand" />
                <div>
                  <p className="font-heading text-2xl font-bold">
                    <Counter to={value} suffix={value >= 100 ? " +" : ""} />
                  </p>
                  <p className="text-sm text-surface-muted-foreground">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" className="rounded-full px-6">
              Meet the People Behind RNS
            </Button>
            <Button size="lg" variant="glass" className="rounded-full px-6">
              See Open Roles
            </Button>
          </div>
        </Reveal>

        <Parallax speed={20}>
          <PlaceholderGraphic
            icon={Users}
            tone="neutral"
            label="SOC floor"
            className="aspect-[4/3] w-full"
          />
        </Parallax>
      </div>
    </section>
  );
}

export { LifeAtRns };
