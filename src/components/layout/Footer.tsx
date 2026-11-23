import React from 'react';
import Link from 'next/link';
import { Shield, Info, Lock, Globe, Droplet } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-md pt-8 pb-8 text-xs text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Healthcare & Protocol Notice */}
        <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-slate-600">
              <strong className="text-slate-800 font-semibold">LifeLineX Medical Protocol:</strong>{' '}
              LifeLineX is an intelligent decision-support and mutual-aid community platform. In acute life-threatening situations, contact certified emergency services immediately. Preliminary blood compatibility calculations provide guidance; laboratory cross-matching by certified blood bank transfusion specialists is required prior to transfusion.
            </div>
          </div>
        </div>

        {/* Primary Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
          
          <div>
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50/80 border border-teal-200/60 p-0.5 shadow-2xs">
                <img
                  src="/logo.png"
                  alt="LifeLineX Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-extrabold font-sans text-base text-[#172B4D]">
                LifeLine<span className="text-teal-600">X</span>
              </span>
            </div>
            <p className="text-[11px] font-semibold text-teal-700 mb-2">
              Connect • Respond • Save Lives
            </p>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Coordinated voluntary blood donation and emergency patient transfusion network connecting screened donors with urgent requests in real time.
            </p>
            <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-teal-700 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse"></span>
              <span>LifeLineX Network Nominal</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 text-xs mb-3">Core Services</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link href="/" className="hover:text-slate-800 transition-colors">Command Center</Link></li>
              <li><Link href="/donors?tab=appeals" className="hover:text-slate-800 transition-colors">Blood Appeals Queue</Link></li>
              <li><Link href="/donors?tab=request" className="hover:text-slate-800 transition-colors">Submit Blood Request</Link></li>
              <li><Link href="/donors?tab=donate" className="hover:text-slate-800 transition-colors">Voluntary Donor Registry</Link></li>
              <li><Link href="/donors/matrix" className="hover:text-slate-800 transition-colors">Compatibility Matrix</Link></li>
              <li><Link href="/admin" className="hover:text-slate-800 transition-colors">Admin Access Control</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 text-xs mb-3">Safety & Standards</h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center space-x-1.5">
                <Lock className="h-3 w-3 text-slate-400" />
                <span>Encrypted Health Records</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Globe className="h-3 w-3 text-slate-400" />
                <span>Location Privacy Protection</span>
              </li>
              <li><span>Screened Donor Verification</span></li>
              <li><span>90-Day Clinical Cooldown Recovery</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 text-xs mb-3">Platform Status</h4>
            <p className="text-[11px] text-slate-500 mb-2">
              Continuous synchronization across regional voluntary blood donor centers.
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-600 font-medium">System Uptime</span>
                <span className="text-teal-700 font-mono font-bold">99.98%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: '99.98%' }}></div>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} LifeLineX. Connect • Respond • Save Lives. All rights reserved.</p>
          <div className="mt-2 sm:mt-0 flex space-x-4">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-600 cursor-pointer">Clinical Protocols</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
