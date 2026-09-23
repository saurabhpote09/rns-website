import * as React from "react";
import { cn } from "cn";

function SectionTag({ className, children, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="section-tag"
      className={cn(
        "relative inline-block px-4 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase",
        className
      )}
      {...props}
    >
      <span className="absolute top-0 left-0 h-2 w-2 border-t border-l border-current" />
      <span className="absolute top-0 right-0 h-2 w-2 border-t border-r border-current" />
      <span className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-current" />
      <span className="absolute right-0 bottom-0 h-2 w-2 border-r border-b border-current" />
      {children}
    </span>
  );
}

export { SectionTag };
