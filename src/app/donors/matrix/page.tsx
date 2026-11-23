'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Droplet, ShieldCheck, Clock } from 'lucide-react';
import CompatibilityMatrix from '@/components/blood/CompatibilityMatrix';

export default function MatrixPage() {
  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1.5">
            <Link
              href="/donors"
              className="hover:text-slate-800 flex items-center space-x-1 font-medium transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Blood Network</span>
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">Matching Guide</span>
          </div>

          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Blood Group Matching Guide <span className="text-sm font-normal text-teal-700">(ABO & Rh Transfusion Rules)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Simple, easy-to-understand visual guide showing which blood types can give and receive blood safely during medical emergencies.
          </p>
        </div>
      </div>

      {/* Main Compatibility Matrix Tool Component */}
      <CompatibilityMatrix />

      {/* Clinical Notes & Transfusion Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4.5 space-y-2 shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800">
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Droplet className="h-3.5 w-3.5" />
            </div>
            <span>O- Negative (Universal Donor)</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            O- blood lacks A, B, and Rh surface antigens on red blood cells, making it suitable for emergency uncrossmatched transfusion in critical trauma cases.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4.5 space-y-2 shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <span>AB+ Positive (Universal Recipient)</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            AB+ individuals possess both A and B antigens and Rh factor, allowing them to safely accept red blood cells from all eight standard blood groups.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4.5 space-y-2 shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <span>90-Day Donation Interval</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            To safeguard hemoglobin volume and physiological iron reserves, registered donors observe a 90-day cooldown period between whole blood donations.
          </p>
        </div>
      </div>

    </div>
  );
}
