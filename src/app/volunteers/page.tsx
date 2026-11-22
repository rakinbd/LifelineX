'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  Shield, 
  CheckCircle, 
  Navigation, 
  Clock, 
  Activity, 
  Search, 
  Filter, 
  ArrowRight,
  UserCheck,
  Send,
  Radio,
  FileCheck,
  Flame,
  LifeBuoy
} from 'lucide-react';
import { MOCK_VOLUNTEERS, MOCK_INCIDENTS } from '@/lib/mockData';
import { useEmergency } from '@/context/EmergencyContext';

type VolunteerTab = 'roster' | 'skills' | 'assign' | 'register' | 'badges';

export default function VolunteersPage() {
  const { incidents, playAlertSound } = useEmergency();
  const [activeTab, setActiveTab] = useState<VolunteerTab>('roster');
  
  // Roster & Skill filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('ALL');

  // Mission Assignment state
  const [selectedVolId, setSelectedVolId] = useState<string>(MOCK_VOLUNTEERS[0]?.id || '');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [assignedSuccess, setAssignedSuccess] = useState<string | null>(null);

  // New Volunteer Registration state
  const [regName, setRegName] = useState('');
  const [regContact, setRegContact] = useState('');
  const [regSkill, setRegSkill] = useState('EMT_BASIC');
  const [regSuccess, setRegSuccess] = useState(false);

  const filteredVolunteers = MOCK_VOLUNTEERS.filter(vol => {
    const matchesSkill = selectedSkillFilter === 'ALL' || vol.skills.includes(selectedSkillFilter as any);
    const matchesSearch = 
      vol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vol.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vol.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSkill && matchesSearch;
  });

  const handleAssignMission = () => {
    const vol = MOCK_VOLUNTEERS.find(v => v.id === selectedVolId);
    const inc = incidents.find(i => i.id === selectedIncidentId);
    if (!vol || !inc) return;

    setAssignedSuccess(`Mission ${inc.id} successfully assigned to ${vol.name}!`);
    playAlertSound();
    setTimeout(() => setAssignedSuccess(null), 4000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regContact.trim()) return;
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setRegName('');
      setRegContact('');
    }, 4000);
  };

  const tabs = [
    {
      id: 'roster' as VolunteerTab,
      title: 'Active Responders Roster',
      subtitle: 'Certified community responders on duty nearby',
      icon: Users,
      badge: `${MOCK_VOLUNTEERS.length} Active`,
      badgeColor: 'bg-emerald-950 text-emerald-400 border border-emerald-800',
    },
    {
      id: 'skills' as VolunteerTab,
      title: 'Specialized Skill Deployment',
      subtitle: 'Filter by EMT, CPR, Paramedic, and Water Rescue',
      icon: Shield,
      badge: 'Certified',
      badgeColor: 'bg-sky-950 text-sky-400 border border-sky-800',
    },
    {
      id: 'assign' as VolunteerTab,
      title: 'Assign Field Mission',
      subtitle: 'Pair open emergency calls with available volunteers',
      icon: Navigation,
      badge: 'Dispatch',
      badgeColor: 'bg-amber-950 text-amber-400 border border-amber-800',
    },
    {
      id: 'register' as VolunteerTab,
      title: 'Volunteer Onboarding',
      subtitle: 'Register as a certified community first-responder',
      icon: UserCheck,
      badge: 'Join Network',
      badgeColor: 'bg-purple-950 text-purple-400 border border-purple-800',
    },
    {
      id: 'badges' as VolunteerTab,
      title: 'Mission Impact & Badges',
      subtitle: 'Historical response metrics and Gold/Silver certification tiers',
      icon: Award,
      badge: 'Honor Roll',
      badgeColor: 'bg-rose-950 text-rose-400 border border-rose-800',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-950/60 border border-emerald-500/30">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              Community First-Responders & Disaster Fleet
            </h1>
            <p className="text-xs text-slate-400">
              Mobilize off-duty medical staff, trained CPR specialists, and water rescue teams for localized incident arrival.
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
                    ? 'border-emerald-500 bg-gradient-to-b from-emerald-950/40 via-slate-900/90 to-slate-900 shadow-xl shadow-emerald-950/50 ring-1 ring-emerald-500/40'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-4 right-4 h-1 rounded-b bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500"></span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={`p-2 rounded-xl border ${
                      isActive 
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm' 
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
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-sm min-h-[500px]">
        
        {/* ========================================================================= */}
        {/* TAB 1: ACTIVE RESPONDERS ROSTER */}
        {/* ========================================================================= */}
        {activeTab === 'roster' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Field First-Responders Directory ({filteredVolunteers.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Off-duty EMTs, certified nurses, and trained community volunteers standing by for dispatch.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('assign')}
                className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950 hover:bg-emerald-500 transition-colors self-start sm:self-auto"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Go to Mission Dispatch</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search responders by name, sector, or badge ID..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVolunteers.map(vol => (
                <div
                  key={vol.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4 hover:border-slate-700 transition-colors shadow-lg"
                >
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

                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1.5">
                      CERTIFIED CAPABILITIES
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {vol.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-300 border border-slate-800"
                        >
                          {skill.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1 border-t border-slate-800">
                    <div className="rounded-xl bg-slate-900 p-2.5 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block mb-0.5">COMPLETED MISSIONS</span>
                      <span className="font-mono text-base font-bold text-white">{vol.completedMissions}</span>
                    </div>
                    <div className="rounded-xl bg-slate-900 p-2.5 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block mb-0.5">AVG RESPONSE TIME</span>
                      <span className="font-mono text-base font-bold text-emerald-400">{vol.averageResponseMinutes} min</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                    <span className="text-[11px] text-slate-400">Sector: {vol.location.city}</span>

                    <button 
                      onClick={() => {
                        setSelectedVolId(vol.id);
                        setActiveTab('assign');
                      }}
                      className="flex items-center space-x-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-500/50 px-3 py-1.5 text-xs font-bold text-white transition-colors"
                    >
                      <Navigation className="h-3 w-3" />
                      <span>Assign Task</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SPECIALIZED SKILL DEPLOYMENT */}
        {/* ========================================================================= */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Filter by Emergency Skillset
                </h2>
                <p className="text-xs text-slate-400">
                  Select specialized responder capabilities required for specific trauma scenarios.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'ALL', label: 'All Skills' },
                  { id: 'EMT_BASIC', label: 'EMT Basic' },
                  { id: 'PARAMEDIC', label: 'Paramedic' },
                  { id: 'CPR_CERTIFIED', label: 'CPR Certified' },
                  { id: 'WATER_RESCUE', label: 'Water Rescue' },
                  { id: 'DISASTER_LOGISTICS', label: 'Disaster Logistics' },
                ].map(skill => (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedSkillFilter(skill.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-colors ${
                      selectedSkillFilter === skill.id
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {skill.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVolunteers.map(vol => (
                <div
                  key={vol.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{vol.name}</h4>
                      <p className="text-xs text-slate-400">{vol.location.address}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
                      {vol.badgeLevel}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {vol.skills.map((s, i) => (
                      <span
                        key={i}
                        className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-800"
                      >
                        {s.replace('_', ' ')}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                    <span>Average Arrival: <strong className="text-white font-mono">{vol.averageResponseMinutes}m</strong></span>
                    <button
                      onClick={() => {
                        setSelectedVolId(vol.id);
                        setActiveTab('assign');
                      }}
                      className="text-emerald-400 hover:underline font-bold"
                    >
                      Mobilize $\to$
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ASSIGN FIELD MISSION */}
        {/* ========================================================================= */}
        {activeTab === 'assign' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Field Mission Dispatch Console
                </h2>
                <p className="text-xs text-slate-400">
                  Directly assign an open emergency incident to a certified first responder unit with live coordinate transfer.
                </p>
              </div>

              {assignedSuccess && (
                <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/80 px-4 py-2 text-xs text-emerald-300 font-medium flex items-center space-x-2 animate-bounce">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>{assignedSuccess}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Step 1: Select Open Distress Call */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block font-mono">
                  1. Select Target Distress Incident
                </span>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {incidents.map(inc => {
                    const isSelected = inc.id === selectedIncidentId;
                    return (
                      <div
                        key={inc.id}
                        onClick={() => setSelectedIncidentId(inc.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500/30'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-300">{inc.id}</span>
                          <span className="font-mono text-[10px] text-amber-400">{inc.urgency}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">{inc.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{inc.location.address}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Select First Responder */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block font-mono">
                  2. Select Available First Responder
                </span>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {MOCK_VOLUNTEERS.map(vol => {
                    const isSelected = vol.id === selectedVolId;
                    return (
                      <div
                        key={vol.id}
                        onClick={() => setSelectedVolId(vol.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500/30'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-emerald-400">{vol.id}</span>
                          <span className="font-mono text-[10px] text-slate-400">{vol.badgeLevel} Tier</span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1">{vol.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{vol.location.address} • {vol.averageResponseMinutes}m avg</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleAssignMission}
                className="flex items-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-950/80 active:scale-95 transition-all"
              >
                <Navigation className="h-4 w-4" />
                <span>CONFIRM & TRANSMIT MISSION ORDER</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: VOLUNTEER ONBOARDING */}
        {/* ========================================================================= */}
        {activeTab === 'register' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="border-b border-slate-800 pb-4 text-center">
              <h2 className="text-lg font-bold text-white">
                Join the LifeLink Community First-Responder Fleet
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Whether you are an active nurse, off-duty paramedic, CPR-certified citizen, or commercial driver, your help saves lives during local crises.
              </p>
            </div>

            {regSuccess ? (
              <div className="rounded-2xl border border-emerald-900/60 bg-emerald-950/20 p-8 text-center space-y-3">
                <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-base font-bold text-white">Registration Application Submitted</h3>
                <p className="text-xs text-slate-300">
                  Our dispatch operations team will verify your medical credentials and activate your CAD responder radio link within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950 p-6">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Dr. John Carter / Jane Doe, RN"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Contact Phone / Dispatch Radio *</label>
                  <input
                    type="text"
                    value={regContact}
                    onChange={e => setRegContact(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Certified Capability *</label>
                  <select
                    value={regSkill}
                    onChange={e => setRegSkill(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="EMT_BASIC">EMT Basic (Emergency Medical Technician)</option>
                    <option value="PARAMEDIC">Advanced Life Support (ALS) Paramedic</option>
                    <option value="CPR_CERTIFIED">CPR & Automated External Defibrillator (AED)</option>
                    <option value="WATER_RESCUE">Swift Water Rescue Specialist</option>
                    <option value="DISASTER_LOGISTICS">Disaster Supplies & Transit Logistics</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-950 transition-colors"
                >
                  Submit Responder Application
                </button>
              </form>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MISSION IMPACT & BADGES */}
        {/* ========================================================================= */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                Responder Honor Roll & Accreditation Tiers
              </h2>
              <p className="text-xs text-slate-400">
                Recognizing community first-responders who dedicate their time to high-stakes humanitarian rescues.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold font-mono text-xs">
                  <Award className="h-5 w-5" />
                  <span>GOLD TIER ACCREDITATION</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  50+ completed emergency missions with an average response time under 4.0 minutes. Authorized for critical trauma assistance.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5 space-y-2">
                <div className="flex items-center space-x-2 text-slate-200 font-bold font-mono text-xs">
                  <Award className="h-5 w-5 text-slate-400" />
                  <span>SILVER TIER ACCREDITATION</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  25+ verified field missions. Trained in BLS protocols, basic airway management, and rapid triage coordination.
                </p>
              </div>

              <div className="rounded-2xl border border-orange-900/40 bg-orange-950/20 p-5 space-y-2">
                <div className="flex items-center space-x-2 text-orange-400 font-bold font-mono text-xs">
                  <Award className="h-5 w-5" />
                  <span>BRONZE TIER ACCREDITATION</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Entry-level community certified responder with CPR/AED clearance and neighborhood mutual-aid readiness.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Top Performing Responders (Leaderboard)
              </h3>

              <div className="space-y-2">
                {MOCK_VOLUNTEERS.map((vol, rank) => (
                  <div
                    key={vol.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/70"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-bold text-slate-500 w-5">#{rank + 1}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{vol.name}</h4>
                        <span className="text-[10px] text-slate-400">{vol.location.address}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-emerald-400 block">{vol.completedMissions}</span>
                        <span className="text-[9px] text-slate-500 uppercase">Missions</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-sky-400 block">{vol.averageResponseMinutes}m</span>
                        <span className="text-[9px] text-slate-500 uppercase">Avg Arrival</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
