'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Droplet, 
  Heart, 
  ArrowRight, 
  PlusCircle, 
  GitFork, 
  Clock, 
  Users, 
  ShieldCheck, 
  AlertCircle,
  Activity,
  CheckCircle2,
  Phone,
  Radio,
  MapPin,
  Sparkles,
  Building2,
  ExternalLink,
  X,
  Check,
  Info,
  ShieldAlert,
  AlertTriangle,
  Compass,
  PhoneCall,
  Share2,
  Calendar,
  HeartHandshake,
  HelpCircle
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { useRole } from '@/context/RoleContext';
import { getUrgencyBadgeColor, formatRelativeTime } from '@/lib/utils';
import { isBloodCompatible, calculateCooldownDetails } from '@/lib/matching/bloodCompatibility';
import { BloodGroup, EmergencyIncident } from '@/types';
import CompatibilityMatrix from '@/components/blood/CompatibilityMatrix';

const ALL_BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export default function BloodDashboardPage() {
  const router = useRouter();
  const { incidents, donors, metrics, playAlertSound, updateIncidentStatus } = useEmergency();
  const { user, isAdmin } = useRole();

  // Route Separation: Admins are directed to the Dedicated Moderation & Management Dashboard
  useEffect(() => {
    if (isAdmin) {
      router.replace('/admin');
    }
  }, [isAdmin, router]);

  // Selected Incident for Details Modal
  const [selectedAppeal, setSelectedAppeal] = useState<EmergencyIncident | null>(null);

  // Acceptance Modal for "I Can Donate"
  const [donateAppeal, setDonateAppeal] = useState<EmergencyIncident | null>(null);
  const [acceptedToast, setAcceptedToast] = useState<string | null>(null);

  // Active user / donor profile
  const currentDonor = donors.find(d => 
    (user?.id && d.userId === user.id) || 
    (user?.name && d.fullName.toLowerCase() === user.name.toLowerCase()) ||
    d.fullName.toLowerCase() === 'rahim ahmed'
  ) || donors[0];

  // Live user cooldown & eligibility state
  const userCooldown = calculateCooldownDetails(currentDonor?.lastDonationDate || '2026-09-15');
  const isUserEligible = userCooldown.isEligible;
  const userBloodGroup = currentDonor?.bloodGroup || 'O+';

  // Live KPI Calculations
  const bloodRequests = incidents.filter(i => i.category === 'BLOOD_TRANSFUSION');
  const activeAppeals = bloodRequests.filter(i => i.status !== 'RESOLVED');
  const eligibleDonors = donors.filter(d => d.cooldownEligible && d.isAvailable);
  const totalDonorsCount = donors.length;
  const fulfilledTransfusionsCount = metrics.livesImpactedTotal || 14;

  // Handle "I Can Donate" Acceptance
  const handleConfirmDonate = (appeal: EmergencyIncident) => {
    updateIncidentStatus(appeal.id, 'MATCHING');
    playAlertSound();
    setDonateAppeal(null);
    setAcceptedToast(`Thank you ${currentDonor.fullName}! You have accepted appeal ${appeal.id}. The hospital attendant has been notified.`);
    setTimeout(() => {
      setAcceptedToast(null);
    }, 6000);
  };

  return (
    <div className="space-y-6">

      {/* Accepted Donation Confirmation Banner */}
      {acceptedToast && (
        <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-900 flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-900">Donation Acceptance Confirmed!</h4>
              <p className="text-[11px] text-emerald-700">{acceptedToast}</p>
            </div>
          </div>
          <button 
            onClick={() => setAcceptedToast(null)} 
            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Welcome / Blood Request & Donor Hub Banner (Renamed from Command Center) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-blue-50 border border-slate-200 p-1 shadow-2xs">
                <img
                  src="/logo.png"
                  alt="LifeLineX"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-extrabold text-[#172B4D] tracking-tight font-sans">
                    Emergency Blood Hub <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">Real-Time Assistance</span>
                  </h2>
                </div>
                <p className="text-[11px] font-semibold text-teal-700">Connect • Respond • Save Lives</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Real-time community blood portal synchronizing urgent patient appeals, voluntary donor availability, and emergency hospital transfusion needs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/donors?tab=request"
              className="flex items-center space-x-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-500 active:scale-[0.98] transition-all"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Request Blood</span>
            </Link>

            <Link
              href="/donors?tab=donate"
              className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Heart className="h-3.5 w-3.5 text-rose-600" />
              <span>Become a Donor</span>
            </Link>

            <Link
              href="/donors?tab=cooldown"
              className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
              title="Donation Eligibility & Recovery (Track 90-Day Safe Interval)"
            >
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              <span>Donation Eligibility</span>
            </Link>
          </div>
        </div>
      </div>

      {/* FEATURE 1: Personal Donor Readiness Status Strip (Renamed friendly terms) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 px-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 border border-rose-200 font-mono font-bold text-xs text-rose-700 shrink-0">
            {userBloodGroup}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-2 text-xs">
            <span className="font-bold text-slate-900">{currentDonor?.fullName || 'Rahim Ahmed'}:</span>
            <span className="text-slate-600">
              {isUserEligible ? (
                <span className="text-emerald-700 font-medium">Eligible to Donate Blood Today — Safe Interval Passed</span>
              ) : (
                <span>In Safe Recovery Period — <strong>{userCooldown.daysRemaining} Days Until Next Safe Donation</strong> (Eligible on {userCooldown.eligibleDateFormatted})</span>
              )}
            </span>
          </div>

          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
            isUserEligible 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${isUserEligible ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {isUserEligible ? 'Eligible to Donate' : 'Recovery Period Active'}
          </span>
        </div>

        <Link
          href="/donors?tab=cooldown"
          className="flex items-center space-x-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline shrink-0 self-start sm:self-center"
        >
          <span>Check Eligibility Details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* FEATURE 2: Real-Time Consistent KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Active Blood Appeals */}
        <div className="rounded-2xl border border-rose-200 bg-white p-4 shadow-2xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Active Blood Requests</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-rose-900">{activeAppeals.length}</span>
            <span className="text-xs font-bold text-rose-600">Urgent Cases</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Live requests awaiting compatible match</p>
        </div>

        {/* KPI 2: Donors Ready for Donation */}
        <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Donors Ready for Donation</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-700">{eligibleDonors.length} / {totalDonorsCount}</span>
            <span className="text-xs font-bold text-emerald-600">Available</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Excludes donors in 90-day safe recovery interval</p>
        </div>

        {/* KPI 3: Fulfilled Transfusions */}
        <div className="rounded-2xl border border-sky-200 bg-white p-4 shadow-2xs hover:border-sky-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Completed Transfusions</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-sky-900">{fulfilledTransfusionsCount}</span>
            <span className="text-xs font-bold text-sky-600">Lives Saved</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Verified emergency transfusions delivered</p>
        </div>

        {/* KPI 4: Average Match Speed */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Average Match Speed</span>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-100">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">4.8</span>
            <span className="text-xs font-bold text-slate-600">Minutes</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">From request posted to donor response</p>
        </div>
      </div>

      {/* FEATURE 3: Live Blood Group Stock & Availability Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Droplet className="h-4 w-4 text-rose-600 fill-rose-500" />
            <h3 className="text-sm font-bold text-slate-900">
              Live Blood Group Donor Availability
            </h3>
            <span className="text-[11px] text-slate-500">
              — Verified voluntary donors ready for immediate donation
            </span>
          </div>
          <Link
            href="/donors/matrix"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center space-x-1"
          >
            <span>Blood Group Matching Guide</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {ALL_BLOOD_GROUPS.map(bg => {
            const count = donors.filter(d => d.bloodGroup === bg && d.cooldownEligible).length;
            const isShortage = count === 0;

            return (
              <div
                key={bg}
                className={`rounded-xl p-3 border text-center transition-all shadow-2xs flex flex-col justify-between ${
                  isShortage 
                    ? 'bg-rose-50/70 border-rose-200' 
                    : 'bg-slate-50/80 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-mono text-base font-black text-slate-900">
                    {bg}
                  </div>
                  {bg === 'O-' && (
                    <span className="text-[9px] font-semibold text-rose-600 block -mt-0.5">Universal Donor</span>
                  )}
                  {bg === 'AB+' && (
                    <span className="text-[9px] font-semibold text-teal-600 block -mt-0.5">Universal Recipient</span>
                  )}
                </div>

                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-800 font-mono">
                    {count} {count === 1 ? 'Donor' : 'Donors'}
                  </div>
                  {isShortage ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 mt-1 rounded text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      <span className="h-1 w-1 rounded-full bg-rose-600 animate-ping mr-1" />
                      Critical Shortage
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.5 mt-1 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Ready Now
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FEATURE 4: Two-Column Lower Workspace (Actionable Appeals + Live Activity Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Actionable Recent Blood Appeals */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                  <span>Recent Patient Blood Requests ({activeAppeals.length})</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Critical medical requests requiring direct volunteer transfusion responses.
                </p>
              </div>

              <Link
                href="/donors?tab=appeals"
                className="flex items-center space-x-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
              >
                <span>View All Requests</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Appeals Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAppeals.map(req => {
                const isCompatible = req.requiredBloodGroup 
                  ? isBloodCompatible(userBloodGroup, req.requiredBloodGroup) 
                  : false;
                
                const canDonate = isUserEligible && isCompatible;

                return (
                  <div
                    key={req.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3.5 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {req.id}
                        </span>
                        
                        <div className="flex items-center space-x-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            req.urgency === 'CRITICAL' 
                              ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {req.urgency === 'CRITICAL' ? 'Critical: Within 1h' : 'Urgent: 2-4h'}
                          </span>

                          <span className="flex items-center space-x-1 font-mono text-[10px] text-slate-400">
                            <Clock className="h-3 w-3" />
                            <span>{formatRelativeTime(req.createdAt)}</span>
                          </span>
                        </div>
                      </div>

                      {/* Title & Required Blood Group */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="flex h-7 px-2 items-center justify-center rounded-lg bg-rose-600 text-white font-mono font-bold text-xs shadow-2xs">
                            {req.requiredBloodGroup || 'O-'}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            {req.unitsNeeded || 2} Units Needed
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                          {req.title}
                        </h4>
                      </div>

                      {/* Hospital & Location */}
                      <div className="flex items-start space-x-1.5 text-xs text-slate-600">
                        <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{req.location.address}</span>
                      </div>

                      {/* Clinical Summary */}
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                        {req.description}
                      </p>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
                      <button
                        type="button"
                        disabled={!canDonate}
                        onClick={() => setDonateAppeal(req)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center space-x-1.5 ${
                          canDonate
                            ? 'bg-rose-600 hover:bg-rose-500 text-white active:scale-95 shadow-sm'
                            : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed text-[11px]'
                        }`}
                        title={
                          !isUserEligible
                            ? `In 90-day recovery interval (${userCooldown.daysRemaining} days remaining)`
                            : !isCompatible
                            ? `Incompatible blood types: Your blood ${userBloodGroup} cannot donate to ${req.requiredBloodGroup}`
                            : 'Click to confirm your voluntary donation commitment'
                        }
                      >
                        <Heart className="h-3.5 w-3.5" />
                        <span>
                          {canDonate 
                            ? 'I Can Donate' 
                            : !isUserEligible 
                            ? `In Recovery (${userCooldown.daysRemaining}d)` 
                            : `Incompatible (${userBloodGroup} → ${req.requiredBloodGroup})`}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedAppeal(req)}
                        className="py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs flex items-center space-x-1 shrink-0"
                      >
                        <span>Details</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Emergency Radar & Live Activity Feed */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Regional Emergency Radar Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <Radio className="h-4 w-4 text-emerald-600 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900">
                  Nearby Emergency Radar
                </h3>
              </div>
              <span className="font-mono text-[10px] text-slate-400">Dhaka Region</span>
            </div>

            {/* Simulated Radar Visualizer */}
            <div className="relative h-44 w-full rounded-xl bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
              <div className="absolute h-36 w-36 rounded-full border border-teal-500/20" />
              <div className="absolute h-24 w-24 rounded-full border border-teal-500/30" />
              <div className="absolute h-12 w-12 rounded-full border border-teal-500/40" />
              <div className="absolute h-full w-[1px] bg-teal-500/15" />
              <div className="absolute w-full h-[1px] bg-teal-500/15" />

              <div 
                className="absolute inset-0 rounded-full animate-spin"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 75%, rgba(20, 184, 166, 0.45) 100%)',
                  animationDuration: '4s'
                }}
              />

              <div className="absolute top-10 left-16 flex items-center space-x-1 z-10">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                </span>
                <span className="font-mono text-[9px] text-rose-300 font-bold bg-slate-900/90 px-1 rounded">DMCH</span>
              </div>

              <div className="absolute bottom-12 right-16 flex items-center space-x-1 z-10">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                </span>
                <span className="font-mono text-[9px] text-rose-300 font-bold bg-slate-900/90 px-1 rounded">Trauma</span>
              </div>

              <div className="absolute top-20 right-24 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] z-10" title="Elena Rostova (O-)" />
              <div className="absolute bottom-20 left-20 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] z-10" title="Marcus Sterling (B+)" />
              <div className="absolute top-8 right-12 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] z-10" title="Liam O'Connor (O+)" />

              <div className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full bg-teal-400 shadow-[0_0_12px_#2DD4BF]">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-950" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono pt-1">
              <div className="rounded-lg bg-slate-50 p-1.5 border border-slate-200">
                <span className="text-slate-400 block">ACTIVE PATIENTS</span>
                <span className="font-bold text-rose-700">2 Critical Transfusions</span>
              </div>
              <div className="rounded-lg bg-slate-50 p-1.5 border border-slate-200">
                <span className="text-slate-400 block">DONORS NEARBY</span>
                <span className="font-bold text-emerald-700">{eligibleDonors.length} Screened Donors</span>
              </div>
            </div>
          </div>

          {/* Live Activity Feed Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Live Network Activity
                </h3>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                  <Radio className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-slate-800 leading-tight">
                    Emergency O- request broadcasted to 3 nearby donors
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">2m ago • Dhaka Medical College</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-slate-800 leading-tight">
                    Marcus Sterling (B+) accepted appeal INC-8482
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">15m ago • En route to Pediatric Oncology</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700 shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-slate-800 leading-tight">
                    Dhaka Medical College confirmed 2 units received
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">42m ago • Trauma Pavilion ICU</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Blood Group Matching Guide Widget (Renamed from Compatibility Matrix) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
              <GitFork className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Blood Group Matching Guide
              </h3>
              <p className="text-[11px] text-slate-500">
                Check which blood types can donate to and receive blood from each other.
              </p>
            </div>
          </div>
          <Link
            href="/donors/matrix"
            className="flex items-center space-x-1 text-xs font-medium text-teal-700 hover:text-teal-800 transition-colors"
          >
            <span>Full Matching Guide</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <CompatibilityMatrix />
      </div>

      {/* MODAL 1: VIEW DETAILS & CONTACT */}
      {selectedAppeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/70">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-slate-900">{selectedAppeal.id}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      {selectedAppeal.urgency}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Emergency Transfusion Case Details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppeal(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-rose-700 uppercase tracking-wider block">Required Group</span>
                  <div className="text-2xl font-black font-mono text-rose-900">
                    {selectedAppeal.requiredBloodGroup || 'O-'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-rose-700 uppercase tracking-wider block">Quantity</span>
                  <div className="text-xl font-bold font-mono text-rose-900">
                    {selectedAppeal.unitsNeeded || 2} Bags (~900ml)
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">{selectedAppeal.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedAppeal.description}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Hospital / Medical Center
                </span>
                <div className="flex items-start space-x-2 text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Building2 className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">{selectedAppeal.location.address}</div>
                    <div className="text-[11px] text-slate-500">{selectedAppeal.location.city}, {selectedAppeal.location.country}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Attendant / Coordinator Contact
                </span>
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{selectedAppeal.requesterName}</div>
                    <div className="text-[11px] font-mono text-slate-500">{selectedAppeal.requesterContact}</div>
                  </div>
                  <a
                    href={`tel:${selectedAppeal.requesterContact}`}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call Coordinator</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAppeal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <Link
                  href="/donors?tab=appeals"
                  className="px-4 py-2 rounded-xl bg-[#172B4D] hover:bg-[#243B53] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Open in Blood Network
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: "I CAN DONATE" ACCEPTANCE CONFIRMATION */}
      {donateAppeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-rose-50/70">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm">
                  <Heart className="h-5 w-5 fill-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Confirm Donation Commitment</h3>
                  <p className="text-xs text-rose-700 font-semibold">Case #{donateAppeal.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDonateAppeal(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Responding Donor:</span>
                  <span className="font-bold text-slate-900">{currentDonor.fullName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Your Blood Group:</span>
                  <span className="font-mono font-bold text-rose-700">{userBloodGroup}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Patient Required Group:</span>
                  <span className="font-mono font-bold text-rose-700">{donateAppeal.requiredBloodGroup || 'O-'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Hospital:</span>
                  <span className="font-bold text-slate-900">{donateAppeal.location.address}</span>
                </div>
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-[11px] text-rose-800 leading-relaxed">
                By confirming, you agree to proceed directly to the designated medical facility for donation screening. The patient attendant will be provided your contact information.
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDonateAppeal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmDonate(donateAppeal)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center space-x-1.5"
                >
                  <Heart className="h-4 w-4" />
                  <span>I Confirm My Commitment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
