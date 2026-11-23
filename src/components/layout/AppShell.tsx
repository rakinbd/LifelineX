'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ShieldAlert, LogIn, ArrowRight } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useRole();

  // Public standalone pages where sidebar should NEVER show
  const isPublicRoute = 
    pathname === '/' || 
    pathname === '/login' || 
    pathname === '/register' || 
    pathname.startsWith('/admin/login');

  // If on landing page or auth pages, render full width without sidebar
  if (isPublicRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F5] text-slate-800">
        {children}
      </div>
    );
  }

  // If user is trying to access an internal protected page but is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F5] p-4 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-5">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight font-sans">
              Sign In Required
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              To view emergency blood appeals, request blood, or volunteer as a donor, please sign in or create an account.
            </p>
          </div>
          <div className="space-y-2.5 pt-2">
            <Link
              href="/login"
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In to Your Account</span>
            </Link>
            <Link
              href="/register"
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
            >
              <span>Create Free Account</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="text-[11px] font-semibold text-teal-700 hover:underline"
            >
              ← Back to LifeLineX Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // When user is authenticated and on an app page (e.g. /dashboard, /donors, /admin):
  return (
    <div className="flex flex-1 min-h-screen">
      {/* Left Navigation Sidebar - ONLY visible when authenticated */}
      <Sidebar />

      {/* Main Content Area with 16:9 Medical Background Wallpaper */}
      <div 
        className="flex flex-1 flex-col overflow-x-hidden min-w-0 bg-cover bg-top bg-no-repeat bg-fixed relative"
        style={{
          backgroundImage: "url('/blood-donation-background.webp')",
          backgroundColor: "#FAF7F5",
        }}
      >
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto relative z-10">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
