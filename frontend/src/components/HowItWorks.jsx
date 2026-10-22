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
      <div className="section-wrapper">
        <div className="section-badge">
          <span className="dot"></span>
          End-to-End Architecture
        </div>
        <h2 className="section-title">How Estate360 Operates in the Field</h2>
        <p className="section-subtitle">
          From micro-sensors in remote tea fields to centralized cloud analytics — reliable, autonomous telemetry every second.
        </p>

        <div ref={ref} className={`pipeline-grid reveal-init ${isVisible ? 'reveal-visible' : ''}`}>
          {steps.map((st, i) => (
            <div key={i} className={`step-card delay-${i + 1}`}>
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
