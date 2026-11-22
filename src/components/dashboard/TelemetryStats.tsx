'use client';

import React from 'react';
import { Radio, AlertOctagon, Users, Droplet, Clock, HeartHandshake } from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';

export default function TelemetryStats() {
  const { metrics, incidents } = useEmergency();
  const criticalCount = incidents.filter(i => i.urgency === 'CRITICAL').length;

  const statCards = [
    {
      label: 'Active CAD Incidents',
      value: incidents.length,
      change: '+2 last 15m',
      icon: Radio,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      badge: 'LIVE TELEMETRY',
      pulse: true,
    },
    {
      label: 'Critical Tier-1 Triage',
      value: criticalCount,
      change: 'Immediate dispatch',
      icon: AlertOctagon,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      badge: 'HIGH PRIORITY',
    },
    {
      label: 'Verified Blood Donors',
      value: metrics.registeredDonors.toLocaleString(),
      change: 'Cooldown Cleared',
      icon: Droplet,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      badge: '98% COMPLIANT',
    },
    {
      label: 'Mean Response Time',
      value: `${metrics.averageResponseTimeMinutes} min`,
      change: '-1.4 min vs standard',
      icon: Clock,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      badge: 'DISPATCH METRIC',
    },
    {
      label: 'Lives Impacted / Rescued',
      value: metrics.livesImpactedTotal.toLocaleString(),
      change: 'Global Mutual Aid',
      icon: HeartHandshake,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/20',
      badge: 'SUCCESS METRIC',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {statCards.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={`rounded-xl border ${stat.borderColor} ${stat.bgColor} p-3.5 backdrop-blur-sm transition-all hover:border-slate-700`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className={`p-1.5 rounded-lg bg-slate-900/60 ${stat.color}`}>
                <Icon className={`h-4 w-4 ${stat.pulse ? 'animate-pulse' : ''}`} />
              </div>
              <span className="font-mono text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                {stat.badge}
              </span>
            </div>

            <div className="mt-1">
              <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-white">
                {stat.value}
              </div>
              <div className="text-[11px] font-medium text-slate-300 truncate">
                {stat.label}
              </div>
            </div>

            <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
              <span>{stat.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
