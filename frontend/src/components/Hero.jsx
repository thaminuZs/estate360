import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Hero() {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <section className="hero-section">
      {/* Gentle Floating Agritech Particles */}
      <div className="particles-layer" aria-hidden="true">
        <span className="particle" style={{ width: '6px', height: '6px', background: 'var(--green-medium)', top: '22%', left: '12%', animationDuration: '14s', animationDelay: '0s' }}></span>
        <span className="particle" style={{ width: '8px', height: '8px', background: 'var(--yellow)', top: '65%', left: '24%', animationDuration: '18s', animationDelay: '2s', opacity: 0.4 }}></span>
        <span className="particle" style={{ width: '5px', height: '5px', background: 'var(--brown)', top: '35%', left: '48%', animationDuration: '16s', animationDelay: '4s' }}></span>
        <span className="particle" style={{ width: '7px', height: '7px', background: 'var(--green-medium)', top: '78%', left: '80%', animationDuration: '20s', animationDelay: '1s' }}></span>
        <span className="particle" style={{ width: '4px', height: '4px', background: 'var(--yellow)', top: '18%', left: '72%', animationDuration: '13s', animationDelay: '5s' }}></span>
        <span className="particle-firefly" style={{ width: '5px', height: '5px', backgroundColor: 'var(--yellow)', color: 'rgba(241, 196, 15, 0.6)', top: '42%', left: '6%', animationDuration: '4s' }}></span>
        <span className="particle-firefly" style={{ width: '4px', height: '4px', backgroundColor: 'var(--green-medium)', color: 'rgba(44, 84, 61, 0.4)', top: '82%', left: '40%', animationDuration: '5.5s', animationDelay: '1.5s' }}></span>
      </div>

      <div className="section-wrapper" style={{ width: '100%', position: 'relative', zIndex: 2 }}>
        <div ref={ref} className={`hero-grid reveal-init ${isVisible ? 'reveal-visible' : ''}`}>
          <div className="hero-content">

            <h1 className="hero-headline delay-1">
              Manage Every Acre. <br />
              <span className="highlight">Track Every Worker</span> in Real-Time.
            </h1>

            <p className="hero-description delay-2">
              Estate360 synchronizes GPS-enabled IoT badges, long-range LoRa communication,
              and enterprise estate analytics — giving estate managers complete operational visibility
              across vast agricultural plantations.
            </p>

            <div className="hero-cta-group delay-3">
              <a href="#features" className="btn-yellow">
                Explore Platform
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="#spotlight" className="btn-outline">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                </svg>
                View System Specs
              </a>
            </div>

            <div className="hero-trust-bar delay-4">
              <div className="trust-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Zero Cellular Dependency</span>
              </div>
              <div className="trust-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Sub-Meter GPS Accuracy</span>
              </div>
              <div className="trust-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span>Ultra-Low Power LoRa</span>
              </div>
            </div>
          </div>

          <div className="hero-visual delay-2">
            <div className="hero-visual-card">
              {/* Floating Top Badge */}
              <div className="floating-badge floating-badge-top">
                <div className="badge-pulse-icon">
                  <span className="pulse-indicator"></span>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>LIVE STATUS</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--green-dark)' }}>48 Harvesters Online</div>
                </div>
              </div>

              {/* Main Image Screen */}
              <div className="hero-image-wrapper">
                <img
                  src="/dashboard-preview.jpg"
                  alt="Estate360 Live GIS Plantation Map & Worker Tracker"
                  loading="eager"
                />
              </div>

              {/* Floating Bottom Badge */}
              <div className="floating-badge floating-badge-bottom">
                <div className="badge-pulse-icon" style={{ background: 'var(--yellow)', color: 'var(--green-dark)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>LORA BASE STATION</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--green-dark)' }}>100% Transmission Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
