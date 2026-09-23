import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UserCheck, 
  DollarSign, 
  Clock, 
  Star, 
  MapPin, 
  Check, 
  X, 
  ArrowUpRight, 
  ShieldCheck, 
  Wallet, 
  Power,
  Calendar,
  AlertCircle,
  Camera,
  Edit3,
  Upload,
  User,
  Phone as PhoneIcon,
  Sparkles
} from 'lucide-react';
import { 
  WORKER_LABOUR_PHOTO, 
  WORKER_TUTOR_PHOTO, 
  WORKER_SANITARY_PHOTO,
  WORKER_BARBER_PHOTO,
  WORKER_BEAUTICIAN_PHOTO,
  WORKER_MASON_PHOTO,
  WORKER_PLUMBER_PHOTO
} from '../data/mockData';

export const WorkerDashboard: React.FC = () => {
  const { 
    language, 
    workerIsOnline, 
    setWorkerIsOnline, 
    workerEarnings, 
    withdrawWorkerEarnings,
    showToast,
    workers,
    currentWorker,
    currentWorkerId,
    setCurrentWorkerId,
    updateWorkerProfile
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(currentWorker.name);
  const [editNameUr, setEditNameUr] = useState(currentWorker.nameUr || '');
  const [editPhoto, setEditPhoto] = useState(currentWorker.photo);
  const [editCategory, setEditCategory] = useState(currentWorker.category);
  const [editCategoryUr, setEditCategoryUr] = useState(currentWorker.categoryUr || '');
  const [editCity, setEditCity] = useState(currentWorker.city);
  const [editArea, setEditArea] = useState(currentWorker.area);
  const [editRate, setEditRate] = useState(currentWorker.hourlyRatePkr);
  const [editPhone, setEditPhone] = useState(currentWorker.phone);
  const [editBio, setEditBio] = useState(currentWorker.bioEn);

  // Sync state when current worker changes
  const handleOpenEditModal = () => {
    setEditName(currentWorker.name);
    setEditNameUr(currentWorker.nameUr || '');
    setEditPhoto(currentWorker.photo);
    setEditCategory(currentWorker.category);
    setEditCategoryUr(currentWorker.categoryUr || '');
    setEditCity(currentWorker.city);
    setEditArea(currentWorker.area);
    setEditRate(currentWorker.hourlyRatePkr);
    setEditPhone(currentWorker.phone);
    setEditBio(currentWorker.bioEn);
    setIsEditModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    updateWorkerProfile(currentWorker.id, {
      name: editName,
      nameUr: editNameUr || editName,
      photo: editPhoto,
      category: editCategory,
      categoryUr: editCategoryUr || editCategory,
      city: editCity,
      area: editArea,
      hourlyRatePkr: editRate,
      phone: editPhone,
      bioEn: editBio,
    });

    setIsEditModalOpen(false);
  };

  // Incoming Job Request Simulation
  const [incomingJob, setIncomingJob] = useState<{
    id: string;
    customer: string;
    service: string;
    location: string;
    pkr: number;
    duration: string;
    distance: string;
  } | null>({
    id: 'REQ-4910',
    customer: 'Farhan Zaidi',
    service: currentWorker.category.includes('Labour') 
      ? 'Construction Shifting & Loading'
      : currentWorker.category.includes('Tutor') 
      ? 'FSc Physics & Math Home Tuition'
      : currentWorker.category.includes('Sanitary')
      ? 'Main Manhole & Sewerage Cleaning'
      : 'Deep Home Cleaning & Sanitization',
    location: 'Sector G, Phase 5, DHA Lahore',
    pkr: currentWorker.hourlyRatePkr * 2,
    duration: '2 Hours',
    distance: '1.4 km away',
  });

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'jazzcash' | 'easypaisa'>('jazzcash');
  const [withdrawPhone, setWithdrawPhone] = useState(currentWorker.phone || '0302-8491204');
  const [withdrawAmount, setWithdrawAmount] = useState('3000');

  const presetPhotos = [
    { label: 'Barber / Haircut', url: WORKER_BARBER_PHOTO },
    { label: 'Parlour (Pedicure)', url: WORKER_BEAUTICIAN_PHOTO },
    { label: 'Mason / Mistri', url: WORKER_MASON_PHOTO },
    { label: 'Plumber Expert', url: WORKER_PLUMBER_PHOTO },
    { label: 'Labour / Mazdoor', url: WORKER_LABOUR_PHOTO },
    { label: 'Tutor / Teacher', url: WORKER_TUTOR_PHOTO },
    { label: 'Sanitary Worker', url: WORKER_SANITARY_PHOTO },
    { label: 'House Cleaner', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300' },
    { label: 'Home Cook', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300' },
    { label: 'Electrician', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300' },
  ];

  const handleAcceptJob = () => {
    if (!incomingJob) return;
    showToast(`Job ${incomingJob.id} accepted! Customer notified that you are en route.`, 'success');
    setIncomingJob(null);
  };

  const handleRejectJob = () => {
    showToast('Job declined. Re-routing to next available partner.', 'info');
    setIncomingJob(null);
  };

  const handleExecuteWithdrawal = () => {
    const amt = parseInt(withdrawAmount, 10);
    if (isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    const success = withdrawWorkerEarnings(withdrawMethod, withdrawPhone, amt);
    if (success) {
      setWithdrawModalOpen(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-stone-100 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Worker Switcher & View Bar */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700">
              {language === 'ur' ? 'موجودہ لاگ اِن ورکر پروفائل:' : 'Viewing Active Worker Portal:'}
            </span>
            <select
              value={currentWorkerId}
              onChange={(e) => setCurrentWorkerId(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-semibold text-stone-900 outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} - {w.category} ({w.city})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-500 hidden sm:inline">
              Need to update your photo or name?
            </span>
            <button
              onClick={handleOpenEditModal}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{language === 'ur' ? 'نام و تصویر تبدیل کریں' : 'Edit Name & Photo'}</span>
            </button>
          </div>
        </div>

        {/* Worker Top Profile Banner */}
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-stone-800">
          <div className="flex items-center gap-4">
            <div className="relative group shrink-0">
              <img
                src={currentWorker.photo}
                alt={currentWorker.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-stone-900 ${
                workerIsOnline ? 'bg-emerald-500' : 'bg-stone-500'
              }`} />
              <button
                onClick={handleOpenEditModal}
                className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[10px] font-bold"
                title="Change Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold">
                  {currentWorker.name} {currentWorker.nameUr ? `(${currentWorker.nameUr})` : ''}
                </h1>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>NADRA Verified Partner</span>
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-emerald-400">{currentWorker.category}</span>
                <span>·</span>
                <span>{currentWorker.area}, {currentWorker.city}</span>
                <span>·</span>
                <span className="text-amber-300 font-bold">Rs. {currentWorker.hourlyRatePkr}/hr</span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={handleOpenEditModal}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 underline cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{language === 'ur' ? 'اپنی تصویر یا تفصیلات تبدیل کریں' : 'Change your photo or details'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Online / Offline Availability Toggle */}
          <div className="flex items-center gap-4 bg-stone-800/80 px-4 py-3 rounded-2xl border border-stone-700/80">
            <div className="text-right">
              <div className="text-xs font-bold text-white">
                {workerIsOnline ? 'Available for Jobs' : 'Offline (Resting)'}
              </div>
              <div className="text-[10px] text-stone-400">
                {workerIsOnline ? 'Receiving instant requests nearby' : 'Not receiving new bookings'}
              </div>
            </div>

            <button
              onClick={() => {
                setWorkerIsOnline(!workerIsOnline);
                showToast(
                  !workerIsOnline ? 'You are now Online and visible to customers!' : 'Status set to Offline.',
                  !workerIsOnline ? 'success' : 'info'
                );
              }}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                workerIsOnline ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-stone-700 hover:bg-stone-600 text-stone-400'
              }`}
              title="Toggle Online/Offline"
            >
              <Power className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Incoming Job Request Alert (if online and present) */}
        {workerIsOnline && incomingJob && (
          <div className="mb-8 p-6 bg-gradient-to-r from-emerald-900 to-stone-900 text-white rounded-3xl border-2 border-emerald-500 shadow-2xl animate-in zoom-in-95">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    ⚡ New Incoming Instant Request ({incomingJob.distance})
                  </div>
                  <h3 className="text-lg font-extrabold text-white mt-0.5">
                    {incomingJob.service} · {incomingJob.duration}
                  </h3>
                  <p className="text-xs text-stone-300 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{incomingJob.location} (Customer: {incomingJob.customer})</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] uppercase text-stone-400 block font-bold">Earnings</span>
                  <span className="text-2xl font-black text-amber-300 tabular-nums">
                    Rs. {incomingJob.pkr}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRejectJob}
                    className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors cursor-pointer"
                    title="Decline"
                  >
                    <X className="w-5 h-5 text-rose-400" />
                  </button>

                  <button
                    onClick={handleAcceptJob}
                    className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    <Check className="w-5 h-5" />
                    <span>Accept Job (45s)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financial Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* Today's Cash Earned */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-2">
              <span>Today's Available Balance</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 tabular-nums">
              Rs. {workerEarnings.today.toLocaleString()}
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-semibold">Ready for payout</span>
              <button
                onClick={() => setWithdrawModalOpen(true)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Withdraw</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* This Month's Income */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-2">
              <span>This Month's Gross</span>
              <Wallet className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 tabular-nums">
              Rs. {workerEarnings.month.toLocaleString()}
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
              Across {workerEarnings.completedCount} tasks in {currentWorker.city}
            </div>
          </div>

          {/* Completed Jobs */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-2">
              <span>Completed Jobs</span>
              <UserCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 tabular-nums">
              {currentWorker.completedJobs}
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
              100% On-time completion rate
            </div>
          </div>

          {/* Customer Rating */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-2">
              <span>Partner Rating</span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 flex items-center gap-1.5 tabular-nums">
              <span>{currentWorker.rating}</span>
              <span className="text-xs text-stone-400 font-normal">/ 5.0 ({currentWorker.reviewCount} reviews)</span>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-emerald-700 font-semibold">
              Top 5% Partner in {currentWorker.city}
            </div>
          </div>

        </div>

        {/* Schedule & Recent Job Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Today's Bookings List */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-stone-900">
                Today's Bookings & Appointments
              </h3>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                2 Tasks Scheduled
              </span>
            </div>

            <div className="space-y-4">
              
              {/* Task 1 */}
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">
                      {currentWorker.category} (2 Hours)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      In Progress
                    </span>
                  </div>
                  <div className="text-stone-600 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>House 42, Street 8, Sector Y, DHA Phase 5 (Customer: Babar Ali)</span>
                  </div>
                  <div className="text-stone-500 mt-0.5">
                    Time: 11:00 AM · Paid via JazzCash
                  </div>
                </div>

                <div className="text-right sm:text-right">
                  <div className="text-sm font-extrabold text-stone-900 tabular-nums">
                    Rs. {currentWorker.hourlyRatePkr * 2}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">Live Order</span>
                </div>
              </div>

              {/* Task 2 */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">Follow-up Assistance</span>
                    <span className="text-[10px] font-bold text-stone-600 bg-stone-200 px-2 py-0.5 rounded">
                      Upcoming (03:30 PM)
                    </span>
                  </div>
                  <div className="text-stone-600 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>Plot 18, Block H, Gulberg III, Lahore (Customer: Dr. Noman)</span>
                  </div>
                </div>

                <div className="text-right sm:text-right">
                  <div className="text-sm font-extrabold text-stone-900 tabular-nums">
                    Rs. {currentWorker.hourlyRatePkr}
                  </div>
                  <span className="text-[10px] text-stone-500">Cash on Delivery</span>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Cash Payout Box */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-stone-900 font-bold text-base mb-2">
                <Wallet className="w-5 h-5 text-emerald-700" />
                <span>Instant Wallet Payout</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                KaamDo sends daily earnings directly to your JazzCash or Easypaisa account with zero deduction fees.
              </p>

              <div className="mt-5 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Linked Account:</span>
                  <span className="font-bold text-stone-800">JazzCash ({currentWorker.phone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Settlement Time:</span>
                  <span className="font-bold text-emerald-700">Instant (Within 5 mins)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setWithdrawModalOpen(true)}
              className="mt-6 w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              Request Withdrawal Now
            </button>
          </div>

        </div>

      </div>

      {/* Edit Worker Profile & Photo Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 max-h-[88vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  {language === 'ur' ? 'پروفائل اور تصویر تبدیل کریں' : 'Edit Profile & Photo'}
                </h3>
                <p className="text-xs text-stone-500">
                  Update your display name, photo, profession, and hourly rates
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              
              {/* Photo Preview and Upload */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-800">
                    Profile Photo (تصویر)
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload New Photo</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={editPhoto}
                    alt={editName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shadow"
                  />
                  <div>
                    <span className="text-[11px] text-stone-500 block mb-1">
                      یا فوری اوتار منتخب کریں (Choose preset):
                    </span>
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      {presetPhotos.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditPhoto(p.url)}
                          className={`rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                            editPhoto === p.url ? 'border-emerald-600 ring-1 ring-emerald-500' : 'border-stone-200 opacity-60 hover:opacity-100'
                          }`}
                          title={p.label}
                        >
                          <img src={p.url} alt={p.label} className="w-8 h-8 object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Full Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Urdu Name (اردو نام)
                  </label>
                  <input
                    type="text"
                    value={editNameUr}
                    onChange={(e) => setEditNameUr(e.target.value)}
                    dir="rtl"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 font-urdu"
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Profession / Category (پیشہ یا کام) *
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => {
                    setEditCategory(e.target.value);
                    if (e.target.value.includes('Barber')) setEditCategoryUr('ماہر باربر و ہیئر اسٹائلسٹ');
                    else if (e.target.value.includes('Salon') || e.target.value.includes('Beautician')) setEditCategoryUr('ماہر بیوٹیشن و پارلر سروس');
                    else if (e.target.value.includes('Mason')) setEditCategoryUr('ماہر راج مستری و تعمیرات');
                    else if (e.target.value.includes('Plumber')) setEditCategoryUr('سند یافتہ پلمبر و سینیٹری کاریگر');
                    else if (e.target.value.includes('Labour')) setEditCategoryUr('عام مزدور و لوڈنگ کاریگر');
                    else if (e.target.value.includes('Tutor')) setEditCategoryUr('ہوم ٹیوٹر و سائنس ٹیچر');
                    else if (e.target.value.includes('Sanitary')) setEditCategoryUr('سینیٹری ورکر و نالی صفائی');
                    else if (e.target.value.includes('Cook')) setEditCategoryUr('ماہر گھریلو باورچی');
                    else if (e.target.value.includes('Electrician')) setEditCategoryUr('سند یافتہ الیکٹریشن');
                    else setEditCategoryUr('صفائی و گھریلو مددگار');
                  }}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
                >
                  <option value="Doorstep Barber & Men's Groomer">Doorstep Barber & Men's Groomer (باربر و حجام)</option>
                  <option value="Home Salon & Beautician (Mani/Pedi)">Home Salon & Beautician Mani/Pedi (بیوٹی پارلر)</option>
                  <option value="Master Mason & Construction Mistri">Master Mason & Construction Mistri (راج مستری)</option>
                  <option value="Certified Plumber & Water Line Specialist">Certified Plumber & Water Line (سینیٹری پلمبر)</option>
                  <option value="Daily Labour & Loading Mazdoor">Daily Labour & Loading Mazdoor (عام مزدور)</option>
                  <option value="Home Tutor & Science Teacher">Home Tutor & Science Teacher (ہوم ٹیوٹر / ٹیچر)</option>
                  <option value="Sanitary & Sewerage Specialist">Sanitary & Sewerage Specialist (سینیٹری ورکر)</option>
                  <option value="Deep Cleaning & Floor Specialist">Deep Cleaning & Floor Specialist (صفائی کا کام)</option>
                  <option value="Master Home Cook & Kitchen Care">Master Home Cook & Kitchen Care (کھانا پکانا)</option>
                  <option value="Certified Electrician & Handyman">Certified Electrician & Handyman (الیکٹریشن)</option>
                  <option value="Laundry, Ironing & House Helper">Laundry, Ironing & House Helper (استری و لانڈری)</option>
                  <option value="Elderly Care & Companion">Elderly Care & Companion (بزرگوں کی دیکھ بھال)</option>
                </select>
              </div>

              {/* City, Area, Hourly Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    City (شہر)
                  </label>
                  <select
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Peshawar">Peshawar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Area (علاقہ)
                  </label>
                  <input
                    type="text"
                    value={editArea}
                    onChange={(e) => setEditArea(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Hourly Rate (PKR)
                  </label>
                  <input
                    type="number"
                    min={300}
                    step={50}
                    value={editRate}
                    onChange={(e) => setEditRate(parseInt(e.target.value, 10) || 500)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg outline-none font-bold text-emerald-800"
                  />
                </div>
              </div>

              {/* Phone & Bio */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  About / Bio (مختصر تعارف)
                </label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Save Profile (محفوظ کریں)
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Withdrawal Dialog Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95">
            <h4 className="text-base font-bold text-stone-900 mb-1">
              Withdraw Partner Earnings
            </h4>
            <p className="text-xs text-stone-500 mb-4">
              Available Daily Balance: <strong>Rs. {workerEarnings.today.toLocaleString()}</strong>
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Payout Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('jazzcash')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold ${
                      withdrawMethod === 'jazzcash' ? 'border-red-600 bg-red-50 text-red-700' : 'border-stone-200'
                    }`}
                  >
                    JazzCash
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('easypaisa')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold ${
                      withdrawMethod === 'easypaisa' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-stone-200'
                    }`}
                  >
                    Easypaisa
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Mobile Account Number
                </label>
                <input
                  type="tel"
                  value={withdrawPhone}
                  onChange={(e) => setWithdrawPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg outline-none font-semibold text-stone-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Amount in PKR
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  max={workerEarnings.today}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg outline-none font-bold text-stone-900 text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setWithdrawModalOpen(false)}
                className="flex-1 py-2 text-xs font-semibold text-stone-600 bg-stone-100 rounded-xl hover:bg-stone-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteWithdrawal}
                className="flex-1 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow cursor-pointer"
              >
                Send to Wallet
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
