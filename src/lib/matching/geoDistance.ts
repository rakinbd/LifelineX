/**
 * Haversine Formula for high-precision Great Circle distance calculation between two points on Earth.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // 1 decimal place precision
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Estimates emergency vehicle arrival time (ETA) based on distance and emergency speed profile.
 */
export function estimateEmergencyETA(distanceKm: number): number {
  // Average urban emergency speed ~ 45 km/h + 2 min dispatch mobilization
  const travelMinutes = (distanceKm / 45) * 60;
  return Math.max(3, Math.round(travelMinutes + 2));
}

/**
 * Computes a weighted matching score (0 to 100) for a responder.
 */
export function computeMatchScore({
  distanceKm,
  isCompatible,
  isAvailable,
  isVerified,
  responseRatePercent = 85,
}: {
  distanceKm: number;
  isCompatible: boolean;
  isAvailable: boolean;
  isVerified: boolean;
  responseRatePercent?: number;
}): number {
  if (!isCompatible || !isAvailable) return 0;

  // Weights:
  // Proximity: 40% (shorter distance = higher score)
  // Verification: 30%
  // Response history: 30%
  const proximityScore = Math.max(0, 100 - distanceKm * 3);
  const verificationScore = isVerified ? 100 : 40;
  const historyScore = responseRatePercent;

  const composite = 
    0.4 * proximityScore +
    0.3 * verificationScore +
    0.3 * historyScore;

  return Math.min(100, Math.max(10, Math.round(composite)));
}
