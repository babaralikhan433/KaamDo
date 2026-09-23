import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Service } from '../types';
import { 
  Sparkles, 
  Home, 
  Flame, 
  Shirt, 
  Coffee, 
  ShoppingBag, 
  HeartHandshake, 
  Truck, 
  Wrench, 
  Clock, 
  ArrowRight, 
  Check,
  HardHat,
  GraduationCap,
  Droplets,
  Scissors,
  Hammer,
  Search,
  BadgeCheck,
  Info
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { 
    language, 
    services, 
    setIsBookingModalOpen, 
    setPreselectedServiceId, 
    setSelectedServiceForDetail,
    selectedCity 
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredServices = services.filter(s => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = s.nameEn.toLowerCase().includes(q) || s.nameUr.includes(q);
      const matchDesc = s.descriptionEn.toLowerCase().includes(q) || s.descriptionUr.includes(q);
      const matchCat = s.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }

    if (activeTab === 'all') return true;
    if (activeTab === 'barber') return s.id === 'home-barber';
    if (activeTab === 'parlour') return s.id === 'home-parlour';
    if (activeTab === 'mason') return s.id === 'mason-mistri';
    if (activeTab === 'plumber') return s.id === 'plumber-sanitary';
    if (activeTab === 'labour') return s.id === 'daily-labour' || s.id === 'moving-assistance';
    if (activeTab === 'tutor') return s.id === 'home-tutor';
    if (activeTab === 'sanitary') return s.id === 'sanitary-worker';
    if (activeTab === 'cleaning') return s.category === 'cleaning' || s.id === 'home-cleaning' || s.id === 'sweeping-mopping' || s.id === 'laundry-ironing' || s.id === 'dusting-deep' || s.id === 'bathroom-cleaning';
    if (activeTab === 'kitchen') return s.category === 'kitchen' || s.id === 'home-cooking' || s.id === 'dishwashing';
    if (activeTab === 'artisan') return s.category === 'artisan' || s.id === 'other-household';
    return s.category === activeTab;
  });

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'home-barber':
        return <Scissors className="w-5 h-5 text-amber-700" />;
      case 'home-parlour':
        return <Sparkles className="w-5 h-5 text-pink-600" />;
      case 'mason-mistri':
        return <Hammer className="w-5 h-5 text-amber-800" />;
      case 'plumber-sanitary':
        return <Wrench className="w-5 h-5 text-blue-700" />;
      case 'daily-labour':
        return <HardHat className="w-5 h-5 text-amber-700" />;
      case 'home-tutor':
        return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      case 'sanitary-worker':
        return <Droplets className="w-5 h-5 text-cyan-700" />;
      case 'home-cleaning':
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
      case 'sweeping-mopping':
        return <Home className="w-5 h-5 text-emerald-600" />;
      case 'bathroom-cleaning':
        return <Sparkles className="w-5 h-5 text-blue-600" />;
      case 'kitchen-cleaning':
        return <Flame className="w-5 h-5 text-amber-600" />;
      case 'dishwashing':
        return <Coffee className="w-5 h-5 text-teal-600" />;
      case 'laundry-ironing':
        return <Shirt className="w-5 h-5 text-indigo-600" />;
      case 'dusting-deep':
        return <Sparkles className="w-5 h-5 text-cyan-600" />;
      case 'grocery-assistance':
        return <ShoppingBag className="w-5 h-5 text-orange-600" />;
      case 'home-cooking':
        return <Flame className="w-5 h-5 text-red-600" />;
      case 'elderly-assistance':
        return <HeartHandshake className="w-5 h-5 text-rose-600" />;
      case 'moving-assistance':
        return <Truck className="w-5 h-5 text-stone-700" />;
      case 'other-household':
      default:
        return <Wrench className="w-5 h-5 text-emerald-700" />;
    }
  };

  const handleBookService = (service: Service) => {
    setPreselectedServiceId(service.id);
    setIsBookingModalOpen(true);
  };

  const categoriesList = [
    { id: 'all', en: 'All Services', ur: 'تمام خدمات' },
    { id: 'barber', en: "✂️ Men's Barber", ur: '✂️ باربر و حجام' },
    { id: 'parlour', en: '💅 Parlour (Mani/Pedi)', ur: '💅 پارلر و مینی کیور' },
    { id: 'mason', en: '🧱 Mason / Mistri', ur: '🧱 راج مستری' },
    { id: 'plumber', en: '🔧 Plumber', ur: '🔧 پلمبر کاریگر' },
    { id: 'labour', en: '👷 Labour / Mazdoor', ur: '👷 عام مزدور' },
    { id: 'tutor', en: '📚 Home Tutor', ur: '📚 ہوم ٹیوٹر' },
    { id: 'sanitary', en: '🚰 Sanitary Worker', ur: '🚰 سینیٹری ورکر' },
    { id: 'cleaning', en: '🧹 Clean & Laundry', ur: '🧹 صفائی و لانڈری' },
    { id: 'kitchen', en: '🍳 Home Cook', ur: '🍳 گھریلو باورچی' },
    { id: 'artisan', en: '⚡ Electrician', ur: '⚡ الیکٹریشن' },
  ];

  return (
    <section id="services" className="py-16 sm:py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'ur' ? 'اصلی تصاویر کے ساتھ تصدیق شدہ سہولیات' : 'Verified Doorstep Services with Authentic Photos'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              {language === 'ur' ? 'آپ کو کس کام میں مدد درکار ہے؟' : 'What do you need help with?'}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-stone-600 max-w-2xl">
              {language === 'ur' 
                ? 'باربر، بیوٹی پارلر (مینی کیور پیڈی کیور)، راج مستری، پلمبر، عام مزدور، ٹیوٹرز اور صفائی عملہ حقیقی کام کی تصاویر اور فی گھنٹہ مناسب چارجز کے ساتھ۔' 
                : `Barber, Parlour (Manicure/Pedicure), Masons, Plumbers, Daily Labour, Tutors & House Cleaners available across ${selectedCity} with authentic photos.`}
            </p>
          </div>

          {/* Quick Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ur' ? 'کوئی بھی کام تلاش کریں (حجام، مستری، پلمبر...)' : 'Search service (Barber, Mistri, Plumber)...'}
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
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
        </div>

        {/* Interactive Category Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-stone-200/80 rounded-2xl overflow-x-auto mb-8">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === cat.id 
                  ? 'bg-emerald-800 text-white shadow-sm font-bold' 
                  : 'bg-white/80 text-stone-700 hover:bg-white hover:text-stone-950'
              }`}
            >
              <span>{language === 'ur' ? cat.ur : cat.en}</span>
            </button>
          ))}
        </div>

        {/* Services Cards Grid with Serial Numbered Cards */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-500 text-sm">
              {language === 'ur' ? 'کوئی سروس نہیں ملی۔ براہ کرم تلاش کا لفظ تبدیل کریں۔' : 'No services found matching your search. Please try another keyword.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredServices.map((service, index) => {
              const hasImage = Boolean(service.image);
              const serialNumber = String(index + 1).padStart(2, '0');

              return (
                <div
                  key={service.id}
                  className="group bg-white rounded-2xl border border-stone-200 hover:border-emerald-600 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
                >
                  {/* Top Authentic Service Picture */}
                  {hasImage ? (
                    <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                      <img
                        src={service.image}
                        alt={service.nameEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/20 to-transparent" />
                      
                      {/* Unique Serial Number Badge */}
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-stone-950/80 backdrop-blur-md text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/30 shadow">
                        № {serialNumber}
                      </div>

                      {/* Verified Badge */}
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-semibold flex items-center gap-1 shadow">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>{language === 'ur' ? 'تصدیق شدہ' : 'Verified'}</span>
                      </div>

                      {/* Category Label at Bottom of Picture */}
                      <div className="absolute bottom-2.5 left-3 text-white text-xs font-bold drop-shadow flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>{language === 'ur' ? service.nameUr : service.nameEn}</span>
                      </div>
                    </div>
                  ) : null}

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Icon & Metadata */}
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                          {getServiceIcon(service.id)}
                        </div>
                        
                        <div className="text-[11px] font-semibold text-stone-600 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>{service.durationDefault} hr avg</span>
                        </div>
                      </div>

                      {/* Service Name */}
                      <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                        {language === 'ur' ? service.nameUr : service.nameEn}
                      </h3>

                      {/* Dual-language subline */}
                      <p className="text-xs text-stone-500 mt-0.5">
                        {language === 'ur' ? service.nameEn : service.nameUr}
                      </p>

                      {/* Original Copywriting Description */}
                      <p className="mt-2 text-xs text-stone-600 leading-relaxed line-clamp-3">
                        {language === 'ur' ? service.descriptionUr : service.descriptionEn}
                      </p>
                    </div>

                    {/* Pricing and Action */}
                    <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                          {language === 'ur' ? 'شروعات' : 'Starting From'}
                        </div>
                        <div className="text-stone-900 font-extrabold text-base tracking-tight">
                          Rs. {service.basePricePkr.toLocaleString()}
                          <span className="text-[11px] font-normal text-stone-500">/hr</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedServiceForDetail(service)}
                          className="px-2.5 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition cursor-pointer"
                          title="View Details"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleBookService(service)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white shadow-sm transition-all cursor-pointer"
                        >
                          <span>{language === 'ur' ? 'ابھی بک کریں' : 'Book Now'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Guarantee Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-emerald-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-300 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold">
                {language === 'ur' ? 'کام کی 100 فیصد تسلی بخش گارنٹی' : '100% Satisfaction & Safety Guarantee'}
              </h4>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {language === 'ur' 
                  ? 'اگر آپ کام سے مطمئن نہ ہوں تو بغیر کسی اضافی خرچ کے متبادل مددگار یا رقم کی فوری واپسی۔'
                  : 'Not satisfied with the service? We will dispatch a replacement helper or refund your booking.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setPreselectedServiceId('home-cleaning');
                setIsBookingModalOpen(true);
              }}
              className="px-5 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold rounded-xl shadow transition-colors cursor-pointer"
            >
              {language === 'ur' ? 'فوری مددگار منگوائیں' : 'Request Instant Helper'}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
