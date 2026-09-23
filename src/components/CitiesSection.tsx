import React from 'react';
import { useApp } from '../context/AppContext';
import { CITIES_DATA } from '../data/mockData';
import { MapPin, CheckCircle, Clock } from 'lucide-react';

export const CitiesSection: React.FC = () => {
  const { language, selectedCity, setSelectedCity, setSelectedArea } = useApp();

  const handleSelectCity = (cityName: string, active: boolean, popularAreas: string[]) => {
    if (!active) return;
    setSelectedCity(cityName);
    if (popularAreas.length > 0) {
      setSelectedArea(popularAreas[0]);
    }
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="cities" className="py-16 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            {language === 'ur' ? 'قومی وسعت' : 'Nationwide Coverage'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {language === 'ur' ? 'پورے پاکستان میں دستیاب' : 'Available Across Pakistan'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-600">
            {language === 'ur' 
              ? 'لاہور، اسلام آباد، راولپنڈی، کراچی اور دیگر بڑے شہروں میں فوری سروس۔' 
              : 'Expanding rapidly to connect trustworthy local artisans with homes nationwide.'}
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CITIES_DATA.map((city) => {
            const isSelected = selectedCity.toLowerCase() === city.nameEn.toLowerCase();

            return (
              <div
                key={city.nameEn}
                onClick={() => handleSelectCity(city.nameEn, city.active, city.popularAreas)}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                  city.active
                    ? 'cursor-pointer hover:border-emerald-600 hover:shadow-md'
                    : 'opacity-70 cursor-not-allowed bg-stone-50 border-stone-200'
                } ${
                  isSelected && city.active
                    ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700 shadow-sm'
                    : 'border-stone-200 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <MapPin className={`w-4 h-4 ${city.active ? 'text-emerald-700' : 'text-stone-400'}`} />
                    
                    {city.active ? (
                      <span className="text-[10px] font-semibold text-emerald-800 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-stone-900 leading-tight">
                    {city.nameEn}
                  </h3>
                  <div className="text-xs text-stone-500 font-urdu mt-0.5">
                    {city.nameUr}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100 text-[11px] text-stone-500 line-clamp-1">
                  {city.popularAreas.slice(0, 2).join(', ')}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
