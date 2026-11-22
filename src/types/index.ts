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
  | 'CITIZEN'
  | 'BLOOD_DONOR'
  | 'VOLUNTEER_RESPONDER'
  | 'HOSPITAL_COORDINATOR'
  | 'DISPATCH_OPERATOR';

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

export interface BloodDonor {
  id: string;
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
