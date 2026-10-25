import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { calculateGeodesicArea, formatArea } from '../../lib/geoUtils';
import { Undo, Trash2, MapPin, Plus, CheckCircle, Navigation } from 'lucide-react';

const SRI_LANKA_BOUNDS = [
  [5.5, 78.8],
  [10.2, 82.5],
];

// Quick jump plantation regions in Sri Lanka
const SRI_LANKA_JUMP_REGIONS = [
  { name: 'Nuwara Eliya', lat: 6.9497, lng: 80.7891 },
  { name: 'Kandy', lat: 7.2906, lng: 80.6337 },
  { name: 'Hatton', lat: 6.8924, lng: 80.596 },
  { name: 'Badulla', lat: 6.9895, lng: 81.0557 },
  { name: 'Ratnapura', lat: 6.6828, lng: 80.4037 },
  { name: 'Colombo', lat: 6.9271, lng: 79.8612 },
];

// 1. Custom Pinpoint Marker Icon (Small, sharp needle-pointed pin)
const createPinpointIcon = () => {
  return L.divIcon({
    className: 'active-pinpoint-marker',
    html: `
      <div style="width: 20px; height: 28px; display: block; cursor: move; pointer-events: auto;">
        <svg viewBox="0 0 20 28" width="20" height="28" style="display: block; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.45));">
          <!-- Sharp needle-pointed pin body with tip at bottom center (10, 28) -->
          <path d="M10 28 C10 28 1 15.5 1 9.5 A 9 9 0 0 1 19 9.5 C 19 15.5 10 28 10 28 Z" fill="#F1C40F" stroke="#1F3D2C" stroke-width="1.8" stroke-linejoin="round"/>
          <circle cx="10" cy="9.5" r="3.5" fill="#1F3D2C" />
          <circle cx="10" cy="9.5" r="1.3" fill="#FFFFFF" />
        </svg>
      </div>
    `,
    iconSize: [20, 28],
    iconAnchor: [10, 28],
    popupAnchor: [0, -28],
  });
};

