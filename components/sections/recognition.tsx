import { BadgeCheck } from "lucide-react";
import { SectionTag } from "@/components/ui/section-tag";
import { Reveal } from "@/components/motion/reveal";

const BADGES = Array.from({ length: 9 }, (_, i) => i);

function Recognition() {
  return (
    <section className="bg-surface py-24 text-surface-foreground">
      <div className="mx-auto max-w-[1440px] px-6 text-center lg:px-12">
        <Reveal>
          <SectionTag className="text-surface-muted-foreground">
            Recognition
          </SectionTag>
          <h2 className="mx-auto mt-6 max-w-2xl font-heading text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
            Independently Verified. Not Self-Declared.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-3 gap-4 sm:grid-cols-5">
          {BADGES.map((i) => (
            <div
              key={i}
              className="flex h-28 flex-col items-center justify-center gap-2 rounded-xl bg-background text-muted-foreground transition-transform duration-300 hover:-translate-y-1.5"
            >
              <BadgeCheck className="size-6" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                ISO
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Recognition };
