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

  // Preset emergency scenarios
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 border border-red-200 text-red-600 shadow-sm">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Emergency SOS Request
              </h3>
              <p className="text-xs text-slate-500">
                AI analyzes your natural language distress description to notify matching responders.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm">
              <CheckCircle2 className="h-8 w-8 animate-bounce" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Emergency Broadcast Dispatched</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Incident registered with Alert System network. Nearby verified donors and first responders have received the tactical ping.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBroadcast} className="mt-5 space-y-4">
            
            {/* Quick Template Scenarios */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
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
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description / Distress Input with Voice option */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Describe Emergency Situation *
                </label>
                <button
                  type="button"
                  onClick={handleSimulateVoice}
                  className={`flex items-center space-x-1.5 rounded-full px-3 py-1 text-[11px] font-semibold border transition-colors ${
                    isRecording
                      ? 'border-red-300 bg-red-50 text-red-700 animate-pulse'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isRecording ? <MicOff className="h-3.5 w-3.5 text-red-600" /> : <Mic className="h-3.5 w-3.5 text-blue-600" />}
                  <span>{isRecording ? 'Listening (Transcribing)...' : 'Simulate Voice SOS'}</span>
                </button>
              </div>

              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                onBlur={() => runTriage()}
                placeholder="e.g. Severe car crash on 5th Ave. Patient bleeding profusely, need urgent B+ blood and emergency ambulance transit."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100 transition-all leading-relaxed"
                required
              />

              <div className="mt-1.5 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Natural language AI extracts category, blood group & urgency.</span>
                <button
                  type="button"
                  onClick={() => runTriage()}
                  disabled={!description.trim() || isTriaging}
                  className="flex items-center space-x-1 text-sky-600 hover:text-sky-700 font-bold"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{isTriaging ? 'Triaging...' : 'Analyze with AI'}</span>
                </button>
              </div>
            </div>

            {/* AI Triage Live Extraction Preview */}
            {triageResult && (
              <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-sky-600" />
                    <span className="text-xs font-bold text-sky-900">AI Help Check Results</span>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold font-mono ${getUrgencyBadgeColor(triageResult.urgency)}`}>
                    {triageResult.urgency} ({triageResult.urgencyScore}/100)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="rounded-xl bg-white p-2.5 border border-sky-100 shadow-xs">
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">CATEGORY</span>
                    <span className="text-slate-800 font-bold">{triageResult.category.replace('_', ' ')}</span>
                  </div>
                  <div className="rounded-xl bg-white p-2.5 border border-sky-100 shadow-xs">
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">DETECTED BLOOD</span>
                    <span className="text-red-600 font-bold font-mono">
                      {triageResult.extractedBloodGroup || 'None detected'}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white p-2.5 border border-sky-100 shadow-xs col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">CONFIDENCE</span>
                    <span className="text-emerald-700 font-mono font-bold">95% Calibrated</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-xl border border-sky-100 shadow-xs">
                  <strong className="text-sky-900">Recommended Action:</strong> {triageResult.suggestedAction}
                </div>
              </div>
            )}

            {/* Location & Contact Form Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Incident Location / Landmark *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-red-500 focus:bg-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Required Blood Group (Optional Override)
                </label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-2.5 h-3.5 w-3.5 text-red-600" />
                  <select
                    value={manualBloodGroup}
                    onChange={e => setManualBloodGroup(e.target.value as BloodGroup)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-red-500 focus:bg-white focus:outline-none cursor-pointer"
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
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Requester Contact Number *
                </label>
                <input
                  type="text"
                  value={requesterContact}
                  onChange={e => setRequesterContact(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-red-500 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Reporting Individual Name / Title
                </label>
                <input
                  type="text"
                  value={requesterName}
                  onChange={e => setRequesterName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-red-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <span className="text-[10px] text-slate-400 flex items-center space-x-1 font-medium">
                <Radio className="h-3 w-3 text-red-600" />
                <span>Encrypted Alert System Protocol Dispatch</span>
              </span>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!description.trim()}
                  className="flex items-center space-x-1.5 rounded-xl bg-rose-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-500 active:scale-[0.98] disabled:opacity-50 transition-all"
                >
                  <span>Dispatch Request</span>
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
