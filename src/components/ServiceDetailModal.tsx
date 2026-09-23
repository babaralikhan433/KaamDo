import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Check, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  MessageCircle,
  AlertCircle
} from 'lucide-react';

export const ServiceDetailModal: React.FC = () => {
  const { 
    language, 
    selectedServiceForDetail, 
    setSelectedServiceForDetail, 
    setPreselectedServiceId, 
    setIsBookingModalOpen,
    selectedCity 
  } = useApp();

  if (!selectedServiceForDetail) return null;

  const service = selectedServiceForDetail;

  const handleBookNow = () => {
    setPreselectedServiceId(service.id);
    setSelectedServiceForDetail(null);
    setIsBookingModalOpen(true);
  };

  const getInclusions = () => {
    switch (service.category) {
      case 'cleaning':
        return [
          language === 'ur' ? 'نادرا اور پولیس سے تصدیق شدہ تجربہ کار صفائی عملہ' : 'NADRA and police-cleared certified cleaning partner',
          language === 'ur' ? 'بنیادی صفائی کا سامان، موپ، وائپر اور فینائل' : 'Standard mop, floor wipers, microfibers & basic detergent',
          language === 'ur' ? 'کمروں، کچن اور باتھ رومز کی تسلی بخش گہری صفائی' : 'Deep scrubbing of floors, baseboards, and sanitary fittings',
          language === 'ur' ? '50,000 روپے تک حادثاتی ڈیمیج انشورنس تحفظ' : 'In-home accidental damage protection up to PKR 50,000',
        ];
      case 'kitchen':
        return [
          language === 'ur' ? 'ماہر دیسی و کانٹی نینٹل کھانا بنانے والے خانساماں' : 'Expert cook for Pakistani breakfast, lunch, or dinner spreads',
          language === 'ur' ? 'حفظان صحت کے اصولوں پر پورا اترنے والے صاف ستھرے برتن' : 'Hygienic prep, vegetable cutting, and kitchen stovetop wipe-down',
          language === 'ur' ? 'روٹی، سالن، چاول اور خصوصی ڈشز' : 'Fresh rotis, daal, karahi, biryani, or customized diet meals',
          language === 'ur' ? 'کھانا پکانے کے بعد چولہے اور سلیب کی صفائی' : 'Post-cooking counter sanitization and dish organization',
        ];
      case 'artisan':
        return [
          language === 'ur' ? 'مکمل اوزار کٹ کے ساتھ ماہر پلمبر / الیکٹریشن / مستری' : 'Fully equipped artisan with professional diagnostic tools',
          language === 'ur' ? 'خرابی کا فوری معائنہ اور مناسب حل' : 'Root-cause troubleshooting before beginning physical repair',
          language === 'ur' ? 'صرف تصدیق شدہ معیاری اسپیئر پارٹس کا استعمال' : 'Genuine parts procurement support if replacement needed',
          language === 'ur' ? 'کام کی 7 دن کی بعد از سروس وارنٹی' : '7-Day KaamDo workmanship assurance on all artisan tasks',
        ];
      default:
        return [
          language === 'ur' ? 'نادرا بائیو میٹرک تصدیق شدہ بااخلاق کارکن' : 'Background-verified, punctual and respectful professional',
          language === 'ur' ? '25 سے 40 منٹ میں آپ کے دروازے پر آمد' : 'Instant arrival within 25-40 minutes across major cities',
          language === 'ur' ? 'مناسب فی گھنٹہ چارجز، کوئی پوشیدہ اخراجات نہیں' : 'Transparent hourly rate in PKR, zero hidden charges',
          language === 'ur' ? 'جاز کیش، ایزی پیسہ یا کام کے بعد نقد ادائیگی' : 'JazzCash, Easypaisa, or Cash on delivery payment',
        ];
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Hero image and close button */}
        <div className="relative h-56 sm:h-64 w-full bg-stone-900 overflow-hidden">
          {service.image ? (
            <img
              src={service.image}
              alt={service.nameEn}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-emerald-950 text-emerald-300">
              <Sparkles className="w-16 h-16" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setSelectedServiceForDetail(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/80 text-white hover:bg-stone-900 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on Hero */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow flex items-center gap-1">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>KaamDo Verified</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-stone-900/80 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              {selectedCity}
            </span>
          </div>

          {/* Title on Hero */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="text-xs font-semibold text-emerald-300 font-urdu mb-0.5">
              {service.nameUr}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {service.nameEn}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Pricing Highlight Banner in PKR */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                {language === 'ur' ? 'سروس چارجز (پاکستانی روپے)' : 'Service Rate (PKR)'}
              </span>
              <div className="text-2xl font-black text-stone-900">
                Rs. {service.basePricePkr.toLocaleString()}{' '}
                <span className="text-xs font-normal text-stone-600">
                  {language === 'ur' ? '/ گھنٹہ' : '/ hour'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {language === 'ur' ? 'تجویز کردہ وقت:' : 'Standard duration:'} {service.durationDefault || 2} hours
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>{language === 'ur' ? 'فوری آمد: 25-40 منٹ' : 'Instant arrival: 25-40 mins'}</span>
            </div>
          </div>

          {/* Full Descriptions (Dual-Language) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {language === 'ur' ? 'تفصیل و تفصیلات' : 'Service Description'}
            </h4>
            <p className="text-sm text-stone-800 leading-relaxed">
              {service.descriptionEn}
            </p>
            <p className="text-sm text-stone-700 leading-relaxed font-urdu text-right pt-1">
              {service.descriptionUr}
            </p>
          </div>

          {/* What's Included */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{language === 'ur' ? 'اس سروس میں کیا شامل ہے؟' : "What's Included in this KaamDo Service"}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {getInclusions().map((inc, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* KaamDo Peace of Mind Guarantee */}
          <div className="p-4 rounded-2xl bg-stone-900 text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-white">
                {language === 'ur' ? '100% تسلی بخش گارنٹی یا رقم کی واپسی' : 'KaamDo 100% Satisfaction or Free Replacement'}
              </div>
              <div className="text-stone-300 mt-0.5">
                {language === 'ur'
                  ? 'اگر آپ کام سے مطمئن نہ ہوں تو فوراً سپورٹ پر کال کریں۔ آپ کا مسئلہ 1 گھنٹے کے اندر حل کیا جائے گا۔'
                  : 'If our worker does not meet your expectations, we re-dispatch a replacement or issue a refund immediately.'}
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={`https://wa.me/923001234567?text=Assalam-o-Alaikum%20KaamDo!%20I%20want%20to%20inquire%20about%20${encodeURIComponent(service.nameEn)}%20service.`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>{language === 'ur' ? 'واٹس ایپ پر پوچھیں' : 'WhatsApp Inquiry'}</span>
          </a>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <button
              onClick={() => setSelectedServiceForDetail(null)}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-200 text-xs font-semibold transition cursor-pointer"
            >
              {language === 'ur' ? 'بند کریں' : 'Cancel'}
            </button>

            <button
              onClick={handleBookNow}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'ur' ? 'ابھی بک کریں' : 'Book with KaamDo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
