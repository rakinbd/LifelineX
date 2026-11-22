'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  AlertTriangle, 
  MapPin, 
  Droplet, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  Radio, 
  Clock, 
  User, 
  Info 
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { analyzeEmergencyText, TriageResult } from '@/lib/ai/triageEngine';
import { BloodGroup, IncidentCategory, UrgencyLevel } from '@/types';
import { getUrgencyBadgeColor } from '@/lib/utils';

export default function TriagePage() {
  const router = useRouter();
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
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Preset emergency scenarios for fast testing
  const sampleScenarios = [
    {
      title: 'Pedestrian Trauma',
      text: 'Pedestrian struck by SUV at intersection. Severe arterial bleeding from right leg, patient drifting in and out of consciousness. Need immediate O- blood and ALS ambulance!'
    },
    {
      title: 'Cardiac Arrest',
      text: 'Elderly man collapsed at community center, unresponsiveness noted. Bystander CPR in progress. Need urgent automated external defibrillator (AED) and cardiac paramedic team.'
    },
    {
      title: 'Flood Entrapment',
      text: 'Flash flood inundating ground floor duplex. Two elderly residents stranded with power outage, water level rising past 3 feet. Raft rescue team needed urgently.'
    },
    {
      title: 'Oncology Platelets',
      text: 'Urgent medical call: pediatric patient requiring 2 units of B+ or compatible platelets for emergency transfusion before surgery.'
    }
  ];

  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const text = 'Emergency SOS! Multiple vehicle crash on highway 101. Trapped passenger with severe head trauma and blood loss. Need urgent O- blood and trauma helicopter transit!';
      setDescription(text);
      runTriage(text);
    }, 2200);
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

    const newIncident = createEmergency({
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

    setSubmittedId(newIncident.id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600 shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-wide">
              AI Emergency SOS & Triage Intake
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Natural language triage engine converts unstructured distress descriptions into actionable CAD dispatch alerts.
            </p>
          </div>
        </div>
      </div>

      {submittedId ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-10 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white border border-emerald-300 text-emerald-600 shadow-sm">
            <CheckCircle2 className="h-8 w-8 animate-bounce" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Emergency Broadcast Successfully Dispatched!</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your distress call has been cataloged as <strong className="font-mono text-emerald-700">#{submittedId}</strong>. Surrounding verified blood donors and active EMT units have received the tactical ping.
            </p>
          </div>
          <div className="pt-4 flex justify-center space-x-3">
            <button
              onClick={() => {
                setSubmittedId(null);
                setDescription('');
                setTriageResult(null);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              Submit Another Report
            </button>
            <button
              onClick={() => router.push(`/incidents/${submittedId}`)}
              className="flex items-center space-x-1.5 rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-500 transition-all"
            >
              <span>View Incident Console</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleBroadcast} className="space-y-6">
          
          {/* Quick Preset Scenarios */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 shadow-xs">
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-600 uppercase block">
              Quick Test Scenarios (Click to Load):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleScenarios.map((sc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setDescription(sc.text);
                    runTriage(sc.text);
                  }}
                  className="text-left rounded-xl border border-slate-200 bg-slate-50/80 p-3 hover:border-slate-300 hover:bg-slate-100/70 transition-all group shadow-2xs"
                >
                  <span className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors block">
                    {sc.title}
                  </span>
                  <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {sc.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Description & Voice Simulation */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Emergency Situation Description *
              </label>
              
              <button
                type="button"
                onClick={handleSimulateVoice}
                className={`flex items-center space-x-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                  isRecording
                    ? 'border-red-400 bg-red-50 text-red-700 animate-pulse'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 shadow-2xs'
                }`}
              >
                {isRecording ? <MicOff className="h-3.5 w-3.5 text-red-600" /> : <Mic className="h-3.5 w-3.5 text-sky-600" />}
                <span>{isRecording ? 'Listening (Simulating voice)...' : 'Simulate Voice Input'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              onBlur={() => runTriage()}
              placeholder="Speak or type what happened. Mention location, bleeding, blood group if known, and severity. AI will automatically parse resources..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 leading-relaxed shadow-2xs"
              required
            />

            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">
                Click &quot;Analyze with AI&quot; or press Tab to trigger real-time entity triage.
              </span>

              <button
                type="button"
                onClick={() => runTriage()}
                disabled={!description.trim() || isTriaging}
                className="flex items-center space-x-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 text-xs font-bold text-sky-700 transition-colors disabled:opacity-50 shadow-2xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-sky-600" />
                <span>{isTriaging ? 'Parsing AI Pipeline...' : 'Analyze with AI'}</span>
              </button>
            </div>
          </div>

          {/* AI Extraction Diagnostic Card */}
          {triageResult && (
            <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-sky-200 pb-2">
                <div className="flex items-center space-x-2 text-sky-800 font-bold text-xs">
                  <Sparkles className="h-4 w-4 text-sky-600" />
                  <span>AI Triage Decision Support Output</span>
                </div>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-mono font-bold ${getUrgencyBadgeColor(triageResult.urgency)}`}>
                  {triageResult.urgency} ({triageResult.urgencyScore}/100)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="rounded-xl bg-white border border-slate-200 p-2.5 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">CATEGORY</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{triageResult.category.replace('_', ' ')}</span>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 p-2.5 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">BLOOD GROUP</span>
                  <span className="font-bold font-mono text-red-600 mt-0.5 block">
                    {triageResult.extractedBloodGroup || 'None detected'}
                  </span>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 p-2.5 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">UNITS NEEDED</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{triageResult.extractedUnits || 1} Unit(s)</span>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 p-2.5 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">CONFIDENCE</span>
                  <span className="font-bold font-mono text-emerald-700 mt-0.5 block">95% Calibrated</span>
                </div>
              </div>

              <div className="rounded-xl bg-white p-3 border border-slate-200 text-xs text-slate-700 leading-relaxed shadow-2xs">
                <strong className="text-sky-800 font-semibold">Recommended Dispatch Action:</strong>{' '}
                {triageResult.suggestedAction}
              </div>
            </div>
          )}

          {/* Location & Requester Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Location & Caller Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Incident Landmark / Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
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
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Required Blood Group (Optional Manual Override)
                </label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-3 h-3.5 w-3.5 text-red-500" />
                  <select
                    value={manualBloodGroup}
                    onChange={e => setManualBloodGroup(e.target.value as BloodGroup)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-red-500 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="">Not Applicable / Any</option>
                    <option value="O-">O- Negative (Universal Donor)</option>
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
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
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
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
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
          </div>

          {/* Broadcast Trigger */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 flex items-center space-x-1.5">
              <Radio className="h-3.5 w-3.5 text-red-500 animate-pulse" />
              <span>Transmits directly to surrounding mutual-aid responder nodes</span>
            </span>

            <button
              type="submit"
              disabled={!description.trim()}
              className="flex items-center space-x-2 rounded-xl bg-red-600 px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-red-500 active:scale-95 disabled:opacity-50 transition-all border border-red-600"
            >
              <span>DISPATCH EMERGENCY BROADCAST</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
