import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import TelemetrySimulator from '../components/TelemetrySimulator';
import Spotlight from '../components/Spotlight';
import CTABanner from '../components/CTABanner';
import Footer from '../components/Footer';
import '../styles/landing.css';

export default function LandingPage() {
  return (
    <div className="landing-container">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <TelemetrySimulator />
        <Spotlight />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
