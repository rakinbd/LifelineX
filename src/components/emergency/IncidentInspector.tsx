'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
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
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { EmergencyIncident, IncidentStatus, BloodGroup } from '@/types';
import { useEmergency } from '@/context/EmergencyContext';
import { getUrgencyBadgeColor, getStatusBadgeColor, formatDateTime } from '@/lib/utils';
import { MOCK_FACILITIES } from '@/lib/mockData';

interface IncidentInspectorProps {
  incident: EmergencyIncident;
}

export default function IncidentInspector({ incident }: IncidentInspectorProps) {
  const { updateIncidentStatus, getMatchingDonors } = useEmergency();
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'DISPATCH_CAD', text: 'Incident triaged by AI Decision Support. Alerts sent to 4 nearest responders.', time: '10:02 AM' },
    { sender: 'CALLER', text: 'Patient is conscious but losing blood rapidly. Need ETA.', time: '10:04 AM' },
    { sender: 'RESPONDER_104', text: 'Unit ALS-104 en-route via West Highway. ETA is 4 minutes. Apply continuous pressure.', time: '10:05 AM' },
  ]);
  const [alertSentDonorId, setAlertSentDonorId] = useState<string | null>(null);

  const matchedDonors = getMatchingDonors(incident);
  const nearestHospitals = MOCK_FACILITIES.filter(f => f.type === 'TRAUMA_CENTER' || f.type === 'GENERAL_HOSPITAL');

  const statuses: IncidentStatus[] = [
    'REPORTED',
    'TRIAGED',
    'MATCHING',
    'DISPATCHED',
    'EN_ROUTE',
    'ON_SCENE',
    'RESOLVED'
  ];

  const currentStatusIndex = statuses.indexOf(incident.status);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatHistory(prev => [
      ...prev,
      {
        sender: 'OPERATOR',
        text: chatMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatMessage('');
  };

  const handleAlertDonor = (donorId: string) => {
    setAlertSentDonorId(donorId);
    setTimeout(() => setAlertSentDonorId(null), 3000);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      
      {/* Top Banner: ID, Urgency & Status Progress */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <span className="font-mono text-sm font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              {incident.id}
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-mono font-bold ${getUrgencyBadgeColor(incident.urgency)}`}>
              {incident.urgency} ({incident.urgencyScore}/100)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-mono font-semibold ${getStatusBadgeColor(incident.status)}`}>
              {incident.status}
            </span>
          </div>
        </div>

        {/* Tactical Status Stepper */}
        <div className="mt-4 hidden sm:grid grid-cols-7 gap-1">
          {statuses.map((st, idx) => {
            const isCompleted = idx <= currentStatusIndex;
            const isCurrent = idx === currentStatusIndex;
            return (
              <button
                key={st}
                onClick={() => updateIncidentStatus(incident.id, st)}
                className={`py-1.5 px-1 rounded-md text-[9px] font-mono font-bold text-center border transition-all ${
                  isCurrent
                    ? 'bg-red-600 border-red-600 text-white shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Details */}
      <div>
        <h3 className="text-lg font-bold text-slate-900">{incident.title}</h3>
        <p className="mt-2 text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          {incident.description}
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
            <span className="text-slate-500 text-[10px] block uppercase font-mono font-semibold">LOCATION</span>
            <div className="flex items-center space-x-1.5 text-slate-800 font-semibold mt-1">
              <MapPin className="h-3.5 w-3.5 text-red-600 shrink-0" />
              <span className="truncate">{incident.location.address}</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Obfuscated: ±{incident.location.fuzzyRadiusKm || 1.2} km</span>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
            <span className="text-slate-500 text-[10px] block uppercase font-mono font-semibold">CALLER</span>
            <div className="flex items-center space-x-1.5 text-slate-800 font-semibold mt-1">
              <User className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{incident.requesterName}</span>
            </div>
            <span className="text-[10px] text-sky-700 block mt-0.5 font-mono">{incident.requesterContact}</span>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
            <span className="text-slate-500 text-[10px] block uppercase font-mono font-semibold">TIME LOG</span>
            <div className="flex items-center space-x-1.5 text-slate-800 font-semibold mt-1">
              <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span className="truncate">{formatDateTime(incident.createdAt)}</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">Node #8420-US</span>
          </div>
        </div>
      </div>

      {/* AI Triage Analysis Breakdown */}
      <div className="rounded-2xl border border-sky-200 bg-sky-50/40 p-4.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sky-900 font-bold text-xs">
            <Sparkles className="h-4 w-4 text-sky-600" />
            <span>AI Triage Decision Support Breakdown</span>
          </div>
          <span className="text-[10px] font-mono font-semibold text-sky-800 bg-white px-2 py-0.5 rounded border border-sky-200 shadow-xs">
            CONFIDENCE: {Math.round(incident.aiExtracted.triageConfidence * 100)}%
          </span>
        </div>

        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="text-sky-900 font-semibold">Suggested Action:</strong> {incident.aiExtracted.suggestedAction}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[10px] text-slate-500 self-center mr-1">SYMPTOMS:</span>
          {incident.aiExtracted.keySymptoms.map((sym, idx) => (
            <span key={idx} className="rounded-lg bg-white px-2.5 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200 shadow-xs">
              {sym}
            </span>
          ))}
          {incident.requiredBloodGroup && (
            <span className="rounded-lg bg-red-50 px-2.5 py-0.5 text-[10px] font-mono font-bold text-red-700 border border-red-200">
              BLOOD GROUP: {incident.requiredBloodGroup} ({incident.unitsNeeded || 1} Units)
            </span>
          )}
        </div>
      </div>

      {/* Matching Responders & Donors Dispatch Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <Radio className="h-3.5 w-3.5 text-red-600" />
            <span>Eligible Matching Responders ({matchedDonors.length} in range)</span>
          </h4>
          <span className="text-[10px] text-slate-500 font-medium">Sorted by Proximity & Eligibility</span>
        </div>

        <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
          {matchedDonors.slice(0, 4).map((donor) => {
            const isAlerted = alertSentDonorId === donor.id;
            return (
              <div
                key={donor.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-xs font-mono font-bold text-red-700 shadow-xs">
                    {donor.bloodGroup}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <span>{donor.fullName}</span>
                      <span className="text-[9px] text-emerald-700 font-mono font-semibold">✓ Verified</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {donor.distanceKm} km away • {donor.totalDonations} donations • {donor.responseRatePercent}% response rate
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-mono font-bold text-emerald-700 block">{donor.matchScore}%</span>
                    <span className="text-[9px] text-slate-500 uppercase">Match Score</span>
                  </div>

                  <button
                    onClick={() => handleAlertDonor(donor.id)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all border ${
                      isAlerted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-red-600 hover:bg-red-500 border-red-600 text-white shadow-sm'
                    }`}
                  >
                    {isAlerted ? 'Alert Sent!' : 'Mobilize'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-Time Dispatch Tactical Radio / Chat */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
            <span>Encrypted Tactical Dispatch Radio</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono font-semibold">● ACTIVE COMMS</span>
        </div>

        <div className="space-y-2 max-h-36 overflow-y-auto pr-1 text-xs">
          {chatHistory.map((msg, i) => (
            <div key={i} className="rounded-xl bg-white p-2.5 border border-slate-200 shadow-xs">
              <div className="flex justify-between text-[10px] text-slate-500 mb-0.5 font-mono">
                <span className="font-bold text-sky-700">{msg.sender}</span>
                <span>{msg.time}</span>
              </div>
              <p className="text-slate-700 text-[11px]">{msg.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={chatMessage}
            onChange={e => setChatMessage(e.target.value)}
            placeholder="Transmit message to responders & caller..."
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-red-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-white transition-colors flex items-center space-x-1"
          >
            <Send className="h-3 w-3" />
            <span>Send</span>
          </button>
        </form>
      </div>

    </div>
  );
}
