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

  // Determine current page title
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 sm:px-6 backdrop-blur-md">
      
      {/* Left: Mobile Toggle & Page Title Breadcrumb */}
      <div className="flex items-center space-x-3">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-900 md:hidden"
            title="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-slate-400">DISPATCH //</span>
            <h1 className="text-sm font-bold text-white tracking-wide">
              {getPageTitle()}
            </h1>
          </div>
          <p className="text-[10px] text-slate-400 hidden sm:block">
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
            className="hidden sm:flex items-center space-x-1.5 rounded-full border border-red-900/60 bg-red-950/40 px-3 py-1 text-xs text-red-400 hover:bg-red-950/70 transition-colors"
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
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          <span className="hidden lg:inline text-[11px] font-mono">
            {audioEnabled ? 'CHIME ON' : 'MUTED'}
          </span>
        </button>

        {/* Role Simulator Switcher */}
        <div className="flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-2.5 py-1.5 text-xs text-slate-200 shadow-sm">
          <UserCheck className="h-3.5 w-3.5 text-blue-400 shrink-0" />
          <select
            value={currentRole}
            aria-label="Operational Role"
            onChange={e => setRole(e.target.value as UserRole)}
            className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1 font-medium"
          >
            {Object.entries(ROLE_LABELS).map(([key, val]) => (
              <option key={key} value={key} className="bg-slate-900 text-slate-100">
                {val.title}
              </option>
            ))}
          </select>
        </div>

      </div>

    </header>
  );
}
