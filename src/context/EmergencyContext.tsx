'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EmergencyIncident, BloodDonor, OperationalMetrics, IncidentStatus, DonationRecord, BloodGroup } from '@/types';
import { MOCK_INCIDENTS, MOCK_DONORS, INITIAL_METRICS } from '@/lib/mockData';
import { calculateHaversineDistance, computeMatchScore } from '@/lib/matching/geoDistance';
import { isBloodCompatible } from '@/lib/matching/bloodCompatibility';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  user: string;
  severity: 'INFO' | 'WARNING' | 'ALERT';
}

interface EmergencyContextType {
  incidents: EmergencyIncident[];
  donors: BloodDonor[];
  metrics: OperationalMetrics;
  activeIncident: EmergencyIncident | null;
  setActiveIncident: (incident: EmergencyIncident | null) => void;
  getIncidentById: (id: string) => EmergencyIncident | undefined;
  createEmergency: (incident: Omit<EmergencyIncident, 'id' | 'createdAt' | 'updatedAt' | 'matchedRespondersCount'>) => EmergencyIncident;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  getMatchingDonors: (incident: EmergencyIncident) => (BloodDonor & { distanceKm: number; matchScore: number })[];
  playAlertSound: () => void;
  audioEnabled: boolean;
  setAudioEnabled: (val: boolean) => void;
  logDonorDonation: (
    donorIdOrUserId: string,
    donation: {
      donationDate: string;
      facilityName: string;
      unitsDonated: number;
      notes?: string;
    }
  ) => void;
  getDonorForUser: (userId?: string, name?: string) => BloodDonor | undefined;
  updateDonorCooldown: (donorId: string, isEligible: boolean) => void;
  addDonor: (donorData: {
    fullName: string;
    bloodGroup: BloodGroup;
    contactNumber: string;
    email: string;
    userId?: string;
    city?: string;
    address?: string;
    lastDonationDate?: string;
  }) => BloodDonor;
  verifyDonor: (donorId: string, approve: boolean) => void;
  deleteIncident: (id: string) => void;
  boostIncident: (id: string) => void;
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, details: string, actor?: string, severity?: 'INFO' | 'WARNING' | 'ALERT') => void;
}

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-301',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    action: 'EMERGENCY_BROADCAST',
    details: 'Mass alert broadcasted to 6 B+ and O+ eligible donors for INC-8482',
    user: 'System Admin',
    severity: 'INFO'
  },
  {
    id: 'LOG-300',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    action: 'DONOR_VERIFIED',
    details: 'Verified donor Alexander Vance (O-) after screening clearance',
    user: 'Admin Moderator',
    severity: 'INFO'
  },
  {
    id: 'LOG-299',
    timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    action: 'CONTACT_VIEWED',
    details: 'Emergency coordinator hotline accessed for DMCH appeal INC-8491',
    user: 'Standard Member',
    severity: 'INFO'
  },
  {
    id: 'LOG-298',
    timestamp: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    action: 'REQUEST_SUBMITTED',
    details: 'Patient blood appeal INC-8495 submitted by Kurmitola General Hospital',
    user: 'Hospital Coordinator',
    severity: 'INFO'
  },
  {
    id: 'LOG-297',
    timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    action: 'SECURITY_ALERT',
    details: 'Suspicious duplicate request attempt flagged and blocked from IP 103.22.45.12',
    user: 'System Security',
    severity: 'WARNING'
  }
];

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export function EmergencyProvider({ children }: { children: ReactNode }) {
  const [incidents, setIncidents] = useState<EmergencyIncident[]>(MOCK_INCIDENTS);
  const [donors, setDonors] = useState<BloodDonor[]>(MOCK_DONORS);
  const [metrics, setMetrics] = useState<OperationalMetrics>(INITIAL_METRICS);
  const [activeIncident, setActiveIncident] = useState<EmergencyIncident | null>(MOCK_INCIDENTS[0]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const addAuditLog = (
    action: string,
    details: string,
    actor = 'Admin Moderator',
    severity: 'INFO' | 'WARNING' | 'ALERT' = 'INFO'
  ) => {
    const newLog: AuditLogEntry = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      user: actor,
      severity,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const verifyDonor = (donorId: string, approve: boolean) => {
    const targetDonor = donors.find(d => d.id === donorId);
    if (approve) {
      setDonors(prev =>
        prev.map(d => (d.id === donorId ? { ...d, isVerified: true } : d))
      );
      addAuditLog(
        'DONOR_VERIFIED',
        `Approved and granted verified credential to donor ${targetDonor?.fullName || donorId} (${targetDonor?.bloodGroup || 'Blood Donor'})`,
        'Admin Moderator',
        'INFO'
      );
      playAlertSound();
    } else {
      setDonors(prev => prev.filter(d => d.id !== donorId));
      addAuditLog(
        'DONOR_REJECTED',
        `Rejected and dismissed unverified donor application for ${targetDonor?.fullName || donorId}`,
        'Admin Moderator',
        'WARNING'
      );
    }
  };

  const deleteIncident = (id: string) => {
    const incident = incidents.find(i => i.id === id);
    setIncidents(prev => prev.filter(i => i.id !== id));
    if (activeIncident && activeIncident.id === id) {
      setActiveIncident(null);
    }
    addAuditLog(
      'INCIDENT_DELETED',
      `Flagged as spam and removed request ${id} (${incident?.title || 'Blood appeal'})`,
      'Admin Moderator',
      'WARNING'
    );
  };

  const boostIncident = (id: string) => {
    const incident = incidents.find(i => i.id === id);
    playAlertSound();
    addAuditLog(
      'EMERGENCY_BOOST',
      `High-priority mass dispatch alert boosted for appeal ${id} (${incident?.requiredBloodGroup || 'Blood'} at ${incident?.location.address || 'Hospital'})`,
      'Admin Moderator',
      'ALERT'
    );
  };

  // Web Audio API Emergency Alert tone
  const playAlertSound = () => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio muted or not supported
    }
  };

  const getIncidentById = (id: string): EmergencyIncident | undefined => {
    return incidents.find(i => i.id.toLowerCase() === id.toLowerCase());
  };

  const createEmergency = (
    data: Omit<EmergencyIncident, 'id' | 'createdAt' | 'updatedAt' | 'matchedRespondersCount'>
  ): EmergencyIncident => {
    const id = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    
    const newIncident: EmergencyIncident = {
      ...data,
      id,
      matchedRespondersCount: 4,
      createdAt: now,
      updatedAt: now,
    };

    setIncidents(prev => [newIncident, ...prev]);
    setActiveIncident(newIncident);
    setMetrics(prev => ({
      ...prev,
      activeIncidents: prev.activeIncidents + 1,
      criticalCases: data.urgency === 'CRITICAL' ? prev.criticalCases + 1 : prev.criticalCases,
    }));

    playAlertSound();
    return newIncident;
  };

  const updateIncidentStatus = (id: string, status: IncidentStatus) => {
    setIncidents(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );

    if (activeIncident && activeIncident.id === id) {
      setActiveIncident(prev => prev ? { ...prev, status, updatedAt: new Date().toISOString() } : null);
    }

    if (status === 'RESOLVED') {
      setMetrics(prev => ({
        ...prev,
        activeIncidents: Math.max(0, prev.activeIncidents - 1),
        livesImpactedTotal: prev.livesImpactedTotal + 1,
      }));
    }
  };

  const getMatchingDonors = (incident: EmergencyIncident) => {
    return donors.map(donor => {
      const distance = calculateHaversineDistance(
        incident.location.lat,
        incident.location.lng,
        donor.location.lat,
        donor.location.lng
      );

      const isCompatible = incident.requiredBloodGroup
        ? isBloodCompatible(donor.bloodGroup, incident.requiredBloodGroup)
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
  };

  const getDonorForUser = (userId?: string, name?: string): BloodDonor | undefined => {
    if (!userId && !name) return undefined;
    return donors.find(d => 
      (userId && d.userId === userId) ||
      (userId && d.id === userId) ||
      (name && d.fullName.toLowerCase() === name.toLowerCase())
    );
  };

  const updateDonorCooldown = (donorId: string, isEligible: boolean) => {
    setDonors(prev =>
      prev.map(d => {
        if (d.id === donorId || d.userId === donorId) {
          return {
            ...d,
            cooldownEligible: isEligible,
            isAvailable: isEligible,
          };
        }
        return d;
      })
    );
  };

  const addDonor = (donorData: {
    fullName: string;
    bloodGroup: BloodGroup;
    contactNumber: string;
    email: string;
    userId?: string;
    city?: string;
    address?: string;
    lastDonationDate?: string;
  }): BloodDonor => {
    const newId = `DNR-${Math.floor(100 + Math.random() * 900)}`;
    const lastDate = donorData.lastDonationDate || new Date().toISOString();
    const donTime = new Date(lastDate).getTime();
    const daysElapsed = Math.floor((Date.now() - donTime) / (1000 * 60 * 60 * 24));
    const isEligible = daysElapsed >= 90;

    const newDonor: BloodDonor = {
      id: newId,
      userId: donorData.userId,
      fullName: donorData.fullName,
      bloodGroup: donorData.bloodGroup,
      contactNumber: donorData.contactNumber,
      email: donorData.email,
      location: {
        lat: 23.8103,
        lng: 90.4125,
        address: donorData.address || `${donorData.city || 'Dhanmondi, Dhaka'}, Bangladesh`,
        city: donorData.city || 'Dhaka',
        country: 'Bangladesh',
      },
      isAvailable: isEligible,
      isVerified: true,
      lastDonationDate: lastDate,
      cooldownEligible: isEligible,
      totalDonations: 0,
      responseRatePercent: 100,
      donationHistory: [],
    };

    setDonors(prev => [newDonor, ...prev]);
    setMetrics(prev => ({
      ...prev,
      registeredDonors: prev.registeredDonors + 1,
    }));
    return newDonor;
  };

  const logDonorDonation = (
    donorIdOrUserId: string,
    donation: {
      donationDate: string;
      facilityName: string;
      unitsDonated: number;
      notes?: string;
    }
  ) => {
    const newRecordId = `DON-${Math.floor(100 + Math.random() * 900)}`;
    const nowIso = new Date().toISOString();
    
    // Check cooldown for the new donation date (90 days)
    const donTime = new Date(donation.donationDate).getTime();
    const currentTime = Date.now();
    const daysElapsed = Math.floor((currentTime - donTime) / (1000 * 60 * 60 * 24));
    const isEligible = daysElapsed >= 90;

    const newRecord: DonationRecord = {
      id: newRecordId,
      donorId: donorIdOrUserId,
      donationDate: donation.donationDate,
      facilityName: donation.facilityName,
      unitsDonated: donation.unitsDonated,
      notes: donation.notes,
      verifiedBy: 'Community Medical Officer',
      createdAt: nowIso,
    };

    setDonors(prev =>
      prev.map(d => {
        if (
          d.id === donorIdOrUserId || 
          d.userId === donorIdOrUserId || 
          d.fullName.toLowerCase() === donorIdOrUserId.toLowerCase()
        ) {
          const currentHistory = d.donationHistory || [];
          return {
            ...d,
            totalDonations: d.totalDonations + donation.unitsDonated,
            lastDonationDate: donation.donationDate,
            cooldownEligible: isEligible,
            isAvailable: isEligible,
            donationHistory: [newRecord, ...currentHistory],
          };
        }
        return d;
      })
    );

    setMetrics(prev => ({
      ...prev,
      bloodUnitsDispatched: prev.bloodUnitsDispatched + donation.unitsDonated,
      livesImpactedTotal: prev.livesImpactedTotal + (donation.unitsDonated * 3),
    }));

    playAlertSound();
  };

  return (
    <EmergencyContext.Provider
      value={{
        incidents,
        donors,
        metrics,
        activeIncident,
        setActiveIncident,
        getIncidentById,
        createEmergency,
        updateIncidentStatus,
        getMatchingDonors,
        playAlertSound,
        audioEnabled,
        setAudioEnabled,
        logDonorDonation,
        getDonorForUser,
        updateDonorCooldown,
        addDonor,
        verifyDonor,
        deleteIncident,
        boostIncident,
        auditLogs,
        addAuditLog,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
}
