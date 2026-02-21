import { getSupabaseClient } from './supabase';
import type { Driver, DriverLocation } from '../types';

export async function updateDriverLocation(
  driverId: string,
  latitude: number,
  longitude: number,
  heading?: number,
  speed?: number
): Promise<void> {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase
    .from('driver_locations')
    .upsert({
      driver_id: driverId,
      latitude,
      longitude,
      heading,
      speed,
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;
}

export async function setDriverOnlineStatus(
  driverId: string,
  isOnline: boolean
): Promise<void> {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase
    .from('profiles')
    .update({ is_online: isOnline })
    .eq('id', driverId);

  if (error) throw error;
}

export async function getDriverEarnings(
  driverId: string,
  period: 'today' | 'week' | 'month'
): Promise<{ total: number; count: number }> {
  const supabase = getSupabaseClient();
  
  let startDate: Date;
  const now = new Date();
  
  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
  }

  const { data, error } = await supabase
    .from('rides')
    .select('actual_fare')
    .eq('driver_id', driverId)
    .eq('status', 'completed')
    .gte('completed_at', startDate.toISOString());

  if (error) throw error;

  const total = data?.reduce((sum, ride) => sum + (ride.actual_fare || 0), 0) || 0;
  return { total, count: data?.length || 0 };
}

export async function getDriverStats(driverId: string): Promise<{
  totalRides: number;
  totalEarnings: number;
  rating: number;
  acceptanceRate: number;
}> {
  const supabase = getSupabaseClient();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('total_rides, total_earnings, rating')
    .eq('id', driverId)
    .single();

  return {
    totalRides: profile?.total_rides || 0,
    totalEarnings: profile?.total_earnings || 0,
    rating: profile?.rating || 5.0,
    acceptanceRate: 0.95,
  };
}
