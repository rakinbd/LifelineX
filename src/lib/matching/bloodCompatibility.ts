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
