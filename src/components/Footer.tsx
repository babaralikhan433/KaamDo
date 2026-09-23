import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, ShieldCheck, Heart, Lock, KeyRound } from 'lucide-react';

export const Footer: React.FC = () => {
  const { 
    language, 
    setIsBookingModalOpen, 
    setIsBecomeWorkerOpen, 
    setActiveView,
    isAdminRegistered,
    isAdminAuthenticated 
  } = useApp();

  const scrollToSection = (id: string) => {
    setActiveView('home');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-stone-950 text-white pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold text-xl">
                KD
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white">
                  KaamDo
                </span>
                <span className="text-xs text-emerald-400 font-urdu">
                  کام دو پاکستان
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              "Apne ghar ka kaam, ab chand clicks mein." Pakistan's premier on-demand household marketplace connecting families with trained, NADRA-verified cleaners, cooks, and artisans.
            </p>

            {/* Payment Partners */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                Supported Local Payment Methods
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-[11px] font-bold text-red-500">
                  JazzCash
                </span>
                <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-[11px] font-bold text-emerald-400">
                  Easypaisa
                </span>
                <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-[11px] font-semibold text-blue-400">
                  1Link / Cards
                </span>
                <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-[11px] font-medium text-stone-300">
                  Cash on Delivery
                </span>
              </div>
            </div>
          </div>

          {/* Column: Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-emerald-400 transition-colors">
                  Home Cleaning
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-emerald-400 transition-colors">
                  Sweeping & Mopping
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-emerald-400 transition-colors">
                  Kitchen Cleaning
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-emerald-400 transition-colors">
                  Home Cooking (Khansama)
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-emerald-400 transition-colors">
                  Laundry & Ironing
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-emerald-400 transition-colors">
                  Electrician & Handyman
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Platform & Partners */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 mb-4">
              Explore & Join
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => scrollToSection('how-it-works')} className="hover:text-emerald-400 transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => setIsBecomeWorkerOpen(true)} className="hover:text-emerald-400 transition-colors font-bold text-emerald-400">
                  Become a Worker / Partner
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('cities')} className="hover:text-emerald-400 transition-colors">
                  Available Cities
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('workers')} className="hover:text-emerald-400 transition-colors">
                  Verified Workers Directory
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('customer_dashboard')} className="hover:text-emerald-400 transition-colors">
                  Customer Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('worker_dashboard')} className="hover:text-emerald-400 transition-colors">
                  KaamDo Partner Portal
                </button>
              </li>
              <li className="pt-2 border-t border-stone-800">
                <button 
                  onClick={() => {
                    setActiveView('admin_panel');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-stone-300 font-semibold cursor-pointer group"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>
                    {isAdminRegistered 
                      ? (language === 'ur' ? 'ایڈمن لاگ ان پورٹل' : 'Admin Login Portal')
                      : (language === 'ur' ? 'ایڈمن سائن اپ (1 سلاٹ دستیاب)' : 'Admin Sign-Up (1 Slot Open)')}
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Contact & Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 mb-4">
              Contact & Emergency
            </h4>
            <ul className="space-y-3 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+92 (42) 111-KAAMDO</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@kaamdo.pk</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gulberg III, Lahore, Pakistan</span>
              </li>
              <li className="pt-2">
                <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-[11px] text-stone-300">
                  <div className="font-bold text-white mb-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>24/7 Home Safety Line</span>
                  </div>
                  Direct emergency response coordination.
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 KaamDo Technologies Pakistan Pvt. Ltd. All rights reserved.
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] flex-wrap justify-center sm:justify-end">
            <a href="#terms" className="hover:text-stone-400">Terms of Service</a>
            <span>·</span>
            <a href="#privacy" className="hover:text-stone-400">Privacy Policy</a>
            <span>·</span>
            <a href="#refund" className="hover:text-stone-400">Refund Guarantee</a>
            <span>·</span>
            <button 
              onClick={() => {
                setActiveView('admin_panel');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="text-stone-400 hover:text-emerald-400 font-semibold flex items-center gap-1 transition-colors cursor-pointer bg-stone-900/80 px-2 py-0.5 rounded border border-stone-800"
            >
              <Lock className="w-2.5 h-2.5 text-emerald-400" />
              <span>{isAdminRegistered ? 'Admin Login' : 'Admin Sign-up / Login (1 Slot)'}</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
