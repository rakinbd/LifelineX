import React from 'react';
import Link from 'next/link';
import { Shield, AlertOctagon, Heart, Lock, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 pt-10 pb-8 text-xs text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Critical Emergency Legal Disclaimer */}
        <div className="mb-8 rounded-xl border border-red-900/40 bg-red-950/20 p-4">
          <div className="flex items-start space-x-3">
            <AlertOctagon className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-red-300/90">
              <strong className="text-red-200 uppercase font-semibold">Immediate Emergency Protocol Notice:</strong>{' '}
              LifeLink AI is a community assistance, decision-support, and voluntary mutual-aid coordination platform. 
              It is <strong>NOT</strong> a substitute for official municipal emergency response services (e.g., 911 in North America, 112 in Europe, 999 in the UK). 
              If you or someone around you faces immediate life-threatening physical danger, dial your national emergency number first. 
              Blood compatibility matching is intended for preliminary donor identification; clinical compatibility must be verified by certified transfusion specialists and blood banks.
            </div>
          </div>
        </div>

        {/* Primary Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-900">
          
          <div>
            <div className="flex items-center space-x-2 text-white font-bold font-mono text-sm mb-3">
              <Shield className="h-4 w-4 text-red-500" />
              <span>LIFELINK AI DISPATCH</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Decentralized, intelligent emergency dispatch coordinating verified blood donors, medical transit, and community first-responders worldwide.
            </p>
            <div className="mt-3 flex items-center space-x-2 text-[10px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>Encrypted Geo-Fencing Active</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Core Modules</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link href="/" className="hover:text-white transition-colors">Incident Command Center</Link></li>
              <li><Link href="/map" className="hover:text-white transition-colors">Tactical GIS Emergency Map</Link></li>
              <li><Link href="/donors" className="hover:text-white transition-colors">Smart Blood Donor Matching</Link></li>
              <li><Link href="/hospitals" className="hover:text-white transition-colors">Trauma & ICU Bed Capacity</Link></li>
              <li><Link href="/volunteers" className="hover:text-white transition-colors">Community Volunteer Fleet</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Safety & Governance</h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center space-x-1.5">
                <Lock className="h-3 w-3 text-slate-500" />
                <span>HIPAA & GDPR Privacy Shield</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Globe className="h-3 w-3 text-slate-500" />
                <span>Dynamic Location Fuzzing (1.5km)</span>
              </li>
              <li><span>Verified Responder Credentialing</span></li>
              <li><span>Transfusion Cooldown Tracking (90 Days)</span></li>
              <li><span>Fraud & Abuse Quarantine Queue</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Impact Telemetry</h4>
            <p className="text-[11px] text-slate-400 mb-2">
              Every connected node strengthens community survivability during disaster outages and healthcare surges.
            </p>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Global Response Uptime</span>
                <span className="text-emerald-400 font-mono font-bold">99.98%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '99.9%' }}></div>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} LifeLink AI Emergency Systems. Engineered for Humanitarian Impact.</p>
          <div className="mt-2 sm:mt-0 flex space-x-4">
            <span className="hover:text-slate-300 cursor-pointer">Protocol Standard 1.0</span>
            <span className="hover:text-slate-300 cursor-pointer">Security Whitepaper</span>
            <span className="hover:text-slate-300 cursor-pointer">API Telemetry</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
