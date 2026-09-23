import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { MotionProvider } from "@/components/motion/motion-provider";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "RNS Technology Services | AI That Detects. Zero Trust That Defends.",
  description:
    "RNS designs, builds and operates AI-driven Zero Trust security architectures for the Middle East's most critical enterprises and government entities.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Safety net: entrance animations render opacity:0/transformed until
            client JS hydrates and runs them. If JS fails to load, this keeps
            all content visible and correctly positioned instead of stuck hidden. */}
        <noscript>
          <style>{`[style*="opacity"],[style*="transform"]{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
        <MotionProvider>
          <ScrollProgress />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
