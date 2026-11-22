'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldAlert, 
  Activity, 
  Droplet, 
  MapPin, 
  Building2, 
  Users, 
  Volume2, 
  VolumeX, 
  UserCheck, 
  AlertCircle,
  Menu,
  X
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { useRole, ROLE_LABELS } from '@/context/RoleContext';
import { UserRole } from '@/types';
import QuickSOSModal from '@/components/emergency/QuickSOSModal';

export default function Navbar() {
  const pathname = usePathname();
  const { audioEnabled, setAudioEnabled, metrics } = useEmergency();
  const { currentRole, setRole } = useRole();
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Command Center', icon: Activity },
    { href: '/map', label: 'Tactical Map', icon: MapPin },
    { href: '/donors', label: 'Blood Matching', icon: Droplet },
    { href: '/hospitals', label: 'Trauma & Facilities', icon: Building2 },
    { href: '/volunteers', label: 'Responders', icon: Users },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          
          {/* Brand Identity */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-rose-700 shadow-lg shadow-red-900/40 border border-red-500/30 group-hover:scale-105 transition-transform">
                <ShieldAlert className="h-5 w-5 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg font-bold tracking-tight text-white font-mono">LIFELINK</span>
                  <span className="rounded bg-red-950 px-1.5 py-0.5 text-[10px] font-semibold text-red-400 border border-red-800/60 uppercase">
                    AI CAD
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 tracking-wide">
                  Global Emergency & Community Dispatch
                </p>
              </div>
            </Link>

            {/* Operational Telemetry Badge */}
            <div className="hidden lg:flex items-center space-x-2 rounded-full border border-emerald-900/60 bg-emerald-950/40 px-2.5 py-1 text-[11px] text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>NETWORK NOMINAL</span>
              <span className="text-slate-600">|</span>
              <span className="font-mono text-emerald-300 font-medium">8,420 ACTIVE NODES</span>
            </div>
          </div>

          {/* Desktop Navigation Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Audio Toggle, Role Selector & Instant SOS Trigger */}
          <div className="flex items-center space-x-2.5">
            {/* Audio Telemetry Toggle */}
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              title={audioEnabled ? 'Mute Dispatch Alerts' : 'Enable Emergency Audio Chime'}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                audioEnabled
                  ? 'bg-slate-800 border-slate-700 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Role Switcher */}
            <div className="relative hidden sm:block">
              <div className="flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300">
                <UserCheck className="h-3.5 w-3.5 text-blue-400" />
                <select
                  value={currentRole}
                  aria-label="Operational Role"
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
                >
                  {Object.entries(ROLE_LABELS).map(([key, val]) => (
                    <option key={key} value={key} className="bg-slate-900 text-slate-100">
                      {val.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Instant Emergency SOS Button */}
            <button
              onClick={() => setIsSosOpen(true)}
              className="flex items-center space-x-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/80 hover:bg-red-500 active:scale-95 transition-all border border-red-500/40 animate-pulse-rapid"
            >
              <AlertCircle className="h-4 w-4" />
              <span>SOS EMERGENCY</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-slate-800 text-slate-400 md:hidden hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-800 bg-slate-950 px-4 py-3 md:hidden space-y-2">
            <div className="grid grid-cols-2 gap-2 pb-2">
              {navLinks.map(link => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 p-2 rounded-lg text-xs font-medium ${
                      isActive ? 'bg-slate-800 text-white' : 'text-slate-400 bg-slate-900/60'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-red-400" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="pt-2 border-t border-slate-800">
              <label className="text-[11px] text-slate-500 block mb-1">Simulate User Role</label>
              <select
                value={currentRole}
                onChange={e => {
                  setRole(e.target.value as UserRole);
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-200"
              >
                {Object.entries(ROLE_LABELS).map(([key, val]) => (
                  <option key={key} value={key} className="bg-slate-900">
                    {val.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </header>

      {/* Instant SOS Modal */}
      {isSosOpen && <QuickSOSModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />}
    </>
  );
}
