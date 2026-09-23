import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Language, 
  Service, 
  Worker, 
  Booking, 
  WorkerApplication, 
  SystemPricing, 
  PaymentMethod,
  AdminAccount,
  CustomerUser
} from '../types';
import { 
  INITIAL_SERVICES, 
  INITIAL_WORKERS, 
  INITIAL_BOOKINGS, 
  INITIAL_APPLICATIONS, 
  DEFAULT_PRICING 
} from '../data/mockData';
import { 
  saveBookingToSupabase, 
  fetchBookingsFromSupabase,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL
} from '../lib/supabase';

export type AppView = 'home' | 'customer_dashboard' | 'worker_dashboard' | 'admin_panel';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  services: Service[];
  workers: Worker[];
  bookings: Booking[];
  activeBookingId: string | null;
  setActiveBookingId: (id: string | null) => void;
  applications: WorkerApplication[];
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  preselectedServiceId: string | null;
  setPreselectedServiceId: (id: string | null) => void;
  preselectedWorkerId: string | null;
  setPreselectedWorkerId: (id: string | null) => void;
  isBecomeWorkerOpen: boolean;
  setIsBecomeWorkerOpen: (open: boolean) => void;
  systemPricing: SystemPricing;
  setSystemPricing: React.Dispatch<React.SetStateAction<SystemPricing>>;
  workerIsOnline: boolean;
  setWorkerIsOnline: (online: boolean) => void;
  workerEarnings: { today: number; month: number; completedCount: number };
  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  currentWorkerId: string;
  setCurrentWorkerId: (id: string) => void;
  currentWorker: Worker;
  updateWorkerProfile: (id: string, updates: Partial<Worker>) => void;
  addWorker: (worker: Worker) => void;
  
  // Actions
  createBooking: (bookingData: Omit<Booking, 'id' | 'createdAt'>) => string;
  cancelBooking: (id: string) => void;
  updateBookingStatus: (id: string, status: Booking['bookingStatus']) => void;
  submitRating: (id: string, rating: number, review: string) => void;
  submitWorkerApplication: (app: Omit<WorkerApplication, 'id' | 'status' | 'submittedAt'>, autoAddAsWorker?: boolean) => void;
  approveApplication: (id: string) => void;
  rejectApplication: (id: string) => void;
  withdrawWorkerEarnings: (method: 'jazzcash' | 'easypaisa', account: string, amount: number) => boolean;
  toggleFavoriteWorker: (workerId: string) => void;
  favoriteWorkerIds: string[];

  // Customer Authentication & Account Management
  customerUser: CustomerUser | null;
  isCustomerAuthModalOpen: boolean;
  setIsCustomerAuthModalOpen: (open: boolean) => void;
  loginCustomer: (phoneOrEmail: string, password?: string) => { success: boolean; error?: string };
  registerCustomer: (data: { name: string; phone: string; email: string; city: string; address?: string }) => { success: boolean; error?: string };
  logoutCustomer: () => void;
  updateCustomerProfile: (data: Partial<CustomerUser>) => void;

  // Service Details Modal
  selectedServiceForDetail: Service | null;
  setSelectedServiceForDetail: (service: Service | null) => void;

  // Admin Single-Slot Authentication & Master Account
  isAdminRegistered: boolean;
  isAdminAuthenticated: boolean;
  adminUser: AdminAccount | null;
  registerMasterAdmin: (data: { name: string; email: string; password: string }) => { success: boolean; error?: string };
  loginAdmin: (email: string, password: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  resetAdminAccount: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedCity, setSelectedCity] = useState<string>('Lahore');
  const [selectedArea, setSelectedArea] = useState<string>('DHA Phase 5');
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [activeBookingId, setActiveBookingId] = useState<string | null>('KD-89241');
  const [applications, setApplications] = useState<WorkerApplication[]>(INITIAL_APPLICATIONS);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);
  const [preselectedWorkerId, setPreselectedWorkerId] = useState<string | null>(null);
  const [isBecomeWorkerOpen, setIsBecomeWorkerOpen] = useState<boolean>(false);
  const [systemPricing, setSystemPricing] = useState<SystemPricing>(DEFAULT_PRICING);
  
  // Customer Authentication state
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(() => {
    try {
      const stored = localStorage.getItem('kaamdo_customer_user_v1');
      if (stored) return JSON.parse(stored);
    } catch {}
    // Default logged in Pakistani user for instant seamless experience
    return {
      id: 'cust-1',
      name: 'Babar Ali',
      phone: '0300-1234567',
      email: 'babar.ali@kaamdo.pk',
      city: 'Lahore',
      address: 'House 42, Street 7, Sector Y, DHA Phase 5',
      avatar: 'BA',
      joinedDate: 'August 2026',
    };
  });

  const [isCustomerAuthModalOpen, setIsCustomerAuthModalOpen] = useState<boolean>(false);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<Service | null>(null);

  const loginCustomer = (phoneOrEmail: string, _password?: string) => {
    if (!phoneOrEmail.trim()) {
      return { success: false, error: 'Please enter your mobile number or email.' };
    }
    const cleanInput = phoneOrEmail.trim();
    const isEmail = cleanInput.includes('@');
    const existing: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: isEmail ? cleanInput.split('@')[0].toUpperCase() : 'Babar Ali',
      phone: isEmail ? '0300-1234567' : cleanInput,
      email: isEmail ? cleanInput : `${cleanInput.replace(/[^0-9]/g, '')}@kaamdo.pk`,
      city: selectedCity || 'Lahore',
      address: selectedArea ? `${selectedArea}, ${selectedCity}` : 'DHA Phase 5, Lahore',
      avatar: (isEmail ? cleanInput[0] : 'BA').toUpperCase(),
      joinedDate: 'Recently',
    };
    setCustomerUser(existing);
    try {
      localStorage.setItem('kaamdo_customer_user_v1', JSON.stringify(existing));
    } catch {}
    showToast(
      language === 'ur' ? `خوش آمدید، ${existing.name}!` : `Welcome back, ${existing.name}!`,
      'success'
    );
    return { success: true };
  };

  const registerCustomer = (data: { name: string; phone: string; email: string; city: string; address?: string }) => {
    if (!data.name.trim() || !data.phone.trim()) {
      return { success: false, error: 'Name and Phone number are required.' };
    }
    const newCust: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim() || `${data.phone.replace(/[^0-9]/g, '')}@kaamdo.pk`,
      city: data.city || selectedCity || 'Lahore',
      address: data.address?.trim() || `${selectedArea}, ${selectedCity}`,
      avatar: data.name.trim().slice(0, 2).toUpperCase(),
      joinedDate: 'Just now',
    };
    setCustomerUser(newCust);
    try {
      localStorage.setItem('kaamdo_customer_user_v1', JSON.stringify(newCust));
    } catch {}
    showToast(
      language === 'ur' ? 'آپ کا اکاؤنٹ کامیابی سے بن گیا ہے!' : 'Your KaamDo customer account has been created!',
      'success'
    );
    return { success: true };
  };

  const logoutCustomer = () => {
    setCustomerUser(null);
    try {
      localStorage.removeItem('kaamdo_customer_user_v1');
    } catch {}
    showToast(
      language === 'ur' ? 'آپ لاگ آؤٹ ہو چکے ہیں' : 'Logged out of KaamDo.',
      'info'
    );
  };

  const updateCustomerProfile = (updates: Partial<CustomerUser>) => {
    if (!customerUser) return;
    const updated: CustomerUser = { ...customerUser, ...updates };
    setCustomerUser(updated);
    try {
      localStorage.setItem('kaamdo_customer_user_v1', JSON.stringify(updated));
    } catch {}
    showToast(
      language === 'ur' ? 'پروفائل اپڈیٹ ہو گئی' : 'Customer profile updated successfully.',
      'success'
    );
  };
  
  // Worker Partner state
  const [currentWorkerId, setCurrentWorkerId] = useState<string>('w-1');
  const [workerIsOnline, setWorkerIsOnline] = useState<boolean>(true);
  const [workerEarnings, setWorkerEarnings] = useState({
    today: 4400,
    month: 58500,
    completedCount: 34,
  });
  const [favoriteWorkerIds, setFavoriteWorkerIds] = useState<string[]>(['w-1', 'w-2']);

  const currentWorker = workers.find(w => w.id === currentWorkerId) || workers[0];

  const updateWorkerProfile = (id: string, updates: Partial<Worker>) => {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
    showToast(
      language === 'ur' ? 'پروفائل کامیابی سے اپڈیٹ ہو گئی!' : 'Worker profile updated successfully!',
      'success'
    );
  };

  const addWorker = (newWorker: Worker) => {
    setWorkers(prev => [newWorker, ...prev]);
    setCurrentWorkerId(newWorker.id);
  };

  // Toast
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'info',
  });

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // Load bookings from Supabase backend on mount if configured
  useEffect(() => {
    let isMounted = true;
    fetchBookingsFromSupabase().then(remoteBookings => {
      if (isMounted && remoteBookings && remoteBookings.length > 0) {
        console.log(`[Supabase] Loaded ${remoteBookings.length} bookings from Supabase backend.`);
        setBookings(prev => {
          const existingIds = new Set(prev.map(b => b.id));
          const uniqueRemote = remoteBookings.filter(b => !existingIds.has(b.id));
          return [...uniqueRemote, ...prev];
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): string => {
    const newId = `KD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      createdAt: 'Just now',
    };
    setBookings(prev => [newBooking, ...prev]);
    setActiveBookingId(newId);

    // Save appointment booking details directly to Supabase backend tables
    saveBookingToSupabase(newBooking).then(result => {
      if (result.success) {
        showToast(
          language === 'ur'
            ? `بکنگ ${newId} تصدیق اور Supabase (${result.table}) میں محفوظ ہو گئی!`
            : `Booking ${newId} confirmed & saved to Supabase (${result.table})!`,
          'success'
        );
      } else if (result.isKeyPending) {
        showToast(
          language === 'ur' 
            ? `آپ کی بکنگ ${newId} تصدیق ہو گئی ہے!` 
            : `Booking ${newId} confirmed!`,
          'success'
        );
      } else {
        console.warn('[Supabase Sync]', result.error);
        showToast(
          language === 'ur' 
            ? `آپ کی بکنگ ${newId} تصدیق ہو گئی ہے!` 
            : `Booking ${newId} confirmed!`,
          'success'
        );
      }
    });

    return newId;
  };

  const cancelBooking = (id: string) => {
    setBookings(prev => 
      prev.map(b => b.id === id ? { ...b, bookingStatus: 'cancelled' } : b)
    );
    showToast(
      language === 'ur' ? 'بکنگ منسوخ کر دی گئی ہے' : 'Booking has been cancelled.',
      'info'
    );
  };

  const updateBookingStatus = (id: string, status: Booking['bookingStatus']) => {
    setBookings(prev =>
      prev.map(b => b.id === id ? { ...b, bookingStatus: status } : b)
    );
    showToast(
      language === 'ur' ? `حیثیت تبدیل: ${status}` : `Booking status updated: ${status}`,
      'info'
    );
  };

  const submitRating = (id: string, rating: number, review: string) => {
    setBookings(prev =>
      prev.map(b => b.id === id ? { ...b, ratingGiven: rating, reviewGiven: review } : b)
    );
    showToast(
      language === 'ur' ? 'آپ کی رائے کا بہت شکریہ!' : 'Thank you for your rating and review!',
      'success'
    );
  };

  const submitWorkerApplication = (
    app: Omit<WorkerApplication, 'id' | 'status' | 'submittedAt'>,
    autoAddAsWorker: boolean = true
  ) => {
    const newId = `app-${Math.floor(100 + Math.random() * 900)}`;
    const newApp: WorkerApplication = {
      ...app,
      id: newId,
      status: 'pending',
      submittedAt: 'Just now',
    };
    setApplications(prev => [newApp, ...prev]);

    if (autoAddAsWorker) {
      const primaryService = app.services[0] || 'General Worker';
      const createdWorker: Worker = {
        id: `w-${Date.now().toString().slice(-4)}`,
        name: app.fullName,
        nameUr: app.nameUr || app.fullName,
        photo: app.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        category: primaryService,
        categoryUr: primaryService,
        rating: 5.0,
        reviewCount: 1,
        completedJobs: 1,
        experienceYears: app.experienceYears || 3,
        cnicVerified: true,
        policeVerified: true,
        isAvailable: true,
        city: app.city,
        area: app.area || 'Central Area',
        hourlyRatePkr: app.hourlyRate || 550,
        bioEn: `Registered verified professional providing ${app.services.join(', ')} in ${app.city}.`,
        bioUr: `${app.city} میں مصدقہ گھریلو و تکنیکی سروس فراہم کرنے والے قابل اعتماد کاریگر۔`,
        skills: app.services.length > 0 ? app.services : ['Home Assistance', 'Punctual Service'],
        phone: app.phone,
      };
      setWorkers(prev => [createdWorker, ...prev]);
      setCurrentWorkerId(createdWorker.id);
    }

    showToast(
      language === 'ur'
        ? 'آپ کی پروفائل تصویر اور تفصیلات کے ساتھ کامیابی سے رجسٹر ہو گئی ہے!'
        : 'Worker profile registered and live with your name & picture!',
      'success'
    );
  };

  const approveApplication = (id: string) => {
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'approved' } : a)
    );
    showToast(
      language === 'ur' ? 'درخواست منظور کر لی گئی ہے' : 'Worker application approved and verified.',
      'success'
    );
  };

  const rejectApplication = (id: string) => {
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a)
    );
    showToast(
      language === 'ur' ? 'درخواست مسترد کر دی گئی' : 'Worker application rejected.',
      'info'
    );
  };

  const withdrawWorkerEarnings = (method: 'jazzcash' | 'easypaisa', account: string, amount: number): boolean => {
    if (amount > workerEarnings.today) {
      showToast(language === 'ur' ? 'رقم دستیاب بیلنس سے زیادہ ہے' : 'Requested amount exceeds daily balance.', 'error');
      return false;
    }
    setWorkerEarnings(prev => ({
      ...prev,
      today: prev.today - amount,
    }));
    showToast(
      language === 'ur' 
        ? `روپے ${amount} آپ کے ${method.toUpperCase()} اکاؤنٹ (${account}) میں ٹرانسفر کر دیے گئے ہیں۔` 
        : `Rs. ${amount.toLocaleString()} transferred to your ${method === 'jazzcash' ? 'JazzCash' : 'Easypaisa'} account (${account}).`,
      'success'
    );
    return true;
  };

  const toggleFavoriteWorker = (workerId: string) => {
    setFavoriteWorkerIds(prev =>
      prev.includes(workerId) ? prev.filter(id => id !== workerId) : [...prev, workerId]
    );
  };

  // Master Admin Authentication & Single Slot Management
  const [isAdminRegistered, setIsAdminRegistered] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem('kaamdo_master_admin_v1'));
    } catch {
      return false;
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('kaamdo_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState<AdminAccount | null>(() => {
    try {
      const stored = localStorage.getItem('kaamdo_master_admin_v1');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return null;
  });

  const registerMasterAdmin = (data: { name: string; email: string; password: string }) => {
    try {
      const existing = localStorage.getItem('kaamdo_master_admin_v1');
      if (existing) {
        return {
          success: false,
          error: 'Registration is closed. The single master administrator slot has already been claimed.',
        };
      }

      if (!data.name.trim() || !data.email.trim() || !data.password.trim()) {
        return { success: false, error: 'Please fill in all fields (Name, Email, Password).' };
      }

      if (data.password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }

      const newAdmin: AdminAccount = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        createdAt: new Date().toISOString(),
        role: 'master_admin',
      };

      localStorage.setItem('kaamdo_master_admin_v1', JSON.stringify(newAdmin));
      sessionStorage.setItem('kaamdo_admin_authenticated', 'true');
      setIsAdminRegistered(true);
      setIsAdminAuthenticated(true);
      setAdminUser(newAdmin);

      showToast(
        language === 'ur'
          ? 'ایڈمن اکاؤنٹ تیار ہو گیا۔ آپ ایڈمن کنسول میں داخل ہیں!'
          : 'Master Admin account created! Single slot claimed. You are now logged in.',
        'success'
      );
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to save admin credentials.' };
    }
  };

  const loginAdmin = (email: string, password: string) => {
    try {
      const stored = localStorage.getItem('kaamdo_master_admin_v1');
      if (!stored) {
        return {
          success: false,
          error: 'No admin account found. Please initialize the single admin slot first.',
        };
      }

      const parsed: AdminAccount = JSON.parse(stored);
      if (parsed.email.toLowerCase() === email.trim().toLowerCase() && parsed.password === password) {
        sessionStorage.setItem('kaamdo_admin_authenticated', 'true');
        setIsAdminAuthenticated(true);
        setAdminUser(parsed);
        showToast(
          language === 'ur' ? `خوش آمدید ایڈمن ${parsed.name}` : `Welcome back, Admin ${parsed.name}!`,
          'success'
        );
        return { success: true };
      } else {
        return { success: false, error: 'Invalid admin email or password. Access denied.' };
      }
    } catch (e: any) {
      return { success: false, error: 'Failed to authenticate credentials.' };
    }
  };

  const logoutAdmin = () => {
    try {
      sessionStorage.removeItem('kaamdo_admin_authenticated');
    } catch {}
    setIsAdminAuthenticated(false);
    showToast(
      language === 'ur' ? 'ایڈمن لاگ آؤٹ ہو گیا' : 'Admin logged out successfully.',
      'info'
    );
  };

  const resetAdminAccount = () => {
    try {
      localStorage.removeItem('kaamdo_master_admin_v1');
      sessionStorage.removeItem('kaamdo_admin_authenticated');
      setIsAdminRegistered(false);
      setIsAdminAuthenticated(false);
      setAdminUser(null);
      showToast('Admin slot reset. 1 slot is now open for registration.', 'info');
    } catch {}
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        activeView,
        setActiveView,
        selectedCity,
        setSelectedCity,
        selectedArea,
        setSelectedArea,
        services,
        workers,
        bookings,
        activeBookingId,
        setActiveBookingId,
        applications,
        isBookingModalOpen,
        setIsBookingModalOpen,
        preselectedServiceId,
        setPreselectedServiceId,
        preselectedWorkerId,
        setPreselectedWorkerId,
        isBecomeWorkerOpen,
        setIsBecomeWorkerOpen,
        systemPricing,
        setSystemPricing,
        workerIsOnline,
        setWorkerIsOnline,
        workerEarnings,
        toast,
        showToast,
        currentWorkerId,
        setCurrentWorkerId,
        currentWorker,
        updateWorkerProfile,
        addWorker,
        createBooking,
        cancelBooking,
        updateBookingStatus,
        submitRating,
        submitWorkerApplication,
        approveApplication,
        rejectApplication,
        withdrawWorkerEarnings,
        toggleFavoriteWorker,
        favoriteWorkerIds,
        customerUser,
        isCustomerAuthModalOpen,
        setIsCustomerAuthModalOpen,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        updateCustomerProfile,
        selectedServiceForDetail,
        setSelectedServiceForDetail,
        isAdminRegistered,
        isAdminAuthenticated,
        adminUser,
        registerMasterAdmin,
        loginAdmin,
        logoutAdmin,
        resetAdminAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
