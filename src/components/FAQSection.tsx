import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FAQS_DATA } from '../data/mockData';
import { ChevronDown } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { language } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            {language === 'ur' ? 'اکثر پوچھے جانے والے سوالات' : 'Help & Answers'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {language === 'ur' ? 'عام سوالات و جوابات' : 'Frequently Asked Questions'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-600">
            {language === 'ur'
              ? 'کام دو کی خدمات، ادائیگی اور تصدیق کے بارے میں سب کچھ جانیں۔'
              : 'Everything you need to know about booking verified home help in Pakistan.'}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS_DATA.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border border-stone-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full p-4 sm:p-5 text-left bg-stone-50/50 hover:bg-stone-50 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-stone-900">
                    {language === 'ur' ? faq.qUr : faq.qEn}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-emerald-700' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed bg-white border-t border-stone-100">
                    {language === 'ur' ? faq.aUr : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
