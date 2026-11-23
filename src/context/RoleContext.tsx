'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '@/types';

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  bloodGroup?: string;
  facilityName?: string;
  badgeId?: string;
}

interface RoleContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  roleName: string;
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (profile: Partial<UserProfile> & { role: UserRole }) => void;
  register: (profile: UserProfile) => void;
  logout: () => void;
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
  HOSPITAL_COORDINATOR: {
    title: 'Hospital Coordinator',
    desc: 'Trauma bed capacity, blood reserves & ambulance transit'
  },
  DISPATCH_OPERATOR: {
    title: 'Dispatch Supervisor (Alert System)',
    desc: 'Master global incident command, AI Help Check & operator controls'
  }
};

const DEFAULT_USERS: Record<UserRole, UserProfile> = {
  CITIZEN: {
    name: 'Rahim Ahmed',
    email: 'rahim.citizen@lifelink.org',
    phone: '+1 (555) 019-9922',
    role: 'CITIZEN',
  },
  BLOOD_DONOR: {
    name: 'David Reynolds',
    email: 'david.o-neg@lifelink.org',
    phone: '+1 (555) 234-8899',
    role: 'BLOOD_DONOR',
    bloodGroup: 'O-',
  },
  HOSPITAL_COORDINATOR: {
    name: 'Dr. Sarah Connor',
    email: 'dr.connor@metrotrauma.org',
    role: 'HOSPITAL_COORDINATOR',
    facilityName: 'Metropolitan Level-1 Trauma Center',
  },
  DISPATCH_OPERATOR: {
    name: 'Captain Marcus Vance',
    email: 'cad.ops04@lifelink.org',
    role: 'DISPATCH_OPERATOR',
    badgeId: 'ALERT-OP-904',
  },
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('DISPATCH_OPERATOR');
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USERS['DISPATCH_OPERATOR']);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const handleSetRole = (role: UserRole) => {
    setCurrentRole(role);
    setUser(DEFAULT_USERS[role] || {
      name: 'Active User',
      email: 'user@lifelink.org',
      role,
    });
  };

  const login = (profile: Partial<UserProfile> & { role: UserRole }) => {
    const role = profile.role || 'CITIZEN';
    setCurrentRole(role);
    setUser({
      name: profile.name || DEFAULT_USERS[role].name,
      email: profile.email || DEFAULT_USERS[role].email,
      phone: profile.phone,
      role: role,
      bloodGroup: profile.bloodGroup,
      facilityName: profile.facilityName,
      badgeId: profile.badgeId,
    });
    setIsAuthenticated(true);
  };

  const register = (profile: UserProfile) => {
    setCurrentRole(profile.role);
    setUser(profile);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentRole('CITIZEN');
  };

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setRole: handleSetRole,
        roleName: ROLE_LABELS[currentRole]?.title || 'Citizen',
        user,
        isAuthenticated,
        login,
        register,
        logout,
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
