'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { 
  Activity, 
  Droplet, 
  GitFork, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  PlusCircle, 
  Heart, 
  AlertCircle, 
  UserCheck, 
  Clock, 
  Radio,
  Users,
  FileText,
  Sliders,
  CheckCircle2,
  X
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { useRole, ROLE_LABELS } from '@/context/RoleContext';

function SidebarNavList({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || (pathname === '/donors' ? 'appeals' : '');
  
  const { incidents, donors } = useEmergency();
  const { isAdmin } = useRole();

  const bloodRequestsCount = incidents.filter(i => i.category === 'BLOOD_TRANSFUSION' && i.status !== 'RESOLVED').length;
  const unverifiedDonorsCount = donors.filter(d => !d.isVerified).length;

  // 1. ADMIN-ONLY NAVIGATION (Focused System Moderation & Management)
  const adminSections = [
    {
      label: 'System Moderation',
      items: [
        {
          name: 'Admin Overview',
          href: '/admin',
          icon: ShieldCheck,
          isActive: pathname === '/admin' && (!currentTab || currentTab === 'overview'),
        },
        {
          name: 'Manage Blood Requests',
          href: '/admin?tab=requests',
          icon: AlertCircle,
          badge: bloodRequestsCount > 0 ? `${bloodRequestsCount}` : undefined,
          badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
          isActive: (pathname === '/admin' && currentTab === 'requests') || (pathname === '/donors' && currentTab === 'appeals'),
        },
        {
          name: 'Donor Verification',
          href: '/admin?tab=verifications',
          icon: UserCheck,
          badge: unverifiedDonorsCount > 0 ? `${unverifiedDonorsCount} New` : undefined,
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
          isActive: pathname === '/admin' && currentTab === 'verifications',
        },
        {
          name: 'Emergency Dispatch',
          href: '/donors?tab=mobilize',
          icon: Radio,
          badge: 'Broadcast',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          isActive: pathname === '/donors' && currentTab === 'mobilize',
        },
        {
          name: 'Users & Audit Logs',
          href: '/admin?tab=users',
          icon: Users,
          isActive: pathname === '/admin' && (currentTab === 'users' || currentTab === 'audit'),
        },
      ]
    }
  ];

  // 2. STANDARD USER NAVIGATION (Personal Donor/Seeker Hub)
  const userSections = [
    {
      label: 'Main Dashboard',
      items: [
        {
          name: 'Blood Assistance Hub',
          href: '/dashboard',
          icon: Activity,
          isActive: pathname === '/dashboard',
        },
      ]
    },
    {
      label: 'Blood Services',
      items: [
        {
          name: 'Live Blood Requests',
          href: '/donors?tab=appeals',
          icon: AlertCircle,
          badge: bloodRequestsCount > 0 ? `${bloodRequestsCount}` : undefined,
          badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
          isActive: pathname === '/donors' && currentTab === 'appeals',
        },
        {
          name: 'Request Blood',
          href: '/donors?tab=request',
          icon: PlusCircle,
          badge: 'Urgent',
          badgeColor: 'bg-red-50 text-red-700 border-red-200',
          isActive: pathname === '/donors' && currentTab === 'request',
        },
        {
          name: 'Become a Donor',
          href: '/donors?tab=donate',
          icon: Heart,
          badge: 'Volunteer',
          badgeColor: 'bg-pink-50 text-pink-700 border-pink-200',
          isActive: pathname === '/donors' && currentTab === 'donate',
        },
        {
          name: 'Available Donors',
          href: '/donors?tab=registry',
          icon: Users,
          badge: `${donors.length}`,
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
          isActive: pathname === '/donors' && currentTab === 'registry',
        },
        {
          name: 'Blood Matching Guide',
          href: '/donors/matrix',
          icon: GitFork,
          isActive: pathname === '/donors/matrix',
        },
        {
          name: 'Donation Eligibility',
          href: '/donors?tab=cooldown',
          icon: Clock,
          isActive: pathname === '/donors' && currentTab === 'cooldown',
        },
      ]
    }
  ];

  const navigationSections = isAdmin ? adminSections : userSections;

  return (
    <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
      {navigationSections.map((section, idx) => (
        <div key={idx} className="space-y-1">
          {!collapsed && (
            <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-mono">
              {section.label}
            </div>
          )}

          {section.items.map(item => {
            const Icon = item.icon;
            const isActive = item.isActive;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                title={collapsed ? item.name : undefined}
                className={`group relative flex items-center rounded-xl text-xs font-medium transition-colors ${
                  collapsed ? 'justify-center p-2.5' : 'px-3 py-2 space-x-3'
                } ${
                  isActive
                    ? 'bg-rose-50 text-rose-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-rose-600"></span>
                )}

                <div className={`shrink-0 transition-colors ${
                  isActive ? 'text-rose-600' : 'text-slate-400 group-hover:text-slate-600'
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
  );
}

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isMobile = false, onClose }: SidebarProps) {
  const router = useRouter();
  const { currentRole, user, isAuthenticated, logout, isAdmin } = useRole();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
    router.push('/');
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside 
      className={
        isMobile
          ? "flex flex-col w-full h-full bg-white select-none overflow-hidden"
          : `relative flex flex-col border-r border-slate-200 bg-white transition-all duration-200 z-40 ${
              collapsed ? 'w-20' : 'w-64'
            } shrink-0 min-h-screen select-none`
      }
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
        <Link 
          href={isAdmin ? "/admin" : "/dashboard"} 
          onClick={handleLinkClick}
          className="flex items-center space-x-3 overflow-hidden group"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-50 to-teal-50 border border-slate-200/80 p-1 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
            <img
              src="/logo.png"
              alt="LifeLineX Logo"
              className="h-full w-full object-contain"
            />
          </div>
          
          {(!collapsed || isMobile) && (
            <div className="flex flex-col truncate">
              <span className="text-[17px] font-black tracking-tight text-[#172B4D] font-sans leading-tight">
                LifeLine<span className="text-rose-600">X</span>
              </span>
              <span className="text-[10px] text-teal-700 font-bold tracking-tight truncate mt-0.5">
                {isAdmin ? 'System Control & Moderation' : 'Connect • Respond • Save Lives'}
              </span>
            </div>
          )}
        </Link>

        {/* Collapse toggle (desktop) or Close button (mobile) */}
        {isMobile ? (
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title="Close Menu"
            aria-label="Close Menu"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Quick Action Button: Conditional on Admin vs Standard Member */}
      <div className="p-3">
        {isAdmin ? (
          <Link
            href="/admin"
            onClick={handleLinkClick}
            className={`flex items-center justify-center space-x-2 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] font-semibold text-white shadow-xs active:scale-[0.98] transition-all ${
              collapsed && !isMobile ? 'p-2.5' : 'px-3 py-2 text-xs'
            }`}
            title="System Admin Console"
          >
            <ShieldCheck className="h-4 w-4 shrink-0 text-rose-400" />
            {(!collapsed || isMobile) && <span>Admin Control Center</span>}
          </Link>
        ) : (
          <Link
            href="/donors?tab=request"
            onClick={handleLinkClick}
            className={`flex items-center justify-center space-x-2 rounded-xl bg-rose-600 font-semibold text-white shadow-xs hover:bg-rose-500 active:scale-[0.98] transition-all ${
              collapsed && !isMobile ? 'p-2.5' : 'px-3 py-2 text-xs'
            }`}
            title="Submit Blood Request"
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            {(!collapsed || isMobile) && <span>Request Blood</span>}
          </Link>
        )}
      </div>

      {/* Navigation Sections */}
      <Suspense fallback={<div className="flex-1 p-4 text-xs text-slate-400">Loading menu...</div>}>
        <SidebarNavList collapsed={isMobile ? false : collapsed} onNavigate={onClose} />
      </Suspense>

      {/* User Profile & Session Section */}
      <div className="border-t border-slate-200 p-3 bg-white">
        {!collapsed ? (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${
                isAdmin 
                  ? 'bg-purple-100 text-purple-800 border-purple-200' 
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <p className="truncate font-semibold text-slate-900 leading-tight">
                  {isAuthenticated ? (user?.name || 'User') : 'Guest User'}
                </p>
                <span className="text-[10px] font-medium text-slate-500 truncate block">
                  {isAuthenticated ? (ROLE_LABELS[currentRole]?.badge || (isAdmin ? 'Admin' : 'Standard Member')) : 'Not signed in'}
                </span>
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
