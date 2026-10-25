import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert } from '../ui/alert';
import { SriLankaPolygonMap } from './SriLankaPolygonMap';
import { createOwnerEstate, getOwnerToken } from '../../api/owner';
import {
  calculateGeodesicArea,
  formatArea,
  calculatePolygonCentroid,
  buildPostGisPolygon,
  hasOverlappingLines,
  untanglePolygon,
} from '../../lib/geoUtils';
import {
  Map,
  Edit3,
  X,
  Plus,
  Trash2,
  Layers,
  Sparkles,
  ClipboardPaste,
  AlertTriangle,
} from 'lucide-react';

export function RegisterEstateForm({
  crops = [],
  onSuccess,
  onCancel,
}) {
  // Coordinate Selection Mode: 'map' or 'manual'
  const [coordMode, setCoordMode] = useState('map');

  // Form Basic Info State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [cropId, setCropId] = useState(crops.length > 0 ? crops[0].id : '');

  // Polygon Points State: starts completely EMPTY (user must pinpoint/enter at least 3 points)
  const [points, setPoints] = useState([]);

  // Auto-untangle feedback banner
  const [untangledAlert, setUntangledAlert] = useState(false);

  // Bulk paste textarea state
  const [showBulkPaste, setShowBulkPaste] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkError, setBulkError] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Polygon Handlers with automatic overlapping lines adjustment
  const handleAddPoint = (lat, lng) => {
    setPoints((prev) => {
      let candidate = [...prev, { lat, lng }];
      if (candidate.length >= 4 && hasOverlappingLines(candidate)) {
        candidate = untanglePolygon(candidate);
        setUntangledAlert(true);
      }
      return candidate;
    });
    setErrorMsg('');
  };

  const handleUpdatePoint = (index, lat, lng) => {
    setPoints((prev) => {
      let candidate = [...prev];
      candidate[index] = { lat, lng };
      if (candidate.length >= 4 && hasOverlappingLines(candidate)) {
        candidate = untanglePolygon(candidate);
        setUntangledAlert(true);
      }
      return candidate;
    });
  };

  const handleDeletePoint = (index) => {
    setPoints((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearPoints = () => {
    setPoints([]);
    setUntangledAlert(false);
  };

  // 2. Bulk coordinates import
  const handleApplyBulkCoordinates = () => {
    setBulkError('');
    if (!bulkText.trim()) {
      setBulkError('Please paste coordinate pairs.');
      return;
    }

    try {
      let parsedPoints = [];
      const lines = bulkText.split('\n');

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        const parts = line.replace(/[[\]]/g, '').split(/[,\s\t]+/);
        if (parts.length >= 2) {
          const lat = parseFloat(parts[0]);
          const lng = parseFloat(parts[1]);

          if (isNaN(lat) || isNaN(lng)) {
            throw new Error(`Invalid numbers on line: "${line}"`);
          }
          parsedPoints.push({
            lat: parseFloat(lat.toFixed(6)),
            lng: parseFloat(lng.toFixed(6)),
          });
        }
      }

      if (parsedPoints.length < 3) {
        throw new Error('At least 3 coordinate pairs are required for a polygon boundary.');
      }

      if (parsedPoints.length >= 4 && hasOverlappingLines(parsedPoints)) {
        parsedPoints = untanglePolygon(parsedPoints);
        setUntangledAlert(true);
      }

      setPoints(parsedPoints);
      setShowBulkPaste(false);
      setBulkText('');
    } catch (err) {
      setBulkError(err.message || 'Failed to parse coordinates.');
    }
  };

  // 3. Automatic Land Area Calculation
  const areaSqMeters = calculateGeodesicArea(points);
  const formattedArea = formatArea(areaSqMeters);

  // 4. Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter an Estate Name.');
      return;
    }

    if (!code.trim()) {
      setErrorMsg('Please enter an Estate Code (e.g. DVE-01).');
      return;
    }

    // Strict validation: must have at least 3 points
    if (points.length < 3) {
      setErrorMsg(
        `You need to add at least 3 boundary points before saving (Currently: ${points.length}/3 points added).`,
      );
      return;
    }

    const postGisBoundary = buildPostGisPolygon(points);
    if (!postGisBoundary) {
      setErrorMsg('Could not build valid PostGIS polygon from specified points.');
      return;
    }

    const postGisCentroid = calculatePolygonCentroid(points);

    const token = getOwnerToken();

    if (!token) {
      setErrorMsg('Authentication token not found. Please log in again.');
      return;
    }

    const payload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      cropId: cropId || (crops.length > 0 ? crops[0].id : undefined),
      location: {
        type: 'Point',
        coordinates: postGisCentroid, // [longitude, latitude]
      },
      boundary: postGisBoundary, // { type: 'Polygon', coordinates: [ [ [lon, lat], ... ] ] }
      status: 'active',
    };

    setLoading(true);

    try {
      const data = await createOwnerEstate(payload, token);
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 border-[#1F3D2C] bg-white shadow-none">
      <CardHeader className="py-4 border-b border-[#D7E6DD]">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-[#1F3D2C]">
              Register Estate
            </CardTitle>
            <CardDescription className="text-xs text-[#4B5563]">
              Pinpoint boundary locations on the Sri Lanka OpenStreetMap or enter coordinates manually.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-[#4B5563] hover:text-[#1F3D2C] p-1.5"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <Alert variant="error" title="Registration Alert">
              {errorMsg}
            </Alert>
          )}

          {untangledAlert && (
            <div className="bg-[#D7E6DD]/80 border border-[#1F3D2C] p-2.5 text-xs text-[#1F3D2C] flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#8C6239]" />
                Boundary lines automatically adjusted to form a clean, non-overlapping polygon shape.
              </span>
              <button
                type="button"
                onClick={() => setUntangledAlert(false)}
                className="text-[#1F3D2C] hover:text-black font-bold p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Basic Estate Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="estate-name" className="text-xs font-semibold text-[#1F2937]">
                Estate Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="estate-name"
                placeholder="e.g. Devon Valley Tea Estate"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="estate-code" className="text-xs font-semibold text-[#1F2937]">
                Estate Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="estate-code"
                placeholder="e.g. DVE-01"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="estate-crop" className="text-xs font-semibold text-[#1F2937]">
                Primary Cultivated Crop
              </Label>
              <select
                id="estate-crop"
                value={cropId}
                onChange={(e) => setCropId(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-[#D1D5DB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#1F3D2C] focus:ring-1 focus:ring-[#1F3D2C]"
              >
                {crops.length > 0 ? (
                  crops.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))
                ) : (
                  <option value="">Default Commercial Crop</option>
                )}
              </select>
            </div>
          </div>

          {/* Coordinate Options Selection Header */}
          <div className="border border-[#D7E6DD] bg-[#F8F9FA] p-3 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D7E6DD] pb-2.5">
              <div>
                <span className="text-xs font-bold text-[#1F3D2C] uppercase tracking-wide">
                  Polygon Boundary Input Method
                </span>
                <p className="text-[11px] text-[#4B5563]">
                  Use the map marker to pinpoint each corner or type coordinates manually:
                </p>
              </div>

              {/* Two Option Buttons / Tabs */}
              <div className="inline-flex border border-[#1F3D2C] p-0.5 bg-white">
                <button
                  type="button"
                  onClick={() => setCoordMode('map')}
                  className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    coordMode === 'map'
                      ? 'bg-[#1F3D2C] text-white'
                      : 'bg-white text-[#1F3D2C] hover:bg-[#D7E6DD]/40'
                  }`}
                >
                  <Map className="w-3.5 h-3.5" />
                  Option 1: Pinpoint on Map
                </button>
                <button
                  type="button"
                  onClick={() => setCoordMode('manual')}
                  className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    coordMode === 'manual'
                      ? 'bg-[#1F3D2C] text-white'
                      : 'bg-white text-[#1F3D2C] hover:bg-[#D7E6DD]/40'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Option 2: Enter Points Manually
                </button>
              </div>
            </div>

            {/* Option 1: Map Pinpointing Mode */}
            {coordMode === 'map' && (
              <div className="space-y-2 pt-1">
                <SriLankaPolygonMap
                  points={points}
                  onAddPoint={handleAddPoint}
                  onUpdatePoint={handleUpdatePoint}
                  onDeletePoint={handleDeletePoint}
                  onClearPoints={handleClearPoints}
                  height="380px"
                  interactive={true}
                />
              </div>
            )}

            {/* Option 2: Manual Vertex Points Entry Mode */}
            {coordMode === 'manual' && (
              <div className="space-y-3 pt-1">
                <div className="bg-white border border-[#D1D5DB] p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-2">
                    <div className="text-xs text-[#1F2937]">
                      <span className="font-semibold text-[#1F3D2C]">
                        Boundary Corner Coordinates:
                      </span>
                      <p className="text-[11px] text-[#6B7280]">
                        Enter coordinate values for each corner (at least 3 points required before save).
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setShowBulkPaste(!showBulkPaste)}
                        className="text-xs h-8 border-[#D1D5DB] text-[#1F3D2C] gap-1"
                      >
                        <ClipboardPaste className="w-3.5 h-3.5" />
                        {showBulkPaste ? 'Hide Bulk Paste' : 'Bulk Paste'}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          const last = points[points.length - 1] || {
                            lat: 6.9497,
                            lng: 80.7891,
                          };
                          handleAddPoint(
                            parseFloat((last.lat + 0.001).toFixed(6)),
                            parseFloat((last.lng + 0.001).toFixed(6)),
                          );
                        }}
                        className="bg-[#1F3D2C] text-white hover:bg-[#162D20] text-xs h-8 gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Point
                      </Button>
                    </div>
                  </div>

                  {/* Bulk Paste Box */}
                  {showBulkPaste && (
                    <div className="bg-[#F8F9FA] border border-[#D7E6DD] p-3 space-y-2">
                      <div className="text-xs font-semibold text-[#1F3D2C]">
                        Paste Coordinates (one pair per line: Latitude, Longitude):
                      </div>
                      <textarea
                        rows={4}
                        value={bulkText}
                        onChange={(e) => setBulkText(e.target.value)}
                        placeholder={`6.9555, 80.7852\n6.9568, 80.7915\n6.9512, 80.7938`}
                        className="w-full p-2 border border-[#D1D5DB] bg-white text-xs font-mono focus:outline-none focus:border-[#1F3D2C]"
                      />
                      {bulkError && (
                        <div className="text-[11px] text-red-600 font-medium">
                          ⚠️ {bulkError}
                        </div>
                      )}
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowBulkPaste(false)}
                          className="text-xs h-7"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleApplyBulkCoordinates}
                          className="bg-[#1F3D2C] text-white hover:bg-[#162D20] text-xs h-7"
                        >
                          Apply Coordinates
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Vertices List Table */}
                  {points.length === 0 ? (
                    <div className="text-center py-6 text-xs text-[#6B7280]">
                      No boundary points added yet. Click &quot;Add Point&quot; above or use Option 1 to pinpoint on the map.
                    </div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto border border-[#E5E7EB]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F8F9FA] text-[#1F3D2C] border-b border-[#E5E7EB] sticky top-0 font-semibold">
                          <tr>
                            <th className="p-2 w-12 text-center">#</th>
                            <th className="p-2">Latitude (°N)</th>
                            <th className="p-2">Longitude (°E)</th>
                            <th className="p-2 w-16 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                          {points.map((pt, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="p-2 text-center font-bold text-[#8C6239]">
                                {idx + 1}
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  step="any"
                                  value={pt.lat}
                                  onChange={(e) =>
                                    handleUpdatePoint(
                                      idx,
                                      parseFloat(e.target.value) || 0,
                                      pt.lng,
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-[#D1D5DB] text-xs font-mono focus:outline-none focus:border-[#1F3D2C]"
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  step="any"
                                  value={pt.lng}
                                  onChange={(e) =>
                                    handleUpdatePoint(
                                      idx,
                                      pt.lat,
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-[#D1D5DB] text-xs font-mono focus:outline-none focus:border-[#1F3D2C]"
                                />
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeletePoint(idx)}
                                  className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                  title="Remove point"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Switch to map preview */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
                    <span className="text-xs text-[#4B5563]">
                      Want to inspect and drag these boundary points on the map?
                    </span>
                    <button
                      type="button"
                      onClick={() => setCoordMode('map')}
                      className="text-xs text-[#1F3D2C] underline font-semibold hover:text-[#162D20] cursor-pointer"
                    >
                      View &amp; Adjust on Sri Lanka Map →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Prominent Automatic Land Area Calculation Display */}
            <div className="bg-white border-2 border-[#1F3D2C] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#8C6239]" />
                  <span className="text-xs font-bold text-[#1F3D2C] uppercase tracking-wide">
                    Approximate Land Area (Calculated Automatically):
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-heading text-[#1F3D2C]">
                    {points.length >= 3 ? `${formattedArea.acres} Acres` : '0.00 Acres'}
                  </span>
                  <span className="text-xs text-[#4B5563] font-medium">
                    {points.length >= 3
                      ? `(${formattedArea.hectares} Hectares • ${formattedArea.sqMeters} m²)`
                      : '(Requires at least 3 points)'}
                  </span>
                </div>
              </div>

              <div className="bg-[#D7E6DD]/40 border border-[#D7E6DD] px-3 py-2 text-xs text-[#1F3D2C] flex flex-col justify-center">
                <span className="font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#8C6239]" />
                  Boundary Status:
                </span>
                <span className="text-[11px] text-[#4B5563] mt-0.5">
                  {points.length >= 3 ? (
                    <span className="text-emerald-800 font-semibold">
                      ✅ {points.length} boundary points (Closed Shape)
                    </span>
                  ) : (
                    <span className="text-amber-800 font-semibold">
                      ⚠️ {points.length}/3 points added before save
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Validation Notice if less than 3 points */}
          {points.length < 3 && (
            <div className="bg-[#FEF3C7] border border-[#FDE68A] p-3 flex items-start gap-2.5 text-xs text-[#92400E]">
              <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
              <div>
                <strong>Minimum 3 Points Required:</strong> At least 3 boundary points are required to define an estate shape. Currently, you have added <strong>{points.length} point{points.length === 1 ? '' : 's'}</strong>. The &quot;Register Estate&quot; button will unlock once 3 points are added.
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#D7E6DD]">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="border-[#D1D5DB] text-[#4B5563] hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || points.length < 3}
              className={`px-6 gap-2 transition-all ${
                points.length < 3
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
                  : 'bg-[#1F3D2C] text-white hover:bg-[#162D20]'
              }`}
            >
              {loading
                ? 'Registering Estate...'
                : points.length < 3
                  ? `Add At Least 3 Points to Save (${points.length}/3)`
                  : `Register Estate (${points.length} Points, ${formattedArea.acres} Acres)`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
