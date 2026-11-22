'use client';

import React from 'react';
import EmergencyMap from '@/components/map/EmergencyMap';
import { useEmergency } from '@/context/EmergencyContext';
import { MapPin, Shield, Layers, Radio, AlertTriangle } from 'lucide-react';
import IncidentCard from '@/components/emergency/IncidentCard';

export default function TacticalMapPage() {
  const { incidents, activeIncident, setActiveIncident } = useEmergency();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-4">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2.5">
            <MapPin className="h-5 w-5 text-red-500" />
            <span>Tactical GIS Emergency Command Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time geospatial visualization of distress incidents, registered donors, and mutual-aid assets.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SATELLITE & CAD FEED LIVE</span>
        </div>
      </div>

      {/* Main Full-Size Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Interactive Tactical Map (8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          <EmergencyMap heightClass="h-[650px]" focusIncidentId={activeIncident?.id} />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-2.5">
              <span className="text-[10px] text-slate-500 block">RED MARKERS</span>
              <span className="font-bold text-red-400">Distress Incidents ({incidents.length})</span>
            </div>
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-2.5">
              <span className="text-[10px] text-slate-500 block">ROSE MARKERS</span>
              <span className="font-bold text-rose-400">Available Donors (6)</span>
            </div>
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-2.5">
              <span className="text-[10px] text-slate-500 block">BLUE CROSS</span>
              <span className="font-bold text-sky-400">Trauma Centers (3)</span>
            </div>
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-2.5">
              <span className="text-[10px] text-slate-500 block">EMERALD SHIELD</span>
              <span className="font-bold text-emerald-400">Field Responders (3)</span>
            </div>
          </div>
        </div>

        {/* Right Incident Quick-Access Drawer (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5 font-mono">
              <Radio className="h-3.5 w-3.5 text-red-400" />
              <span>Map Incidents Queue</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Click to Center</span>
          </div>

          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
            {incidents.map(inc => (
              <IncidentCard
                key={inc.id}
                incident={inc}
                isSelected={activeIncident?.id === inc.id}
                onSelect={() => setActiveIncident(inc)}
              />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
