'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, 
  MapPin, 
  Droplet, 
  Building2, 
  Users, 
  ShieldAlert, 
  AlertCircle, 
  Sparkles, 
  BarChart3, 
  Radio, 
  GitFork,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { useRole } from '@/context/RoleContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { incidents } = useEmergency();
  const { currentRole, roleName } = useRole();
  const [collapsed, setCollapsed] = useState(false);

  const bloodIncidentsCount = incidents.filter(i => i.category === 'BLOOD_TRANSFUSION').length;

  const navigationSections = [
    {
      label: 'CAD DISPATCH OPERATIONS',
      items: [
        {
          name: 'Command Center',
          href: '/',
          icon: Activity,
          description: 'System overview & live telemetry',
        },
        {
          name: 'Incident Dispatch',
          href: '/incidents',
          icon: Radio,
          badge: `${incidents.length}`,
          badgeColor: 'bg-red-100 text-red-700 border border-red-200',
          description: 'Live distress queue & status management',
        },
        {
          name: 'AI SOS & Triage',
          href: '/triage',
          icon: Sparkles,
          highlight: true,
          description: 'Submit emergency with AI analysis',
        },
        {
          name: 'Tactical Map',
          href: '/map',
          icon: MapPin,
          badge: 'GIS',
          badgeColor: 'bg-sky-100 text-sky-700 border border-sky-200',
          description: 'Geospatial emergency visualizer',
        },
      ]
    },
    {
      label: 'RESOURCES & NETWORKS',
      items: [
        {
          name: 'Blood Matching',
          href: '/donors',
          icon: Droplet,
          badge: bloodIncidentsCount > 0 ? `${bloodIncidentsCount} Needed` : undefined,
          badgeColor: 'bg-rose-100 text-rose-700 border border-rose-200',
          description: 'Donor registry & emergency appeals',
        },
        {
          name: 'Compatibility Matrix',
          href: '/donors/matrix',
          icon: GitFork,
          description: 'Universal transfusion calculator',
        },
        {
          name: 'Trauma & Facilities',
          href: '/hospitals',
          icon: Building2,
          description: 'ICU beds & ambulance directory',
        },
        {
          name: 'Responders Fleet',
          href: '/volunteers',
          icon: Users,
          description: 'Certified EMTs & field volunteers',
        },
        {
          name: 'Analytics & Reports',
          href: '/analytics',
          icon: BarChart3,
          description: 'Response times & life metrics',
        },
      ]
    }
  ];

  return (
    <aside 
      className={`relative flex flex-col border-r border-slate-200 bg-white transition-all duration-300 z-40 ${
        collapsed ? 'w-20' : 'w-72'
      } shrink-0 min-h-screen select-none shadow-sm`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
        <Link href="/" className="flex items-center space-x-3 overflow-hidden group">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-rose-600 shadow-md shadow-red-200 border border-red-400/30 group-hover:scale-105 transition-transform">
            <ShieldAlert className="h-5 w-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          </div>
          
          {!collapsed && (
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-mono text-base font-bold tracking-tight text-slate-900">LIFELINK</span>
                <span className="rounded bg-red-100 px-1 py-0.2 text-[9px] font-mono font-bold text-red-700 border border-red-200">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-500 tracking-wide font-medium">
                Emergency Dispatch CAD
              </span>
            </div>
          )}
        </Link>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-slate-200"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Quick SOS Trigger Button */}
      <div className="p-3 border-b border-slate-100">
        <Link
          href="/triage"
          className={`flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 font-bold text-white shadow-md shadow-red-200 hover:from-red-500 hover:to-rose-500 active:scale-95 transition-all ${
            collapsed ? 'p-2.5' : 'px-4 py-2.5 text-xs'
          }`}
        >
          <AlertCircle className="h-4 w-4 shrink-0 animate-pulse" />
          {!collapsed && <span>TRIGGER EMERGENCY SOS</span>}
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigationSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1 text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                {section.label}
              </div>
            )}

            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`group relative flex items-center rounded-xl transition-all duration-200 ${
                    collapsed ? 'justify-center p-3' : 'px-3 py-2.5 space-x-3'
                  } ${
                    isActive
                      ? 'bg-red-50 text-red-700 border border-red-200 shadow-sm font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {/* Left Active Glow Indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-red-600"></span>
                  )}

                  <div className={`shrink-0 transition-colors ${
                    isActive ? 'text-red-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>

                  {!collapsed && (
                    <div className="flex flex-1 items-center justify-between overflow-hidden">
                      <div className="flex flex-col truncate">
                        <span className="text-xs truncate tracking-wide">{item.name}</span>
                        <span className="text-[10px] text-slate-400 truncate group-hover:text-slate-500 font-normal">
                          {item.description}
                        </span>
                      </div>

                      {item.badge && (
                        <span className={`ml-2 rounded-full px-2 py-0.5 text-[9px] font-mono font-bold shrink-0 ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / User Profile & System Status */}
      <div className="border-t border-slate-200 p-3 bg-slate-50/80">
        {!collapsed ? (
          <div className="rounded-xl border border-slate-200 bg-white p-2.5 space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">CAD Mode</span>
              <span className="font-mono font-bold text-emerald-600 flex items-center space-x-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-800">
              <UserCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span className="truncate font-semibold">{roleName}</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center p-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="System Active"></span>
          </div>
        )}
      </div>
    </aside>
  );
}
