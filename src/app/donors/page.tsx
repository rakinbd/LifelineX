'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Droplet, 
  AlertCircle, 
  GitFork, 
  Clock, 
  UserCheck, 
  Radio, 
  Check, 
  MapPin, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Send, 
  Heart,
  Calendar,
  AlertTriangle,
  Info,
  PlusCircle,
  Lock,
  Unlock,
  Crown,
  HeartPulse,
  User,
  Phone,
  Building2,
  ChevronRight,
  Users,
  Activity,
  CheckCircle2,
  Mail,
  Globe,
  Calculator,
  Share2,
  Copy,
  X,
  ExternalLink,
  Sparkles,
  Plus,
  CheckSquare,
  Square,
  History,
  ClipboardCheck,
  Stethoscope,
  FileText,
  ChevronDown,
  ChevronUp,
  Bell,
  HeartHandshake,
  ShieldAlert
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { useRole } from '@/context/RoleContext';
import CompatibilityMatrix from '@/components/blood/CompatibilityMatrix';
import { BloodGroup, EmergencyIncident, UrgencyLevel, BloodDonor } from '@/types';
import { getUrgencyBadgeColor, formatRelativeTime } from '@/lib/utils';
import { getCooldownDaysRemaining, isBloodCompatible, calculateCooldownDetails } from '@/lib/matching/bloodCompatibility';

type BloodTab = 'appeals' | 'request' | 'donate' | 'compatibility' | 'cooldown' | 'registry' | 'mobilize';

function DonorsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as BloodTab | null;

  const { 
    donors, 
    incidents, 
    getMatchingDonors, 
    playAlertSound, 
    createEmergency,
    logDonorDonation,
    getDonorForUser,
    updateDonorCooldown,
    updateIncidentStatus 
  } = useEmergency();
  const { user, isAdmin, canManageBlood, switchUser } = useRole();

  // Selected Incident for Details Modal
  const [selectedAppeal, setSelectedAppeal] = useState<EmergencyIncident | null>(null);

  // Selected Donor Profile Modal for "Read More"
  const [selectedDonorProfile, setSelectedDonorProfile] = useState<BloodDonor | null>(null);

  // Acceptance Modal for "I Can Donate"
  const [donateAppeal, setDonateAppeal] = useState<EmergencyIncident | null>(null);
  const [acceptedToast, setAcceptedToast] = useState<string | null>(null);

  // Active Donor State (synced with logged-in user)
  const currentDonor = (user && getDonorForUser(user.id, user.name)) || donors.find(d => d.fullName.toLowerCase() === 'rahim ahmed') || donors[0];
  const userBloodGroup = currentDonor?.bloodGroup || 'O+';

  const handleConfirmDonate = (appeal: EmergencyIncident) => {
    updateIncidentStatus(appeal.id, 'MATCHING');
    playAlertSound();
    setDonateAppeal(null);
    setAcceptedToast(`Thank you ${currentDonor?.fullName || 'Rahim Ahmed'}! You have accepted appeal ${appeal.id}. The hospital attendant has been notified.`);
    setTimeout(() => {
      setAcceptedToast(null);
    }, 6000);
  };

  // Active tab synced with URL query param (Default: 'appeals')
  const [activeTab, setActiveTab] = useState<BloodTab>('appeals');

  useEffect(() => {
    if (tabParam && ['appeals', 'request', 'donate', 'compatibility', 'cooldown', 'registry', 'mobilize'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: BloodTab) => {
    setActiveTab(tab);
    router.push(`/donors?tab=${tab}`);
  };

  // Appeals & Registry filters
  const [registryFilterGroup, setRegistryFilterGroup] = useState<string>('ALL');
  const [registrySearch, setRegistrySearch] = useState('');
  
  // Mobilization state
  const bloodRequests = incidents.filter(i => i.category === 'BLOOD_TRANSFUSION');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(bloodRequests[0]?.id || '');
  const [mobilizedDonorIds, setMobilizedDonorIds] = useState<string[]>([]);
  const [lastMobilizedDonorName, setLastMobilizedDonorName] = useState<string | null>(null);

  // New Blood Request Form State
  const [reqPatientName, setReqPatientName] = useState('');
  const [reqBloodGroup, setReqBloodGroup] = useState<BloodGroup>('O-');
  const [reqUnitsNeeded, setReqUnitsNeeded] = useState(2);
  const [reqUrgency, setReqUrgency] = useState<UrgencyLevel>('CRITICAL');
  const [reqHospital, setReqHospital] = useState('');
  const [reqContact, setReqContact] = useState('');
  const [reqDescription, setReqDescription] = useState('');
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  // Instant Match Modal State after request submission
  const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [matchResultData, setMatchResultData] = useState<any>(null);
  const [alertedDonorIds, setAlertedDonorIds] = useState<string[]>([]);
  const [allAlerted, setAllAlerted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // New Donor Registration State
  const [donorName, setDonorName] = useState(user?.name || 'Rahim Ahmed');
  const [donorBloodGroup, setDonorBloodGroup] = useState<BloodGroup>('O+');
  const [donorPhone, setDonorPhone] = useState(user?.phone || '+1 (555) 019-9922');
  const [donorEmail, setDonorEmail] = useState(user?.email || 'rahim.citizen@lifelinex.org');
  const [donorCity, setDonorCity] = useState('New York');
  const [donorAddress, setDonorAddress] = useState('Manhattan, New York');
  const [donorLastDate, setDonorLastDate] = useState('2026-08-10');
  const [donorConsent, setDonorConsent] = useState(true);
  const [donorRegisterSuccess, setDonorRegisterSuccess] = useState<string | null>(null);

  // Interactive Cooldown Calculator & Profile Sync state
  const [inputDate, setInputDate] = useState<string>('2026-09-15');
  const [reminderSet, setReminderSet] = useState<boolean>(false);
  const [calculatedCooldown, setCalculatedCooldown] = useState<{
    daysRemaining: number;
    recoveryPercent: number;
    lastDonationDate: string;
    eligibleDate: string;
    eligibleDateShort: string;
    isEligible: boolean;
  }>({
    daysRemaining: 21,
    recoveryPercent: 76,
    lastDonationDate: 'Sept 15, 2026',
    eligibleDate: 'December 14, 2026',
    eligibleDateShort: 'Dec 14, 2026',
    isEligible: false
  });

  // Secondary manual date calculation state (collapsible)
  const [isManualCalcOpen, setIsManualCalcOpen] = useState(false);
  const [manualDateInput, setManualDateInput] = useState('2026-09-15');
  const [manualCalcResult, setManualCalcResult] = useState<{
    daysRemaining: number;
    recoveryPercent: number;
    lastDonationDate: string;
    eligibleDate: string;
    isEligible: boolean;
  } | null>(null);

  // Log New Donation Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logDonationDate, setLogDonationDate] = useState('2026-11-23');
  const [logFacility, setLogFacility] = useState('Johns Hopkins Hospital Blood Center');
  const [logUnits, setLogUnits] = useState(1);
  const [logNotes, setLogNotes] = useState('');
  const [logSuccessToast, setLogSuccessToast] = useState<string | null>(null);

  // 3-Point Pre-Donation Health Check State
  const [healthCheckWeight, setHealthCheckWeight] = useState(true);
  const [healthCheckInfection, setHealthCheckInfection] = useState(true);
  const [healthCheckHemoglobin, setHealthCheckHemoglobin] = useState(true);
  const [healthCheckConfirmed, setHealthCheckConfirmed] = useState(false);

  // Auto-fetch and sync logged-in donor eligibility
  useEffect(() => {
    if (currentDonor?.lastDonationDate) {
      const details = calculateCooldownDetails(currentDonor.lastDonationDate);
      setCalculatedCooldown({
        daysRemaining: details.daysRemaining,
        recoveryPercent: details.recoveryPercent,
        lastDonationDate: details.lastDonationFormatted,
        eligibleDate: details.eligibleDateFormatted,
        eligibleDateShort: details.eligibleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        isEligible: details.isEligible,
      });
      setInputDate(currentDonor.lastDonationDate.slice(0, 10));
      if (currentDonor.cooldownEligible !== details.isEligible) {
        updateDonorCooldown(currentDonor.id, details.isEligible);
      }
    }
  }, [currentDonor?.lastDonationDate, currentDonor?.totalDonations]);

  const handleCalculateCooldown = () => {
    if (!inputDate) return;
    const details = calculateCooldownDetails(inputDate);
    setCalculatedCooldown({
      daysRemaining: details.daysRemaining,
      recoveryPercent: details.recoveryPercent,
      lastDonationDate: details.lastDonationFormatted,
      eligibleDate: details.eligibleDateFormatted,
      eligibleDateShort: details.eligibleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isEligible: details.isEligible,
    });
  };

  const handleCalculateManualDate = () => {
    if (!manualDateInput) return;
    const details = calculateCooldownDetails(manualDateInput);
    setManualCalcResult({
      daysRemaining: details.daysRemaining,
      recoveryPercent: details.recoveryPercent,
      lastDonationDate: details.lastDonationFormatted,
      eligibleDate: details.eligibleDateFormatted,
      isEligible: details.isEligible,
    });
  };

  const handleConfirmLogDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDonor) return;

    logDonorDonation(currentDonor.id, {
      donationDate: logDonationDate,
      facilityName: logFacility,
      unitsDonated: Number(logUnits),
      notes: logNotes || 'Voluntary whole blood donation recorded via Donor Cooldown Tracker.',
    });

    setIsLogModalOpen(false);
    setLogSuccessToast(`Donation logged successfully! 90-day recovery interval initiated for ${currentDonor.fullName}.`);
    playAlertSound();

    setTimeout(() => {
      setLogSuccessToast(null);
    }, 5000);
  };

  const allHealthChecksPassed = healthCheckWeight && healthCheckInfection && healthCheckHemoglobin;

  const handleConfirmHealthReadiness = () => {
    if (!allHealthChecksPassed || !currentDonor) return;
    setHealthCheckConfirmed(true);
    updateDonorCooldown(currentDonor.id, true);
    playAlertSound();
    alert(`Medical Readiness Confirmed! ${currentDonor.fullName} is certified active and ready to receive emergency match alerts.`);
  };

  const handleSetReminder = () => {
    setReminderSet(true);
    alert(`Calendar Reminder Set! You will be notified on ${calculatedCooldown.eligibleDate} when your 90-day recovery target is complete.`);
  };

  const handleMobilizeDonor = (donorId: string, donorName: string) => {
    if (!canManageBlood) {
      alert('Admin Control Required: Only authorized Blood Management Admins can broadcast donor alerts.');
      return;
    }
    setMobilizedDonorIds(prev => [...prev, donorId]);
    setLastMobilizedDonorName(donorName);
    playAlertSound();
    setTimeout(() => {
      setLastMobilizedDonorName(null);
    }, 4000);
  };

  const handleAlertMatchedDonor = (donorId: string, donorName: string) => {
    if (!alertedDonorIds.includes(donorId)) {
      setAlertedDonorIds(prev => [...prev, donorId]);
      playAlertSound();
    }
  };

  const handleBroadcastAllMatched = () => {
    if (!matchResultData?.donors) return;
    const allIds = matchResultData.donors.map((d: any) => d.id);
    setAlertedDonorIds(allIds);
    setAllAlerted(true);
    playAlertSound();
  };

  const handleCopyAppeal = () => {
    if (!matchResultData) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const text = `🚨 EMERGENCY BLOOD NEEDED (LifeLineX Case #${matchResultData.incidentId})\nPatient: ${matchResultData.patientName}\nRequired Group: ${matchResultData.bloodGroup} (${matchResultData.unitsNeeded} Units)\nHospital: ${matchResultData.hospital}\nUrgency: ${matchResultData.urgency}\nContact: ${matchResultData.contact}\nDirect Portal: ${origin}/donors?tab=appeals`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSubmitBloodRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqPatientName || !reqHospital || !reqContact) return;

    const patientSnapshot = reqPatientName;
    const hospitalSnapshot = reqHospital;
    const bloodGroupSnapshot = reqBloodGroup;
    const unitsSnapshot = reqUnitsNeeded;
    const urgencySnapshot = reqUrgency;
    const contactSnapshot = reqContact;
    const descSnapshot = reqDescription;

    const newInc = createEmergency({
      title: `Emergency ${bloodGroupSnapshot} Blood Needed: ${patientSnapshot}`,
      description: descSnapshot || `Patient ${patientSnapshot} at ${hospitalSnapshot} urgently requires ${unitsSnapshot} unit(s) of ${bloodGroupSnapshot} blood.`,
      category: 'BLOOD_TRANSFUSION',
      urgency: urgencySnapshot,
      urgencyScore: urgencySnapshot === 'CRITICAL' ? 95 : urgencySnapshot === 'HIGH' ? 80 : 60,
      status: 'REPORTED',
      location: {
        lat: 40.7128,
        lng: -74.0060,
        address: hospitalSnapshot,
        city: 'New York',
        country: 'United States',
      },
      requiredBloodGroup: bloodGroupSnapshot,
      unitsNeeded: Number(unitsSnapshot),
      requesterName: patientSnapshot,
      requesterContact: contactSnapshot,
      aiExtracted: {
        keySymptoms: ['Transfusion Urgency', 'Severe Anemia / Trauma'],
        suggestedAction: `Dispatch immediate call to compatible ${bloodGroupSnapshot} donors.`,
        duplicateRiskScore: 0.01,
        triageConfidence: 0.95,
      },
    });

    setRequestSuccess(`Blood Request created successfully! Case ID: ${newInc.id}`);
    setReqPatientName('');
    setReqHospital('');
    setReqContact('');
    setReqDescription('');

    // Open instant matching modal in scanning radar mode
    setIsMatchingModalOpen(true);
    setIsScanning(true);
    setAlertedDonorIds([]);
    setAllAlerted(false);
    playAlertSound();

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bloodGroup: bloodGroupSnapshot,
          hospitalName: hospitalSnapshot,
          patientName: patientSnapshot,
          unitsNeeded: unitsSnapshot,
          lat: 23.8103,
          lng: 90.4125,
        }),
      });
      const data = await res.json();

      setTimeout(() => {
        setMatchResultData({
          ...data,
          incidentId: newInc.id,
          patientName: patientSnapshot,
          hospital: hospitalSnapshot,
          bloodGroup: bloodGroupSnapshot,
          unitsNeeded: unitsSnapshot,
          urgency: urgencySnapshot,
          contact: contactSnapshot,
        });
        setIsScanning(false);
        playAlertSound();
      }, 750);
    } catch (err) {
      const fallbackDonors = getMatchingDonors(newInc);
      setTimeout(() => {
        setMatchResultData({
          success: true,
          incidentId: newInc.id,
          patientName: patientSnapshot,
          hospital: hospitalSnapshot,
          bloodGroup: bloodGroupSnapshot,
          unitsNeeded: unitsSnapshot,
          urgency: urgencySnapshot,
          contact: contactSnapshot,
          donorsCount: fallbackDonors.length,
          donors: fallbackDonors,
          scanStats: {
            scannedRadiusKm: 15,
            totalDonorsInPool: donors.length,
            estimatedResponseMin: 8,
          },
        });
        setIsScanning(false);
      }, 750);
    }
  };

  const handleRegisterDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorPhone) return;

    setDonorRegisterSuccess(`Congratulations ${donorName}! You have been registered in our community donor network.`);
    setTimeout(() => {
      setDonorRegisterSuccess(null);
      handleTabChange('registry');
    }, 2500);
  };

  const activeMobilizeIncident = bloodRequests.find(i => i.id === selectedIncidentId) || bloodRequests[0];
  const matchedDonors = activeMobilizeIncident ? getMatchingDonors(activeMobilizeIncident) : [];

  const filteredDonors = donors.filter(d => {
    const matchesGroup = registryFilterGroup === 'ALL' || d.bloodGroup === registryFilterGroup;
    const matchesSearch = 
      d.fullName.toLowerCase().includes(registrySearch.toLowerCase()) ||
      d.location.address.toLowerCase().includes(registrySearch.toLowerCase()) ||
      d.id.toLowerCase().includes(registrySearch.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const getBloodGroupDesc = (bg: BloodGroup) => {
    switch (bg) {
      case 'O-': return 'Universal Red Cell Donor';
      case 'O+': return 'Universal Positive Donor (Can donate to O+, A+, B+, AB+)';
      case 'A+': return 'Compatible with A+ and AB+ recipients';
      case 'A-': return 'Can donate to A+, A-, AB+, AB-';
      case 'B+': return 'Compatible with B+ and AB+ recipients';
      case 'B-': return 'Can donate to B+, B-, AB+, AB-';
      case 'AB+': return 'Universal Plasma Donor & Universal Recipient';
      case 'AB-': return 'Universal Platelet & Plasma Donor';
      default: return 'Screened donor pool';
    }
  };

  const getDonorBloodGroupDesc = (bg: BloodGroup) => {
    switch (bg) {
      case 'O+': return 'Universal Recipient Donor / Compatible with O+, A+, B+, AB+';
      case 'O-': return 'Universal Red Cell Donor / Compatible with all blood types';
      case 'A+': return 'Compatible with A+ and AB+ recipients';
      case 'A-': return 'Can donate to A+, A-, AB+, AB-';
      case 'B+': return 'Compatible with B+ and AB+ recipients';
      case 'B-': return 'Can donate to B+, B-, AB+, AB-';
      case 'AB+': return 'Universal Plasma Donor / Compatible with AB+';
      case 'AB-': return 'Universal Platelet & Plasma Donor';
      default: return 'Community Life-Saving Donor';
    }
  };

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'request':
        return {
          title: 'Request Blood for Patient',
          desc: 'Post an urgent patient blood need to alert compatible voluntary donors and hospital blood banks immediately.',
          icon: PlusCircle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200'
        };
      case 'donate':
        return {
          title: 'Register as Voluntary Donor',
          desc: 'Join the community life-saving voluntary donor pool to help patients during emergency needs.',
          icon: Heart,
          color: 'text-pink-600',
          bg: 'bg-pink-50',
          border: 'border-pink-200'
        };
      case 'compatibility':
        return {
          title: 'Blood Group Matching Guide',
          desc: 'Simple visual guide showing which blood types can give and receive blood safely.',
          icon: GitFork,
          color: 'text-teal-600',
          bg: 'bg-teal-50',
          border: 'border-teal-200'
        };
      case 'cooldown':
        return {
          title: 'Donation Eligibility & Recovery Tracker',
          desc: 'Live 90-day recovery countdown ensuring voluntary donors know exactly when they are ready to donate safely again.',
          icon: Clock,
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200'
        };
      case 'registry':
        return {
          title: 'Available Donors Directory',
          desc: 'Directory of screened regional voluntary donors with blood groups and contact availability.',
          icon: UserCheck,
          color: 'text-slate-700',
          bg: 'bg-slate-100',
          border: 'border-slate-200'
        };
      case 'mobilize':
        return {
          title: 'Admin Blood Dispatch Console',
          desc: 'Authorize, broadcast and mobilize compatible donors for critical emergency transfusions.',
          icon: Radio,
          color: 'text-emerald-700',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200'
        };
      default:
        return {
          title: 'Live Blood Requests Queue',
          desc: 'Real-time patient transfusion requests currently awaiting compatible voluntary blood donors.',
          icon: AlertCircle,
          color: 'text-rose-600',
          bg: 'bg-rose-50',
          border: 'border-rose-200'
        };
    }
  };

  const section = getSectionTitle();
  const SectionIcon = section.icon;

  return (
    <div className="space-y-6">
      
      {/* Top Header with Breadcrumbs & Current Section Details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${section.bg} ${section.color} border ${section.border} shrink-0`}>
            <SectionIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium mb-0.5">
              <span>Blood Network</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-600 font-semibold">{section.title}</span>
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {section.title}
              </h1>
              {canManageBlood && activeTab === 'mobilize' && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  Admin Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
              {section.desc}
            </p>
          </div>
        </div>

        {/* Quick Header Buttons */}
        <div className="flex items-center space-x-2 shrink-0 self-start sm:self-center">
          {activeTab !== 'request' && (
            <button
              onClick={() => handleTabChange('request')}
              className="flex items-center space-x-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-500 active:scale-95 transition-all"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Request Blood</span>
            </button>
          )}

          {activeTab !== 'donate' && (
            <button
              onClick={() => handleTabChange('donate')}
              className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Heart className="h-3.5 w-3.5 text-rose-600" />
              <span>Become a Donor</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content View */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs min-h-[480px]">
        
        {/* ========================================================================= */}
        {/* VIEW 1: ACTIVE EMERGENCY BLOOD APPEALS */}
        {/* ========================================================================= */}
        {activeTab === 'appeals' && (
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

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Active Emergency Appeals Queue ({bloodRequests.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Critical medical requests currently awaiting compatible blood units or apheresis platelets.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTabChange('request')}
                  className="flex items-center space-x-1.5 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-500 transition-colors"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Submit Blood Request</span>
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleTabChange('mobilize')}
                    className="flex items-center space-x-1.5 rounded-xl bg-[#172B4D] px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-[#243b53] transition-colors"
                  >
                    <Radio className="h-3.5 w-3.5 text-teal-400" />
                    <span>Mobilize Console</span>
                  </button>
                )}
              </div>
            </div>

            {bloodRequests.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-12 text-center text-xs text-slate-500">
                No active blood transfusion distress calls reported.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bloodRequests.map((req) => {
                  const isCompatible = req.requiredBloodGroup 
                    ? isBloodCompatible(userBloodGroup, req.requiredBloodGroup) 
                    : false;
                  
                  const canDonate = calculatedCooldown.isEligible && isCompatible;

                  return (
                    <div
                      key={req.id}
                      className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {req.id}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${getUrgencyBadgeColor(req.urgency)}`}>
                              {req.urgency === 'CRITICAL' ? 'Critical: Within 1h' : req.urgency === 'HIGH' ? 'Urgent: 2-4h' : req.urgency}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {formatRelativeTime(req.createdAt)}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="flex h-6 px-2 items-center justify-center rounded-lg bg-rose-600 text-white font-mono font-bold text-xs shadow-2xs">
                              {req.requiredBloodGroup || 'ANY'}
                            </span>
                            <span className="text-xs font-bold text-slate-800">
                              {req.unitsNeeded || 1} Units Required
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{req.title}</h3>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                          {req.description}
                        </p>
                      </div>

                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        <div className="flex items-start space-x-1.5 text-xs text-slate-600">
                          <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1"><strong>Location:</strong> {req.location.address}</span>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="flex items-center space-x-2">
                          {/* Primary Action: I Can Donate */}
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
                              !calculatedCooldown.isEligible
                                ? `You are on 90-day cooldown (${calculatedCooldown.daysRemaining} days remaining)`
                                : !isCompatible
                                ? `Incompatible: Your blood group ${userBloodGroup} cannot donate to ${req.requiredBloodGroup}`
                                : 'Click to confirm your voluntary donation commitment'
                            }
                          >
                            <Heart className="h-3.5 w-3.5" />
                            <span>
                              {canDonate 
                                ? 'I Can Donate' 
                                : !calculatedCooldown.isEligible 
                                ? `In Cooldown (${calculatedCooldown.daysRemaining}d)` 
                                : `Incompatible (${userBloodGroup} → ${req.requiredBloodGroup})`}
                            </span>
                          </button>

                          {/* Secondary Action: View Details & Contact */}
                          <button
                            type="button"
                            onClick={() => setSelectedAppeal(req)}
                            className="py-2 px-3 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs flex items-center space-x-1"
                          >
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            <span>Details & Contact</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: REQUEST BLOOD FORM */}
        {/* ========================================================================= */}
        {activeTab === 'request' && (
          <div className="space-y-6">
            {requestSuccess && (
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{requestSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: Patient Emergency Blood Appeal Form */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                <div className="border-b border-slate-200 pb-3">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Patient Emergency Blood Appeal Form
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Anyone can submit an emergency blood request. The appeal will be broadcast to compatible donors immediately.
                  </p>
                </div>

                <form onSubmit={handleSubmitBloodRequest} className="space-y-5">
                  {/* Row 1: Patient Name & Blood Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Patient Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tanvir Hassan"
                        value={reqPatientName}
                        onChange={e => setReqPatientName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Required Blood Group *
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {(['A+', 'A-', 'B-', 'O-', 'AB+', 'AB-', 'B+', 'O+'] as BloodGroup[]).map(bg => {
                          const isSelected = reqBloodGroup === bg;
                          return (
                            <button
                              key={bg}
                              type="button"
                              onClick={() => setReqBloodGroup(bg)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                isSelected
                                  ? 'bg-[#E11D48] text-white shadow-sm ring-2 ring-rose-300'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {bg}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-1.5 flex items-center space-x-1">
                        <Info className="h-3 w-3 text-rose-500 shrink-0" />
                        <span>{getBloodGroupDesc(reqBloodGroup)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Row 2: Units Needed & Urgency Level */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Number of Units Needed *
                      </label>
                      <div className="flex items-center space-x-3">
                        <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => setReqUnitsNeeded(prev => Math.max(1, prev - 1))}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 active:scale-95 transition-all"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-bold text-xs text-slate-900 font-mono">
                            {reqUnitsNeeded}
                          </span>
                          <button
                            type="button"
                            onClick={() => setReqUnitsNeeded(prev => Math.min(10, prev + 1))}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 active:scale-95 transition-all"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          {reqUnitsNeeded === 1 ? 'Bag (approx. 350-450ml)' : `Bags (approx. ${reqUnitsNeeded * 350}-${reqUnitsNeeded * 450}ml)`}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Urgency Level *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setReqUrgency('CRITICAL')}
                          className={`rounded-xl p-2.5 text-center border transition-all ${
                            reqUrgency === 'CRITICAL'
                              ? 'bg-[#E11D48] border-[#E11D48] text-white shadow-md'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-1 mb-0.5">
                            <HeartPulse className={`h-3.5 w-3.5 ${reqUrgency === 'CRITICAL' ? 'text-white' : 'text-rose-600'}`} />
                            <span className="text-xs font-bold">CRITICAL</span>
                          </div>
                          <span className={`text-[10px] block ${reqUrgency === 'CRITICAL' ? 'text-rose-100' : 'text-slate-500'}`}>
                            (Within 1 hour)
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setReqUrgency('HIGH')}
                          className={`rounded-xl p-2.5 text-center border transition-all ${
                            reqUrgency === 'HIGH'
                              ? 'bg-[#FEF3C7] border-amber-300 text-amber-900 shadow-sm font-semibold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="text-xs font-bold mb-0.5 text-amber-900">URGENT</div>
                          <span className="text-[10px] block text-amber-800">
                            (Within 2-4 hours)
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setReqUrgency('MODERATE')}
                          className={`rounded-xl p-2.5 text-center border transition-all ${
                            reqUrgency === 'MODERATE'
                              ? 'bg-[#E0F2FE] border-sky-300 text-sky-900 shadow-sm font-semibold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="text-xs font-bold mb-0.5 text-sky-900">SCHEDULED</div>
                          <span className="text-[10px] block text-sky-800">
                            (Later)
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Hospital Name & Address */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Hospital / Medical Center Name & Address *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Johns Hopkins Hospital / Toronto General, Emergency Wing"
                        value={reqHospital}
                        onChange={e => setReqHospital(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Row 4: Emergency Contact */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Attendant / Emergency Contact Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={reqContact}
                        onChange={e => setReqContact(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Row 5: Clinical Notes */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Additional Clinical Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Patient scheduled for emergency surgery due to severe accident bleeding."
                      value={reqDescription}
                      onChange={e => setReqDescription(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs"
                    />
                  </div>

                  {/* Broadcast Button */}
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#E11D48] hover:bg-[#BE123C] py-3 text-xs font-bold text-white shadow-sm active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Broadcast Emergency Blood Request</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </div>

              {/* RIGHT COLUMN: Live Broadcast Preview & Matched Donors Radar */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                
                {/* 1. LIVE BROADCAST PREVIEW */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                      Live Broadcast Preview
                    </h3>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                    </span>
                  </div>

                  {/* Smartphone Mockup */}
                  <div className="relative mx-auto w-full max-w-[280px] rounded-[34px] border-[7px] border-slate-800 bg-slate-900 p-2.5 shadow-xl">
                    {/* Dynamic Island Notch */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 h-3.5 w-20 bg-slate-800 rounded-full z-20 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-700 mr-2"></div>
                      <div className="h-1 w-6 rounded-full bg-slate-700"></div>
                    </div>

                    {/* Phone Screen */}
                    <div className="rounded-[24px] bg-white p-4 pt-7 min-h-[250px] flex flex-col justify-between border border-slate-100 shadow-inner">
                      <div className="space-y-3">
                        {/* Top Badges */}
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center space-x-1 rounded-full bg-rose-600 px-2.5 py-0.5 text-[9px] font-extrabold text-white tracking-wide shadow-xs">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                            </span>
                            <span>LIVE</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">LifeLineX Alert</span>
                        </div>

                        {/* Emergency Alert Header */}
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900 tracking-tight leading-snug">
                            EMERGENCY: {reqBloodGroup} BLOOD REQUIRED
                          </h4>
                          <p className="text-[11px] font-medium text-slate-600 mt-1 flex items-center space-x-1">
                            <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate">{reqHospital || 'Johns Hopkins Hospital'}</span>
                          </p>
                        </div>

                        {/* Patient & Units Details */}
                        <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100 space-y-1">
                          <div className="text-[11px] text-slate-700 font-medium truncate">
                            <strong>Patient:</strong> {reqPatientName || 'Tanvir Hassan'}
                          </div>
                          <div className="text-[10px] text-rose-600 font-bold">
                            {reqUnitsNeeded} {reqUnitsNeeded === 1 ? 'Unit' : 'Units'} Needed ({reqUnitsNeeded === 1 ? '350-450ml' : `${reqUnitsNeeded * 350}-${reqUnitsNeeded * 450}ml`})
                          </div>
                        </div>
                      </div>

                      {/* Action / Urgency Button */}
                      <div className="mt-4">
                        {reqUrgency === 'CRITICAL' && (
                          <div className="rounded-xl bg-[#E11D48] px-3 py-2 text-center text-[10px] font-bold text-white shadow-sm flex items-center justify-center space-x-1.5">
                            <HeartPulse className="h-3.5 w-3.5 animate-pulse" />
                            <span>Critical: Within 1 hr</span>
                          </div>
                        )}
                        {reqUrgency === 'HIGH' && (
                          <div className="rounded-xl bg-amber-500 px-3 py-2 text-center text-[10px] font-bold text-white shadow-sm flex items-center justify-center space-x-1.5">
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span>Urgent: Within 2-4 hrs</span>
                          </div>
                        )}
                        {reqUrgency === 'MODERATE' && (
                          <div className="rounded-xl bg-sky-600 px-3 py-2 text-center text-[10px] font-bold text-white shadow-sm flex items-center justify-center space-x-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Scheduled: Later</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. MATCHED DONORS RADAR */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                      Matched Donors Radar
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active Scan
                    </span>
                  </div>

                  {/* Radar Screen Visual */}
                  <div className="relative aspect-[1.3/1] w-full rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 via-rose-50/20 to-slate-100 overflow-hidden flex items-center justify-center shadow-inner">
                    {/* Map Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>

                    {/* Concentric Radar Rings */}
                    <div className="absolute h-48 w-48 rounded-full border border-rose-200/60"></div>
                    <div className="absolute h-32 w-32 rounded-full border border-rose-300/70"></div>
                    <div className="absolute h-16 w-16 rounded-full border border-rose-400/80"></div>

                    {/* Radar Crosshairs */}
                    <div className="absolute w-full h-[1px] bg-rose-200/50"></div>
                    <div className="absolute h-full w-[1px] bg-rose-200/50"></div>

                    {/* Animated Sweeping Radar Beam */}
                    <div 
                      className="absolute h-48 w-48 rounded-full pointer-events-none origin-center animate-[spin_4s_linear_infinite]"
                      style={{
                        background: 'conic-gradient(from 0deg, rgba(225, 29, 72, 0.35) 0deg, rgba(225, 29, 72, 0.08) 55deg, transparent 55deg)'
                      }}
                    />

                    {/* Center Target: Selected Blood Group */}
                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <span className="relative flex h-10 w-10 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60"></span>
                        <span className="relative inline-flex rounded-full h-9 w-9 bg-rose-600 text-white font-extrabold text-xs items-center justify-center shadow-lg border-2 border-white">
                          {reqBloodGroup}
                        </span>
                      </span>
                    </div>

                    {/* Nearby Donor Markers Plotted around Radar */}
                    <div className="absolute top-6 right-10 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[9px] font-bold text-white shadow-md ring-2 ring-white">
                      A-
                    </div>
                    <div className="absolute top-8 left-12 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[9px] font-bold text-white shadow-md ring-2 ring-white">
                      O-
                    </div>
                    <div className="absolute bottom-7 left-14 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[9px] font-bold text-white shadow-md ring-2 ring-white">
                      O-
                    </div>
                    <div className="absolute bottom-6 right-12 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[9px] font-bold text-white shadow-md ring-2 ring-white">
                      B-
                    </div>
                  </div>

                  {/* Metrics Under Radar */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Users className="h-4 w-4 text-rose-600 shrink-0" />
                      <span>
                        <strong>{Math.max(14, donors.filter(d => isBloodCompatible(d.bloodGroup, reqBloodGroup)).length + 10)}</strong> Donors Nearby Match <strong>{reqBloodGroup}</strong>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Building2 className="h-4 w-4 text-sky-600 shrink-0" />
                      <span><strong>3</strong> Local Blood Banks Notified</span>
                    </div>
                    <div className="flex items-center space-x-2 text-emerald-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Estimated response: <strong>5-15 mins</strong></span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: BECOME A DONOR / DONATE BLOOD */}
        {/* ========================================================================= */}
        {activeTab === 'donate' && (
          <div className="space-y-6">
            {donorRegisterSuccess && (
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{donorRegisterSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: Voluntary Donor Registration Form */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                <div className="border-b border-slate-200 pb-3">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Register as a Voluntary Blood Donor
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Join our life-saving community. When someone nearby urgently needs your blood group, you will receive an emergency notification.
                  </p>
                </div>

                <form onSubmit={handleRegisterDonor} className="space-y-5">
                  {/* Row 1: Full Legal Name & Blood Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Rahim Ahmed"
                        value={donorName}
                        onChange={e => setDonorName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Blood Group *
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as BloodGroup[]).map(bg => {
                          const isSelected = donorBloodGroup === bg;
                          return (
                            <button
                              key={bg}
                              type="button"
                              onClick={() => setDonorBloodGroup(bg)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                isSelected
                                  ? 'bg-[#E11D48] text-white shadow-sm ring-2 ring-rose-300'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {bg}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-1.5 flex items-center space-x-1">
                        <Info className="h-3 w-3 text-rose-500 shrink-0" />
                        <span>{getDonorBloodGroupDesc(donorBloodGroup)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Row 2: Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Contact Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="tel"
                          required
                          placeholder="+1 (555) 019-9922"
                          value={donorPhone}
                          onChange={e => setDonorPhone(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          placeholder="rahim.citizen@lifelinex.org"
                          value={donorEmail}
                          onChange={e => setDonorEmail(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: City & Last Donation Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        City / Region *
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="New York"
                          value={donorCity}
                          onChange={e => setDonorCity(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Last Blood Donation Date
                        </label>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                          Leave empty if first time
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="date"
                          value={donorLastDate}
                          onChange={e => setDonorLastDate(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Area Address */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Present Location / Area Address *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Manhattan, New York"
                        value={donorAddress}
                        onChange={e => setDonorAddress(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#E11D48] hover:bg-[#BE123C] py-3 text-xs sm:text-sm font-bold text-white shadow-sm active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Register as Voluntary Life-Saving Donor</span>
                    <Heart className="h-4 w-4" />
                  </button>

                  {/* Agreement Checkbox */}
                  <label className="flex items-start space-x-2.5 text-xs text-slate-600 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={donorConsent}
                      onChange={e => setDonorConsent(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                    <span>
                      I agree to receive emergency alerts and share my blood group with seekers in my area.
                    </span>
                  </label>
                </form>
              </div>

              {/* RIGHT COLUMN: Donor Impact Preview & Neighborhood Activity */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                
                {/* 1. DONOR IMPACT PREVIEW */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                    Donor Impact Preview
                  </h3>

                  {/* Progress Bar with Heart */}
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 border border-rose-200 text-rose-600 shrink-0">
                      <Heart className="h-4 w-4 text-rose-600 fill-rose-600" />
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-[#E11D48] h-2.5 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Hero Blood Drop Illustration & Text */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      Be a Hero: Your single donation can save up to 3 lives!
                    </p>
                    
                    {/* Blood drop with bandage illustration */}
                    <div className="relative shrink-0 w-16 h-16 flex items-center justify-center">
                      <svg viewBox="0 0 100 120" className="w-16 h-16 drop-shadow-md">
                        {/* Blood Drop */}
                        <path
                          d="M50 5 C50 5 88 55 88 80 A38 38 0 1 1 12 80 C12 55 50 5 50 5 Z"
                          fill="#E11D48"
                        />
                        {/* Shiny reflection */}
                        <path
                          d="M30 65 A20 20 0 0 1 45 45"
                          stroke="rgba(255,255,255,0.45)"
                          strokeWidth="4"
                          strokeLinecap="round"
                          fill="none"
                        />
                        {/* Medical Bandage / Plaster across */}
                        <g transform="rotate(-25 50 80)">
                          <rect
                            x="16"
                            y="70"
                            width="68"
                            height="22"
                            rx="6"
                            fill="#FDE68A"
                            stroke="#F59E0B"
                            strokeWidth="1.5"
                          />
                          <circle cx="38" cy="81" r="1.5" fill="#D97706" />
                          <circle cx="44" cy="81" r="1.5" fill="#D97706" />
                          <circle cx="50" cy="81" r="1.5" fill="#D97706" />
                          <circle cx="56" cy="81" r="1.5" fill="#D97706" />
                          <circle cx="62" cy="81" r="1.5" fill="#D97706" />
                        </g>
                      </svg>
                      {/* Sparkle */}
                      <div className="absolute -top-1 -right-1 text-rose-500 text-xs">✨</div>
                    </div>
                  </div>
                </div>

                {/* 2. NEIGHBORHOOD ACTIVITY */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                    Neighborhood Activity
                  </h3>

                  {/* Key Metrics */}
                  <div className="space-y-3">
                    <div className="flex items-baseline space-x-3">
                      <span className="font-mono text-2xl font-black text-slate-900">86</span>
                      <span className="text-xs text-slate-600 leading-tight">
                        Urgent blood requests nearby this month
                      </span>
                    </div>

                    <div className="flex items-baseline space-x-3">
                      <span className="font-mono text-2xl font-black text-slate-900">24</span>
                      <span className="text-xs text-slate-600 leading-tight">
                        Voluntary donors registered this week
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 pt-1">
                      Estimated response time: <span className="font-bold text-emerald-600 font-mono">Fast</span>
                    </div>
                  </div>

                  {/* Map Visual Graphic */}
                  <div className="relative aspect-[1.3/1] w-full rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 via-slate-100/50 to-slate-200/40 overflow-hidden flex items-center justify-center shadow-inner">
                    {/* Street map grid texture */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:28px_28px] opacity-40"></div>

                    {/* River / Road SVG lines in map */}
                    <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 200 160">
                      <path d="M 0 40 Q 60 70 110 50 T 200 80" stroke="#94a3b8" strokeWidth="4" fill="none" />
                      <path d="M 30 160 Q 80 100 140 120 T 200 30" stroke="#93c5fd" strokeWidth="6" fill="none" />
                    </svg>

                    {/* Concentric Pink/Rose Ripple Rings */}
                    <div className="absolute h-40 w-40 rounded-full border border-rose-300/40 bg-rose-100/20"></div>
                    <div className="absolute h-28 w-28 rounded-full border border-rose-400/50 bg-rose-200/30"></div>
                    <div className="absolute h-16 w-16 rounded-full border border-rose-500/60 bg-rose-300/40"></div>

                    {/* Plotted Donor Markers */}
                    {/* Center Donor Marker */}
                    <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white shadow-md ring-2 ring-white">
                      <span className="h-2 w-2 rounded-full bg-white"></span>
                    </div>

                    {/* Top Left Marker */}
                    <div className="absolute top-9 left-16 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white shadow ring-2 ring-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                    </div>

                    {/* Top Right Marker */}
                    <div className="absolute top-11 right-16 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white shadow ring-2 ring-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                    </div>

                    {/* Bottom Left Marker */}
                    <div className="absolute bottom-6 left-12 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white shadow ring-2 ring-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                    </div>

                    {/* Bottom Right Marker */}
                    <div className="absolute bottom-7 right-14 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white shadow ring-2 ring-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: COMPATIBILITY ENGINE */}
        {/* ========================================================================= */}
        {activeTab === 'compatibility' && (
          <div className="space-y-6">
            <CompatibilityMatrix />
          </div>
        )}

        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* VIEW 5: 90-DAY DONOR ELIGIBILITY & RECOVERY TRACKER */}
        {/* ========================================================================= */}
        {activeTab === 'cooldown' && (
          <div className="space-y-6">

            {/* Success Toast when Donation is Logged */}
            {logSuccessToast && (
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900">Donation Successfully Logged!</h4>
                    <p className="text-[11px] text-emerald-700">{logSuccessToast}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setLogSuccessToast(null)} 
                  className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold px-2 py-1"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Top 2-Column Grid: Left (Donor Status & Actions) & Right (Results & Live Recovery Ring) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT CARD: Donor Status & Quick Actions */}
              <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <User className="h-4 w-4 text-slate-500" />
                    <span>Donor Status & Quick Actions</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    ID: {currentDonor?.id || 'DNR-001'}
                  </span>
                </div>

                {/* Logged-In Donor Profile Summary */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 border border-rose-200 font-mono text-base font-bold text-rose-700 shadow-2xs">
                      {currentDonor?.bloodGroup || 'O+'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {currentDonor?.fullName || 'Rahim Ahmed'}
                        </h4>
                        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {currentDonor?.email || 'rahim.citizen@lifelinex.org'}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {currentDonor?.contactNumber || '+1 (555) 019-9922'} • {currentDonor?.location?.city || 'New York'}
                      </p>
                    </div>
                  </div>

                  {/* Badges Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 text-xs">
                    <div className="rounded-lg bg-white p-2 border border-slate-200 shadow-2xs">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Total Donations</span>
                      <div className="flex items-center space-x-1 font-bold text-slate-900 mt-0.5">
                        <Heart className="h-3.5 w-3.5 text-rose-600 fill-rose-500" />
                        <span>{currentDonor?.totalDonations || 4} Times</span>
                      </div>
                    </div>
                    <div className="rounded-lg bg-white p-2 border border-slate-200 shadow-2xs">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Live Status</span>
                      <span className={`inline-flex items-center px-2 py-0.5 mt-0.5 rounded text-[11px] font-bold border ${
                        calculatedCooldown.isEligible 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {calculatedCooldown.isEligible ? 'Eligible' : 'On Cooldown'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button: + Log New Blood Donation */}
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(true)}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-[#172B4D] to-[#243B53] hover:from-[#1E3A8A] hover:to-[#172B4D] text-white py-3 px-4 text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
                >
                  <PlusCircle className="h-4 w-4 text-rose-400" />
                  <span>+ Log New Blood Donation</span>
                </button>

                {/* Collapsible Section: Check Eligibility for Another Date */}
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setIsManualCalcOpen(!isManualCalcOpen)}
                    className="w-full flex items-center justify-between p-3.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span className="flex items-center space-x-2">
                      <Calculator className="h-3.5 w-3.5 text-slate-500" />
                      <span>Check Eligibility for Another Date</span>
                    </span>
                    {isManualCalcOpen ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </button>

                  {isManualCalcOpen && (
                    <div className="p-3.5 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-3">
                      <p className="text-[11px] text-slate-500">
                        Calculate cooldown for a family member, guest, or custom donation date:
                      </p>
                      <div className="flex items-center space-x-2">
                        <input
                          type="date"
                          value={manualDateInput}
                          onChange={e => setManualDateInput(e.target.value)}
                          className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                        <button
                          type="button"
                          onClick={handleCalculateManualDate}
                          className="px-3 py-2 rounded-lg bg-[#172B4D] text-white text-xs font-semibold hover:bg-[#243b53] transition-colors"
                        >
                          Check
                        </button>
                      </div>

                      {manualCalcResult && (
                        <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-[11px]">Recovery Target:</span>
                            <span className={`font-bold ${manualCalcResult.isEligible ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {manualCalcResult.isEligible ? 'Eligible' : `${manualCalcResult.daysRemaining} Days Left`}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600">
                            Eligible on: <strong>{manualCalcResult.eligibleDate}</strong>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Medical Standard Note */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 text-xs text-slate-600 flex items-start space-x-2.5 leading-relaxed">
                  <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <p className="text-[11px]">
                    Whole blood donation requires a 90-day recovery interval to ensure your body replenishes red blood cells and maintains optimal iron stores.
                  </p>
                </div>
              </div>

              {/* RIGHT CARD: Live 90-Day Recovery & Readiness */}
              <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-rose-600" />
                    <span>Live 90-Day Recovery & Readiness</span>
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    calculatedCooldown.isEligible
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {calculatedCooldown.isEligible ? 'Ready to Save Lives' : 'Cooldown Active'}
                  </span>
                </div>

                {/* Radial Progress Ring & Status Details */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  {/* Circular Gauge Ring */}
                  <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
                    <svg className="h-28 w-28 -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="44"
                        stroke="#F1F5F9"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="44"
                        stroke={calculatedCooldown.isEligible ? '#10B981' : '#172B4D'}
                        strokeWidth="8"
                        strokeDasharray={276.46}
                        strokeDashoffset={276.46 - (calculatedCooldown.recoveryPercent / 100) * 276.46}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-mono text-2xl font-black text-slate-900">
                        {calculatedCooldown.isEligible ? '0' : calculatedCooldown.daysRemaining}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 -mt-1">
                        {calculatedCooldown.isEligible ? 'days left' : 'days left'}
                      </span>
                    </div>
                  </div>

                  {/* Status Descriptions */}
                  <div className="space-y-1.5 flex-1">
                    <h4 className="font-mono text-2xl font-black text-slate-900 tracking-tight">
                      {calculatedCooldown.isEligible ? 'Ready to Save Lives' : `${calculatedCooldown.daysRemaining} Days Remaining`}
                    </h4>
                    <div className="text-xs font-medium text-slate-600 flex items-center space-x-1.5">
                      <span>Eligibility Status:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        calculatedCooldown.isEligible 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {calculatedCooldown.isEligible ? 'Eligible to Donate' : 'On Cooldown'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 font-medium pt-0.5">
                      Eligible to Donate On: <strong className="text-slate-900">{calculatedCooldown.eligibleDate}</strong>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      (exactly 90 days after last donation on {calculatedCooldown.lastDonationDate})
                    </div>
                  </div>
                </div>

                {/* Horizontal Timeline Bar */}
                <div className="space-y-2 pt-2">
                  <div className="relative flex items-center justify-between">
                    {/* Left Node */}
                    <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#172B4D] text-white shadow-xs">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>

                    {/* Connecting Line Track */}
                    <div className="absolute left-3 right-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${
                          calculatedCooldown.isEligible ? 'bg-emerald-500' : 'bg-[#172B4D]'
                        }`}
                        style={{ width: `${calculatedCooldown.recoveryPercent}%` }}
                      />
                    </div>

                    {/* Right Node */}
                    <div className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-xs ${
                      calculatedCooldown.isEligible ? 'bg-emerald-600' : 'bg-[#BE123C]'
                    }`}>
                      {calculatedCooldown.isEligible ? (
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      ) : (
                        <Lock className="h-3 w-3" />
                      )}
                    </div>
                  </div>

                  {/* Timeline Labels */}
                  <div className="flex items-start justify-between text-xs pt-1">
                    <div>
                      <div className="font-bold text-slate-900">Last Donation</div>
                      <div className="text-[11px] text-slate-500">({calculatedCooldown.lastDonationDate})</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-slate-900">Current Progress</div>
                      <div className="text-[11px] text-slate-500">({calculatedCooldown.recoveryPercent}% completed)</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${calculatedCooldown.isEligible ? 'text-emerald-700' : 'text-rose-600'}`}>
                        Next Eligibility
                      </div>
                      <div className="text-[11px] text-slate-500">({calculatedCooldown.eligibleDateShort})</div>
                    </div>
                  </div>
                </div>

                {/* Checklist & Feature Options */}
                <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-slate-700 shrink-0">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                    <span>
                      90-day recovery target (100% of 90 days required between whole blood sessions)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-700">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-slate-700 shrink-0">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                    <span>
                      Directory Status: <strong>{calculatedCooldown.isEligible ? 'ELIGIBLE (Alerts Active)' : 'COOLDOWN (Alerts Paused)'}</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700 pt-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-slate-700 shrink-0">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span>Calendar Alert Notification</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleSetReminder}
                      className={`px-3 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                        reminderSet
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs active:scale-95'
                      }`}
                    >
                      {reminderSet ? '✓ Reminder Active' : 'Set a Calendar Reminder'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Point Pre-Donation Health Check (Displayed when Eligible or Pre-Screening) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      3-Point Pre-Donation Health Screening
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Confirm physical readiness before accepting urgent emergency transfusion requests.
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  allHealthChecksPassed
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {allHealthChecksPassed ? 'Medically Cleared' : 'Action Required'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Point 1: Body Weight */}
                <label className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={healthCheckWeight}
                    onChange={e => setHealthCheckWeight(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Body Weight ≥ 50 kg (110 lbs)</span>
                    <span className="text-[11px] text-slate-500">Safe physiological blood volume for standard 450ml draw.</span>
                  </div>
                </label>

                {/* Point 2: No Infections / Fever */}
                <label className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={healthCheckInfection}
                    onChange={e => setHealthCheckInfection(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">No Fever or Antibiotics (Last 14 Days)</span>
                    <span className="text-[11px] text-slate-500">Free of viral infection, fever, or ongoing medication.</span>
                  </div>
                </label>

                {/* Point 3: Normal Hemoglobin & Feeling Well */}
                <label className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={healthCheckHemoglobin}
                    onChange={e => setHealthCheckHemoglobin(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Good Overall Health & Hydrated</span>
                    <span className="text-[11px] text-slate-500">Adequate sleep (6+ hrs) and plenty of fluid intake.</span>
                  </div>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <p className="text-xs text-slate-500">
                  {allHealthChecksPassed
                    ? '✓ All 3 pre-donation requirements satisfied. You are eligible to accept live emergency calls.'
                    : 'Please review and confirm all 3 health screening criteria.'}
                </p>

                <button
                  type="button"
                  disabled={!allHealthChecksPassed}
                  onClick={handleConfirmHealthReadiness}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    allHealthChecksPassed
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  }`}
                >
                  {healthCheckConfirmed ? '✓ Readiness Verified' : 'Confirm Readiness for Emergency Match'}
                </button>
              </div>
            </div>

            {/* Donation History Log (Table & Records) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                    <History className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Donation History Log ({currentDonor?.donationHistory?.length || 4} Records)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Official verified record of life-saving contributions logged by accredited transfusion centers.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
                >
                  <PlusCircle className="h-3.5 w-3.5 text-rose-600" />
                  <span>Log New Entry</span>
                </button>
              </div>

              {/* Donation History List Cards */}
              <div className="space-y-3">
                {(currentDonor?.donationHistory && currentDonor.donationHistory.length > 0
                  ? currentDonor.donationHistory
                  : [
                      {
                        id: 'DON-104',
                        donorId: currentDonor?.id || 'DNR-001',
                        donationDate: '2026-09-15',
                        facilityName: 'Johns Hopkins Hospital Transfusion Center',
                        unitsDonated: 1,
                        notes: 'Emergency whole blood donation for trauma casualty.',
                        verifiedBy: 'Dr. K. Roberts (MD)',
                        createdAt: '2026-09-15T11:00:00Z',
                      },
                      {
                        id: 'DON-103',
                        donorId: currentDonor?.id || 'DNR-001',
                        donationDate: '2026-05-20',
                        facilityName: 'American Red Cross Blood Services',
                        unitsDonated: 1,
                        notes: 'Voluntary summer community blood drive contribution.',
                        verifiedBy: 'Nurse A. Hayes',
                        createdAt: '2026-05-20T10:15:00Z',
                      },
                      {
                        id: 'DON-102',
                        donorId: currentDonor?.id || 'DNR-001',
                        donationDate: '2026-01-18',
                        facilityName: 'Massachusetts General Hospital Blood Center',
                        unitsDonated: 1,
                        notes: 'Routine scheduled voluntary whole blood donation.',
                        verifiedBy: 'Lab Officer S. Evans',
                        createdAt: '2026-01-18T14:00:00Z',
                      },
                      {
                        id: 'DON-101',
                        donorId: currentDonor?.id || 'DNR-001',
                        donationDate: '2025-09-10',
                        facilityName: 'Mount Sinai Hospital Blood Lab',
                        unitsDonated: 1,
                        notes: 'First-time community life-saving pledge.',
                        verifiedBy: 'Dr. M. Foster',
                        createdAt: '2025-09-10T09:00:00Z',
                      }
                    ]
                ).map((record, index) => (
                  <div
                    key={record.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-mono font-bold text-xs mt-0.5">
                        #{index + 1}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-bold text-slate-900">{record.facilityName}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {record.unitsDonated} Bag ({record.unitsDonated * 450}ml)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {record.notes}
                        </p>
                        <div className="text-[10px] text-slate-400 flex items-center space-x-2 pt-0.5">
                          <span>{record.verifiedBy || 'Accredited Transfusion Lab'}</span>
                          <span>•</span>
                          <span className="font-mono">{record.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-slate-900 font-mono">
                        {new Date(record.donationDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-medium flex items-center justify-end space-x-1 mt-0.5">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Verified Log</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}


        {/* VIEW 6: VERIFIED DONORS REGISTRY */}
        {/* ========================================================================= */}
        {activeTab === 'registry' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Verified Blood Donor Registry ({filteredDonors.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Screened donors with verified blood groups and active mutual-aid participation.
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                {['ALL', 'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(bg => (
                  <button
                    key={bg}
                    onClick={() => setRegistryFilterGroup(bg)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-colors ${
                      registryFilterGroup === bg
                        ? 'bg-[#172B4D] border-[#172B4D] text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={registrySearch}
                onChange={e => setRegistrySearch(e.target.value)}
                placeholder="Search donors by name, location, or donor ID..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonors.map(donor => (
                <div
                  key={donor.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Top Image (Portrait Photo - Matching Reference Image) */}
                  <div className="relative w-full h-64 bg-slate-100 overflow-hidden">
                    <img
                      src={donor.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'}
                      alt={donor.fullName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Blood Group Tag */}
                    <div className="absolute top-3 right-3 bg-red-600 text-white font-oswald text-base font-bold px-3 py-1 rounded-xl shadow-md flex items-center space-x-1">
                      <Droplet className="h-4 w-4 fill-white" />
                      <span>{donor.bloodGroup}</span>
                    </div>

                    {/* Status Pill */}
                    <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-full flex items-center space-x-1.5 font-medium shadow-sm">
                      {donor.cooldownEligible ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Ready to Donate</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-3.5 w-3.5 text-amber-400" />
                          <span>In Safe Cooldown</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bottom Content Area */}
                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      {/* Name in Bold Oswald Font */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-oswald text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-1.5">
                          <span>{donor.fullName}</span>
                          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                        </h3>
                      </div>

                      {/* Location */}
                      <div className="flex items-center space-x-1.5 text-sm font-medium text-slate-600">
                        <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                        <span className="truncate">{donor.location.address}, {donor.location.city}</span>
                      </div>

                      {/* Bio / Description Text (Normal Readable Size) */}
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 pt-1">
                        {donor.bio || 'Voluntary registered blood donor actively screened for emergency transfusions and community mutual-aid.'}
                      </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
                      <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                        <span className="text-slate-500 block text-xs uppercase font-semibold">Total Donations</span>
                        <span className="font-oswald text-lg font-bold text-slate-900">{donor.totalDonations} Units</span>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                        <span className="text-slate-500 block text-xs uppercase font-semibold">Response Rate</span>
                        <span className="font-oswald text-lg font-bold text-emerald-700">{donor.responseRatePercent}%</span>
                      </div>
                    </div>

                    {/* Solid Action Button - Matching "Read More" From Reference Image */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedDonorProfile(donor)}
                        className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-oswald text-base font-semibold tracking-wide transition-all shadow-sm flex items-center justify-center space-x-2 active:scale-[0.98]"
                      >
                        <span>Read More</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 7: ADMIN MOBILIZE CONSOLE */}
        {/* ========================================================================= */}
        {activeTab === 'mobilize' && (
          <div className="space-y-6">
            
            {/* Access Guard for non-admin users */}
            {!canManageBlood && (
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3 text-amber-900">
                  <div className="p-2 rounded-xl bg-amber-200 text-amber-900 shrink-0 mt-0.5">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold">
                      Admin Privilege Required for Mobilization Broadcasts
                    </h4>
                    <p className="text-xs text-amber-800">
                      You are in viewing mode. Dispatching alerts and mobilizing donors requires <strong>Blood Management Admin</strong> authorization.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => switchUser('USR-002')}
                  className="shrink-0 flex items-center space-x-1.5 rounded-xl bg-[#172B4D] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#243b53] active:scale-95 transition-all"
                >
                  <Unlock className="h-3.5 w-3.5 text-rose-400" />
                  <span>Switch to Blood Admin</span>
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-bold text-slate-900">
                    Emergency Donor Mobilization Engine
                  </h2>
                  {canManageBlood && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      Authorized Admin Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Calculate compatibility, verify cooldowns, and dispatch emergency alerts to nearby donors.
                </p>
              </div>

              {lastMobilizedDonorName && (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs text-emerald-800 font-medium flex items-center space-x-2 animate-bounce">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Alert dispatched to {lastMobilizedDonorName}!</span>
                </div>
              )}
            </div>

            {/* Select Active Emergency Appeal */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block font-mono">
                Select Emergency Appeal to Mobilize Donors For:
              </label>

              {bloodRequests.length === 0 ? (
                <div className="text-xs text-slate-500">No active blood calls currently open.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {bloodRequests.map(req => {
                    const isSelected = req.id === selectedIncidentId;
                    return (
                      <div
                        key={req.id}
                        onClick={() => setSelectedIncidentId(req.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#172B4D] bg-slate-50 shadow-xs ring-1 ring-[#172B4D]/30'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-800">{req.id}</span>
                          <span className="rounded-lg bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-mono font-semibold text-rose-700">
                            {req.requiredBloodGroup} ({req.unitsNeeded || 1} Units)
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{req.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{req.location.address}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* System Matching Engine Output */}
            {activeMobilizeIncident && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                    Recommended Donors for {activeMobilizeIncident.id} ({activeMobilizeIncident.requiredBloodGroup})
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Ranked by Proximity & Match Score
                  </span>
                </div>

                <div className="space-y-2.5">
                  {matchedDonors.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-500">
                      No matching donors found within immediate radius.
                    </div>
                  ) : (
                    matchedDonors.map((donor) => {
                      const isMobilized = mobilizedDonorIds.includes(donor.id);

                      return (
                        <div
                          key={donor.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 border border-rose-200 text-sm font-mono font-bold text-rose-700">
                              {donor.bloodGroup}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                                <span>{donor.fullName}</span>
                                <span className="text-[10px] text-teal-700 font-mono">✓ Cooldown Cleared</span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {donor.distanceKm} km from trauma site • {donor.totalDonations} donations • {donor.responseRatePercent}% response rate
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 self-end sm:self-auto">
                            <div className="text-right hidden sm:block">
                              <span className="text-sm font-mono font-bold text-teal-700 block">
                                {donor.matchScore}%
                              </span>
                              <span className="text-[9px] text-slate-400 uppercase">Match Score</span>
                            </div>

                            <button
                              onClick={() => handleMobilizeDonor(donor.id, donor.fullName)}
                              disabled={isMobilized || !canManageBlood}
                              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                                !canManageBlood
                                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                  : isMobilized
                                  ? 'bg-teal-700 border-teal-600 text-white'
                                  : 'bg-rose-600 hover:bg-rose-500 border-rose-600 text-white shadow-2xs active:scale-95'
                              }`}
                            >
                              {isMobilized ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Alert Dispatched</span>
                                </>
                              ) : (
                                <>
                                  <Send className="h-3.5 w-3.5" />
                                  <span>{canManageBlood ? 'Mobilize Donor' : 'Admin Only'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* INSTANT PROXIMITY MATCH & RAPID DISPATCH MODAL */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* MODAL: LOG NEW BLOOD DONATION */}
      {/* ========================================================================= */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/70">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
                  <Droplet className="h-5 w-5 fill-rose-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Log New Blood Donation</h3>
                  <p className="text-xs text-slate-500">Record a completed donation to reset your 90-day cooldown.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleConfirmLogDonation} className="p-6 space-y-4">
              
              {/* Donor Name & Blood Group Readonly Preview */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{currentDonor?.fullName || 'Rahim Ahmed'}</div>
                  <div className="text-[11px] text-slate-500">{currentDonor?.email || 'rahim.citizen@lifelinex.org'}</div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-mono font-bold text-xs shadow-xs">
                  {currentDonor?.bloodGroup || 'O+'}
                </span>
              </div>

              {/* Donation Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Date of Donation *
                </label>
                <input
                  type="date"
                  required
                  value={logDonationDate}
                  onChange={e => setLogDonationDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* Hospital / Facility Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Hospital or Blood Bank Facility *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Johns Hopkins Hospital Blood Center"
                  value={logFacility}
                  onChange={e => setLogFacility(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />

                {/* Quick Select Facility Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'Johns Hopkins Hospital Blood Center',
                    'American Red Cross Blood Services',
                    'Mount Sinai Transfusion Center',
                    'Toronto General Hospital Blood Lab'
                  ].map(fac => (
                    <button
                      key={fac}
                      type="button"
                      onClick={() => setLogFacility(fac)}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      {fac}
                    </button>
                  ))}
                </div>
              </div>

              {/* Units Donated */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Units Donated *
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center rounded-xl border border-slate-200 bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setLogUnits(Math.max(1, logUnits - 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-l-xl font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-xs font-bold font-mono text-slate-900">
                      {logUnits}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLogUnits(Math.min(3, logUnits + 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-r-xl font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-500">
                    Bags (~{logUnits * 450}ml whole blood volume)
                  </span>
                </div>
              </div>

              {/* Clinical Notes (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Clinical Notes or Purpose (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Voluntary scheduled whole blood donation for emergency pediatric wing."
                  value={logNotes}
                  onChange={e => setLogNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <Check className="h-4 w-4" />
                  <span>Confirm & Log Donation</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {isMatchingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 via-rose-50/40 to-slate-50 px-6 py-4">
              <div className="flex items-center space-x-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      Instant Proximity Match & Dispatch
                    </h3>
                    <span className="rounded-full bg-rose-100 border border-rose-200 px-2.5 py-0.5 text-[10px] font-extrabold text-rose-700 uppercase tracking-wider font-mono">
                      LIVE RADAR
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Rapid cross-match searching nearby voluntary donors & regional blood banks
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsMatchingModalOpen(false);
                  handleTabChange('appeals');
                }}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                title="Close and View Appeals"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isScanning ? (
                /* Scanning State with high-tech radar animation */
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative flex h-28 w-28 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-rose-300/40 animate-ping"></div>
                    <div className="absolute inset-2 rounded-full border-2 border-rose-400/50 animate-pulse"></div>
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white shadow-xl shadow-rose-500/20">
                      <Radio className="h-9 w-9 animate-spin [animation-duration:3s]" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Scanning LifeLineX Network...
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mt-1">
                      Querying registered voluntary donors within 15 km with biological cross-match compatibility for <strong>{reqBloodGroup}</strong> blood.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                    <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                    <span>Cross-matching ABO & RhD antigen profile...</span>
                  </div>
                </div>
              ) : matchResultData ? (
                /* Match Result View */
                <div className="space-y-6">
                  
                  {/* Top Key Metrics Banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-3.5 text-center">
                      <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block font-mono">
                        Nearby Donors Matched
                      </span>
                      <span className="text-2xl font-black text-rose-950 font-mono">
                        {matchResultData.donorsCount || 0}
                      </span>
                      <span className="text-[11px] text-rose-700 block mt-0.5 font-medium">
                        {matchResultData.bloodGroup} Compatible (0-15 km)
                      </span>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-center">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block font-mono">
                        Fastest Transit ETA
                      </span>
                      <span className="text-2xl font-black text-emerald-950 font-mono">
                        ~{matchResultData.scanStats?.estimatedResponseMin || 8} min
                      </span>
                      <span className="text-[11px] text-emerald-700 block mt-0.5 font-medium">
                        Immediate Alert Scramble
                      </span>
                    </div>

                    <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-3.5 text-center">
                      <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block font-mono">
                        Blood Banks Alerted
                      </span>
                      <span className="text-2xl font-black text-sky-950 font-mono">
                        {matchResultData.facilities?.length || 3}
                      </span>
                      <span className="text-[11px] text-sky-700 block mt-0.5 font-medium">
                        Regional Reserves on Standby
                      </span>
                    </div>
                  </div>

                  {/* One-Click Bulk SOS Broadcast Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-rose-300 bg-gradient-to-r from-rose-600 to-rose-700 p-4 text-white shadow-md">
                    <div className="space-y-0.5 text-center sm:text-left">
                      <h4 className="text-sm font-bold flex items-center justify-center sm:justify-start space-x-2">
                        <Radio className="h-4 w-4 animate-pulse text-rose-200" />
                        <span>Instant Emergency Broadcast Engine</span>
                      </h4>
                      <p className="text-xs text-rose-100">
                        Dispatch push notifications and SMS alerts to all {matchResultData.donorsCount} matched donors with directions to {matchResultData.hospital}.
                      </p>
                    </div>

                    <button
                      onClick={handleBroadcastAllMatched}
                      className={`shrink-0 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center space-x-2 ${
                        allAlerted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white text-rose-700 hover:bg-rose-50'
                      }`}
                    >
                      {allAlerted ? (
                        <>
                          <Check className="h-4 w-4 stroke-[3]" />
                          <span>All {matchResultData.donorsCount} Donors Alerted!</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Broadcast SOS to All Donors ({matchResultData.donorsCount})</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Matched Donors Card List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center space-x-1.5">
                        <Users className="h-4 w-4 text-rose-600" />
                        <span>High-Priority Compatible Donors Nearby</span>
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        Ranked by Proximity & Response Time
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {matchResultData.donors && matchResultData.donors.length > 0 ? (
                        matchResultData.donors.map((donor: any) => {
                          const isAlerted = alertedDonorIds.includes(donor.id);
                          return (
                            <div
                              key={donor.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-slate-300 hover:shadow-2xs transition-all"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 border border-rose-200 text-sm font-mono font-bold text-rose-700">
                                  {donor.bloodGroup}
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h5 className="text-xs font-bold text-slate-900">
                                      {donor.fullName}
                                    </h5>
                                    <span className="inline-flex items-center space-x-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                                      <ShieldCheck className="h-3 w-3 mr-0.5" />
                                      Verified
                                    </span>
                                    <span className="text-[10px] font-mono text-teal-700 font-semibold">
                                      {donor.matchScore}% Match
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-2">
                                    <span className="font-semibold text-slate-700">
                                      {donor.distanceKm} km away
                                    </span>
                                    <span>•</span>
                                    <span>{donor.transitTime || '6 mins transit'}</span>
                                    <span>•</span>
                                    <span>{donor.location?.address}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                                <a
                                  href={`tel:${donor.contactNumber}`}
                                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-all"
                                >
                                  <Phone className="h-3.5 w-3.5 text-rose-600" />
                                  <span>Call Direct</span>
                                </a>

                                <button
                                  type="button"
                                  onClick={() => handleAlertMatchedDonor(donor.id, donor.fullName)}
                                  className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                                    isAlerted
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-[#172B4D] hover:bg-[#243b53] text-white'
                                  }`}
                                >
                                  {isAlerted ? (
                                    <>
                                      <Check className="h-3.5 w-3.5" />
                                      <span>Alert Sent</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send className="h-3.5 w-3.5" />
                                      <span>Alert Donor</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-6 text-center text-xs text-slate-500 rounded-xl bg-slate-50 border border-slate-200">
                          No direct donors found in immediate radius. Emergency blood banks notified below.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Local Blood Banks Notified */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center space-x-1.5">
                      <Building2 className="h-4 w-4 text-sky-600" />
                      <span>Notified Regional Blood Banks & Laboratories</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      {matchResultData.facilities?.map((fac: any) => (
                        <div
                          key={fac.id}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1.5 text-xs"
                        >
                          <div className="font-bold text-slate-900 line-clamp-1">{fac.name}</div>
                          <div className="text-[11px] text-slate-500 truncate">{fac.address}</div>
                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 font-mono">
                            <span className="text-teal-700 font-semibold">{fac.distanceKm} km (~{fac.etaMinutes}m)</span>
                            <a href={`tel:${fac.phone}`} className="text-rose-600 font-bold hover:underline">
                              Call Lab
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Share Urgent Appeal with Community */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-slate-600">
                      <strong>Need to share with attendants or social media?</strong>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Copy the verified case dispatch card to share on WhatsApp or emergency community groups.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleCopyAppeal}
                        className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-slate-500" />
                            <span>Copy Appeal</span>
                          </>
                        )}
                      </button>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `🚨 URGENT BLOOD APPEAL (LifeLineX Case #${matchResultData.incidentId})\nPatient: ${matchResultData.patientName}\nRequired Group: ${matchResultData.bloodGroup} (${matchResultData.unitsNeeded} Units)\nHospital: ${matchResultData.hospital}\nUrgency: ${matchResultData.urgency}\nContact: ${matchResultData.contact}\nDirect Portal: https://lifelinex.org/donors?tab=appeals`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        <span>Share on WhatsApp</span>
                      </a>
                    </div>
                  </div>

                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5">
              <span className="text-[11px] text-slate-500">
                Case registered in real-time LifeLineX emergency queue
              </span>

              <button
                onClick={() => {
                  setIsMatchingModalOpen(false);
                  handleTabChange('appeals');
                }}
                className="rounded-xl bg-[#172B4D] hover:bg-[#243b53] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all"
              >
                View in Active Appeals Queue →
              </button>
            </div>

          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* MODAL: VIEW DETAILS & CONTACT FOR BLOOD APPEALS */}
      {/* ========================================================================= */}
      {selectedAppeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200">
            
            {/* Modal Header */}
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

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              
              {/* Blood Group & Units Required */}
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

              {/* Title & Description */}
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">{selectedAppeal.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedAppeal.description}
                </p>
              </div>

              {/* Hospital & Location Details */}
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

              {/* Attendant & Emergency Contact */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Attendant / Coordinator Hotline
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

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAppeal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                {calculatedCooldown.isEligible && (selectedAppeal.requiredBloodGroup ? isBloodCompatible(userBloodGroup, selectedAppeal.requiredBloodGroup) : true) && (
                  <button
                    type="button"
                    onClick={() => {
                      const app = selectedAppeal;
                      setSelectedAppeal(null);
                      setDonateAppeal(app);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
                  >
                    <Heart className="h-3.5 w-3.5" />
                    <span>I Can Donate</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: "I CAN DONATE" ACCEPTANCE CONFIRMATION */}
      {/* ========================================================================= */}
      {donateAppeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200">
            
            {/* Modal Header */}
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

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Responding Donor:</span>
                  <span className="font-bold text-slate-900">{currentDonor?.fullName || 'Rahim Ahmed'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Your Blood Group:</span>
                  <span className="font-mono font-bold text-rose-700 px-2 py-0.5 rounded bg-rose-50 border border-rose-200">
                    {userBloodGroup} (Compatible)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Target Hospital:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[200px]">{donateAppeal.location.address}</span>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Immediate Life-Saving Mobilization</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  By confirming, you commit to arriving at {donateAppeal.location.address} within the required time window. The hospital transfusion coordinator will be notified with your contact details.
                </p>
              </div>

              {/* Actions */}
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
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  Confirm & Alert Hospital
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL: DONOR PROFILE & DIRECT CONTACT ("READ MORE") */}
      {selectedDonorProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            {/* Modal Image Header */}
            <div className="relative h-56 bg-slate-100">
              <img
                src={selectedDonorProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'}
                alt={selectedDonorProfile.fullName}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedDonorProfile(null)}
                className="absolute top-3 right-3 rounded-full bg-slate-900/70 text-white p-2 hover:bg-slate-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-4 bg-red-600 text-white font-oswald text-lg font-bold px-3 py-1 rounded-xl shadow-md">
                Group {selectedDonorProfile.bloodGroup}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-oswald text-2xl font-bold text-slate-900 flex items-center space-x-2">
                    <span>{selectedDonorProfile.fullName}</span>
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  </h3>
                  <div className="flex items-center space-x-1.5 text-sm text-slate-600 mt-0.5">
                    <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                    <span>{selectedDonorProfile.location.address}, {selectedDonorProfile.location.city}</span>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  selectedDonorProfile.cooldownEligible 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  {selectedDonorProfile.cooldownEligible ? 'Ready to Donate' : 'In Cooldown Period'}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Donor Biography</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedDonorProfile.bio || 'Voluntary registered blood donor actively screened for emergency transfusions and community mutual-aid.'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                  <span className="text-slate-500 block text-xs">Total Transfusions</span>
                  <span className="font-oswald text-lg font-bold text-slate-900">{selectedDonorProfile.totalDonations} Units</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                  <span className="text-slate-500 block text-xs">Response Rate</span>
                  <span className="font-oswald text-lg font-bold text-emerald-700">{selectedDonorProfile.responseRatePercent}%</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                  <span className="text-slate-500 block text-xs">Verified Donor</span>
                  <span className="font-oswald text-lg font-bold text-sky-700">{selectedDonorProfile.isVerified ? 'Yes' : 'Pending'}</span>
                </div>
              </div>

              {/* Direct Contact Phone & Dispatch Button */}
              <div className="rounded-xl bg-slate-900 text-white p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Emergency Contact Phone</span>
                  <span className="font-mono text-base font-bold text-white">{selectedDonorProfile.contactNumber}</span>
                </div>
                <a
                  href={`tel:${selectedDonorProfile.contactNumber}`}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-oswald text-sm font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Donor</span>
                </a>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDonorProfile(null)}
                  className="w-full py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function DonorsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading blood services...</div>}>
      <DonorsContent />
    </Suspense>
  );
}
