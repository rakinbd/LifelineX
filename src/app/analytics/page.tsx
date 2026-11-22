'use client';

import React from 'react';
import { 
  BarChart3, 
  Clock, 
  Activity, 
  HeartHandshake, 
  Droplet, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Radio
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import TelemetryStats from '@/components/dashboard/TelemetryStats';

export default function AnalyticsPage() {
  const { metrics, incidents } = useEmergency();

  const categoryBreakdown = [
    { label: 'Severe Trauma & Collisions', percent: 38, count: 520, color: 'bg-red-500' },
    { label: 'Emergency Blood Transfusions', percent: 28, count: 384, color: 'bg-rose-500' },
    { label: 'Paramedic Ambulance Transit', percent: 18, count: 246, color: 'bg-amber-500' },
    { label: 'Disaster Relief & Evacuations', percent: 11, count: 151, color: 'bg-emerald-500' },
    { label: 'Cardiac & Special Rescue', percent: 5, count: 68, color: 'bg-sky-500' },
  ];

  const regionalLatency = [
    { region: 'North America (Zone 1)', latency: '3.8 min', status: 'Optimal' },
    { region: 'Western Europe (Zone 2)', latency: '4.1 min', status: 'Optimal' },
    { region: 'Asia-Pacific (Zone 3)', latency: '4.6 min', status: 'Normal' },
    { region: 'Latin America (Zone 4)', latency: '5.2 min', status: 'Normal' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2.5">
            <BarChart3 className="h-6 w-6 text-sky-400" />
            <span>Operational CAD Analytics & Life-Saving Impact</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time performance telemetry, response latency distributions, and humanitarian impact statistics.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-3 py-1 rounded-full">
          <span>HISTORICAL UPTIME: 99.98%</span>
        </div>
      </div>

      {/* Top Telemetry Metric Strip */}
      <TelemetryStats />

      {/* Detailed Analysis Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Breakdown (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Incident Volume Distribution (30 Days)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">1,369 Total Incidents</span>
          </div>

          <div className="space-y-4 pt-1">
            {categoryBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.label}</span>
                  <span className="font-mono text-slate-400 font-bold">{item.count} calls ({item.percent}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Average Dispatch Processing Speed:</span>
            <span className="font-mono text-emerald-400 font-bold">1.8 Seconds (AI Classification)</span>
          </div>
        </div>

        {/* Response Latency by Region (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Regional Mean Latency
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">● LIVE</span>
          </div>

          <div className="space-y-2.5">
            {regionalLatency.map((reg, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60"
              >
                <div>
                  <span className="text-xs font-bold text-slate-200 block">{reg.region}</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-medium">{reg.status}</span>
                </div>
                <span className="font-mono text-sm font-bold text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                  {reg.latency}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-sky-400">Benchmark:</strong> Municipal ambulances average 8.4 to 12.0 minutes. LifeLink AI community first-responders achieve arrival in under 5.0 minutes in 82% of trauma calls.
          </div>
        </div>

      </div>

    </div>
  );
}
