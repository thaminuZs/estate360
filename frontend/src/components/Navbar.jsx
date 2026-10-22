import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <a href="#" className="brand-logo" aria-label="Estate360 Home">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span>Estate<span style={{ color: 'var(--brown)' }}>360</span></span>
        </a>

        <div className="nav-links">
          <a href="#features" className="nav-link">Platform</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#simulator" className="nav-link">Live Telemetry</a>
          <a href="#spotlight" className="nav-link">Technology</a>
        </div>

        <div className="nav-actions">
          <a href="#spotlight" className="btn-outline" style={{ padding: '9px 20px', fontSize: '0.9rem' }}>
            Live Demo
          </a>
          <a href="#contact" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.9rem' }}>
            Get Started
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
