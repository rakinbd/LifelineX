'use client';

import React from 'react';
import { AlertTriangle, Clock, Radio, ShieldCheck } from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';

export default function EmergencyBanner() {
  const { metrics, incidents } = useEmergency();
  const criticalCount = incidents.filter(i => i.urgency === 'CRITICAL').length;

  return (
    <div className="border-b border-red-950/60 bg-gradient-to-r from-red-950/80 via-slate-950 to-slate-950 px-4 py-1.5 text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between text-[11px] text-slate-300">
        <div className="flex items-center space-x-3 overflow-hidden text-ellipsis whitespace-nowrap">
          <div className="flex items-center space-x-1.5 font-semibold text-red-400">
            <Radio className="h-3.5 w-3.5 animate-pulse text-red-500" />
            <span>INCIDENT RADAR:</span>
          </div>
          <span className="text-slate-400">
            {incidents.length} active global distress events |{' '}
            <strong className="text-red-300 font-mono">{criticalCount} Critical Tier-1</strong> emergencies awaiting dispatch.
          </span>
        </div>

        <div className="hidden sm:flex items-center space-x-4 text-slate-400">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3 text-amber-400" />
            <span>Avg Dispatch: <strong className="text-slate-200 font-mono">{metrics.averageResponseTimeMinutes} min</strong></span>
          </div>
          <div className="flex items-center space-x-1 text-emerald-400">
            <ShieldCheck className="h-3 w-3" />
            <span>Protocol: Active Mutual Aid</span>
          </div>
        </div>
      </div>
    </div>
  );
}
