'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, UserPermissions, UserProfile, BloodGroup } from '@/types';

interface RoleContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  roleName: string;
  user: UserProfile | null;
  isAuthenticated: boolean;
  usersList: UserProfile[];
  
  // Permission checks
  canManageBlood: boolean;
  canManageHospitals: boolean;
  canManageDispatch: boolean;
  canManageUsers: boolean;
  isAdmin: boolean;
  
  // Auth actions
  login: (credentials: { identifier?: string; email?: string; phone?: string; password?: string; name?: string; role?: UserRole }) => boolean;
  adminLogin: (credentials: { identifier: string; password?: string; badgeId?: string }) => { success: boolean; message: string };
  register: (profile: { 
    name: string; 
    email: string; 
    phone?: string; 
    password?: string; 
    bloodGroup?: BloodGroup; 
    isDonor?: boolean;
    city?: string;
    lastDonationDate?: string;
  }) => void;
  logout: () => void;
  
  // Admin user access management
  updateUserPermissions: (userId: string, permissions: Partial<UserPermissions>) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  deleteUser: (userId: string) => void;
  addUser: (profile: Omit<UserProfile, 'id'>) => void;
  switchUser: (userId: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const ROLE_LABELS: Record<UserRole, { title: string; desc: string; badge: string; color: string }> = {
  USER: {
    title: 'Standard Member',
    desc: 'Community account: request patient blood or volunteer as screened donor',
    badge: 'Member',
    color: 'bg-slate-100 text-slate-800 border-slate-200'
  },
  ADMIN: {
    title: 'System Administrator',
    desc: 'Platform moderation, blood request fulfillment, donor verification, and system management',
    badge: 'System Admin',
    color: 'bg-red-50 text-red-700 border-red-200'
  },
  BLOOD_ADMIN: {
    title: 'System Administrator',
    desc: 'Platform moderation, blood request fulfillment, donor verification, and system management',
    badge: 'System Admin',
    color: 'bg-red-50 text-red-700 border-red-200'
  },
  SUPER_ADMIN: {
    title: 'System Administrator',
    desc: 'Platform moderation, blood request fulfillment, donor verification, and system management',
    badge: 'System Admin',
    color: 'bg-red-50 text-red-700 border-red-200'
  },
  HOSPITAL_ADMIN: {
    title: 'System Administrator',
    desc: 'Platform moderation, blood request fulfillment, donor verification, and system management',
    badge: 'System Admin',
    color: 'bg-red-50 text-red-700 border-red-200'
  },
  DISPATCH_ADMIN: {
    title: 'System Administrator',
    desc: 'Platform moderation, blood request fulfillment, donor verification, and system management',
    badge: 'System Admin',
    color: 'bg-red-50 text-red-700 border-red-200'
  },
  CITIZEN: {
    title: 'Standard Member',
    desc: 'Community account: request patient blood or volunteer as screened donor',
    badge: 'Member',
    color: 'bg-slate-100 text-slate-800 border-slate-200'
  },
  BLOOD_DONOR: {
    title: 'Standard Member',
    desc: 'Screened voluntary blood donor',
    badge: 'Member',
    color: 'bg-slate-100 text-slate-800 border-slate-200'
  },
  HOSPITAL_COORDINATOR: {
    title: 'System Administrator',
    desc: 'Platform moderation and hospital logistics',
    badge: 'System Admin',
    color: 'bg-red-50 text-red-700 border-red-200'
  },
  DISPATCH_OPERATOR: {
    title: 'System Administrator',
    desc: 'Platform moderation and emergency dispatch',
    badge: 'System Admin',
    color: 'bg-red-50 text-red-700 border-red-200'
  }
};

const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  USER: {
    bloodManagement: false,
    hospitalManagement: false,
    dispatchManagement: false,
    userManagement: false,
  },
  ADMIN: {
    bloodManagement: true,
    hospitalManagement: true,
    dispatchManagement: true,
    userManagement: true,
  },
  CITIZEN: {
    bloodManagement: false,
    hospitalManagement: false,
    dispatchManagement: false,
    userManagement: false,
  },
  BLOOD_ADMIN: {
    bloodManagement: true,
    hospitalManagement: true,
    dispatchManagement: true,
    userManagement: true,
  },
  BLOOD_DONOR: {
    bloodManagement: false,
    hospitalManagement: false,
    dispatchManagement: false,
    userManagement: false,
  },
  HOSPITAL_ADMIN: {
    bloodManagement: true,
    hospitalManagement: true,
    dispatchManagement: true,
    userManagement: true,
  },
  HOSPITAL_COORDINATOR: {
    bloodManagement: true,
    hospitalManagement: true,
    dispatchManagement: true,
    userManagement: true,
  },
  DISPATCH_ADMIN: {
    bloodManagement: true,
    hospitalManagement: true,
    dispatchManagement: true,
    userManagement: true,
  },
  DISPATCH_OPERATOR: {
    bloodManagement: true,
    hospitalManagement: true,
    dispatchManagement: true,
    userManagement: true,
  },
  SUPER_ADMIN: {
    bloodManagement: true,
    hospitalManagement: true,
    dispatchManagement: true,
    userManagement: true,
  },
};

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'USR-001',
    name: 'Rahim Ahmed',
    email: 'rahim.citizen@lifelinex.org',
    phone: '+1 (555) 019-9922',
    role: 'USER',
    bloodGroup: 'O+',
    permissions: {
      bloodManagement: false,
      hospitalManagement: false,
      dispatchManagement: false,
      userManagement: false,
    },
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'USR-ADMIN',
    name: 'System Administrator',
    email: 'admin@gmail.com',
    phone: '+1 (555) 999-0000',
    role: 'ADMIN',
    bloodGroup: 'O-',
    badgeId: 'ADMIN-01',
    permissions: {
      bloodManagement: true,
      hospitalManagement: true,
      dispatchManagement: true,
      userManagement: true,
    },
    createdAt: '2026-01-01T08:00:00Z',
  },
];

