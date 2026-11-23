'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Phone, 
  Droplet, 
  Sparkles, 
  Radio, 
  CheckCircle2, 
  Send, 
  User, 
  ArrowRight, 
  Shield, 
  AlertTriangle,
  Building2,
  Navigation
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import IncidentInspector from '@/components/emergency/IncidentInspector';
import EmergencyMap from '@/components/map/EmergencyMap';

export default function IncidentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { incidents, getIncidentById } = useEmergency();

  const id = typeof params?.id === 'string' ? params.id : '';
  const incident = getIncidentById(id) || incidents.find(i => i.id.toLowerCase() === id.toLowerCase());

  if (!incident) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-4 shadow-sm">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Incident Not Found</h2>
        <p className="text-xs text-slate-600">
          The requested emergency incident reference <span className="font-mono text-red-600">#{id}</span> could not be located in active dispatch.
        </p>
        <Link
          href="/incidents"
          className="inline-flex items-center space-x-1.5 rounded-xl bg-white hover:bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Incident Queue</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Navigation & Back Link */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link
          href="/incidents"
          className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to All Incidents</span>
        </Link>

        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-teal-500"></span>
          <span>Regional Zone US-4</span>
        </div>
      </div>

      {/* Main Grid: Left Detailed Inspector (7 cols) & Right Focused Map (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Full Incident Inspector & Triage breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <IncidentInspector incident={incident} />
        </div>

        {/* Right Column: Focused Tactical Map & Facilities */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center space-x-1.5">
                <MapPin className="h-3.5 w-3.5 text-sky-600" />
                <span>Geospatial Incident Zone</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}
              </span>
            </div>

            <EmergencyMap heightClass="h-[340px]" focusIncidentId={incident.id} />

            <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <strong className="text-slate-800">Target Landmark:</strong> {incident.location.address}
              <div className="text-[10px] text-slate-500 mt-0.5">
                Dynamic Location Obfuscation: ±{incident.location.fuzzyRadiusKm || 1.2} km radius active
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 shadow-sm">
            <h4 className="text-xs font-bold uppercase text-slate-800 font-mono flex items-center space-x-1.5">
              <Building2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Direct Emergency Response Action</span>
            </h4>
            <p className="text-[11px] text-slate-600">
              Need immediate emergency response? Connect this incident directly with Level-1 Trauma triage.
            </p>
            <div className="pt-2 flex gap-2">
              <Link
                href="/hospitals"
                className="flex-1 rounded-xl bg-slate-50 hover:bg-slate-100 text-center py-2 text-xs font-bold text-slate-800 border border-slate-200 transition-colors shadow-2xs"
              >
                Trauma Facilities
              </Link>
              <Link
                href="/donors"
                className="flex-1 rounded-xl bg-slate-50 hover:bg-slate-100 text-center py-2 text-xs font-bold text-slate-800 border border-slate-200 transition-colors shadow-2xs"
              >
                Match Blood Donors
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
