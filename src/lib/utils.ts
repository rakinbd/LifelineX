import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
           ', ' + d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoString;
  }
}

export function formatRelativeTime(isoString: string): string {
  try {
    const now = new Date().getTime();
    const past = new Date(isoString).getTime();
    const diffSec = Math.floor((now - past) / 1000);

    if (diffSec < 60) return `${Math.max(1, diffSec)}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  } catch {
    return 'just now';
  }
}

export function getUrgencyBadgeColor(urgency: string) {
  switch (urgency) {
    case 'CRITICAL':
      return 'bg-red-50 text-red-700 border-red-200 animate-pulse font-semibold';
    case 'HIGH':
      return 'bg-amber-50 text-amber-700 border-amber-200 font-semibold';
    case 'MODERATE':
      return 'bg-blue-50 text-blue-700 border-blue-200 font-semibold';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}

export function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'REPORTED':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'TRIAGED':
      return 'bg-sky-50 text-sky-800 border-sky-200';
    case 'MATCHING':
      return 'bg-purple-50 text-purple-800 border-purple-200';
    case 'DISPATCHED':
      return 'bg-orange-50 text-orange-800 border-orange-200';
    case 'EN_ROUTE':
      return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    case 'ON_SCENE':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'RESOLVED':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}
