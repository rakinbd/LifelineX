'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu,
  LogOut,
  LogIn,
  ShieldCheck,
  User,
  Heart,
  Droplet,
  Globe
} from 'lucide-react';
import { useRole } from '@/context/RoleContext';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, isAdmin } = useRole();

  const getPageTitle = () => {
    if (pathname.startsWith('/admin')) return 'System Moderation & Management Console';
    if (pathname === '/dashboard') return 'Emergency Blood Assistance Hub';
    if (pathname.startsWith('/donors/matrix')) return 'Blood Group Matching Guide';
    if (pathname.startsWith('/donors')) return 'Blood Requests & Voluntary Donors';
    if (pathname.startsWith('/login')) return 'Member Sign In';
    if (pathname.startsWith('/register')) return 'Member Registration';
    return 'LifeLineX Emergency Network';
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 sm:px-6 backdrop-blur-md shadow-2xs">
      
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

        <div className="flex items-center space-x-2.5">
          <img
            src="/logo.png"
            alt="LifeLineX"
            className="h-8 w-8 rounded-lg object-contain p-0.5 sm:hidden"
          />
          <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right Controls: Unified Member Status & Logout */}
      <div className="flex items-center space-x-3">
        
        {/* Link back to public landing page */}
        <Link
          href="/"
          className="hidden md:flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 transition-colors px-2 py-1"
          title="View Public Home Page"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>Home Page</span>
        </Link>

        {/* Admin Console shortcut (Only for Admins) */}
        {isAdmin && (
          <Link
            href="/admin"
            className="hidden sm:flex items-center space-x-1.5 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100/80 px-2.5 py-1.5 text-xs text-purple-800 transition-colors shadow-2xs font-semibold"
            title="Open Admin Control Panel"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-purple-600 shrink-0" />
            <span>Admin Control</span>
          </Link>
        )}

        {/* Member Profile Badge & Quick Status Indicator */}
        {isAuthenticated && user ? (
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-2xs">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-50 border border-rose-200 font-mono text-[10px] font-bold text-rose-700 shrink-0">
                {user.bloodGroup || 'O+'}
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-slate-900 truncate max-w-[120px] sm:max-w-[160px]">
                  {user.name}
                </span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${
                  isAdmin 
                    ? 'bg-purple-50 text-purple-700 border-purple-200' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {isAdmin ? 'Admin' : 'Member'}
                </span>
              </div>
            </div>

            {/* Clean Logout Button */}
            <button
              onClick={handleLogout}
              title="Logout from LifeLineX"
              aria-label="Logout"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all text-xs font-semibold shadow-2xs active:scale-95"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              href="/login"
              className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <LogIn className="h-3.5 w-3.5 text-slate-500" />
              <span>Sign In</span>
            </Link>

            <Link
              href="/register"
              className="flex items-center space-x-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-500 transition-colors active:scale-95"
            >
              <span>Sign Up</span>
            </Link>
          </div>
        )}

      </div>

    </header>
  );
}
