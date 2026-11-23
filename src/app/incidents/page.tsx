'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Radio, 
  Search, 
  Filter, 
  Plus, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Droplet, 
  AlertTriangle,
  AlertOctagon,
  Navigation,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { IncidentCategory, IncidentStatus } from '@/types';
import { getUrgencyBadgeColor, getStatusBadgeColor, formatRelativeTime } from '@/lib/utils';

type IncidentTab = 'all' | 'critical' | 'enroute' | 'resolved';

export default function IncidentsPage() {
  const { incidents, updateIncidentStatus } = useEmergency();
  const [activeTab, setActiveTab] = useState<IncidentTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | IncidentCategory>('ALL');

  const criticalCount = incidents.filter(i => i.urgency === 'CRITICAL').length;
  const enRouteCount = incidents.filter(i => i.status === 'EN_ROUTE' || i.status === 'DISPATCHED').length;
  const resolvedCount = incidents.filter(i => i.status === 'RESOLVED').length;

  const filteredIncidents = incidents.filter(inc => {
    // Tab filter
    if (activeTab === 'critical' && inc.urgency !== 'CRITICAL') return false;
    if (activeTab === 'enroute' && inc.status !== 'EN_ROUTE' && inc.status !== 'DISPATCHED') return false;
    if (activeTab === 'resolved' && inc.status !== 'RESOLVED') return false;
    if (activeTab === 'all' && inc.status === 'RESOLVED') return false; // In 'all' queue, show active

    // Search query
    const matchesSearch = 
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location.address.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategory === 'ALL' || inc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleNextStatus = (e: React.MouseEvent, id: string, currentStatus: IncidentStatus) => {
    e.preventDefault();
    e.stopPropagation();
    const transitions: Record<IncidentStatus, IncidentStatus> = {
      REPORTED: 'TRIAGED',
      TRIAGED: 'MATCHING',
      MATCHING: 'DISPATCHED',
      DISPATCHED: 'EN_ROUTE',
      EN_ROUTE: 'ON_SCENE',
      ON_SCENE: 'RESOLVED',
      RESOLVED: 'REPORTED',
    };
    updateIncidentStatus(id, transitions[currentStatus]);
  };

  const tabs = [
    {
      id: 'all' as IncidentTab,
      title: 'Active Distress Queue',
      subtitle: 'Live queue of all open emergency calls needing response',
      icon: Radio,
      badge: `${incidents.filter(i => i.status !== 'RESOLVED').length} Active`,
      badgeColor: 'bg-red-50 text-red-700 border border-red-200',
    },
    {
      id: 'critical' as IncidentTab,
      title: 'Critical Urgent Cases',
      subtitle: 'High-priority life-threatening trauma and cardiac calls',
      icon: AlertOctagon,
      badge: `${criticalCount} Critical`,
      badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200',
    },
    {
      id: 'enroute' as IncidentTab,
      title: 'Dispatched & En-Route',
      subtitle: 'Tracking responders actively traveling to incident scenes',
      icon: Navigation,
      badge: `${enRouteCount} In Transit`,
      badgeColor: 'bg-sky-50 text-sky-700 border border-sky-200',
    },
    {
      id: 'resolved' as IncidentTab,
      title: 'Resolved Mission Archive',
      subtitle: 'Historical completed rescues and patient handoffs',
      icon: CheckCircle2,
      badge: `${resolvedCount} Resolved`,
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Emergency Response Command
            </h1>
            <p className="text-xs text-slate-500">
              Manage incoming distress calls, prioritize urgent cases, and coordinate field response.
            </p>
          </div>
        </div>

        <Link
          href="/triage"
          className="flex items-center space-x-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-500 active:scale-[0.98] transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Report Emergency</span>
        </Link>
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

      {/* Isolated View Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm min-h-[500px] space-y-6">
        
        {/* Controls: Search and Category Filter */}
        <div className="flex flex-col md:flex-row gap-3 border-b border-slate-200 pb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by incident ID, keywords, address, or symptoms..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-red-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'ALL', label: 'All Categories' },
              { id: 'BLOOD_TRANSFUSION', label: 'Blood Calls' },
              { id: 'TRAUMA_ACCIDENT', label: 'Accidents' },
              { id: 'AMBULANCE_TRANSIT', label: 'Ambulance' },
              { id: 'DISASTER_RESCUE', label: 'Disaster' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium border whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#172B4D] border-[#172B4D] text-white shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Incident Cards Queue */}
        <div className="space-y-3">
          {filteredIncidents.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center space-y-2">
              <AlertTriangle className="h-8 w-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No incidents match this view</h3>
              <p className="text-xs text-slate-500">No records found matching the active tab or search filters.</p>
            </div>
          ) : (
            filteredIncidents.map(inc => (
              <Link
                key={inc.id}
                href={`/incidents/${inc.id}`}
                className="group block rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-xs transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      {inc.id}
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-mono font-bold ${getUrgencyBadgeColor(inc.urgency)}`}>
                      {inc.urgency} ({inc.urgencyScore}/100)
                    </span>
                    <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      {inc.category.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium ${getStatusBadgeColor(inc.status)}`}>
                      {inc.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                      {inc.title}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs font-semibold text-sky-700 group-hover:translate-x-1 transition-transform">
                      <span>Inspect Incident</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                    {inc.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {inc.aiExtracted.keySymptoms.map((sym, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 border border-slate-200 font-medium"
                      >
                        {sym}
                      </span>
                    ))}
                    {inc.requiredBloodGroup && (
                      <span className="flex items-center space-x-1 rounded-lg bg-red-50 px-2 py-0.5 text-[10px] font-mono font-bold text-red-700 border border-red-200">
                        <Droplet className="h-2.5 w-2.5 text-red-500" />
                        <span>{inc.requiredBloodGroup} ({inc.unitsNeeded || 1} Units)</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center space-x-1.5 text-slate-700">
                    <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    <span>{inc.location.address} (±{inc.location.fuzzyRadiusKm || 1.2} km)</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-amber-500" />
                      <span>{formatRelativeTime(inc.createdAt)}</span>
                    </span>

                    <button
                      onClick={(e) => handleNextStatus(e, inc.id, inc.status)}
                      className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-2xs transition-colors"
                    >
                      Advance Phase
                    </button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
