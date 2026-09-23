import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Booking } from '../types';

// Supabase project credentials provided for project oovoxjgdmdqksiwomfkt
export const SUPABASE_PROJECT_ID = 'oovoxjgdmdqksiwomfkt';
export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;

// Supabase Anon / Public API Key
export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;
  
  if (SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'your-supabase-anon-key') {
    try {
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return supabaseClient;
    } catch (err) {
      console.warn('[Supabase] Initialization warning:', err);
      return null;
    }
  }
  return null;
}

export interface SupabaseSaveResult {
  success: boolean;
  table?: string;
  data?: any;
  error?: string;
  isKeyPending?: boolean;
}

/**
 * Saves a completed booking form record into Supabase backend table.
 * Supports table names: 'bookings' and 'appointments'.
 */
export async function saveBookingToSupabase(booking: Booking): Promise<SupabaseSaveResult> {
  const client = getSupabaseClient();

  // Payload formatted for standard PostgreSQL / Supabase column conventions
  const payload = {
    id: booking.id,
    customer_name: booking.customerName,
    customer_phone: booking.customerPhone,
    customer_address: booking.customerAddress,
    city: booking.city,
    area: booking.area,
    service_id: booking.serviceId,
    service_name: booking.serviceName,
    service_name_ur: booking.serviceNameUr,
    worker_id: booking.workerId,
    worker_name: booking.workerName,
    appointment_date: booking.date,
    appointment_time: booking.time,
    is_instant: booking.isInstant,
    duration_hours: booking.durationHours,
    base_price_pkr: booking.basePricePkr,
    platform_fee_pkr: booking.platformFeePkr,
    total_pkr: booking.totalPkr,
    payment_method: booking.paymentMethod,
    payment_status: booking.paymentStatus,
    booking_status: booking.bookingStatus,
    notes: booking.notes || '',
    created_at: new Date().toISOString(),
  };

  // If Supabase Anon Key is not yet configured in environment
  if (!client) {
    console.info(
      `[Supabase] Booking ${booking.id} prepared for Supabase project '${SUPABASE_PROJECT_ID}' (${SUPABASE_URL}). ` +
      `To persist remotely, please provide VITE_SUPABASE_ANON_KEY in your .env file.`
    );
    return {
      success: false,
      isKeyPending: true,
      error: 'VITE_SUPABASE_ANON_KEY is not configured in .env yet.',
    };
  }

  // Try saving to 'bookings' table first
  try {
    const { data, error } = await client
      .from('bookings')
      .insert([payload])
      .select();

    if (!error) {
      console.log(`[Supabase] Successfully saved booking ${booking.id} to table 'bookings':`, data);
      return { success: true, table: 'bookings', data };
    }

    console.warn(`[Supabase] Insert into 'bookings' returned error, attempting 'appointments' table fallback:`, error.message);

    // Fallback: try 'appointments' table
    const fallback = await client
      .from('appointments')
      .insert([payload])
      .select();

    if (!fallback.error) {
      console.log(`[Supabase] Successfully saved booking ${booking.id} to table 'appointments':`, fallback.data);
      return { success: true, table: 'appointments', data: fallback.data };
    }

    return {
      success: false,
      error: `Could not insert into 'bookings' or 'appointments': ${error.message}`,
    };
  } catch (err: any) {
    console.error('[Supabase] Exception while saving booking:', err);
    return {
      success: false,
      error: err?.message || 'Network error saving booking to Supabase',
    };
  }
}

/**
 * Fetches bookings saved in Supabase backend tables.
 */
export async function fetchBookingsFromSupabase(): Promise<Booking[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id || `KD-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: row.customer_name || 'Customer',
      customerPhone: row.customer_phone || '',
      customerAddress: row.customer_address || '',
      city: row.city || 'Lahore',
      area: row.area || '',
      serviceId: row.service_id || 'cleaning',
      serviceName: row.service_name || 'Home Service',
      serviceNameUr: row.service_name_ur || 'گھریلو سروس',
      workerId: row.worker_id || 'w-1',
      workerName: row.worker_name || 'Assigned Partner',
      date: row.appointment_date || 'Today',
      time: row.appointment_time || '10:00 AM',
      isInstant: Boolean(row.is_instant),
      durationHours: Number(row.duration_hours) || 2,
      basePricePkr: Number(row.base_price_pkr) || 1000,
      platformFeePkr: Number(row.platform_fee_pkr) || 50,
      totalPkr: Number(row.total_pkr) || 1050,
      paymentMethod: row.payment_method || 'cash',
      paymentStatus: row.payment_status || 'pending',
      bookingStatus: row.booking_status || 'assigned',
      notes: row.notes || '',
      createdAt: row.created_at || 'Recently',
    }));
  } catch (err) {
    console.warn('[Supabase] Failed to fetch remote bookings:', err);
    return null;
  }
}
