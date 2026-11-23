import { NextResponse } from 'next/server';
import { MOCK_DONORS } from '@/lib/mockData';
import { isBloodCompatible } from '@/lib/matching/bloodCompatibility';
import { calculateHaversineDistance, computeMatchScore, estimateEmergencyETA } from '@/lib/matching/geoDistance';
import { BloodGroup } from '@/types';

export const dynamic = 'force-dynamic';

const REGIONAL_BLOOD_BANKS = [
  {
    id: 'FAC-01',
    name: 'Dhaka Medical College Blood Bank',
    address: 'Secretariat Rd, Shahbagh, Dhaka',
    phone: '+880 2 55165088',
    lat: 23.7259,
    lng: 90.3976,
    distanceKm: 1.8,
    etaMinutes: 6,
    stockStatus: 'Available Units On Standby',
    verified: true,
  },
  {
    id: 'FAC-02',
    name: 'Red Crescent Blood Center',
    address: '7/5 Aurangzeb Rd, Mohammadpur, Dhaka',
    phone: '+880 2 9116563',
    lat: 23.7588,
    lng: 90.3621,
    distanceKm: 3.4,
    etaMinutes: 11,
    stockStatus: 'Active Apheresis & Whole Blood',
    verified: true,
  },
  {
    id: 'FAC-03',
    name: 'Quantum Foundation Voluntary Blood Lab',
    address: '31/V Shilpacharya Zainul Abedin Rd, Shantinagar, Dhaka',
    phone: '+880 1714 010869',
    lat: 23.7384,
    lng: 90.4143,
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

    const baseLat = typeof lat === 'number' ? lat : 23.8103;
    const baseLng = typeof lng === 'number' ? lng : 90.4125;

    // Relative local distances for realistic regional proximity matching (1.2 km to 7.8 km)
    const localDonors = [
      {
        id: 'DNR-BD-01',
        fullName: 'Tanvir Hassan',
        bloodGroup: 'O-' as BloodGroup,
        contactNumber: '+880 1711 928374',
        email: 'tanvir.hassan@lifelinex.org',
        location: {
          lat: 23.8152,
          lng: 90.4074,
          address: 'Banani Model Town, Dhaka',
          city: 'Dhaka',
          country: 'Bangladesh',
        },
        distanceKm: 1.4,
        isAvailable: true,
        isVerified: true,
        cooldownEligible: true,
        totalDonations: 16,
        responseRatePercent: 98,
      },
      {
        id: 'DNR-BD-02',
        fullName: 'Rahim Ahmed',
        bloodGroup: 'O+' as BloodGroup,
        contactNumber: '+880 1819 238475',
        email: 'rahim.citizen@lifelinex.org',
        location: {
          lat: 23.7465,
          lng: 90.3762,
          address: 'Dhanmondi 27, Dhaka',
          city: 'Dhaka',
          country: 'Bangladesh',
        },
        distanceKm: 2.3,
        isAvailable: true,
        isVerified: true,
        cooldownEligible: true,
        totalDonations: 11,
        responseRatePercent: 94,
      },
      {
        id: 'DNR-BD-03',
        fullName: 'Nusrat Jahan',
        bloodGroup: 'A-' as BloodGroup,
        contactNumber: '+880 1912 384756',
        email: 'nusrat.jahan@healthnet.org',
        location: {
          lat: 23.7808,
          lng: 90.4192,
          address: 'Gulshan 1, Dhaka',
          city: 'Dhaka',
          country: 'Bangladesh',
        },
        distanceKm: 3.1,
        isAvailable: true,
        isVerified: true,
        cooldownEligible: true,
        totalDonations: 8,
        responseRatePercent: 92,
      },
      {
        id: 'DNR-BD-04',
        fullName: 'Arif Chowdhury',
        bloodGroup: 'B-' as BloodGroup,
        contactNumber: '+880 1611 748291',
        email: 'arif.chowdhury@lifelinex.org',
        location: {
          lat: 23.7925,
          lng: 90.4078,
          address: 'Mohakhali DOHS, Dhaka',
          city: 'Dhaka',
          country: 'Bangladesh',
        },
        distanceKm: 3.8,
        isAvailable: true,
        isVerified: true,
        cooldownEligible: true,
        totalDonations: 14,
        responseRatePercent: 96,
      },
      {
        id: 'DNR-BD-05',
        fullName: 'Dr. Sabrina Kabir',
        bloodGroup: 'AB-' as BloodGroup,
        contactNumber: '+880 1715 839201',
        email: 'dr.sabrina@dmch.edu.bd',
        location: {
          lat: 23.7340,
          lng: 90.3928,
          address: 'Bakhshibazar, Dhaka',
          city: 'Dhaka',
          country: 'Bangladesh',
        },
        distanceKm: 4.5,
        isAvailable: true,
        isVerified: true,
        cooldownEligible: true,
        totalDonations: 19,
        responseRatePercent: 99,
      },
      {
        id: 'DNR-BD-06',
        fullName: 'Farhan Kabir',
        bloodGroup: 'A+' as BloodGroup,
        contactNumber: '+880 1822 475839',
        email: 'farhan.k@biocare.org',
        location: {
          lat: 23.7508,
          lng: 90.3934,
          address: 'Kawran Bazar, Dhaka',
          city: 'Dhaka',
          country: 'Bangladesh',
        },
        distanceKm: 2.8,
        isAvailable: true,
        isVerified: true,
        cooldownEligible: true,
        totalDonations: 12,
        responseRatePercent: 90,
      },
      {
        id: 'DNR-BD-07',
        fullName: 'Sadia Rahman',
        bloodGroup: 'B+' as BloodGroup,
        contactNumber: '+880 1933 584920',
        email: 'sadia.rahman@rescue.org',
        location: {
          lat: 23.7634,
          lng: 90.4321,
          address: 'Rampura, Dhaka',
          city: 'Dhaka',
          country: 'Bangladesh',
        },
        distanceKm: 4.9,
        isAvailable: true,
        isVerified: true,
        cooldownEligible: true,
        totalDonations: 6,
        responseRatePercent: 88,
      },
      {
        id: 'DNR-BD-08',
        fullName: 'Kamrul Ahsan',
        bloodGroup: 'AB+' as BloodGroup,
        contactNumber: '+880 1724 958203',
        email: 'kamrul.ahsan@lifelinex.org',
        location: {
          lat: 23.8223,
          lng: 90.3654,
          address: 'Mirpur 10, Dhaka',
          city: 'Dhaka',
          country: 'Bangladesh',
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
