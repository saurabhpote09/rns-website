import { ArrowUpRight, Lock } from "lucide-react";
import { SectionTag } from "@/components/ui/section-tag";
import { PlaceholderGraphic } from "@/components/ui/placeholder-graphic";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "cn";

const ARTICLES = [
  { number: "03", badge: "Insights", tone: "red" as const },
  { number: "02", badge: "Podcast", tone: "green" as const },
  { number: "02", badge: "Event", tone: "purple" as const },
];

function MediaCenter() {
  return (
    <section id="media-center" className="bg-background py-24">
      <div className="mx-auto max-w-[1440px] px-6 text-center lg:px-12">
        <Reveal>
          <SectionTag className="text-muted-foreground">
            Media Center
          </SectionTag>
          <h2 className="mx-auto mt-6 max-w-2xl font-heading text-3xl leading-tight font-bold text-foreground sm:text-4xl lg:text-5xl">
            Perspectives Worth Fifteen Minutes.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 text-left md:grid-cols-3">
          {ARTICLES.map((article, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-surface transition-transform duration-300 hover:-translate-y-1.5"
            >
              <PlaceholderGraphic
                icon={Lock}
                tone={article.tone}
                className="aspect-[3/4] w-full rounded-2xl border-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/10 to-transparent" />
              <div
                className={cn(
                  "absolute inset-0 flex flex-col justify-between p-5 text-surface-foreground"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {article.number}
                  </span>
                  <Badge className="bg-brand text-brand-foreground">
                    {article.badge}
                  </Badge>
                </div>
                <div>
                  <p className="font-heading text-lg font-semibold">
                    What is Lorem Ipsum?.
                  </p>
                  <ArrowUpRight className="mt-2 size-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { MediaCenter };
