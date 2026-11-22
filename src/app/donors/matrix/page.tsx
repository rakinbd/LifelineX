'use client';

import React from 'react';
import Link from 'next/link';
import { GitFork, ArrowLeft, Droplet, ShieldCheck, Info } from 'lucide-react';
import CompatibilityMatrix from '@/components/blood/CompatibilityMatrix';

export default function MatrixPage() {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Link
              href="/donors"
              className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 mr-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Donor Network</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-mono text-red-400 font-bold">CLINICAL CALCULATOR</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide mt-1 flex items-center space-x-2">
            <GitFork className="h-5 w-5 text-red-500" />
            <span>Universal Blood Transfusion Compatibility Engine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive clinical decision tool enforcing ABO and Rh-factor compatibility standards for emergency whole blood, packed red cells, and apheresis platelets.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="rounded-full border border-emerald-900/60 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-400 font-mono">
            AABB / WHO STANDARDS ENFORCED
          </span>
        </div>
      </div>

      {/* Main Compatibility Matrix Tool */}
      <CompatibilityMatrix />

      {/* Clinical Notes & Transfusion Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-red-400 font-mono">
            <Droplet className="h-4 w-4" />
            <span>O- NEGATIVE (UNIVERSAL DONOR)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            O- blood lacks A, B, and Rh surface antigens on red blood cells, making it safe for emergency transfusion into patients of any blood group before clinical crossmatch testing.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-400 font-mono">
            <ShieldCheck className="h-4 w-4" />
            <span>AB+ POSITIVE (UNIVERSAL RECIPIENT)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            AB+ patients possess both A and B antigens and the Rh factor, allowing them to safely receive red blood cell units from all 8 blood groups without immune rejection.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 font-mono">
            <Info className="h-4 w-4" />
            <span>90-DAY DONATION COOLDOWN</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            To safeguard donor hemoglobin and physiological iron stores, registered donors are placed in a mandatory 90-day cooldown period following each successful donation.
          </p>
        </div>
      </div>

    </div>
  );
}
