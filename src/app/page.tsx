'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Radio, 
  MapPin, 
  Droplet, 
  Building2, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  GitFork, 
  Clock, 
  BarChart3, 
  AlertTriangle 
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import TelemetryStats from '@/components/dashboard/TelemetryStats';
import { getUrgencyBadgeColor, formatRelativeTime } from '@/lib/utils';

export default function CommandDashboard() {
  const { incidents } = useEmergency();
  const recentIncidents = incidents.slice(0, 3);

  const featureCards = [
    {
      title: 'Incident Dispatch Center',
      tag: 'CORE DISPATCH',
      description: 'Review active distress calls, manage triage lifecycle, and supervise responder assignments in real time.',
      href: '/incidents',
      icon: Radio,
      color: 'text-red-600',
      borderColor: 'border-slate-200 hover:border-red-300',
      bgColor: 'bg-white',
      badge: `${incidents.length} Calls`,
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
    },
    {
      title: 'AI SOS & Triage Engine',
      tag: 'INTELLIGENT INTAKE',
      description: 'Submit emergency requests via voice simulation or natural language text. AI classifies urgency and required resources.',
      href: '/triage',
      icon: Sparkles,
      color: 'text-sky-600',
      borderColor: 'border-slate-200 hover:border-sky-300',
      bgColor: 'bg-white',
      badge: 'Sub-3s Triage',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      title: 'Tactical GIS Emergency Map',
      tag: 'GEOSPATIAL COMMAND',
      description: 'Explore full-screen real-time interactive mapping with incident radii, hospital beds, and verified donor coordinates.',
      href: '/map',
      icon: MapPin,
      color: 'text-amber-600',
      borderColor: 'border-slate-200 hover:border-amber-300',
      bgColor: 'bg-white',
      badge: 'Live Radar',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Smart Blood Matching',
      tag: 'TRANSFUSION NETWORK',
      description: 'Match urgent blood appeals with compatible, active donors filtered by distance, blood group, and 90-day cooldown compliance.',
      href: '/donors',
      icon: Droplet,
      color: 'text-rose-600',
      borderColor: 'border-slate-200 hover:border-rose-300',
      bgColor: 'bg-white',
      badge: 'AABB Standard',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      title: 'Universal Compatibility Matrix',
      tag: 'CLINICAL TOOL',
      description: 'Interactive calculator displaying biological red-cell and plasma compatibility rules for all 8 major blood groups.',
      href: '/donors/matrix',
      icon: GitFork,
      color: 'text-purple-600',
      borderColor: 'border-slate-200 hover:border-purple-300',
      bgColor: 'bg-white',
      badge: 'Interactive',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      title: 'Trauma Centers & Facilities',
      tag: 'HOSPITAL INVENTORY',
      description: 'Inspect Level-1 trauma centers, live ICU emergency bed availability, blood cryo-vault reserves, and ambulance hotlines.',
      href: '/hospitals',
      icon: Building2,
      color: 'text-emerald-600',
      borderColor: 'border-slate-200 hover:border-emerald-300',
      bgColor: 'bg-white',
      badge: 'Hospital Feed',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'First Responders Fleet',
      tag: 'COMMUNITY NETWORK',
      description: 'Mobilize certified EMTs, paramedics, CPR specialists, and disaster rescue teams directly to field coordinates.',
      href: '/volunteers',
      icon: Users,
      color: 'text-indigo-600',
      borderColor: 'border-slate-200 hover:border-indigo-300',
      bgColor: 'bg-white',
      badge: '612 Responders',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      title: 'Dispatch Analytics & Reports',
      tag: 'SYSTEM PERFORMANCE',
      description: 'Evaluate response times, incident volume distributions, lives impacted, and regional readiness statistics.',
      href: '/analytics',
      icon: BarChart3,
      color: 'text-cyan-600',
      borderColor: 'border-slate-200 hover:border-cyan-300',
      bgColor: 'bg-white',
      badge: 'CAD Metrics',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Welcome & CAD Status Bar */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-700 uppercase">
                CAD SYSTEM ONLINE // ALL REGIONAL NODES SYNCHRONIZED
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              LifeLink AI Emergency Command Center
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Decentralized mutual-aid network coordinating critical trauma dispatch, universal blood donor mobilization, and community emergency relief worldwide.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/triage"
              className="flex items-center space-x-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-red-200 hover:bg-red-500 active:scale-95 transition-all"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>NEW SOS REQUEST</span>
            </Link>

            <Link
              href="/incidents"
              className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Radio className="h-4 w-4 text-red-600" />
              <span>VIEW LIVE DISPATCH</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Global Telemetry Metrics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-sky-600" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              Live System Telemetry
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Updated Real-Time</span>
        </div>
        <TelemetryStats />
      </div>

      {/* Distinct Modular Launchpad */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Operational Functions & Modules
            </h3>
            <p className="text-xs text-slate-500">
              Each module is segregated into its own dedicated operational environment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                href={card.href}
                className={`group relative flex flex-col justify-between rounded-2xl border ${card.borderColor} ${card.bgColor} p-5 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl bg-slate-50 ${card.color} border border-slate-100 shadow-xs`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase block mb-1">
                    {card.tag}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-red-600">
                  <span>Open Module</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Distress Calls Stream Preview */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Radio className="h-4 w-4 text-red-600 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Recent Priority SOS Events
            </h3>
          </div>
          <Link
            href="/incidents"
            className="flex items-center space-x-1 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
          >
            <span>Open Full Incident Queue</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentIncidents.map(inc => (
            <Link
              key={inc.id}
              href={`/incidents/${inc.id}`}
              className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2 hover:border-slate-300 hover:bg-white transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {inc.id}
                </span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono font-bold ${getUrgencyBadgeColor(inc.urgency)}`}>
                  {inc.urgency}
                </span>
              </div>
              <h5 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                {inc.title}
              </h5>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                {inc.description}
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                <span>{inc.location.address}</span>
                <span>{formatRelativeTime(inc.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
