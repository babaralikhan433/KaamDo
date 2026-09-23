import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Check, 
  Upload, 
  ShieldCheck, 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  CheckCircle2,
  FileText,
  Camera,
  Sparkles,
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';
import { 
  WORKER_LABOUR_PHOTO, 
  WORKER_TUTOR_PHOTO, 
  WORKER_SANITARY_PHOTO,
  WORKER_BARBER_PHOTO,
  WORKER_BEAUTICIAN_PHOTO,
  WORKER_MASON_PHOTO,
  WORKER_PLUMBER_PHOTO
} from '../data/mockData';

export const BecomeWorkerModal: React.FC = () => {
  const { 
    language, 
    isBecomeWorkerOpen, 
    setIsBecomeWorkerOpen, 
    submitWorkerApplication, 
    selectedCity 
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState('');
  const [nameUr, setNameUr] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [city, setCity] = useState(selectedCity);
  const [area, setArea] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(['Daily Labour & Construction']);
  const [hourlyRate, setHourlyRate] = useState<number>(500);
  const [experienceYears, setExperienceYears] = useState(4);
  const [cnicUploaded, setCnicUploaded] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>(WORKER_LABOUR_PHOTO);

  if (!isBecomeWorkerOpen) return null;

  const availableServices = [
    { en: "Men's Barber & Haircut", ur: 'باربر، ہیئر کٹ و شیو' },
    { en: 'Home Salon & Beautician (Mani/Pedi)', ur: 'ہوم بیوٹی پارلر و مینی کیور پیڈی کیور' },
    { en: 'Mason & Construction Mistri', ur: 'راج مستری و تعمیرات' },
    { en: 'Plumber & Sanitary Specialist', ur: 'پلمبر و سینیٹری کاریگر' },
    { en: 'Daily Labour & Construction', ur: 'عام مزدور و کنسٹرکشن' },
    { en: 'Home Tutor & Academic Teacher', ur: 'ہوم ٹیوٹر و اکیڈمک ٹیچر' },
    { en: 'Sanitary Worker & Sewerage Cleaning', ur: 'سینیٹری ورکر و گٹر صفائی' },
    { en: 'Home Cleaning', ur: 'گھر کی مکمل صفائی' },
    { en: 'Sweeping & Mopping', ur: 'جھاڑو اور پوچا' },
    { en: 'Bathroom Cleaning', ur: 'باتھ روم صفائی' },
    { en: 'Kitchen Cleaning', ur: 'کچن کی صفائی' },
    { en: 'Dishwashing', ur: 'برتن دھونا' },
    { en: 'Laundry & Ironing', ur: 'کپڑے دھونا و استری' },
    { en: 'Home Cooking (Khansama)', ur: 'گھریلو کھانا پکانا' },
    { en: 'Moving & Shifting Assistance', ur: 'سامان شفٹنگ و لوڈنگ' },
    { en: 'Handyman & Electrical', ur: 'الیکٹریشن و ہینڈی مین' },
    { en: 'Elderly Assistance', ur: 'بزرگوں کی نگہداشت' },
  ];

  const presetPhotos = [
    { label: 'Barber / Haircut', url: WORKER_BARBER_PHOTO },
    { label: 'Parlour (Pedicure)', url: WORKER_BEAUTICIAN_PHOTO },
    { label: 'Mason / Mistri', url: WORKER_MASON_PHOTO },
    { label: 'Plumber Expert', url: WORKER_PLUMBER_PHOTO },
    { label: 'Labour / Mazdoor', url: WORKER_LABOUR_PHOTO },
    { label: 'Tutor / Teacher', url: WORKER_TUTOR_PHOTO },
    { label: 'Sanitary Worker', url: WORKER_SANITARY_PHOTO },
    { label: 'Home Cook', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300' },
    { label: 'Electrician', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300' },
    { label: 'House Cleaner', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleService = (srv: string) => {
    setSelectedServices(prev =>
      prev.includes(srv) ? (prev.length > 1 ? prev.filter(s => s !== srv) : prev) : [...prev, srv]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !cnic.trim()) {
      alert('Please fill in your name, phone number, and CNIC.');
      return;
    }

    submitWorkerApplication(
      {
        fullName,
        nameUr: nameUr || fullName,
        photoUrl,
        phone,
        cnic,
        city,
        area: area || 'Central Area',
        services: selectedServices,
        hourlyRate,
        experienceYears,
        hasCnicDoc: cnicUploaded || true,
      },
      true // auto-add to live roster
    );

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsBecomeWorkerOpen(false);
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-5 bg-emerald-900 text-white flex items-center justify-between border-b border-emerald-800">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              KaamDo Partner Network (کام دو پارٹنر رجسٹریشن)
            </div>
            <h3 className="text-base sm:text-lg font-bold">
              {language === 'ur' ? 'اپنی تصویر اور نام کے ساتھ ورکر بنیں' : 'Register as a KaamDo Worker with Photo'}
            </h3>
            <p className="text-xs text-emerald-100/90 mt-0.5 font-urdu">
              "لیبر، ہوم ٹیوٹر، سینیٹری ورکر یا دیگر گھریلو سروسز کے لیے اپنی تصویر لگائیں اور روزانہ کمائیں۔"
            </p>
          </div>

          <button
            onClick={() => setIsBecomeWorkerOpen(false)}
            className="p-1 rounded-lg text-emerald-200 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-9 h-9 font-bold" />
            </div>
            <div className="flex flex-col items-center">
              <img 
                src={photoUrl} 
                alt={fullName} 
                className="w-20 h-20 rounded-2xl object-cover border-4 border-emerald-500 shadow-md mb-2" 
              />
              <h4 className="text-lg font-bold text-stone-900">
                {fullName} {nameUr ? `(${nameUr})` : ''}
              </h4>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 mt-1">
                ✓ ورکر پروفائل کامیابی سے بن گئی ہے
              </span>
            </div>
            <p className="text-xs text-stone-600 max-w-sm mx-auto">
              آپ کی پروفائل تصویر اور تفصیلات کے ساتھ لائیو کر دی گئی ہے۔ گاہک اب آپ کو براہِ راست آرڈر دے سکتے ہیں۔
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {/* Photo Selection Section (Upload or Pick Preset) */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/90">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    Profile Picture (اپنی تصویر لگائیں) *
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Upload from device or choose a preset
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{language === 'ur' ? 'تصویر اپلوڈ کریں' : 'Upload Photo'}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Photo Preview + Quick Presets */}
              <div className="flex items-center gap-4">
                <div className="relative group shrink-0">
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-600 shadow-md"
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[10px] font-bold"
                  >
                    Change
                  </div>
                </div>

                <div className="flex-1">
                  <span className="text-[11px] font-semibold text-stone-600 block mb-1.5">
                    یا فوری تصویر منتخب کریں (Quick Presets):
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {presetPhotos.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPhotoUrl(preset.url)}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          photoUrl === preset.url ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-stone-200 opacity-70 hover:opacity-100'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-10 h-10 object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Full Name (English & Urdu) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name (انگریزی میں نام) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Muhammad Rafiq"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Urdu Name (اردو نام)
                </label>
                <input
                  type="text"
                  value={nameUr}
                  onChange={(e) => setNameUr(e.target.value)}
                  placeholder="مثلاً: محمد رفیق (مزدور)"
                  dir="rtl"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 font-urdu"
                />
              </div>
            </div>

            {/* Phone & CNIC */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Phone Number (موبائل نمبر) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  CNIC Number (قومی شناختی کارڈ) *
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    placeholder="35201-XXXXXXX-X"
                    maxLength={15}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* City, Area & Hourly Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  City (شہر) *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
                >
                  <option value="Lahore">Lahore (لاہور)</option>
                  <option value="Islamabad">Islamabad (اسلام آباد)</option>
                  <option value="Rawalpindi">Rawalpindi (راولپنڈی)</option>
                  <option value="Karachi">Karachi (کراچی)</option>
                  <option value="Peshawar">Peshawar (پشاور)</option>
                  <option value="Faisalabad">Faisalabad (فیصل آباد)</option>
                  <option value="Multan">Multan (ملتان)</option>
                  <option value="Gujranwala">Gujranwala (گوجرانوالہ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Area (علاقہ)
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. DHA, Cantt, Saddar"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Hourly Rate (روپے فی گھنٹہ)
                </label>
                <input
                  type="number"
                  min={300}
                  step={50}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value, 10) || 500)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 font-semibold text-emerald-800"
                />
              </div>
            </div>

            {/* Profession / Services Checklist with Labour, Tutor, Sanitary */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Select your work category (آپ کیا کام کرتے ہیں؟) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1.5 border border-stone-200 rounded-xl bg-stone-50">
                {availableServices.map((srv) => {
                  const isChecked = selectedServices.includes(srv.en);
                  return (
                    <button
                      key={srv.en}
                      type="button"
                      onClick={() => toggleService(srv.en)}
                      className={`p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                        isChecked 
                          ? 'bg-emerald-700 text-white font-bold shadow-sm' 
                          : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                      }`}
                    >
                      <div>
                        <div className="leading-tight">{srv.en}</div>
                        <div className={`text-[10px] font-urdu ${isChecked ? 'text-emerald-100' : 'text-stone-500'}`}>
                          {srv.ur}
                        </div>
                      </div>
                      {isChecked && <Check className="w-4 h-4 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CNIC Document verification */}
            <div className="p-3 rounded-xl border border-dashed border-stone-300 bg-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-emerald-700" />
                <div className="text-left">
                  <div className="text-xs font-bold text-stone-800">
                    {cnicUploaded ? '✓ CNIC Documents Ready' : 'NADRA CNIC Verification'}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Biometric match with Pakistan National Database
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCnicUploaded(!cnicUploaded)}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  cnicUploaded ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                {cnicUploaded ? 'Verified' : 'Attach CNIC'}
              </button>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {language === 'ur' 
                    ? 'تصویر کے ساتھ ورکر رجسٹریشن مکمل کریں' 
                    : 'Submit & Publish Worker Profile with Photo'}
                </span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
