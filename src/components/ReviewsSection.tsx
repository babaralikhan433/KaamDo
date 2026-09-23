import React from 'react';
import { useApp } from '../context/AppContext';
import { REVIEWS_DATA } from '../data/mockData';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { language } = useApp();

  return (
    <section className="py-16 sm:py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            {language === 'ur' ? 'گاہکوں کا اعتماد' : 'Loved by Pakistani Homes'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {language === 'ur' ? 'ہمارے مطمئن کسٹمرز کی آراء' : 'What Our Customers Say'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-600">
            {language === 'ur'
              ? 'لاہور، اسلام آباد اور کراچی سے ہزاروں مطمئن خاندان روزانہ کام دو کا انتخاب کرتے ہیں۔'
              : 'Real feedback from busy homeowners, doctors, and professionals across Pakistan.'}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS_DATA.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm flex flex-col justify-between relative hover:border-emerald-500/50 hover:shadow-md transition-all"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Customer Info */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                  {rev.avatarText}
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                    <span>{rev.customerName}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  </div>
                  <div className="text-[11px] text-stone-500">{rev.city}</div>
                  <div className="text-[10px] text-emerald-800 font-semibold">{rev.serviceName}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
