/**
 * Geodesic and PostGIS geometry utilities for Sri Lanka estate mapping
 */

// Earth radius in meters (WGS84 ellipsoid mean radius)
const EARTH_RADIUS = 6378137;

/**
 * Calculates the geodesic surface area of a polygon on Earth's surface (in square meters)
 * using the spherical excess algorithm.
 * @param {Array<{lat: number, lng: number}>} points
 * @returns {number} area in square meters
 */
export function calculateGeodesicArea(points) {
  if (!points || points.length < 3) return 0;

  // Filter and normalize points
  const valid = points
    .map((p) => {
      const lat = typeof p.lat === 'number' ? p.lat : parseFloat(p.lat);
      const lng = typeof p.lng === 'number' ? p.lng : parseFloat(p.lng);
      return { lat, lng };
    })
    .filter((p) => !isNaN(p.lat) && !isNaN(p.lng));

  if (valid.length < 3) return 0;

  // If first and last point are identical, strip the duplicate closing point for the formula
  const n =
    valid.length > 3 &&
    Math.abs(valid[0].lat - valid[valid.length - 1].lat) < 1e-7 &&
    Math.abs(valid[0].lng - valid[valid.length - 1].lng) < 1e-7
      ? valid.length - 1
      : valid.length;

  let total = 0;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const lat1 = (valid[i].lat * Math.PI) / 180;
    const lat2 = (valid[j].lat * Math.PI) / 180;
    const dLng = ((valid[j].lng - valid[i].lng) * Math.PI) / 180;

    total += dLng * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  const areaSqMeters = Math.abs((total * EARTH_RADIUS * EARTH_RADIUS) / 2);
  return areaSqMeters;
}

/**
 * Format square meters into Acres, Hectares, and square meters
 * 1 acre = 4046.8564224 square meters
 * 1 hectare = 10,000 square meters
 */
export function formatArea(sqMeters) {
  if (!sqMeters || isNaN(sqMeters) || sqMeters <= 0) {
    return {
      acres: '0.00',
      hectares: '0.00',
      sqMeters: '0',
      displayText: '0.00 Acres (0.00 Hectares)',
    };
  }

  const acres = sqMeters / 4046.8564224;
  const hectares = sqMeters / 10000;

  return {
    acres: acres.toFixed(2),
    hectares: hectares.toFixed(2),
    sqMeters: Math.round(sqMeters).toLocaleString(),
    displayText: `${acres.toFixed(2)} Acres (${hectares.toFixed(2)} Ha / ${Math.round(sqMeters).toLocaleString()} m²)`,
  };
}

/**
 * Computes polygon centroid [longitude, latitude] for PostGIS Point
 */
export function calculatePolygonCentroid(points) {
  if (!points || points.length === 0) return [80.7718, 7.8731];

  const valid = points
    .map((p) => ({
      lat: typeof p.lat === 'number' ? p.lat : parseFloat(p.lat),
      lng: typeof p.lng === 'number' ? p.lng : parseFloat(p.lng),
    }))
    .filter((p) => !isNaN(p.lat) && !isNaN(p.lng));

  if (valid.length === 0) return [80.7718, 7.8731];

  let sumLat = 0;
  let sumLng = 0;

  valid.forEach((p) => {
    sumLat += p.lat;
    sumLng += p.lng;
  });

  return [
    parseFloat((sumLng / valid.length).toFixed(6)),
    parseFloat((sumLat / valid.length).toFixed(6)),
  ];
}

/**
 * Builds valid GeoJSON Polygon with closed linear ring coordinates: number[][][]
 * PostGIS requirement: [ [ [lon, lat], [lon, lat], ..., [lon_first, lat_first] ] ]
 */
export function buildPostGisPolygon(points) {
  const valid = points
    .map((p) => ({
      lat: typeof p.lat === 'number' ? p.lat : parseFloat(p.lat),
      lng: typeof p.lng === 'number' ? p.lng : parseFloat(p.lng),
    }))
    .filter((p) => !isNaN(p.lat) && !isNaN(p.lng));

  if (valid.length < 3) return null;

  const ring = valid.map((p) => [
    parseFloat(p.lng.toFixed(6)),
    parseFloat(p.lat.toFixed(6)),
  ]);

  // Ensure closed ring (first coordinate equals last coordinate)
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([first[0], first[1]]);
  }

  return {
    type: 'Polygon',
    coordinates: [ring],
  };
}

/**
 * Test whether segment (p1, p2) and (p3, p4) strictly intersect
 */
