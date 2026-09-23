import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { PartnerLogos } from "@/components/sections/partner-logos";
import { StatsBanner } from "@/components/sections/stats-banner";
import { MarketReality } from "@/components/sections/market-reality";
import { FiveDomains } from "@/components/sections/five-domains";
import { OurServices } from "@/components/sections/our-services";
import { OurApproach } from "@/components/sections/our-approach";
import { WhyRns } from "@/components/sections/why-rns";
import { Testimonials } from "@/components/sections/testimonials";
import { LifeAtRns } from "@/components/sections/life-at-rns";
import { Recognition } from "@/components/sections/recognition";
import { MediaCenter } from "@/components/sections/media-center";
import { FinalCta } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <PartnerLogos />
        <StatsBanner />
        <MarketReality />
        <FiveDomains />
        <OurServices />
        <OurApproach />
        <WhyRns />
        <Testimonials />
        <LifeAtRns />
        <Recognition />
        <MediaCenter />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
