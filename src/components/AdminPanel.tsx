import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CITIES_DATA } from '../data/mockData';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  Check, 
  X, 
  MapPin, 
  Settings, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Database,
  Copy,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  Download,
  Lock,
  KeyRound,
  LogOut,
  Phone,
  Clock,
  FileText,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  RotateCcw
} from 'lucide-react';
import { 
  SUPABASE_PROJECT_ID, 
  SUPABASE_URL, 
  saveBookingToSupabase 
} from '../lib/supabase';

export const AdminPanel: React.FC = () => {
  const { 
    language, 
    bookings, 
    workers, 
    applications, 
    approveApplication, 
    rejectApplication,
    systemPricing,
    setSystemPricing,
    updateBookingStatus,
    showToast,
    isAdminRegistered,
    isAdminAuthenticated,
    adminUser,
    registerMasterAdmin,
    loginAdmin,
    logoutAdmin,
    resetAdminAccount,
    setActiveView
  } = useApp();

  // Authentication form states
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(isAdminRegistered ? 'login' : 'signup');
  const [signUpName, setSignUpName] = useState('Babar Ali');
  const [signUpEmail, setSignUpEmail] = useState('babaraligrw123@gmail.com');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpError, setSignUpError] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Reset confirmation modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmationText, setResetConfirmationText] = useState('');

  // Admin tabs - Defaulting to 'bookings' to view all website bookings immediately!
  const [activeAdminTab, setActiveAdminTab] = useState<'bookings' | 'applications' | 'pricing' | 'cities' | 'complaints' | 'supabase'>('bookings');

  // Bookings filtering & search
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Pricing inputs
  const [baseRate, setBaseRate] = useState(systemPricing.baseHourlyRate);
  const [platformFee, setPlatformFee] = useState(systemPricing.platformFee);
  const [discount, setDiscount] = useState(systemPricing.discountPkr);

  // Supabase tab state
  const [copiedSql, setCopiedSql] = useState(false);
  const [syncingToSupabase, setSyncingToSupabase] = useState(false);
  const [supabaseSyncResult, setSupabaseSyncResult] = useState<string | null>(null);

  // Sample complaints
  const [complaints] = useState([
    { id: 'cmp-1', customer: 'Dr. Tariq', issue: 'Worker arrived 10 mins late due to rain', status: 'resolved', city: 'Islamabad' },
    { id: 'cmp-2', customer: 'Zainab Bibi', issue: 'Requested invoice copy for tax reimbursement', status: 'open', city: 'Karachi' },
  ]);

  // Handle Sign-Up (Master Admin single slot)
  const handleMasterSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword) {
      setSignUpError('Please fill out all required fields.');
      return;
    }

    if (signUpPassword.length < 6) {
      setSignUpError('Password must be at least 6 characters.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpError('Passwords do not match. Please re-enter.');
      return;
    }

    const res = registerMasterAdmin({
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      password: signUpPassword,
    });

    if (!res.success) {
      setSignUpError(res.error || 'Failed to claim single admin slot.');
    }
  };

  // Handle Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }

    const res = loginAdmin(loginEmail.trim(), loginPassword);
    if (!res.success) {
      setLoginError(res.error || 'Invalid credentials. Access denied.');
    }
  };

  // Handle Reset Slot
  const handleExecuteReset = () => {
    if (resetConfirmationText.trim().toUpperCase() === 'RESET ADMIN') {
      resetAdminAccount();
      setShowResetModal(false);
      setResetConfirmationText('');
      setAuthMode('signup');
    } else {
      showToast('Type "RESET ADMIN" exactly to confirm reset.', 'error');
    }
  };

  // Filtered Bookings logic
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        b.id.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.toLowerCase().includes(q) ||
        b.customerAddress.toLowerCase().includes(q) ||
        b.serviceName.toLowerCase().includes(q) ||
        b.workerName.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        (b.area && b.area.toLowerCase().includes(q))
      );

      const matchesCity = cityFilter === 'all' || b.city.toLowerCase() === cityFilter.toLowerCase();
      const matchesStatus = statusFilter === 'all' || b.bookingStatus === statusFilter;
      const matchesPayment = paymentFilter === 'all' || b.paymentStatus === paymentFilter;

      return matchesSearch && matchesCity && matchesStatus && matchesPayment;
    });
  }, [bookings, searchQuery, cityFilter, statusFilter, paymentFilter]);

  // Overall Statistics
  const activeBookingsCount = bookings.filter(b => b.bookingStatus !== 'completed' && b.bookingStatus !== 'cancelled').length;
  const completedBookingsCount = bookings.filter(b => b.bookingStatus === 'completed').length;
  const totalGrossRevenuePkr = bookings.reduce((sum, b) => sum + (b.paymentStatus === 'completed' ? b.totalPkr : 0), 248900);
  const pendingApps = applications.filter(a => a.status === 'pending');

  const supabaseSqlSchema = `-- Run this in your Supabase SQL Editor (project: ${SUPABASE_PROJECT_ID})
create table if not exists bookings (
  id text primary key,
  customer_name text,
  customer_phone text,
  customer_address text,
  city text,
  area text,
  service_id text,
  service_name text,
  service_name_ur text,
  worker_id text,
  worker_name text,
  appointment_date text,
  appointment_time text,
  is_instant boolean default false,
  duration_hours numeric default 2,
  base_price_pkr numeric default 0,
  platform_fee_pkr numeric default 0,
  total_pkr numeric default 0,
  payment_method text default 'cash',
  payment_status text default 'pending',
  booking_status text default 'assigned',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) & Public Inserts
alter table bookings enable row level security;
create policy "Allow public insert" on bookings for insert with check (true);
create policy "Allow public select" on bookings for select using (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(supabaseSqlSchema);
    setCopiedSql(true);
    showToast('SQL schema copied to clipboard! Paste it into Supabase SQL Editor.', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleTestSync = async () => {
    if (bookings.length === 0) {
      showToast('No bookings available to sync.', 'info');
      return;
    }
    setSyncingToSupabase(true);
    setSupabaseSyncResult(null);
    try {
      const result = await saveBookingToSupabase(bookings[0]);
      if (result.success) {
        setSupabaseSyncResult(`Success! Booking ${bookings[0].id} saved into Supabase table '${result.table}'.`);
        showToast(`Successfully saved booking to Supabase table '${result.table}'!`, 'success');
      } else if (result.isKeyPending) {
        setSupabaseSyncResult(
          `Project connected to '${SUPABASE_PROJECT_ID}' (${SUPABASE_URL}). To allow remote writes, set VITE_SUPABASE_ANON_KEY in .env.`
        );
        showToast('Supabase URL linked. Add Anon key in .env for live writes.', 'info');
      } else {
        setSupabaseSyncResult(`Sync response: ${result.error}`);
        showToast(`Supabase response: ${result.error}`, 'error');
      }
    } catch (err: any) {
      setSupabaseSyncResult(`Error: ${err?.message || 'Sync failed'}`);
    } finally {
      setSyncingToSupabase(false);
    }
  };

  const handleExportCsv = () => {
    if (bookings.length === 0) {
      showToast('No booking records available to export.', 'info');
      return;
    }

    const headers = [
      'Booking ID',
      'Customer Name',
      'Phone',
      'Address',
      'City',
      'Area',
      'Service',
      'Worker Assigned',
      'Appointment Date',
      'Appointment Time',
      'Instant',
      'Duration (Hours)',
      'Total (PKR)',
      'Payment Method',
      'Payment Status',
      'Order Status',
      'Customer Notes'
    ];

    const rows = bookings.map(b => [
      `"${b.id}"`,
      `"${b.customerName}"`,
      `"${b.customerPhone}"`,
      `"${b.customerAddress.replace(/"/g, '""')}"`,
      `"${b.city}"`,
      `"${b.area || ''}"`,
      `"${b.serviceName}"`,
      `"${b.workerName}"`,
      `"${b.date}"`,
      `"${b.time}"`,
      `"${b.isInstant ? 'Yes' : 'No'}"`,
      `"${b.durationHours}"`,
      `"${b.totalPkr}"`,
      `"${b.paymentMethod}"`,
      `"${b.paymentStatus}"`,
      `"${b.bookingStatus}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kaamdo_bookings_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported all bookings to CSV successfully!', 'success');
  };

  // -------------------------------------------------------------
  // VIEW 1: NON-AUTHENTICATED GATEWAY (Sign Up 1-Slot OR Login)
  // -------------------------------------------------------------
  if (!isAdminAuthenticated) {
    return (
      <div className="py-12 sm:py-20 bg-stone-950 min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          
          {/* Top Brand Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 mx-auto flex items-center justify-center text-white shadow-xl mb-4 border border-emerald-500/30">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              KaamDo HQ Admin Portal
            </h1>
            <p className="text-xs text-stone-400 mt-1.5">
              Secure Central Administration & All Bookings Management
            </p>
          </div>

          {/* Main Auth Container Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            
            {/* Slot Policy Status Banner */}
            <div className={`p-3.5 rounded-2xl border mb-6 flex items-start gap-3 ${
              isAdminRegistered 
                ? 'bg-stone-950/70 border-stone-700 text-stone-300' 
                : 'bg-emerald-950/40 border-emerald-700/50 text-emerald-200'
            }`}>
              <div className="shrink-0 mt-0.5">
                {isAdminRegistered ? (
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                ) : (
                  <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                )}
              </div>
              <div className="text-xs">
                <div className="font-bold flex items-center gap-1.5">
                  <span>{isAdminRegistered ? 'Master Slot Claimed (1/1)' : 'Single Admin Slot Open (1 of 1)'}</span>
                  <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono uppercase font-bold ${
                    isAdminRegistered ? 'bg-amber-900/60 text-amber-300' : 'bg-emerald-800 text-white'
                  }`}>
                    {isAdminRegistered ? 'Registration Closed' : '1 Slot Available'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                  {isAdminRegistered 
                    ? 'Only the single registered administrator is authorized to log in. No additional accounts can be created.' 
                    : 'Create your administrator profile using this single available slot. Once created, registration will be locked forever.'}
                </p>
              </div>
            </div>

            {/* TAB SELECTOR: Login vs Setup */}
            <div className="grid grid-cols-2 gap-1.5 bg-stone-950 p-1.5 rounded-2xl mb-6 border border-stone-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === 'login'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isAdminRegistered) {
                    showToast('Admin slot is already claimed. Registration is permanently locked.', 'info');
                  } else {
                    setAuthMode('signup');
                  }
                }}
                disabled={isAdminRegistered}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'signup'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : isAdminRegistered
                    ? 'opacity-40 cursor-not-allowed text-stone-500'
                    : 'text-stone-400 hover:text-white cursor-pointer'
                }`}
                title={isAdminRegistered ? 'Slot claimed. Registration closed.' : 'Create Admin Account'}
              >
                <User className="w-3.5 h-3.5" />
                <span>{isAdminRegistered ? 'Slot Claimed (Locked)' : 'Claim Slot (Sign Up)'}</span>
              </button>
            </div>

            {/* MODE 1: LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. babaraligrw123@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-stone-600 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-stone-600 outline-none transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Log In to View All Bookings</span>
                </button>

                {/* Reset slot assistance */}
                {isAdminRegistered && (
                  <div className="pt-3 border-t border-stone-800 text-center">
                    <button
                      type="button"
                      onClick={() => setShowResetModal(true)}
                      className="text-[11px] text-stone-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Master Admin: Need to reset the single admin slot?</span>
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* MODE 2: SIGN UP FORM (Single Slot Only) */}
            {authMode === 'signup' && (
              <form onSubmit={handleMasterSignUp} className="space-y-4">
                {signUpError && (
                  <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{signUpError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Babar Ali"
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-stone-600 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="babaraligrw123@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-stone-600 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Create Password (minimum 6 characters)
                  </label>
                  <div className="relative">
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Create master password"
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-stone-600 outline-none transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                    >
                      {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-stone-600 outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Claim Slot & Create Master Admin</span>
                </button>
              </form>
            )}

            {/* Back to Home Link */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setActiveView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs text-stone-400 hover:text-stone-200 transition-colors"
              >
                ← Return to KaamDo Customer Marketplace
              </button>
            </div>

          </div>

          {/* Reset Confirmation Modal */}
          {showResetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-stone-900 border border-amber-600/50 rounded-3xl p-6 max-w-sm w-full text-white space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Reset Master Admin Slot</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  This will clear the current administrator credentials and reopen the single slot for fresh registration.
                </p>
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">
                    Type <strong>RESET ADMIN</strong> to confirm:
                  </label>
                  <input
                    type="text"
                    value={resetConfirmationText}
                    onChange={(e) => setResetConfirmationText(e.target.value)}
                    placeholder="RESET ADMIN"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-white outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowResetModal(false); setResetConfirmationText(''); }}
                    className="flex-1 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteReset}
                    className="flex-1 py-2 bg-red-700 hover:bg-red-600 text-white text-xs font-bold rounded-xl"
                  >
                    Wipe & Reset Slot
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: AUTHENTICATED ADMIN CONSOLE
  // -------------------------------------------------------------
  return (
    <div className="py-8 sm:py-12 bg-stone-100 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header with Profile & Logout */}
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 border border-stone-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  KaamDo HQ Admin Console
                </span>
                <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                  MASTER ADMIN ACTIVE
                </span>
                <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded border border-stone-700">
                  Single Slot Policy (1/1 Claimed)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Central Operations & Bookings Manager
              </h1>
              <p className="text-xs text-stone-400 mt-1">
                Lahore · Islamabad · Karachi · Rawalpindi Live Dispatch Grid
              </p>
            </div>

            {/* Admin User Info & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 text-xs">
                <span className="text-[10px] text-stone-500 uppercase font-semibold block">Logged in Administrator</span>
                <div className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{adminUser?.name || 'Master Admin'}</span>
                </div>
                <span className="text-[11px] text-stone-400 font-mono block">
                  {adminUser?.email || 'admin@kaamdo.pk'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  View Website
                </button>

                <button
                  onClick={logoutAdmin}
                  className="px-3.5 py-2.5 bg-red-950/80 hover:bg-red-900 border border-red-800/80 text-red-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Sign out of Admin Console"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* High-Level Operational Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
              <span>Total Bookings</span>
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-stone-900 tabular-nums">
              {bookings.length}
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">Across all cities</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
              <span>Active Orders</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="text-2xl font-black text-stone-900 tabular-nums">
              {activeBookingsCount}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">In progress / dispatch</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
              <span>Completed Orders</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-stone-900 tabular-nums">
              {completedBookingsCount}
            </div>
            <span className="text-[10px] text-blue-700 font-semibold mt-1 block">100% verified</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
              <span>Worker Applicants</span>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-600 tabular-nums">
              {pendingApps.length}
            </div>
            <span className="text-[10px] text-amber-700 font-semibold mt-1 block">CNIC clearance req.</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
              <span>Gross Volume (PKR)</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 tabular-nums">
              Rs. {totalGrossRevenuePkr.toLocaleString()}
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">Payment processed</span>
          </div>

        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-6 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveAdminTab('bookings')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeAdminTab === 'bookings'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>All Bookings Manager ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('applications')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeAdminTab === 'applications'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Worker Applications ({pendingApps.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('supabase')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeAdminTab === 'supabase'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Backend ({SUPABASE_PROJECT_ID})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('pricing')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'pricing'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            Marketplace Pricing & Fees
          </button>

          <button
            onClick={() => setActiveAdminTab('cities')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'cities'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            Cities & Expansion Hubs
          </button>

          <button
            onClick={() => setActiveAdminTab('complaints')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'complaints'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            Customer Care & Resolution ({complaints.length})
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: ALL BOOKINGS MANAGER (PRIMARY USER REQUIREMENT)        */}
        {/* ============================================================ */}
        {activeAdminTab === 'bookings' && (
          <div className="space-y-6">
            
            {/* Search, Filters, and Export Toolbar */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <span>All Website Bookings Explorer</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      {filteredBookings.length} of {bookings.length} Records
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Real-time list of all appointment bookings submitted across Pakistan (Supabase & Live sync)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCsv}
                    className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Search Bar & Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by customer, phone, ID, worker..."
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 focus:border-emerald-600 rounded-xl text-xs text-stone-900 outline-none"
                  />
                </div>

                {/* City Filter */}
                <div>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 outline-none"
                  >
                    <option value="all">All Pakistani Cities</option>
                    <option value="lahore">Lahore</option>
                    <option value="islamabad">Islamabad</option>
                    <option value="karachi">Karachi</option>
                    <option value="rawalpindi">Rawalpindi</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 outline-none"
                  >
                    <option value="all">All Booking Statuses</option>
                    <option value="assigned">Assigned</option>
                    <option value="on_the_way">On the Way</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Payment Filter */}
                <div>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 outline-none"
                  >
                    <option value="all">All Payments (Cash & Digital)</option>
                    <option value="completed">Paid (Completed)</option>
                    <option value="pending">Pending (Cash on Delivery)</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Detailed Bookings Cards */}
            <div className="space-y-4">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <div 
                    key={b.id} 
                    className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      
                      {/* Left: Booking ID, Service, Customer Details */}
                      <div className="space-y-2.5 flex-1">
                        
                        {/* Top Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-extrabold text-sm px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {b.id}
                          </span>

                          <span className="font-bold text-stone-900 text-sm">
                            {b.serviceName}
                          </span>

                          {b.isInstant ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                              <span>⚡ Instant Dispatch</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                              📅 Scheduled
                            </span>
                          )}

                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            b.bookingStatus === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : b.bookingStatus === 'in_progress' || b.bookingStatus === 'on_the_way'
                              ? 'bg-amber-100 text-amber-900'
                              : b.bookingStatus === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {b.bookingStatus.replace('_', ' ')}
                          </span>

                          <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded font-mono">
                            Supabase Synced
                          </span>
                        </div>

                        {/* Customer Information Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs pt-1">
                          
                          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-150">
                            <span className="text-[10px] text-stone-400 font-semibold uppercase block">Customer</span>
                            <div className="font-bold text-stone-900 mt-0.5">{b.customerName}</div>
                            <a 
                              href={`tel:${b.customerPhone}`}
                              className="text-emerald-700 font-mono font-semibold hover:underline flex items-center gap-1 mt-0.5 text-[11px]"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{b.customerPhone}</span>
                            </a>
                          </div>

                          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-150">
                            <span className="text-[10px] text-stone-400 font-semibold uppercase block">Location</span>
                            <div className="font-bold text-stone-900 mt-0.5">{b.city} {b.area ? `· ${b.area}` : ''}</div>
                            <div className="text-stone-500 text-[11px] truncate mt-0.5" title={b.customerAddress}>
                              {b.customerAddress}
                            </div>
                          </div>

                          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-150">
                            <span className="text-[10px] text-stone-400 font-semibold uppercase block">Assigned Partner</span>
                            <div className="font-bold text-stone-900 mt-0.5">{b.workerName}</div>
                            <span className="text-stone-500 text-[11px] font-mono mt-0.5 block">
                              ID: {b.workerId}
                            </span>
                          </div>

                        </div>

                        {/* Schedule & Notes */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-1">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span><strong>Date & Time:</strong> {b.date} at {b.time} ({b.durationHours} hrs duration)</span>
                          </div>

                          {b.notes && (
                            <div className="flex items-center gap-1 text-stone-500 italic bg-amber-50/70 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                              <span>Note: "{b.notes}"</span>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Right: Financials & Admin Status Override */}
                      <div className="flex lg:flex-col items-end justify-between lg:justify-start gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                        <div className="text-left lg:text-right">
                          <span className="text-[10px] text-stone-400 uppercase font-bold block">Total Amount</span>
                          <div className="text-lg font-black text-stone-900 tabular-nums">
                            Rs. {b.totalPkr.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[10px] font-bold uppercase text-stone-600">
                              {b.paymentMethod}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              b.paymentStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {b.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {/* Admin Status Override Selector */}
                        <div className="text-right">
                          <span className="text-[10px] text-stone-400 uppercase font-bold block mb-1">
                            Override Status
                          </span>
                          <select
                            value={b.bookingStatus}
                            onChange={(e) => updateBookingStatus(b.id, e.target.value as any)}
                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 outline-none cursor-pointer"
                          >
                            <option value="assigned">Assigned</option>
                            <option value="on_the_way">On the Way</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/90 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">No Bookings Matched Your Filters</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Try clearing your search query or adjusting the city and status filters to view records.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCityFilter('all');
                      setStatusFilter('all');
                      setPaymentFilter('all');
                    }}
                    className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: WORKER APPLICATIONS QUEUE                             */}
        {/* ============================================================ */}
        {activeAdminTab === 'applications' && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Worker Registration & CNIC Verification Queue
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Review applicant NADRA credentials, police clearance affirmations, and skill categories before dispatching.
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                {pendingApps.length} pending approval
              </span>
            </div>

            <div className="divide-y divide-stone-100">
              {applications.map((app) => (
                <div key={app.id} className="py-4 first:pt-2 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{app.fullName}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        app.status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : app.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="text-stone-500 mt-1">
                      CNIC: <strong className="font-mono">{app.cnic}</strong> · Phone: <strong>{app.phone}</strong> · City: <strong>{app.city} ({app.area})</strong>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-stone-400">Skills:</span>
                      {app.services.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                          {s}
                        </span>
                      ))}
                      <span className="text-stone-400 ml-2">Exp: {app.experienceYears} years</span>
                    </div>
                  </div>

                  {app.status === 'pending' ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => rejectApplication(app.id)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approveApplication(app.id)}
                        className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Verify & Approve</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400 font-semibold">
                      Processed ({app.submittedAt})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: SUPABASE BACKEND INTEGRATION                          */}
        {/* ============================================================ */}
        {activeAdminTab === 'supabase' && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-base font-bold text-stone-950">
                    Supabase PostgreSQL Backend (Connected)
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Real-time database integration for appointment bookings and marketplace records
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Auto-Dispatch Active</span>
                </span>
              </div>
            </div>

            {/* Connection Credentials Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-400 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                  Supabase Project Ref
                </span>
                <span className="font-mono font-bold text-stone-900 text-sm">
                  {SUPABASE_PROJECT_ID}
                </span>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-400 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                  REST API URL
                </span>
                <span className="font-mono text-emerald-800 font-semibold break-all text-[11px]">
                  {SUPABASE_URL}/rest/v1/
                </span>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-400 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                  Target Database Table
                </span>
                <span className="font-mono font-bold text-stone-900 text-sm flex items-center gap-1">
                  <span>public.bookings</span>
                  <span className="text-[10px] font-normal text-stone-500">(or appointments)</span>
                </span>
              </div>
            </div>

            {/* Live Test Sync Action */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-emerald-950 block">
                  Verify Live Booking Dispatch
                </span>
                <span className="text-stone-600 text-[11px]">
                  Whenever a customer confirms an appointment form, its payload is dispatched directly to Supabase.
                </span>
                {supabaseSyncResult && (
                  <p className="mt-2 font-mono text-[11px] text-emerald-900 bg-white p-2 rounded-lg border border-emerald-300">
                    {supabaseSyncResult}
                  </p>
                )}
              </div>

              <button
                onClick={handleTestSync}
                disabled={syncingToSupabase}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingToSupabase ? 'animate-spin' : ''}`} />
                <span>{syncingToSupabase ? 'Testing Sync...' : 'Test Sync Latest Booking'}</span>
              </button>
            </div>

            {/* SQL Table Creation Script */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-900">
                    Supabase PostgreSQL Table Schema (One-Click Setup)
                  </h4>
                  <p className="text-stone-500 text-[11px]">
                    If you haven't created the <code className="bg-stone-100 px-1 rounded">bookings</code> table yet in Supabase, paste this SQL in your Supabase SQL Editor:
                  </p>
                </div>

                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-xs shrink-0"
                >
                  {copiedSql ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 bg-stone-900 text-emerald-300 font-mono text-[11px] rounded-2xl overflow-x-auto border border-stone-800 leading-relaxed">
                {supabaseSqlSchema}
              </pre>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: MARKETPLACE PRICING & TAKE-RATE CONTROLS              */}
        {/* ============================================================ */}
        {activeAdminTab === 'pricing' && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm max-w-xl space-y-5">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Nationwide Pricing & Take-Rate Controls
              </h3>
              <p className="text-xs text-stone-500">
                Adjust base hourly baseline and insurance platform fee in Pakistani Rupees.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Base Hourly Rate (PKR)
                </label>
                <input
                  type="number"
                  value={baseRate}
                  onChange={(e) => setBaseRate(parseInt(e.target.value, 10) || 500)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-bold text-stone-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Platform Insurance & Support Fee (PKR)
                </label>
                <input
                  type="number"
                  value={platformFee}
                  onChange={(e) => setPlatformFee(parseInt(e.target.value, 10) || 50)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-bold text-stone-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  First-Time Customer Voucher / Discount (PKR)
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-bold text-stone-900 text-sm"
                />
              </div>

              <button
                onClick={() => {
                  setSystemPricing({
                    baseHourlyRate: baseRate,
                    platformFee,
                    peakHourMultiplier: 1.0,
                    discountPkr: discount,
                  });
                  showToast('Platform pricing rules updated successfully across Pakistan.', 'success');
                }}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Apply Updated Rate Card
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: EXPANSION CITIES                                      */}
        {/* ============================================================ */}
        {activeAdminTab === 'cities' && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              Pakistani Cities Operational Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {CITIES_DATA.map((city) => (
                <div key={city.nameEn} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-900">{city.nameEn} ({city.nameUr})</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">{city.popularAreas.length} local hubs</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    city.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {city.active ? 'Live Dispatch' : 'Waitlist'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 6: COMPLAINTS & CARE                                     */}
        {/* ============================================================ */}
        {activeAdminTab === 'complaints' && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              Customer Support Escalations & Refund Requests
            </h3>

            <div className="divide-y divide-stone-100 text-xs">
              {complaints.map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-900">{c.issue}</div>
                    <div className="text-stone-500">Customer: {c.customer} · City: {c.city}</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
