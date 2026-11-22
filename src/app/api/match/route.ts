import { NextResponse } from 'next/server';
import { MOCK_DONORS, MOCK_FACILITIES } from '@/lib/mockData';
import { isBloodCompatible } from '@/lib/matching/bloodCompatibility';
import { calculateHaversineDistance, computeMatchScore } from '@/lib/matching/geoDistance';
import { BloodGroup } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lat, lng, bloodGroup } = body;

    const baseLat = typeof lat === 'number' ? lat : 40.73061;
    const baseLng = typeof lng === 'number' ? lng : -73.935242;

    const matchedDonors = MOCK_DONORS.map(donor => {
      const distance = calculateHaversineDistance(
        baseLat,
        baseLng,
        donor.location.lat,
        donor.location.lng
      );

      const isCompatible = bloodGroup
        ? isBloodCompatible(donor.bloodGroup, bloodGroup as BloodGroup)
        : true;

      const score = computeMatchScore({
        distanceKm: distance,
        isCompatible,
        isAvailable: donor.isAvailable && donor.cooldownEligible,
        isVerified: donor.isVerified,
        responseRatePercent: donor.responseRatePercent,
      });

      return {
        ...donor,
        distanceKm: distance,
        matchScore: score,
      };
    })
    .filter(d => d.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);

    const facilities = MOCK_FACILITIES.map(fac => ({
      ...fac,
      distanceKm: calculateHaversineDistance(baseLat, baseLng, fac.location.lat, fac.location.lng),
    })).sort((a, b) => a.distanceKm - b.distanceKm);

    return NextResponse.json({
      success: true,
      donorsCount: matchedDonors.length,
      donors: matchedDonors,
      facilities,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to compute matching algorithm', details: (error as Error).message },
      { status: 500 }
    );
  }
}
