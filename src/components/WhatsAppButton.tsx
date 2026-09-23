import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { language } = useApp();
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = 'https://wa.me/923001234567?text=Assalam-o-Alaikum%20KaamDo!%20I%20want%20to%20inquire%20about%20booking%20a%20home%20service.';

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
      {/* Tooltip greeting */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-stone-900 text-white text-xs font-semibold px-3 py-2 rounded-2xl shadow-xl border border-stone-800 animate-in fade-in slide-in-from-left-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            {language === 'ur' ? '24/7 کام دو واٹس ایپ سپورٹ' : 'KaamDo 24/7 WhatsApp Support'}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-stone-400 hover:text-white ml-1 p-0.5"
            aria-label="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white cursor-pointer"
        aria-label="Chat on WhatsApp with KaamDo Support"
      >
        {/* Animated radar wave */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-ping opacity-75 pointer-events-none" />
        
        <MessageCircle className="w-7 h-7 relative z-10 fill-white/10" />

        {/* Live Badge */}
        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold text-[9px] shadow leading-none border border-white">
          24/7
        </span>
      </a>
    </div>
  );
};
