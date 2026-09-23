import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Globe, ShieldCheck, UserCheck, LayoutDashboard, Calendar, Menu, X, ArrowRight, User, LogIn, LogOut, MessageCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    activeView, 
    setActiveView, 
    setIsBookingModalOpen, 
    setIsBecomeWorkerOpen,
    customerUser,
    setIsCustomerAuthModalOpen,
    logoutCustomer,
    bookings,
    activeBookingId 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showCustomerMenu, setShowCustomerMenu] = useState(false);

  const activeBooking = bookings.find(b => b.id === activeBookingId && b.bookingStatus !== 'completed' && b.bookingStatus !== 'cancelled');

  const scrollToSection = (id: string) => {
    setActiveView('home');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold text-xl shadow-sm shadow-emerald-800/20 group-hover:bg-emerald-800 transition-colors">
              KD
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-stone-950 flex items-center gap-1.5">
                KaamDo
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </span>
              <span className="text-[11px] font-medium text-emerald-800 tracking-wide font-urdu">
                {language === 'ur' ? 'کام دو پاکستان' : 'Ghar Ka Kaam Asaan'}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button 
            onClick={() => scrollToSection('services')}
            className="hover:text-emerald-700 transition-colors cursor-pointer py-1"
          >
            {language === 'ur' ? 'خدمات' : 'Services'}
          </button>
          
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-emerald-700 transition-colors cursor-pointer py-1"
          >
            {language === 'ur' ? 'طریقہ کار' : 'How It Works'}
          </button>
          
          <button 
            onClick={() => scrollToSection('workers')}
            className="hover:text-emerald-700 transition-colors cursor-pointer py-1"
          >
            {language === 'ur' ? 'مصدقہ مددگار' : 'Verified Helpers'}
          </button>
          
          <button 
            onClick={() => scrollToSection('cities')}
            className="hover:text-emerald-700 transition-colors cursor-pointer py-1"
          >
            {language === 'ur' ? 'شہر' : 'Cities'}
          </button>

          {activeBooking && (
            <button 
              onClick={() => {
                setActiveView('customer_dashboard');
              }}
              className="flex items-center gap-1.5 text-emerald-700 font-semibold hover:text-emerald-800 transition-colors cursor-pointer py-1"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>{language === 'ur' ? 'لائیو ٹریکر' : 'Live Order'}</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Actions & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:border-stone-300 transition-colors"
            title="Toggle English / اردو"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span>{language === 'en' ? 'اردو' : 'English'}</span>
          </button>

          {/* Portal Switcher (Customer / Partner / Admin) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">
                {activeView === 'home' && (language === 'ur' ? 'پورٹلز' : 'Portals')}
                {activeView === 'customer_dashboard' && (language === 'ur' ? 'میرا ڈیش بورڈ' : 'Customer')}
                {activeView === 'worker_dashboard' && (language === 'ur' ? 'پارٹنر پورٹل' : 'Partner')}
                {activeView === 'admin_panel' && (language === 'ur' ? 'ایڈمن پینل' : 'Admin')}
              </span>
            </button>

            {showRoleMenu && (
              <div 
                className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 text-xs text-stone-800 font-medium"
                onMouseLeave={() => setShowRoleMenu(false)}
              >
                <button
                  onClick={() => { setActiveView('home'); setShowRoleMenu(false); }}
                  className={`w-full px-3.5 py-2 text-left flex items-center gap-2 hover:bg-stone-50 ${activeView === 'home' ? 'text-emerald-700 font-bold bg-emerald-50/50' : ''}`}
                >
                  <Globe className="w-4 h-4 text-stone-500" />
                  <span>{language === 'ur' ? 'مرکزی صفحہ (مارکیٹ پلیس)' : 'Home Marketplace'}</span>
                </button>
                <button
                  onClick={() => { setActiveView('customer_dashboard'); setShowRoleMenu(false); }}
                  className={`w-full px-3.5 py-2 text-left flex items-center gap-2 hover:bg-stone-50 ${activeView === 'customer_dashboard' ? 'text-emerald-700 font-bold bg-emerald-50/50' : ''}`}
                >
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'ur' ? 'گاہک ڈیش بورڈ و آرڈرز' : 'Customer Dashboard'}</span>
                </button>
                <button
                  onClick={() => { setActiveView('worker_dashboard'); setShowRoleMenu(false); }}
                  className={`w-full px-3.5 py-2 text-left flex items-center gap-2 hover:bg-stone-50 ${activeView === 'worker_dashboard' ? 'text-emerald-700 font-bold bg-emerald-50/50' : ''}`}
                >
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  <span>{language === 'ur' ? 'ورکر / پارٹنر ڈیش بورڈ' : 'Worker / Partner App'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Customer Authentication State */}
          {customerUser ? (
            <div className="relative">
              <button
                onClick={() => setShowCustomerMenu(!showCustomerMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-semibold transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">
                  {customerUser.avatar || customerUser.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">{customerUser.name}</span>
              </button>

              {showCustomerMenu && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 text-xs font-medium"
                  onMouseLeave={() => setShowCustomerMenu(false)}
                >
                  <div className="px-3.5 py-2 border-b border-stone-100">
                    <p className="font-bold text-stone-900 truncate">{customerUser.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{customerUser.phone}</p>
                  </div>
                  <button
                    onClick={() => { setActiveView('customer_dashboard'); setShowCustomerMenu(false); }}
                    className="w-full px-3.5 py-2 text-left flex items-center gap-2 hover:bg-stone-50 text-stone-700"
                  >
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'ur' ? 'میری بکنگز و آرڈرز' : 'My Bookings'}</span>
                  </button>
                  <button
                    onClick={() => { logoutCustomer(); setShowCustomerMenu(false); }}
                    className="w-full px-3.5 py-2 text-left flex items-center gap-2 hover:bg-stone-50 text-rose-600 border-t border-stone-100"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{language === 'ur' ? 'لاگ آؤٹ' : 'Log Out'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsCustomerAuthModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 text-xs font-bold transition cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'ur' ? 'کسٹمر لاگ ان' : 'Log In'}</span>
            </button>
          )}

          {/* Become a Partner CTA */}
          <button
            onClick={() => setIsBecomeWorkerOpen(true)}
            className="hidden lg:inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
          >
            <span>{language === 'ur' ? 'ورکر بنیں اور کمائیں' : 'Become a Partner'}</span>
          </button>

          {/* Main Booking Action */}
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-all duration-150 cursor-pointer whitespace-nowrap active:scale-[0.98]"
          >
            <span>{language === 'ur' ? 'سروس بک کریں' : 'Book a Service'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-600 hover:text-stone-950 hover:bg-stone-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-5 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-medium text-stone-700">
            <button
              onClick={() => scrollToSection('services')}
              className="p-2 text-left rounded-lg bg-stone-50 hover:bg-stone-100"
            >
              {language === 'ur' ? 'خدمات (Services)' : 'Services'}
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="p-2 text-left rounded-lg bg-stone-50 hover:bg-stone-100"
            >
              {language === 'ur' ? 'طریقہ کار' : 'How It Works'}
            </button>
            <button
              onClick={() => scrollToSection('workers')}
              className="p-2 text-left rounded-lg bg-stone-50 hover:bg-stone-100"
            >
              {language === 'ur' ? 'تصدیق شدہ عملہ' : 'Verified Helpers'}
            </button>
            <button
              onClick={() => scrollToSection('cities')}
              className="p-2 text-left rounded-lg bg-stone-50 hover:bg-stone-100"
            >
              {language === 'ur' ? 'شہر' : 'Cities in Pakistan'}
            </button>
          </div>

          <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
            {customerUser ? (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">
                    {customerUser.avatar || 'CU'}
                  </div>
                  <div>
                    <div className="font-bold text-stone-900">{customerUser.name}</div>
                    <div className="text-[10px] text-stone-500">{customerUser.phone}</div>
                  </div>
                </div>
                <button
                  onClick={() => { logoutCustomer(); setMobileMenuOpen(false); }}
                  className="px-2 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded"
                >
                  {language === 'ur' ? 'لاگ آؤٹ' : 'Log Out'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setIsCustomerAuthModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full py-2.5 px-3 text-xs font-bold text-center rounded-xl bg-emerald-700 text-white flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>{language === 'ur' ? 'کسٹمر لاگ ان / نیا اکاؤنٹ' : 'Customer Sign In / Register'}</span>
              </button>
            )}

            <button
              onClick={() => { setActiveView('customer_dashboard'); setMobileMenuOpen(false); }}
              className="w-full py-2 px-3 text-xs font-medium text-left rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-between"
            >
              <span>{language === 'ur' ? 'کسٹمر ڈیش بورڈ و لائیو ٹریکر' : 'Customer Dashboard & Live Orders'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => { setActiveView('worker_dashboard'); setMobileMenuOpen(false); }}
              className="w-full py-2 px-3 text-xs font-medium text-left rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 flex items-center justify-between"
            >
              <span>{language === 'ur' ? 'ورکر / پارٹنر ڈیش بورڈ' : 'KaamDo Partner / Worker App'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => { setIsBecomeWorkerOpen(true); setMobileMenuOpen(false); }}
              className="w-full py-2 px-3 text-xs font-medium text-center rounded-lg bg-emerald-50 text-emerald-800"
            >
              {language === 'ur' ? 'ورکر کے طور پر رجسٹر ہوں' : 'Register as KaamDo Artisan/Helper'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
