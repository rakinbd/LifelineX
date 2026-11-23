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
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      id: 'categories' as AnalyticsTab,
      title: 'Call Volume Breakdown',
      subtitle: '30-day incident category distributions and trends',
      icon: TrendingUp,
      badge: '1,369 Calls',
      badgeColor: 'bg-sky-50 text-sky-700 border border-sky-200',
    },
    {
      id: 'latency' as AnalyticsTab,
      title: 'Regional Response Latency',
      subtitle: 'Global zone arrival benchmarks vs municipal standards',
      icon: Clock,
      badge: '4.8m Mean',
      badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200',
    },
    {
      id: 'resources' as AnalyticsTab,
      title: 'Resource Utilization',
      subtitle: 'Blood units dispatched, ambulance runs, and responder missions',
      icon: HeartHandshake,
      badge: 'Mutual Aid',
      badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              System Analytics & Impact
            </h1>
            <p className="text-xs text-slate-500">
              Live telemetry on response velocity, critical blood utilization, and community mutual-aid performance.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core Function Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col justify-between text-left p-4 rounded-xl border transition-all duration-150 ${
                isActive
                  ? 'border-[#172B4D] bg-slate-50/80 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-3 right-3 h-0.5 rounded-b bg-[#14B8A6]"></span>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg border ${
                    isActive 
                      ? 'bg-[#172B4D] text-white border-[#172B4D]' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>

                  <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                </div>

                <h3 className={`text-xs font-semibold transition-colors ${
                  isActive ? 'text-slate-900 font-bold' : 'text-slate-700'
                }`}>
                  {tab.title}
                </h3>

                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  {tab.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Isolated View Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm min-h-[500px]">
        
        {/* ========================================================================= */}
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Executive Telemetry Overview
              </h2>
              <p className="text-xs text-slate-600">
                Core performance metrics aggregated across all active regional computer-aided dispatch nodes.
              </p>
            </div>

            <TelemetryStats />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                <span className="text-xs font-bold text-emerald-700 font-mono">DISPATCH UPTIME</span>
                <span className="text-2xl font-bold font-mono text-slate-900 block">99.98%</span>
                <p className="text-xs text-slate-600">Zero downtime during regional network outages via distributed mesh nodes.</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                <span className="text-xs font-bold text-sky-700 font-mono">COMMUNITY RESCUE RATE</span>
                <span className="text-2xl font-bold font-mono text-slate-900 block">94.2%</span>
                <p className="text-xs text-slate-600">Percentage of distress incidents with matched on-scene community responders within 8 minutes.</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                <span className="text-xs font-bold text-rose-700 font-mono">BLOOD COOLDOWN COMPLIANCE</span>
                <span className="text-2xl font-bold font-mono text-slate-900 block">100.0%</span>
                <p className="text-xs text-slate-600">Zero non-compliant donations recorded under AABB 90-day physiological safety protocols.</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CALL VOLUME BREAKDOWN */}
        {/* ========================================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Incident Volume Distribution (Last 30 Days)
              </h2>
              <p className="text-xs text-slate-600">
                Classification of emergency calls parsed and triaged by the LifeLink AI decision support engine.
              </p>
            </div>

            <div className="space-y-4">
              {categoryBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-900 font-bold">{item.label}</span>
                    <span className="font-mono text-slate-700 font-bold">{item.count} calls ({item.percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`${item.color} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-xs text-slate-600 flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span>Sub-Second AI Extraction Latency:</span>
              <span className="font-mono text-emerald-700 font-bold">1.8 Seconds Average</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: REGIONAL RESPONSE LATENCY */}
        {/* ========================================================================= */}
        {activeTab === 'latency' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Regional Mean Arrival Time & Benchmarks
              </h2>
              <p className="text-xs text-slate-600">
                Comparing LifeLink AI community first-responder arrival times against municipal ambulance response benchmarks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regionalLatency.map((reg, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{reg.region}</h4>
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {reg.performance}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center text-xs pt-1">
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block mb-1">LIFELINK ARRIVAL</span>
                      <span className="font-mono text-xl font-bold text-emerald-700">{reg.latency}</span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block mb-1">MUNICIPAL AVERAGE</span>
                      <span className="font-mono text-xl font-bold text-slate-600">{reg.benchmark}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <strong className="text-sky-800">Operational Value:</strong> By mobilizing verified off-duty healthcare workers and CPR-certified neighbors within a 2.5km radius, LifeLink AI closes the critical 4 to 6 minute survival window during cardiac and severe hemorrhage crises.
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: RESOURCE UTILIZATION */}
        {/* ========================================================================= */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Life-Saving Resource Deployment Metrics
              </h2>
              <p className="text-xs text-slate-600">
                Cumulative tally of physical medical assets mobilized across international mutual-aid chapters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-rose-200 bg-white p-5 space-y-2 shadow-xs">
                <div className="flex items-center space-x-2 text-rose-600">
                  <Droplet className="h-5 w-5" />
                  <span className="font-mono text-xs font-bold">BLOOD UNITS DISPATCHED</span>
                </div>
                <span className="text-2xl font-bold font-mono text-slate-900 block">{metrics.bloodUnitsDispatched.toLocaleString()} Units</span>
                <p className="text-xs text-slate-600">Packed red cells and apheresis platelets successfully transfused.</p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-white p-5 space-y-2 shadow-xs">
                <div className="flex items-center space-x-2 text-amber-600">
                  <Ambulance className="h-5 w-5" />
                  <span className="font-mono text-xs font-bold">PARAMEDIC RUNS</span>
                </div>
                <span className="text-2xl font-bold font-mono text-slate-900 block">3,892 Transits</span>
                <p className="text-xs text-slate-600">Advanced Life Support (ALS) patient hospital transports completed.</p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-white p-5 space-y-2 shadow-xs">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <Users className="h-5 w-5" />
                  <span className="font-mono text-xs font-bold">FIRST-RESPONDER MISSIONS</span>
                </div>
                <span className="text-2xl font-bold font-mono text-slate-900 block">8,410 Rescues</span>
                <p className="text-xs text-slate-600">On-scene bystander CPR, water rescue, and trauma stabilization.</p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
