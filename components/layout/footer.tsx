import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "cn";

const SOLUTION_LINKS = [
  { label: "Identity Protection", active: false },
  { label: "Endpoint Protection", active: true },
  { label: "Cloud & Network Protection", active: false },
  { label: "Application Protection", active: false },
  { label: "Data Protection", active: false },
];

const SERVICE_LINKS = [
  "IntelliShield™ (MDR)",
  "IntelliStrike™ (Offensive)",
  "IntelliAssure™ (GRC)",
  "IntelliDeploy™ (Talent)",
];

const DISCOVER_LINKS = ["Leadership", "People (Life at RNS)", "Corporate Responsibility"];

const SOCIAL_ICONS = [
  { label: "f", active: true },
  { label: "X", active: false },
  { label: "ig", active: false },
  { label: "in", active: false },
];

const BOTTOM_LINKS = ["FAQ's", "Career", "Contact", "Privacy Policy"];

function Footer() {
  return (
    <footer className="bg-surface text-surface-foreground">
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-xs text-sm text-surface-muted-foreground">
              AI-driven Zero Trust security architecture, designed,
              implemented and operated across the UAE, Saudi Arabia, Qatar
              and APAC.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-base font-semibold">
              Our Solution
            </h3>
            <ul className="mt-4 space-y-3">
              {SOLUTION_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href="#solution"
                    className={cn(
                      "text-sm transition-colors",
                      link.active
                        ? "text-brand underline underline-offset-4"
                        : "text-surface-muted-foreground hover:text-surface-foreground"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-base font-semibold">
              Our Services
            </h3>
            <ul className="mt-4 space-y-3">
              {SERVICE_LINKS.map((label) => (
                <li key={label}>
                  <a
                    href="#services"
                    className="text-sm text-surface-muted-foreground transition-colors hover:text-surface-foreground"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 font-heading text-base font-semibold">
              Discover RNS
            </h3>
            <ul className="mt-4 space-y-3">
              {DISCOVER_LINKS.map((label) => (
                <li key={label}>
                  <a
                    href="#discover"
                    className="text-sm text-surface-muted-foreground transition-colors hover:text-surface-foreground"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-base font-semibold">
              Contact Us
            </h3>
            <div className="mt-4 space-y-3 text-sm text-surface-muted-foreground">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                Unit No.806, Mazaya Business Avenue BB1, Jumeirah Lake Towers
                (JLT), Dubai, UAE
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                sales@rnstechnology.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />+ 97143998287
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_ICONS.map(({ label, active }, i) => (
                <span
                  key={i}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full text-xs font-semibold",
                    active
                      ? "bg-brand text-brand-foreground"
                      : "bg-surface-foreground/10 text-surface-foreground"
                  )}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-surface-foreground/10 bg-panel">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 py-6 text-sm text-surface-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-12">
          <p>&copy; 2026 RNS Technology. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            {BOTTOM_LINKS.map((label) => (
              <a
                key={label}
                href="#"
                className="transition-colors hover:text-surface-foreground"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
