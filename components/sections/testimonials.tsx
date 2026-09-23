import { Shapes } from "lucide-react";
import { SectionTag } from "@/components/ui/section-tag";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "cn";

const QUOTE =
  "“ Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley. ”";

const TESTIMONIALS = [
  { featured: false },
  { featured: true },
  { featured: false },
];

function Testimonials() {
  return (
    <section className="bg-surface py-24 text-surface-foreground">
      <div className="mx-auto max-w-[1440px] px-6 text-center lg:px-12">
        <Reveal>
          <SectionTag className="text-surface-muted-foreground">
            Testimonials
          </SectionTag>
          <h2 className="mx-auto mt-6 max-w-2xl font-heading text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
            The Work Speaks. So Do the People Who Bought It.
          </h2>
        </Reveal>

        <div className="mt-14 grid items-center gap-6 text-left md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1.5",
                t.featured ? "bg-panel-purple" : "bg-panel-maroon"
              )}
            >
              <div className="p-6">
                <p className={cn(t.featured ? "text-base" : "text-sm", "text-surface-foreground/90")}>
                  {QUOTE}
                </p>
                <p className="mt-4 text-xs font-semibold tracking-wide text-surface-muted-foreground uppercase">
                  Banking · UAE
                </p>
              </div>
              <div className="mt-auto flex items-center justify-between gap-4 border-t border-surface-foreground/10 bg-surface-foreground/5 px-6 py-4">
                {t.featured ? (
                  <span className="flex items-center gap-2 text-sm font-bold">
                    <Shapes className="size-5" />
                    LOGO
                  </span>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold">Amit Patel</p>
                    <p className="text-xs text-surface-muted-foreground">
                      IT Professional, Bangalore
                    </p>
                  </div>
                  <Avatar>
                    <AvatarFallback>AP</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Testimonials };
