'use client';

import React from 'react';
import { Users, Award, Shield, CheckCircle, Navigation, Clock, Activity } from 'lucide-react';
import { MOCK_VOLUNTEERS } from '@/lib/mockData';

export default function VolunteersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2.5">
            <Users className="h-6 w-6 text-emerald-400" />
            <span>Community First-Responder & Disaster Fleet</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Certified community members, off-duty EMTs, and trained disaster volunteers ready for rapid field dispatch.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="rounded-full border border-emerald-900/60 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-400 font-mono">
            FLEET READY: 612 ACTIVE VOLUNTEERS
          </span>
        </div>
      </div>

      {/* Responders Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_VOLUNTEERS.map(vol => (
          <div
            key={vol.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 hover:border-slate-700 transition-colors shadow-lg"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                    {vol.badgeLevel} TIER
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{vol.id}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1.5">{vol.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{vol.location.address}</p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
                <Shield className="h-5 w-5" />
              </div>
            </div>

            {/* Certifications and Skills */}
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1.5">
                CERTIFIED CAPABILITIES
              </span>
              <div className="flex flex-wrap gap-1.5">
                {vol.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-300 border border-slate-700"
                  >
                    {skill.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1 border-t border-slate-800">
              <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800">
                <span className="text-[10px] text-slate-500 block mb-0.5">COMPLETED MISSIONS</span>
                <span className="font-mono text-base font-bold text-white">{vol.completedMissions}</span>
              </div>
              <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800">
                <span className="text-[10px] text-slate-500 block mb-0.5">AVG RESPONSE TIME</span>
                <span className="font-mono text-base font-bold text-emerald-400">{vol.averageResponseMinutes} min</span>
              </div>
            </div>

            {/* Dispatch Action */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-[11px] text-emerald-400 flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Standby Available</span>
              </span>

              <button className="flex items-center space-x-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-500/50 px-3 py-1.5 text-xs font-bold text-white transition-colors">
                <Navigation className="h-3 w-3" />
                <span>Assign Task</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
