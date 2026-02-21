import { getSupabaseClient } from './supabase';
import type { Ride, RideStatus, NearbyDriver, FareEstimate, Coordinates } from '../types';
import { calculateDistance, calculateEta } from '../location';

export async function requestRide(
  riderId: string,
  pickup: Coordinates & { address: string },
  dropoff: Coordinates & { address: string },
  fareEstimate: FareEstimate
): Promise<Ride> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('rides')
    .insert({
      rider_id: riderId,
      pickup_latitude: pickup.latitude,
      pickup_longitude: pickup.longitude,
      pickup_address: pickup.address,
      dropoff_latitude: dropoff.latitude,
      dropoff_longitude: dropoff.longitude,
      dropoff_address: dropoff.address,
      estimated_fare: fareEstimate.total_fare,
      estimated_distance: calculateDistance(
        pickup.latitude,
        pickup.longitude,
        dropoff.latitude,
        dropoff.longitude
      ),
      estimated_duration: 15,
      status: 'searching',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function acceptRide(rideId: string, driverId: string): Promise<Ride> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('rides')
    .update({
      driver_id: driverId,
      status: 'accepted',
      accepted_at: new Date().toISOString(),
    })
    .eq('id', rideId)
    .eq('status', 'searching')
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function startRide(rideId: string): Promise<Ride> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('rides')
    .update({
      status: 'in_progress',
      started_at: new Date().toISOString(),
    })
    .eq('id', rideId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function completeRide(rideId: string, actualFare?: number): Promise<Ride> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('rides')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      actual_fare: actualFare,
      payment_status: 'completed',
    })
    .eq('id', rideId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function cancelRide(rideId: string, reason?: string): Promise<Ride> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('rides')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason,
    })
    .eq('id', rideId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function rateRide(
  rideId: string,
  rating: number,
  role: 'rider' | 'driver'
): Promise<void> {
  const supabase = getSupabaseClient();
  
  const field = role === 'rider' ? 'rating_by_rider' : 'rating_by_driver';
  const { error } = await supabase
    .from('rides')
    .update({ [field]: rating })
    .eq('id', rideId);

  if (error) throw error;
}

export async function getRideHistory(
  userId: string,
  role: 'rider' | 'driver',
  limit = 20
): Promise<Ride[]> {
  const supabase = getSupabaseClient();
  const field = role === 'rider' ? 'rider_id' : 'driver_id';
  
  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .eq(field, userId)
    .in('status', ['completed', 'cancelled'])
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getActiveRide(
  userId: string,
  role: 'rider' | 'driver'
): Promise<Ride | null> {
  const supabase = getSupabaseClient();
  const field = role === 'rider' ? 'rider_id' : 'driver_id';
  
  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .eq(field, userId)
    .in('status', ['searching', 'accepted', 'arriving', 'in_progress'])
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getPendingRideRequests(
  driverLat: number,
  driverLng: number,
  radiusKm = 5
): Promise<Ride[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .rpc('get_nearby_ride_requests', {
      driver_lat: driverLat,
      driver_lng: driverLng,
      radius_km: radiusKm,
    });

  if (error) throw error;
  return data || [];
}

export async function getNearbyDrivers(
  latitude: number,
  longitude: number,
  radiusKm = 3
): Promise<NearbyDriver[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .rpc('get_nearby_drivers', {
      rider_lat: latitude,
      rider_lng: longitude,
      radius_km: radiusKm,
    });

  if (error) throw error;
  return data || [];
}

export function calculateFareEstimate(
  distanceKm: number,
  durationMin: number,
  surgeMultiplier = 1
): FareEstimate {
  const baseFare = 3.0;
  const perKmRate = 1.5;
  const perMinRate = 0.3;

  const distanceFare = distanceKm * perKmRate;
  const timeFare = durationMin * perMinRate;
  const subtotal = baseFare + distanceFare + timeFare;
  const totalFare = Math.round(subtotal * surgeMultiplier * 100) / 100;

  return {
    base_fare: baseFare,
    distance_fare: Math.round(distanceFare * 100) / 100,
    time_fare: Math.round(timeFare * 100) / 100,
    surge_multiplier: surgeMultiplier,
    total_fare: totalFare,
    currency: 'USD',
  };
}
