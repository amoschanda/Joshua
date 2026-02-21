import { getSupabaseClient } from '../api/supabase';
import type { Ride, DriverLocation } from '../types';

type RideCallback = (ride: Ride) => void;
type LocationCallback = (location: DriverLocation) => void;

export function subscribeToRideUpdates(rideId: string, callback: RideCallback) {
  const supabase = getSupabaseClient();
  
  const channel = supabase
    .channel(`ride:${rideId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rides',
        filter: `id=eq.${rideId}`,
      },
      (payload) => {
        callback(payload.new as Ride);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToDriverLocation(
  driverId: string,
  callback: LocationCallback
) {
  const supabase = getSupabaseClient();
  
  const channel = supabase
    .channel(`driver_location:${driverId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'driver_locations',
        filter: `driver_id=eq.${driverId}`,
      },
      (payload) => {
        callback(payload.new as DriverLocation);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToNewRideRequests(
  driverId: string,
  callback: (ride: Ride) => void
) {
  const supabase = getSupabaseClient();
  
  const channel = supabase
    .channel('new_ride_requests')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'rides',
        filter: 'status=eq.searching',
      },
      (payload) => {
        callback(payload.new as Ride);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function broadcastDriverLocation(
  driverId: string,
  latitude: number,
  longitude: number,
  heading?: number
) {
  const supabase = getSupabaseClient();
  
  const channel = supabase.channel('driver_locations');
  
  channel.send({
    type: 'broadcast',
    event: 'location_update',
    payload: {
      driver_id: driverId,
      latitude,
      longitude,
      heading,
      timestamp: Date.now(),
    },
  });
}
