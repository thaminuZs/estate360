import { Hero } from '../../components/landing/Hero';
import { Features } from '../../components/landing/Features';
import { HowItWorks } from '../../components/landing/HowItWorks';
import { Footer } from '../../components/landing/Footer';

export function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </>
  );
}
