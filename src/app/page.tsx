import { Navbar } from "@/components/web/Navbar";
import { Hero } from "@/components/web/Hero";
import { Services } from "@/components/web/Services";
import { About } from "@/components/web/About";
import { Team } from "@/components/web/Team";
import { Portfolio } from "@/components/web/Portfolio";
import { Process } from "@/components/web/Process";
import { Testimonials } from "@/components/web/Testimonials";
import { FAQ } from "@/components/web/FAQ";
import { Contact } from "@/components/web/Contact";
import { Footer } from "@/components/web/Footer";

import { SceneBackground } from "@/components/web/SceneBackground";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden relative">
      {/* Global 3D animated canvas background — sits behind everything */}
      <SceneBackground />

      {/* Client-facing Header/Navbar */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-grow relative z-10">
        <Hero />
        <Services />
        <About />
        <Team />
        <Portfolio />
        <Process />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
