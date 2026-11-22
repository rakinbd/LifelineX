'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Clock, 
  Activity, 
  HeartHandshake, 
  Droplet, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Radio,
  FileText,
  Ambulance,
  Bed
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import TelemetryStats from '@/components/dashboard/TelemetryStats';

type AnalyticsTab = 'overview' | 'categories' | 'latency' | 'resources';

export default function AnalyticsPage() {
  const { metrics, incidents } = useEmergency();
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');

  const categoryBreakdown = [
    { label: 'Severe Trauma & Collisions', percent: 38, count: 520, color: 'bg-red-500' },
    { label: 'Emergency Blood Transfusions', percent: 28, count: 384, color: 'bg-rose-500' },
    { label: 'Paramedic Ambulance Transit', percent: 18, count: 246, color: 'bg-amber-500' },
    { label: 'Disaster Relief & Evacuations', percent: 11, count: 151, color: 'bg-emerald-500' },
    { label: 'Cardiac & Special Rescue', percent: 5, count: 68, color: 'bg-sky-500' },
  ];

  const regionalLatency = [
    { region: 'North America (Zone 1)', latency: '3.8 min', benchmark: '8.4 min', performance: '54% Faster' },
    { region: 'Western Europe (Zone 2)', latency: '4.1 min', benchmark: '9.0 min', performance: '54% Faster' },
    { region: 'Asia-Pacific (Zone 3)', latency: '4.6 min', benchmark: '10.2 min', performance: '55% Faster' },
    { region: 'Latin America (Zone 4)', latency: '5.2 min', benchmark: '11.5 min', performance: '55% Faster' },
  ];

  const tabs = [
    {
      id: 'overview' as AnalyticsTab,
      title: 'Executive Overview',
      subtitle: 'Key performance indicators, uptime, and life-saving metrics',
      icon: Activity,
      badge: '99.98% Uptime',
      badgeColor: 'bg-emerald-950 text-emerald-400 border border-emerald-800',
    },
    {
      id: 'categories' as AnalyticsTab,
      title: 'Call Volume Breakdown',
      subtitle: '30-day incident category distributions and trends',
      icon: TrendingUp,
      badge: '1,369 Calls',
      badgeColor: 'bg-sky-950 text-sky-400 border border-sky-800',
    },
    {
      id: 'latency' as AnalyticsTab,
      title: 'Regional Response Latency',
      subtitle: 'Global zone arrival benchmarks vs municipal standards',
      icon: Clock,
      badge: '4.8m Mean',
      badgeColor: 'bg-amber-950 text-amber-400 border border-amber-800',
    },
    {
      id: 'resources' as AnalyticsTab,
      title: 'Resource Utilization',
      subtitle: 'Blood units dispatched, ambulance runs, and responder missions',
      icon: HeartHandshake,
      badge: 'Mutual Aid',
      badgeColor: 'bg-rose-950 text-rose-400 border border-rose-800',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-lg shadow-cyan-950/60 border border-cyan-500/30">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              CAD Analytics & Humanitarian Impact
            </h1>
            <p className="text-xs text-slate-400">
              Live telemetry on response velocity, critical blood utilization, and community mutual-aid performance.
            </p>
          </div>
        </div>
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
                    ? 'border-cyan-500 bg-gradient-to-b from-cyan-950/40 via-slate-900/90 to-slate-900 shadow-xl shadow-cyan-950/50 ring-1 ring-cyan-500/40'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-4 right-4 h-1 rounded-b bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"></span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={`p-2 rounded-xl border ${
                      isActive 
                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm' 
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
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-sm min-h-[500px]">
        
        {/* ========================================================================= */}
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                Executive Telemetry Overview
              </h2>
              <p className="text-xs text-slate-400">
                Core performance metrics aggregated across all active regional computer-aided dispatch nodes.
              </p>
            </div>

            <TelemetryStats />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-2">
                <span className="text-xs font-bold text-emerald-400 font-mono">DISPATCH UPTIME</span>
                <span className="text-2xl font-bold font-mono text-white block">99.98%</span>
                <p className="text-xs text-slate-400">Zero downtime during regional network outages via distributed mesh nodes.</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-2">
                <span className="text-xs font-bold text-sky-400 font-mono">COMMUNITY RESCUE RATE</span>
                <span className="text-2xl font-bold font-mono text-white block">94.2%</span>
                <p className="text-xs text-slate-400">Percentage of distress incidents with matched on-scene community responders within 8 minutes.</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-2">
                <span className="text-xs font-bold text-rose-400 font-mono">BLOOD COOLDOWN COMPLIANCE</span>
                <span className="text-2xl font-bold font-mono text-white block">100.0%</span>
                <p className="text-xs text-slate-400">Zero non-compliant donations recorded under AABB 90-day physiological safety protocols.</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CALL VOLUME BREAKDOWN */}
        {/* ========================================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                Incident Volume Distribution (Last 30 Days)
              </h2>
              <p className="text-xs text-slate-400">
                Classification of emergency calls parsed and triaged by the LifeLink AI decision support engine.
              </p>
            </div>

            <div className="space-y-4">
              {categoryBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1.5 rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-white font-bold">{item.label}</span>
                    <span className="font-mono text-slate-300 font-bold">{item.count} calls ({item.percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`${item.color} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-xs text-slate-400 flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span>Sub-Second AI Extraction Latency:</span>
              <span className="font-mono text-emerald-400 font-bold">1.8 Seconds Average</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: REGIONAL RESPONSE LATENCY */}
        {/* ========================================================================= */}
        {activeTab === 'latency' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                Regional Mean Arrival Time & Benchmarks
              </h2>
              <p className="text-xs text-slate-400">
                Comparing LifeLink AI community first-responder arrival times against municipal ambulance response benchmarks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regionalLatency.map((reg, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{reg.region}</h4>
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {reg.performance}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center text-xs pt-1">
                    <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block mb-1">LIFELINK ARRIVAL</span>
                      <span className="font-mono text-xl font-bold text-emerald-400">{reg.latency}</span>
                    </div>
                    <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block mb-1">MUNICIPAL AVERAGE</span>
                      <span className="font-mono text-xl font-bold text-slate-400">{reg.benchmark}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              <strong className="text-sky-400">Operational Value:</strong> By mobilizing verified off-duty healthcare workers and CPR-certified neighbors within a 2.5km radius, LifeLink AI closes the critical 4 to 6 minute survival window during cardiac and severe hemorrhage crises.
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: RESOURCE UTILIZATION */}
        {/* ========================================================================= */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                Life-Saving Resource Deployment Metrics
              </h2>
              <p className="text-xs text-slate-400">
                Cumulative tally of physical medical assets mobilized across international mutual-aid chapters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-rose-900/40 bg-slate-950 p-5 space-y-2">
                <div className="flex items-center space-x-2 text-rose-400">
                  <Droplet className="h-5 w-5" />
                  <span className="font-mono text-xs font-bold">BLOOD UNITS DISPATCHED</span>
                </div>
                <span className="text-2xl font-bold font-mono text-white block">{metrics.bloodUnitsDispatched.toLocaleString()} Units</span>
                <p className="text-xs text-slate-400">Packed red cells and apheresis platelets successfully transfused.</p>
              </div>

              <div className="rounded-2xl border border-amber-900/40 bg-slate-950 p-5 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Ambulance className="h-5 w-5" />
                  <span className="font-mono text-xs font-bold">PARAMEDIC RUNS</span>
                </div>
                <span className="text-2xl font-bold font-mono text-white block">3,892 Transits</span>
                <p className="text-xs text-slate-400">Advanced Life Support (ALS) patient hospital transports completed.</p>
              </div>

              <div className="rounded-2xl border border-emerald-900/40 bg-slate-950 p-5 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Users className="h-5 w-5" />
                  <span className="font-mono text-xs font-bold">FIRST-RESPONDER MISSIONS</span>
                </div>
                <span className="text-2xl font-bold font-mono text-white block">8,410 Rescues</span>
                <p className="text-xs text-slate-400">On-scene bystander CPR, water rescue, and trauma stabilization.</p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
