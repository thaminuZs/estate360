import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function CTABanner() {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.2 });

  return (
    <section id="contact" className="cta-section">
      {/* Luminous Firefly Accents */}
      <div className="particles-layer" aria-hidden="true">
        <span className="particle-firefly" style={{ width: '6px', height: '6px', backgroundColor: 'var(--yellow)', color: 'rgba(241, 196, 15, 0.7)', top: '25%', left: '15%', animationDuration: '3.5s' }}></span>
        <span className="particle-firefly" style={{ width: '4px', height: '4px', backgroundColor: '#7de89f', color: 'rgba(125, 232, 159, 0.8)', top: '65%', left: '85%', animationDuration: '4.8s', animationDelay: '1s' }}></span>
        <span className="particle-firefly" style={{ width: '5px', height: '5px', backgroundColor: 'var(--yellow)', color: 'rgba(241, 196, 15, 0.6)', top: '75%', left: '20%', animationDuration: '4.2s', animationDelay: '2s' }}></span>
        <span className="particle-firefly" style={{ width: '4px', height: '4px', backgroundColor: '#7de89f', color: 'rgba(125, 232, 159, 0.8)', top: '30%', left: '80%', animationDuration: '5s', animationDelay: '0.5s' }}></span>
        <span className="particle" style={{ width: '5px', height: '5px', background: 'rgba(241, 196, 15, 0.5)', top: '80%', left: '50%', animationDuration: '15s', animationDelay: '3s' }}></span>
      </div>

      <div className="section-wrapper" style={{ position: 'relative', zIndex: 2 }}>
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
