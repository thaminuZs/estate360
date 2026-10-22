import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Features() {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.15 });

  const features = [
    {
      title: "Real-Time Worker Telemetry",
      description: "Continuously tracks GPS coordinates, elevation, and 3-axis accelerometer movement to categorize active harvesting vs resting periods.",
      tags: ["NEO-M8N GPS", "MPU-6050 IMU", "10-Min Telemetry Cycle"],
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    },
    {
      title: "Crop & Estate Operations",
      description: "Orchestrate multi-zone agricultural parcels, employee shift rosters, crop cycles, and payroll disbursements through a unified command portal.",
      tags: ["PostgreSQL", "TypeORM Relational", "Multi-Zone Demarcation"],
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      )
    },
    {
      title: "High-Frequency GIS Analytics",
      description: "Dedicated MongoDB time-series streaming for sub-second coordinate ingestion, harvest heatmaps, path visualization, and zone coverage tracking.",
      tags: ["MongoDB Coordinates", "Coverage Heatmaps", "Route Playback"],
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    }
  ];

  return (
    <section id="features" className="features-section">
      <div ref={ref} className={`section-wrapper reveal-init ${isVisible ? 'reveal-visible' : ''}`}>
        <div className="section-badge">
          <span className="dot"></span>
          Platform Capabilities
        </div>
        <h2 className="section-title">Built for Modern Agricultural Scale</h2>
        <p className="section-subtitle">
          Designed specifically for challenging outdoor terrains where cellular coverage fails, 
          Estate360 ensures non-stop tracking and automated estate governance.
        </p>

        <div className="features-grid">
          {features.map((feat, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon-wrapper">
                {feat.icon}
              </div>
              <h3 className="feature-title">{feat.title}</h3>
              <p className="feature-desc">{feat.description}</p>
              <div className="feature-tags">
                {feat.tags.map((t, i) => (
                  <span key={i} className="feature-tag">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
