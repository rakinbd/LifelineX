'use client';

import React, { useState } from 'react';
import { Droplet, Heart, ShieldCheck, Clock, UserCheck, AlertCircle, Plus, Check } from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import CompatibilityMatrix from '@/components/blood/CompatibilityMatrix';
import { BloodGroup } from '@/types';

export default function DonorsPage() {
  const { donors, incidents } = useEmergency();
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('ALL');
  const [alertSuccessId, setAlertSuccessId] = useState<string | null>(null);

  const bloodRequests = incidents.filter(i => i.category === 'BLOOD_TRANSFUSION');

  const filteredDonors = donors.filter(d => {
    if (selectedGroupFilter === 'ALL') return true;
    return d.bloodGroup === selectedGroupFilter;
  });

  const handleMobilize = (id: string) => {
    setAlertSuccessId(id);
    setTimeout(() => setAlertSuccessId(null), 3000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2.5">
            <Droplet className="h-6 w-6 text-red-500" />
            <span>Smart Blood Matching & Transfusion Network</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Connecting emergency transfusion appeals with compatible, active, and cooldown-cleared donors globally.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="rounded-full border border-emerald-900/60 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-400 font-mono">
            COOLDOWN STANDARD: 90 DAYS (AABB)
          </span>
        </div>
      </div>

      {/* Active Blood Transfusion Distress Appeals */}
      {bloodRequests.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center space-x-2 font-mono">
              <AlertCircle className="h-4 w-4 text-red-500 animate-pulse" />
              <span>Active Emergency Blood Appeals ({bloodRequests.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bloodRequests.map(req => (
              <div
                key={req.id}
                className="rounded-xl border border-red-900/40 bg-gradient-to-r from-red-950/30 to-slate-900/60 p-4 space-y-2 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-red-400">{req.id}</span>
                    <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-mono font-bold text-white">
                      REQUIRED: {req.requiredBloodGroup} ({req.unitsNeeded || 1} Units)
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">
                    {req.urgency}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{req.title}</h4>
                <p className="text-xs text-slate-300">{req.description}</p>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
                  <span>Location: <strong className="text-slate-200">{req.location.address}</strong></span>
                  <span className="text-sky-400">{req.matchedRespondersCount} Compatible Donors Notified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Universal Compatibility Calculator */}
      <CompatibilityMatrix />

      {/* Verified Donor Registry */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-emerald-400" />
              <span>Verified Regional Donor Registry</span>
            </h3>
            <p className="text-xs text-slate-400">
              Donors with verified medical screening and completed transfusion cooldown eligibility.
            </p>
          </div>

          {/* Blood Group Filter Chips */}
          <div className="flex flex-wrap gap-1">
            {['ALL', 'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(bg => (
              <button
                key={bg}
                onClick={() => setSelectedGroupFilter(bg)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors ${
                  selectedGroupFilter === bg
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        {/* Donors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDonors.map(donor => {
            const isAlerted = alertSuccessId === donor.id;
            return (
              <div
                key={donor.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-950 border border-red-800 text-sm font-mono font-bold text-red-400">
                      {donor.bloodGroup}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center space-x-1">
                        <span>{donor.fullName}</span>
                        {donor.isVerified && <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />}
                      </h4>
                      <p className="text-[11px] text-slate-400">{donor.location.address}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    donor.isAvailable && donor.cooldownEligible
                      ? 'bg-emerald-950 border border-emerald-800 text-emerald-400'
                      : 'bg-slate-800 border border-slate-700 text-slate-500'
                  }`}>
                    {donor.cooldownEligible ? 'ACTIVE' : 'IN COOLDOWN'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1 border-t border-slate-800">
                  <div className="rounded bg-slate-950/60 p-1.5 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">DONATIONS</span>
                    <span className="font-bold text-slate-200 font-mono">{donor.totalDonations}</span>
                  </div>
                  <div className="rounded bg-slate-950/60 p-1.5 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">RESPONSE</span>
                    <span className="font-bold text-emerald-400 font-mono">{donor.responseRatePercent}%</span>
                  </div>
                  <div className="rounded bg-slate-950/60 p-1.5 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">STATUS</span>
                    <span className="font-bold text-sky-400 font-mono">
                      {donor.cooldownEligible ? 'Ready' : 'Cooldown'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    ID: {donor.id}
                  </span>

                  <button
                    onClick={() => handleMobilize(donor.id)}
                    disabled={!donor.cooldownEligible}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      isAlerted
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : donor.cooldownEligible
                        ? 'bg-red-600/90 hover:bg-red-600 border-red-500/50 text-white shadow-sm'
                        : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isAlerted ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Dispatched</span>
                      </>
                    ) : (
                      <>
                        <Droplet className="h-3 w-3" />
                        <span>Mobilize Donor</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
