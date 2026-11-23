'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Activity, 
  MapPin, 
  Droplet, 
  Building2, 
  ShieldAlert, 
  AlertCircle, 
  Sparkles, 
  BarChart3, 
  Radio, 
  GitFork,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LogIn
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { useRole } from '@/context/RoleContext';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { incidents } = useEmergency();
  const { roleName, user, isAuthenticated, logout } = useRole();
  const [collapsed, setCollapsed] = useState(false);

  const bloodIncidentsCount = incidents.filter(i => i.category === 'BLOOD_TRANSFUSION').length;

  const navigationSections = [
    {
      label: 'Operations',
      items: [
        {
          name: 'Command Center',
          href: '/',
          icon: Activity,
        },
        {
          name: 'Emergency Response',
          href: '/incidents',
          icon: Radio,
          badge: incidents.length > 0 ? `${incidents.length}` : undefined,
          badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
        },
        {
          name: 'AI Triage',
          href: '/triage',
          icon: Sparkles,
        },
        {
          name: 'Incident Map',
          href: '/map',
          icon: MapPin,
        },
      ]
    },
    {
      label: 'Resources',
      items: [
        {
          name: 'Blood Matching',
          href: '/donors',
          icon: Droplet,
          badge: bloodIncidentsCount > 0 ? `${bloodIncidentsCount}` : undefined,
          badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
        },
        {
          name: 'Compatibility Engine',
          href: '/donors/matrix',
          icon: GitFork,
        },
        {
          name: 'Medical Facilities',
          href: '/hospitals',
          icon: Building2,
        },
        {
          name: 'Analytics',
          href: '/analytics',
          icon: BarChart3,
        },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside 
      className={`relative flex flex-col border-r border-slate-200 bg-white transition-all duration-200 z-40 ${
        collapsed ? 'w-20' : 'w-64'
      } shrink-0 min-h-screen select-none`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
        <Link href="/" className="flex items-center space-x-3 overflow-hidden group">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#172B4D] text-white shadow-xs">
            <ShieldAlert className="h-5 w-5 text-teal-400" />
          </div>
          
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="text-sm font-bold tracking-tight text-[#172B4D]">
                LIFELINK
              </span>
              <span className="text-[11px] text-slate-500 font-medium truncate">
                Emergency Alert System
              </span>
            </div>
          )}
        </Link>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Quick SOS Trigger Button */}
      <div className="p-3">
        <Link
          href="/triage"
          className={`flex items-center justify-center space-x-2 rounded-xl bg-rose-600 font-semibold text-white shadow-xs hover:bg-rose-500 active:scale-[0.98] transition-all ${
            collapsed ? 'p-2.5' : 'px-3 py-2 text-xs'
          }`}
          title="Trigger Emergency SOS"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Emergency SOS</span>}
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {navigationSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
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
                  className={`group relative flex items-center rounded-xl text-xs font-medium transition-colors ${
                    collapsed ? 'justify-center p-2.5' : 'px-3 py-2 space-x-3'
                  } ${
                    isActive
                      ? 'bg-slate-100 text-[#172B4D] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {/* Subtle Active Accent Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#14B8A6]"></span>
                  )}

                  <div className={`shrink-0 transition-colors ${
                    isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>

                  {!collapsed && (
                    <div className="flex flex-1 items-center justify-between overflow-hidden">
                      <span className="truncate">{item.name}</span>

                      {item.badge && (
                        <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-mono font-medium border ${item.badgeColor}`}>
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

      {/* Clean User Profile & Session Section */}
      <div className="border-t border-slate-200 p-3 bg-white">
        {!collapsed ? (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <p className="truncate font-semibold text-slate-900 leading-tight">
                  {isAuthenticated ? (user?.name || 'User') : 'Guest User'}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {isAuthenticated ? roleName : 'Not signed in'}
                </p>
              </div>
            </div>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <Link
                href="/login"
                title="Sign In"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                aria-label="Sign In"
              >
                <LogIn className="h-4 w-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                title="Logout" 
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <Link 
                href="/login" 
                title="Sign In" 
                className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                aria-label="Sign In"
              >
                <LogIn className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
