import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Spotlight() {
  const [ref1, isVisible1] = useScrollReveal({ threshold: 0.15 });
  const [ref2, isVisible2] = useScrollReveal({ threshold: 0.15 });

  return (
    <section id="spotlight" className="spotlight-section">
      <div className="section-wrapper">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="section-badge">
            <span className="dot"></span>
            Hardware & Software Co-Design
          </div>
          <h2 className="section-title">Engineered for Harsh Agronomic Terrains</h2>
          <p className="section-subtitle">
            A harmonious integration of custom embedded hardware and resilient cloud microservices.
          </p>
        </div>

        {/* Row 1: Software GIS Map */}
        <div 
          ref={ref1} 
          className={`spotlight-row reveal-init ${isVisible1 ? 'reveal-visible' : ''}`}
        >
          <div className="spotlight-image-container">
            <img 
              src="/dashboard-preview.jpg" 
              alt="Estate360 Live GIS Topographic Map & Worker Analytics" 
              loading="lazy"
            />
          </div>

          <div className="spotlight-content">
            <span className="spotlight-pill">Software Architecture</span>
            <h3 className="spotlight-title">Precision GIS Topography & Automated Harvest Rostering</h3>
            <p className="spotlight-text">
              View your entire estate from a unified tactical map. Track real-time coordinates, 
              delineate parcel boundaries for different crops, and automatically compute workforce 
              yield efficiency based on geofenced coverage.
            </p>

            <div className="spotlight-checklist">
              <div className="checklist-item">
                <div className="checklist-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>Sub-meter polygon demarcation for tea, coconut, and rubber plots</span>
              </div>

              <div className="checklist-item">
                <div className="checklist-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>High-throughput MongoDB coordinate streaming and historic route replay</span>
              </div>

              <div className="checklist-item">
                <div className="checklist-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>Automated payment slips and task assignment reconciliation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: IoT Hardware Device */}
        <div 
          ref={ref2} 
          className={`spotlight-row reverse reveal-init ${isVisible2 ? 'reveal-visible' : ''}`}
        >
          <div className="spotlight-image-container">
            <img 
              src="/iot-device.jpg" 
              alt="Rugged Field Worker IoT Tracker Badge" 
              loading="lazy"
            />
          </div>

          <div className="spotlight-content">
            <span className="spotlight-pill">Embedded Hardware</span>
            <h3 className="spotlight-title">Ruggedized Field IoT Tracker with Kinetic Activity Recognition</h3>
            <p className="spotlight-text">
              Engineered for dense foliage and humid equatorial weather where standard cellular signals 
              are unavailable. The device autonomously logs spatial coordinates and evaluates worker exertion levels.
            </p>

            <div className="spotlight-checklist">
              <div className="checklist-item">
                <div className="checklist-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>NEO-M8N multi-constellation GPS with fast satellite lock under canopy</span>
              </div>

              <div className="checklist-item">
                <div className="checklist-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>MPU-6050 6-axis IMU classifies resting vs active harvesting movement</span>
              </div>

              <div className="checklist-item">
                <div className="checklist-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>LoRa E32 long-range RF telemetry transmitting over 5+ kilometers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
