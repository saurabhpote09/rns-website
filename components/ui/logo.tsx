import { cn } from "cn";

function Logo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/assets/RNS_logo.svg`}
      alt="RNS Technology Services"
      className={cn("h-10 w-auto object-contain", className)}
    />
  );
}

export { Logo };
