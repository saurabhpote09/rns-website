import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "cn";

const toneClasses = {
  red: "border-brand/20 bg-gradient-to-br from-brand/25 via-brand/5 to-transparent text-brand",
  green:
    "border-accent-green/20 bg-gradient-to-br from-accent-green/25 via-accent-green/5 to-transparent text-accent-green",
  purple:
    "border-panel-purple bg-gradient-to-br from-panel-purple via-panel-purple/60 to-transparent text-surface-foreground",
  neutral:
    "border-surface-foreground/10 bg-gradient-to-br from-surface-foreground/10 via-surface-foreground/5 to-transparent text-surface-foreground",
  light: "border-border bg-muted text-muted-foreground",
} as const;

function PlaceholderGraphic({
  icon: Icon,
  label,
  tone = "neutral",
  className,
}: {
  icon: LucideIcon;
  label?: string;
  tone?: keyof typeof toneClasses;
  className?: string;
}) {
  return (
    <div
      data-slot="placeholder-graphic"
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl border",
        toneClasses[tone],
        className
      )}
    >
      <Icon className="size-10 opacity-70" strokeWidth={1.25} />
      {label ? (
        <span className="absolute bottom-3 left-3 text-[10px] font-medium tracking-wider uppercase opacity-60">
          {label}
        </span>
      ) : null}
    </div>
  );
}

export { PlaceholderGraphic };
