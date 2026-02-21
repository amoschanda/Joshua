import { getSupabaseClient } from './supabase';
import type { Profile, Rider, Driver } from '../types';

export async function signInWithPhone(phone: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) throw error;
}

export async function verifyOtp(phone: string, token: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Rider | Driver>
): Promise<Profile> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createRiderProfile(
  userId: string,
  data: Pick<Rider, 'name' | 'email'>
): Promise<Rider> {
  const supabase = getSupabaseClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      ...data,
      role: 'rider',
      rating: 5.0,
      total_rides: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return profile as Rider;
}

export async function createDriverProfile(
  userId: string,
  data: Pick<Driver, 'name' | 'email' | 'vehicle_type' | 'vehicle_number' | 'license_number'>
): Promise<Driver> {
  const supabase = getSupabaseClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      ...data,
      role: 'driver',
      rating: 5.0,
      total_rides: 0,
      total_earnings: 0,
      is_online: false,
      is_verified: false,
    })
    .select()
    .single();

  if (error) throw error;
  return profile as Driver;
}
