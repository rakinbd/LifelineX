'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Users, 
  Droplet, 
  Crown, 
  UserPlus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Lock, 
  Unlock, 
  User, 
  UserCheck,
  Phone, 
  Mail, 
  Plus, 
  ArrowRight,
  Sparkles,
  ExternalLink,
  Database,
  RefreshCw,
  Server,
  AlertCircle,
  Clock,
  Radio,
  X,
  Check,
  ShieldAlert,
  Building2,
  Send,
  Bell,
  Eye,
  FileText
} from 'lucide-react';
import { useRole, ROLE_LABELS } from '@/context/RoleContext';
import { useEmergency } from '@/context/EmergencyContext';
import { UserRole, UserPermissions, BloodGroup, EmergencyIncident, BloodDonor } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

const ALL_BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') || 'overview';

  const { 
    user, 
    usersList, 
    canManageUsers, 
    updateUserPermissions, 
    updateUserRole, 
    deleteUser, 
    addUser, 
    switchUser,
    isAdmin 
  } = useRole();

  const { 
    incidents, 
    donors, 
    updateIncidentStatus, 
    verifyDonor, 
    deleteIncident, 
    boostIncident, 
    auditLogs, 
    playAlertSound 
  } = useEmergency();

  const [activeTab, setActiveTab] = useState<string>(tabParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // MongoDB connection health state
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [isCheckingDb, setIsCheckingDb] = useState(false);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('USER');

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/admin?tab=${tab}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const checkDatabase = async () => {
    setIsCheckingDb(true);
    try {
      const res = await fetch('/api/db-status');
      const data = await res.json();
      setDbStatus(data);
    } catch (err: any) {
      setDbStatus({ connected: false, error: err.message, status: 'error' });
    } finally {
      setIsCheckingDb(false);
    }
  };

  useEffect(() => {
    checkDatabase();
  }, []);

  // System Metric Calculations
  const bloodRequests = incidents.filter(i => i.category === 'BLOOD_TRANSFUSION');
  const activeAppeals = bloodRequests.filter(i => i.status !== 'RESOLVED');
  const unverifiedDonors = donors.filter(d => !d.isVerified);
  
  // Blood Shortage calculation (groups with 0 eligible available donors)
  const bloodGroupStock = ALL_BLOOD_GROUPS.map(bg => {
    const readyCount = donors.filter(d => d.bloodGroup === bg && d.cooldownEligible && d.isAvailable && d.isVerified).length;
    return { group: bg, count: readyCount, isCritical: readyCount === 0 };
  });
  const criticalShortages = bloodGroupStock.filter(b => b.isCritical);
  const totalUsers = usersList.length;

  // Filtered User directory
  const filteredUsers = usersList.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Action Handlers
  const handleApproveDonor = (donor: BloodDonor) => {
    verifyDonor(donor.id, true);
    showToast(`Approved & Verified: ${donor.fullName} (${donor.bloodGroup}) is now authorized.`);
  };

  const handleRejectDonor = (donor: BloodDonor) => {
    verifyDonor(donor.id, false);
    showToast(`Rejected: Unverified donor application for ${donor.fullName} has been dismissed.`);
  };

  const handleMarkFulfilled = (appeal: EmergencyIncident) => {
    updateIncidentStatus(appeal.id, 'RESOLVED');
    playAlertSound();
    showToast(`Request ${appeal.id} marked as FULFILLED and archived.`);
  };

  const handleBoostAlert = (appeal: EmergencyIncident) => {
    boostIncident(appeal.id);
    showToast(`High-Priority Mass Broadcast sent to all nearby compatible donors for ${appeal.id}.`);
  };

  const handleDeleteRequest = (appeal: EmergencyIncident) => {
    deleteIncident(appeal.id);
    showToast(`Flagged & Deleted: Request ${appeal.id} removed from the active appeals queue.`);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    addUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim() || undefined,
      role: newUserRole,
      permissions: {
        bloodManagement: newUserRole === 'BLOOD_ADMIN' || newUserRole === 'SUPER_ADMIN',
        hospitalManagement: false,
        dispatchManagement: false,
        userManagement: newUserRole === 'SUPER_ADMIN',
      },
    });

    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setIsAddUserOpen(false);
    showToast(`Successfully registered new administrative user: ${newUserName}`);
  };

  return (
    <div className="space-y-6">

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-emerald-300 bg-slate-900 text-white px-4 py-3 shadow-2xl flex items-center space-x-2.5 text-xs animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Admin Welcome Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 border border-purple-200 text-purple-700 shadow-2xs">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
                  System Moderation & Management Dashboard
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Central authority console for verifying donors, moderating emergency requests, and platform security.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Sub-Navigation Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => handleTabChange('overview')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleTabChange('verifications')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeTab === 'verifications'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Donor Verifications</span>
              {unverifiedDonors.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-100 text-amber-800">
                  {unverifiedDonors.length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabChange('requests')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeTab === 'requests'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Request Moderation</span>
              {activeAppeals.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-100 text-rose-800">
                  {activeAppeals.length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabChange('users')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'users'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Users & Roles
            </button>
            <button
              onClick={() => handleTabChange('audit')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'audit'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Audit Trail
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP SYSTEM KPI CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Pending Donor Verifications */}
        <div 
          onClick={() => handleTabChange('verifications')}
          className="rounded-2xl border border-amber-200 bg-white p-5 shadow-2xs hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">Pending Donor Verifications</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 group-hover:scale-105 transition-transform">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-oswald text-amber-900">{unverifiedDonors.length}</span>
            <span className="text-xs font-bold text-amber-700 uppercase">Awaiting Clearance</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">Newly submitted voluntary donor profiles</p>
        </div>

        {/* KPI 2: Active Blood Appeals */}
        <div 
          onClick={() => handleTabChange('requests')}
          className="rounded-2xl border border-rose-200 bg-white p-5 shadow-2xs hover:border-rose-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">Active Blood Appeals</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 group-hover:scale-105 transition-transform">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-oswald text-rose-900">{activeAppeals.length}</span>
            <span className="text-xs font-bold text-rose-700 uppercase">Open Requests</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">Live patient cases requiring donor response</p>
        </div>

        {/* KPI 3: Critical Blood Shortages */}
        <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">Critical Blood Shortages</span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-800 border border-rose-200">
              <Droplet className="h-5 w-5 fill-rose-600 text-rose-600" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-oswald text-rose-900">{criticalShortages.length}</span>
            <span className="text-xs font-bold text-rose-700 uppercase">Groups at Zero</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1 truncate">
            {criticalShortages.map(b => b.group).join(', ') || 'Inventory Balanced'}
          </p>
        </div>

        {/* KPI 4: Flagged / Spam Reports */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">Flagged / Spam Reports</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-oswald text-slate-900">2</span>
            <span className="text-xs font-bold text-slate-600 uppercase">Moderated Cases</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">Community alerts filtered by system AI</p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. MONGODB DATABASE INFRASTRUCTURE STATUS CARD */}
      {/* ========================================================================= */}
      <div className={`rounded-2xl border p-5 shadow-xs transition-all ${
        dbStatus?.connected 
          ? 'border-emerald-200 bg-emerald-50/40' 
          : 'border-slate-200 bg-white'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center space-x-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
              dbStatus?.connected 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-900">
                  MongoDB Database Infrastructure Status
                </h3>
                {isCheckingDb ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>Checking...</span>
                  </span>
                ) : dbStatus?.connected ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Connected (Online)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                    <span>Disconnected (Offline)</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Active connection pool connecting Mongoose schemas for User, BloodRequest, and Donor collections.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={checkDatabase}
              disabled={isCheckingDb}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isCheckingDb ? 'animate-spin' : ''}`} />
              <span>Test Connection</span>
            </button>
          </div>
        </div>

        <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          <div className="rounded-xl bg-white/80 p-2.5 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Connection State</span>
            <span className="font-bold text-slate-800">
              {dbStatus?.connected ? 'Online (ReadyState 1)' : 'Offline / Fallback Storage'}
            </span>
          </div>

          <div className="rounded-xl bg-white/80 p-2.5 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Database Name</span>
            <span className="font-bold text-slate-800 font-mono">
              {dbStatus?.databaseName || 'lifelinex'}
            </span>
          </div>

          <div className="rounded-xl bg-white/80 p-2.5 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Cluster Host</span>
            <span className="font-bold text-slate-800 font-mono truncate block">
              {dbStatus?.host || 'MongoDB Atlas Sharded Cluster'}
            </span>
          </div>

          <div className="rounded-xl bg-white/80 p-2.5 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Mongoose Schemas</span>
            <span className="font-bold text-slate-800">
              User, BloodRequest, Donor
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB 1: PENDING DONOR VERIFICATION QUEUE */}
      {/* ========================================================================= */}
      {(activeTab === 'overview' || activeTab === 'verifications') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-amber-600" />
                <span>Pending Donor Verification Queue ({unverifiedDonors.length})</span>
              </h2>
              <p className="text-xs text-slate-500">
                Review submitted voluntary donor profiles. Verify identity and screening before granting verified badges.
              </p>
            </div>
          </div>

          {unverifiedDonors.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">All Donors Verified!</h4>
              <p className="text-xs text-slate-500">No donor profiles currently awaiting administrative review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-left text-xs min-w-[680px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-bold">
                    <th className="py-3 px-3">Donor ID</th>
                    <th className="py-3 px-3">Full Legal Name</th>
                    <th className="py-3 px-3">Blood Group</th>
                    <th className="py-3 px-3">Location / City</th>
                    <th className="py-3 px-3">Contact Number</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {unverifiedDonors.map(donor => (
                    <tr key={donor.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-600">
                        {donor.id}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {donor.fullName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          {donor.bloodGroup}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {donor.location.address || donor.location.city}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {donor.contactNumber}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse mr-1" />
                          Pending Review
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleApproveDonor(donor)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xs transition-all active:scale-95 flex items-center space-x-1"
                          >
                            <Check className="h-3 w-3" />
                            <span>Approve & Verify</span>
                          </button>
                          <button
                            onClick={() => handleRejectDonor(donor)}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-semibold text-xs transition-colors"
                          >
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB 2: LIVE BLOOD REQUEST MODERATION TABLE */}
      {/* ========================================================================= */}
      {(activeTab === 'overview' || activeTab === 'requests') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-rose-600" />
                <span>Live Blood Request Moderation Queue ({bloodRequests.length})</span>
              </h2>
              <p className="text-xs text-slate-500">
                Authorize, broadcast, mark fulfilled, or remove spam patient emergency appeals.
              </p>
            </div>
            <Link
              href="/donors?tab=mobilize"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
            >
              <span>Emergency Dispatch Center</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-bold">
                  <th className="py-3 px-3">Case ID</th>
                  <th className="py-3 px-3">Patient / Case Summary</th>
                  <th className="py-3 px-3">Group</th>
                  <th className="py-3 px-3">Hospital Location</th>
                  <th className="py-3 px-3">Urgency</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bloodRequests.map(req => {
                  const isClosed = req.status === 'RESOLVED';
                  return (
                    <tr key={req.id} className={`hover:bg-slate-50/80 transition-colors ${isClosed ? 'opacity-50 bg-slate-50/30' : ''}`}>
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">
                        {req.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{req.title}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{req.requesterName} • {req.requesterContact}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded font-mono font-black bg-rose-600 text-white shadow-2xs">
                          {req.requiredBloodGroup || 'O-'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                          {req.unitsNeeded || 2} Units
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs">
                        <div className="font-medium text-slate-800 truncate">{req.location.address}</div>
                        <div className="text-[10px] text-slate-400">{req.location.city}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.urgency === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {req.urgency}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isClosed
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {!isClosed && (
                            <>
                              <button
                                onClick={() => handleMarkFulfilled(req)}
                                title="Mark Fulfilled & Complete"
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-2xs transition-all flex items-center space-x-1"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Fulfilled</span>
                              </button>
                              <button
                                onClick={() => handleBoostAlert(req)}
                                title="Boost Mass Dispatch Alert"
                                className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] shadow-2xs transition-all flex items-center space-x-1"
                              >
                                <Radio className="h-3 w-3" />
                                <span>Boost</span>
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteRequest(req)}
                            title="Delete / Mark as Spam"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 3: SHORTAGE MONITOR & SECURITY AUDIT LOG */}
      {/* ========================================================================= */}
      {(activeTab === 'overview' || activeTab === 'audit') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Blood Supply Shortage Monitor (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Droplet className="h-4 w-4 text-rose-600 fill-rose-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Blood Supply Shortage Monitor
                </h3>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {criticalShortages.length} Shortages
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Live inventory tracking screened donors eligible for immediate transfusion mobilization across all 8 ABO/Rh blood groups.
            </p>

            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              {bloodGroupStock.map(b => (
                <div
                  key={b.group}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    b.isCritical
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <span className="text-sm font-black block">{b.group}</span>
                  <span className="text-xs font-bold block mt-0.5">
                    {b.count} {b.count === 1 ? 'Donor' : 'Donors'}
                  </span>
                  <span className={`text-[9px] font-bold uppercase mt-1 inline-block px-1 rounded ${
                    b.isCritical ? 'bg-rose-200 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {b.isCritical ? 'Zero Stock' : 'Ready'}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/donors?tab=mobilize"
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <Radio className="h-3.5 w-3.5" />
                <span>Broadcast Critical Shortage Mobilization</span>
              </Link>
            </div>
          </div>

          {/* Chronological Security & Activity Audit Log (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Security & Activity Audit Log
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Live Immutable Trail</span>
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 7).map(log => (
                <div 
                  key={log.id} 
                  className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                    log.severity === 'ALERT'
                      ? 'bg-rose-100 text-rose-700'
                      : log.severity === 'WARNING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-slate-600 uppercase">
                        {log.action}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {formatRelativeTime(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-800 font-medium mt-0.5">
                      {log.details}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Actor: {log.user}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB 4: USERS & ROLE-BASED ACCESS CONTROL (RBAC) */}
      {/* ========================================================================= */}
      {(activeTab === 'overview' || activeTab === 'users') && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>User Directory & Permission Access Control (RBAC)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Grant or revoke administrative capabilities for Blood Dispatch, Hospital Logistics, and Moderation.
              </p>
            </div>

            <button
              onClick={() => setIsAddUserOpen(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors shrink-0"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Create Administrative User</span>
            </button>
          </div>

          {/* Search & Filter row */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search user by name, email, or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-1.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-sm text-slate-600 font-semibold">Filter Role:</span>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 font-medium focus:border-red-500 focus:outline-none"
              >
                <option value="ALL">All Accounts ({totalUsers})</option>
                <option value="USER">Standard Members</option>
                <option value="ADMIN">System Administrators</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left text-sm min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                  <th className="py-3.5 px-4">User Account</th>
                  <th className="py-3.5 px-4">Assigned Role</th>
                  <th className="py-3.5 px-4 text-center">System Access Level</th>
                  <th className="py-3.5 px-4 text-right">Role Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => {
                  const isCurrent = user?.id === u.id;
                  const isUserAdmin = u.role === 'ADMIN' || u.role === 'SUPER_ADMIN';
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            isUserAdmin ? 'bg-red-100 text-red-700 font-oswald' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="text-xs bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-medium">You</span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-oswald font-bold uppercase tracking-wider ${
                          isUserAdmin
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {isUserAdmin ? (
                            <>
                              <ShieldCheck className="h-3.5 w-3.5 text-red-600" />
                              <span>System Administrator</span>
                            </>
                          ) : (
                            <>
                              <Users className="h-3.5 w-3.5 text-slate-500" />
                              <span>Standard Member</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="text-xs font-semibold text-slate-600">
                          {isUserAdmin 
                            ? 'Full Administration (Moderation, Verification & Dispatch)' 
                            : 'Standard Member (Blood Requests & Donations)'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => {
                                const newRole = isUserAdmin ? 'USER' : 'ADMIN';
                                updateUserRole(u.id, newRole as UserRole);
                                showToast(`Updated ${u.name} to ${newRole === 'ADMIN' ? 'System Administrator' : 'Standard Member'}`);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                isUserAdmin
                                  ? 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                                  : 'bg-red-600 hover:bg-red-500 text-white shadow-xs'
                              }`}
                            >
                              {isUserAdmin ? 'Demote to Member' : 'Promote to Admin'}
                            </button>
                          )}

                          {!isCurrent && (
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete Account"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Create New System User</h3>
              </div>
              <button 
                onClick={() => setIsAddUserOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sabrina Ahmed"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sabrina@lifelinex.org"
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={newUserPhone}
                  onChange={e => setNewUserPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Administrative Role *</label>
                <select
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold focus:border-red-500 focus:outline-none"
                >
                  <option value="USER">Standard Member</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-xs font-semibold text-white hover:bg-purple-500 shadow-xs"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading System Management Console...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
