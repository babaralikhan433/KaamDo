import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActiveBookingTracker } from './ActiveBookingTracker';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Heart, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  User, 
  Plus, 
  Check, 
  Star, 
  ArrowRight,
  ShieldCheck,
  Trash2
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { 
    language, 
    bookings, 
    activeBookingId, 
    setActiveBookingId, 
    workers, 
    setIsBookingModalOpen,
    setPreselectedServiceId,
    favoriteWorkerIds,
    toggleFavoriteWorker,
    showToast,
    customerUser,
    setIsCustomerAuthModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'addresses' | 'payments' | 'notifications' | 'support'>('orders');

  // Sample customer saved addresses
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 'addr-1', label: 'Home', address: 'House 42, Street 8, Sector Y, DHA Phase 5', city: 'Lahore' },
    { id: 'addr-2', label: 'Office', address: 'Floor 4, Evacuee Complex, Blue Area', city: 'Islamabad' },
  ]);
  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrText, setNewAddrText] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Lahore');
  const [showAddAddress, setShowAddAddress] = useState(false);

  // Payment methods
  const [savedWallets, setSavedWallets] = useState([
    { id: 'w-jc', type: 'JazzCash', number: '0300-1234567', isDefault: true },
    { id: 'w-ep', type: 'Easypaisa', number: '0345-9876543', isDefault: false },
  ]);

  const activeBookings = bookings.filter(b => b.bookingStatus !== 'completed' && b.bookingStatus !== 'cancelled');
  const pastBookings = bookings.filter(b => b.bookingStatus === 'completed' || b.bookingStatus === 'cancelled');
  const favoriteWorkersList = workers.filter(w => favoriteWorkerIds.includes(w.id));

  const handleAddAddress = () => {
    if (!newAddrLabel.trim() || !newAddrText.trim()) return;
    const newAddr = {
      id: `addr-${Date.now()}`,
      label: newAddrLabel,
      address: newAddrText,
      city: newAddrCity,
    };
    setSavedAddresses(prev => [...prev, newAddr]);
    setNewAddrLabel('');
    setNewAddrText('');
    setShowAddAddress(false);
    showToast('New address saved to your profile!', 'success');
  };

  const handleDeleteAddress = (id: string) => {
    setSavedAddresses(prev => prev.filter(a => a.id !== id));
    showToast('Address removed.', 'info');
  };

  return (
    <div className="py-8 sm:py-12 bg-stone-50 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Profile Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {customerUser?.avatar || (customerUser?.name ? customerUser.name.slice(0, 2).toUpperCase() : 'KD')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
                  {customerUser ? customerUser.name : 'KaamDo Guest Customer'}
                </h1>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Verified KaamDo Customer</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                {customerUser 
                  ? `${customerUser.phone} · ${customerUser.address || customerUser.city} · Member since ${customerUser.joinedDate}` 
                  : 'Register or Sign In to sync your home bookings across devices.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!customerUser && (
              <button
                onClick={() => setIsCustomerAuthModalOpen(true)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                {language === 'ur' ? 'لاگ ان / سائن اپ' : 'Sign In / Register'}
              </button>
            )}

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ur' ? 'نیا کام بک کریں' : 'Book New Task'}</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs & Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-3 border border-stone-200/90 shadow-sm space-y-1">
            {[
              { id: 'orders', label: language === 'ur' ? 'آرڈرز اور لائیو ٹریکر' : 'Bookings & Orders', icon: Calendar, badge: activeBookings.length },
              { id: 'favorites', label: language === 'ur' ? 'پسندیدہ مددگار' : 'Favorite Workers', icon: Heart, badge: favoriteWorkersList.length },
              { id: 'addresses', label: language === 'ur' ? 'محفوظ پتے' : 'Saved Addresses', icon: MapPin },
              { id: 'payments', label: language === 'ur' ? 'ادائیگی کے ذرائع' : 'Payment Methods', icon: CreditCard },
              { id: 'notifications', label: language === 'ur' ? 'اطلاعات' : 'Notifications', icon: Bell, badge: 2 },
              { id: 'support', label: language === 'ur' ? 'مدد اور سپورٹ' : 'Help & Support', icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full px-3.5 py-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                    <span>{tab.label}</span>
                  </div>

                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                      isActive ? 'bg-emerald-900 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Main Content Pane */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* TAB 1: Orders & Bookings */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                
                {/* Active Live Orders Tracker Display */}
                {activeBookings.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                        <span>Active Booking in Progress</span>
                      </h2>
                      <span className="text-xs text-stone-500 font-medium">
                        Live status updates enabled
                      </span>
                    </div>

                    {activeBookings.map((b) => (
                      <ActiveBookingTracker key={b.id} bookingId={b.id} />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-white rounded-3xl border border-stone-200">
                    <Clock className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <h3 className="text-sm font-bold text-stone-800">No active tasks right now</h3>
                    <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                      Need help around the house? Book an instant verified helper in less than 2 minutes.
                    </p>
                    <button
                      onClick={() => setIsBookingModalOpen(true)}
                      className="mt-4 px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl"
                    >
                      Book a Service Now
                    </button>
                  </div>
                )}

                {/* Past Completed Bookings */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm">
                  <h3 className="text-sm font-bold text-stone-900 mb-4">
                    Past Bookings History
                  </h3>

                  {pastBookings.length > 0 ? (
                    <div className="divide-y divide-stone-100">
                      {pastBookings.map((item) => (
                        <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900 text-sm">{item.serviceName}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                item.bookingStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                              }`}>
                                {item.bookingStatus.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-stone-500 mt-1">
                              Partner: <strong>{item.workerName}</strong> · {item.date} · {item.durationHours} hrs · {item.city}
                            </div>
                            {item.reviewGiven && (
                              <div className="mt-1 text-stone-600 italic">
                                "{item.reviewGiven}" ({item.ratingGiven} ★)
                              </div>
                            )}
                          </div>

                          <div className="text-right sm:text-right shrink-0">
                            <div className="text-sm font-extrabold text-stone-900 tabular-nums">
                              Rs. {item.totalPkr.toLocaleString()}
                            </div>
                            <button
                              onClick={() => {
                                setPreselectedServiceId(item.serviceId);
                                setIsBookingModalOpen(true);
                              }}
                              className="mt-1.5 text-xs text-emerald-700 font-bold hover:underline"
                            >
                              Book Again →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-400">No previous orders yet.</p>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: Favorite Workers */}
            {activeTab === 'favorites' && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-stone-900">
                  Your Trusted & Favorite Helpers
                </h3>
                <p className="text-xs text-stone-500">
                  Quickly request your preferred helpers who know your home and preferences.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {favoriteWorkersList.map((worker) => (
                    <div key={worker.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={worker.photo}
                          alt={worker.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <div className="font-bold text-stone-900 text-xs">{worker.name}</div>
                          <div className="text-[11px] text-emerald-800">{worker.category}</div>
                          <div className="text-[10px] text-stone-500">{worker.rating} ★ · {worker.city}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsBookingModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 cursor-pointer"
                      >
                        Hire
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-stone-900">
                    Saved Home & Office Addresses
                  </h3>
                  <button
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {showAddAddress && (
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Label (e.g. Home, Parents House)"
                        value={newAddrLabel}
                        onChange={(e) => setNewAddrLabel(e.target.value)}
                        className="px-3 py-2 text-xs bg-white rounded-lg border border-stone-300"
                      />
                      <input
                        type="text"
                        placeholder="City (e.g. Lahore, Islamabad)"
                        value={newAddrCity}
                        onChange={(e) => setNewAddrCity(e.target.value)}
                        className="px-3 py-2 text-xs bg-white rounded-lg border border-stone-300"
                      />
                      <input
                        type="text"
                        placeholder="Complete Street & House #"
                        value={newAddrText}
                        onChange={(e) => setNewAddrText(e.target.value)}
                        className="px-3 py-2 text-xs bg-white rounded-lg border border-stone-300 sm:col-span-3"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowAddAddress(false)}
                        className="px-3 py-1.5 text-xs text-stone-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddAddress}
                        className="px-4 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {savedAddresses.map((addr) => (
                    <div key={addr.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-stone-900 text-xs">{addr.label}</span>
                          <span className="text-[11px] text-stone-500 ml-2">({addr.city})</span>
                          <p className="text-xs text-stone-600 mt-0.5">{addr.address}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                        title="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Payments */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-stone-900">
                  Linked Pakistani Payment Accounts
                </h3>
                <p className="text-xs text-stone-500">
                  Manage your JazzCash and Easypaisa mobile wallets for 1-click doorstep payment authorizations.
                </p>

                <div className="space-y-3 pt-2">
                  {savedWallets.map((wallet) => (
                    <div key={wallet.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs ${
                          wallet.type === 'JazzCash' ? 'bg-red-600' : 'bg-emerald-600'
                        }`}>
                          {wallet.type === 'JazzCash' ? 'JC' : 'EP'}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 text-xs">{wallet.type} Mobile Account</div>
                          <div className="text-[11px] text-stone-500">{wallet.number}</div>
                        </div>
                      </div>

                      {wallet.isDefault ? (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          Default Method
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSavedWallets(prev => prev.map(w => ({ ...w, isDefault: w.id === wallet.id })));
                            showToast('Default payment method updated.', 'success');
                          }}
                          className="text-xs text-stone-600 hover:text-stone-900 font-semibold"
                        >
                          Make Default
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: Notifications */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-3">
                <h3 className="text-base font-bold text-stone-900 mb-2">Recent Notifications</h3>
                <div className="divide-y divide-stone-100 text-xs">
                  <div className="py-3 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <div>
                      <div className="font-bold text-stone-900">Worker Assigned: Tariq Mehmood</div>
                      <div className="text-stone-500">Tariq has accepted your Home Cleaning request and is traveling to DHA Phase 5.</div>
                      <span className="text-[10px] text-stone-400 mt-1 block">15 minutes ago</span>
                    </div>
                  </div>
                  <div className="py-3 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-stone-300 mt-1.5 shrink-0" />
                    <div>
                      <div className="font-bold text-stone-900">JazzCash Payment Verified</div>
                      <div className="text-stone-500">Rs. 1,150 debited successfully for booking KD-89241.</div>
                      <span className="text-[10px] text-stone-400 mt-1 block">25 minutes ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: Help & Support */}
            {activeTab === 'support' && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-stone-900">
                  KaamDo Customer Support Center
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Have an urgent concern regarding a service, worker arrival, or payment refund? Our support agents in Lahore and Karachi are ready to assist you.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href="https://wa.me/923001234567"
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-3 text-emerald-950 font-bold text-xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                      WA
                    </div>
                    <div>
                      <div>WhatsApp Live Support</div>
                      <div className="text-[11px] font-normal text-emerald-800">+92 300 1234567</div>
                    </div>
                  </a>

                  <a
                    href="tel:+9242111522636"
                    className="p-4 rounded-2xl bg-stone-100 border border-stone-200 hover:bg-stone-200 transition-colors flex items-center gap-3 text-stone-900 font-bold text-xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center font-bold">
                      KD
                    </div>
                    <div>
                      <div>Helpline (UAN)</div>
                      <div className="text-[11px] font-normal text-stone-600">+92 (42) 111-KAAMDO</div>
                    </div>
                  </a>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
