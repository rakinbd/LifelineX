'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  Sparkles, 
  Droplet, 
  Building2, 
  Radio, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  HeartPulse,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useRole, ROLE_LABELS } from '@/context/RoleContext';
import { UserRole, BloodGroup } from '@/types';

type AuthMode = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isAuthenticated, user, currentRole } = useRole();

  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('CITIZEN');

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [facilityName, setFacilityName] = useState('');
  const [badgeId, setBadgeId] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 4 Core Roles for Authentication
  const rolesConfig: { id: UserRole; title: string; subtitle: string; icon: any; color: string; bg: string; border: string }[] = [
    {
      id: 'CITIZEN',
      title: 'Citizen / Requester',
      subtitle: 'Public distress SOS & live emergency tracking',
      icon: User,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
    {
      id: 'BLOOD_DONOR',
      title: 'Verified Blood Donor',
      subtitle: 'Life-saving donor registry & urgent blood appeals',
      icon: Droplet,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
    },
    {
      id: 'HOSPITAL_COORDINATOR',
      title: 'Hospital Coordinator',
      subtitle: 'Trauma ICU bed updates & ambulance fleet inventory',
      icon: Building2,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
    },
    {
      id: 'DISPATCH_OPERATOR',
      title: 'Alert Supervisor',
      subtitle: 'Master command center, incident triage & dispatch',
      icon: Radio,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
  ];

  // Preset demo accounts for 1-click test login
  const demoAccounts: { role: UserRole; name: string; email: string; label: string; icon: any; route: string }[] = [
    {
      role: 'CITIZEN',
      name: 'Rahim Ahmed',
      email: 'rahim.citizen@lifelink.org',
      label: 'Citizen Demo',
      icon: User,
      route: '/',
    },
    {
      role: 'BLOOD_DONOR',
      name: 'David Reynolds (O-)',
      email: 'david.o-neg@lifelink.org',
      label: 'O- Donor Demo',
      icon: Droplet,
      route: '/donors',
    },
    {
      role: 'HOSPITAL_COORDINATOR',
      name: 'Dr. Sarah Connor',
      email: 'dr.connor@metrotrauma.org',
      label: 'Hospital Demo',
      icon: Building2,
      route: '/hospitals',
    },
    {
      role: 'DISPATCH_OPERATOR',
      name: 'Capt. Marcus Vance',
      email: 'cad.ops04@lifelink.org',
      label: 'Alert Supervisor Demo',
      icon: Radio,
      route: '/incidents',
    },
  ];

  const handleDemoLogin = (demo: typeof demoAccounts[0]) => {
    login({
      role: demo.role,
      name: demo.name,
      email: demo.email,
    });
    setSuccessMessage(`Signed in as ${demo.name} (${ROLE_LABELS[demo.role].title})! Redirecting...`);
    setTimeout(() => {
      router.push(demo.route);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (authMode === 'login') {
      login({
        role: selectedRole,
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        bloodGroup: selectedRole === 'BLOOD_DONOR' ? bloodGroup : undefined,
        facilityName: selectedRole === 'HOSPITAL_COORDINATOR' ? facilityName : undefined,
        badgeId: selectedRole === 'DISPATCH_OPERATOR' ? badgeId : undefined,
      });

      setSuccessMessage(`Welcome back! Authenticated as ${ROLE_LABELS[selectedRole].title}.`);
    } else {
      register({
        name: name || 'Registered User',
        email: email || 'user@lifelink.org',
        phone: phone || '+1 (555) 000-0000',
        role: selectedRole,
        bloodGroup: selectedRole === 'BLOOD_DONOR' ? bloodGroup : undefined,
        facilityName: selectedRole === 'HOSPITAL_COORDINATOR' ? facilityName : undefined,
        badgeId: selectedRole === 'DISPATCH_OPERATOR' ? badgeId : undefined,
      });

      setSuccessMessage(`Account created successfully as ${ROLE_LABELS[selectedRole].title}!`);
    }

    setTimeout(() => {
      if (selectedRole === 'BLOOD_DONOR') router.push('/donors');
      else if (selectedRole === 'HOSPITAL_COORDINATOR') router.push('/hospitals');
      else if (selectedRole === 'DISPATCH_OPERATOR') router.push('/incidents');
      else router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center py-4">
      
      {/* 🚨 Immediate Emergency SOS Bypass Alert */}
      <div className="mb-6 rounded-2xl border-2 border-red-500 bg-red-50 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 text-red-900">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm animate-pulse">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-red-700 flex items-center space-x-1.5">
              <span>Facing a Life-Threatening Emergency Right Now?</span>
              <span className="rounded bg-red-200 px-1.5 py-0.5 text-[10px] text-red-950 font-bold">NO LOGIN REQUIRED</span>
            </h4>
            <p className="text-xs text-red-800">
              You do not need to sign in or create an account. Report urgent trauma, bleeding, or cardiac calls immediately.
            </p>
          </div>
        </div>
        <Link
          href="/triage"
          className="shrink-0 flex items-center space-x-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-500 active:scale-[0.98] transition-all"
        >
          <span>Emergency SOS</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        
        {/* Left Side: Brand Mission & Capabilities */}
        <div className="lg:col-span-5 bg-[#172B4D] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white">
                <ShieldAlert className="h-6 w-6 text-teal-400" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">LIFELINK</span>
                <p className="text-xs text-slate-300">Emergency Alert System</p>
              </div>
            </div>

            {/* Tagline & Mission */}
            <div className="space-y-2 pt-2">
              <h2 className="text-2xl font-bold tracking-tight text-white leading-snug">
                Coordinated Emergency Response Network
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect directly with verified blood donors, medical facilities, and active emergency responders.
              </p>
            </div>

            {/* Capabilities List */}
            <div className="space-y-3 pt-3">
              <div className="flex items-start space-x-3 rounded-xl bg-white/5 p-3 border border-white/10">
                <Sparkles className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white">AI Emergency Triage</h4>
                  <p className="text-[11px] text-slate-300">Natural language voice or text triage extracts urgent clinical needs instantly.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 rounded-xl bg-white/5 p-3 border border-white/10">
                <Droplet className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Blood Matching & Cooldown Tracking</h4>
                  <p className="text-[11px] text-slate-300">Compatibility matrix with automated 90-day donation interval tracking.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 rounded-xl bg-white/5 p-3 border border-white/10">
                <Layers className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Incident & Resource GIS Map</h4>
                  <p className="text-[11px] text-slate-300">Real-time geospatial tracking with responder privacy protection.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status footer pill */}
          <div className="pt-6 relative z-10">
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-teal-400"></span>
              <span>Encrypted Healthcare Portal</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Role Selector & Form */}
        <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between">
          <div>
            
            {/* Header with Mode Toggle (Sign In vs Register) */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {authMode === 'login' ? 'Sign In to Your Operational Portal' : 'Create a New LifeLink Account'}
                </h3>
                <p className="text-xs text-slate-500">
                  {authMode === 'login' 
                    ? 'Select your operational role below and enter your credentials.' 
                    : 'Join as a citizen, life-saving blood donor, or hospital coordinator.'}
                </p>
              </div>

              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    authMode === 'login'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    authMode === 'register'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Success notification banner */}
            {successMessage && (
              <div className="mb-5 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 flex items-center space-x-3 text-emerald-900 text-xs font-medium animate-fade-in">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* 4 Role Selector Cards */}
            <div className="mb-6 space-y-2">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide font-mono">
                Select Your Role Profile:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {rolesConfig.map(rc => {
                  const Icon = rc.icon;
                  const isSelected = selectedRole === rc.id;

                  return (
                    <button
                      key={rc.id}
                      type="button"
                      onClick={() => setSelectedRole(rc.id)}
                      className={`flex items-start space-x-3 p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? `border-red-500 bg-red-50/60 shadow-sm ring-1 ring-red-400`
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${rc.bg} ${rc.color} border ${rc.border} shrink-0 mt-0.5`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="truncate flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isSelected ? 'text-red-900' : 'text-slate-900'}`}>
                            {rc.title}
                          </span>
                          {isSelected && <span className="h-2 w-2 rounded-full bg-red-600"></span>}
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                          {rc.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Login / Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name (For Register mode) */}
              {authMode === 'register' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Legal Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Rahim Ahmed"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 focus:border-red-500 focus:outline-none shadow-2xs"
                    />
                  </div>
                </div>
              )}

              {/* Role-Specific Additional Fields in Register Mode */}
              {authMode === 'register' && selectedRole === 'BLOOD_DONOR' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Blood Group *</label>
                    <select
                      value={bloodGroup}
                      onChange={e => setBloodGroup(e.target.value as BloodGroup)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-red-500 focus:outline-none cursor-pointer shadow-2xs font-mono font-bold"
                    >
                      {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as BloodGroup[]).map(bg => (
                        <option key={bg} value={bg}>{bg} ({bg === 'O-' ? 'Universal Red Cell Donor' : bg})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 234-8899"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-red-500 focus:outline-none shadow-2xs"
                    />
                  </div>
                </div>
              )}

              {authMode === 'register' && selectedRole === 'HOSPITAL_COORDINATOR' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Hospital / Medical Facility Name *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={facilityName}
                      onChange={e => setFacilityName(e.target.value)}
                      placeholder="e.g. Metropolitan General Hospital & Trauma Center"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 focus:border-red-500 focus:outline-none shadow-2xs"
                    />
                  </div>
                </div>
              )}

              {/* Email / ID Input */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {selectedRole === 'DISPATCH_OPERATOR' ? 'Operator CAD Email / Badge ID *' : 'Email Address *'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={
                      selectedRole === 'DISPATCH_OPERATOR' 
                        ? 'cad.ops04@lifelink.org' 
                        : selectedRole === 'HOSPITAL_COORDINATOR'
                        ? 'staff@hospital.org'
                        : 'user@lifelink.org'
                    }
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 focus:border-red-500 focus:outline-none shadow-2xs"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    {selectedRole === 'DISPATCH_OPERATOR' ? 'Operator Security Passcode *' : 'Password *'}
                  </label>
                  {authMode === 'login' && (
                    <button type="button" className="text-[11px] font-semibold text-red-600 hover:text-red-700">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 focus:border-red-500 focus:outline-none shadow-2xs"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-[#172B4D] py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#243b53] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                <span>
                  {authMode === 'login' 
                    ? `Sign In as ${ROLE_LABELS[selectedRole].title}` 
                    : `Complete Registration as ${ROLE_LABELS[selectedRole].title}`}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>

            </form>

          </div>

          {/* ⚡ 1-Click Fast Demo Login Switcher */}
          <div className="mt-8 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                ⚡ Quick Demo Switcher (Instant Presentation Mode):
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                1-Click Access
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {demoAccounts.map(demo => {
                const Icon = demo.icon;
                return (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => handleDemoLogin(demo)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all text-center group"
                  >
                    <Icon className="h-4 w-4 text-slate-600 group-hover:text-red-600 mb-1 transition-colors" />
                    <span className="text-[11px] font-bold text-slate-800 group-hover:text-red-600 leading-tight">
                      {demo.label}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate max-w-full">
                      {demo.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
