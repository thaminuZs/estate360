import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="section-wrapper">
        <div className="footer-top">
          {/* Col 1: Brand & Overview */}
          <div className="footer-brand">
            <div className="brand-logo">
              <div className="brand-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span>Estate<span style={{ color: 'var(--yellow)' }}>360</span></span>
            </div>
            <p className="footer-desc">
              Next-generation precision agriculture platform orchestrating GPS & IMU IoT hardware, 
              long-range radio telemetry, and centralized estate intelligence.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li><a href="#features" className="footer-link">Core Features</a></li>
              <li><a href="#how-it-works" className="footer-link">How It Works</a></li>
              <li><a href="#simulator" className="footer-link">Live Telemetry</a></li>
              <li><a href="#spotlight" className="footer-link">Hardware & GIS</a></li>
            </ul>
          </div>

          {/* Col 3: Resources & Docs */}
          <div>
            <h4 className="footer-col-title">Resources</h4>
            <ul className="footer-links">
              <li><a href="#spotlight" className="footer-link">IoT Specifications</a></li>
              <li><a href="#features" className="footer-link">GIS Documentation</a></li>
              <li><a href="#contact" className="footer-link">Deployment Guide</a></li>
              <li><a href="#contact" className="footer-link">API Integration</a></li>
            </ul>
          </div>

          {/* Col 4: Project & Technical Details */}
          <div>
            <h4 className="footer-col-title">Project Specifications</h4>
            <div className="footer-tech-stack">
              <div style={{ fontSize: '0.85rem', color: '#cad6ce', lineHeight: 1.5 }}>
                Engineered in collaboration with the <strong>University of Vavuniya</strong> research initiative for smart agronomy and field automation.
              </div>
              <div className="tech-tags">
                <span className="tech-tag">React 19</span>
                <span className="tech-tag">NestJS</span>
                <span className="tech-tag">PostgreSQL</span>
                <span className="tech-tag">MongoDB</span>
                <span className="tech-tag">ESP32</span>
                <span className="tech-tag">LoRa E32</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {new Date().getFullYear()} Estate360 Inc. Licensed under the MIT License.
          </div>

          <div className="footer-system-status">
            <span className="status-dot"></span>
            <span>All Telemetry Nodes & LoRa Gateways Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
