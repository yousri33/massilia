import { Header } from "@/components/ui/header-2";
import { ParallaxFlow } from "@/components/ParallaxFlow";
import { HowItWorks } from "@/components/HowItWorks";
import { PacksSection } from "@/components/PacksSection";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <ParallaxFlow />
      <HowItWorks />
      <PacksSection />
      <Testimonials />
      <Footer />
    </main>
  );
}
