import { NextResponse } from 'next/server';
import { MOCK_DONORS } from '@/lib/mockData';
import { isBloodCompatible } from '@/lib/matching/bloodCompatibility';
import { calculateHaversineDistance, computeMatchScore, estimateEmergencyETA } from '@/lib/matching/geoDistance';
import { BloodGroup } from '@/types';

export const dynamic = 'force-dynamic';

const REGIONAL_BLOOD_BANKS = [
  {
    id: 'FAC-01',
    name: 'Johns Hopkins Hospital Transfusion Center',
    address: '1800 Orleans St, Baltimore, MD 21287',
    phone: '+1 (410) 955-5000',
    lat: 39.2974,
    lng: -76.5925,
    distanceKm: 1.8,
    etaMinutes: 6,
    stockStatus: 'Available Units On Standby',
    verified: true,
  },
  {
    id: 'FAC-02',
    name: 'American Red Cross Blood Services',
    address: '100 S Broadway, Baltimore, MD 21231',
    phone: '+1 (800) 733-2767',
    lat: 39.2892,
    lng: -76.5933,
    distanceKm: 3.4,
    etaMinutes: 11,
    stockStatus: 'Active Apheresis & Whole Blood',
    verified: true,
  },
  {
    id: 'FAC-03',
    name: 'Mount Sinai Hospital Blood Lab',
    address: '1 Gustave L. Levy Pl, New York, NY 10029',
    phone: '+1 (212) 241-6500',
    lat: 40.7900,
    lng: -73.9532,
    distanceKm: 4.2,
    etaMinutes: 14,
    stockStatus: 'Emergency Reserve Verified',
    verified: true,
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lat, lng, bloodGroup, hospitalName, unitsNeeded, patientName } = body;

    const baseLat = typeof lat === 'number' ? lat : 40.7128;
    const baseLng = typeof lng === 'number' ? lng : -74.0060;

    // Relative local distances for realistic regional proximity matching (1.2 km to 7.8 km)
    const localDonors = [
      {
        id: 'DNR-NA-01',
        fullName: 'Alexander Vance',
        bloodGroup: 'O-' as BloodGroup,
        contactNumber: '+1 (555) 234-8901',
        email: 'alexander.vance@lifelinex.org',
        location: {
          lat: 40.7128,
          lng: -74.0060,
          address: 'Manhattan, New York',
          city: 'New York',
          country: 'United States',
        },
        distanceKm: 1.4,
        isAvailable: true,
        isVerified: true,
        cooldownEligible: true,
        totalDonations: 16,
        responseRatePercent: 98,
      },
      {
        id: 'DNR-NA-02',
        fullName: 'Marcus Sterling',
        bloodGroup: 'O+' as BloodGroup,
        contactNumber: '+1 (555) 345-6789',
        email: 'marcus.sterling@lifelinex.org',
        location: {
          lat: 40.7282,
          lng: -73.9942,
          address: 'Greenwich Village, New York',
          city: 'New York',
          country: 'United States',
        },
        distanceKm: 2.3,
        isAvailable: true,
        isVerified: true,
        cooldownEligible: true,
        totalDonations: 11,
        responseRatePercent: 94,
      },
      {
        id: 'DNR-NA-03',
        fullName: 'Elena Rostova',
        bloodGroup: 'A-' as BloodGroup,
        contactNumber: '+1 (555) 456-7890',
        email: 'elena.rostova@healthnet.org',
        location: {
          lat: 40.7589,
          lng: -73.9851,
          address: 'Midtown, New York',
          city: 'New York',
          country: 'United States',
        },
        distanceKm: 3.1,
        isAvailable: true,
        isVerified: true,
        cooldownEligible: true,
        totalDonations: 8,
        responseRatePercent: 92,
      },
      {
        id: 'DNR-NA-04',
        fullName: 'David Chen',
        bloodGroup: 'B-' as BloodGroup,
        contactNumber: '+1 (555) 567-8901',
        email: 'david.chen@lifelinex.org',
        location: {
          lat: 40.7831,
          lng: -73.9712,
          address: 'Upper West Side, New York',
          city: 'New York',
          country: 'United States',
        },
        distanceKm: 3.8,
        isAvailable: true,
        isVerified: true,
        cooldownEligible: true,
        totalDonations: 14,
        responseRatePercent: 96,
      },
      {
        id: 'DNR-NA-05',
        fullName: 'Dr. Sarah Mitchell',
        bloodGroup: 'AB-' as BloodGroup,
        contactNumber: '+1 (555) 678-9012',
        email: 'sarah.mitchell@hopkinsmedicine.org',
        location: {
          lat: 39.2974,
          lng: -76.5925,
          address: 'Downtown Medical Campus, Baltimore',
          city: 'Baltimore',
          country: 'United States',
        },
        distanceKm: 4.5,
        isAvailable: true,
        isVerified: true,
        cooldownEligible: true,
        totalDonations: 19,
        responseRatePercent: 99,
      },
      {
        id: 'DNR-NA-06',
        fullName: 'Liam O’Connor',
        bloodGroup: 'A+' as BloodGroup,
        contactNumber: '+1 (555) 789-0123',
        email: 'liam.oconnor@biocare.org',
        location: {
          lat: 42.3601,
          lng: -71.0589,
          address: 'Back Bay, Boston',
          city: 'Boston',
          country: 'United States',
        },
        distanceKm: 2.8,
        isAvailable: true,
        isVerified: true,
        cooldownEligible: true,
        totalDonations: 12,
        responseRatePercent: 90,
      },
      {
        id: 'DNR-NA-07',
        fullName: 'Chloe Tremblay',
        bloodGroup: 'B+' as BloodGroup,
        contactNumber: '+1 (555) 890-1234',
        email: 'chloe.tremblay@rescue.org',
        location: {
          lat: 43.6532,
          lng: -79.3832,
          address: 'University Ave, Toronto',
          city: 'Toronto',
          country: 'Canada',
        },
        distanceKm: 4.9,
        isAvailable: true,
        isVerified: true,
        cooldownEligible: true,
        totalDonations: 6,
        responseRatePercent: 88,
      },
      {
        id: 'DNR-NA-08',
        fullName: 'Lucas Morales',
        bloodGroup: 'AB+' as BloodGroup,
        contactNumber: '+1 (555) 901-2345',
        email: 'lucas.morales@lifelinex.org',
        location: {
          lat: 39.9526,
          lng: -75.1652,
          address: 'Center City, Philadelphia',
          city: 'Philadelphia',
          country: 'United States',
        },
        distanceKm: 6.2,
        isAvailable: true,
        isVerified: true,
        cooldownEligible: true,
        totalDonations: 15,
        responseRatePercent: 95,
      },
    ];

    // Combine local pool with MOCK_DONORS
    const pool = [...localDonors, ...MOCK_DONORS.map((d, idx) => ({
      ...d,
      distanceKm: Math.round((idx * 0.8 + 2.1) * 10) / 10,
    }))];

    const matchedDonors = pool.map(donor => {
      const isCompatible = bloodGroup
        ? isBloodCompatible(donor.bloodGroup, bloodGroup as BloodGroup)
        : true;

      const eta = estimateEmergencyETA(donor.distanceKm);

      const score = computeMatchScore({
        distanceKm: donor.distanceKm,
        isCompatible,
        isAvailable: donor.isAvailable && donor.cooldownEligible,
        isVerified: donor.isVerified,
        responseRatePercent: donor.responseRatePercent,
      });

      return {
        ...donor,
        isCompatible,
        etaMinutes: eta,
        transitTime: `${eta} mins transit`,
        matchScore: score,
        compatibilityNote: isCompatible
          ? donor.bloodGroup === bloodGroup
            ? 'Exact Biological Match (100%)'
            : 'Compatible Donor Cross-Match'
          : 'Incompatible Antigen Profile',
      };
    })
    .filter(d => d.isCompatible && d.cooldownEligible)
    .sort((a, b) => b.matchScore - a.matchScore);

    const facilities = REGIONAL_BLOOD_BANKS.map(fac => ({
      ...fac,
      distanceKm: Math.round(fac.distanceKm * 10) / 10,
    }));

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      requestedGroup: bloodGroup,
      hospitalName: hospitalName || 'Emergency Medical Center',
      patientName: patientName || 'Emergency Patient',
      unitsNeeded: unitsNeeded || 1,
      donorsCount: matchedDonors.length,
      compatibleCount: matchedDonors.length,
      donors: matchedDonors.slice(0, 8),
      facilities,
      scanStats: {
        scannedRadiusKm: 15,
        totalDonorsInPool: pool.length,
        activeDonorsNotified: matchedDonors.length,
        estimatedResponseMin: matchedDonors[0]?.etaMinutes || 8,
        fastestDonor: matchedDonors[0]?.fullName || 'Tanvir Hassan',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to compute matching algorithm', details: (error as Error).message },
      { status: 500 }
    );
  }
}
