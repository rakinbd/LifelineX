import React from 'react';
import Link from 'next/link';
import { Shield, Info, Lock, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-8 pb-8 text-xs text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Healthcare & Protocol Notice */}
        <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-slate-600">
              <strong className="text-slate-800 font-semibold">Emergency Notice:</strong>{' '}
              LifeLink is an auxiliary decision-support and mutual-aid platform. In acute life-threatening emergencies, immediately contact your local municipal emergency dispatch number (911, 112, or 999). Preliminary blood compatibility matching provides guidance; certified blood bank and transfusion specialist crossmatching is required prior to transfusion.
            </div>
          </div>
        </div>

        {/* Primary Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
          
          <div>
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-3">
              <Shield className="h-4 w-4 text-teal-600" />
              <span>LIFELINK</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Intelligent emergency alert system connecting distress calls with verified donors, trauma facilities, and medical responders.
            </p>
            <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-teal-700 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
              <span>Regional Node Online</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 text-xs mb-3">Core Modules</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link href="/" className="hover:text-slate-800 transition-colors">Command Center</Link></li>
              <li><Link href="/incidents" className="hover:text-slate-800 transition-colors">Emergency Response</Link></li>
              <li><Link href="/map" className="hover:text-slate-800 transition-colors">Incident Map</Link></li>
              <li><Link href="/donors" className="hover:text-slate-800 transition-colors">Blood Matching</Link></li>
              <li><Link href="/donors/matrix" className="hover:text-slate-800 transition-colors">Compatibility Engine</Link></li>
              <li><Link href="/hospitals" className="hover:text-slate-800 transition-colors">Medical Facilities</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 text-xs mb-3">Safety & Governance</h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center space-x-1.5">
                <Lock className="h-3 w-3 text-slate-400" />
                <span>Privacy & Data Protection</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Globe className="h-3 w-3 text-slate-400" />
                <span>Location Fuzzing (1.5 km radius)</span>
              </li>
              <li><span>Verified Responder Credentialing</span></li>
              <li><span>90-Day Transfusion Cooldown Tracking</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 text-xs mb-3">System Telemetry</h4>
            <p className="text-[11px] text-slate-500 mb-2">
              Continuous regional synchronization across emergency responder networks.
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
          <p>© {new Date().getFullYear()} LifeLink Emergency Alert System. All rights reserved.</p>
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
