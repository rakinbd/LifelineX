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
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { useRole } from '@/context/RoleContext';
import TelemetryStats from '@/components/dashboard/TelemetryStats';
import { getUrgencyBadgeColor, formatRelativeTime } from '@/lib/utils';

export default function CommandDashboard() {
  const { incidents, metrics } = useEmergency();
  const { roleName } = useRole();

  const recentIncidents = incidents.slice(0, 3);

  const featureCards = [
    {
      title: 'Incident Dispatch Center',
      tag: 'CORE DISPATCH',
      description: 'Review active distress calls, manage triage lifecycle, and supervise responder assignments in real time.',
      href: '/incidents',
      icon: Radio,
      color: 'text-red-400',
      borderColor: 'border-red-900/40 hover:border-red-600/60',
      bgColor: 'bg-gradient-to-br from-red-950/20 to-slate-900/60',
      badge: `${incidents.length} Active Calls`,
      badgeColor: 'bg-red-950 text-red-400 border border-red-800/60',
    },
    {
      title: 'AI SOS & Triage Engine',
      tag: 'INTELLIGENT INTAKE',
      description: 'Submit emergency requests via voice simulation or natural language text. AI classifies urgency and required resources.',
      href: '/triage',
      icon: Sparkles,
      color: 'text-sky-400',
      borderColor: 'border-sky-900/40 hover:border-sky-600/60',
      bgColor: 'bg-gradient-to-br from-sky-950/20 to-slate-900/60',
      badge: 'Sub-3s Triage',
      badgeColor: 'bg-sky-950 text-sky-400 border border-sky-800/60',
    },
    {
      title: 'Tactical GIS Emergency Map',
      tag: 'GEOSPATIAL COMMAND',
      description: 'Explore full-screen real-time interactive mapping with incident radii, hospital beds, and verified donor coordinates.',
      href: '/map',
      icon: MapPin,
      color: 'text-amber-400',
      borderColor: 'border-amber-900/40 hover:border-amber-600/60',
      bgColor: 'bg-gradient-to-br from-amber-950/20 to-slate-900/60',
      badge: 'Live Radar',
      badgeColor: 'bg-amber-950 text-amber-400 border border-amber-800/60',
    },
    {
      title: 'Smart Blood Matching',
      tag: 'TRANSFUSION NETWORK',
      description: 'Match urgent blood appeals with compatible, active donors filtered by distance, blood group, and 90-day cooldown compliance.',
      href: '/donors',
      icon: Droplet,
      color: 'text-rose-400',
      borderColor: 'border-rose-900/40 hover:border-rose-600/60',
      bgColor: 'bg-gradient-to-br from-rose-950/20 to-slate-900/60',
      badge: 'AABB Standard',
      badgeColor: 'bg-rose-950 text-rose-400 border border-rose-800/60',
    },
    {
      title: 'Universal Compatibility Matrix',
      tag: 'CLINICAL TOOL',
      description: 'Interactive calculator displaying biological red-cell and plasma compatibility rules for all 8 major blood groups.',
      href: '/donors/matrix',
      icon: GitFork,
      color: 'text-purple-400',
      borderColor: 'border-purple-900/40 hover:border-purple-600/60',
      bgColor: 'bg-gradient-to-br from-purple-950/20 to-slate-900/60',
      badge: 'Interactive',
      badgeColor: 'bg-purple-950 text-purple-400 border border-purple-800/60',
    },
    {
      title: 'Trauma Centers & Facilities',
      tag: 'HOSPITAL INVENTORY',
      description: 'Inspect Level-1 trauma centers, live ICU emergency bed availability, blood cryo-vault reserves, and ambulance hotlines.',
      href: '/hospitals',
      icon: Building2,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-900/40 hover:border-emerald-600/60',
      bgColor: 'bg-gradient-to-br from-emerald-950/20 to-slate-900/60',
      badge: 'Live Telemetry',
      badgeColor: 'bg-emerald-950 text-emerald-400 border border-emerald-800/60',
    },
    {
      title: 'First Responders Fleet',
      tag: 'COMMUNITY NETWORK',
      description: 'Mobilize certified EMTs, paramedics, CPR specialists, and disaster rescue teams directly to field coordinates.',
      href: '/volunteers',
      icon: Users,
      color: 'text-indigo-400',
      borderColor: 'border-indigo-900/40 hover:border-indigo-600/60',
      bgColor: 'bg-gradient-to-br from-indigo-950/20 to-slate-900/60',
      badge: '612 Responders',
      badgeColor: 'bg-indigo-950 text-indigo-400 border border-indigo-800/60',
    },
    {
      title: 'Dispatch Analytics & Reports',
      tag: 'SYSTEM PERFORMANCE',
      description: 'Evaluate response times, incident volume distributions, lives impacted, and regional readiness statistics.',
      href: '/analytics',
      icon: BarChart3,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-900/40 hover:border-cyan-600/60',
      bgColor: 'bg-gradient-to-br from-cyan-950/20 to-slate-900/60',
      badge: 'CAD Metrics',
      badgeColor: 'bg-cyan-950 text-cyan-400 border border-cyan-800/60',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Welcome & CAD Status Bar */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                CAD SYSTEM OPERATIONAL // ALL NODES SYNCHRONIZED
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              LifeLink AI Emergency Command Center
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Decentralized mutual-aid network coordinating critical trauma dispatch, universal blood donor mobilization, and community emergency relief worldwide.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/triage"
              className="flex items-center space-x-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-950/80 hover:bg-red-500 active:scale-95 transition-all border border-red-500/40"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>NEW SOS REQUEST</span>
            </Link>

            <Link
              href="/incidents"
              className="flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <Radio className="h-4 w-4 text-red-400" />
              <span>VIEW LIVE DISPATCH</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Global Telemetry Metrics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-sky-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Live System Telemetry
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Updated Real-Time</span>
        </div>
        <TelemetryStats />
      </div>

      {/* Distinct Modular Launchpad (Clean cards with individual pages) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Operational Functions & Modules
            </h3>
            <p className="text-xs text-slate-400">
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
                className={`group relative flex flex-col justify-between rounded-2xl border ${card.borderColor} ${card.bgColor} p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl bg-slate-900/80 ${card.color} border border-slate-800 shadow-sm`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                    {card.tag}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-300 group-hover:text-white">
                  <span>Open Module</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Distress Calls Stream Preview */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Radio className="h-4 w-4 text-red-500 animate-pulse" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Recent Priority SOS Events
            </h3>
          </div>
          <Link
            href="/incidents"
            className="flex items-center space-x-1 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
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
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2 hover:border-slate-700 hover:bg-slate-900 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-300">{inc.id}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono font-bold ${getUrgencyBadgeColor(inc.urgency)}`}>
                  {inc.urgency}
                </span>
              </div>
              <h5 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                {inc.title}
              </h5>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {inc.description}
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
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
