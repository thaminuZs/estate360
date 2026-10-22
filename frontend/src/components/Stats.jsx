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