// 2. Custom Confirmed Polygon Vertex Icon (Numbered square tag)
const createConfirmedVertexIcon = (index) => {
  const isFirst = index === 0;
  const bgColor = isFirst ? '#1F3D2C' : '#8C6239';

  return L.divIcon({
    className: 'confirmed-vertex-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: ${bgColor};
        color: #FFFFFF;
        border: 2px solid #FFFFFF;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        font-family: 'Ubuntu', sans-serif;
        cursor: move;
      ">
        ${index + 1}
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

export function SriLankaPolygonMap({
  points = [],
  onAddPoint,
  onUpdatePoint,
  onDeletePoint,
  onClearPoints,
  height = '400px',
  interactive = true,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polygonLayerRef = useRef(null);
  const confirmedMarkersGroupRef = useRef(null);
  const pinpointMarkerRef = useRef(null);

  // Active pinpoint marker position
  const [pinpoint, setPinpoint] = useState({
    lat: 6.9497,
    lng: 80.7891,
  });

  // Keep a ref to latest onAddPoint and points for popup event binding
  const onAddPointRef = useRef(onAddPoint);
  const pointsRef = useRef(points);
  const pinpointRef = useRef(pinpoint);

  useEffect(() => {
    onAddPointRef.current = onAddPoint;
    pointsRef.current = points;
    pinpointRef.current = pinpoint;
  }, [onAddPoint, points, pinpoint]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = pinpointRef.current.lat;
    const initialLng = pinpointRef.current.lng;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 9,
      minZoom: 7,
      maxZoom: 18,
      maxBounds: SRI_LANKA_BOUNDS,
      maxBoundsViscosity: 0.8,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const polygonLayer = L.featureGroup().addTo(map);
    const confirmedMarkersGroup = L.featureGroup().addTo(map);

    polygonLayerRef.current = polygonLayer;
    confirmedMarkersGroupRef.current = confirmedMarkersGroup;

    // Create the draggable pinpoint marker
    const pinpointMarker = L.marker([initialLat, initialLng], {
      icon: createPinpointIcon(),
      draggable: interactive,
      zIndexOffset: 1000,
    }).addTo(map);

    const updatePinpointPopup = (lat, lng) => {
      const nextNum = pointsRef.current.length + 1;
      pinpointMarker.bindPopup(`
        <div style="font-family: 'Ubuntu', sans-serif; min-width: 160px; font-size: 12px;">
          <div style="font-weight: bold; color: #1F3D2C; font-size: 13px;">📍 Active Pinpoint</div>
          <div style="color: #4B5563; margin-top: 2px;">
            Lat: ${lat.toFixed(6)}<br/>Lng: ${lng.toFixed(6)}
          </div>
          <button id="add-pinpoint-popup-btn" style="
            margin-top: 6px;
            width: 100%;
            background-color: #1F3D2C;
            color: #FFFFFF;
            padding: 4px 8px;
            border: none;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
          ">
            ➕ Add as Point #${nextNum}
          </button>
        </div>
      `);
    };

    updatePinpointPopup(initialLat, initialLng);

    // Click handler for popup button
    pinpointMarker.on('popupopen', () => {
      const btn = document.getElementById('add-pinpoint-popup-btn');
      if (btn) {
        btn.onclick = () => {
          pinpointMarker.closePopup();
          const pos = pinpointMarker.getLatLng();
          if (onAddPointRef.current) {
            onAddPointRef.current(
              parseFloat(pos.lat.toFixed(6)),
              parseFloat(pos.lng.toFixed(6)),
            );
          }
        };
      }
    });

    // Pinpoint marker drag
    pinpointMarker.on('dragend', () => {
      const pos = pinpointMarker.getLatLng();
      const newLat = parseFloat(pos.lat.toFixed(6));
      const newLng = parseFloat(pos.lng.toFixed(6));
      setPinpoint({ lat: newLat, lng: newLng });
      updatePinpointPopup(newLat, newLng);
    });

    // Map click: Moves the pinpoint marker to clicked position.
    // DOES NOT automatically add a point!
    if (interactive) {
      map.on('click', (e) => {
        const newLat = parseFloat(e.latlng.lat.toFixed(6));
        const newLng = parseFloat(e.latlng.lng.toFixed(6));
        pinpointMarker.setLatLng([newLat, newLng]);
        setPinpoint({ lat: newLat, lng: newLng });
        updatePinpointPopup(newLat, newLng);
      });

      // Zoom listener: If zooming into an area where the pinpoint selector is outside
      // the visible viewing area, automatically move the pinpoint to the center of the current view.
      map.on('zoomend', () => {
        const bounds = map.getBounds();
        const currentPos = pinpointMarker.getLatLng();

        if (!bounds.contains(currentPos)) {
          const center = map.getCenter();
          const newLat = parseFloat(center.lat.toFixed(6));
          const newLng = parseFloat(center.lng.toFixed(6));

          pinpointMarker.setLatLng([newLat, newLng]);
          setPinpoint({ lat: newLat, lng: newLng });
          updatePinpointPopup(newLat, newLng);
        }
      });
    }

    pinpointMarkerRef.current = pinpointMarker;
    mapInstanceRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      polygonLayerRef.current = null;
      confirmedMarkersGroupRef.current = null;
      pinpointMarkerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-render confirmed polygon and confirmed vertex markers whenever points array changes
  useEffect(() => {
    if (
      !mapInstanceRef.current ||
      !polygonLayerRef.current ||
      !confirmedMarkersGroupRef.current
    )
      return;

    const polygonLayer = polygonLayerRef.current;
    const confirmedMarkersGroup = confirmedMarkersGroupRef.current;

    polygonLayer.clearLayers();
    confirmedMarkersGroup.clearLayers();

    if (!points || points.length === 0) return;

    const latLngs = points.map((p) => [p.lat, p.lng]);

    // Render polygon (>= 3 points) or line (2 points)
    if (latLngs.length >= 3) {
      const polygon = L.polygon(latLngs, {
        color: '#1F3D2C',
        weight: 2.5,
        fillColor: '#D7E6DD',
        fillOpacity: 0.45,
      });
      polygonLayer.addLayer(polygon);
    } else if (latLngs.length === 2) {
      const polyline = L.polyline(latLngs, {
        color: '#1F3D2C',
        weight: 2.5,
        dashArray: '6, 6',
      });
      polygonLayer.addLayer(polyline);
    }

    // Render confirmed vertex markers
    points.forEach((pt, idx) => {
      const marker = L.marker([pt.lat, pt.lng], {
        icon: createConfirmedVertexIcon(idx),
        draggable: interactive,
        title: `Confirmed Point #${idx + 1}`,
      });

      if (interactive) {
        marker.on('dragend', () => {
          const newPos = marker.getLatLng();
          if (onUpdatePoint) {
            onUpdatePoint(
              idx,
              parseFloat(newPos.lat.toFixed(6)),
              parseFloat(newPos.lng.toFixed(6)),
            );
          }
        });

        const popupContent = document.createElement('div');
        popupContent.style.fontFamily = "'Ubuntu', sans-serif";
        popupContent.style.fontSize = '12px';
        popupContent.innerHTML = `
          <strong style="color: #1F3D2C;">Confirmed Point #${idx + 1}</strong><br/>
          Lat: ${pt.lat.toFixed(6)}<br/>
          Lng: ${pt.lng.toFixed(6)}<br/>
        `;

        if (onDeletePoint) {
          const delBtn = document.createElement('button');
          delBtn.innerText = 'Delete Point';
          delBtn.style.marginTop = '6px';
          delBtn.style.padding = '3px 8px';
          delBtn.style.backgroundColor = '#EF4444';
          delBtn.style.color = '#FFFFFF';
          delBtn.style.border = 'none';
          delBtn.style.cursor = 'pointer';
          delBtn.style.fontSize = '11px';
          delBtn.onclick = () => {
            marker.closePopup();
            onDeletePoint(idx);
          };
          popupContent.appendChild(delBtn);
        }

        marker.bindPopup(popupContent);
      }

      confirmedMarkersGroup.addLayer(marker);
    });
  }, [points, interactive, onUpdatePoint, onDeletePoint]);

  // Handle explicit Add Point button
  const handleConfirmPinpoint = () => {
    if (onAddPoint) {
      onAddPoint(pinpoint.lat, pinpoint.lng);
    }
  };

  // Move pinpoint directly to current map center
  const handleCenterPinpointInView = () => {
    if (!mapInstanceRef.current || !pinpointMarkerRef.current) return;
    const center = mapInstanceRef.current.getCenter();
    const newLat = parseFloat(center.lat.toFixed(6));
    const newLng = parseFloat(center.lng.toFixed(6));
    pinpointMarkerRef.current.setLatLng([newLat, newLng]);
    setPinpoint({ lat: newLat, lng: newLng });
  };

  // Jump pinpoint to a specific Sri Lanka region
  const handleJumpRegion = (reg) => {
    setPinpoint({ lat: reg.lat, lng: reg.lng });
    if (pinpointMarkerRef.current) {
      pinpointMarkerRef.current.setLatLng([reg.lat, reg.lng]);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([reg.lat, reg.lng], 13);
    }
  };

  const areaSqMeters = calculateGeodesicArea(points);
  const formattedArea = formatArea(areaSqMeters);

  return (
    <div className="space-y-2">
      {/* 1. Pinpoint Action Banner */}
      {interactive && (
        <div className="bg-[#1F3D2C] text-white p-3 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1F3D2C]/40 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-[#F1C40F] text-[#1F3D2C] font-bold flex items-center justify-center text-xs">
                📍
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#F1C40F]">
                  Step 1: Move Map Pin To Pinpoint Boundary Corner
                </div>
                <div className="text-[11px] text-[#D7E6DD]">
                  Drag the yellow pin or click anywhere on the map to pinpoint a corner. (Clicking will NOT automatically add a point).
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs font-mono bg-[#162D20] px-2 py-1 text-[#F1C40F] border border-[#162D20]">
                Lat: {pinpoint.lat.toFixed(5)}, Lng: {pinpoint.lng.toFixed(5)}
              </span>
            </div>
          </div>

          {/* Action Button to Record Point */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
            <button
              type="button"
              onClick={handleConfirmPinpoint}
              className="bg-[#F1C40F] hover:bg-[#E5B80B] text-[#1F3D2C] font-bold text-xs px-4 py-2 border-2 border-[#1F3D2C] shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Pinpointed Location as Point #{points.length + 1}
            </button>

            <div className="flex items-center gap-2">
              {/* Undo Last Point */}
              <button
                type="button"
                onClick={() => {
                  if (points.length > 0 && onDeletePoint) {
                    onDeletePoint(points.length - 1);
                  }
                }}
                disabled={points.length === 0}
                className="text-xs px-2.5 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white border border-white/20 transition-colors cursor-pointer flex items-center gap-1 font-medium"
              >
                <Undo className="w-3.5 h-3.5" />
                Undo Point
              </button>

              {/* Clear All */}
              <button
                type="button"
                onClick={onClearPoints}
                disabled={points.length === 0}
                className="text-xs px-2.5 py-1.5 bg-red-600/80 hover:bg-red-600 disabled:opacity-40 text-white border border-red-500 transition-colors cursor-pointer flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset Points
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Region Presets Quick Jump */}
      {interactive && (
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F8F9FA] border border-[#D7E6DD] px-3 py-1.5 text-xs text-[#4B5563]">
          <span className="font-semibold text-[#1F3D2C] text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Navigation className="w-3 h-3 text-[#8C6239]" />
            Quick Region Jumps:
          </span>
          {SRI_LANKA_JUMP_REGIONS.map((reg) => (
            <button
              key={reg.name}
              type="button"
              onClick={() => handleJumpRegion(reg)}
              className="text-[11px] px-2 py-0.5 bg-white hover:bg-[#D7E6DD] text-[#1F3D2C] border border-[#D1D5DB] transition-colors rounded-none font-medium cursor-pointer"
            >
              {reg.name}
            </button>
          ))}
          <div className="sm:ml-auto">
            <button
              type="button"
              onClick={handleCenterPinpointInView}
              className="text-[11px] px-2 py-0.5 bg-[#1F3D2C] hover:bg-[#162D20] text-white border border-[#1F3D2C] transition-colors rounded-none font-medium cursor-pointer flex items-center gap-1"
              title="Move pinpoint marker to center of current view"
            >
              🎯 Center Pin in View
            </button>
          </div>
        </div>
      )}

      {/* Map Canvas Container */}
      <div
        className="relative border border-[#D1D5DB] w-full overflow-hidden bg-[#E5E7EB]"
        style={{ height }}
      >
        <div ref={mapContainerRef} className="w-full h-full z-0 cursor-crosshair" />

        {/* Floating Instruction Banner */}
        {interactive && (
          <div className="absolute top-2 right-2 z-[400] bg-white/95 border border-[#D1D5DB] px-3 py-1.5 text-xs text-[#1F3D2C] shadow-md font-medium">
            <div className="flex items-center gap-1.5 font-bold">
              <MapPin className="w-3.5 h-3.5 text-[#8C6239]" />
              {points.length === 0 ? (
                <span>No points added yet</span>
              ) : points.length < 3 ? (
                <span className="text-amber-700">
                  {points.length}/3 points added (Need at least 3)
                </span>
              ) : (
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {points.length} points confirmed (Ready to save)
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. Automatic Land Area Calculation Display */}
      <div className="bg-white border-2 border-[#1F3D2C] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="text-[11px] uppercase tracking-wider text-[#4B5563] font-semibold">
            Calculated Approximate Land Area:
          </div>
          <div className="text-xl font-bold font-heading text-[#1F3D2C] flex items-center gap-2">
            <span>{points.length >= 3 ? `${formattedArea.acres} Acres` : '0.00 Acres'}</span>
            <span className="text-xs text-[#6B7280] font-normal font-sans">
              {points.length >= 3
                ? `(${formattedArea.hectares} Hectares • ${formattedArea.sqMeters} m²)`
                : '(Add at least 3 points to calculate area)'}
            </span>
          </div>
        </div>

        <div className="text-right text-xs">
          <div className="font-semibold text-[#1F3D2C]">Estate Boundary</div>
          <div className="text-[11px] mt-0.5">
            {points.length >= 3 ? (
              <span className="text-emerald-700 font-bold flex items-center justify-end gap-1">
                <CheckCircle className="w-3 h-3" />
                {points.length} boundary points (Closed Shape)
              </span>
            ) : (
              <span className="text-amber-700 font-semibold">
                ⚠️ {points.length}/3 minimum points added before saving
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
