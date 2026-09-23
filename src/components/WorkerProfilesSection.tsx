import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Worker } from '../types';
import { 
  ShieldCheck, 
  Star, 
  Briefcase, 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  Heart, 
  X, 
  Search, 
  Check,
  Zap
} from 'lucide-react';

export const WorkerProfilesSection: React.FC = () => {
  const { 
    language, 
    workers, 
    setIsBookingModalOpen, 
    setPreselectedWorkerId, 
    setPreselectedServiceId,
    toggleFavoriteWorker,
    favoriteWorkerIds,
    setIsBecomeWorkerOpen 
  } = useApp();

  const [selectedWorkerForModal, setSelectedWorkerForModal] = useState<Worker | null>(null);
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredWorkers = workers.filter(w => {
    const matchCity = filterCity === 'all' || w.city.toLowerCase() === filterCity.toLowerCase();
    
    const matchCategory = filterCategory === 'all' 
      ? true 
      : filterCategory === 'barber'
      ? (w.category.toLowerCase().includes('barber') || w.name.toLowerCase().includes('rashid') || w.categoryUr.includes('باربر') || w.skills.some(s => s.toLowerCase().includes('hair') || s.toLowerCase().includes('beard')))
      : filterCategory === 'parlour'
      ? (w.category.toLowerCase().includes('parlour') || w.category.toLowerCase().includes('beautician') || w.name.toLowerCase().includes('samina') || w.categoryUr.includes('بیوٹیشن') || w.skills.some(s => s.toLowerCase().includes('pedicure') || s.toLowerCase().includes('facial') || s.toLowerCase().includes('manicure')))
      : filterCategory === 'mason'
      ? (w.category.toLowerCase().includes('mason') || w.category.toLowerCase().includes('mistri') || w.name.toLowerCase().includes('aslam') || w.categoryUr.includes('مستری'))
      : filterCategory === 'plumber'
      ? (w.category.toLowerCase().includes('plumb') || w.name.toLowerCase().includes('tariq mehmood') || w.categoryUr.includes('پلمبر') || w.skills.some(s => s.toLowerCase().includes('pipe') || s.toLowerCase().includes('leak')))
      : filterCategory === 'labour' 
      ? (w.category.toLowerCase().includes('labour') || w.name.toLowerCase().includes('rafiq') || w.category.toLowerCase().includes('moving') || w.categoryUr.includes('مزدور'))
      : filterCategory === 'tutor'
      ? (w.category.toLowerCase().includes('tutor') || w.category.toLowerCase().includes('teacher') || w.name.toLowerCase().includes('hamza') || w.categoryUr.includes('ٹیوٹر'))
      : filterCategory === 'sanitary'
      ? (w.category.toLowerCase().includes('sanitary') || w.category.toLowerCase().includes('sewerage') || w.name.toLowerCase().includes('naveed') || w.categoryUr.includes('سینیٹری'))
      : filterCategory === 'cleaning'
      ? (w.category.toLowerCase().includes('clean') || w.category.toLowerCase().includes('laundry'))
      : filterCategory === 'kitchen'
      ? (w.category.toLowerCase().includes('cook') || w.category.toLowerCase().includes('kitchen'))
      : filterCategory === 'artisan'
      ? (w.category.toLowerCase().includes('electrician') || w.category.toLowerCase().includes('handyman') || w.category.toLowerCase().includes('mason') || w.category.toLowerCase().includes('plumb'))
      : true;

    const query = searchQuery.trim().toLowerCase();
    const matchQuery = !query || 
      w.name.toLowerCase().includes(query) ||
      w.nameUr.includes(query) ||
      w.category.toLowerCase().includes(query) ||
      w.categoryUr.includes(query) ||
      w.city.toLowerCase().includes(query) ||
      w.area.toLowerCase().includes(query) ||
      w.skills.some(s => s.toLowerCase().includes(query));

    return matchCity && matchCategory && matchQuery;
  });

  const getWorkerServiceId = (worker: Worker): string => {
    const cat = worker.category.toLowerCase();
    const skills = worker.skills.join(' ').toLowerCase();
    if (cat.includes('barber') || skills.includes('beard') || skills.includes('hair')) return 'home-barber';
    if (cat.includes('parlour') || cat.includes('beautician') || skills.includes('manicure') || skills.includes('facial')) return 'home-parlour';
    if (cat.includes('mason') || cat.includes('mistri') || skills.includes('brick') || skills.includes('cement')) return 'mason-mistri';
    if (cat.includes('plumb') || skills.includes('pipe') || skills.includes('leak')) return 'plumber-sanitary';
    if (cat.includes('labour') || skills.includes('loading') || skills.includes('shifting')) return 'daily-labour';
    if (cat.includes('tutor') || skills.includes('math') || skills.includes('science')) return 'home-tutor';
    if (cat.includes('sanitary') || skills.includes('gutter') || skills.includes('drain')) return 'sanitary-worker';
    if (cat.includes('cook') || cat.includes('chef') || skills.includes('biryani') || skills.includes('roti')) return 'home-cooking';
    if (cat.includes('clean') || cat.includes('maid') || skills.includes('dusting') || skills.includes('mopping')) return 'home-cleaning';
    if (cat.includes('laundry') || skills.includes('iron')) return 'laundry-ironing';
    if (cat.includes('electric') || skills.includes('wiring') || skills.includes('fan')) return 'electrician-handyman';
    return 'home-cleaning';
  };

  const handleQuickBook = (worker: Worker) => {
    const serviceId = getWorkerServiceId(worker);
    setPreselectedWorkerId(worker.id);
    setPreselectedServiceId(serviceId);
    setIsBookingModalOpen(true);
  };

  const handleRequestWorker = (worker: Worker) => {
    handleQuickBook(worker);
  };

  const categories = [
    { id: 'all', en: 'All Categories', ur: 'تمام ورکرز' },
    { id: 'barber', en: "✂️ Barber / Groomer", ur: '✂️ باربر و حجام' },
    { id: 'parlour', en: '💅 Parlour (Mani/Pedi)', ur: '💅 پارلر و مینی کیور' },
    { id: 'mason', en: '🧱 Mason / Mistri', ur: '🧱 راج مستری' },
    { id: 'plumber', en: '🔧 Plumber', ur: '🔧 پلمبر کاریگر' },
    { id: 'labour', en: '👷 Labour / Mazdoor', ur: '👷 عام مزدور' },
    { id: 'tutor', en: '📚 Home Tutor', ur: '📚 ہوم ٹیوٹر' },
    { id: 'sanitary', en: '🚰 Sanitary Worker', ur: '🚰 سینیٹری ورکر' },
    { id: 'cleaning', en: '🧹 Cleaners & Laundry', ur: '🧹 صفائی و لانڈری' },
    { id: 'kitchen', en: '🍳 Home Cooks', ur: '🍳 گھریلو باورچی' },
    { id: 'artisan', en: '⚡ Electricians', ur: '⚡ الیکٹریشن' },
  ];

  return (
    <section id="workers" className="py-16 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
              {language === 'ur' ? 'تصدیق شدہ افرادی قوت' : 'Vetted Professionals with Photos'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              {language === 'ur' ? 'ماہر اور قابل اعتماد مددگار' : 'Meet Verified KaamDo Helpers'}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-stone-600 max-w-2xl">
              {language === 'ur' 
                ? 'باربر، بیوٹیشن (مینی کیور پیڈی کیور)، راج مستری، پلمبر، عام مزدور، ہوم ٹیوٹرز، سینیٹری ورکرز، باورچی اور صفائی عملہ تصویر اور نادرا تصدیق کے ساتھ۔' 
                : 'Barbers, Beauticians (Manicure/Pedicure), Masons, Plumbers, Labour, Tutors, and Sanitary Specialists with authentic portraits and police verification.'}
            </p>
          </div>

          {/* Call to Action: Add Yourself with Photo */}
          <button
            onClick={() => setIsBecomeWorkerOpen(true)}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <span>+</span>
            <span>{language === 'ur' ? 'اپنا نام اور تصویر لگائیں (ورکر بنیں)' : 'Register Yourself with Photo'}</span>
          </button>
        </div>

        {/* Filter Controls: Categories, Cities, and Search */}
        <div className="flex flex-col gap-3 mb-8 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ur' ? 'نام، پیشے یا علاقے سے تلاش کریں...' : 'Search by name, skill, or area...'}
                className="w-full pl-9 pr-8 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* City Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-stone-600 font-semibold">{language === 'ur' ? 'شہر منتخب کریں:' : 'Select City:'}</span>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-stone-300 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-emerald-700"
              >
                <option value="all">{language === 'ur' ? 'تمام شہر' : 'All Cities'}</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Karachi">Karachi</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  filterCategory === cat.id 
                    ? 'bg-emerald-700 text-white shadow-sm font-bold' 
                    : 'bg-white text-stone-700 hover:text-stone-950 border border-stone-200'
                }`}
              >
                {language === 'ur' ? cat.ur : cat.en}
              </button>
            ))}
          </div>

        </div>

        {/* Worker Cards Grid */}
        {filteredWorkers.length === 0 ? (
          <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-200">
            <p className="text-stone-500 text-sm">
              {language === 'ur' ? 'کوئی ورکر نہیں ملا۔ براہ کرم تلاش یا فلٹر تبدیل کریں۔' : 'No helpers found matching your criteria. Try adjusting your filters or search.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker, index) => {
              const isFavorite = favoriteWorkerIds.includes(worker.id);
              const serialNum = String(index + 1).padStart(2, '0');

              return (
                <div
                  key={worker.id}
                  className="bg-stone-50/70 rounded-3xl border border-stone-200/90 hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-950/5 transition-all p-5 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Serial Number Tag */}
                  <div className="absolute top-2.5 right-12 px-2 py-0.5 rounded bg-stone-200/70 text-stone-600 font-mono text-[10px] font-bold">
                    PARTNER #{serialNum}
                  </div>

                  <div>
                    {/* Top Row: Photo, Name, Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="relative">
                          <img
                            src={worker.photo}
                            alt={worker.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-stone-200 shadow-sm"
                          />
                          {/* Status dot */}
                          <span 
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                              worker.isAvailable ? 'bg-emerald-500' : 'bg-stone-400'
                            }`}
                            title={worker.isAvailable ? 'Available Now' : 'Currently On Job'}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-base font-bold text-stone-950">
                              {language === 'ur' ? worker.nameUr : worker.name}
                            </h3>
                          </div>
                          <div className="text-xs font-semibold text-emerald-800">
                            {language === 'ur' ? worker.categoryUr : worker.category}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>{worker.area}, {worker.city}</span>
                          </div>
                        </div>
                      </div>

                      {/* Favorite Heart Button */}
                      <button
                        onClick={() => toggleFavoriteWorker(worker.id)}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          isFavorite ? 'text-rose-600 bg-rose-50' : 'text-stone-400 hover:bg-stone-200'
                        }`}
                        aria-label="Save to favorites"
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600' : ''}`} />
                      </button>
                    </div>

                    {/* Verification Badges */}
                    <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center gap-2 text-[11px] font-semibold text-stone-700">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>NADRA Verified</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-stone-600">Police Cleared</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-stone-600">{worker.experienceYears} yrs exp</span>
                    </div>

                    {/* Rating & Stats Strip */}
                    <div className="mt-3 grid grid-cols-3 gap-2 p-2.5 bg-white rounded-xl border border-stone-200/70 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-stone-500 block">Rating</span>
                        <span className="font-extrabold text-stone-900 flex items-center justify-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          <span>{worker.rating}</span>
                        </span>
                      </div>

                      <div className="border-x border-stone-100">
                        <span className="text-[10px] text-stone-500 block">Jobs Done</span>
                        <span className="font-extrabold text-stone-900 tabular-nums">
                          {worker.completedJobs}+
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-stone-500 block">Hourly</span>
                        <span className="font-extrabold text-emerald-700 tabular-nums">
                          Rs. {worker.hourlyRatePkr}
                        </span>
                      </div>
                    </div>

                    {/* Skills tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {worker.skills.slice(0, 3).map((skill) => (
                        <span 
                          key={skill}
                          className="text-[11px] px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Short Bio */}
                    <p className="mt-3 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {language === 'ur' ? worker.bioUr : worker.bioEn}
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-5 pt-3 border-t border-stone-200/80 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedWorkerForModal(worker)}
                      className="py-2 px-3 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl transition-colors cursor-pointer"
                    >
                      {language === 'ur' ? 'پروفائل دیکھیں' : 'View Profile'}
                    </button>

                    <button
                      onClick={() => handleQuickBook(worker)}
                      className="py-2 px-3 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                      <span>{language === 'ur' ? 'فوری بکنگ' : 'Quick Book'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Detailed Worker Profile Dialog */}
      {selectedWorkerForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 max-h-[85vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedWorkerForModal.photo}
                  alt={selectedWorkerForModal.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600"
                />
                <div>
                  <h3 className="text-lg font-bold text-stone-900">
                    {selectedWorkerForModal.name}
                  </h3>
                  <div className="text-xs font-semibold text-emerald-800">
                    {selectedWorkerForModal.category}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    {selectedWorkerForModal.area}, {selectedWorkerForModal.city}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedWorkerForModal(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verification Checklist */}
            <div className="mt-5 p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2 text-xs">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Verification & Security Dossier</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-stone-700 pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>NADRA Biometric CNIC Checked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Police Character Clearance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Home Address Physically Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>KaamDo Ethics & Hygiene Trained</span>
                </div>
              </div>
            </div>

            {/* About Bio */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                About & Work Ethic
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {selectedWorkerForModal.bioEn}
              </p>
              <p className="text-xs text-stone-500 mt-1 font-urdu leading-relaxed">
                {selectedWorkerForModal.bioUr}
              </p>
            </div>

            {/* Skills & Experience */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Core Competencies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedWorkerForModal.skills.map((s) => (
                  <span key={s} className="px-2.5 py-1 bg-stone-100 text-stone-800 text-xs font-medium rounded-lg">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Rate</span>
                <span className="text-base font-bold text-stone-900">
                  Rs. {selectedWorkerForModal.hourlyRatePkr} / hour
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedWorkerForModal(null);
                  handleQuickBook(selectedWorkerForModal);
                }}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                ⚡ Quick Book {selectedWorkerForModal.name}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
