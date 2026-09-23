export type Language = 'en' | 'ur';

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  avatar?: string;
  joinedDate: string;
}

export interface Service {
  id: string;
  nameEn: string;
  nameUr: string;
  descriptionEn: string;
  descriptionUr: string;
  basePricePkr: number;
  category: 'cleaning' | 'kitchen' | 'artisan' | 'care' | 'general' | 'grooming';
  popular?: boolean;
  image?: string;
  durationDefault: number; // in hours
}

export interface Worker {
  id: string;
  name: string;
  nameUr: string;
  photo: string;
  category: string;
  categoryUr: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  experienceYears: number;
  cnicVerified: boolean;
  policeVerified: boolean;
  isAvailable: boolean;
  city: string;
  area: string;
  hourlyRatePkr: number;
  bioEn: string;
  bioUr: string;
  skills: string[];
  phone: string;
}

export type PaymentMethod = 'jazzcash' | 'easypaisa' | 'card' | 'cash';

export type BookingStatus = 
  | 'requested' 
  | 'assigned' 
  | 'on_the_way' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  city: string;
  area: string;
  serviceId: string;
  serviceName: string;
  serviceNameUr: string;
  workerId: string;
  workerName: string;
  workerPhoto?: string;
  workerPhone?: string;
  date: string;
  time: string;
  isInstant: boolean;
  durationHours: number;
  basePricePkr: number;
  platformFeePkr: number;
  totalPkr: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'completed';
  bookingStatus: BookingStatus;
  notes?: string;
  createdAt: string;
  etaMinutes?: number;
  ratingGiven?: number;
  reviewGiven?: string;
}

export interface CityInfo {
  nameEn: string;
  nameUr: string;
  active: boolean;
  popularAreas: string[];
}

export interface WorkerApplication {
  id: string;
  fullName: string;
  nameUr?: string;
  photoUrl?: string;
  phone: string;
  cnic: string;
  city: string;
  area: string;
  services: string[];
  hourlyRate?: number;
  experienceYears: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  hasCnicDoc: boolean;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  city: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
  avatarText: string;
}

export interface SystemPricing {
  baseHourlyRate: number;
  platformFee: number;
  peakHourMultiplier: number;
  discountPkr: number;
}

export interface AdminAccount {
  name: string;
  email: string;
  password: string;
  createdAt: string;
  role: 'master_admin';
}
