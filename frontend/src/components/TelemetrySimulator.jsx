import React, { useState, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function TelemetrySimulator() {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.15 });
  const [activeEstate, setActiveEstate] = useState('tea');
  const [isPinging, setIsPinging] = useState(false);
  const [packetCount, setPacketCount] = useState(14820);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');

  const estateData = {
    tea: {
      name: "Highland Tea Estate",
      location: "Nuwara Eliya • Sector 4",
      terrain: "Steep Mountainous (1,800m ASL)",
      area: "340 Hectares",
      workersTotal: 56,
      workersActive: 49,
      workersResting: 7,
      rssi: "-82 dBm",
      snr: "+9.2 dB",
      soilMoisture: "58%",
      temperature: "19°C",
      humidity: "82%",
      harvestRate: "42 kg/hr",
      workers: [
        { id: "ESP-W-01", name: "Kamal Perera", task: "Tea Plucking", lat: "6.9497° N", lng: "80.7891° E", status: "ACTIVE", battery: "94%" },
        { id: "ESP-W-02", name: "Meena Devi", task: "Tea Plucking", lat: "6.9512° N", lng: "80.7904° E", status: "ACTIVE", battery: "88%" },
        { id: "ESP-W-03", name: "Suresh Kumar", task: "Leaf Weighing", lat: "6.9481° N", lng: "80.7876° E", status: "LOW_MOVEMENT", battery: "91%" },
        { id: "ESP-W-04", name: "Anoma Silva", task: "Break / Rest", lat: "6.9470° N", lng: "80.7865° E", status: "RESTING", battery: "85%" }
      ]
    },
    coconut: {
      name: "Coastal Coconut Grove",
      location: "Kurunegala • Zone B",
      terrain: "Flat Sandy Loam (45m ASL)",
      area: "520 Hectares",
      workersTotal: 38,
      workersActive: 34,
      workersResting: 4,
      rssi: "-74 dBm",
      snr: "+11.8 dB",
      soilMoisture: "41%",
      temperature: "31°C",
      humidity: "68%",
      harvestRate: "185 nuts/hr",
      workers: [
        { id: "ESP-W-11", name: "Bandara Jayasundara", task: "Nut Gathering", lat: "7.4863° N", lng: "80.3623° E", status: "ACTIVE", battery: "96%" },
        { id: "ESP-W-12", name: "Nimal Premadasa", task: "Tree Climbing", lat: "7.4878° N", lng: "80.3640° E", status: "ACTIVE", battery: "79%" },
        { id: "ESP-W-13", name: "Sunil Wickrama", task: "Husking & Stacking", lat: "7.4851° N", lng: "80.3610° E", status: "ACTIVE", battery: "92%" },
        { id: "ESP-W-14", name: "K. Selvam", task: "Depot Check-in", lat: "7.4842° N", lng: "80.3598° E", status: "RESTING", battery: "89%" }
      ]
    },
    rubber: {
      name: "Valley Rubber Plantation",
      location: "Kegalle • Block 1",
      terrain: "Rolling Hills & Dense Canopy (120m ASL)",
      area: "280 Hectares",
      workersTotal: 42,
      workersActive: 38,
      workersResting: 4,
      rssi: "-88 dBm",
      snr: "+7.4 dB",
      soilMoisture: "65%",
      temperature: "27°C",
      humidity: "88%",
      harvestRate: "62 L/hr Latex",
      workers: [
        { id: "ESP-W-21", name: "Ranjith Kumara", task: "Latex Tapping", lat: "7.2514° N", lng: "80.3464° E", status: "ACTIVE", battery: "87%" },
        { id: "ESP-W-22", name: "Priyantha Jayatissa", task: "Collection Rounds", lat: "7.2530° N", lng: "80.3482° E", status: "ACTIVE", battery: "95%" },
        { id: "ESP-W-23", name: "M. Farook", task: "Bark Treatment", lat: "7.2501° N", lng: "80.3449° E", status: "LOW_MOVEMENT", battery: "82%" },
        { id: "ESP-W-24", name: "Dinesh Rodrigo", task: "Coagulation Shed", lat: "7.2492° N", lng: "80.3435° E", status: "RESTING", battery: "90%" }
      ]
    }
  };

  const current = estateData[activeEstate];

  const handlePing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setPacketCount(prev => prev + current.workersActive);
      setLastSyncTime('Just now');
      setIsPinging(false);
    }, 900);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setPacketCount(prev => prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="simulator" className="simulator-section" style={{ padding: '95px 0', background: 'linear-gradient(180deg, #E6EFE9 0%, var(--green-light) 100%)', position: 'relative' }}>
      <div className="section-wrapper">
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div className="section-badge" style={{ backgroundColor: 'rgba(31, 61, 44, 0.1)', color: 'var(--green-dark)', borderColor: 'rgba(31, 61, 44, 0.18)' }}>
            <span className="dot"></span>
            Interactive Live Telemetry
          </div>
          <h2 className="section-title" style={{ color: 'var(--green-dark)' }}>Experience Real-Time Field Telemetry</h2>
          <p className="section-subtitle" style={{ color: 'var(--text-secondary)' }}>
            Switch between different plantation environments to inspect live GPS tracking, 
            radio frequency link metrics, and kinetic worker activity status.
          </p>
        </div>

        {/* Tab Navigation */}
        <div 
          ref={ref} 
          className={`reveal-init ${isVisible ? 'reveal-visible' : ''}`}
          style={{ maxWidth: '1060px', margin: '0 auto' }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '28px',
            flexWrap: 'wrap'
          }}>
            {[
              { id: 'tea', label: '🍃 Highland Tea Estate', crop: 'Camellia sinensis' },
              { id: 'coconut', label: '🥥 Coastal Coconut Grove', crop: 'Cocos nucifera' },
              { id: 'rubber', label: '🪵 Valley Rubber Estate', crop: 'Hevea brasiliensis' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveEstate(tab.id)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.98rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all var(--transition-normal)',
                  backgroundColor: activeEstate === tab.id ? 'var(--green-dark)' : 'var(--white)',
                  color: activeEstate === tab.id ? 'var(--yellow)' : 'var(--text-secondary)',
                  border: `1.5px solid ${activeEstate === tab.id ? 'var(--green-dark)' : 'rgba(31, 61, 44, 0.12)'}`,
                  boxShadow: activeEstate === tab.id ? 'var(--shadow-md)' : 'var(--shadow-sm)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive Console Card */}
          <div style={{
            background: 'var(--white)',
            borderRadius: '24px',
            border: '1px solid rgba(31, 61, 44, 0.1)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden'
          }}>
            {/* Header bar */}
            <div style={{
              backgroundColor: 'var(--green-dark)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--white)',
              padding: '22px 28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#38ef7d',
                    boxShadow: '0 0 10px #38ef7d',
                    display: 'inline-block'
                  }}></span>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--white)' }}>
                    {current.name}
                  </h3>
                  <span style={{ fontSize: '0.8rem', background: 'rgba(215, 230, 221, 0.15)', padding: '2px 10px', borderRadius: '6px', color: 'var(--green-light)' }}>
                    {current.location}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--green-light)', marginTop: '4px' }}>
                  {current.terrain} • {current.area}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#a4b3aa', textTransform: 'uppercase' }}>LoRa Packets Ingested</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--yellow)', fontFamily: 'var(--font-heading)' }}>
                    {packetCount.toLocaleString()} pkts
                  </div>
                </div>

                <button
                  onClick={handlePing}
                  disabled={isPinging}
                  style={{
                    backgroundColor: isPinging ? 'var(--green-medium)' : 'var(--yellow)',
                    color: 'var(--green-dark)',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: isPinging ? 'wait' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5"
                    style={{ animation: isPinging ? 'radarSweep 1s linear infinite' : 'none' }}
                  >
                    <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 0a6 6 0 0 0-12 0zm-5 0a1 1 0 0 0-2 0" />
                  </svg>
                  {isPinging ? 'Pinging LoRa...' : 'Ping Gateways'}
                </button>
              </div>
            </div>

            {/* Telemetry Metrics Ribbon */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1px',
              backgroundColor: 'var(--border-card)',
              borderBottom: '1px solid var(--border-card)'
            }}>
              <div style={{ background: 'var(--cream)', padding: '18px 22px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Harvesters</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--green-dark)', fontFamily: 'var(--font-heading)', marginTop: '2px' }}>
                  {current.workersActive} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {current.workersTotal} online</span>
                </div>
              </div>

              <div style={{ background: 'var(--cream)', padding: '18px 22px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>LoRa Signal (RSSI)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--green-dark)', fontFamily: 'var(--font-heading)', marginTop: '2px' }}>
                  {current.rssi} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#27ae60' }}>({current.snr})</span>
                </div>
              </div>

              <div style={{ background: 'var(--cream)', padding: '18px 22px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Soil & Microclimate</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brown)', fontFamily: 'var(--font-heading)', marginTop: '2px' }}>
                  {current.soilMoisture} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>• {current.temperature}</span>
                </div>
              </div>

              <div style={{ background: 'var(--cream)', padding: '18px 22px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Est. Harvest Rate</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--green-dark)', fontFamily: 'var(--font-heading)', marginTop: '2px' }}>
                  {current.harvestRate}
                </div>
              </div>
            </div>

            {/* Live Worker Telemetry Table */}
            <div style={{ padding: '24px 28px', overflowX: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--green-dark)' }}>
                  Active Wearable Badges (Sample Fleet)
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Updated via LoRa E32 Gateway • <strong style={{ color: 'var(--green-dark)' }}>100% Signal Integrity</strong>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '10px 12px' }}>Device UUID</th>
                    <th style={{ padding: '10px 12px' }}>Harvester Name</th>
                    <th style={{ padding: '10px 12px' }}>Assigned Task</th>
                    <th style={{ padding: '10px 12px' }}>Live GPS Fix</th>
                    <th style={{ padding: '10px 12px' }}>Motion State</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Battery</th>
                  </tr>
                </thead>
                <tbody>
                  {current.workers.map((w, idx) => (
                    <tr 
                      key={idx} 
                      style={{ 
                        borderBottom: '1px solid rgba(31, 61, 44, 0.05)',
                        backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(215, 230, 221, 0.15)',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '12px', fontWeight: 600, color: 'var(--brown)', fontFamily: 'monospace' }}>
                        {w.id}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 600, color: 'var(--green-dark)' }}>
                        {w.name}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                        {w.task}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {w.lat}, {w.lng}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          backgroundColor: 
                            w.status === 'ACTIVE' ? 'rgba(39, 174, 96, 0.12)' :
                            w.status === 'LOW_MOVEMENT' ? 'rgba(241, 196, 15, 0.2)' : 'rgba(140, 98, 57, 0.12)',
                          color: 
                            w.status === 'ACTIVE' ? '#1e8449' :
                            w.status === 'LOW_MOVEMENT' ? '#b7950b' : 'var(--brown)'
                        }}>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 
                              w.status === 'ACTIVE' ? '#27ae60' :
                              w.status === 'LOW_MOVEMENT' ? '#f1c40f' : 'var(--brown)'
                          }}></span>
                          {w.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: 'var(--green-dark)' }}>
                        {w.battery}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Insight Bar */}
            <div style={{
              backgroundColor: 'var(--green-subtle)',
              borderTop: '1px solid var(--border-card)',
              padding: '14px 28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}>
              <div>
                📡 Radio Gateway: <strong>ESP32 UART LoRa E32-433T20D</strong> • Transmission Cycle: <strong>Every 10 mins</strong>
              </div>
              <div style={{ color: 'var(--green-dark)', fontWeight: 600 }}>
                Automatic Geofencing & Yield Logging Enabled
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
