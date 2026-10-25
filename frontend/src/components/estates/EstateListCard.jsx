import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { calculateGeodesicArea, formatArea } from '../../lib/geoUtils';
import { MapPin, Edit2, Trash2 } from 'lucide-react';

export function EstateListCard({ estate, onEdit, onDelete }) {
  const lon = estate.location?.coordinates?.[0];
  const lat = estate.location?.coordinates?.[1];

  let calculatedArea = null;
  let vertexCount = 0;
  if (
    estate.boundary &&
    Array.isArray(estate.boundary.coordinates) &&
    estate.boundary.coordinates[0]?.length >= 3
  ) {
    const ring = estate.boundary.coordinates[0];
    vertexCount =
      ring.length > 3 && ring[0][0] === ring[ring.length - 1][0]
        ? ring.length - 1
        : ring.length;
    const pts = ring.map((c) => ({ lat: c[1], lng: c[0] }));
    const sqMeters = calculateGeodesicArea(pts);
    calculatedArea = formatArea(sqMeters);
  }

  return (
    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8F9FA] transition-colors">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-base text-[#1F3D2C]">
            {estate.name}
          </span>
          <Badge variant="yellow" className="text-[10px] px-1.5 py-0">
            {estate.code}
          </Badge>
          {calculatedArea && (
            <span className="text-[11px] font-semibold text-[#1F3D2C] bg-[#D7E6DD]/60 px-2 py-0.5 border border-[#D7E6DD]">
              {calculatedArea.acres} Acres
            </span>
          )}
        </div>
        <p className="text-xs text-[#4B5563]">
          Crop: <strong className="text-[#1F2937]">{estate.crop?.name || 'Assigned'}</strong> • Status:{' '}
          <span className="capitalize text-emerald-800 font-semibold">
            {estate.status || 'active'}
          </span>
          {vertexCount > 0 && ` • ${vertexCount} Boundary Points`}
        </p>
        {lat !== undefined && lon !== undefined && (
          <p className="text-[11px] text-[#8C6239] font-mono flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-[#8C6239]" />
            Center Coordinates: Lat {Number(lat).toFixed(5)}, Lng {Number(lon).toFixed(5)}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 self-start sm:self-center">
        {onEdit && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(estate)}
            className="rounded-none border-[#D7E6DD] text-[#1F3D2C] hover:bg-[#D7E6DD]/30 text-xs h-7 px-2.5 cursor-pointer gap-1"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </Button>
        )}

        {onDelete && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(estate)}
            className="rounded-none text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2 text-xs cursor-pointer gap-1"
            title="Delete Estate"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}

        <Badge variant="light" className="text-xs text-[#1F3D2C]">
          Active Estate
        </Badge>
      </div>
    </div>
  );
}
