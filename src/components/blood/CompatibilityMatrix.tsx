'use client';

import React, { useState } from 'react';
import { BloodGroup } from '@/types';
import { BLOOD_COMPATIBILITY_TABLE, isBloodCompatible } from '@/lib/matching/bloodCompatibility';
import { Check, X, Info, ShieldCheck, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

const GROUP_METADATA: Record<BloodGroup, { label: string; tag: string }> = {
  'O-': { label: 'Universal Donor', tag: 'Rh Negative' },
  'O+': { label: 'Most Common', tag: 'Rh Positive' },
  'A-': { label: 'A Negative', tag: 'Rh Negative' },
  'A+': { label: 'A Positive', tag: 'Rh Positive' },
  'B-': { label: 'B Negative', tag: 'Rh Negative' },
  'B+': { label: 'B Positive', tag: 'Rh Positive' },
  'AB-': { label: 'AB Negative', tag: 'Rh Negative' },
  'AB+': { label: 'Universal Recipient', tag: 'Rh Positive' },
};

export default function CompatibilityMatrix() {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('B+');

  const compatibleDonors = BLOOD_COMPATIBILITY_TABLE[selectedGroup]?.canReceiveFrom || [];
  const compatibleRecipients = BLOOD_COMPATIBILITY_TABLE[selectedGroup]?.canDonateTo || [];

  return (
    <div className="space-y-6">
      
      {/* Selector Section Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Select Blood Group
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose a blood type to inspect compatible donors and recipients.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <span className="inline-block h-2 w-2 rounded-full bg-teal-500"></span>
            <span>Selected: <strong className="text-slate-800">{selectedGroup}</strong> ({GROUP_METADATA[selectedGroup].label})</span>
          </div>
        </div>

        {/* Modern Selection Grid */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {BLOOD_GROUPS.map((group) => {
            const isSelected = selectedGroup === group;
            const meta = GROUP_METADATA[group];

            return (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-150 ${
                  isSelected
                    ? 'border-[#172B4D] bg-[#172B4D] text-white shadow-sm ring-2 ring-[#172B4D]/20'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:border-slate-300 hover:bg-slate-100/80'
                }`}
              >
                <span className="font-mono text-base font-bold tracking-tight">
                  {group}
                </span>
                <span className={`text-[10px] mt-0.5 font-medium truncate max-w-full ${
                  isSelected ? 'text-teal-200 font-semibold' : 'text-slate-500'
                }`}>
                  {meta.label}
                </span>

                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center">
                    <Check className="h-2 w-2 text-white stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Type Quick Explanation */}
        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs text-slate-600 flex items-start space-x-2.5">
          <Info className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            Blood group <strong className="text-slate-800">{selectedGroup}</strong> ({GROUP_METADATA[selectedGroup].tag}): Can safely receive red blood cells from <strong className="text-slate-800">{compatibleDonors.length} group{compatibleDonors.length > 1 ? 's' : ''}</strong> and can donate to <strong className="text-slate-800">{compatibleRecipients.length} group{compatibleRecipients.length > 1 ? 's' : ''}</strong>.
          </p>
        </div>
      </div>

      {/* Two Balanced Compatibility Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Can Receive From (Eligible Donors) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-100">
                  <ArrowDownLeft className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Eligible Donors (Can Receive From)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Who can donate to a {selectedGroup} patient
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 border border-teal-100">
                {compatibleDonors.length} Compatible
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              When treating a patient with <span className="font-semibold text-slate-800">{selectedGroup}</span> blood, the following donor blood groups are safe for red cell transfusion:
            </p>

            {/* Blood Groups Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {BLOOD_GROUPS.map((donorGroup) => {
                const compatible = isBloodCompatible(donorGroup, selectedGroup);

                return (
                  <div
                    key={donorGroup}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                      compatible
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200/80 text-slate-400'
                    }`}
                  >
                    <span className="font-mono font-bold text-sm">
                      {donorGroup}
                    </span>
                    <span className="flex items-center space-x-1 text-[11px]">
                      {compatible ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[2.5]" />
                          <span className="font-medium text-emerald-700">Safe</span>
                        </>
                      ) : (
                        <>
                          <X className="h-3.5 w-3.5 text-slate-400" />
                          <span>No</span>
                        </>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Compatible donor types: <span className="font-mono font-semibold text-slate-700">{compatibleDonors.join(', ')}</span>
          </div>
        </div>

        {/* Card 2: Can Donate To (Eligible Recipients) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Eligible Recipients (Can Donate To)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Who can receive from a {selectedGroup} donor
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                {compatibleRecipients.length} Compatible
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              If an individual has <span className="font-semibold text-slate-800">{selectedGroup}</span> blood, their red blood cells can be safely administered to:
            </p>

            {/* Blood Groups Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {BLOOD_GROUPS.map((recipientGroup) => {
                const canDonate = compatibleRecipients.includes(recipientGroup);

                return (
                  <div
                    key={recipientGroup}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                      canDonate
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200/80 text-slate-400'
                    }`}
                  >
                    <span className="font-mono font-bold text-sm">
                      {recipientGroup}
                    </span>
                    <span className="flex items-center space-x-1 text-[11px]">
                      {canDonate ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[2.5]" />
                          <span className="font-medium text-emerald-700">Safe</span>
                        </>
                      ) : (
                        <>
                          <X className="h-3.5 w-3.5 text-slate-400" />
                          <span>No</span>
                        </>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Compatible recipient types: <span className="font-mono font-semibold text-slate-700">{compatibleRecipients.join(', ')}</span>
          </div>
        </div>

      </div>

      {/* Clinical Reference Verification Note (Subtle, Clean) */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-start space-x-3 text-xs text-slate-600">
          <ShieldCheck className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h4 className="font-semibold text-slate-800">
              Clinical Verification Information
            </h4>
            <p className="leading-relaxed text-slate-500">
              O- is the Universal Red Cell Donor, suitable for emergency transfusions before laboratory crossmatch testing is completed. AB+ is the Universal Recipient, capable of accepting red blood cells from any blood group. Laboratory crossmatch verification remains required for elective and stable clinical procedures.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
