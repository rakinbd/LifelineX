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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Droplet className="h-5 w-5 text-red-600" />
            <span>Universal Blood Transfusion Compatibility Engine</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Based on international AABB/WHO red cell antigen-antibody compatibility protocols.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
          <Info className="h-3.5 w-3.5 text-blue-600" />
          <span>Clinical Matrix</span>
        </div>
      </div>

      {/* Recipient Blood Group Selector Tabs */}
      <div className="mt-5">
        <label className="text-xs font-bold text-slate-700 block mb-2">
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
                    ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-200 scale-105'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                {group}
              </button>
            );
          })}
        </div>
      </div>

      {/* Computed Compatibility Diagnostic Panel */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Can Receive From */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
              Eligible Donors for Patient ({selectedRecipient})
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-xs">
              {compatibleDonors.length} Compatible Groups
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mb-3">
            Patients with {selectedRecipient} blood can safely accept red cell units from:
          </p>
          <div className="flex flex-wrap gap-2">
            {BLOOD_GROUPS.map((donorGroup) => {
              const compatible = isBloodCompatible(donorGroup, selectedRecipient);
              return (
                <div
                  key={donorGroup}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                    compatible
                      ? 'bg-white text-emerald-800 border-emerald-300 shadow-sm'
                      : 'bg-slate-100/60 text-slate-400 border-slate-200 line-through opacity-50'
                  }`}
                >
                  {compatible ? <Check className="h-3 w-3 text-emerald-600" /> : <X className="h-3 w-3 text-slate-400" />}
                  <span>{donorGroup}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Can Donate To */}
        <div className="rounded-2xl border border-sky-200 bg-sky-50/40 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-sky-800 uppercase tracking-wide">
              {selectedRecipient} Donors Can Give Blood To
            </span>
            <span className="text-[10px] font-mono text-sky-700 font-bold bg-white px-2 py-0.5 rounded border border-sky-200 shadow-xs">
              {canDonateToList.length} Recipient Groups
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mb-3">
            If a donor has {selectedRecipient} blood, their red cells can be transfused into:
          </p>
          <div className="flex flex-wrap gap-2">
            {BLOOD_GROUPS.map((recipientGroup) => {
              const canDonate = canDonateToList.includes(recipientGroup);
              return (
                <div
                  key={recipientGroup}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                    canDonate
                      ? 'bg-white text-sky-800 border-sky-300 shadow-sm'
                      : 'bg-slate-100/60 text-slate-400 border-slate-200 line-through opacity-50'
                  }`}
                >
                  {canDonate ? <Check className="h-3 w-3 text-sky-600" /> : <X className="h-3 w-3 text-slate-400" />}
                  <span>{recipientGroup}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Clinical Reference Footnote */}
      <div className="mt-5 flex items-center space-x-2 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
        <span>
          <strong>Clinical Verification Rule:</strong> O- is the Universal Red Cell Donor, while AB+ is the Universal Recipient. In emergency trauma before laboratory crossmatch, emergency uncrossmatched O- units are dispatched.
        </span>
      </div>
    </div>
  );
}
