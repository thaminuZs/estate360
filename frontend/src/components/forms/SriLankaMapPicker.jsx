import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Custom SVG pin for the estate location
const createEstatePin = () => {
  return L.divIcon({
    className: 'estate-map-pin',
    html: `
      <div style="position: relative; width: 34px; height: 42px; transform: translate(-17px, -42px);">
        <svg viewBox="0 0 24 32" width="34" height="42" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 8.5 12 20 12 20s12-11.5 12-20c0-6.63-5.37-12-12-12z" fill="#1F3D2C" stroke="#FFFFFF" stroke-width="1.5"/>
          <circle cx="12" cy="11" r="5" fill="#F1C40F" />
          <circle cx="12" cy="11" r="2.5" fill="#1F3D2C" />
        </svg>
      </div>
    `,
    iconSize: [34, 42],
    iconAnchor: [17, 42],
    popupAnchor: [0, -42],
  });
};

// Sri Lanka bounds and center
const SRI_LANKA_CENTER = [7.8731, 80.7718]; // Central Sri Lanka
const SRI_LANKA_BOUNDS = [
  [5.5, 78.8],
  [10.2, 82.5],
];

// Major plantation regions in Sri Lanka for quick selection
const SRI_LANKA_REGIONS = [
  { name: 'Nuwara Eliya (High Grown)', lat: 6.9497, lng: 80.7891 },
  { name: 'Kandy (Mid Grown)', lat: 7.2906, lng: 80.6337 },
  { name: 'Hatton / Maskeliya', lat: 6.8924, lng: 80.596 },
  { name: 'Badulla / Uva', lat: 6.9895, lng: 81.0557 },
  { name: 'Ratnapura (Rubber/Tea)', lat: 6.6828, lng: 80.4037 },
  { name: 'Kurunegala (Coconut)', lat: 7.4863, lng: 80.3623 },
  { name: 'Galle / Matara (Low Grown)', lat: 6.0535, lng: 80.221 },
  { name: 'Colombo (Western)', lat: 6.9271, lng: 79.8612 },
];

export function SriLankaMapPicker({
  latitude,
  longitude,
  onChange,
  height = '360px',
  interactive = true,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    const initialLat = parseFloat(latitude) || SRI_LANKA_CENTER[0];
    const initialLng = parseFloat(longitude) || SRI_LANKA_CENTER[1];

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 8,
      minZoom: 7,
      maxZoom: 18,
      maxBounds: SRI_LANKA_BOUNDS,
      maxBoundsViscosity: 0.8,
    });

    // OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Initial marker
    const marker = L.marker([initialLat, initialLng], {
      icon: createEstatePin(),
      draggable: interactive,
    }).addTo(map);

    marker.bindPopup(
      `<strong>Estate Coordinates</strong><br/>Lat: ${initialLat.toFixed(5)}<br/>Lng: ${initialLng.toFixed(5)}`,
    );

    // Marker drag event
    if (interactive) {
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        marker.setPopupContent(
          `<strong>Selected Location</strong><br/>Lat: ${pos.lat.toFixed(5)}<br/>Lng: ${pos.lng.toFixed(5)}`,
        );
        marker.openPopup();
        if (onChange) {
          onChange(pos.lat.toFixed(6), pos.lng.toFixed(6));
        }
      });

      // Map click event
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        marker.setPopupContent(
          `<strong>Selected Location</strong><br/>Lat: ${lat.toFixed(5)}<br/>Lng: ${lng.toFixed(5)}`,
        );
        marker.openPopup();
        if (onChange) {
          onChange(lat.toFixed(6), lng.toFixed(6));
        }
      });
    }

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Invalidate size once container mounts completely
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Synchronize map when latitude/longitude props change externally
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      const currentPos = markerRef.current.getLatLng();
      if (
        Math.abs(currentPos.lat - lat) > 0.0001 ||
        Math.abs(currentPos.lng - lng) > 0.0001
      ) {
        markerRef.current.setLatLng([lat, lng]);
        markerRef.current.setPopupContent(
          `<strong>Estate Location</strong><br/>Lat: ${lat.toFixed(5)}<br/>Lng: ${lng.toFixed(5)}`,
        );
        mapInstanceRef.current.panTo([lat, lng], { animate: true });
      }
    }
  }, [latitude, longitude]);

  // Quick preset jump
  const handleSelectRegion = (region) => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    markerRef.current.setLatLng([region.lat, region.lng]);
    markerRef.current.setPopupContent(
      `<strong>${region.name}</strong><br/>Lat: ${region.lat.toFixed(5)}<br/>Lng: ${region.lng.toFixed(5)}`,
    );
    markerRef.current.openPopup();
    mapInstanceRef.current.flyTo([region.lat, region.lng], 12);
    if (onChange) {
      onChange(region.lat.toFixed(6), region.lng.toFixed(6));
    }
  };

  return (
    <div className="space-y-2">
      {/* Region Presets Toolbar */}
      {interactive && (
        <div className="space-y-1">
          <div className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide">
            Sri Lanka Plantation Region Presets:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SRI_LANKA_REGIONS.map((reg) => (
              <button
                key={reg.name}
                type="button"
                onClick={() => handleSelectRegion(reg)}
                className="text-[11px] px-2 py-0.5 bg-[#D7E6DD]/60 hover:bg-[#D7E6DD] text-[#1F3D2C] border border-[#D7E6DD] transition-colors rounded-none font-medium cursor-pointer"
              >
                {reg.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Map Container */}
      <div
        className="relative border border-[#D1D5DB] w-full overflow-hidden bg-[#E5E7EB]"
        style={{ height }}
      >
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Instruction Badge */}
        {interactive && (
          <div className="absolute top-2 right-2 z-[400] bg-white/95 border border-[#D1D5DB] px-2.5 py-1 text-[11px] text-[#1F3D2C] shadow-sm font-medium pointer-events-none">
            📍 Click map or drag pin to position estate
          </div>
        )}
      </div>

      {/* Coordinate status display bar */}
      <div className="flex flex-wrap items-center justify-between text-xs bg-[#F8F9FA] border border-[#D7E6DD] px-3 py-1.5 text-[#1F3D2C]">
        <div className="flex items-center gap-4">
          <span>
            <strong>Lat:</strong> {latitude || '—'}
          </span>
          <span>
            <strong>Lng:</strong> {longitude || '—'}
          </span>
        </div>
        <span className="text-[11px] text-[#8C6239] font-medium">
          OpenStreetMap • Sri Lanka (EPSG:4326)
        </span>
      </div>
    </div>
  );
}
