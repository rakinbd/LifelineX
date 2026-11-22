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
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm space-y-5">
      
      {/* Top Banner: ID, Urgency & Status Progress */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <span className="font-mono text-sm font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              {incident.id}
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-mono font-bold ${getUrgencyBadgeColor(incident.urgency)}`}>
              {incident.urgency} ({incident.urgencyScore}/100)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-400">Current Phase:</span>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-mono font-bold ${getStatusBadgeColor(incident.status)}`}>
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
                    ? 'bg-red-600 border-red-500 text-white shadow-md shadow-red-950'
                    : isCompleted
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800'
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
        <h3 className="text-lg font-bold text-white">{incident.title}</h3>
        <p className="mt-1 text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
          {incident.description}
        </p>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="rounded-lg bg-slate-900 border border-slate-800 p-2.5">
            <span className="text-slate-500 text-[10px] block uppercase font-mono">LOCATION</span>
            <div className="flex items-center space-x-1.5 text-slate-200 font-medium mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
              <span className="truncate">{incident.location.address}</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Fuzzed Radius: ±{incident.location.fuzzyRadiusKm || 1.2} km</span>
          </div>

          <div className="rounded-lg bg-slate-900 border border-slate-800 p-2.5">
            <span className="text-slate-500 text-[10px] block uppercase font-mono">CALLER / REPORTED BY</span>
            <div className="flex items-center space-x-1.5 text-slate-200 font-medium mt-0.5">
              <User className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              <span className="truncate">{incident.requesterName}</span>
            </div>
            <span className="text-[10px] text-sky-400 block mt-0.5 font-mono">{incident.requesterContact}</span>
          </div>

          <div className="rounded-lg bg-slate-900 border border-slate-800 p-2.5">
            <span className="text-slate-500 text-[10px] block uppercase font-mono">TIME LOG</span>
            <div className="flex items-center space-x-1.5 text-slate-200 font-medium mt-0.5">
              <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{formatDateTime(incident.createdAt)}</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">CAD Node: #8420-US</span>
          </div>
        </div>
      </div>

      {/* AI Triage Analysis Breakdown */}
      <div className="rounded-xl border border-sky-900/40 bg-sky-950/20 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sky-300 font-bold text-xs">
            <Sparkles className="h-4 w-4 text-sky-400" />
            <span>AI Triage Decision Support Breakdown</span>
          </div>
          <span className="text-[10px] font-mono text-sky-400 bg-sky-900/50 px-2 py-0.5 rounded border border-sky-700">
            CONFIDENCE: {Math.round(incident.aiExtracted.triageConfidence * 100)}%
          </span>
        </div>

        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-sky-400 font-semibold">Suggested Action:</strong> {incident.aiExtracted.suggestedAction}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[10px] text-slate-400 self-center mr-1">SYMPTOMS:</span>
          {incident.aiExtracted.keySymptoms.map((sym, idx) => (
            <span key={idx} className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700">
              {sym}
            </span>
          ))}
          {incident.requiredBloodGroup && (
            <span className="rounded-full bg-red-950 px-2.5 py-0.5 text-[10px] font-mono font-bold text-red-400 border border-red-800">
              BLOOD GROUP: {incident.requiredBloodGroup} ({incident.unitsNeeded || 1} Units)
            </span>
          )}
        </div>
      </div>

      {/* Matching Responders & Donors Dispatch Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
            <Radio className="h-3.5 w-3.5 text-red-400" />
            <span>Eligible Matching Responders ({matchedDonors.length} in range)</span>
          </h4>
          <span className="text-[10px] text-slate-400">Sorted by Proximity & Clinical Eligibility</span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {matchedDonors.slice(0, 4).map((donor) => {
            const isAlerted = alertSentDonorId === donor.id;
            return (
              <div
                key={donor.id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-950 border border-red-800 text-xs font-mono font-bold text-red-400">
                    {donor.bloodGroup}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <span>{donor.fullName}</span>
                      <span className="text-[9px] text-emerald-400 font-mono">✓ Verified</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {donor.distanceKm} km away • {donor.totalDonations} donations • {donor.responseRatePercent}% response rate
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-mono font-bold text-emerald-400 block">{donor.matchScore}%</span>
                    <span className="text-[9px] text-slate-500 uppercase">Match Score</span>
                  </div>

                  <button
                    onClick={() => handleAlertDonor(donor.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all border ${
                      isAlerted
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-red-600/90 hover:bg-red-600 border-red-500/50 text-white shadow-sm'
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
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
            <span>Encrypted Tactical Dispatch Radio (Live Link)</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">● LIVE COMMS</span>
        </div>

        <div className="space-y-2 max-h-36 overflow-y-auto pr-1 text-xs">
          {chatHistory.map((msg, i) => (
            <div key={i} className="rounded-lg bg-slate-900/80 p-2 border border-slate-800/80">
              <div className="flex justify-between text-[10px] text-slate-500 mb-0.5 font-mono">
                <span className="font-bold text-sky-400">{msg.sender}</span>
                <span>{msg.time}</span>
              </div>
              <p className="text-slate-300 text-[11px]">{msg.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={chatMessage}
            onChange={e => setChatMessage(e.target.value)}
            placeholder="Transmit message to responders & caller..."
            className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 border border-slate-700 flex items-center space-x-1"
          >
            <Send className="h-3 w-3" />
            <span>Send</span>
          </button>
        </form>
      </div>

    </div>
  );
}
