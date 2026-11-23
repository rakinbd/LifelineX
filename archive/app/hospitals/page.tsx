'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  AlertCircle,
  Plus,
  Minus,
  Lock,
  Unlock,
  Crown
} from 'lucide-react';
import { MOCK_FACILITIES } from '@/lib/mockData';
import { useRole } from '@/context/RoleContext';
import { BloodGroup, EmergencyFacility } from '@/types';

type HospitalTab = 'directory' | 'icu' | 'fleet' | 'blood' | 'hotlines';

export default function HospitalsPage() {
  const { user, canManageHospitals, switchUser } = useRole();

  const [facilities, setFacilities] = useState<EmergencyFacility[]>(MOCK_FACILITIES);
  const [activeTab, setActiveTab] = useState<HospitalTab>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [dispatchedAmbulanceId, setDispatchedAmbulanceId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Compute total telemetry dynamically from current facilities state
  const totalBeds = facilities.reduce((acc, f) => acc + f.availableBeds, 0);
  const totalAmbulances = facilities.reduce((acc, f) => acc + f.ambulancesAvailable, 0);
  const totalCryoUnits = facilities.reduce((acc, f) => {
    if (!f.bloodInventory) return acc;
    return acc + Object.values(f.bloodInventory).reduce((sum, count) => sum + (count || 0), 0);
  }, 0);

  const filteredFacilities = facilities.filter(fac => {
    const matchesType = selectedTypeFilter === 'ALL' || fac.type === selectedTypeFilter;
    const matchesSearch = 
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Admin action: Adjust ICU Bed Count
  const handleAdjustBeds = (facId: string, facName: string, delta: number) => {
    if (!canManageHospitals) {
      showNotice('Admin Access Required: You need Hospital Operations Admin privileges to modify ICU capacity.');
      return;
    }

    setFacilities(prev =>
      prev.map(f => {
        if (f.id === facId) {
          const newBeds = Math.max(0, f.availableBeds + delta);
          showNotice(`Updated ${facName}: Available ICU Beds is now ${newBeds}`);
          return { ...f, availableBeds: newBeds };
        }
        return f;
      })
    );
  };

  // Admin action: Dispatch ambulance
  const handleDispatchAmbulance = (facId: string, facName: string) => {
    if (!canManageHospitals) {
      showNotice('Admin Access Required: You need Hospital Operations Admin privileges to scramble ambulance fleets.');
      return;
    }

    setFacilities(prev =>
      prev.map(f => {
        if (f.id === facId && f.ambulancesAvailable > 0) {
          return { ...f, ambulancesAvailable: f.ambulancesAvailable - 1 };
        }
        return f;
      })
    );

    setDispatchedAmbulanceId(facId);
    showNotice(`Ambulance unit dispatched from ${facName}! Transit GPS shared.`);
    setTimeout(() => setDispatchedAmbulanceId(null), 4000);
  };

  // Admin action: Adjust Cryo Vault Units
  const handleAdjustBloodInventory = (facId: string, group: BloodGroup, delta: number) => {
    if (!canManageHospitals) {
      showNotice('Admin Access Required: You need Hospital Operations Admin privileges to adjust cryo-reserves.');
      return;
    }

    setFacilities(prev =>
      prev.map(f => {
        if (f.id === facId && f.bloodInventory) {
          const currentCount = f.bloodInventory[group] || 0;
          const newCount = Math.max(0, currentCount + delta);
          return {
            ...f,
            bloodInventory: {
              ...f.bloodInventory,
              [group]: newCount,
            },
          };
        }
        return f;
      })
    );
    showNotice(`Adjusted ${group} reserves (+/- units) in hospital cryo-vault.`);
  };

  const tabs = [
    {
      id: 'directory' as HospitalTab,
      title: 'Trauma Centers Directory',
      subtitle: 'Browse Level-1 trauma centers & general hospitals',
      icon: Building2,
      badge: `${facilities.length} Facilities`,
      badgeColor: 'bg-sky-50 text-sky-700 border border-sky-200',
    },
    {
      id: 'icu' as HospitalTab,
      title: 'ICU Bed Telemetry',
      subtitle: 'Live critical care beds & admin capacity controls',
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

  const facilityTypes = [
    { id: 'ALL', label: 'All Facility Types' },
    { id: 'TRAUMA_CENTER', label: 'Level-1 Trauma Centers' },
    { id: 'GENERAL_HOSPITAL', label: 'General Hospitals' },
    { id: 'BLOOD_BANK', label: 'Specialized Blood Banks' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Toast notification banner */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-sky-300 bg-slate-900 text-white px-4 py-3 shadow-lg flex items-center space-x-2 text-xs animate-fade-in">
          <Activity className="h-4 w-4 text-sky-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Header with Role Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Hospital Management System
              </h1>
              {canManageHospitals ? (
                <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-200 flex items-center space-x-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Hospital Admin Active</span>
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200">
                  Standard Member View
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Hospital directory, live ICU bed availability, ambulance fleet status, and blood bank reserves.
            </p>
          </div>
        </div>

        {/* Access switcher button if non-admin */}
        {!canManageHospitals && (
          <button
            onClick={() => {
              switchUser('USR-003'); // Switch to Dr. Sarah Connor (HOSPITAL_ADMIN)
              showNotice('Switched session to Dr. Sarah Connor (Hospital Admin)!');
            }}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs self-start sm:self-auto"
          >
            <Unlock className="h-3.5 w-3.5 text-sky-600" />
            <span>Switch to Hospital Admin</span>
          </button>
        )}
      </div>

      {/* 5 Core Function Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col justify-between text-left p-4 rounded-xl border transition-all duration-150 ${
                isActive
                  ? 'border-[#172B4D] bg-slate-50 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-3 right-3 h-0.5 rounded-b bg-sky-500"></span>
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

      {/* Main Content Area */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs min-h-[480px]">
        
        {/* ========================================================================= */}
        {/* TAB 1: TRAUMA CENTERS DIRECTORY (PUBLIC / USER VIEW) */}
        {/* ========================================================================= */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Regional Medical Facilities Directory ({filteredFacilities.length})
                </h2>
                <p className="text-xs text-slate-600">
                  Certified Level-1 trauma centers, regional emergency rooms, and specialized blood bank facilities.
                </p>
              </div>

              {/* Type Filter Chips */}
              <div className="flex flex-wrap gap-1.5">
                {facilityTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedTypeFilter(type.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      selectedTypeFilter === type.id
                        ? 'bg-[#172B4D] border-[#172B4D] text-white'
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
        {/* TAB 2: ICU BED TELEMETRY (WITH ADMIN CAPACITY CONTROLS) */}
        {/* ========================================================================= */}
        {activeTab === 'icu' && (
          <div className="space-y-6">
            
            {/* Non-admin notice */}
            {!canManageHospitals && (
              <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3.5 text-xs text-sky-900 flex items-center justify-between">
                <span>
                  <strong>Viewing Telemetry:</strong> Live bed statistics are public. Modifying bed counts requires Hospital Operations Admin privileges.
                </span>
                <button
                  onClick={() => switchUser('USR-003')}
                  className="shrink-0 ml-3 text-[11px] font-bold text-sky-700 underline hover:text-sky-800"
                >
                  Enable Admin Mode
                </button>
              </div>
            )}

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
                <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold">TOTAL AVAILABLE ICU BEDS</span>
                <span className="text-2xl font-bold font-mono text-slate-900 block">{totalBeds} Available</span>
                <span className="text-xs text-slate-600">Across {facilities.length} medical facilities</span>
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
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Facility-by-Facility Critical Bed Allocation
                </h3>
                {canManageHospitals && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Admin Controls Active: Use + / - to adjust beds in real-time
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {facilities.map(facility => (
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
                      
                      {/* Bed Count with Admin + / - controls */}
                      <div className="flex items-center space-x-2">
                        {canManageHospitals && (
                          <button
                            onClick={() => handleAdjustBeds(facility.id, facility.name, -1)}
                            className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                            title="Decrement available ICU beds"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                        )}

                        <div className="text-center min-w-[70px]">
                          <span className="font-mono text-lg font-bold text-emerald-700 block">
                            {facility.availableBeds}
                          </span>
                          <span className="text-[9px] text-slate-500 uppercase">Available Beds</span>
                        </div>

                        {canManageHospitals && (
                          <button
                            onClick={() => handleAdjustBeds(facility.id, facility.name, 1)}
                            className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                            title="Increment available ICU beds"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <a
                        href={`tel:${facility.emergencyHotline}`}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors shrink-0"
                      >
                        Emergency Hotline
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AMBULANCE FLEET & TRANSIT (WITH ADMIN DISPATCH CONTROLS) */}
        {/* ========================================================================= */}
        {activeTab === 'fleet' && (
          <div className="space-y-6">
            
            {/* Non-admin notice */}
            {!canManageHospitals && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 flex items-center justify-between">
                <span>
                  <strong>Fleet Viewing Mode:</strong> Ambulance readiness is displayed in real-time. Scrambling and dispatching vehicles requires Hospital Operations Admin privileges.
                </span>
                <button
                  onClick={() => switchUser('USR-003')}
                  className="shrink-0 ml-3 text-[11px] font-bold text-amber-800 underline hover:text-amber-900"
                >
                  Enable Admin Mode
                </button>
              </div>
            )}

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
              {facilities.map(facility => (
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
                    onClick={() => handleDispatchAmbulance(facility.id, facility.name)}
                    disabled={facility.ambulancesAvailable === 0}
                    className={`w-full flex items-center justify-center space-x-2 rounded-xl py-2.5 text-xs font-bold text-white shadow-xs transition-colors ${
                      facility.ambulancesAvailable === 0
                        ? 'bg-slate-300 cursor-not-allowed'
                        : canManageHospitals
                        ? 'bg-amber-600 hover:bg-amber-500 active:scale-95'
                        : 'bg-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <Ambulance className="h-4 w-4" />
                    <span>
                      {canManageHospitals 
                        ? 'Scramble Nearest Unit' 
                        : 'Admin Authorization Required'}
                    </span>
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
              {facilities.map(facility => (
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
              {facilities.map(facility => (
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
