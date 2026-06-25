import { Navbar } from "@/components/web/Navbar";
import { Hero } from "@/components/web/Hero";
import { Services } from "@/components/web/Services";
import { About } from "@/components/web/About";
import { Team } from "@/components/web/Team";
import { Portfolio } from "@/components/web/Portfolio";
import { Process } from "@/components/web/Process";
import { Pricing } from "@/components/web/Pricing";
import { Testimonials } from "@/components/web/Testimonials";
import { FAQ } from "@/components/web/FAQ";
import { Contact } from "@/components/web/Contact";
import { Footer } from "@/components/web/Footer";
import { WaveDivider } from "@/components/web/SVGAnimations";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Client-facing Header/Navbar */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-grow">
        <Hero />
        <WaveDivider />
        <Services />
        <About />
        <WaveDivider flip />
        <Team />
        <Portfolio />
        <WaveDivider />
        <Process />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
