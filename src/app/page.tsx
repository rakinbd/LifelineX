'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Droplet, 
  Heart, 
  ArrowRight, 
  PlusCircle, 
  Users, 
  ShieldCheck, 
  Clock, 
  GitFork, 
  Activity, 
  Building2, 
  CheckCircle2, 
  Phone, 
  Sparkles, 
  AlertCircle, 
  LogIn, 
  UserPlus, 
  Shield, 
  Check, 
  HeartHandshake, 
  HelpCircle,
  PhoneCall,
  Calendar,
  Lock
} from 'lucide-react';
import { useRole } from '@/context/RoleContext';

export default function LandingPage() {
  const { user, isAuthenticated, logout } = useRole();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F5] text-slate-800 font-sans selection:bg-rose-500 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. PUBLIC TOP NAVIGATION BAR (NO SIDEBAR!) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-50 to-teal-50 border border-slate-200 p-1 shadow-2xs group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="LifeLineX Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-[#172B4D] leading-tight">
                LifeLine<span className="text-rose-600">X</span>
              </span>
              <span className="text-xs text-teal-700 font-bold tracking-tight">
                Connect • Respond • Save Lives
              </span>
            </div>
          </Link>

          {/* Navigation Links for Public Info */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-rose-600 transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-rose-600 transition-colors">
              Features
            </a>
            <a href="#urgent-appeals" className="hover:text-rose-600 transition-colors">
              Urgent Blood Needs
            </a>
            <a href="#blood-guide" className="hover:text-rose-600 transition-colors">
              Blood Matching Guide
            </a>
            <a href="#why-donate" className="hover:text-rose-600 transition-colors">
              Why Donate
            </a>
          </nav>

          {/* User Auth Buttons or Active Session Action */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2.5">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
                >
                  <Activity className="h-4 w-4" />
                  <span>Go to Blood Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors shadow-2xs"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  href="/login"
                  className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5 text-slate-500" />
                  <span>Sign In</span>
                </Link>

                <Link
                  href="/register"
                  className="flex items-center space-x-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Register Free</span>
                </Link>
              </div>
            )}

            {/* Subtle Admin Portal link */}
            <Link
              href="/admin/login"
              title="Hospital & Administrator Login"
              className="hidden lg:flex items-center space-x-1 p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[11px] font-semibold">Admin</span>
            </Link>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION WITH HIGH-IMPACT MEDICAL MISSION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        
        {/* Subtle Decorative Background Rings */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-rose-200/30 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-teal-200/30 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col (Text & CTAs) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                <span className="flex h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
                <span>Real-Time Community Emergency Transfusion Network</span>
              </div>

              <h1 className="font-oswald text-4xl sm:text-6xl lg:text-7xl font-bold text-[#172B4D] tracking-tight leading-[1.1] uppercase">
                Every Drop Matters. <br />
                <span className="text-red-600">
                  Connect Directly
                </span> With Life-Saving Donors.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                LifeLineX is Bangladesh’s intelligent voluntary blood network connecting patients in critical hospital emergencies with healthy, screened local donors within minutes. 100% voluntary, fast, and transparent.
              </p>

              {/* Primary Call-to-Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/login?action=request"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-2xl bg-rose-600 hover:bg-rose-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-600/25 active:scale-95 transition-all"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Request Emergency Blood</span>
                </Link>

                <Link
                  href="/register"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-2xl border-2 border-slate-300 hover:border-slate-400 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-50 transition-all shadow-xs"
                >
                  <Heart className="h-4 w-4 text-rose-600" />
                  <span>Become a Voluntary Donor</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Zero Commercial Intermediaries</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4 text-teal-600" />
                  <span>Screened Compatibility & Recovery</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span>Avg. 4.8 min Response</span>
                </div>
              </div>

            </div>

            {/* Right Col (Hero Interactive Card) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xl space-y-5">
                
                {/* Live Urgent Transfusion Status */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-3 w-3 rounded-full bg-rose-500 animate-ping" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Live Hospital Needs Right Now
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active System
                  </span>
                </div>

                {/* Sample Urgent Cards */}
                <div className="space-y-3">
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded font-mono font-black text-xs bg-rose-600 text-white">
                          O-
                        </span>
                        <span className="text-xs font-bold text-slate-900">Dhaka Medical College (DMCH)</span>
                      </div>
                      <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg">
                        CRITICAL • 2 Units
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Emergency trauma surgery patient requires immediate universal red cells.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded font-mono font-black text-xs bg-rose-600 text-white">
                          B+
                        </span>
                        <span className="text-xs font-bold text-slate-900">National Institute of Cancer (NICRH)</span>
                      </div>
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg">
                        URGENT • 1 Unit
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Pediatric oncology chemotherapy transfusion scheduled for morning.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded font-mono font-black text-xs bg-rose-600 text-white">
                          A+
                        </span>
                        <span className="text-xs font-bold text-slate-900">Kurmitola General Hospital</span>
                      </div>
                      <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2.5 py-1 rounded-lg">
                        URGENT • 2 Units
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Maternal emergency delivery support transfusion required today.
                    </p>
                  </div>
                </div>

                {/* Live Donor Network Stats Banner */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-lg font-black text-rose-600 font-mono block">1,420+</span>
                    <span className="text-[10px] text-slate-500 font-medium">Screened Donors</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-lg font-black text-emerald-600 font-mono block">98%</span>
                    <span className="text-[10px] text-slate-500 font-medium">Match Accuracy</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-lg font-black text-[#172B4D] font-mono block">100%</span>
                    <span className="text-[10px] text-slate-500 font-medium">Free Network</span>
                  </div>
                </div>

                {/* Sign In CTA to Access Full Features */}
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#172B4D] hover:bg-[#243B53] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <span>Sign In to Respond or Request Blood</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. HOW IT WORKS SECTION */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Simple & Rapid Emergency Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              How LifeLineX Saves Lives in 3 Simple Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              When someone is battling for their life in a hospital room, seconds count. Here is how our network responds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-6 space-y-4 hover:border-slate-300 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 font-mono font-bold text-lg">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">
                1. Post Emergency Blood Need
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter the patient&apos;s blood group, hospital location, and units required. In less than 60 seconds, your appeal is active.
              </p>
              <div className="text-[11px] font-semibold text-rose-700 bg-rose-50 p-2 rounded-xl border border-rose-100">
                ✓ No complicated paperwork or delays
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-6 space-y-4 hover:border-slate-300 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 font-mono font-bold text-lg">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">
                2. Instant Nearby Donor Alert
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our matching system alerts compatible donors who have completed their safe 90-day recovery interval within your geographic area.
              </p>
              <div className="text-[11px] font-semibold text-teal-700 bg-teal-50 p-2 rounded-xl border border-teal-100">
                ✓ Automated antigen & safe recovery check
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-6 space-y-4 hover:border-slate-300 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 font-mono font-bold text-lg">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">
                3. Direct Hospital Transfusion
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The voluntary donor accepts the request and proceeds directly to the designated hospital transfusion unit. A life is saved.
              </p>
              <div className="text-[11px] font-semibold text-sky-700 bg-sky-50 p-2 rounded-xl border border-sky-100">
                ✓ Direct communication with patient attendant
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PLATFORM FEATURES (CLEAR & USER-FRIENDLY NAMES!) */}
      {/* ========================================================================= */}
      <section id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Core Network Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Designed for Speed, Safety & Clarity
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Clear tools that any family member, patient, or voluntary donor can understand and use immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1: Emergency Blood Hub */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs hover:border-rose-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-11 w-11 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Emergency Blood Hub <br />
                  <span className="text-xs font-normal text-rose-700">(Real-Time Patient Assistance)</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time dashboard showing urgent patient appeals across hospitals, units needed, and immediate donor response status.
                </p>
              </div>
              <Link
                href="/login"
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1 pt-2"
              >
                <span>Access Blood Hub</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Feature 2: Next Donation Date & Recovery Tracker */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Donation Eligibility Tracker <br />
                  <span className="text-xs font-normal text-amber-700">(90-Day Safe Recovery Cycle)</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automatic 90-day recovery countdown ensuring voluntary donors never donate before their body has fully regenerated healthy blood.
                </p>
              </div>
              <Link
                href="/login"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1 pt-2"
              >
                <span>Check Eligibility</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Feature 3: Blood Group Matching Guide */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-11 w-11 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                  <GitFork className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Blood Group Matching Guide <br />
                  <span className="text-xs font-normal text-teal-700">(ABO & Rh Compatibility)</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Simple, visual explanation of biological compatibility: who can donate to whom, universal donors (O-), and universal recipients (AB+).
                </p>
              </div>
              <a
                href="#blood-guide"
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center space-x-1 pt-2"
              >
                <span>View Matching Chart</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Feature 4: Verified Voluntary Donors */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-11 w-11 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Verified Local Donors <br />
                  <span className="text-xs font-normal text-purple-700">(Screened Community Registry)</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Community directory of screened voluntary citizens organized by city, area, and blood type, ready to help during crises.
                </p>
              </div>
              <Link
                href="/login"
                className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center space-x-1 pt-2"
              >
                <span>Browse Donors</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4.5 RESPONSIVE CARDS (EXACT SPECIFICATION FROM USER IMAGE) */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#18181B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-oswald text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wider text-white uppercase">
              RESPONSIVE CARDS
            </h2>
            <p className="text-base text-slate-300">
              Screened voluntary blood donors ready to respond directly to urgent emergency transfusions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1: Jhon */}
            <div className="rounded-2xl border border-slate-700 bg-white text-slate-900 overflow-hidden shadow-2xl flex flex-col justify-between group">
              <div className="relative w-full h-72 overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"
                  alt="Jhon"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <h3 className="font-oswald text-3xl font-bold text-slate-900 tracking-tight">
                    Jhon
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Dedicated voluntary blood donor actively screened for emergency hospital transfusions and trauma response support.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/donors"
                    className="inline-block py-3 px-6 rounded-lg bg-[#1E1E1E] hover:bg-black text-white font-oswald text-base font-semibold tracking-wide transition-colors"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Mario */}
            <div className="rounded-2xl border border-slate-700 bg-white text-slate-900 overflow-hidden shadow-2xl flex flex-col justify-between group">
              <div className="relative w-full h-72 overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                  alt="Mario"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <h3 className="font-oswald text-3xl font-bold text-slate-900 tracking-tight">
                    Mario
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Committed community blood advocate ready for regional emergency appeals with guaranteed safe recovery monitoring.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/donors"
                    className="inline-block py-3 px-6 rounded-lg bg-[#1E1E1E] hover:bg-black text-white font-oswald text-base font-semibold tracking-wide transition-colors"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3: Elena */}
            <div className="rounded-2xl border border-slate-700 bg-white text-slate-900 overflow-hidden shadow-2xl flex flex-col justify-between group">
              <div className="relative w-full h-72 overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80"
                  alt="Elena"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <h3 className="font-oswald text-3xl font-bold text-slate-900 tracking-tight">
                    Elena
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Universal donor with 9 completed life-saving units. Registered on standby for critical surgeries and intensive care units.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/donors"
                    className="inline-block py-3 px-6 rounded-lg bg-[#1E1E1E] hover:bg-black text-white font-oswald text-base font-semibold tracking-wide transition-colors"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BLOOD GROUP MATCHING GUIDE (EASY TO UNDERSTAND) */}
      {/* ========================================================================= */}
      <section id="blood-guide" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Simple Biology Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Who Can Donate Blood to Whom? (Compatibility Guide)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Not all blood types can safely mix. Here is the straightforward matching guide so you know exactly which blood type your patient can receive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-black text-rose-900">O Negative (O-)</span>
                <span className="text-xs font-bold text-rose-800 bg-rose-200 px-2.5 py-1 rounded-lg">Universal Donor</span>
              </div>
              <p className="text-xs text-slate-600">
                Can donate to: <strong>All Blood Groups (Everyone)</strong>
              </p>
              <p className="text-xs text-slate-500">
                Can receive from: <strong>Only O-</strong>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-black text-slate-900">O Positive (O+)</span>
                <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2.5 py-1 rounded-lg">Most Common</span>
              </div>
              <p className="text-xs text-slate-600">
                Can donate to: <strong>O+, A+, B+, AB+</strong>
              </p>
              <p className="text-xs text-slate-500">
                Can receive from: <strong>O+, O-</strong>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-black text-slate-900">A / B Positive</span>
                <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2.5 py-1 rounded-lg">Common Groups</span>
              </div>
              <p className="text-xs text-slate-600">
                Can donate to: <strong>Same type & AB+</strong>
              </p>
              <p className="text-xs text-slate-500">
                Can receive from: <strong>Same type, O+, O-</strong>
              </p>
            </div>

            <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-black text-teal-900">AB Positive (AB+)</span>
                <span className="text-xs font-bold text-teal-800 bg-teal-200 px-2.5 py-1 rounded-lg">Universal Recipient</span>
              </div>
              <p className="text-xs text-slate-600">
                Can donate to: <strong>Only AB+</strong>
              </p>
              <p className="text-xs text-teal-700 font-semibold">
                Can receive from: <strong>All Blood Groups (Everyone)</strong>
              </p>
            </div>

          </div>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline"
            >
              <span>Explore Interactive Compatibility Calculator in Member Portal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. WHY DONATE BLOOD (FAQS & SAFE RECOVERY) */}
      {/* ========================================================================= */}
      <section id="why-donate" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Health & Community Benefits
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Why Donate Blood on LifeLineX?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Donating blood is completely safe, medically beneficial, and saves up to 3 human lives in a single session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Heart className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Saves Up to 3 Lives</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                One bag of whole blood can be separated into red blood cells, platelets, and plasma, helping patients facing surgery, cancer, and childbirth.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Activity className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Stimulates Blood Cell Renewal</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your bone marrow produces fresh, healthy red blood cells within weeks following donation, promoting better cardiovascular health.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Guaranteed 90-Day Safe Recovery</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our platform strictly monitors the 90-day safe interval between whole blood donations so your body always has ample time to replenish iron stores.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CALL TO ACTION BANNER (SIGN IN / REGISTER) */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#0F172A] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            <HeartHandshake className="h-3.5 w-3.5" />
            <span>Join Hundreds of Screened Voluntary Donors</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Be Someone&apos;s Lifeline Today. <br />
            Sign Up in Less Than 2 Minutes.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Whether you need blood for an admitted family member or want to be on standby as a voluntary donor, your account gives you instant life-saving capabilities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl active:scale-95 transition-all"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-white/20 hover:bg-white/10 text-white font-semibold text-sm transition-all"
            >
              Sign In to Existing Account
            </Link>
          </div>

          <div className="pt-4 text-[11px] text-slate-400">
            Emergency Medical Coordinator or Hospital Admin?{' '}
            <Link href="/admin/login" className="text-teal-400 hover:underline font-semibold">
              Log in through Admin Portal →
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. LANDING FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-white border-t border-slate-200 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="LifeLineX"
                className="h-8 w-8 object-contain"
              />
              <span className="font-black text-slate-900 text-base">
                LifeLine<span className="text-rose-600">X</span>
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                | Intelligent Blood Donation & Emergency Transfusion Matching Network
              </span>
            </div>

            <div className="flex items-center space-x-4 text-xs">
              <Link href="/login" className="hover:text-slate-900 transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="hover:text-slate-900 transition-colors">
                Register
              </Link>
              <Link href="/admin/login" className="hover:text-purple-600 transition-colors font-medium">
                Admin Portal
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© 2026 LifeLineX Network. 100% Non-profit Voluntary Community.</p>
            <p>Direct emergency transfusion coordination between screened citizens and registered hospitals.</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
