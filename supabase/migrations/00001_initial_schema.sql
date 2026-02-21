-- Initial migration: Create base schema

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('rider', 'driver')),
  rating DECIMAL(2,1) DEFAULT 5.0,
  total_rides INTEGER DEFAULT 0,
  vehicle_type TEXT,
  vehicle_number TEXT,
  vehicle_color TEXT,
  license_number TEXT,
  is_online BOOLEAN DEFAULT false,
  current_latitude DECIMAL(10,7),
  current_longitude DECIMAL(10,7),
  total_earnings DECIMAL(10,2) DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Driver locations table
CREATE TABLE IF NOT EXISTS driver_locations (
  driver_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  heading DECIMAL(5,2),
  speed DECIMAL(5,2),
  location GEOGRAPHY(POINT, 4326),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rides table
CREATE TABLE IF NOT EXISTS rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id UUID NOT NULL REFERENCES profiles(id),
  driver_id UUID REFERENCES profiles(id),
  pickup_latitude DECIMAL(10,7) NOT NULL,
  pickup_longitude DECIMAL(10,7) NOT NULL,
  pickup_address TEXT NOT NULL,
  pickup_location GEOGRAPHY(POINT, 4326),
  dropoff_latitude DECIMAL(10,7) NOT NULL,
  dropoff_longitude DECIMAL(10,7) NOT NULL,
  dropoff_address TEXT NOT NULL,
  dropoff_location GEOGRAPHY(POINT, 4326),
  estimated_fare DECIMAL(10,2) NOT NULL,
  actual_fare DECIMAL(10,2),
  estimated_distance DECIMAL(10,2),
  estimated_duration INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  driver_eta INTEGER,
  payment_method TEXT DEFAULT 'cash',
  payment_status TEXT DEFAULT 'pending',
  rating_by_rider INTEGER,
  rating_by_driver INTEGER,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_driver_locations_location ON driver_locations USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_rides_pickup_location ON rides USING GIST(pickup_location);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