function segmentsIntersect(p1, p2, p3, p4) {
  function ccw(a, b, c) {
    return (c.lat - a.lat) * (b.lng - a.lng) > (b.lat - a.lat) * (c.lng - a.lng);
  }

  const isSame13 = Math.abs(p1.lat - p3.lat) < 1e-7 && Math.abs(p1.lng - p3.lng) < 1e-7;
  const isSame14 = Math.abs(p1.lat - p4.lat) < 1e-7 && Math.abs(p1.lng - p4.lng) < 1e-7;
  const isSame23 = Math.abs(p2.lat - p3.lat) < 1e-7 && Math.abs(p2.lng - p3.lng) < 1e-7;
  const isSame24 = Math.abs(p2.lat - p4.lat) < 1e-7 && Math.abs(p2.lng - p4.lng) < 1e-7;
  if (isSame13 || isSame14 || isSame23 || isSame24) return false;

  return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
}

/**
 * Checks if the polygon has any crossing/overlapping boundary edges
 */
export function hasOverlappingLines(points) {
  if (!points || points.length < 4) return false;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    for (let j = i + 2; j < n; j++) {
      if ((j + 1) % n === i) continue;
      const p3 = points[j];
      const p4 = points[(j + 1) % n];
      if (segmentsIntersect(p1, p2, p3, p4)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Automatically untangles overlapping/self-intersecting polygon lines
 * into a valid non-overlapping boundary shape.
 */
export function untanglePolygon(points) {
  if (!points || points.length < 4) return points;

  let pts = [...points];
  const n = pts.length;
  let improved = true;
  let iterations = 0;

  // 2-opt untangling algorithm
  while (improved && iterations < 40) {
    improved = false;
    iterations++;

    for (let i = 0; i < n; i++) {
      for (let j = i + 2; j < n; j++) {
        if ((j + 1) % n === i) continue;

        const p1 = pts[i];
        const p2 = pts[(i + 1) % n];
        const p3 = pts[j];
        const p4 = pts[(j + 1) % n];

        if (segmentsIntersect(p1, p2, p3, p4)) {
          // Reverse sub-array between i+1 and j to untangle the cross
          const sub = pts.slice(i + 1, j + 1).reverse();
          pts = [...pts.slice(0, i + 1), ...sub, ...pts.slice(j + 1)];
          improved = true;
          break;
        }
      }
      if (improved) break;
    }
  }

  // If complex overlapping remains, sort vertices radially around centroid
  if (hasOverlappingLines(pts)) {
    const centerLat = pts.reduce((sum, p) => sum + p.lat, 0) / n;
    const centerLng = pts.reduce((sum, p) => sum + p.lng, 0) / n;
    pts = pts.slice().sort((a, b) => {
      const angleA = Math.atan2(a.lat - centerLat, a.lng - centerLng);
      const angleB = Math.atan2(b.lat - centerLat, b.lng - centerLng);
      return angleA - angleB;
    });
  }

  return pts;
}

/**
 * Sample realistic estate boundary polygons in Sri Lanka
 */
export const SAMPLE_SRI_LANKA_ESTATES = [
  {
    name: 'Nuwara Eliya High-Grown Tea Plot',
    region: 'Nuwara Eliya',
    center: [6.952, 80.788],
    points: [
      { lat: 6.9555, lng: 80.7852 },
      { lat: 6.9568, lng: 80.7915 },
      { lat: 6.9512, lng: 80.7938 },
      { lat: 6.9485, lng: 80.7874 },
    ],
  },
  {
    name: 'Kandy Mid-Grown Estate Cadastre',
    region: 'Kandy / Peradeniya',
    center: [7.288, 80.625],
    points: [
      { lat: 7.2925, lng: 80.6215 },
      { lat: 7.2942, lng: 80.6288 },
      { lat: 7.2878, lng: 80.6312 },
      { lat: 7.2845, lng: 80.6241 },
    ],
  },
  {
    name: 'Hatton / Maskeliya Valley Plot',
    region: 'Hatton',
    center: [6.895, 80.598],
    points: [
      { lat: 6.8985, lng: 80.5942 },
      { lat: 6.9012, lng: 80.6025 },
      { lat: 6.8935, lng: 80.6051 },
      { lat: 6.8905, lng: 80.5975 },
    ],
  },
  {
    name: 'Ratnapura Rubber / Low-Grown Plot',
    region: 'Ratnapura',
    center: [6.685, 80.405],
    points: [
      { lat: 6.6912, lng: 80.4012 },
      { lat: 6.6935, lng: 80.4105 },
      { lat: 6.6825, lng: 80.4128 },
      { lat: 6.6795, lng: 80.4035 },
    ],
  },
];
