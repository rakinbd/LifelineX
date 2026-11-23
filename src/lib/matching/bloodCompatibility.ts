import { BloodGroup } from '@/types';

/**
 * Universal Blood Compatibility Matrix according to international transfusion protocols (AABB / WHO).
 * 
 * Rules:
 * - O- is the Universal Red Cell Donor (can donate to anyone).
 * - AB+ is the Universal Red Cell Recipient (can receive from anyone).
 * - Rh- can donate to Rh+ and Rh-, but Rh+ can only donate to Rh+.
 */
export const BLOOD_COMPATIBILITY_TABLE: Record<BloodGroup, {
  canDonateTo: BloodGroup[];
  canReceiveFrom: BloodGroup[];
}> = {
  'O-': {
    canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-']
  },
  'O+': {
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O-', 'O+']
  },
  'A-': {
    canDonateTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-', 'A-']
  },
  'A+': {
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+']
  },
  'B-': {
    canDonateTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-', 'B-']
  },
  'B+': {
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['O-', 'O+', 'B-', 'B+']
  },
  'AB-': {
    canDonateTo: ['AB-', 'AB+'],
    canReceiveFrom: ['O-', 'A-', 'B-', 'AB-']
  },
  'AB+': {
    canDonateTo: ['AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
  }
};

/**
 * Checks if a donor with `donorGroup` can legally give blood to a patient with `recipientGroup`.
 */
export function isBloodCompatible(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  const recipientAllowed = BLOOD_COMPATIBILITY_TABLE[recipientGroup]?.canReceiveFrom || [];
  return recipientAllowed.includes(donorGroup);
}

/**
 * Calculates days remaining in 90-day cooldown period.
 */
export function getCooldownDaysRemaining(lastDonationIso: string): number {
  const lastDate = new Date(lastDonationIso).getTime();
  const now = new Date().getTime();
  const elapsedDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
  const remaining = 90 - elapsedDays;
  return remaining > 0 ? remaining : 0;
}

export interface CooldownDetails {
  daysElapsed: number;
  daysRemaining: number;
  recoveryPercent: number;
  isEligible: boolean;
  eligibleDate: Date;
  eligibleDateFormatted: string;
  lastDonationFormatted: string;
}

export function calculateCooldownDetails(lastDonationIso: string): CooldownDetails {
  const lastDate = new Date(lastDonationIso);
  const lastTime = lastDate.getTime();
  const now = new Date().getTime();
  
  // 90 days in ms
  const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
  const eligibleDate = new Date(lastTime + NINETY_DAYS_MS);
  
  const daysElapsed = Math.max(0, Math.floor((now - lastTime) / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(0, 90 - daysElapsed);
  const recoveryPercent = Math.min(100, Math.round(((90 - daysRemaining) / 90) * 100));
  const isEligible = daysRemaining === 0;

  const eligibleDateFormatted = eligibleDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const lastDonationFormatted = lastDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return {
    daysElapsed,
    daysRemaining,
    recoveryPercent,
    isEligible,
    eligibleDate,
    eligibleDateFormatted,
    lastDonationFormatted,
  };
}
