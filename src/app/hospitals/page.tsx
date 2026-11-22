'use client';

import React from 'react';
import { Building2, Phone, Bed, Activity, Ambulance, ShieldCheck, Droplet } from 'lucide-react';
import { MOCK_FACILITIES } from '@/lib/mockData';

export default function HospitalsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2.5">
            <Building2 className="h-6 w-6 text-sky-400" />
            <span>Emergency Facilities, Trauma Beds & Ambulance Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Live telemetry of Level-1 trauma capacity, ICU bed availability, and blood bank cryo-reserves.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="rounded-full border border-sky-900/60 bg-sky-950/40 px-3 py-1 text-xs text-sky-400 font-mono">
            HOSPITAL CAD LINK: SYNCHRONIZED
          </span>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_FACILITIES.map(facility => (
          <div
            key={facility.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 hover:border-slate-700 transition-colors shadow-lg"
          >
            {/* Facility Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-sky-400 uppercase bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60">
                  {facility.type.replace('_', ' ')}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{facility.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{facility.location.address}</p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-950/80 border border-sky-800/80 text-sky-400">
                <Building2 className="h-5 w-5" />
              </div>
            </div>

            {/* Capacity Telemetry Numbers */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800">
                <div className="flex items-center justify-center space-x-1 text-slate-400 text-[10px] mb-1">
                  <Bed className="h-3 w-3 text-emerald-400" />
                  <span>ICU BEDS</span>
                </div>
                <span className="font-mono text-base font-bold text-emerald-400">
                  {facility.availableBeds}
                </span>
              </div>

              <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800">
                <div className="flex items-center justify-center space-x-1 text-slate-400 text-[10px] mb-1">
                  <Ambulance className="h-3 w-3 text-amber-400" />
                  <span>FLEET</span>
                </div>
                <span className="font-mono text-base font-bold text-amber-400">
                  {facility.ambulancesAvailable} ALS
                </span>
              </div>

              <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800">
                <div className="flex items-center justify-center space-x-1 text-slate-400 text-[10px] mb-1">
                  <Activity className="h-3 w-3 text-sky-400" />
                  <span>STATUS</span>
                </div>
                <span className="font-mono text-xs font-bold text-white">
                  Nominal
                </span>
              </div>
            </div>

            {/* Blood Inventory Vault */}
            {facility.bloodInventory && (
              <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Droplet className="h-3 w-3 text-red-400" />
                    <span>Cryo Blood Reserve</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">Live Inventory</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {Object.entries(facility.bloodInventory).map(([bg, count]) => (
                    <span
                      key={bg}
                      className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-mono border border-slate-800"
                    >
                      <strong className="text-red-400">{bg}:</strong> <span className="text-slate-200">{count} units</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Emergency Dispatch Hotline */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-[11px] text-slate-400">Trauma Intake:</span>
              <a
                href={`tel:${facility.emergencyHotline}`}
                className="flex items-center space-x-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 px-3 py-1.5 text-xs font-mono font-bold text-sky-300 transition-colors"
              >
                <Phone className="h-3 w-3 text-sky-400" />
                <span>{facility.emergencyHotline}</span>
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
