'use client';

import React, { useState } from 'react';
import EmergencyMap from '@/components/map/EmergencyMap';
import { useEmergency } from '@/context/EmergencyContext';
import { MapPin, Shield, Layers, Radio, AlertTriangle, Building2, Users, Droplet } from 'lucide-react';
import IncidentCard from '@/components/emergency/IncidentCard';

type MapTab = 'unified' | 'incidents' | 'hospitals' | 'donors';

export default function TacticalMapPage() {
  const { incidents, activeIncident, setActiveIncident } = useEmergency();
  const [activeTab, setActiveTab] = useState<MapTab>('unified');

  const tabs = [
    {
      id: 'unified' as MapTab,
      title: 'Unified Tactical GIS',
      subtitle: 'Complete overlay rendering all live emergency layers simultaneously',
      icon: Layers,
      badge: 'All Layers',
      badgeColor: 'bg-sky-950 text-sky-400 border border-sky-800',
    },
    {
      id: 'incidents' as MapTab,
      title: 'Distress Incident Pins',
      subtitle: 'Filter and track active emergency coordinates and patient radii',
      icon: Radio,
      badge: `${incidents.length} Calls`,
      badgeColor: 'bg-red-950 text-red-400 border border-red-800',
    },
    {
      id: 'hospitals' as MapTab,
      title: 'Trauma Facility Network',
      subtitle: 'Locate regional Level-1 hospitals and emergency trauma centers',
      icon: Building2,
      badge: 'Facilities',
      badgeColor: 'bg-emerald-950 text-emerald-400 border border-emerald-800',
    },
    {
      id: 'donors' as MapTab,
      title: 'Donor & Volunteer Radii',
      subtitle: 'Visualize community first-responders and donor coverage zones',
      icon: Users,
      badge: 'Mutual Aid',
      badgeColor: 'bg-rose-950 text-rose-400 border border-rose-800',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-rose-700 text-white shadow-lg shadow-amber-950/60 border border-amber-500/30">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              Tactical GIS Emergency Map
            </h1>
            <p className="text-xs text-slate-400">
              High-resolution real-time mapping displaying distress incidents, medical facilities, and community responders.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core Function Tabs */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col justify-between text-left p-4 rounded-2xl border transition-all duration-200 ${
                  isActive
                    ? 'border-amber-500 bg-gradient-to-b from-amber-950/40 via-slate-900/90 to-slate-900 shadow-xl shadow-amber-950/50 ring-1 ring-amber-500/40'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-4 right-4 h-1 rounded-b bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500"></span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={`p-2 rounded-xl border ${
                      isActive 
                        ? 'bg-amber-600 text-white border-amber-500 shadow-sm' 
                        : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${tab.badgeColor}`}>
                      {tab.badge}
                    </span>
                  </div>

                  <h3 className={`text-xs font-bold transition-colors ${
                    isActive ? 'text-white' : 'text-slate-300'
                  }`}>
                    {tab.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {tab.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Isolated View Container */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-sm min-h-[600px] space-y-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Tactical Map (8 Cols) */}
          <div className="lg:col-span-8 space-y-3">
            <EmergencyMap heightClass="h-[600px]" focusIncidentId={activeIncident?.id} />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-2.5">
                <span className="text-[10px] text-slate-500 block">RED MARKERS</span>
                <span className="font-bold text-red-400">Distress Incidents ({incidents.length})</span>
              </div>
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-2.5">
                <span className="text-[10px] text-slate-500 block">ROSE MARKERS</span>
                <span className="font-bold text-rose-400">Available Donors (6)</span>
              </div>
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-2.5">
                <span className="text-[10px] text-slate-500 block">BLUE CROSS</span>
                <span className="font-bold text-sky-400">Trauma Centers (3)</span>
              </div>
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-2.5">
                <span className="text-[10px] text-slate-500 block">EMERALD SHIELD</span>
                <span className="font-bold text-emerald-400">Field Responders (3)</span>
              </div>
            </div>
          </div>

          {/* Right Incident Quick-Access Queue (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5 font-mono">
                <Radio className="h-3.5 w-3.5 text-red-400" />
                <span>Geospatial Incident Queue</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Click to Center</span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
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

    </div>
  );
}
