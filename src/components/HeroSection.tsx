import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HERO_IMAGE, CITIES_DATA } from '../data/mockData';
import { ShieldCheck, MapPin, Search, Zap, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { 
    language, 
    selectedCity, 
    setSelectedCity, 
    selectedArea, 
    setSelectedArea, 
    setIsBookingModalOpen, 
    setPreselectedServiceId,
    setIsBecomeWorkerOpen,
    services 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const currentCityObj = CITIES_DATA.find(c => c.nameEn.toLowerCase() === selectedCity.toLowerCase()) || CITIES_DATA[0];

  const handleQuickBook = (serviceId?: string) => {
    if (serviceId) {
      setPreselectedServiceId(serviceId);
    }
    setIsBookingModalOpen(true);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-stone-900 text-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background Subtle Geometric Pattern & Ambient Glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pakistan-geom" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pakistan-geom)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines, Trust Markers, Quick Booking Box */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Editorial Kicker (Unboxed metadata with separators) */}
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 mb-4 tracking-wide">
              <span className="font-bold text-white bg-emerald-700/80 px-2 py-0.5 rounded-full border border-emerald-500/40">KaamDo Pakistan</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>NADRA Verified</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>JazzCash & Easypaisa</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] text-balance">
              {language === 'ur' ? (
                <span className="font-urdu leading-relaxed">
                  کام دو: گھر کے روزمرہ کام، اب چند کلکس میں
                </span>
              ) : (
                <>
                  KaamDo: Trusted Home Help, <br className="hidden sm:inline" />
                  <span className="text-emerald-400">At Your Doorstep in Minutes</span>
                </>
              )}
            </h1>

            {/* Urdu / English Supporting Text */}
            <p className="mt-4 text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-xl font-normal">
              {language === 'ur' ? (
                <span className="font-urdu">
                  گھر کی صفائی، کھانا پکانا، جھاڑو پوچا، استری اور الیکٹریشن کے لیے تصدیق شدہ اور باحیا کارکن صرف 25 منٹ میں آپ کے گھر۔
                </span>
              ) : (
                <>
                  "Apne ghar ka kaam, ab chand clicks mein." Connect with trained, background-checked helpers & skilled artisans across major Pakistani cities with real-time arrival tracking.
                </>
              )}
            </p>

            {/* Interactive Search & Location Box */}
            <div className="mt-8 p-3 sm:p-4 bg-white/95 text-stone-900 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                
                {/* City Picker */}
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    {language === 'ur' ? 'شہر منتخب کریں' : 'Select City'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-700 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={selectedCity}
                      onChange={(e) => {
                        setSelectedCity(e.target.value);
                        const cityObj = CITIES_DATA.find(c => c.nameEn === e.target.value);
                        if (cityObj && cityObj.popularAreas.length > 0) {
                          setSelectedArea(cityObj.popularAreas[0]);
                        }
                      }}
                      className="w-full pl-8 pr-3 py-2 text-xs font-semibold bg-stone-100/80 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-800"
                    >
                      {CITIES_DATA.map((city) => (
                        <option key={city.nameEn} value={city.nameEn}>
                          {city.nameEn} ({city.nameUr}) {!city.active && '- Soon'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Area Input */}
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    {language === 'ur' ? 'علاقہ / سوسائٹی' : 'Area / Sector'}
                  </label>
                  <input
                    type="text"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    placeholder="e.g. DHA, Gulberg, F-10"
                    className="w-full px-3 py-2 text-xs font-medium bg-stone-100/80 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-800"
                  />
                </div>

                {/* Action CTA Button */}
                <div className="sm:col-span-4 flex items-end">
                  <button
                    onClick={() => handleQuickBook()}
                    className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-lg shadow transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>{language === 'ur' ? 'ابھی بک کریں' : 'Book a Service'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Area Suggestions */}
              <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-wrap items-center gap-1.5 text-[11px] text-stone-600">
                <span className="font-semibold text-stone-700">
                  {language === 'ur' ? 'مشہور علاقے:' : 'Popular:'}
                </span>
                {currentCityObj.popularAreas.slice(0, 4).map((area) => (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className="px-2 py-0.5 rounded bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-600 transition-colors cursor-pointer"
                  >
                    {area}
                  </button>
                ))}
              </div>

              {/* Instant Category Shortcuts */}
              <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="font-bold text-stone-700">
                  {language === 'ur' ? 'فوری سروسز:' : 'Fast Booking:'}
                </span>
                {[
                  { id: 'home-barber', labelEn: '💈 Barber', labelUr: '💈 باربر / حجام' },
                  { id: 'home-parlour', labelEn: '💅 Parlour (Mani/Pedi)', labelUr: '💅 بیوٹی پارلر (پیڈی کیور)' },
                  { id: 'mason-mistri', labelEn: '🧱 Mason / Mistri', labelUr: '🧱 راج مستری' },
                  { id: 'plumber-sanitary', labelEn: '🔧 Plumber', labelUr: '🔧 پلمبر کاریگر' },
                  { id: 'daily-labour', labelEn: '👷 Labour', labelUr: '👷 عام مزدور' },
                  { id: 'home-tutor', labelEn: '📚 Home Tutor', labelUr: '📚 ہوم ٹیوٹر' },
                  { id: 'sanitary-worker', labelEn: '🚰 Sanitary', labelUr: '🚰 سینیٹری ورکر' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleQuickBook(item.id)}
                    className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-600 hover:text-white font-medium transition-all cursor-pointer text-[10px] sm:text-[11px]"
                  >
                    {language === 'ur' ? item.labelUr : item.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust and Key Value Propositions */}
            <div className="mt-6 grid grid-cols-3 gap-3 text-emerald-100/80 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>25-40 min arrival</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>NADRA CNIC checked</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cash & JazzCash</span>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleQuickBook()}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{language === 'ur' ? 'سروس کا انتخاب کریں' : 'Book a Service'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsBecomeWorkerOpen(true)}
                className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all cursor-pointer"
              >
                <span>{language === 'ur' ? 'ورکر بنیں اور کمائیں' : 'Become a Worker / Partner'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset Carrier */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-[4/3] lg:aspect-[3/3.6] bg-stone-800">
              <img
                src={HERO_IMAGE}
                alt="KaamDo Verified Pakistani Home Service Professional"
                className="w-full h-full object-cover"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              
              {/* Gradient scrim for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />

              {/* Floating Verified Badge Card */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-stone-900 px-3.5 py-2 rounded-xl shadow-lg border border-emerald-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-extrabold text-stone-900 leading-tight">
                    {language === 'ur' ? '100% تصدیق شدہ' : '100% Verified'}
                  </div>
                  <div className="text-[10px] text-stone-500 leading-tight">
                    NADRA Biometric + Police
                  </div>
                </div>
              </div>

              {/* Bottom Card Spotlight: Rapid Dispatch */}
              <div className="absolute bottom-4 left-4 right-4 bg-stone-900/90 backdrop-blur-md text-white p-3.5 rounded-2xl border border-white/15">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {language === 'ur' ? 'فوری آمد دستیاب ہے' : 'Instant Dispatch Available'}
                      </div>
                      <div className="text-[11px] text-emerald-300">
                        {language === 'ur' ? `لاہور و اسلام آباد میں 25 منٹ` : `Helpers nearby in ${selectedCity}`}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickBook('home-cleaning')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    {language === 'ur' ? 'بک کریں' : 'Instant Book'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
