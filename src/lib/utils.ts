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
      return 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse';
    case 'HIGH':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'MODERATE':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  }
}

export function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'REPORTED':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    case 'TRIAGED':
      return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
    case 'MATCHING':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    case 'DISPATCHED':
      return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    case 'EN_ROUTE':
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    case 'ON_SCENE':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'RESOLVED':
      return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    default:
      return 'bg-slate-800 text-slate-300 border-slate-700';
  }
}
