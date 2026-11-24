'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft
} from 'lucide-react';
import { useRole } from '@/context/RoleContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin } = useRole();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Please enter your administrative email or username.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your admin access password.');
      return;
    }

    const res = adminLogin({
      identifier: identifier.trim(),
      password,
    });

    if (res.success) {
      setSuccessMessage(`${res.message} Redirecting to Admin Control Center...`);
      setTimeout(() => {
        router.push('/admin');
      }, 700);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-[#0F172A]">
      <div className="relative z-10 w-full max-w-md">
        
        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Public Website</span>
          </Link>
          <span className="text-xs font-oswald font-bold uppercase tracking-wider text-red-300 bg-red-950 px-3 py-1 rounded-full border border-red-800">
            System Admin Portal
          </span>
        </div>

        {/* Admin Card - Solid Colors Only, No Gradients */}
        <div className="rounded-2xl border border-slate-700 bg-[#1E293B] p-8 shadow-xl space-y-6 text-white">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DC2626] text-white border border-red-500 shadow-md">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-oswald uppercase tracking-wide text-white">
                Admin Control Access
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Authorized System Administrator Access Only
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="rounded-xl border border-red-500 bg-red-950/80 p-3.5 text-sm text-red-200 flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="rounded-xl border border-emerald-500 bg-emerald-950/80 p-3.5 text-sm text-emerald-200 flex items-center space-x-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Simple Solid Admin Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Admin Email / Username */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200 block">
                Administrator Email / Username *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="admin or admin@gmail.com"
                  className="w-full rounded-xl border border-slate-600 bg-slate-900 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200 block">
                Access Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full rounded-xl border border-slate-600 bg-slate-900 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Submit Button - Solid Crimson Color */}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] py-3.5 text-base font-bold font-oswald tracking-wide text-white transition-colors flex items-center justify-center space-x-2 shadow-sm active:scale-[0.99]"
            >
              <ShieldCheck className="h-5 w-5" />
              <span>Verify & Access Admin Console</span>
            </button>

          </form>

          {/* Switch to Regular Member Login */}
          <div className="text-center pt-2 text-sm text-slate-400">
            Looking for regular community donor or request access?{' '}
            <Link href="/login" className="font-semibold text-red-400 hover:underline">
              Member Sign In →
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
