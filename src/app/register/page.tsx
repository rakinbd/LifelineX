'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Droplet, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  ArrowRight, 
  Heart, 
  CheckCircle2, 
  AlertTriangle,
  ShieldCheck,
  Calendar,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useRole } from '@/context/RoleContext';
import { useEmergency } from '@/context/EmergencyContext';
import { BloodGroup } from '@/types';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useRole();
  const { addDonor, playAlertSound } = useEmergency();

  // Standard Account Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Voluntary Donor Opt-in Toggle
  const [isDonorOptIn, setIsDonorOptIn] = useState(false);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [city, setCity] = useState('New York');
  const [area, setArea] = useState('Manhattan, NY');
  const [lastDonationDate, setLastDonationDate] = useState('');

  // Messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMessage('Please enter an email address or phone number.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password.');
      return;
    }

    // 1. Register User in RoleContext
    register({
      name: name.trim(),
      email: email.trim() || `${phone.replace(/[^0-9]/g, '')}@citizen.lifelinex.org`,
      phone: phone.trim() || undefined,
      password,
      bloodGroup: isDonorOptIn ? bloodGroup : undefined,
      isDonor: isDonorOptIn,
      city: isDonorOptIn ? city : undefined,
      lastDonationDate: isDonorOptIn && lastDonationDate ? lastDonationDate : undefined,
    });

    // 2. If Donor Opt-In is checked, also register in EmergencyContext Directory
    if (isDonorOptIn) {
      addDonor({
        fullName: name.trim(),
        bloodGroup,
        contactNumber: phone.trim() || '+1 (555) 000-0000',
        email: email.trim() || 'donor@lifelinex.org',
        city,
        address: area || `${city}, United States`,
        lastDonationDate: lastDonationDate ? new Date(lastDonationDate).toISOString() : new Date().toISOString(),
      });
      playAlertSound();
    }

    setSuccessMessage(
      isDonorOptIn
        ? `Welcome to LifeLineX, ${name}! Your voluntary donor profile (${bloodGroup}) has been added to the directory.`
        : `Welcome to LifeLineX, ${name}! Your account has been registered successfully.`
    );

    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center py-6 sm:py-10">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden max-w-5xl w-full mx-auto">
        
        {/* Left Column: Brand Mission & Donor Community Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0F172A] via-[#172B4D] to-[#1E293B] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-rose-600/15 filter blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-teal-500/15 filter blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 border border-white/20 p-1.5 shadow-md backdrop-blur-xs">
                <img
                  src="/logo.png"
                  alt="LifeLineX"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white font-sans">
                  LifeLine<span className="text-teal-400">X</span>
                </span>
                <p className="text-xs text-teal-300 font-semibold">Connect • Respond • Save Lives</p>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-2 pt-2">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                One Account. Infinite Life-Saving Impact.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Join our life-saving community. Every LifeLineX member can request emergency blood for family members and opt-in as a voluntary blood donor.
              </p>
            </div>

            {/* Capabilities */}
            <div className="space-y-3 pt-3">
              <div className="flex items-start space-x-3 text-xs text-slate-200">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <Heart className="h-3.5 w-3.5" />
                </div>
                <div>
                  <strong className="text-white block">Instant Emergency Appeals</strong>
                  <span className="text-slate-400 text-[11px]">Submit patient requests to alert regional donors immediately.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs text-slate-200">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <strong className="text-white block">Verified Donor Registry</strong>
                  <span className="text-slate-400 text-[11px]">Screened ABO/Rh matching with privacy-protected notifications.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs text-slate-200">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  <Calendar className="h-3.5 w-3.5" />
                </div>
                <div>
                  <strong className="text-white block">90-Day Cooldown Protection</strong>
                  <span className="text-slate-400 text-[11px]">Automatic recovery tracking between whole blood sessions.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between relative z-10">
            <span>© 2026 LifeLineX Network</span>
            <span className="text-teal-400 font-medium">Free & Voluntary</span>
          </div>
        </div>

        {/* Right Column: Clean Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            
            {/* Header */}
            <div className="space-y-1 mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                Create LifeLineX Account
              </h2>
              <p className="text-xs text-slate-500">
                Unified membership for blood seekers and life-saving voluntary donors.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Legal Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Tanvir Hassan"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs transition-colors"
                  />
                </div>
              </div>

              {/* Phone & Email in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Contact Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* INTERACTIVE DONOR OPT-IN CARD */}
              <div className={`rounded-2xl border transition-all p-4 ${
                isDonorOptIn 
                  ? 'border-rose-300 bg-rose-50/60 shadow-xs' 
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
              }`}>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDonorOptIn}
                    onChange={e => setIsDonorOptIn(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Heart className={`h-4 w-4 ${isDonorOptIn ? 'text-rose-600 fill-rose-500' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold text-slate-900">
                        I also want to register as a Voluntary Blood Donor
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Receive notifications when patients in your area urgently need your blood type.
                    </p>
                  </div>
                </label>

                {/* Expanded Inline Donor Fields */}
                {isDonorOptIn && (
                  <div className="mt-4 pt-3 border-t border-rose-200/80 space-y-3.5 animate-in fade-in slide-in-from-top-2">
                    
                    {/* Blood Group Selection Chips */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Your Blood Group *
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                        {BLOOD_GROUPS.map(bg => (
                          <button
                            key={bg}
                            type="button"
                            onClick={() => setBloodGroup(bg)}
                            className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                              bloodGroup === bg
                                ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-300'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {bg}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* City & Present Area */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700 block">
                          City / Division *
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={e => setCity(e.target.value)}
                          placeholder="e.g. New York"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700 block">
                          Present Area / Location
                        </label>
                        <input
                          type="text"
                          value={area}
                          onChange={e => setArea(e.target.value)}
                          placeholder="e.g. Manhattan, New York"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>

                    {/* Last Donation Date */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 block">
                        Date of Last Donation <span className="text-slate-400 font-normal">(Leave empty if first time)</span>
                      </label>
                      <input
                        type="date"
                        value={lastDonationDate}
                        onChange={e => setLastDonationDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-rose-600 hover:bg-rose-500 py-3 text-xs font-bold text-white shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
              >
                <span>Create LifeLineX Account</span>
                <ArrowRight className="h-4 w-4" />
              </button>

            </form>

          </div>

          {/* Emergency Bypass & Sign In Link */}
          <div className="mt-6 space-y-4">
            
            {/* Prominent Emergency Bypass Card */}
            <Link
              href="/donors?tab=request"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100/80 transition-all text-rose-900 shadow-2xs group"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white shrink-0 shadow-xs">
                  <Droplet className="h-4 w-4 fill-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-950 group-hover:text-rose-700 transition-colors">
                    Need blood urgently? Post Emergency Request Without Sign Up →
                  </h4>
                  <p className="text-[11px] text-rose-700">
                    Skip registration to broadcast an immediate patient blood appeal.
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-rose-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>

            {/* Switch to Sign-In */}
            <div className="text-center text-xs text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-rose-600 hover:text-rose-700 hover:underline">
                Sign In to Existing Account
              </Link>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
