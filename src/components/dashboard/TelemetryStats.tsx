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
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      badge: 'LIVE QUEUE',
      pulse: true,
    },
    {
      label: 'Critical Tier-1 Triage',
      value: criticalCount,
      change: 'Immediate dispatch',
      icon: AlertOctagon,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      badge: 'HIGH PRIORITY',
    },
    {
      label: 'Verified Blood Donors',
      value: metrics.registeredDonors.toLocaleString(),
      change: 'Cooldown Cleared',
      icon: Droplet,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      badge: '98% COMPLIANT',
    },
    {
      label: 'Mean Response Time',
      value: `${metrics.averageResponseTimeMinutes} min`,
      change: '-1.4 min vs standard',
      icon: Clock,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      badge: 'DISPATCH VELOCITY',
    },
    {
      label: 'Lives Impacted / Rescued',
      value: metrics.livesImpactedTotal.toLocaleString(),
      change: 'Global Mutual Aid',
      icon: HeartHandshake,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
      badge: 'HUMANITARIAN',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {statCards.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={`rounded-2xl border ${stat.borderColor} bg-white p-4 shadow-sm hover:shadow-md transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-xl ${stat.bgColor} ${stat.color} border border-slate-100`}>
                <Icon className={`h-4 w-4 ${stat.pulse ? 'animate-pulse' : ''}`} />
              </div>
              <span className="font-mono text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                {stat.badge}
              </span>
            </div>

            <div className="mt-1">
              <div className="font-mono text-2xl font-extrabold tracking-tight text-slate-900">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-slate-600 truncate mt-0.5">
                {stat.label}
              </div>
            </div>

            <div className="mt-2 text-[10px] text-slate-400 font-medium">
              <span>{stat.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
