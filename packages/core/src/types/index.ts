export interface Profile {
  id: string;
  phone: string;
  name: string;
  email?: string;
  avatar_url?: string;
  role: 'rider' | 'driver';
  rating: number;
  total_rides: number;
  created_at: string;
  updated_at: string;
}

export interface Driver extends Profile {
  role: 'driver';
  vehicle_type: string;
  vehicle_number: string;
  vehicle_color?: string;
  license_number: string;
  is_online: boolean;
  current_latitude?: number;
  current_longitude?: number;
  total_earnings: number;
  is_verified: boolean;
}

export interface Rider extends Profile {
  role: 'rider';
  saved_locations?: SavedLocation[];
  payment_methods?: PaymentMethod[];
}

export interface SavedLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'home' | 'work' | 'favorite';
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'cash';
  last_four?: string;
  brand?: string;
  is_default: boolean;
}

export interface Ride {
  id: string;
  rider_id: string;
  driver_id?: string;
  pickup_latitude: number;
  pickup_longitude: number;
  pickup_address: string;
  dropoff_latitude: number;
  dropoff_longitude: number;
  dropoff_address: string;
  estimated_fare: number;
  actual_fare?: number;
  estimated_distance: number;
  estimated_duration: number;
  status: RideStatus;
  driver_eta?: number;
  payment_method?: string;
  payment_status?: PaymentStatus;
  rating_by_rider?: number;
  rating_by_driver?: number;
  created_at: string;
  accepted_at?: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
}

export type RideStatus =
  | 'pending'
  | 'searching'
  | 'accepted'
  | 'arriving'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface DriverLocation {
  driver_id: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  updated_at: string;
}

export interface NearbyDriver {
  id: string;
  name: string;
  rating: number;
  vehicle_type: string;
  vehicle_number: string;
  vehicle_color?: string;
  latitude: number;
  longitude: number;
  distance: number;
  eta: number;
}

export interface FareEstimate {
  base_fare: number;
  distance_fare: number;
  time_fare: number;
  surge_multiplier: number;
  total_fare: number;
  currency: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Route {
  coordinates: Coordinates[];
  distance: number;
  duration: number;
  polyline: string;
}
