'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Volume2, 
  VolumeX, 
  UserCheck, 
  Menu,
  LogOut,
  LogIn,
  AlertCircle
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { useRole, ROLE_LABELS } from '@/context/RoleContext';
import { UserRole } from '@/types';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { audioEnabled, setAudioEnabled, incidents } = useEmergency();
  const { currentRole, setRole, user, isAuthenticated, logout } = useRole();

  const getPageTitle = () => {
    if (pathname === '/') return 'Command Center';
    if (pathname.startsWith('/incidents')) return 'Emergency Response';
    if (pathname.startsWith('/triage')) return 'AI Triage';
    if (pathname.startsWith('/map')) return 'Incident Map';
    if (pathname.startsWith('/donors/matrix')) return 'Blood Compatibility Engine';
    if (pathname.startsWith('/donors')) return 'Blood Matching';
    if (pathname.startsWith('/hospitals')) return 'Medical Facilities';
    if (pathname.startsWith('/analytics')) return 'System Analytics';
    if (pathname.startsWith('/login')) return 'Portal Authentication';
    return 'Emergency Alert System';
  };

  const criticalCount = incidents.filter(i => i.urgency === 'CRITICAL').length;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-sm">
      
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center space-x-3">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
            title="Toggle Menu"
            aria-label="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right Controls: Alert status, Audio chime, Role switcher, Auth */}
      <div className="flex items-center space-x-3">
        
        {/* Critical Cases Indicator Badge */}
        {criticalCount > 0 && (
          <Link
            href="/incidents"
            className="flex items-center space-x-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs text-rose-700 hover:bg-rose-100 transition-colors font-medium"
            title="View critical urgent incidents"
          >
            <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
            <span className="font-semibold">{criticalCount} Urgent</span>
          </Link>
        )}

        {/* Audio Alert Chime Toggle */}
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          title={audioEnabled ? 'Mute Dispatch Alerts' : 'Enable Dispatch Chime'}
          aria-label={audioEnabled ? 'Mute Dispatch Alerts' : 'Enable Dispatch Chime'}
          className={`flex items-center space-x-1.5 p-2 rounded-xl border text-xs transition-colors ${
            audioEnabled
              ? 'bg-slate-100 border-slate-300 text-slate-800'
              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          {audioEnabled ? <Volume2 className="h-4 w-4 text-teal-600" /> : <VolumeX className="h-4 w-4" />}
          <span className="hidden lg:inline text-xs font-medium">
            {audioEnabled ? 'Chime On' : 'Muted'}
          </span>
        </button>

        {/* Role Simulator Switcher */}
        <div className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-2xs">
          <UserCheck className="h-3.5 w-3.5 text-teal-600 shrink-0" />
          <select
            value={currentRole}
            aria-label="Select Operational Role"
            onChange={e => setRole(e.target.value as UserRole)}
            className="bg-transparent text-xs text-slate-800 focus:outline-none cursor-pointer pr-1 font-medium"
          >
            {Object.entries(ROLE_LABELS).map(([key, val]) => (
              <option key={key} value={key} className="bg-white text-slate-800">
                {val.title}
              </option>
            ))}
          </select>
        </div>

        {/* Auth / User Action Button */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-2 pl-1 border-l border-slate-200">
            <span className="hidden sm:inline text-xs font-medium text-slate-700 truncate max-w-[120px]">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="flex items-center space-x-1 p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline text-xs">Logout</span>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center space-x-1.5 rounded-xl bg-[#172B4D] px-3 py-1.5 text-xs font-medium text-white shadow-2xs hover:bg-[#243b53] transition-colors"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </Link>
        )}

      </div>

    </header>
  );
}
