import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { formatArea, calculateGeodesicArea } from '../../lib/geoUtils';
import { X, MapPin, Layers, User, Sprout } from 'lucide-react';

export function AdminEstateModal({ estate, onClose }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Extract boundary vertices
  const rawCoords = estate?.boundary?.coordinates?.[0] || [];
  const polygonPoints = rawCoords.map((coord) => ({
    lat: Number(coord[1]),
    lng: Number(coord[0]),
  }));

  const areaSqM = calculateGeodesicArea(polygonPoints);
  const formattedArea = formatArea(areaSqM);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const center = polygonPoints.length > 0
      ? [polygonPoints[0].lat, polygonPoints[0].lng]
      : [7.8731, 80.7718];

    const map = L.map(mapContainerRef.current, {
      center,
      zoom: 14,
      minZoom: 6,
      maxZoom: 19,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    if (polygonPoints.length >= 3) {
      const latLngs = polygonPoints.map((p) => [p.lat, p.lng]);
      const polygonLayer = L.polygon(latLngs, {
        color: '#1F3D2C',
        weight: 2.5,
        fillColor: '#D7E6DD',
        fillOpacity: 0.5,
      }).addTo(map);

      // Centroid marker
      if (estate?.location?.coordinates) {
        const [cLng, cLat] = estate.location.coordinates;
        L.marker([cLat, cLng], {
          icon: L.divIcon({
            className: 'admin-estate-center-pin',
            html: `
              <div style="width: 20px; height: 28px; display: block;">
                <svg viewBox="0 0 20 28" width="20" height="28" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                  <path d="M10 28 C10 28 1 15.5 1 9.5 A 9 9 0 0 1 19 9.5 C 19 15.5 10 28 10 28 Z" fill="#F1C40F" stroke="#1F3D2C" stroke-width="1.8"/>
                  <circle cx="10" cy="9.5" r="3.5" fill="#1F3D2C" />
                </svg>
              </div>
            `,
            iconSize: [20, 28],
            iconAnchor: [10, 28],
          }),
        })
          .addTo(map)
          .bindPopup(`<b>${estate.name}</b><br/>${estate.code}`);
      }

      map.fitBounds(polygonLayer.getBounds(), { padding: [30, 30] });
    }

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [polygonPoints, estate]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white text-[#1F2937] border-[#D7E6DD] rounded-none shadow-xl overflow-hidden">
        {/* Header */}
        <CardHeader className="p-4 px-6 bg-[#1F3D2C] text-white flex flex-row items-center justify-between border-none">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Badge variant="yellow" className="text-xs">
                Estate Map
              </Badge>
              <span className="text-xs text-[#D7E6DD]">Code: {estate?.code}</span>
            </div>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#F1C40F]" />
              <span>{estate?.name}</span>
            </CardTitle>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-none h-8 w-8 p-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-0 flex-1 overflow-y-auto">
          {/* Metadata Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-[#F8F9FA] border-b border-[#D7E6DD] text-xs">
            <div>
              <span className="text-xs text-[#4B5563] flex items-center gap-1 font-medium">
                <User className="w-3.5 h-3.5 text-[#8C6239]" /> Owner
              </span>
              <p className="font-semibold text-[#1F3D2C] truncate mt-0.5">
                {estate?.owner?.name || 'Unknown'}
              </p>
              <p className="text-[11px] text-[#4B5563] truncate">
                {estate?.owner?.email || ''}
              </p>
            </div>

            <div>
              <span className="text-xs text-[#4B5563] flex items-center gap-1 font-medium">
                <Sprout className="w-3.5 h-3.5 text-[#1F3D2C]" /> Crop
              </span>
              <p className="font-semibold text-[#1F3D2C] mt-0.5">
                {estate?.crop?.name || 'Unassigned'}
              </p>
              <p className="text-[11px] text-[#8C6239] font-medium">
                Rs. {Number(estate?.crop?.paymentFactor || 0).toFixed(2)} / kg
              </p>
            </div>

            <div>
              <span className="text-xs text-[#4B5563] flex items-center gap-1 font-medium">
                <Layers className="w-3.5 h-3.5 text-[#1F3D2C]" /> Land Area
              </span>
              <p className="font-semibold text-[#1F3D2C] mt-0.5">
                {formattedArea.acres} Acres
              </p>
              <p className="text-[11px] text-[#4B5563]">
                {formattedArea.hectares} Hectares
              </p>
            </div>

            <div>
              <span className="text-xs text-[#4B5563] flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#1F3D2C]" /> Boundary &amp; Status
              </span>
              <p className="font-semibold text-[#1F3D2C] mt-0.5">
                {polygonPoints.length} Points
              </p>
              <p className="text-[11px] text-emerald-800 font-semibold capitalize">
                Status: {estate?.status || 'active'}
              </p>
            </div>
          </div>

          {/* Leaflet Map Preview */}
          <div
            ref={mapContainerRef}
            className="w-full h-[380px] bg-slate-100"
            style={{ minHeight: '380px' }}
          />

          {/* Coordinates Summary */}
          <div className="p-4 bg-white border-t border-[#D7E6DD] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1F3D2C]">
                Polygon Boundary Coordinates
              </span>
              <span className="text-xs text-[#4B5563]">
                {polygonPoints.length} points defined
              </span>
            </div>
            <div className="bg-[#F8F9FA] border border-[#D7E6DD] p-3 max-h-32 overflow-y-auto text-xs space-y-1">
              {polygonPoints.map((pt, i) => (
                <div key={i} className="flex justify-between items-center py-0.5 border-b border-[#D7E6DD]/40 last:border-none text-slate-700">
                  <span className="text-[#8C6239] font-medium">Point {i + 1}</span>
                  <span>Lat: {pt.lat.toFixed(6)}, Lng: {pt.lng.toFixed(6)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <div className="p-3 px-6 bg-[#F8F9FA] border-t border-[#D7E6DD] flex items-center justify-end">
          <Button
            onClick={onClose}
            className="rounded-none bg-[#1F3D2C] hover:bg-[#162D20] text-white text-xs h-9 px-5 cursor-pointer"
          >
            Close Map
          </Button>
        </div>
      </Card>
    </div>
  );
}
