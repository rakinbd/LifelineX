'use client';

import React from 'react';
import { useEmergency } from '@/context/EmergencyContext';
import { ShieldCheck } from 'lucide-react';

export default function EmergencyBanner() {
  const { incidents } = useEmergency();
  if (incidents.length === 0) return null;

  return (
    <div className="border-b border-slate-200 bg-white px-4 py-2 text-xs text-slate-700">
      <div className="mx-auto flex max-w-7xl items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-teal-500"></span>
          <span className="font-medium text-slate-700">
            System Online: {incidents.length} active emergency event{incidents.length > 1 ? 's' : ''} being coordinated.
          </span>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-slate-500">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          <span>Active Response Network</span>
        </div>
      </div>
    </div>
  );
}
