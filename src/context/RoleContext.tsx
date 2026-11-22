'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '@/types';

interface RoleContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  roleName: string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const ROLE_LABELS: Record<UserRole, { title: string; desc: string }> = {
  CITIZEN: {
    title: 'Citizen / Requester',
    desc: 'Public view with one-tap emergency SOS and live tracking'
  },
  BLOOD_DONOR: {
    title: 'Verified Blood Donor',
    desc: 'Donor availability, cooldown tracker & emergency appeals'
  },
  VOLUNTEER_RESPONDER: {
    title: 'First Responder / EMT',
    desc: 'Field incident dispatch, active missions & tactical alerts'
  },
  HOSPITAL_COORDINATOR: {
    title: 'Hospital Coordinator',
    desc: 'Trauma bed capacity, blood reserves & ambulance transit'
  },
  DISPATCH_OPERATOR: {
    title: 'Dispatch Supervisor (CAD)',
    desc: 'Master global incident command, AI triage & operator controls'
  }
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('DISPATCH_OPERATOR');

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setRole: setCurrentRole,
        roleName: ROLE_LABELS[currentRole].title,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
