import { Search, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "cn";

const NAV_LINKS = [
  { label: "Discover RNS", href: "#discover" },
  { label: "Solution", href: "#solution" },
  { label: "Services", href: "#services" },
  { label: "Approach", href: "#approach" },
  { label: "Why RNS", href: "#why-rns" },
  { label: "Media Center", href: "#media-center" },
];

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-foreground/10 bg-surface">
      <Reveal
        onMount
        y={-12}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-6 px-6 lg:px-12"
      >
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "group/nav relative pb-2 text-sm font-medium transition-colors",
                i === 0
                  ? "text-surface-foreground"
                  : "text-surface-muted-foreground hover:text-surface-foreground"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 origin-left bg-brand transition-transform duration-300 ease-out",
                  i === 0 ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100"
                )}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Search"
            className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-surface-foreground/15 text-surface-foreground transition-colors hover:bg-surface-foreground/10 sm:flex"
          >
            <Search className="size-4" />
          </button>
          <Button size="lg" variant="glass" className="rounded-full">
            <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
            Book a Security Consultation
          </Button>
        </div>
      </Reveal>
    </header>
  );
}

export { Navbar };
