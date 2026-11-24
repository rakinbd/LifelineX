'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Droplet, 
  Lock, 
  Mail, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle,
  Heart,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { useRole } from '@/context/RoleContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useRole();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or phone number.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    login({
      identifier: identifier.trim(),
      password,
    });

    setSuccessMessage('Signed in successfully! Redirecting to blood dashboard...');
    setTimeout(() => {
      router.push('/dashboard');
    }, 700);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center py-6 sm:py-10">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden max-w-5xl w-full mx-auto">
        
        {/* Left Side: Brand Mission & Capabilities Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0F172A] via-[#172B4D] to-[#1E293B] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Ambient Red Wave Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-rose-600/15 filter blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-teal-500/15 filter blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            {/* Brand Header */}
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

            {/* Mission Statement */}
            <div className="space-y-2 pt-2">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Emergency Blood Matching & Volunteer Network
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                A unified medical network empowering citizens to request blood for patients in need and volunteer as screened life-saving donors.
              </p>
            </div>

            {/* Key Capabilities List */}
            <div className="space-y-3 pt-3">
              <div className="flex items-start space-x-3 text-xs text-slate-200">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <Droplet className="h-3.5 w-3.5" />
                </div>
                <div>
                  <strong className="text-white block">Unified Member Account</strong>
                  <span className="text-slate-400 text-[11px]">Request blood for family & donate from a single login.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs text-slate-200">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  <Activity className="h-3.5 w-3.5" />
                </div>
                <div>
                  <strong className="text-white block">Rapid Proximity Dispatch</strong>
                  <span className="text-slate-400 text-[11px]">Locate verified compatible donors within minutes.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs text-slate-200">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <strong className="text-white block">90-Day Safe Recovery Tracker</strong>
                  <span className="text-slate-400 text-[11px]">Automatic cooldown protection safeguarding donor health.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slogan Footer */}
          <div className="pt-8 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between relative z-10">
            <span>© 2026 LifeLineX Network</span>
            <span className="text-teal-400 font-medium">100% Voluntary Community</span>
          </div>
        </div>

        {/* Right Side: Clean Modern Sign-In Card */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            
            {/* Header */}
            <div className="space-y-1 mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                Sign In to LifeLineX
              </h2>
              <p className="text-xs text-slate-500">
                Access patient appeals, donor alerts, and real-time emergency matching.
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

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email or Phone Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Email or Phone Number *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="name@example.com or +1 (555) 019-9922"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password Reset: A temporary recovery link will be sent to your registered email or phone.')}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs transition-colors"
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2 pt-0.5">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-600 cursor-pointer select-none">
                  Remember my session on this device
                </label>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-rose-600 hover:bg-rose-500 py-3 text-xs font-bold text-white shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
              >
                <span>Sign In to LifeLineX</span>
                <ArrowRight className="h-4 w-4" />
              </button>

            </form>

          </div>

          {/* Emergency Bypass Card & Sign Up Link */}
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
                    Emergency? Post Blood Request Without Login →
                  </h4>
                  <p className="text-[11px] text-rose-700">
                    Immediate broadcast to regional blood banks & matching donors.
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-rose-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>

            {/* Switch to Sign-Up & Admin Login Portal */}
            <div className="space-y-2 text-center text-xs text-slate-500">
              <div>
                Don’t have an account yet?{' '}
                <Link href="/register" className="font-bold text-rose-600 hover:text-rose-700 hover:underline">
                  Create a Free LifeLineX Account
                </Link>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                <span>Hospital Authority or Coordinator?</span>
                <Link href="/admin/login" className="font-bold text-purple-700 hover:underline">
                  Admin Portal Login →
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
