'use client';

import React, { useState } from 'react';
import { BloodGroup } from '@/types';
import { BLOOD_COMPATIBILITY_TABLE, isBloodCompatible } from '@/lib/matching/bloodCompatibility';
import { Droplet, Check, X, ShieldAlert, Info } from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export default function CompatibilityMatrix() {
  const [selectedRecipient, setSelectedRecipient] = useState<BloodGroup>('B+');

  const compatibleDonors = BLOOD_COMPATIBILITY_TABLE[selectedRecipient]?.canReceiveFrom || [];
  const canDonateToList = BLOOD_COMPATIBILITY_TABLE[selectedRecipient]?.canDonateTo || [];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Droplet className="h-5 w-5 text-red-500" />
            <span>Universal Blood Transfusion Compatibility Engine</span>
          </h3>
          <p className="text-xs text-slate-400">
            Based on international AABB/WHO red cell antigen-antibody compatibility protocols.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
          <Info className="h-3.5 w-3.5 text-blue-400" />
          <span>Interactive Calculator</span>
        </div>
      </div>

      {/* Recipient Blood Group Selector Tabs */}
      <div className="mt-4">
        <label className="text-xs font-semibold text-slate-300 block mb-2">
          Select Patient / Recipient Blood Group:
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {BLOOD_GROUPS.map((group) => {
            const isSelected = selectedRecipient === group;
            return (
              <button
                key={group}
                onClick={() => setSelectedRecipient(group)}
                className={`py-2 px-1 rounded-xl text-center font-mono font-bold text-sm border transition-all ${
                  isSelected
                    ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-950/80 scale-105'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                }`}
              >
                {group}
              </button>
            );
          })}
        </div>
      </div>

      {/* Computed Compatibility Diagnostic Panel */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Can Receive From */}
        <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/15 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
              Eligible Donors for Patient ({selectedRecipient})
            </span>
            <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
              {compatibleDonors.length} Compatible Groups
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Patients with {selectedRecipient} blood can safely accept red cell units from:
          </p>
          <div className="flex flex-wrap gap-2">
            {BLOOD_GROUPS.map((donorGroup) => {
              const compatible = isBloodCompatible(donorGroup, selectedRecipient);
              return (
                <div
                  key={donorGroup}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border ${
                    compatible
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900/40 text-slate-600 border-slate-800/40 line-through opacity-40'
                  }`}
                >
                  {compatible ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-red-500/60" />}
                  <span>{donorGroup}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Can Donate To */}
        <div className="rounded-xl border border-sky-900/40 bg-sky-950/15 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wide">
              {selectedRecipient} Donors Can Give Blood To
            </span>
            <span className="text-[10px] font-mono text-sky-300 font-bold bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60">
              {canDonateToList.length} Recipient Groups
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            If a donor has {selectedRecipient} blood, their red cells can be transfused into:
          </p>
          <div className="flex flex-wrap gap-2">
            {BLOOD_GROUPS.map((recipientGroup) => {
              const canDonate = canDonateToList.includes(recipientGroup);
              return (
                <div
                  key={recipientGroup}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border ${
                    canDonate
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-slate-900/40 text-slate-600 border-slate-800/40 line-through opacity-40'
                  }`}
                >
                  {canDonate ? <Check className="h-3 w-3 text-sky-400" /> : <X className="h-3 w-3 text-red-500/60" />}
                  <span>{recipientGroup}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Clinical Reference Footnote */}
      <div className="mt-4 flex items-center space-x-2 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
        <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
        <span>
          <strong>Clinical Verification Rule:</strong> O- is the Universal Red Cell Donor, while AB+ is the Universal Recipient. In emergency trauma before crossmatch, emergency uncrossmatched O- units are dispatched.
        </span>
      </div>
    </div>
  );
}
