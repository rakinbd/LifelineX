'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Volume2, 
  VolumeX, 
  UserCheck, 
  Bell, 
  Radio, 
  Search, 
  AlertTriangle,
  Sparkles,
  Menu
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { useRole, ROLE_LABELS } from '@/context/RoleContext';
import { UserRole } from '@/types';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const { audioEnabled, setAudioEnabled, incidents } = useEmergency();
  const { currentRole, setRole } = useRole();

  const getPageTitle = () => {
    if (pathname === '/') return 'Command Center Overview';
    if (pathname.startsWith('/incidents')) return 'Incident Dispatch Command';
    if (pathname.startsWith('/triage')) return 'AI SOS & Emergency Triage';
    if (pathname.startsWith('/map')) return 'Tactical GIS Emergency Map';
    if (pathname.startsWith('/donors/matrix')) return 'Universal Transfusion Compatibility';
    if (pathname.startsWith('/donors')) return 'Smart Blood Donor Matching';
    if (pathname.startsWith('/hospitals')) return 'Trauma Facilities & Bed Telemetry';
    if (pathname.startsWith('/volunteers')) return 'First Responders & Disaster Fleet';
    if (pathname.startsWith('/analytics')) return 'Operational Telemetry & Impact';
    return 'LifeLink AI Emergency System';
  };

  const criticalCount = incidents.filter(i => i.urgency === 'CRITICAL').length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md shadow-sm">
      
      {/* Left: Mobile Toggle & Page Title Breadcrumb */}
      <div className="flex items-center space-x-3">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
            title="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-slate-400">DISPATCH //</span>
            <h1 className="text-sm font-bold text-slate-900 tracking-wide">
              {getPageTitle()}
            </h1>
          </div>
          <p className="text-[10px] text-slate-500 hidden sm:block">
            Decentralized Computer-Aided Dispatch & Community Coordination
          </p>
        </div>
      </div>

      {/* Right Controls: Global Search, Audio Alert, Role Switcher, Urgent Status */}
      <div className="flex items-center space-x-3">
        
        {/* Critical Cases Ticker Badge */}
        {criticalCount > 0 && (
          <Link
            href="/incidents"
            className="hidden sm:flex items-center space-x-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs text-red-700 hover:bg-red-100 transition-colors font-medium shadow-sm"
          >
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="font-mono font-bold">{criticalCount} Critical SOS</span>
          </Link>
        )}

        {/* Audio Alert Chime Toggle */}
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          title={audioEnabled ? 'Mute Dispatch Alerts' : 'Enable Emergency Audio Chime'}
          className={`flex items-center space-x-1.5 p-2 rounded-xl border text-xs transition-colors ${
            audioEnabled
              ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
        >
          {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          <span className="hidden lg:inline text-[11px] font-mono font-medium">
            {audioEnabled ? 'CHIME ON' : 'MUTED'}
          </span>
        </button>

        {/* Role Simulator Switcher */}
        <div className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 shadow-sm">
          <UserCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
          <select
            value={currentRole}
            aria-label="Operational Role"
            onChange={e => setRole(e.target.value as UserRole)}
            className="bg-transparent text-xs text-slate-800 focus:outline-none cursor-pointer pr-1 font-semibold"
          >
            {Object.entries(ROLE_LABELS).map(([key, val]) => (
              <option key={key} value={key} className="bg-white text-slate-900">
                {val.title}
              </option>
            ))}
          </select>
        </div>

      </div>

    </header>
  );
}
