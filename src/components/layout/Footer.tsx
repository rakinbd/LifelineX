'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Droplet, 
  Mail, 
  ChevronRight, 
  ShieldCheck, 
  Activity 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-cyan-100/80 bg-gradient-to-b from-[#F0F9FF]/95 via-[#E6F4FE]/70 to-[#F8FAFC] text-slate-800 selection:bg-teal-500 selection:text-white">
      
      {/* Background Subtle Medical Decorations */}
      <div className="absolute top-6 left-[6%] text-cyan-400/20 text-4xl font-bold select-none pointer-events-none">+</div>
      <div className="absolute top-20 right-[8%] text-teal-400/20 text-5xl font-bold select-none pointer-events-none">+</div>
      <div className="absolute bottom-16 left-[48%] text-cyan-300/25 text-3xl font-bold select-none pointer-events-none">+</div>
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-cyan-200/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-teal-200/20 blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-0">
          
          {/* ========================================================================= */}
          {/* Section 1 – Brand Identity (lg: 4 cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 lg:pr-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Logo & Brand Header */}
              <Link href="/" className="inline-flex items-center space-x-3 group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 to-teal-50 border border-cyan-200/80 p-1.5 shadow-xs group-hover:scale-105 transition-transform">
                  <img
                    src="/logo.png"
                    alt="LifeLineX Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tight text-[#172B4D] font-sans leading-tight">
                    LifeLine<span className="text-rose-600">X</span>
                  </span>
                  <span className="text-xs text-teal-700 font-bold tracking-tight">
                    Connect • Respond • Save Lives
                  </span>
                </div>
              </Link>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
                A smart platform to connect blood donors with those in need. Together, let&apos;s build a healthier and kinder society.
              </p>
            </div>

            {/* Medical Network Verification Badge */}
            <div className="pt-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/90 border border-cyan-200/80 text-[11px] font-semibold text-teal-800 shadow-2xs">
                <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                <span>100% Free Voluntary Transfusion Network</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* Section 2 – Quick Links (lg: 2 cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-2 lg:px-6 lg:border-l lg:border-slate-200/80 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-4 rounded-full bg-teal-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#172B4D]">
                Quick Links
              </h3>
            </div>
            
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link
                  href="/"
                  className="group flex items-center space-x-1.5 text-slate-600 hover:text-teal-700 transition-colors py-0.5"
                >
                  <ChevronRight className="h-3 w-3 text-cyan-500 transition-transform group-hover:translate-x-0.5" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/donors?tab=registry"
                  className="group flex items-center space-x-1.5 text-slate-600 hover:text-teal-700 transition-colors py-0.5"
                >
                  <ChevronRight className="h-3 w-3 text-cyan-500 transition-transform group-hover:translate-x-0.5" />
                  <span>Find Donor</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/donors?tab=donate"
                  className="group flex items-center space-x-1.5 text-slate-600 hover:text-teal-700 transition-colors py-0.5"
                >
                  <ChevronRight className="h-3 w-3 text-cyan-500 transition-transform group-hover:translate-x-0.5" />
                  <span>Become Donor</span>
                </Link>
              </li>
              <li>
                <a
                  href="/#how-it-works"
                  className="group flex items-center space-x-1.5 text-slate-600 hover:text-teal-700 transition-colors py-0.5"
                >
                  <ChevronRight className="h-3 w-3 text-cyan-500 transition-transform group-hover:translate-x-0.5" />
                  <span>About Us</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:220108.cse@student.just.edu.bd"
                  className="group flex items-center space-x-1.5 text-slate-600 hover:text-teal-700 transition-colors py-0.5"
                >
                  <ChevronRight className="h-3 w-3 text-cyan-500 transition-transform group-hover:translate-x-0.5" />
                  <span>Contact</span>
                </a>
              </li>
            </ul>
          </div>

          {/* ========================================================================= */}
          {/* Section 3 – Support (lg: 2 cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-2 lg:px-6 lg:border-l lg:border-slate-200/80 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-4 rounded-full bg-cyan-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#172B4D]">
                Support
              </h3>
            </div>

            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a
                  href="/#why-donate"
                  className="group flex items-center space-x-1.5 text-slate-600 hover:text-teal-700 transition-colors py-0.5"
                >
                  <ChevronRight className="h-3 w-3 text-cyan-500 transition-transform group-hover:translate-x-0.5" />
                  <span>FAQs</span>
                </a>
              </li>
              <li>
                <a
                  href="/#how-it-works"
                  className="group flex items-center space-x-1.5 text-slate-600 hover:text-teal-700 transition-colors py-0.5"
                >
                  <ChevronRight className="h-3 w-3 text-cyan-500 transition-transform group-hover:translate-x-0.5" />
                  <span>Help Center</span>
                </a>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="group flex items-center space-x-1.5 text-slate-600 hover:text-teal-700 transition-colors py-0.5"
                >
                  <ChevronRight className="h-3 w-3 text-cyan-500 transition-transform group-hover:translate-x-0.5" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#blood-guide"
                  className="group flex items-center space-x-1.5 text-slate-600 hover:text-teal-700 transition-colors py-0.5"
                >
                  <ChevronRight className="h-3 w-3 text-cyan-500 transition-transform group-hover:translate-x-0.5" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <a
                  href="mailto:220108.cse@student.just.edu.bd?subject=Report%20Issue%20-%20LifeLineX"
                  className="group flex items-center space-x-1.5 text-slate-600 hover:text-rose-600 transition-colors py-0.5"
                >
                  <ChevronRight className="h-3 w-3 text-rose-500 transition-transform group-hover:translate-x-0.5" />
                  <span>Report Issue</span>
                </a>
              </li>
            </ul>
          </div>

          {/* ========================================================================= */}
          {/* Section 4 – Developed By (lg: 4 cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 lg:pl-8 lg:border-l lg:border-slate-200/80 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-4 rounded-full bg-teal-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#172B4D]">
                Developed By
              </h3>
            </div>

            <div className="space-y-3 pt-1">
              
              {/* Developer 1: Md Abir Hasan */}
              <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-white/90 border border-cyan-100 shadow-2xs hover:shadow-xs hover:border-cyan-200 transition-all">
                <img
                  src="/developers/abir.jpg"
                  alt="Md Abir Hasan"
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-cyan-400 border-2 border-white shadow-xs shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-[#172B4D] truncate leading-tight">
                    Md Abir Hasan
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                    Dept. of CSE, JUST
                  </p>
                  <a
                    href="mailto:220141.cse@student.just.edu.bd"
                    className="inline-flex items-center space-x-1 text-[11px] text-teal-700 hover:text-teal-900 font-medium transition-colors mt-0.5 max-w-full"
                    title="Send Email to Md Abir Hasan"
                  >
                    <Mail className="h-3 w-3 text-cyan-600 shrink-0" />
                    <span className="truncate">220141.cse@student.just.edu.bd</span>
                  </a>
                </div>
              </div>

              {/* Developer 2: Md Rakin Afsar */}
              <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-white/90 border border-cyan-100 shadow-2xs hover:shadow-xs hover:border-cyan-200 transition-all">
                <img
                  src="/developers/rakin.jpg"
                  alt="Md Rakin Afsar"
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-cyan-400 border-2 border-white shadow-xs shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-[#172B4D] truncate leading-tight">
                    Md Rakin Afsar
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                    Dept. of CSE, JUST
                  </p>
                  <a
                    href="mailto:220108.cse@student.just.edu.bd"
                    className="inline-flex items-center space-x-1 text-[11px] text-teal-700 hover:text-teal-900 font-medium transition-colors mt-0.5 max-w-full"
                    title="Send Email to Md Rakin Afsar"
                  >
                    <Mail className="h-3 w-3 text-cyan-600 shrink-0" />
                    <span className="truncate">220108.cse@student.just.edu.bd</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* Bottom Copyright & ECG Pulse Section */}
      {/* ========================================================================= */}
      <div className="border-t border-cyan-100/90 bg-white/70 backdrop-blur-xs py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          
          {/* Left: Copyright */}
          <div className="text-center md:text-left text-[11px] sm:text-xs">
            <span>© 2026 <strong>LifeLineX</strong>. All rights reserved.</span>
          </div>

          {/* Center: Heart & Blood Drop Slogan */}
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-semibold text-slate-700 bg-white px-3.5 py-1.5 rounded-full border border-cyan-200/80 shadow-2xs">
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-pulse shrink-0" />
            <Droplet className="h-3.5 w-3.5 text-rose-600 fill-rose-600 shrink-0" />
            <span>Together for a Healthier Tomorrow</span>
          </div>

          {/* Right: Decorative ECG Heartbeat Line */}
          <div className="flex items-center space-x-2 text-teal-600" title="Live Heartbeat ECG">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-teal-700 hidden sm:inline">
              Vitals Nominal
            </span>
            <svg 
              className="h-5 w-24 text-teal-600" 
              viewBox="0 0 120 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M0 12 h35 L42 3 L49 21 L56 7 L63 17 L68 12 h52" />
            </svg>
          </div>

        </div>
      </div>

    </footer>
  );
}