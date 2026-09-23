import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, Phone, Mail, MapPin, Lock, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { CITIES_DATA } from '../data/mockData';

export const CustomerAuthModal: React.FC = () => {
  const { 
    language, 
    isCustomerAuthModalOpen, 
    setIsCustomerAuthModalOpen, 
    loginCustomer, 
    registerCustomer,
    selectedCity 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginInput, setLoginInput] = useState('0300-1234567');
  const [loginPassword, setLoginPassword] = useState('kaamdo123');
  
  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCity, setRegCity] = useState(selectedCity || 'Lahore');
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCustomerAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginInput.trim()) {
      setErrorMsg(language === 'ur' ? 'براہ کرم فون نمبر یا ای میل درج کریں' : 'Please enter your phone number or email.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const res = loginCustomer(loginInput, loginPassword);
      if (res.success) {
        setIsCustomerAuthModalOpen(false);
      } else {
        setErrorMsg(res.error || 'Authentication failed');
      }
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regName.trim() || !regPhone.trim()) {
      setErrorMsg(language === 'ur' ? 'نام اور موبائل نمبر درکار ہیں' : 'Name and mobile number are required.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const res = registerCustomer({
        name: regName,
        phone: regPhone,
        email: regEmail,
        city: regCity,
        address: regAddress,
      });
      if (res.success) {
        setIsCustomerAuthModalOpen(false);
      } else {
        setErrorMsg(res.error || 'Registration failed');
      }
    }, 500);
  };

  const handleDemoLogin = () => {
    loginCustomer('0300-1234567');
    setIsCustomerAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Header with KaamDo branding */}
        <div className="bg-gradient-to-r from-emerald-900 to-stone-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={() => setIsCustomerAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-black text-sm">
              KD
            </div>
            <span className="font-bold text-lg tracking-tight">KaamDo</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-500/30">
              {language === 'ur' ? 'کسٹمر پورٹل' : 'Customer Account'}
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-white">
            {mode === 'login' 
              ? (language === 'ur' ? 'اپنے اکاؤنٹ میں داخل ہوں' : 'Welcome to KaamDo')
              : (language === 'ur' ? 'نیا کسٹمر اکاؤنٹ بنائیں' : 'Create Customer Account')}
          </h3>
          <p className="text-xs text-emerald-200/80 mt-1">
            {mode === 'login'
              ? (language === 'ur' ? 'بکنگ ٹریک کرنے اور ریٹنگ دینے کے لیے لاگ ان کریں' : 'Log in to track doorstep helpers, manage bookings & reviews.')
              : (language === 'ur' ? 'صرف چند سیکنڈ میں رجسٹر ہوں اور بااعتماد سروس حاصل کریں' : 'Register in 30 seconds for trusted doorstep services across Pakistan.')}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 mt-5 p-1 bg-white/10 backdrop-blur-sm rounded-xl">
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {language === 'ur' ? 'لاگ ان (Sign In)' : 'Sign In'}
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {language === 'ur' ? 'نیا اکاؤنٹ (Sign Up)' : 'Sign Up'}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {mode === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === 'ur' ? 'موبائل نمبر یا ای میل' : 'Pakistani Mobile Number or Email'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="0300-1234567 or email@domain.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white text-stone-900 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    {language === 'ur' ? 'پاس ورڈ' : 'Password / PIN'}
                  </label>
                  <span className="text-[10px] text-emerald-700 hover:underline cursor-pointer">
                    {language === 'ur' ? 'پاس ورڈ بھول گئے؟' : 'Forgot?'}
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white text-stone-900 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <span>{language === 'ur' ? 'تصدیق ہو رہی ہے...' : 'Verifying...'}</span>
                ) : (
                  <>
                    <span>{language === 'ur' ? 'KaamDo میں لاگ ان کریں' : 'Log In to KaamDo'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* 1-Click Demo Shortcut */}
              <div className="pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border border-emerald-200/80"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === 'ur' ? '⚡ فوری ٹیسٹ لاگ ان (بابر علی - لاہور)' : '⚡ Quick 1-Click Demo Login (Babar Ali)'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === 'ur' ? 'پورا نام' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Babar Ali / Ayesha Khan"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {language === 'ur' ? 'موبائل نمبر' : 'Mobile Number'}
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full pl-8 pr-2.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {language === 'ur' ? 'شہر' : 'City'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      className="w-full pl-8 pr-2 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white text-stone-900"
                    >
                      {CITIES_DATA.map((c) => (
                        <option key={c.nameEn} value={c.nameEn}>
                          {c.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === 'ur' ? 'ای میل (اختیاری)' : 'Email Address (Optional)'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === 'ur' ? 'گھر کا پتہ / سوسائٹی' : 'Home Address / Area'}
                </label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="e.g. House 42, Street 7, Sector Y, DHA"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === 'ur' ? 'پاس ورڈ بنائیں' : 'Create Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <span>{language === 'ur' ? 'اکاؤنٹ بن رہا ہے...' : 'Creating Account...'}</span>
                ) : (
                  <>
                    <span>{language === 'ur' ? 'KaamDo میں اکاؤنٹ رجسٹر کریں' : 'Register with KaamDo'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Trust badges footer */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-center gap-4 text-[10px] text-stone-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>NADRA Verified Community</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>JazzCash & Easypaisa</span>
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
