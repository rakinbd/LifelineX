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
  ExternalLink
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { IncidentCategory, IncidentStatus } from '@/types';
import { getUrgencyBadgeColor, getStatusBadgeColor, formatRelativeTime } from '@/lib/utils';

export default function IncidentsPage() {
  const { incidents, updateIncidentStatus } = useEmergency();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | IncidentCategory>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | IncidentStatus>('ALL');

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = 
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || inc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || inc.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
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

  return (
    <div className="space-y-6">
      
      {/* Header with Explanatory Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <Radio className="h-5 w-5 text-red-500 animate-pulse" />
            <h1 className="text-xl font-bold text-white tracking-wide">
              Incident Dispatch Command Queue
            </h1>
            <span className="rounded-full bg-red-950 border border-red-800 px-2 py-0.5 text-xs font-mono font-bold text-red-400">
              {filteredIncidents.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Live log of incoming emergency calls, medical transit dispatches, and community assistance requests. Click any incident to open its dedicated command console.
          </p>
        </div>

        <Link
          href="/triage"
          className="flex items-center space-x-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-950/80 hover:bg-red-500 active:scale-95 transition-all border border-red-500/40 shrink-0 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>REPORT NEW SOS</span>
        </Link>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by incident ID, keywords, address, or symptoms..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
          />
        </div>

        {/* Category Filter */}
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
              className={`rounded-xl px-3 py-2 text-xs font-medium border whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-800 border-slate-600 text-white shadow-sm'
                  : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Incident List Cards */}
      <div className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-2">
            <AlertTriangle className="h-8 w-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">No incidents match your filter criteria</h3>
            <p className="text-xs text-slate-400">Try adjusting your search terms or clearing category filters.</p>
          </div>
        ) : (
          filteredIncidents.map(inc => (
            <Link
              key={inc.id}
              href={`/incidents/${inc.id}`}
              className="group block rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 hover:bg-slate-900/90 transition-all shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-sm font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                    {inc.id}
                  </span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-mono font-bold ${getUrgencyBadgeColor(inc.urgency)}`}>
                    {inc.urgency} ({inc.urgencyScore}/100)
                  </span>
                  <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    {inc.category.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-400">Status:</span>
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

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {inc.aiExtracted.keySymptoms.map((sym, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-700 font-medium"
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

              {/* Footer Strip */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center space-x-1.5 text-slate-300">
                  <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
                  <span>{inc.location.address} (±{inc.location.fuzzyRadiusKm || 1.2} km)</span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-amber-400" />
                    <span>Reported {formatRelativeTime(inc.createdAt)}</span>
                  </span>

                  <button
                    onClick={(e) => handleNextStatus(e, inc.id, inc.status)}
                    className="rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-[11px] font-medium text-slate-200 transition-colors"
                  >
                    Advance Status
                  </button>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

    </div>
  );
}
