'use client';

import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Droplet, 
  CheckCircle, 
  Send, 
  ArrowRight,
  Shield, 
  User
} from 'lucide-react';
import { EmergencyIncident, IncidentStatus } from '@/types';
import { useEmergency } from '@/context/EmergencyContext';
import { getUrgencyBadgeColor, getStatusBadgeColor, formatRelativeTime } from '@/lib/utils';

interface IncidentCardProps {
  incident: EmergencyIncident;
  onSelect?: () => void;
  isSelected?: boolean;
}

export default function IncidentCard({ incident, onSelect, isSelected }: IncidentCardProps) {
  const { updateIncidentStatus } = useEmergency();

  const handleNextStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    const transitions: Record<IncidentStatus, IncidentStatus> = {
      REPORTED: 'TRIAGED',
      TRIAGED: 'MATCHING',
      MATCHING: 'DISPATCHED',
      DISPATCHED: 'EN_ROUTE',
      EN_ROUTE: 'ON_SCENE',
      ON_SCENE: 'RESOLVED',
      RESOLVED: 'REPORTED',
    };
    updateIncidentStatus(incident.id, transitions[incident.status]);
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-xl border p-4 transition-all cursor-pointer ${
        isSelected
          ? 'border-red-500/60 bg-slate-900/90 shadow-lg shadow-red-950/40 ring-1 ring-red-500/30'
          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
      }`}
    >
      {/* Top Header: ID, Urgency & Status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold text-slate-300">{incident.id}</span>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold font-mono ${getUrgencyBadgeColor(incident.urgency)}`}>
            {incident.urgency} ({incident.urgencyScore})
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono font-medium ${getStatusBadgeColor(incident.status)}`}>
            {incident.status}
          </span>
        </div>
      </div>

      {/* Incident Title */}
      <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
        {incident.title}
      </h4>

      {/* Description Snippet */}
      <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
        {incident.description}
      </p>

      {/* AI Extracted Symptoms Tag Strip */}
      {incident.aiExtracted.keySymptoms.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {incident.aiExtracted.keySymptoms.map((sym, i) => (
            <span
              key={i}
              className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300 font-medium border border-slate-700/60"
            >
              {sym}
            </span>
          ))}
          {incident.requiredBloodGroup && (
            <span className="flex items-center space-x-1 rounded bg-red-950/80 px-2 py-0.5 text-[10px] font-mono font-bold text-red-300 border border-red-800/60">
              <Droplet className="h-2.5 w-2.5 text-red-400" />
              <span>{incident.requiredBloodGroup} ({incident.unitsNeeded || 1} Units)</span>
            </span>
          )}
        </div>
      )}

      {/* Location & Time Footer */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-1 text-slate-300 truncate max-w-[65%]">
          <MapPin className="h-3 w-3 shrink-0 text-red-400" />
          <span className="truncate">{incident.location.address}</span>
        </div>

        <div className="flex items-center space-x-1 font-mono text-[10px] text-slate-500">
          <Clock className="h-3 w-3" />
          <span>{formatRelativeTime(incident.createdAt)}</span>
        </div>
      </div>

      {/* Action Strip */}
      <div className="mt-2.5 flex items-center justify-between pt-2">
        <span className="text-[10px] text-sky-400 font-medium">
          {incident.matchedRespondersCount} Responders Nearby
        </span>

        <button
          onClick={handleNextStatus}
          className="flex items-center space-x-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <span>Advance Status</span>
          <ArrowRight className="h-3 w-3 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
