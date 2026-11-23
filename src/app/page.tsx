'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Radio, 
  MapPin, 
  ArrowRight, 
  Plus,
  Layers,
  Clock
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import TelemetryStats from '@/components/dashboard/TelemetryStats';
import EmergencyMap from '@/components/map/EmergencyMap';
import { getUrgencyBadgeColor, formatRelativeTime } from '@/lib/utils';

export default function CommandDashboard() {
  const { incidents } = useEmergency();
  const recentIncidents = incidents.slice(0, 3);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome / Overview Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Command Center
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Real-time emergency monitoring, donor coordination, and medical dispatch network.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/triage"
              className="flex items-center space-x-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-500 active:scale-[0.98] transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Report Emergency</span>
            </Link>

            <Link
              href="/incidents"
              className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Radio className="h-3.5 w-3.5 text-slate-500" />
              <span>Emergency Queue</span>
            </Link>

            <Link
              href="/map"
              className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              <span>Live Map</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Global Telemetry Metrics */}
      <div>
        <TelemetryStats />
      </div>

      {/* Live Map Preview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Incident & Resource Map
              </h3>
              <p className="text-[11px] text-slate-500">
                Active emergency distress coordinates, blood donors, and trauma centers.
              </p>
            </div>
          </div>
          <Link
            href="/map"
            className="flex items-center space-x-1 text-xs font-medium text-teal-700 hover:text-teal-800 transition-colors"
          >
            <span>Open Map</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <EmergencyMap heightClass="h-[360px]" />
      </div>

      {/* Recent Priority SOS Events Preview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Recent Emergency Incidents
            </h3>
            <p className="text-[11px] text-slate-500">
              Latest distress calls submitted to the emergency network.
            </p>
          </div>
          <Link
            href="/incidents"
            className="flex items-center space-x-1 text-xs font-medium text-teal-700 hover:text-teal-800 transition-colors"
          >
            <span>View All Incidents</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentIncidents.map(inc => (
            <Link
              key={inc.id}
              href={`/incidents/${inc.id}`}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5 hover:border-slate-300 hover:bg-white transition-all shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {inc.id}
                </span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono font-medium ${getUrgencyBadgeColor(inc.urgency)}`}>
                  {inc.urgency}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                {inc.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {inc.description}
              </p>
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate max-w-[140px]">{inc.location.address}</span>
                <span className="flex items-center space-x-1 shrink-0">
                  <Clock className="h-3 w-3" />
                  <span>{formatRelativeTime(inc.createdAt)}</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
