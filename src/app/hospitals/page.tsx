'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  Bed, 
  Ambulance, 
  Droplet, 
  MapPin, 
  ShieldCheck, 
  Search, 
  ArrowRight,
  Activity,
  HeartPulse,
  Navigation,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { MOCK_FACILITIES } from '@/lib/mockData';
import { BloodGroup } from '@/types';

type HospitalTab = 'directory' | 'icu' | 'fleet' | 'blood' | 'hotlines';

export default function HospitalsPage() {
  const [activeTab, setActiveTab] = useState<HospitalTab>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [dispatchedAmbulanceId, setDispatchedAmbulanceId] = useState<string | null>(null);

  // Compute total telemetry
  const totalBeds = MOCK_FACILITIES.reduce((acc, f) => acc + f.availableBeds, 0);
  const totalAmbulances = MOCK_FACILITIES.reduce((acc, f) => acc + f.ambulancesAvailable, 0);
  const totalCryoUnits = MOCK_FACILITIES.reduce((acc, f) => {
    if (!f.bloodInventory) return acc;
    return acc + Object.values(f.bloodInventory).reduce((sum, count) => sum + (count || 0), 0);
  }, 0);

  const filteredFacilities = MOCK_FACILITIES.filter(fac => {
    const matchesType = selectedTypeFilter === 'ALL' || fac.type === selectedTypeFilter;
    const matchesSearch = 
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDispatchAmbulance = (facId: string) => {
    setDispatchedAmbulanceId(facId);
    setTimeout(() => setDispatchedAmbulanceId(null), 3500);
  };

  const tabs = [
    {
      id: 'directory' as HospitalTab,
      title: 'Trauma Centers Directory',
      subtitle: 'Browse Level-1 trauma centers & general hospitals',
      icon: Building2,
      badge: `${MOCK_FACILITIES.length} Facilities`,
      badgeColor: 'bg-sky-50 text-sky-700 border border-sky-200',
    },
    {
      id: 'icu' as HospitalTab,
      title: 'ICU Bed Telemetry',
      subtitle: 'Real-time intensive care & critical bed availability',
      icon: Bed,
      badge: `${totalBeds} ICU Beds`,
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      id: 'fleet' as HospitalTab,
      title: 'Ambulance Fleet & Transit',
      subtitle: 'ALS/BLS emergency vehicles & dispatch coordination',
      icon: Ambulance,
      badge: `${totalAmbulances} ALS Fleet`,
      badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200',
    },
    {
      id: 'blood' as HospitalTab,
      title: 'Blood Bank Cryo-Reserves',
      subtitle: 'Live plasma, platelets & red cell vault inventory',
      icon: Droplet,
      badge: `${totalCryoUnits} Units`,
      badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200',
    },
    {
      id: 'hotlines' as HospitalTab,
      title: 'Emergency Intake Hotlines',
      subtitle: 'One-click direct phone directory for medical facilities',
      icon: Phone,
      badge: 'Direct Link',
      badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-blue-700 text-white shadow-md shadow-sky-200 border border-sky-500/30">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-wide">
              Trauma Centers & Emergency Facilities
            </h1>
            <p className="text-xs text-slate-600">
              Institutional medical capacity, ICU bed counters, cryo-vault inventory, and rapid paramedic transit.
            </p>
          </div>
        </div>
      </div>

      {/* 5 Core Function Tabs */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col justify-between text-left p-4 rounded-2xl border transition-all duration-200 ${
                  isActive
                    ? 'border-sky-500 bg-sky-50/60 shadow-md ring-1 ring-sky-400/40'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-4 right-4 h-1 rounded-b bg-gradient-to-r from-sky-500 via-blue-500 to-sky-500"></span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={`p-2 rounded-xl border ${
                      isActive 
                        ? 'bg-sky-600 text-white border-sky-500 shadow-sm' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${tab.badgeColor}`}>
                      {tab.badge}
                    </span>
                  </div>

                  <h3 className={`text-xs font-bold transition-colors ${
                    isActive ? 'text-sky-950 font-extrabold' : 'text-slate-800'
                  }`}>
                    {tab.title}
                  </h3>

                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {tab.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Isolated View Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm min-h-[500px]">
        
        {/* ========================================================================= */}
        {/* TAB 1: TRAUMA CENTERS DIRECTORY */}
        {/* ========================================================================= */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Regional Medical Facilities Directory ({filteredFacilities.length})
                </h2>
                <p className="text-xs text-slate-600">
                  Certified Level-1 trauma centers, regional hospitals, and specialized blood bank repositories.
                </p>
              </div>

              {/* Type Filter */}
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'ALL', label: 'All Facilities' },
                  { id: 'TRAUMA_CENTER', label: 'Trauma Centers' },
                  { id: 'GENERAL_HOSPITAL', label: 'Hospitals' },
                  { id: 'BLOOD_BANK', label: 'Blood Banks' },
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedTypeFilter(type.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-colors ${
                      selectedTypeFilter === type.id
                        ? 'bg-sky-600 border-sky-500 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search facilities by name, location, or facility ID..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFacilities.map(facility => (
                <div
                  key={facility.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 hover:border-slate-300 transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-wider text-sky-700 uppercase bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        {facility.type.replace('_', ' ')}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1.5">{facility.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{facility.location.address}</p>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 border border-sky-200 text-sky-600">
                      <Building2 className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center text-xs">
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                      <div className="flex items-center justify-center space-x-1 text-slate-500 text-[10px] mb-1">
                        <Bed className="h-3 w-3 text-emerald-600" />
                        <span>ICU BEDS</span>
                      </div>
                      <span className="font-mono text-base font-bold text-emerald-700">
                        {facility.availableBeds}
                      </span>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                      <div className="flex items-center justify-center space-x-1 text-slate-500 text-[10px] mb-1">
                        <Ambulance className="h-3 w-3 text-amber-600" />
                        <span>FLEET</span>
                      </div>
                      <span className="font-mono text-base font-bold text-amber-700">
                        {facility.ambulancesAvailable} ALS
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[11px] text-slate-500">Emergency Intake:</span>
                    <a
                      href={`tel:${facility.emergencyHotline}`}
                      className="flex items-center space-x-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 text-xs font-mono font-bold text-sky-700 transition-colors"
                    >
                      <Phone className="h-3 w-3 text-sky-600" />
                      <span>{facility.emergencyHotline}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ICU BED TELEMETRY */}
        {/* ========================================================================= */}
        {activeTab === 'icu' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Intensive Care Unit (ICU) Capacity Telemetry
              </h2>
              <p className="text-xs text-slate-600">
                Live monitoring of critical care beds, ventilators, and surgical resuscitation availability across regional trauma networks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-1">
                <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold">TOTAL SURGICAL ICU BEDS</span>
                <span className="text-2xl font-bold font-mono text-slate-900 block">{totalBeds} Available</span>
                <span className="text-xs text-slate-600">Across 3 regional centers</span>
              </div>
              <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4 space-y-1">
                <span className="text-[10px] font-mono text-sky-700 uppercase font-bold">VENTILATOR READINESS</span>
                <span className="text-2xl font-bold font-mono text-slate-900 block">98% Operational</span>
                <span className="text-xs text-slate-600">Backup power active</span>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-1">
                <span className="text-[10px] font-mono text-amber-800 uppercase font-bold">AVERAGE TRIAGE WAIT</span>
                <span className="text-2xl font-bold font-mono text-slate-900 block">0 Minutes</span>
                <span className="text-xs text-slate-600">Immediate Trauma Intake</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                Facility-by-Facility Critical Bed Allocation
              </h3>

              <div className="space-y-3">
                {MOCK_FACILITIES.map(facility => (
                  <div
                    key={facility.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white shadow-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                        <Bed className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{facility.name}</h4>
                        <p className="text-xs text-slate-500">{facility.location.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="font-mono text-lg font-bold text-emerald-700 block">
                          {facility.availableBeds} ICU Beds
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase">Current Capacity</span>
                      </div>

                      <a
                        href={`tel:${facility.emergencyHotline}`}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors"
                      >
                        Reserve Bed
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AMBULANCE FLEET & TRANSIT */}
        {/* ========================================================================= */}
        {activeTab === 'fleet' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Advanced Life Support (ALS) Ambulance Fleet
                </h2>
                <p className="text-xs text-slate-600">
                  Deploy emergency transit units equipped with hydraulic extraction, defibrillators, and mobile blood refrigeration.
                </p>
              </div>

              {dispatchedAmbulanceId && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-xs text-amber-800 font-medium flex items-center space-x-2 animate-bounce">
                  <CheckCircle2 className="h-4 w-4 text-amber-600" />
                  <span>Ambulance Unit Dispatched & Coordinates Shared!</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MOCK_FACILITIES.map(facility => (
                <div
                  key={facility.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 hover:border-slate-300 transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-800 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {facility.ambulancesAvailable} VEHICLES ACTIVE
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1.5">{facility.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{facility.location.address}</p>
                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
                      <Ambulance className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fleet Profile:</span>
                      <span className="font-mono text-slate-900 font-bold">Advanced Life Support (ALS)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Average Mobilization:</span>
                      <span className="font-mono text-emerald-700 font-bold">2.4 Minutes</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDispatchAmbulance(facility.id)}
                    className="w-full flex items-center justify-center space-x-2 rounded-xl bg-amber-600 hover:bg-amber-500 py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
                  >
                    <Ambulance className="h-4 w-4" />
                    <span>Scramble Nearest Unit</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: BLOOD BANK CRYO-RESERVES */}
        {/* ========================================================================= */}
        {activeTab === 'blood' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Hospital Cryo-Preserved Blood Inventories
              </h2>
              <p className="text-xs text-slate-600">
                Real-time stock of packed red cells, fresh frozen plasma, and apheresis platelets across regional cryo-vaults.
              </p>
            </div>

            <div className="space-y-4">
              {MOCK_FACILITIES.map(facility => (
                <div
                  key={facility.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
                        <Droplet className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{facility.name}</h4>
                        <span className="text-xs text-slate-500">{facility.location.address}</span>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                      Vault Monitored
                    </span>
                  </div>

                  {facility.bloodInventory ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
                      {Object.entries(facility.bloodInventory).map(([bg, count]) => (
                        <div
                          key={bg}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-center"
                        >
                          <span className="font-mono text-xs font-bold text-red-600 block">{bg}</span>
                          <span className="font-mono text-base font-bold text-slate-900 block mt-0.5">{count}</span>
                          <span className="text-[9px] text-slate-500 uppercase">Units</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No direct cryo-vault inventory on file.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: EMERGENCY INTAKE HOTLINES */}
        {/* ========================================================================= */}
        {activeTab === 'hotlines' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Emergency Medical Facilities Intake Hotlines
              </h2>
              <p className="text-xs text-slate-600">
                Direct telecommunication lines connecting field responders with attending trauma surgeons and emergency intake nurses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_FACILITIES.map(facility => (
                <div
                  key={facility.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 border border-purple-200 text-purple-600">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{facility.name}</h4>
                      <p className="text-xs text-slate-500">{facility.location.address}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${facility.emergencyHotline}`}
                    className="flex items-center space-x-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-2 text-xs font-mono font-bold text-purple-700 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>{facility.emergencyHotline}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
