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
          ? 'border-[#172B4D] bg-slate-50/70 shadow-xs ring-1 ring-[#172B4D]/20'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
      }`}
    >
      {/* Top Header: ID, Urgency & Status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {incident.id}
          </span>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold font-mono ${getUrgencyBadgeColor(incident.urgency)}`}>
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
      <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
        {incident.title}
      </h4>

      {/* Description Snippet */}
      <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
        {incident.description}
      </p>

      {/* AI Extracted Symptoms Tag Strip */}
      {incident.aiExtracted.keySymptoms.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {incident.aiExtracted.keySymptoms.map((sym, i) => (
            <span
              key={i}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 font-medium border border-slate-200"
            >
              {sym}
            </span>
          ))}
          {incident.requiredBloodGroup && (
            <span className="flex items-center space-x-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-rose-700 border border-rose-200">
              <Droplet className="h-2.5 w-2.5 text-rose-600" />
              <span>{incident.requiredBloodGroup} ({incident.unitsNeeded || 1} Units)</span>
            </span>
          )}
        </div>
      )}

      {/* Location & Time Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center space-x-1 truncate max-w-[160px] text-slate-600">
          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
          <span className="truncate">{incident.location.address}</span>
        </span>

        <span className="flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>{formatRelativeTime(incident.createdAt)}</span>
        </span>
      </div>
    </div>
  );
}
