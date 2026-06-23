import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import StatBar from "@/components/StatBar";
import Manifest from "@/components/Manifest";
import HowItWorks from "@/components/HowItWorks";
import Personas from "@/components/Personas";
import Charter from "@/components/Charter";
import DiplomaProjects from "@/components/DiplomaProjects";
import Residents from "@/components/Residents";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import BottomCTA from "@/components/BottomCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="landing">
      <SiteHeader />
      <Hero />
      <StatBar />
      <Manifest />
      <HowItWorks />
      <Personas />
      <Charter />
      <DiplomaProjects />
      <Residents />
      <Pricing />
      <FAQ />
      <BottomCTA />
      <Footer />
    </main>
  );
}
