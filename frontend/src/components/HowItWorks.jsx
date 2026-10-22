import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function HowItWorks() {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.15 });

  const steps = [
    {
      step: "01",
      title: "Field Wearable Badge",
      description: "Workers carry lightweight, ruggedized badges equipped with NEO-M8N GPS receivers and MPU-6050 IMU sensors that measure motion acceleration.",
      illustration: (
        <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="var(--green-dark)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="3" />
          <circle cx="12" cy="14" r="3" />
          <line x1="12" y1="6" x2="12.01" y2="6" strokeWidth="2.5" />
          <path d="M12 11v-2" />
        </svg>
      )
    },
    {
      step: "02",
      title: "LoRa Wireless Broadcast",
      description: "Custom firmware serializes coordinates and activity states into robust encrypted packets, broadcasted across kilometres via LoRa E32 radio without internet.",
      illustration: (
        <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.93 4.93a10 10 0 0 1 14.14 0" />
          <path d="M7.76 7.76a6 6 0 0 1 8.48 0" />
          <circle cx="12" cy="12" r="2" fill="var(--yellow)" />
          <path d="M12 14v8" />
          <path d="M9 22h6" />
        </svg>
      )
    },
    {
      step: "03",
      title: "Live Dashboard & Analytics",
      description: "Base stations relay packets to the NestJS Core API and MongoDB Analytics pipeline, updating live GIS worker positions and automated timesheets instantly.",
      illustration: (
        <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="var(--green-dark)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <circle cx="12" cy="10" r="2" fill="var(--yellow)" />
        </svg>
      )
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works-section">
      {/* Gentle ambient particles — cream/green tones matching gradient */}
      <div className="particles-layer" aria-hidden="true">
        <span className="particle" style={{ width: '5px', height: '5px', background: 'var(--green-medium)', top: '15%', left: '8%', animationDuration: '18s', animationDelay: '0s', opacity: 0.35 }}></span>
        <span className="particle" style={{ width: '7px', height: '7px', background: 'var(--brown)', top: '70%', left: '90%', animationDuration: '22s', animationDelay: '3s', opacity: 0.25 }}></span>
        <span className="particle" style={{ width: '4px', height: '4px', background: 'var(--yellow)', top: '50%', left: '55%', animationDuration: '16s', animationDelay: '6s', opacity: 0.3 }}></span>
        <span className="particle-firefly" style={{ width: '4px', height: '4px', backgroundColor: 'var(--green-dark)', color: 'rgba(31, 61, 44, 0.3)', top: '30%', left: '75%', animationDuration: '5s', animationDelay: '1s' }}></span>
        <span className="particle-firefly" style={{ width: '3px', height: '3px', backgroundColor: 'var(--yellow)', color: 'rgba(241, 196, 15, 0.45)', top: '80%', left: '25%', animationDuration: '4.5s', animationDelay: '2.5s' }}></span>
        <span className="particle-firefly" style={{ width: '4px', height: '4px', backgroundColor: 'var(--brown)', color: 'rgba(139, 90, 43, 0.3)', top: '10%', left: '45%', animationDuration: '6s', animationDelay: '0.5s' }}></span>
      </div>

      <div ref={ref} className={`section-wrapper reveal-init ${isVisible ? 'reveal-visible' : ''}`}>
        <div className="section-badge">
          <span className="dot"></span>
          End-to-End Architecture
        </div>
        <h2 className="section-title">How Estate360 Operates in the Field</h2>
        <p className="section-subtitle">
          From micro-sensors in remote tea fields to centralized cloud analytics — reliable, autonomous telemetry every second.
        </p>

        <div className="pipeline-grid">
          {steps.map((st, i) => (
            <div key={i} className="step-card">
              <div className="step-badge-number">{st.step}</div>
              <div className="step-illustration">
                {st.illustration}
              </div>
              <h3 className="step-title">{st.title}</h3>
              <p className="step-description">{st.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
