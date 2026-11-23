'use client';

import React from 'react';
import { AlertCircle, Users, Droplet, Clock, Heart } from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';

export default function TelemetryStats() {
  const { metrics, incidents } = useEmergency();
  const criticalCount = incidents.filter(i => i.urgency === 'CRITICAL').length;

  const statCards = [
    {
      label: 'Active Incidents',
      value: incidents.length,
      detail: `${criticalCount} high priority`,
      icon: AlertCircle,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
    },
    {
      label: 'Critical Cases',
      value: criticalCount,
      detail: 'Awaiting dispatch',
      icon: AlertCircle,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
    },
    {
      label: 'Verified Donors',
      value: metrics.registeredDonors.toLocaleString(),
      detail: 'Available in network',
      icon: Droplet,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50',
    },
    {
      label: 'Average Response Time',
      value: `${metrics.averageResponseTimeMinutes} min`,
      detail: 'Dispatch to on-scene',
      icon: Clock,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
    {
      label: 'Lives Assisted',
      value: metrics.livesImpactedTotal.toLocaleString(),
      detail: 'Total network rescues',
      icon: Heart,
      iconColor: 'text-slate-700',
      iconBg: 'bg-slate-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs transition-shadow hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl ${stat.iconBg} ${stat.iconColor}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2">
              <div className="text-2xl font-bold tracking-tight text-slate-900">
                {stat.value}
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">
                {stat.detail}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
