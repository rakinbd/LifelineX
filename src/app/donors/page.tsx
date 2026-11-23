'use client';

import React, { useState } from 'react';
import { 
  Droplet, 
  AlertCircle, 
  GitFork, 
  Clock, 
  UserCheck, 
  Radio, 
  Check, 
  MapPin, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Send, 
  Heart,
  Calendar,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import CompatibilityMatrix from '@/components/blood/CompatibilityMatrix';
import { BloodGroup, EmergencyIncident } from '@/types';
import { getUrgencyBadgeColor, formatRelativeTime } from '@/lib/utils';
import { getCooldownDaysRemaining, isBloodCompatible } from '@/lib/matching/bloodCompatibility';

type BloodTab = 'appeals' | 'compatibility' | 'cooldown' | 'registry' | 'mobilize';

export default function DonorsPage() {
  const { donors, incidents, getMatchingDonors, playAlertSound } = useEmergency();

  // Active tab state (Default: 'appeals')
  const [activeTab, setActiveTab] = useState<BloodTab>('appeals');

  // Appeals & Registry filters
  const [registryFilterGroup, setRegistryFilterGroup] = useState<string>('ALL');
  const [registrySearch, setRegistrySearch] = useState('');
  
  // Mobilization state
  const bloodRequests = incidents.filter(i => i.category === 'BLOOD_TRANSFUSION');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(bloodRequests[0]?.id || '');
  const [mobilizedDonorIds, setMobilizedDonorIds] = useState<string[]>([]);
  const [lastMobilizedDonorName, setLastMobilizedDonorName] = useState<string | null>(null);

  // Interactive Cooldown Calculator state
  const [inputDate, setInputDate] = useState<string>('2026-09-15');
  const [calculatedCooldown, setCalculatedCooldown] = useState<{
    daysRemaining: number;
    recoveryPercent: number;
    eligibleDate: string;
    isEligible: boolean;
  } | null>(null);

  // Calculate cooldown for the custom input date
  const handleCalculateCooldown = () => {
    if (!inputDate) return;
    const inputTime = new Date(inputDate).getTime();
    const now = new Date().getTime();
    const elapsedDays = Math.floor((now - inputTime) / (1000 * 60 * 60 * 24));
    const remaining = Math.max(0, 90 - elapsedDays);
    const recovery = Math.min(100, Math.max(0, Math.round(((90 - remaining) / 90) * 100)));
    const eligibleTime = new Date(inputTime + 90 * 24 * 60 * 60 * 1000);

    setCalculatedCooldown({
      daysRemaining: remaining,
      recoveryPercent: recovery,
      eligibleDate: eligibleTime.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      isEligible: remaining === 0,
    });
  };

  const handleMobilizeDonor = (donorId: string, donorName: string) => {
    setMobilizedDonorIds(prev => [...prev, donorId]);
    setLastMobilizedDonorName(donorName);
    playAlertSound();
    setTimeout(() => {
      setLastMobilizedDonorName(null);
    }, 4000);
  };

  // Selected incident for Mobilize tab
  const activeMobilizeIncident = bloodRequests.find(i => i.id === selectedIncidentId) || bloodRequests[0];
  const matchedDonors = activeMobilizeIncident ? getMatchingDonors(activeMobilizeIncident) : [];

  // Filtered donors for Registry tab
  const filteredDonors = donors.filter(d => {
    const matchesGroup = registryFilterGroup === 'ALL' || d.bloodGroup === registryFilterGroup;
    const matchesSearch = 
      d.fullName.toLowerCase().includes(registrySearch.toLowerCase()) ||
      d.location.address.toLowerCase().includes(registrySearch.toLowerCase()) ||
      d.id.toLowerCase().includes(registrySearch.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  // 5 Core Navigation Tabs Configuration
  const tabs = [
    {
      id: 'appeals' as BloodTab,
      title: 'Blood Appeals',
      subtitle: 'Active requests awaiting donor matching',
      icon: AlertCircle,
      badge: `${bloodRequests.length} Active`,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      id: 'compatibility' as BloodTab,
      title: 'Compatibility Engine',
      subtitle: 'Check donor & recipient compatibility',
      icon: GitFork,
      badge: 'Calculator',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      id: 'cooldown' as BloodTab,
      title: 'Cooldown Tracking',
      subtitle: '90-day recovery and eligibility tracker',
      icon: Clock,
      badge: 'Cooldown',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      id: 'registry' as BloodTab,
      title: 'Verified Donors',
      subtitle: 'Directory of screened regional donors',
      icon: UserCheck,
      badge: `${donors.length} Donors`,
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      id: 'mobilize' as BloodTab,
      title: 'Mobilize Donors',
      subtitle: 'Alert compatible donors for urgent cases',
      icon: Radio,
      badge: 'Dispatch',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
            <Droplet className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Blood Matching & Transfusion Center
            </h1>
            <p className="text-xs text-slate-500">
              Coordinate emergency blood appeals with verified, cooldown-compliant donors.
            </p>
          </div>
        </div>
      </div>

      {/* 1. SEPARATED TAB / CARD NAVIGATION (5 Core Functions) */}
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

      {/* 2. ISOLATED MODULE VIEW CONTAINER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs min-h-[480px]">
        
        {/* ========================================================================= */}
        {/* MODULE 1: ACTIVE EMERGENCY BLOOD APPEALS */}
        {/* ========================================================================= */}
        {activeTab === 'appeals' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Active Emergency Blood Appeals ({bloodRequests.length})
                </h2>
                <p className="text-xs text-slate-600">
                  Critical medical cases currently awaiting compatible blood units or apheresis platelets.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('mobilize')}
                className="flex items-center space-x-1.5 rounded-xl bg-[#172B4D] px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-[#243b53] transition-colors self-start sm:self-auto"
              >
                <Radio className="h-3.5 w-3.5 text-teal-400" />
                <span>Mobilize Console</span>
              </button>
            </div>

            {bloodRequests.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-12 text-center text-xs text-slate-500">
                No active blood transfusion distress calls reported.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bloodRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs hover:border-slate-300 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {req.id}
                          </span>
                          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-medium ${getUrgencyBadgeColor(req.urgency)}`}>
                            {req.urgency} ({req.urgencyScore}/100)
                          </span>
                        </div>

                        <span className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-mono font-semibold text-rose-700 shadow-2xs flex items-center space-x-1">
                          <Droplet className="h-3 w-3 fill-current" />
                          <span>{req.requiredBloodGroup} ({req.unitsNeeded || 1} Units)</span>
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 mt-2">
                        {req.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {req.description}
                      </p>

                      <div className="mt-3 text-[11px] text-slate-600 space-y-1 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                        <div className="flex items-center space-x-1.5 text-slate-800">
                          <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                          <span>{req.location.address}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                          <span>Reported by: <strong className="text-slate-700 font-medium">{req.requesterName}</strong></span>
                          <span>{formatRelativeTime(req.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-teal-700 font-mono font-medium">
                        {req.matchedRespondersCount} Compatible Donors Nearby
                      </span>

                      <button
                        onClick={() => {
                          setSelectedIncidentId(req.id);
                          setActiveTab('mobilize');
                        }}
                        className="flex items-center space-x-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 px-3 py-1.5 text-xs font-medium text-white shadow-2xs transition-colors"
                      >
                        <Radio className="h-3 w-3" />
                        <span>Mobilize Donors</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 2: COMPATIBILITY CALCULATOR */}
        {/* ========================================================================= */}
        {activeTab === 'compatibility' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Universal Blood Transfusion Compatibility Calculator
              </h2>
              <p className="text-xs text-slate-600">
                Calculates biological red-cell and plasma donor-recipient compatibility according to international transfusion protocols.
              </p>
            </div>

            <CompatibilityMatrix />
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 3: 90-DAY COOLDOWN TRACKING */}
        {/* ========================================================================= */}
        {activeTab === 'cooldown' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                90-Day Transfusion Cooldown & Eligibility Tracker
              </h2>
              <p className="text-xs text-slate-600">
                Enforcing mandatory 90-day intervals between whole blood donations to protect donor red blood cell volume and iron reserves.
              </p>
            </div>

            {/* Interactive Custom Date Calculator */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-amber-600" />
                  <span>Check Individual Donor Cooldown</span>
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row items-end gap-3">
                <div className="flex-1">
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    Date of Last Whole Blood Donation:
                  </label>
                  <input
                    type="date"
                    value={inputDate}
                    onChange={e => setInputDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-none shadow-xs"
                  />
                </div>

                <button
                  onClick={handleCalculateCooldown}
                  className="rounded-xl bg-[#172B4D] hover:bg-[#243b53] px-5 py-2 text-xs font-semibold text-white transition-colors h-[38px] shrink-0 shadow-xs"
                >
                  Verify Cooldown
                </button>
              </div>

              {calculatedCooldown && (
                <div className={`mt-3 rounded-xl border p-4 text-xs ${
                  calculatedCooldown.isEligible
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-amber-200 bg-amber-50 text-amber-900'
                }`}>
                  <div className="flex items-center justify-between font-bold mb-2">
                    <span className="flex items-center space-x-1.5">
                      {calculatedCooldown.isEligible ? <Check className="h-4 w-4 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 text-amber-600" />}
                      <span>{calculatedCooldown.isEligible ? 'Donor is Eligible to Donate' : 'Donor is in Cooldown Period'}</span>
                    </span>
                    <span className="font-mono">{calculatedCooldown.recoveryPercent}% Recovered</span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-2 rounded-full ${calculatedCooldown.isEligible ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${calculatedCooldown.recoveryPercent}%` }}
                    ></div>
                  </div>

                  <div className="text-[11px] text-slate-600 flex justify-between">
                    <span>Days Remaining: <strong className="text-slate-900 font-mono">{calculatedCooldown.daysRemaining} Days</strong></span>
                    <span>Next Eligible Date: <strong className="text-slate-900 font-mono">{calculatedCooldown.eligibleDate}</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* Registered Donors Cooldown Roster */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                Current Registered Donors
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {donors.map(donor => {
                  const daysRemaining = getCooldownDaysRemaining(donor.lastDonationDate);
                  const recoveryPercent = Math.min(100, Math.max(0, Math.round(((90 - daysRemaining) / 90) * 100)));
                  const isEligible = daysRemaining === 0;

                  return (
                    <div
                      key={donor.id}
                      className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 border border-rose-200 text-xs font-mono font-bold text-rose-700">
                            {donor.bloodGroup}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{donor.fullName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{donor.id}</span>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          isEligible
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}>
                          {isEligible ? 'CLEARED' : `${daysRemaining}d REMAINING`}
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${isEligible ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${recoveryPercent}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>Recovery: {recoveryPercent}%</span>
                        <span>{donor.totalDonations} Donations</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 4: VERIFIED DONOR REGISTRY */}
        {/* ========================================================================= */}
        {activeTab === 'registry' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Verified Blood Donor Registry ({filteredDonors.length})
                </h2>
                <p className="text-xs text-slate-600">
                  Screened donors with verified blood groups and active mutual-aid participation.
                </p>
              </div>

              {/* Blood Group Filter Chips */}
              <div className="flex flex-wrap gap-1">
                {['ALL', 'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(bg => (
                  <button
                    key={bg}
                    onClick={() => setRegistryFilterGroup(bg)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-colors ${
                      registryFilterGroup === bg
                        ? 'bg-[#172B4D] border-[#172B4D] text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={registrySearch}
                onChange={e => setRegistrySearch(e.target.value)}
                placeholder="Search donors by name, location, or donor ID..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Donors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDonors.map(donor => (
                <div
                  key={donor.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 hover:border-slate-300 hover:shadow-2xs transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 border border-rose-200 text-sm font-mono font-bold text-rose-700">
                        {donor.bloodGroup}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                          <span>{donor.fullName}</span>
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        </h4>
                        <p className="text-[11px] text-slate-500">{donor.location.address}</p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      donor.cooldownEligible
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}>
                      {donor.cooldownEligible ? 'ELIGIBLE' : 'COOLDOWN'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono pt-1 border-t border-slate-100">
                    <div className="rounded bg-slate-50 p-1 border border-slate-200">
                      <span className="text-slate-500 block">DONATIONS</span>
                      <span className="font-bold text-slate-900">{donor.totalDonations}</span>
                    </div>
                    <div className="rounded bg-slate-50 p-1 border border-slate-200">
                      <span className="text-slate-500 block">RESPONSE</span>
                      <span className="font-bold text-emerald-700">{donor.responseRatePercent}%</span>
                    </div>
                    <div className="rounded bg-slate-50 p-1 border border-slate-200">
                      <span className="text-slate-500 block">VERIFIED</span>
                      <span className="font-bold text-sky-700">Yes</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                    <span className="font-mono text-[10px] text-slate-400">{donor.id}</span>
                    <span className="text-slate-700 font-mono text-[10px]">{donor.contactNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 5: MOBILIZE DONOR */}
        {/* ========================================================================= */}
        {activeTab === 'mobilize' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Mobilize Compatible Donors
                </h2>
                <p className="text-xs text-slate-600">
                  Select an emergency appeal to automatically calculate biological compatibility, check cooldown status, and transmit dispatch alerts.
                </p>
              </div>

              {lastMobilizedDonorName && (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs text-emerald-800 font-medium flex items-center space-x-2 animate-bounce">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Alert dispatched to {lastMobilizedDonorName}!</span>
                </div>
              )}
            </div>

            {/* Step 1: Select Active Emergency Appeal */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block font-mono">
                Select Emergency Transfusion Appeal
              </label>

              {bloodRequests.length === 0 ? (
                <div className="text-xs text-slate-500">No active blood calls currently open.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {bloodRequests.map(req => {
                    const isSelected = req.id === selectedIncidentId;
                    return (
                      <div
                        key={req.id}
                        onClick={() => setSelectedIncidentId(req.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#172B4D] bg-slate-50 shadow-xs ring-1 ring-[#172B4D]/30'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-800">{req.id}</span>
                          <span className="rounded-lg bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-mono font-semibold text-rose-700">
                            {req.requiredBloodGroup} ({req.unitsNeeded || 1} Units)
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{req.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{req.location.address}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 2: System Matching Engine Output */}
            {activeMobilizeIncident && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                    Recommended Donors for {activeMobilizeIncident.id} ({activeMobilizeIncident.requiredBloodGroup})
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Ranked by Proximity & Match Score
                  </span>
                </div>

                <div className="space-y-2.5">
                  {matchedDonors.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-500">
                      No matching donors found within immediate radius.
                    </div>
                  ) : (
                    matchedDonors.map((donor) => {
                      const isMobilized = mobilizedDonorIds.includes(donor.id);

                      return (
                        <div
                          key={donor.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 border border-rose-200 text-sm font-mono font-bold text-rose-700">
                              {donor.bloodGroup}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                                <span>{donor.fullName}</span>
                                <span className="text-[10px] text-teal-700 font-mono">✓ Cooldown Cleared</span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {donor.distanceKm} km from trauma site • {donor.totalDonations} donations • {donor.responseRatePercent}% response rate
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 self-end sm:self-auto">
                            <div className="text-right hidden sm:block">
                              <span className="text-sm font-mono font-bold text-teal-700 block">
                                {donor.matchScore}%
                              </span>
                              <span className="text-[9px] text-slate-400 uppercase">Match Score</span>
                            </div>

                            <button
                              onClick={() => handleMobilizeDonor(donor.id, donor.fullName)}
                              disabled={isMobilized}
                              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                                isMobilized
                                  ? 'bg-teal-700 border-teal-600 text-white'
                                  : 'bg-rose-600 hover:bg-rose-500 border-rose-600 text-white shadow-2xs active:scale-95'
                              }`}
                            >
                              {isMobilized ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Alert Dispatched</span>
                                </>
                              ) : (
                                <>
                                  <Send className="h-3.5 w-3.5" />
                                  <span>Mobilize Donor</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
