import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { calculateGeodesicArea, formatArea } from '../../lib/geoUtils';

const SRI_LANKA_CENTER = [7.8731, 80.7718];

const createMarkerIcon = (color = '#1F3D2C') => {
  return L.divIcon({
    className: 'estate-marker-pin',
    html: `
      <div style="position: relative; width: 30px; height: 38px; transform: translate(-15px, -38px);">
        <svg viewBox="0 0 24 32" width="30" height="38" style="filter: drop-shadow(0 2px 5px rgba(0,0,0,0.3));">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 8.5 12 20 12 20s12-11.5 12-20c0-6.63-5.37-12-12-12z" fill="${color}" stroke="#FFFFFF" stroke-width="1.5"/>
          <circle cx="12" cy="11" r="4.5" fill="#F1C40F" />
        </svg>
      </div>
    `,
    iconSize: [30, 38],
    iconAnchor: [15, 38],
    popupAnchor: [0, -38],
  });
};

export function EstatesOverviewMap({ estates = [], height = '340px' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: SRI_LANKA_CENTER,
      zoom: 8,
      minZoom: 7,
      maxZoom: 18,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const layerGroup = L.featureGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      layerGroupRef.current = null;
    };
  }, []);

  // Update polygons and markers when estates prop updates
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const allBoundsPoints = [];

    estates.forEach((est) => {
      let lat = null;
      let lng = null;
      let areaText = '';

      // Check centroid location
      if (est.location && Array.isArray(est.location.coordinates)) {
        lng = parseFloat(est.location.coordinates[0]);
        lat = parseFloat(est.location.coordinates[1]);
      }

      // Check polygon boundary
      if (
        est.boundary &&
        Array.isArray(est.boundary.coordinates) &&
        est.boundary.coordinates[0]
      ) {
        const ring = est.boundary.coordinates[0];
        const polyLatLngs = ring
          .map((coord) => [parseFloat(coord[1]), parseFloat(coord[0])])
          .filter((pt) => !isNaN(pt[0]) && !isNaN(pt[1]));

        if (polyLatLngs.length >= 3) {
          const polygon = L.polygon(polyLatLngs, {
            color: '#1F3D2C',
            weight: 2,
            fillColor: '#D7E6DD',
            fillOpacity: 0.4,
          });

          // Calculate area for popup
          const ptsForArea = polyLatLngs.map((pt) => ({
            lat: pt[0],
            lng: pt[1],
          }));
          const sqMeters = calculateGeodesicArea(ptsForArea);
          const formatted = formatArea(sqMeters);
          areaText = `${formatted.acres} Acres (${formatted.hectares} Ha)`;

          polygon.bindPopup(`
            <div style="font-family: 'Ubuntu', sans-serif; min-width: 150px;">
              <strong style="color: #1F3D2C; font-size: 13px;">${est.name}</strong>
              <div style="font-size: 11px; color: #8C6239; margin-top: 2px;">Code: ${est.code}</div>
              <div style="font-size: 11px; color: #4B5563;">Crop: ${est.crop?.name || 'Assigned'}</div>
              <div style="font-size: 11px; color: #1F3D2C; font-weight: bold; margin-top: 4px;">Area: ${areaText}</div>
            </div>
          `);

          layerGroup.addLayer(polygon);
          polyLatLngs.forEach((pt) => allBoundsPoints.push(pt));
        }
      }

      // If centroid exists, place marker
      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        allBoundsPoints.push([lat, lng]);

        const marker = L.marker([lat, lng], {
          icon: createMarkerIcon('#1F3D2C'),
        });

        marker.bindPopup(`
          <div style="font-family: 'Ubuntu', sans-serif; min-width: 150px;">
            <strong style="color: #1F3D2C; font-size: 13px;">${est.name}</strong>
            <div style="font-size: 11px; color: #8C6239; margin-top: 2px;">Code: ${est.code}</div>
            <div style="font-size: 11px; color: #4B5563;">Crop: ${est.crop?.name || 'Assigned'}</div>
            ${areaText ? `<div style="font-size: 11px; color: #1F3D2C; font-weight: bold; margin-top: 4px;">Area: ${areaText}</div>` : ''}
            <div style="font-size: 10px; color: #6B7280; margin-top: 4px;">Centroid: ${lat.toFixed(5)}, ${lng.toFixed(5)}</div>
          </div>
        `);

        layerGroup.addLayer(marker);
      }
    });

    if (allBoundsPoints.length > 0) {
      const bounds = L.latLngBounds(allBoundsPoints);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    } else {
      map.setView(SRI_LANKA_CENTER, 8);
    }
  }, [estates]);

  return (
    <div
      className="relative border border-[#D7E6DD] w-full overflow-hidden bg-[#F8F9FA]"
      style={{ height }}
    >
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute top-2 right-2 z-[400] bg-white/95 border border-[#D1D5DB] px-2.5 py-1 text-[11px] text-[#1F3D2C] shadow-sm font-medium">
        📍 {estates.length} Registered {estates.length === 1 ? 'Estate' : 'Estates'} on OpenStreetMap
      </div>
    </div>
  );
}
