export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type IncidentCategory = 
  | 'TRAUMA_ACCIDENT'
  | 'BLOOD_TRANSFUSION'
  | 'AMBULANCE_TRANSIT'
  | 'CRITICAL_MEDICAL'
  | 'DISASTER_RESCUE';

export type IncidentStatus = 
  | 'REPORTED'
  | 'TRIAGED'
  | 'MATCHING'
  | 'DISPATCHED'
  | 'EN_ROUTE'
  | 'ON_SCENE'
  | 'RESOLVED';

export type BloodGroup = 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+';

export type UserRole = 
  | 'USER'
  | 'ADMIN'
  | 'BLOOD_ADMIN'
  | 'HOSPITAL_ADMIN'
  | 'DISPATCH_ADMIN'
  | 'SUPER_ADMIN'
  | 'CITIZEN'
  | 'BLOOD_DONOR'
  | 'HOSPITAL_COORDINATOR'
  | 'DISPATCH_OPERATOR';

export interface UserPermissions {
  bloodManagement: boolean;     // Manage blood appeals, mobilize donors, verify donors
  hospitalManagement: boolean;  // Update ICU beds, dispatch ambulances, manage hospital inventory
  dispatchManagement: boolean;  // Triage emergencies, change incident statuses, assign emergency teams
  userManagement: boolean;      // Admin Access Management: Grant/revoke feature access to other users
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  permissions: UserPermissions;
  bloodGroup?: BloodGroup;
  facilityName?: string;
  badgeId?: string;
  createdAt?: string;
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
  fuzzyRadiusKm?: number; // Obfuscated for privacy protection
}

export interface EmergencyIncident {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;
  urgency: UrgencyLevel;
  urgencyScore: number; // 0 - 100
  status: IncidentStatus;
  location: LocationCoordinates;
  requiredBloodGroup?: BloodGroup;
  unitsNeeded?: number;
  requesterName: string;
  requesterContact: string;
  isVoiceInput?: boolean;
  aiExtracted: {
    keySymptoms: string[];
    suggestedAction: string;
    duplicateRiskScore: number; // 0 - 1
    triageConfidence: number; // 0 - 1
  };
  matchedRespondersCount: number;
  assignedResponderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DonationRecord {
  id: string;
  donorId: string;
  donationDate: string; // ISO date or YYYY-MM-DD
  facilityName: string; // Hospital or Blood Bank
  unitsDonated: number;
  notes?: string;
  verifiedBy?: string;
  createdAt: string;
}

export interface BloodDonor {
  id: string;
  userId?: string;
  fullName: string;
  bloodGroup: BloodGroup;
  contactNumber: string;
  email: string;
  location: LocationCoordinates;
  isAvailable: boolean;
  isVerified: boolean;
  lastDonationDate: string; // ISO date
  cooldownEligible: boolean;
  totalDonations: number;
  responseRatePercent: number;
  distanceKm?: number;
  matchScore?: number;
  donationHistory?: DonationRecord[];
  avatarUrl?: string;
  bio?: string;
}

export interface EmergencyFacility {
  id: string;
  name: string;
  type: 'TRAUMA_CENTER' | 'GENERAL_HOSPITAL' | 'BLOOD_BANK' | 'DISASTER_SHELTER';
  location: LocationCoordinates;
  emergencyHotline: string;
  availableBeds: number;
  icuAvailable: boolean;
  bloodInventory: Partial<Record<BloodGroup, number>>; // units available
  ambulancesAvailable: number;
  isOperational: boolean;
}

export interface VolunteerResponder {
  id: string;
  name: string;
  skills: ('EMT_BASIC' | 'PARAMEDIC' | 'CPR_CERTIFIED' | 'WATER_RESCUE' | 'DISASTER_LOGISTICS')[];
  badgeLevel: 'BRONZE' | 'SILVER' | 'GOLD';
  isAvailable: boolean;
  location: LocationCoordinates;
  activeMissionId?: string;
  completedMissions: number;
  averageResponseMinutes: number;
}

export interface OperationalMetrics {
  activeIncidents: number;
  criticalCases: number;
  registeredDonors: number;
  activeResponders: number;
  averageResponseTimeMinutes: number;
  livesImpactedTotal: number;
  bloodUnitsDispatched: number;
}
