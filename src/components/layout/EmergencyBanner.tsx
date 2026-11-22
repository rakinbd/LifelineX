'use client';

import React from 'react';
import { AlertTriangle, Clock, Radio, ShieldCheck } from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';

export default function EmergencyBanner() {
  const { metrics, incidents } = useEmergency();
  const criticalCount = incidents.filter(i => i.urgency === 'CRITICAL').length;

  return (
    <div className="border-b border-red-200 bg-red-50/90 px-4 py-1.5 text-xs text-red-900 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between text-[11px]">
        <div className="flex items-center space-x-3 overflow-hidden text-ellipsis whitespace-nowrap">
          <div className="flex items-center space-x-1.5 font-bold text-red-700">
            <Radio className="h-3.5 w-3.5 animate-pulse text-red-600" />
            <span>INCIDENT RADAR:</span>
          </div>
          <span className="text-red-800">
            {incidents.length} active emergency events |{' '}
            <strong className="text-red-950 font-mono font-bold">{criticalCount} Critical Tier-1</strong> awaiting dispatch.
          </span>
        </div>

        <div className="hidden sm:flex items-center space-x-4 text-slate-600">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3 text-amber-600" />
            <span>Avg Dispatch: <strong className="text-slate-900 font-mono">{metrics.averageResponseTimeMinutes} min</strong></span>
          </div>
          <div className="flex items-center space-x-1 text-emerald-700 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Active Mutual Aid Network</span>
          </div>
        </div>
      </div>
    </div>
  );
}
