import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCountUp } from '../hooks/useCountUp';

export default function Stats() {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.2 });

  const hectares = useCountUp(580, 1800, isVisible);
  const badges = useCountUp(2450, 2000, isVisible);
  const deliveryRate = useCountUp(99, 1500, isVisible);
  const coordinates = useCountUp(12, 1600, isVisible);

  return (
    <section id="stats" className="stats-section">
      {/* Glowing firefly particles on dark green background */}
      <div className="particles-layer" aria-hidden="true">
        <span className="particle-firefly" style={{ width: '5px', height: '5px', backgroundColor: 'var(--yellow)', color: 'rgba(241, 196, 15, 0.8)', top: '20%', left: '10%', animationDuration: '3.8s' }}></span>
        <span className="particle-firefly" style={{ width: '4px', height: '4px', backgroundColor: '#7de89f', color: 'rgba(125, 232, 159, 0.7)', top: '60%', left: '35%', animationDuration: '5.2s', animationDelay: '1.2s' }}></span>
        <span className="particle-firefly" style={{ width: '6px', height: '6px', backgroundColor: 'var(--yellow)', color: 'rgba(241, 196, 15, 0.6)', top: '35%', left: '70%', animationDuration: '4.5s', animationDelay: '0.8s' }}></span>
        <span className="particle-firefly" style={{ width: '3px', height: '3px', backgroundColor: '#7de89f', color: 'rgba(125, 232, 159, 0.9)', top: '75%', left: '85%', animationDuration: '3.2s', animationDelay: '2s' }}></span>
        <span className="particle-firefly" style={{ width: '4px', height: '4px', backgroundColor: 'var(--yellow)', color: 'rgba(241, 196, 15, 0.55)', top: '50%', left: '52%', animationDuration: '6s', animationDelay: '3s' }}></span>
      </div>

      <div className="section-wrapper">
        <div ref={ref} className={`stats-grid reveal-init ${isVisible ? 'reveal-visible' : ''}`}>
          <div className="stat-item">
            <div className="stat-number">{hectares.toLocaleString()}+</div>
            <div className="stat-label">Hectares Monitored</div>
          </div>

          <div className="stat-item">
            <div className="stat-number">{badges.toLocaleString()}+</div>
            <div className="stat-label">Active Worker Devices</div>
          </div>

          <div className="stat-item">
            <div className="stat-number">{deliveryRate}.8%</div>
            <div className="stat-label">LoRa Packet Reliability</div>
          </div>

          <div className="stat-item">
            <div className="stat-number">{coordinates}M+</div>
            <div className="stat-label">Coordinates Processed / Mo</div>
          </div>
        </div>
      </div>
    </section>
  );
}
