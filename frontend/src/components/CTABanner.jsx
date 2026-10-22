import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function CTABanner() {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.2 });

  return (
    <section id="contact" className="cta-section">
      <div className="section-wrapper">
        <div ref={ref} className={`cta-box reveal-init ${isVisible ? 'reveal-visible' : ''}`}>
          <div className="section-badge" style={{ backgroundColor: 'rgba(215, 230, 221, 0.15)', color: 'var(--yellow)', borderColor: 'rgba(241, 196, 15, 0.3)' }}>
            <span className="dot"></span>
            Enterprise Deployment
          </div>

          <h2 className="cta-title">
            Ready to Bring Total Visibility to Your Plantation?
          </h2>

          <p className="cta-subtitle">
            Deploy self-contained IoT base stations and worker badges in hours. 
            No cell towers, no complex configurations, complete autonomous control.
          </p>

          <div className="cta-actions">
            <a href="#features" className="btn-yellow">
              Get Started with Estate360
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#spotlight" className="btn-outline" style={{ borderColor: 'var(--green-light)', color: 'var(--white)' }}>
              Download Technical Whitepaper
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
