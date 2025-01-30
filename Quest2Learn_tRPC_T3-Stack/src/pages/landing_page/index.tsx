import Header from "@/src/components/landing_page/components/Header";
import PrimaryFeatures from "@/src/components/landing_page/components/PrimaryFeatures";
import Hero from "@/src/components/landing_page/components/Hero";
import Testimonials from "@/src/components/landing_page/components/Testimonials";
import Footer from "@/src/components/landing_page/components/Footer";

export default function LandingPage() {
  return (
  <>
    <Header /> 
    <Hero />
    <PrimaryFeatures />
    <Testimonials />
    <Footer />
  </>
  );
}