export function RoleProvider({ children }: { children: ReactNode }) {
  const [usersList, setUsersList] = useState<UserProfile[]>(INITIAL_USERS);
  // Default: Not authenticated when first opening the site
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('USER');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Restore saved session from localStorage on client mount
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('lifelinex_session');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed?.user && parsed?.isAuthenticated) {
          setUser(parsed.user);
          setCurrentRole(parsed.user.role || 'USER');
          setIsAuthenticated(true);
        }
      }
    } catch {
      // Storage unavailable or invalid JSON
    }
  }, []);

  // Save session when user changes
  const saveSession = (authenticatedUser: UserProfile | null) => {
    if (authenticatedUser) {
      try {
        localStorage.setItem(
          'lifelinex_session',
          JSON.stringify({ user: authenticatedUser, isAuthenticated: true })
        );
      } catch {}
    } else {
      try {
        localStorage.removeItem('lifelinex_session');
      } catch {}
    }
  };

  // Sync role state with user object
  useEffect(() => {
    if (user) {
      setCurrentRole(user.role);
    }
  }, [user]);

  // Unified Member Model: Standard Users can request & donate; Admins moderate
  const isAdmin = Boolean(
    isAuthenticated && (
      user?.role === 'ADMIN' ||
      user?.role === 'SUPER_ADMIN' ||
      user?.role === 'BLOOD_ADMIN' ||
      user?.permissions?.bloodManagement ||
      user?.permissions?.userManagement
    )
  );

  const canManageBlood = Boolean(isAuthenticated && (isAdmin || user?.permissions?.bloodManagement));
  const canManageHospitals = Boolean(isAuthenticated && (isAdmin || user?.permissions?.hospitalManagement));
  const canManageDispatch = Boolean(isAuthenticated && (isAdmin || user?.permissions?.dispatchManagement));
  const canManageUsers = Boolean(isAuthenticated && (user?.role === 'SUPER_ADMIN' || user?.permissions?.userManagement));

  // Normal User Login
  const login = (credentials: { identifier?: string; email?: string; phone?: string; password?: string; name?: string; role?: UserRole }): boolean => {
    const rawInput = (credentials.identifier || credentials.email || credentials.phone || '').toLowerCase().trim();
    
    // Look up existing user by email, phone, or name
    const existing = usersList.find(u => 
      (u.email && u.email.toLowerCase() === rawInput) || 
      (u.phone && u.phone.replace(/[\s()-]/g, '') === rawInput.replace(/[\s()-]/g, '')) ||
      (credentials.name && u.name.toLowerCase() === credentials.name.toLowerCase())
    );

    if (existing) {
      setUser(existing);
      setCurrentRole(existing.role);
      setIsAuthenticated(true);
      saveSession(existing);
      return true;
    } else {
      const targetRole = credentials.role || 'USER';
      const isEmail = rawInput.includes('@');
      const newUser: UserProfile = {
        id: `USR-${Math.floor(100 + Math.random() * 900)}`,
        name: credentials.name || (isEmail ? rawInput.split('@')[0] : 'Standard Member'),
        email: isEmail ? rawInput : `${rawInput.replace(/[^0-9]/g, '') || 'member'}@citizen.lifelinex.org`,
        phone: !isEmail && rawInput ? rawInput : '+1 (555) 000-0000',
        bloodGroup: 'O+',
        role: targetRole,
        permissions: DEFAULT_PERMISSIONS[targetRole] || DEFAULT_PERMISSIONS.USER,
        createdAt: new Date().toISOString(),
      };
      setUsersList(prev => [...prev, newUser]);
      setUser(newUser);
      setCurrentRole(targetRole);
      setIsAuthenticated(true);
      saveSession(newUser);
      return true;
    }
  };

  // Dedicated Admin Login for /admin/login
  const adminLogin = (credentials: { identifier: string; password?: string; badgeId?: string }) => {
    const rawInput = credentials.identifier.toLowerCase().trim();
    const rawPassword = credentials.password?.trim() || '';
    const rawBadge = (credentials.badgeId || '').trim().toUpperCase();

    // Verify Password: must be "admin123"
    if (rawPassword !== 'admin123') {
      return { 
        success: false, 
        message: 'Invalid password. Please enter the correct admin password.' 
      };
    }

    // Check identifier: "admin", "admin@gmail.com", or "admin@lifelinex.org"
    const isValidAdminIdentifier = 
      rawInput === 'admin' || 
      rawInput === 'admin@gmail.com' || 
      rawInput === 'admin@lifelinex.org' || 
      rawInput === 'admin-01' ||
      rawBadge === 'ADMIN-01';

    // Find admin by email or badge ID
    const foundAdmin = usersList.find(u => 
      (u.email.toLowerCase() === rawInput || 
       (u.badgeId && u.badgeId.toUpperCase() === rawInput) || 
       (rawBadge && u.badgeId && u.badgeId.toUpperCase() === rawBadge) ||
       (isValidAdminIdentifier && u.role === 'ADMIN')) &&
      u.role === 'ADMIN'
    );

    if (foundAdmin) {
      setUser(foundAdmin);
      setCurrentRole('ADMIN');
      setIsAuthenticated(true);
      saveSession(foundAdmin);
      return { success: true, message: `Welcome back, ${foundAdmin.name}!` };
    }

    // Allow default admin master login if "admin", "admin@gmail.com" or "admin@lifelinex.org" is used
    if (isValidAdminIdentifier) {
      const defaultAdmin = usersList.find(u => u.id === 'USR-ADMIN') || INITIAL_USERS[1];
      setUser(defaultAdmin);
      setCurrentRole('ADMIN');
      setIsAuthenticated(true);
      saveSession(defaultAdmin);
      return { success: true, message: `Welcome System Administrator ${defaultAdmin.name}!` };
    }

    return { 
      success: false, 
      message: 'Invalid administrative credentials. Use admin or admin@gmail.com.' 
    };
  };

  // Register: standard unified member registration
  const register = (profile: { 
    name: string; 
    email: string; 
    phone?: string; 
    password?: string; 
    bloodGroup?: BloodGroup;
    isDonor?: boolean;
    city?: string;
    lastDonationDate?: string;
  }) => {
    const inputEmail = profile.email.toLowerCase().trim();
    const existing = usersList.find(u => u.email.toLowerCase() === inputEmail);

    if (existing) {
      setUser(existing);
      setCurrentRole(existing.role);
      setIsAuthenticated(true);
      saveSession(existing);
      return;
    }

    const newUser: UserProfile = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: profile.name,
      email: profile.email,
      phone: profile.phone || '+1 (555) 000-0000',
      bloodGroup: profile.bloodGroup || 'O+',
      role: 'USER',
      permissions: {
        bloodManagement: false,
        hospitalManagement: false,
        dispatchManagement: false,
        userManagement: false,
      },
      createdAt: new Date().toISOString(),
    };

    setUsersList(prev => [...prev, newUser]);
    setUser(newUser);
    setCurrentRole('USER');
    setIsAuthenticated(true);
    saveSession(newUser);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentRole('USER');
    saveSession(null);
  };

  // Quick switch active user (for presentation / demo)
  const switchUser = (userId: string) => {
    const target = usersList.find(u => u.id === userId);
    if (target) {
      setUser(target);
      setCurrentRole(target.role);
      setIsAuthenticated(true);
      saveSession(target);
    }
  };

  // Admin action: Grant or revoke specific feature permissions for a user
  const updateUserPermissions = (userId: string, updatedPermissions: Partial<UserPermissions>) => {
    setUsersList(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const newPerms = { ...u.permissions, ...updatedPermissions };
          
          let newRole = u.role;
          if (newPerms.userManagement) {
            newRole = 'SUPER_ADMIN';
          } else if (newPerms.bloodManagement && !newPerms.hospitalManagement && !newPerms.dispatchManagement) {
            newRole = 'BLOOD_ADMIN';
          } else if (newPerms.hospitalManagement && !newPerms.bloodManagement && !newPerms.dispatchManagement) {
            newRole = 'HOSPITAL_ADMIN';
          } else if (newPerms.dispatchManagement && !newPerms.bloodManagement && !newPerms.hospitalManagement) {
            newRole = 'DISPATCH_ADMIN';
          } else if (!newPerms.bloodManagement && !newPerms.hospitalManagement && !newPerms.dispatchManagement) {
            newRole = 'USER';
          }

          const updatedUser = { ...u, permissions: newPerms, role: newRole };
          if (user && user.id === userId) {
            setUser(updatedUser);
            setCurrentRole(newRole);
            saveSession(updatedUser);
          }
          return updatedUser;
        }
        return u;
      })
    );
  };

  // Admin action: Update a user's overarching role and sync permissions
  const updateUserRole = (userId: string, role: UserRole) => {
    const defaultPerms = DEFAULT_PERMISSIONS[role] || DEFAULT_PERMISSIONS.USER;
    setUsersList(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const updatedUser = { ...u, role, permissions: { ...defaultPerms } };
          if (user && user.id === userId) {
            setUser(updatedUser);
            setCurrentRole(role);
            saveSession(updatedUser);
          }
          return updatedUser;
        }
        return u;
      })
    );
  };

  // Admin action: Delete user
  const deleteUser = (userId: string) => {
    setUsersList(prev => prev.filter(u => u.id !== userId));
    if (user && user.id === userId) {
      logout();
    }
  };

  // Admin action: Add user manually
  const addUser = (profile: Omit<UserProfile, 'id'>) => {
    const newUser: UserProfile = {
      ...profile,
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
    };
    setUsersList(prev => [...prev, newUser]);
  };

  const handleSetRole = (role: UserRole) => {
    setCurrentRole(role);
    if (user) {
      const defaultPerms = DEFAULT_PERMISSIONS[role] || DEFAULT_PERMISSIONS.USER;
      const updated = { ...user, role, permissions: { ...defaultPerms } };
      setUser(updated);
      setUsersList(prev => prev.map(u => (u.id === user.id ? updated : u)));
      saveSession(updated);
    }
  };

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setRole: handleSetRole,
        roleName: ROLE_LABELS[currentRole]?.title || 'Standard User',
        user,
        isAuthenticated,
        usersList,
        canManageBlood,
        canManageHospitals,
        canManageDispatch,
        canManageUsers,
        isAdmin,
        login,
        adminLogin,
        register,
        logout,
        updateUserPermissions,
        updateUserRole,
        deleteUser,
        addUser,
        switchUser,
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
