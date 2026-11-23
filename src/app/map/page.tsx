'use client';

import React, { useState } from 'react';
import EmergencyMap from '@/components/map/EmergencyMap';
import { useEmergency } from '@/context/EmergencyContext';
import { MapPin, Layers, Radio, Building2, Droplet } from 'lucide-react';
import IncidentCard from '@/components/emergency/IncidentCard';

type MapTab = 'unified' | 'incidents' | 'hospitals' | 'donors';

export default function TacticalMapPage() {
  const { incidents, activeIncident, setActiveIncident } = useEmergency();
  const [activeTab, setActiveTab] = useState<MapTab>('unified');

  const tabs = [
    {
      id: 'unified' as MapTab,
      title: 'Unified Map View',
      subtitle: 'Complete overlay with all active layers',
      icon: Layers,
      badge: 'All Layers',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      id: 'incidents' as MapTab,
      title: 'Distress Incidents',
      subtitle: 'Active emergency locations and patient radii',
      icon: Radio,
      badge: `${incidents.length} Calls`,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      id: 'hospitals' as MapTab,
      title: 'Medical Facilities',
      subtitle: 'Level-1 trauma centers and hospitals',
      icon: Building2,
      badge: 'Facilities',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'donors' as MapTab,
      title: 'Blood Donors',
      subtitle: 'Verified donor locations and coverage zones',
      icon: Droplet,
      badge: 'Donors',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Incident & Resource Map
            </h1>
            <p className="text-xs text-slate-500">
              Real-time geospatial visualization of distress calls, medical centers, and blood donors.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core Function Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col justify-between text-left p-4 rounded-xl border transition-all duration-150 ${
                isActive
                  ? 'border-[#172B4D] bg-slate-50/80 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-3 right-3 h-0.5 rounded-b bg-[#14B8A6]"></span>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg border ${
                    isActive 
                      ? 'bg-[#172B4D] text-white border-[#172B4D]' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>

                  <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                </div>

                <h3 className={`text-xs font-semibold transition-colors ${
                  isActive ? 'text-slate-900 font-bold' : 'text-slate-700'
                }`}>
                  {tab.title}
                </h3>

                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  {tab.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Map Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Tactical Map (8 Cols) */}
          <div className="lg:col-span-8 space-y-3">
            <EmergencyMap heightClass="h-[560px]" focusIncidentId={activeIncident?.id} />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5">
                <span className="text-[10px] text-slate-500 block">RED MARKERS</span>
                <span className="font-semibold text-rose-700">Incidents ({incidents.length})</span>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5">
                <span className="text-[10px] text-slate-500 block">ROSE MARKERS</span>
                <span className="font-semibold text-teal-700">Available Donors (6)</span>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5">
                <span className="text-[10px] text-slate-500 block">BLUE CROSS</span>
                <span className="font-semibold text-blue-700">Trauma Centers (3)</span>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5">
                <span className="text-[10px] text-slate-500 block">EMERALD SHIELD</span>
                <span className="font-semibold text-emerald-700">Field Responders (3)</span>
              </div>
            </div>
          </div>

          {/* Right Incident Quick-Access Queue (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5 font-mono">
                <Radio className="h-3.5 w-3.5 text-rose-600" />
                <span>Active Incidents</span>
              </h3>
              <span className="text-[10px] text-slate-400">Click to locate</span>
            </div>

            <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
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
