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
      subtitle: 'Live queue of all open emergency incidents needing triage',
      icon: Radio,
      badge: `${incidents.filter(i => i.status !== 'RESOLVED').length} Active`,
      badgeColor: 'bg-red-950 text-red-400 border border-red-800',
    },
    {
      id: 'critical' as IncidentTab,
      title: 'Critical Tier-1 Triage',
      subtitle: 'High-priority life-threatening trauma and cardiac calls',
      icon: AlertOctagon,
      badge: `${criticalCount} Critical`,
      badgeColor: 'bg-amber-950 text-amber-400 border border-amber-800',
    },
    {
      id: 'enroute' as IncidentTab,
      title: 'Dispatched & En-Route',
      subtitle: 'Tracking responders actively traveling to incident scenes',
      icon: Navigation,
      badge: `${enRouteCount} In Transit`,
      badgeColor: 'bg-sky-950 text-sky-400 border border-sky-800',
    },
    {
      id: 'resolved' as IncidentTab,
      title: 'Resolved Mission Archive',
      subtitle: 'Historical completed rescues and patient handoffs',
      icon: CheckCircle2,
      badge: `${resolvedCount} Resolved`,
      badgeColor: 'bg-emerald-950 text-emerald-400 border border-emerald-800',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg shadow-red-950/60 border border-red-500/30">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              Incident Dispatch Command Center
            </h1>
            <p className="text-xs text-slate-400">
              Supervise distress queue, prioritize life-threatening cases, and monitor active field transitions.
            </p>
          </div>
        </div>

        <Link
          href="/triage"
          className="flex items-center space-x-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-950/80 hover:bg-red-500 active:scale-95 transition-all border border-red-500/40 shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>REPORT NEW SOS</span>
        </Link>
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
                    ? 'border-red-500 bg-gradient-to-b from-red-950/40 via-slate-900/90 to-slate-900 shadow-xl shadow-red-950/50 ring-1 ring-red-500/40'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-4 right-4 h-1 rounded-b bg-gradient-to-r from-red-500 via-rose-500 to-red-500"></span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={`p-2 rounded-xl border ${
                      isActive 
                        ? 'bg-red-600 text-white border-red-500 shadow-sm' 
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
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-sm min-h-[500px] space-y-6">
        
        {/* Controls: Search and Category Filter */}
        <div className="flex flex-col md:flex-row gap-3 border-b border-slate-800 pb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by incident ID, keywords, address, or symptoms..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
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
                    ? 'bg-slate-800 border-slate-600 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
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
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-12 text-center space-y-2">
              <AlertTriangle className="h-8 w-8 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-white">No incidents match this view</h3>
              <p className="text-xs text-slate-400">No records found matching the active tab or search filters.</p>
            </div>
          ) : (
            filteredIncidents.map(inc => (
              <Link
                key={inc.id}
                href={`/incidents/${inc.id}`}
                className="group block rounded-2xl border border-slate-800 bg-slate-950/70 p-5 hover:border-slate-700 hover:bg-slate-950 transition-all shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm font-bold text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      {inc.id}
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-mono font-bold ${getUrgencyBadgeColor(inc.urgency)}`}>
                      {inc.urgency} ({inc.urgencyScore}/100)
                    </span>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
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
                    <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                      {inc.title}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs font-semibold text-sky-400 group-hover:translate-x-1 transition-transform">
                      <span>Inspect Incident</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                    {inc.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {inc.aiExtracted.keySymptoms.map((sym, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-800 font-medium"
                      >
                        {sym}
                      </span>
                    ))}
                    {inc.requiredBloodGroup && (
                      <span className="flex items-center space-x-1 rounded-lg bg-red-950 px-2 py-0.5 text-[10px] font-mono font-bold text-red-300 border border-red-800">
                        <Droplet className="h-2.5 w-2.5 text-red-400" />
                        <span>{inc.requiredBloodGroup} ({inc.unitsNeeded || 1} Units)</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                  <div className="flex items-center space-x-1.5 text-slate-300">
                    <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
                    <span>{inc.location.address} (±{inc.location.fuzzyRadiusKm || 1.2} km)</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-amber-400" />
                      <span>{formatRelativeTime(inc.createdAt)}</span>
                    </span>

                    <button
                      onClick={(e) => handleNextStatus(e, inc.id, inc.status)}
                      className="rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-[11px] font-medium text-slate-200 transition-colors"
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
