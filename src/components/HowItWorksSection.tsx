import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Calendar, Home, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const { language, setIsBookingModalOpen } = useApp();

  const steps = [
    {
      num: '01',
      icon: <Search className="w-6 h-6 text-emerald-700" />,
      titleEn: '1. Choose a Service',
      titleUr: '1. مطلوبہ سروس کا انتخاب',
      descEn: 'Select from 12+ home chores: deep cleaning, mopping, cooking, laundry, or electrician & handyman tasks.',
      descUr: 'صفائی، کھانا پکانے، برتن، استری یا کاریگر میں سے اپنی ضرورت کا انتخاب کریں۔',
    },
    {
      num: '02',
      icon: <Calendar className="w-6 h-6 text-emerald-700" />,
      titleEn: '2. Select Time & Duration',
      titleUr: '2. وقت اور دورانیہ چنیں',
      descEn: 'Request instant arrival in 25 minutes or schedule for later. Choose 1, 2, or 3+ hours based on your household workload.',
      descUr: 'فوری 25 منٹ کی آمد منتخب کریں یا اپنی سہولت کے مطابق وقت اور گھنٹے طے کریں۔',
    },
    {
      num: '03',
      icon: <Home className="w-6 h-6 text-emerald-700" />,
      titleEn: '3. Helper Arrives at Your Door',
      titleUr: '3. تصدیق شدہ کارکن کی آمد',
      descEn: 'A vetted KaamDo professional arrives with supplies. Relax while your house sparkles, then pay via JazzCash or Cash.',
      descUr: 'ورکر گھر پہنچ کر تسلی بخش کام کرے گا۔ کام کی تکمیل پر جاز کیش، ایزی پیسہ یا نقد ادا کریں۔',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
            {language === 'ur' ? 'آسان عمل' : 'Simple 3-Step Process'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {language === 'ur' ? 'کام دو کیسے کام کرتا ہے؟' : 'How KaamDo Works'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600">
            {language === 'ur'
              ? 'گھنٹوں انتظار کے بجائے صرف 3 کلکس میں تصدیق شدہ مددگار آپ کے دروازے پر۔'
              : 'Effortless on-demand booking designed for busy Pakistani households.'}
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div
              key={step.num}
              className="bg-white rounded-3xl p-7 border border-stone-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative"
            >
              <div>
                {/* Step Editorial Numbering */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-black text-stone-200 tabular-nums">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 mb-2">
                  {language === 'ur' ? step.titleUr : step.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {language === 'ur' ? step.descUr : step.descEn}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <span>{language === 'ur' ? 'آسان اور تیز رفتار' : 'Fast & Hassle-free'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-all cursor-pointer active:scale-95"
          >
            <span>{language === 'ur' ? 'ابھی بکنگ شروع کریں' : 'Start Booking Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
