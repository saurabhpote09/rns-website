import {
  Award,
  Globe2,
  Handshake,
  Layers,
  Settings2,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { SectionTag } from "@/components/ui/section-tag";
import { PlaceholderGraphic } from "@/components/ui/placeholder-graphic";
import { Counter } from "@/components/motion/counter";
import { SplitHeadline } from "@/components/motion/split-headline";

const REASONS = [
  {
    icon: Layers,
    title: "Architecture before product.",
    body: "We define the target state against your risk, your regulator and your operating model then select platforms. If your existing stack is fine and needs tuning, we say so.",
  },
  {
    icon: Globe2,
    title: "In the region, for the region",
    body: "Delivery across the UAE, Qatar and Saudi Arabia with APAC scale behind it. We know what NESA, PDPL, SAMA and NCA expect because we sit in those audit rooms.",
  },
  {
    icon: Wrench,
    title: "Operators, not advisers.",
    body: "200+ certified engineers who implement what they design and then run it. No handover cliff between the deck and the deployment.",
  },
];

const STATS = [
  { icon: ShieldCheck, value: 500, label: "Organizations secured." },
  { icon: Handshake, value: 2400, label: "Projects delivered" },
  { icon: Award, value: 200, label: "Certified experts" },
  { icon: Settings2, value: 725, label: "Combined years of expertise" },
];

function WhyRns() {
  return (
    <section id="why-rns" className="bg-surface py-24 text-surface-foreground">
      <div className="mx-auto max-w-[1440px] px-6 text-center lg:px-12">
        <SectionTag className="text-surface-muted-foreground">
          Why RNS
        </SectionTag>
        <SplitHeadline className="mx-auto mt-6 max-w-2xl font-heading text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
          Why Middle East Enterprises Call Us First.
        </SplitHeadline>
        <p className="mt-4 text-surface-muted-foreground">
          Three reasons, and none of them are the product catalogue:
        </p>

        <div className="mt-14 grid gap-6 text-left md:grid-cols-3">
          {REASONS.map((reason) => (
            <div
              key={reason.title}
              className="overflow-hidden rounded-2xl bg-panel-maroon transition-transform duration-300 hover:-translate-y-1.5"
            >
              <PlaceholderGraphic
                icon={reason.icon}
                tone="red"
                className="aspect-[4/3] w-full rounded-none border-none"
              />
              <div className="p-6">
                <h3 className="font-heading text-lg font-semibold">
                  {reason.title}
                </h3>
                <p className="mt-3 text-sm text-surface-muted-foreground">
                  {reason.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-10 rounded-2xl bg-panel-indigo px-8 py-10">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3 text-left">
              <Icon className="size-6 shrink-0 text-brand" />
              <div>
                <p className="font-heading text-2xl font-bold text-brand">
                  <Counter to={value} suffix=" +" />
                </p>
                <p className="text-sm text-surface-muted-foreground">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { WhyRns };
