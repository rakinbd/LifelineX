'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, 
  Droplet, 
  GitFork,
  Menu,
  X,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useRole, ROLE_LABELS } from '@/context/RoleContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAdmin } = useRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Command Center', icon: Activity },
    { href: '/donors?tab=appeals', label: 'Blood Appeals', icon: Droplet },
    { href: '/donors/matrix', label: 'Compatibility Matrix', icon: GitFork },
    ...(isAdmin ? [{ href: '/admin', label: 'Admin Access', icon: ShieldCheck }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Brand Identity */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-700/80 p-1 shadow-md group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="LifeLineX Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-extrabold tracking-tight text-white font-sans">
                  LifeLine<span className="text-teal-400">X</span>
                </span>
                <span className="rounded bg-rose-950 px-1.5 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-800/60 uppercase">
                  BLOOD NETWORK
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide">
                Connect • Respond • Save Lives
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
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
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-2.5">
          <div className="relative hidden sm:block">
            <div className="flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300">
              <UserCheck className="h-3.5 w-3.5 text-rose-400" />
              <span className="text-xs text-slate-200">
                {user?.name || 'Member'} ({isAdmin ? 'Admin' : 'Member'})
              </span>
            </div>
          </div>

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
                  <Icon className="h-4 w-4 text-rose-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
