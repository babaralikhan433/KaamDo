import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, UserCheck, Award, Lock, CheckCircle2 } from 'lucide-react';

export const VerificationSection: React.FC = () => {
  const { language } = useApp();

  return (
    <section className="py-16 sm:py-20 bg-stone-900 text-white relative overflow-hidden">
      {/* Decorative subtle grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="sec-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <rect width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sec-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
            {language === 'ur' ? 'حفاظت سب سے پہلے' : 'Uncompromising Trust & Safety'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {language === 'ur' ? 'محفوظ، تصدیق شدہ اور پیشہ ور عملہ' : 'Safe, Verified & Professional'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-300">
            {language === 'ur'
              ? 'ہم آپ کے گھر کے سکون اور حفاظت کو اولین ترجیح دیتے ہیں۔ ہر کارکن کا مکمل ریکارڈ جانچا جاتا ہے۔'
              : 'Before any helper steps into your home, they complete our multi-layer Pakistani security protocol.'}
          </p>
        </div>

        {/* 3 Trust Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: ID Verified */}
          <div className="bg-stone-800/80 rounded-3xl p-6 border border-stone-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {language === 'ur' ? 'شناختی کارڈ سے تصدیق' : 'ID Verified'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {language === 'ur' 
                  ? 'ہر کارکن کا نادرا بائیو میٹرک کمپیوٹرائزڈ شناختی کارڈ اور مستقل رہائش کا مکمل ریکارڈ محفوظ کیا جاتا ہے۔'
                  : "Every professional's biometric NADRA CNIC is digitally validated and physical home address visited."}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-700/60 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>NADRA Biometric Check</span>
            </div>
          </div>

          {/* Card 2: Background Checked */}
          <div className="bg-stone-800/80 rounded-3xl p-6 border border-stone-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {language === 'ur' ? 'پولیس ریکارڈ جانچ' : 'Background Checked'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {language === 'ur'
                  ? 'پلیٹ فارم پر شمولیت سے قبل متعلقہ پولیس تھانے سے کریکٹر سرٹیفکیٹ اور سابقہ ملازمت کا ریکارڈ چیک ہوتا ہے۔'
                  : 'Safety-focused criminal record check and past employer reference clearance before joining.'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-700/60 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Police Record Clearance</span>
            </div>
          </div>

          {/* Card 3: Trained Professionals */}
          <div className="bg-stone-800/80 rounded-3xl p-6 border border-stone-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {language === 'ur' ? 'تربیت یافتہ افراد' : 'Trained Professionals'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {language === 'ur'
                  ? 'ورکرز کو گھریلو صفائی کے جدید اصولوں، جراثیم کش ادویات اور احترام پر مبنی شائستہ رویے کی تربیت دی جاتی ہے۔'
                  : 'Workers receive hands-on training in service quality, hygiene standards and respectful customer behavior.'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-700/60 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Etiquette & Hygiene Certified</span>
            </div>
          </div>

        </div>

        {/* Insurance Guarantee Footer Note */}
        <div className="mt-10 text-center text-xs text-stone-400 flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>PKR 50,000 KaamDo In-Home Accidental Damage Protection Policy included with all bookings.</span>
        </div>

      </div>
    </section>
  );
};
