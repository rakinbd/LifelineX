'use client';

import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Mic, 
  MicOff, 
  Sparkles, 
  MapPin, 
  Droplet, 
  Radio, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { analyzeEmergencyText, TriageResult } from '@/lib/ai/triageEngine';
import { BloodGroup, IncidentCategory, UrgencyLevel } from '@/types';
import { getUrgencyBadgeColor } from '@/lib/utils';

interface QuickSOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickSOSModal({ isOpen, onClose }: QuickSOSModalProps) {
  const { createEmergency } = useEmergency();
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTriaging, setIsTriaging] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  
  // Form fields
  const [address, setAddress] = useState('Central District, Metropolitan Zone 4');
  const [requesterName, setRequesterName] = useState('Emergency Caller');
  const [requesterContact, setRequesterContact] = useState('+1 (555) 019-9922');
  const [manualBloodGroup, setManualBloodGroup] = useState<BloodGroup | ''>('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Preset emergency scenarios for fast one-click testing
  const sampleScenarios = [
    {
      label: 'Highway Trauma & O- Blood',
      text: 'Multi-vehicle collision near exit 4. Severe bleeding from passenger, need immediate O- blood donors and hydraulic ambulance transit.'
    },
    {
      label: 'Cardiac Arrest',
      text: '60-year-old male collapsed, bystander CPR underway. Urgent need for defibrillator (AED) and advanced paramedic unit.'
    },
    {
      label: 'Flood Entrapment',
      text: 'Rapid water flooding lower level apartment. Two residents trapped, water above waist height, power shorted.'
    }
  ];

  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const text = 'Urgent emergency! Severe pedestrian trauma hit and run on 1st Ave. Patient unconscious with heavy blood loss, urgently need B+ blood and ALS ambulance!';
      setDescription(text);
      runTriage(text);
    }, 2000);
  };

  const runTriage = async (textToAnalyze?: string) => {
    const text = textToAnalyze || description;
    if (!text.trim()) return;

    setIsTriaging(true);
    try {
      const result = await analyzeEmergencyText(text);
      setTriageResult(result);
      if (result.extractedBloodGroup) {
        setManualBloodGroup(result.extractedBloodGroup);
      }
    } finally {
      setIsTriaging(false);
    }
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const category: IncidentCategory = triageResult?.category || 'CRITICAL_MEDICAL';
    const urgency: UrgencyLevel = triageResult?.urgency || 'HIGH';
    const urgencyScore = triageResult?.urgencyScore || 85;

    createEmergency({
      title: triageResult?.title || 'Emergency Distress Incident',
      description,
      category,
      urgency,
      urgencyScore,
      status: 'REPORTED',
      location: {
        lat: 40.7306 + (Math.random() - 0.5) * 0.05,
        lng: -73.9352 + (Math.random() - 0.5) * 0.05,
        address: address || 'Reported Incident Coordinates',
        city: 'New York',
        country: 'United States',
        fuzzyRadiusKm: 1.2,
      },
      requiredBloodGroup: (manualBloodGroup || triageResult?.extractedBloodGroup) as BloodGroup | undefined,
      unitsNeeded: triageResult?.extractedUnits || 1,
      requesterName: requesterName || 'Emergency Caller',
      requesterContact: requesterContact || '+1 (555) 911-0000',
      aiExtracted: {
        keySymptoms: triageResult?.keySymptoms || ['Acute Distress'],
        suggestedAction: triageResult?.suggestedAction || 'Mobilize nearest available first responders.',
        duplicateRiskScore: 0.02,
        triageConfidence: triageResult?.triageConfidence || 0.95,
      },
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-red-900/60 bg-slate-950 p-6 shadow-2xl shadow-red-950/50 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600/20 border border-red-500/40 text-red-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>CREATE EMERGENCY SOS REQUEST</span>
                <span className="rounded bg-red-950 border border-red-800 px-1.5 py-0.5 text-[10px] font-mono text-red-400">
                  LIVE CAD
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                AI parses your natural language distress call and mobilizes matching responders.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <CheckCircle2 className="h-8 w-8 animate-bounce" />
            </div>
            <h4 className="text-lg font-bold text-white">Emergency Broadcast Dispatched</h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Incident registered with CAD network. Nearby verified donors and first responders have received the tactical ping.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBroadcast} className="mt-4 space-y-4">
            
            {/* Quick Template Scenarios */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Quick Testing Scenarios:
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {sampleScenarios.map((sc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDescription(sc.text);
                      runTriage(sc.text);
                    }}
                    className="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-slate-800 hover:border-slate-700 transition-colors"
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description / Distress Input with Voice option */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Describe Emergency Situation *
                </label>
                <button
                  type="button"
                  onClick={handleSimulateVoice}
                  className={`flex items-center space-x-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                    isRecording
                      ? 'border-red-500 bg-red-950/60 text-red-400 animate-pulse'
                      : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {isRecording ? <MicOff className="h-3.5 w-3.5 text-red-400" /> : <Mic className="h-3.5 w-3.5 text-blue-400" />}
                  <span>{isRecording ? 'Listening (Transcribing)...' : 'Simulate Voice SOS'}</span>
                </button>
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  onBlur={() => runTriage()}
                  placeholder="e.g. Severe car crash on 5th Ave. Patient bleeding profusely, need urgent B+ blood and emergency ambulance transit."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Natural language AI extracts category, blood group & urgency.</span>
                <button
                  type="button"
                  onClick={() => runTriage()}
                  disabled={!description.trim() || isTriaging}
                  className="flex items-center space-x-1 text-sky-400 hover:text-sky-300 font-medium"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{isTriaging ? 'Triaging...' : 'Analyze with AI'}</span>
                </button>
              </div>
            </div>

            {/* AI Triage Live Extraction Preview */}
            {triageResult && (
              <div className="rounded-xl border border-sky-900/40 bg-sky-950/20 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-sky-400" />
                    <span className="text-xs font-bold text-sky-300">AI Triage Analysis Result</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold font-mono ${getUrgencyBadgeColor(triageResult.urgency)}`}>
                      {triageResult.urgency} ({triageResult.urgencyScore}/100)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="rounded-lg bg-slate-900/80 p-2 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">CATEGORY</span>
                    <span className="text-slate-200 font-medium">{triageResult.category.replace('_', ' ')}</span>
                  </div>
                  <div className="rounded-lg bg-slate-900/80 p-2 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">DETECTED BLOOD</span>
                    <span className="text-red-400 font-bold font-mono">
                      {triageResult.extractedBloodGroup || 'None explicitly specified'}
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-900/80 p-2 border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-slate-500 block text-[10px]">CONFIDENCE</span>
                    <span className="text-emerald-400 font-mono font-medium">94% Deterministic</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                  <strong className="text-sky-400">Recommended Action:</strong> {triageResult.suggestedAction}
                </div>
              </div>
            )}

            {/* Location & Contact Form Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">
                  Incident Location / Landmark *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Street, Hospital, or Landmark"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">
                  Required Blood Group (Optional Override)
                </label>
                <div className="relative">
                  <Droplet className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-red-400" />
                  <select
                    value={manualBloodGroup}
                    onChange={e => setManualBloodGroup(e.target.value as BloodGroup)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none cursor-pointer"
                  >
                    <option value="">Not Applicable / Any</option>
                    <option value="O-">O- Negative (Universal)</option>
                    <option value="O+">O+ Positive</option>
                    <option value="A-">A- Negative</option>
                    <option value="A+">A+ Positive</option>
                    <option value="B-">B- Negative</option>
                    <option value="B+">B+ Positive</option>
                    <option value="AB-">AB- Negative</option>
                    <option value="AB+">AB+ Positive (Universal Recipient)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">
                  Requester Contact / Call-back *
                </label>
                <input
                  type="text"
                  value={requesterContact}
                  onChange={e => setRequesterContact(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">
                  Reporting Individual / Title
                </label>
                <input
                  type="text"
                  value={requesterName}
                  onChange={e => setRequesterName(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                <Radio className="h-3 w-3 text-red-500" />
                <span>Transmits via Encrypted Emergency Dispatch Protocol</span>
              </span>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!description.trim()}
                  className="flex items-center space-x-1.5 rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/70 hover:bg-red-500 active:scale-95 disabled:opacity-50 transition-all"
                >
                  <span>BROADCAST SOS ALERT</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
