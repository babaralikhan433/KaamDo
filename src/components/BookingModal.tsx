import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Service, Worker, PaymentMethod } from '../types';
import { 
  X, 
  Check, 
  Clock, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Phone, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  DollarSign
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    language,
    isBookingModalOpen,
    setIsBookingModalOpen,
    preselectedServiceId,
    setPreselectedServiceId,
    preselectedWorkerId,
    setPreselectedWorkerId,
    services,
    workers,
    selectedCity,
    selectedArea,
    createBooking,
    setActiveView,
    systemPricing,
    customerUser,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(preselectedServiceId || 'home-cleaning');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(preselectedWorkerId || '');
  const [isInstant, setIsInstant] = useState<boolean>(true);
  const [scheduledDate, setScheduledDate] = useState<string>('2026-09-24');
  const [scheduledTime, setScheduledTime] = useState<string>('11:00 AM');
  const [durationHours, setDurationHours] = useState<number>(2);
  const [needsCleaningSupplies, setNeedsCleaningSupplies] = useState<boolean>(true);
  
  // Customer details
  const [customerName, setCustomerName] = useState<string>('Babar Ali');
  const [customerPhone, setCustomerPhone] = useState<string>('0302-8491204');
  const [customerAddress, setCustomerAddress] = useState<string>('House 42, Street 7, Sector Y, Phase 5');
  const [bookingCity, setBookingCity] = useState<string>(selectedCity);
  const [bookingArea, setBookingArea] = useState<string>(selectedArea);
  const [notes, setNotes] = useState<string>('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('jazzcash');
  const [jazzcashNumber, setJazzcashNumber] = useState<string>('0300-1234567');
  const [easypaisaNumber, setEasypaisaNumber] = useState<string>('0345-9876543');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentPinPrompt, setPaymentPinPrompt] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('••••');

  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
      const s = services.find(srv => srv.id === preselectedServiceId);
      if (s) setDurationHours(s.durationDefault || 2);
    }
    if (preselectedWorkerId) {
      setSelectedWorkerId(preselectedWorkerId);
    }
    if (customerUser) {
      if (customerUser.name) setCustomerName(customerUser.name);
      if (customerUser.phone) setCustomerPhone(customerUser.phone);
      if (customerUser.address) setCustomerAddress(customerUser.address);
      if (customerUser.city) setBookingCity(customerUser.city);
    }
  }, [preselectedServiceId, preselectedWorkerId, services, customerUser]);

  if (!isBookingModalOpen) return null;

  const currentService: Service = services.find(s => s.id === selectedServiceId) || services[0];
  const assignedWorker: Worker | undefined = selectedWorkerId 
    ? workers.find(w => w.id === selectedWorkerId) 
    : workers.find(w => w.isAvailable && (w.city.toLowerCase() === bookingCity.toLowerCase() || true)) || workers[0];

  // Pricing calculations
  const baseRate = currentService.basePricePkr;
  const suppliesFee = needsCleaningSupplies ? 150 : 0;
  const baseTotal = (baseRate * durationHours) + suppliesFee;
  const platformFee = systemPricing.platformFee;
  const discount = systemPricing.discountPkr;
  const finalTotal = Math.max(200, baseTotal + platformFee - discount);

  const handleNextStep = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as any);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as any);
    }
  };

  const handleCompleteBooking = () => {
    // If digital wallet, show authentic PIN/USSD confirmation simulation
    if (paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') {
      setIsProcessingPayment(true);
      setTimeout(() => {
        setIsProcessingPayment(false);
        setPaymentPinPrompt(true);
      }, 900);
      return;
    }

    finalizeBookingOrder();
  };

  const finalizeBookingOrder = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentPinPrompt(false);

      const newId = createBooking({
        customerName: customerName.trim() || 'Pakistani Customer',
        customerPhone: customerPhone.trim() || '0300-0000000',
        customerAddress: customerAddress.trim() || 'DHA Lahore',
        city: bookingCity,
        area: bookingArea,
        serviceId: currentService.id,
        serviceName: currentService.nameEn,
        serviceNameUr: currentService.nameUr,
        workerId: assignedWorker?.id || 'w-1',
        workerName: assignedWorker?.name || 'Assigned Partner',
        workerPhoto: assignedWorker?.photo,
        workerPhone: assignedWorker?.phone || '0300-1122334',
        date: isInstant ? 'Today (Instant)' : scheduledDate,
        time: isInstant ? 'In 25-35 mins' : scheduledTime,
        isInstant,
        durationHours,
        basePricePkr: baseTotal,
        platformFeePkr: platformFee,
        totalPkr: finalTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'completed',
        bookingStatus: 'assigned',
        notes,
        etaMinutes: isInstant ? 28 : undefined,
      });

      setIsBookingModalOpen(false);
      setPreselectedServiceId(null);
      setPreselectedWorkerId(null);
      setStep(1);
      setActiveView('customer_dashboard');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-sm">
              KD
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                {language === 'ur' ? 'گھریلو سروس بکنگ' : 'Book a Verified Home Service'}
              </h3>
              <p className="text-[11px] text-stone-400">
                Step {step} of 4 · {step === 1 && (language === 'ur' ? 'سروس کا انتخاب' : 'Select Service')}
                {step === 2 && (language === 'ur' ? 'تاریخ و وقت' : 'Date & Schedule')}
                {step === 3 && (language === 'ur' ? 'دورانیہ اور پتہ' : 'Duration & Address')}
                {step === 4 && (language === 'ur' ? 'ادائیگی اور تصدیق' : 'Confirm & Pay')}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsBookingModalOpen(false);
              setStep(1);
            }}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-4 bg-stone-100 border-b border-stone-200 text-center text-xs font-semibold">
          {[
            { num: 1, label: language === 'ur' ? 'سروس' : '1. Service' },
            { num: 2, label: language === 'ur' ? 'وقت' : '2. Schedule' },
            { num: 3, label: language === 'ur' ? 'پتہ' : '3. Location' },
            { num: 4, label: language === 'ur' ? 'ادائیگی' : '4. Payment' },
          ].map((s) => (
            <div
              key={s.num}
              className={`py-2 px-1 border-r last:border-r-0 border-stone-200 transition-colors ${
                step === s.num
                  ? 'bg-emerald-50 text-emerald-800 border-b-2 border-b-emerald-700'
                  : step > s.num
                  ? 'text-emerald-700 font-bold'
                  : 'text-stone-400'
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          
          {/* STEP 1: Select Service & Options */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  {language === 'ur' ? 'مطلوبہ سروس منتخب کریں' : 'Choose Service'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto p-1">
                  {services.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => {
                        setSelectedServiceId(srv.id);
                        setDurationHours(srv.durationDefault || 2);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        selectedServiceId === srv.id
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-600 shadow-sm'
                          : 'border-stone-200 bg-white hover:border-stone-300 text-stone-800'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold leading-tight">
                          {language === 'ur' ? srv.nameUr : srv.nameEn}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          Rs. {srv.basePricePkr}/hr
                        </div>
                      </div>
                      {selectedServiceId === srv.id && (
                        <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Add-ons */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="text-xs font-bold text-stone-900">
                  {language === 'ur' ? 'اضافی سہولتیں (Add-ons)' : 'Service Add-ons'}
                </div>
                <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer pt-1">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={needsCleaningSupplies}
                      onChange={(e) => setNeedsCleaningSupplies(e.target.checked)}
                      className="rounded text-emerald-700 focus:ring-emerald-600"
                    />
                    <span>
                      {language === 'ur' 
                        ? 'مددگار صفائی کا سامان اور فینائل/ڈٹرجنٹ ساتھ لائے' 
                        : 'Helper brings cleaning materials, phenyl & detergents'}
                    </span>
                  </span>
                  <span className="font-semibold text-stone-900 tabular-nums">+Rs. 150</span>
                </label>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ur' ? 'خصوصی ہدایات (اختیاری)' : 'Special Instructions (Optional)'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please focus on kitchen deep clean and balcony floor"
                  className="w-full px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Choose Date & Time */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                  {language === 'ur' ? 'آمد کا طریقہ منتخب کریں' : 'Select Arrival Preference'}
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Instant Option */}
                  <div
                    onClick={() => setIsInstant(true)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      isInstant
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-emerald-700 fill-emerald-700" />
                      </div>
                      {isInstant && <Check className="w-4 h-4 text-emerald-700 font-bold" />}
                    </div>
                    <div className="text-sm font-bold text-stone-900">
                      {language === 'ur' ? 'فوری آمد (Instant 25 Mins)' : 'Instant Dispatch'}
                    </div>
                    <p className="text-xs text-stone-600 mt-1">
                      {language === 'ur' 
                        ? 'قریبی تصدیق شدہ ورکر 25 تا 35 منٹ میں آپ کے گھر پہنچے گا۔' 
                        : 'Worker dispatches right now and arrives in 25–35 minutes.'}
                    </p>
                  </div>

                  {/* Scheduled Option */}
                  <div
                    onClick={() => setIsInstant(false)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      !isInstant
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                        <Calendar className="w-4 h-4" />
                      </div>
                      {!isInstant && <Check className="w-4 h-4 text-emerald-700 font-bold" />}
                    </div>
                    <div className="text-sm font-bold text-stone-900">
                      {language === 'ur' ? 'شیڈول کریں (بعد کے لیے)' : 'Schedule for Later'}
                    </div>
                    <p className="text-xs text-stone-600 mt-1">
                      {language === 'ur'
                        ? 'اپنی مرضی کی تاریخ اور وقت پر ورکر بک کریں۔'
                        : 'Pick your preferred date and time slot in advance.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule Selectors (if not instant) */}
              {!isInstant && (
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        {language === 'ur' ? 'تاریخ' : 'Date'}
                      </label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        {language === 'ur' ? 'وقت کا سلاٹ' : 'Time Slot'}
                      </label>
                      <select
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                      >
                        <option value="09:00 AM">09:00 AM (Morning)</option>
                        <option value="11:00 AM">11:00 AM (Late Morning)</option>
                        <option value="02:00 PM">02:00 PM (Afternoon)</option>
                        <option value="04:30 PM">04:30 PM (Evening)</option>
                        <option value="07:00 PM">07:00 PM (Night)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Duration & Address */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Duration Buttons */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  {language === 'ur' ? 'کام کا دورانیہ منتخب کریں' : 'Choose Duration (Hours)'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((hrs) => (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => setDurationHours(hrs)}
                      className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                        durationHours === hrs
                          ? 'border-emerald-600 bg-emerald-700 text-white font-bold shadow-sm'
                          : 'border-stone-200 bg-white text-stone-800 hover:border-stone-300 font-semibold'
                      }`}
                    >
                      <div className="text-sm">{hrs} {hrs === 1 ? 'Hour' : 'Hours'}</div>
                      <div className={`text-[10px] mt-0.5 ${durationHours === hrs ? 'text-emerald-100' : 'text-stone-500'}`}>
                        Rs. {hrs * currentService.basePricePkr}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Contact & Address */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'ur' ? 'آپ کا نام' : 'Your Full Name'}
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'ur' ? 'فون نمبر (برائے تصدیق)' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'ur' ? 'شہر' : 'City'}
                    </label>
                    <input
                      type="text"
                      value={bookingCity}
                      onChange={(e) => setBookingCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none font-semibold text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'ur' ? 'علاقہ / سیکٹر' : 'Area / Sector'}
                    </label>
                    <input
                      type="text"
                      value={bookingArea}
                      onChange={(e) => setBookingArea(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'ur' ? 'مکمل گھریلو پتہ (مکان، گلی، بلاک)' : 'Full Home Address (House #, Street, Block)'}
                  </label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="e.g. House 42, Street 7, Sector Y, DHA Phase 5"
                    className="w-full px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Confirm Booking & Payment */}
          {step === 4 && (
            <div className="space-y-5">
              
              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <div className="text-xs font-bold text-stone-900">
                      {language === 'ur' ? currentService.nameUr : currentService.nameEn}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {durationHours} {durationHours === 1 ? 'Hour' : 'Hours'} · {isInstant ? 'Instant Dispatch' : `${scheduledDate} at ${scheduledTime}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-800">
                      {bookingCity}
                    </span>
                    <div className="text-[10px] text-stone-500">{bookingArea}</div>
                  </div>
                </div>

                {/* Assigned Worker Preview */}
                {assignedWorker && (
                  <div className="flex items-center gap-3 py-1">
                    <img
                      src={assignedWorker.photo}
                      alt={assignedWorker.name}
                      className="w-9 h-9 rounded-full object-cover border border-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <span>{assignedWorker.name}</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1 rounded">NADRA Verified</span>
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {assignedWorker.rating} ★ ({assignedWorker.completedJobs} jobs completed)
                      </div>
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-1.5 pt-2 border-t border-stone-200 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Base Hourly ({durationHours} hrs × Rs. {currentService.basePricePkr})</span>
                    <span className="tabular-nums">Rs. {durationHours * currentService.basePricePkr}</span>
                  </div>
                  {needsCleaningSupplies && (
                    <div className="flex justify-between">
                      <span>Cleaning Supplies & Chemicals</span>
                      <span className="tabular-nums">Rs. {suppliesFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Platform Insurance & Safety Fee</span>
                    <span className="tabular-nums">Rs. {platformFee}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>First Booking Promotion</span>
                    <span className="tabular-nums">-Rs. {discount}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-extrabold text-stone-900">
                    <span>Total Payable (PKR)</span>
                    <span className="tabular-nums text-emerald-800 text-base">Rs. {finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  {language === 'ur' ? 'ادائیگی کا طریقہ منتخب کریں' : 'Select Payment Method'}
                </label>
                
                <div className="grid grid-cols-2 gap-2.5">
                  {/* JazzCash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('jazzcash')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'jazzcash'
                        ? 'border-red-600 bg-red-50/60 ring-1 ring-red-600 text-stone-900 font-bold'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-red-600 text-white font-bold text-[10px] flex items-center justify-center">
                        JC
                      </div>
                      <span className="text-xs">JazzCash</span>
                    </div>
                    {paymentMethod === 'jazzcash' && <Check className="w-3.5 h-3.5 text-red-600" />}
                  </button>

                  {/* Easypaisa */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('easypaisa')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'easypaisa'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600 text-stone-900 font-bold'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                        EP
                      </div>
                      <span className="text-xs">Easypaisa</span>
                    </div>
                    {paymentMethod === 'easypaisa' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>

                  {/* Debit / Credit Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600 text-stone-900 font-bold'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="text-xs">Card / 1Link</span>
                    </div>
                    {paymentMethod === 'card' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>

                  {/* Cash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'cash'
                        ? 'border-stone-800 bg-stone-100 ring-1 ring-stone-800 text-stone-900 font-bold'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-stone-700" />
                      <span className="text-xs">Cash After Work</span>
                    </div>
                    {paymentMethod === 'cash' && <Check className="w-3.5 h-3.5 text-stone-800" />}
                  </button>
                </div>

                {/* Wallet Details Input if JazzCash or Easypaisa */}
                {paymentMethod === 'jazzcash' && (
                  <div className="mt-3 p-3 bg-red-50/50 rounded-xl border border-red-200 text-xs">
                    <label className="block text-[11px] font-bold text-red-900 mb-1">
                      JazzCash Mobile Account Number
                    </label>
                    <input
                      type="tel"
                      value={jazzcashNumber}
                      onChange={(e) => setJazzcashNumber(e.target.value)}
                      placeholder="0300-XXXXXXX"
                      className="w-full px-3 py-1.5 bg-white rounded border border-red-300 text-xs font-semibold focus:outline-none"
                    />
                    <p className="text-[10px] text-red-700 mt-1">
                      *You will receive an instant USSD popup or mobile app prompt to authorize payment of Rs. {finalTotal}.
                    </p>
                  </div>
                )}

                {paymentMethod === 'easypaisa' && (
                  <div className="mt-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs">
                    <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                      Easypaisa Mobile Account Number
                    </label>
                    <input
                      type="tel"
                      value={easypaisaNumber}
                      onChange={(e) => setEasypaisaNumber(e.target.value)}
                      placeholder="0345-XXXXXXX"
                      className="w-full px-3 py-1.5 bg-white rounded border border-emerald-300 text-xs font-semibold focus:outline-none"
                    />
                    <p className="text-[10px] text-emerald-700 mt-1">
                      *Please approve the push notification request in your Easypaisa App.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions Footer */}
        <div className="px-6 py-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handlePrevStep}
              className="px-4 py-2 text-xs font-bold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'ur' ? 'پیچھے' : 'Back'}</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>{language === 'ur' ? 'آگے بڑھیں' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleCompleteBooking}
              disabled={isProcessingPayment}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'ur' ? 'ادائیگی پراسیس ہو رہی ہے...' : 'Processing Payment...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>
                    {language === 'ur' 
                      ? `بکنگ کی تصدیق کریں (Rs. ${finalTotal})` 
                      : `Confirm & Pay (Rs. ${finalTotal})`}
                  </span>
                </>
              )}
            </button>
          )}
        </div>

      </div>

      {/* JazzCash / Easypaisa Simulated Instant Verification Modal */}
      {paymentPinPrompt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95">
            <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 ${
              paymentMethod === 'jazzcash' ? 'bg-red-600' : 'bg-emerald-600'
            }`}>
              {paymentMethod === 'jazzcash' ? 'JC' : 'EP'}
            </div>

            <h4 className="text-sm font-bold text-stone-900">
              {paymentMethod === 'jazzcash' ? 'JazzCash USSD Authorization' : 'Easypaisa Mobile Prompt'}
            </h4>

            <p className="text-xs text-stone-600 mt-1">
              Authorizing payment of <strong className="text-stone-900">Rs. {finalTotal}</strong> to KaamDo Pakistan.
            </p>

            <div className="my-4 p-3 bg-stone-100 rounded-xl">
              <label className="block text-[11px] font-bold text-stone-500 mb-1">
                Enter 4-Digit MPIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                className="w-32 mx-auto text-center tracking-widest text-lg font-mono font-bold py-1 bg-white border border-stone-300 rounded"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPaymentPinPrompt(false)}
                className="flex-1 py-2 text-xs font-semibold text-stone-600 bg-stone-100 rounded-lg hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                onClick={finalizeBookingOrder}
                className="flex-1 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow"
              >
                Approve & Pay
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
