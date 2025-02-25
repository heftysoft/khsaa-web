import Hero from "@/components/about/hero";
import Stats from "@/components/about/stats";
import Established from "@/components/about/established";
import Achievement from "@/components/about/achievement";
import AboutSection from "@/components/about/about";
import Mission from "@/components/about/mission";
import Committee from "@/components/about/committee";
import AboutCTA from "@/components/about/cta";

export default async function AboutPage() {

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <Stats alumni={3000} awards={50} events={50} members={10000} />

      {/* ESTD Section */}
      <Established />

      {/* Achievement Section */}
      <Achievement />

      {/* About Content */}
      <AboutSection />

      {/* Mission Section */}
      <Mission />

      {/* Committee Section */}
      <Committee />

      {/* CTA Section */}
      <AboutCTA />
    </>
  );
}
