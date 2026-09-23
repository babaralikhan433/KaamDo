import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  XCircle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Star, 
  Send,
  AlertTriangle,
  User,
  ShieldCheck
} from 'lucide-react';

interface ActiveBookingTrackerProps {
  bookingId?: string;
}

export const ActiveBookingTracker: React.FC<ActiveBookingTrackerProps> = ({ bookingId }) => {
  const { 
    bookings, 
    activeBookingId, 
    cancelBooking, 
    updateBookingStatus, 
    submitRating,
    language 
  } = useApp();

  const currentId = bookingId || activeBookingId;
  const booking = bookings.find(b => b.id === currentId);

  // Live Timer Simulation
  const [secondsElapsed, setSecondsElapsed] = useState(482);
  const [isCalling, setIsCalling] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'worker', text: 'Assalam-o-Alaikum! I have picked up the service tools and disinfectant. On my way to your address.', time: '10:50 AM' },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  
  // Rating State
  const [userRating, setUserRating] = useState(5);
  const [userReview, setUserReview] = useState('');
  const [isRated, setIsRated] = useState(Boolean(booking?.ratingGiven));

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!booking) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
        <p className="text-sm text-stone-500">No active booking selected.</p>
      </div>
    );
  }

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;
    const newMsg = { sender: 'customer', text: inputMsg, time: 'Just now' };
    setChatMessages(prev => [...prev, newMsg]);
    setInputMsg('');

    // Simulated worker reply
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'worker',
          text: 'Je theek hai jee, main gate par pohanch kar call karta hoon.',
          time: 'Just now',
        }
      ]);
    }, 1200);
  };

  const statusSteps = [
    { key: 'requested', labelEn: 'Requested', labelUr: 'درخواست موصول' },
    { key: 'assigned', labelEn: 'Worker Assigned', labelUr: 'ورکر مقرر' },
    { key: 'on_the_way', labelEn: 'On the Way', labelUr: 'راستے میں ہے' },
    { key: 'in_progress', labelEn: 'Work in Progress', labelUr: 'کام جاری ہے' },
    { key: 'completed', labelEn: 'Completed', labelUr: 'مکمل' },
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.key === booking.bookingStatus);

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden">
      
      {/* Live Status Top Banner */}
      <div className="p-5 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {language === 'ur' ? 'لائیو ٹریکنگ' : 'Live Booking Tracker'}
            </span>
            <span className="text-xs text-stone-400">· Order #{booking.id}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold mt-1 text-white">
            {language === 'ur' ? booking.serviceNameUr : booking.serviceName}
          </h3>
          <p className="text-xs text-stone-300 flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{booking.customerAddress}, {booking.city}</span>
          </p>
        </div>

        {/* Live Timer / ETA indicator */}
        <div className="bg-stone-800/80 px-4 py-2.5 rounded-xl border border-stone-700/80 text-right">
          <div className="text-[10px] uppercase font-bold text-stone-400">
            {booking.bookingStatus === 'on_the_way' ? 'Estimated Arrival' : 'Job Duration Timer'}
          </div>
          <div className="text-lg font-mono font-extrabold text-emerald-400 tabular-nums">
            {booking.bookingStatus === 'on_the_way' 
              ? `${booking.etaMinutes || 12} mins away` 
              : formatTimer(secondsElapsed)}
          </div>
        </div>
      </div>

      {/* Progress Status Bar */}
      <div className="px-6 py-4 bg-stone-50 border-b border-stone-200">
        <div className="grid grid-cols-5 gap-2 text-center">
          {statusSteps.map((step, idx) => {
            const isDone = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div key={step.key} className="flex flex-col items-center">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone 
                      ? 'bg-emerald-700 text-white' 
                      : 'bg-stone-200 text-stone-500'
                  } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}
                >
                  {isDone ? '✓' : idx + 1}
                </div>
                <span className={`text-[11px] mt-1.5 font-medium leading-tight ${
                  isCurrent ? 'text-emerald-800 font-bold' : 'text-stone-500'
                }`}>
                  {language === 'ur' ? step.labelUr : step.labelEn}
                </span>
              </div>
            );
          })}
        </div>

        {/* Status Transition Control (for demo testing / live simulation) */}
        <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span className="font-semibold text-stone-700">Simulate State:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => updateBookingStatus(booking.id, 'on_the_way')}
              className={`px-2 py-1 rounded text-[11px] font-semibold ${booking.bookingStatus === 'on_the_way' ? 'bg-emerald-700 text-white' : 'bg-stone-200 hover:bg-stone-300 text-stone-800'}`}
            >
              On The Way
            </button>
            <button
              onClick={() => updateBookingStatus(booking.id, 'in_progress')}
              className={`px-2 py-1 rounded text-[11px] font-semibold ${booking.bookingStatus === 'in_progress' ? 'bg-emerald-700 text-white' : 'bg-stone-200 hover:bg-stone-300 text-stone-800'}`}
            >
              In Progress
            </button>
            <button
              onClick={() => updateBookingStatus(booking.id, 'completed')}
              className={`px-2 py-1 rounded text-[11px] font-semibold ${booking.bookingStatus === 'completed' ? 'bg-emerald-700 text-white' : 'bg-stone-200 hover:bg-stone-300 text-stone-800'}`}
            >
              Mark Completed
            </button>
          </div>
        </div>
      </div>

      {/* Main Details: Worker Profile & Action Controls */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Worker Card */}
        <div className="md:col-span-7 bg-stone-50/80 p-5 rounded-2xl border border-stone-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-3">
            {language === 'ur' ? 'تفویض شدہ ورکر' : 'Assigned KaamDo Partner'}
          </div>

          <div className="flex items-start gap-4">
            <img
              src={booking.workerPhoto || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300'}
              alt={booking.workerName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shadow-sm shrink-0"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-stone-900">
                  {booking.workerName}
                </h4>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>NADRA Verified</span>
                </span>
              </div>

              <div className="text-xs text-stone-500 mt-0.5">
                KaamDo Certified Professional · Police Cleared
              </div>

              <div className="flex items-center gap-3 mt-2 text-xs text-stone-700 font-medium">
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>4.9 / 5.0</span>
                </span>
                <span>·</span>
                <span>320+ Completed Jobs</span>
              </div>
            </div>
          </div>

          {/* Quick Communication Actions */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <button
              onClick={() => setIsCalling(true)}
              className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>{language === 'ur' ? 'کال کریں' : 'Call Helper'}</span>
            </button>

            <button
              onClick={() => setIsChatOpen(true)}
              className="py-2.5 px-3 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>{language === 'ur' ? 'چیٹ کریں' : 'Live Chat'}</span>
            </button>
          </div>
        </div>

        {/* Booking Financials & Safety Controls */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200 text-xs space-y-2">
            <div className="font-bold text-stone-900 border-b border-stone-200 pb-2 flex justify-between">
              <span>{language === 'ur' ? 'آرڈر کی تفصیل' : 'Booking Summary'}</span>
              <span className="text-emerald-700 font-extrabold tabular-nums">
                Rs. {booking.totalPkr.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between text-stone-600">
              <span>Payment Mode:</span>
              <span className="font-bold uppercase text-stone-800">
                {booking.paymentMethod === 'jazzcash' && 'JazzCash (Mobile)'}
                {booking.paymentMethod === 'easypaisa' && 'Easypaisa (Push)'}
                {booking.paymentMethod === 'card' && 'Credit/Debit Card'}
                {booking.paymentMethod === 'cash' && 'Cash on Completion'}
              </span>
            </div>

            <div className="flex justify-between text-stone-600">
              <span>Duration Booked:</span>
              <span className="font-semibold text-stone-800">{booking.durationHours} Hours</span>
            </div>

            <div className="flex justify-between text-stone-600">
              <span>Payment Status:</span>
              <span className={`font-bold ${booking.paymentStatus === 'completed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {booking.paymentStatus === 'completed' ? 'Paid & Verified' : 'Pay After Work'}
              </span>
            </div>
          </div>

          {/* Emergency SOS & Cancel Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => setIsEmergencyOpen(true)}
              className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>{language === 'ur' ? 'ایمرجنسی و کسٹمر پروٹیکشن' : 'Emergency & Safety Center (SOS)'}</span>
            </button>

            {booking.bookingStatus !== 'completed' && booking.bookingStatus !== 'cancelled' && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to cancel this booking? Free cancellation is applicable.')) {
                    cancelBooking(booking.id);
                  }
                }}
                className="w-full py-2 px-3 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>{language === 'ur' ? 'بکنگ منسوخ کریں' : 'Cancel Booking'}</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Completion Rating Banner if Completed */}
      {booking.bookingStatus === 'completed' && (
        <div className="m-6 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-700" />
            <span>Job Successfully Completed!</span>
          </div>

          <p className="text-xs text-stone-600 mt-1">
            Please rate your experience with {booking.workerName} to help us maintain service standards in Pakistan.
          </p>

          {!isRated ? (
            <div className="mt-3 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= userRating
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                placeholder="Write a quick review..."
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg outline-none"
              />

              <button
                onClick={() => {
                  submitRating(booking.id, userRating, userReview || 'Excellent service!');
                  setIsRated(true);
                }}
                className="px-4 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                Submit Review
              </button>
            </div>
          ) : (
            <div className="mt-2 text-xs font-bold text-emerald-800">
              ★ Rated {booking.ratingGiven || userRating}/5: "{booking.reviewGiven || userReview || 'Great job!'}"
            </div>
          )}
        </div>
      )}

      {/* Simulated Phone Call Modal */}
      {isCalling && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-stone-900 text-white rounded-3xl p-6 text-center shadow-2xl border border-stone-800 animate-in zoom-in-95">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-emerald-500 mb-4 animate-pulse">
              <img
                src={booking.workerPhoto}
                alt={booking.workerName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-lg font-bold">{booking.workerName}</div>
            <div className="text-xs text-stone-400 mt-1">{booking.workerPhone || '0302-8491204'}</div>
            <div className="text-xs text-emerald-400 mt-3 animate-pulse">Calling via KaamDo Masked Line...</div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setIsCalling(false)}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer"
              >
                <Phone className="w-6 h-6 rotate-135" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Chat Modal Drawer */}
      {isChatOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[520px] animate-in zoom-in-95">
            
            {/* Chat Header */}
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={booking.workerPhoto}
                  alt={booking.workerName}
                  className="w-10 h-10 rounded-full object-cover border border-white/40"
                />
                <div>
                  <div className="text-xs font-bold">{booking.workerName}</div>
                  <div className="text-[10px] text-emerald-200">Online · KaamDo In-App Chat</div>
                </div>
              </div>

              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50 text-xs">
              <div className="text-center text-[10px] text-stone-400 py-1">
                Security notice: Never share your JazzCash/Easypaisa PIN with anyone.
              </div>

              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[78%] p-3 rounded-2xl shadow-sm ${
                      msg.sender === 'customer'
                        ? 'bg-emerald-700 text-white rounded-br-none'
                        : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className={`text-[9px] block text-right mt-1 ${
                      msg.sender === 'customer' ? 'text-emerald-200' : 'text-stone-400'
                    }`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 text-xs bg-stone-100 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
              <button
                onClick={handleSendMessage}
                className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Center Modal */}
      {isEmergencyOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-rose-200 text-stone-900 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h4 className="text-base font-bold text-center text-stone-900">
              Safety & Emergency Response
            </h4>
            <p className="text-xs text-stone-600 text-center mt-1">
              Your safety and home security are protected by KaamDo Insurance & Trust protocols.
            </p>

            <div className="mt-4 space-y-2.5 text-xs">
              <a
                href="tel:15"
                className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Police 15 (Emergency)</span>
              </a>

              <a
                href="tel:+9242111522636"
                className="w-full py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call KaamDo 24/7 Helpline (+92-42-111-KAAMDO)</span>
              </a>

              <button
                onClick={() => setIsEmergencyOpen(false)}
                className="w-full py-2 text-stone-600 font-semibold rounded-lg hover:bg-stone-100"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
