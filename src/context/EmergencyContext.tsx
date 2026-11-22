'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EmergencyIncident, BloodDonor, OperationalMetrics, IncidentStatus } from '@/types';
import { MOCK_INCIDENTS, MOCK_DONORS, INITIAL_METRICS } from '@/lib/mockData';
import { calculateHaversineDistance, computeMatchScore } from '@/lib/matching/geoDistance';
import { isBloodCompatible } from '@/lib/matching/bloodCompatibility';

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
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export function EmergencyProvider({ children }: { children: ReactNode }) {
  const [incidents, setIncidents] = useState<EmergencyIncident[]>(MOCK_INCIDENTS);
  const [donors, setDonors] = useState<BloodDonor[]>(MOCK_DONORS);
  const [metrics, setMetrics] = useState<OperationalMetrics>(INITIAL_METRICS);
  const [activeIncident, setActiveIncident] = useState<EmergencyIncident | null>(MOCK_INCIDENTS[0]);
  const [audioEnabled, setAudioEnabled] = useState(false);

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
