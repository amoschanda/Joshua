-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Profiles table (riders and drivers)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('rider', 'driver')),
  rating DECIMAL(2,1) DEFAULT 5.0,
  total_rides INTEGER DEFAULT 0,
  -- Driver-specific fields
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

-- Driver locations table for real-time tracking
CREATE TABLE driver_locations (
  driver_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  heading DECIMAL(5,2),
  speed DECIMAL(5,2),
  location GEOGRAPHY(POINT, 4326),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rides table
CREATE TABLE rides (
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
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'searching', 'accepted', 'arriving', 'in_progress', 'completed', 'cancelled'
  )),
  driver_eta INTEGER,
  payment_method TEXT DEFAULT 'cash',
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'processing', 'completed', 'failed', 'refunded'
  )),
  rating_by_rider INTEGER CHECK (rating_by_rider >= 1 AND rating_by_rider <= 5),
  rating_by_driver INTEGER CHECK (rating_by_driver >= 1 AND rating_by_driver <= 5),
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- Saved locations for riders
CREATE TABLE saved_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('home', 'work', 'favorite')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment methods for riders
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('card', 'wallet', 'cash')),
  stripe_payment_method_id TEXT,
  last_four TEXT,
  brand TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Earnings records for drivers
CREATE TABLE earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES profiles(id),
  ride_id UUID NOT NULL REFERENCES rides(id),
  gross_amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  net_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Push notification tokens
CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_driver_locations_location ON driver_locations USING GIST(location);
CREATE INDEX idx_rides_pickup_location ON rides USING GIST(pickup_location);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_rider_id ON rides(rider_id);
CREATE INDEX idx_rides_driver_id ON rides(driver_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_is_online ON profiles(is_online) WHERE role = 'driver';

-- Update location geography on insert/update
CREATE OR REPLACE FUNCTION update_driver_location_geography()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_driver_location
BEFORE INSERT OR UPDATE ON driver_locations
FOR EACH ROW EXECUTE FUNCTION update_driver_location_geography();

-- Update ride location geography on insert/update
CREATE OR REPLACE FUNCTION update_ride_locations()
RETURNS TRIGGER AS $$
BEGIN
  NEW.pickup_location = ST_SetSRID(ST_MakePoint(NEW.pickup_longitude, NEW.pickup_latitude), 4326)::geography;
  NEW.dropoff_location = ST_SetSRID(ST_MakePoint(NEW.dropoff_longitude, NEW.dropoff_latitude), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ride_locations
BEFORE INSERT OR UPDATE ON rides
FOR EACH ROW EXECUTE FUNCTION update_ride_locations();

-- Function to get nearby drivers
CREATE OR REPLACE FUNCTION get_nearby_drivers(
  rider_lat DECIMAL,
  rider_lng DECIMAL,
  radius_km DECIMAL DEFAULT 3
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  rating DECIMAL,
  vehicle_type TEXT,
  vehicle_number TEXT,
  vehicle_color TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  distance DECIMAL,
  eta INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.rating,
    p.vehicle_type,
    p.vehicle_number,
    p.vehicle_color,
    dl.latitude,
    dl.longitude,
    ROUND(
      ST_Distance(
        dl.location,
        ST_SetSRID(ST_MakePoint(rider_lng, rider_lat), 4326)::geography
      ) / 1000, 2
    ) as distance,
    CEIL(
      ST_Distance(
        dl.location,
        ST_SetSRID(ST_MakePoint(rider_lng, rider_lat), 4326)::geography
      ) / 1000 / 30 * 60
    )::INTEGER as eta
  FROM profiles p
  JOIN driver_locations dl ON dl.driver_id = p.id
  WHERE p.role = 'driver'
    AND p.is_online = true
    AND p.is_verified = true
    AND ST_DWithin(
      dl.location,
      ST_SetSRID(ST_MakePoint(rider_lng, rider_lat), 4326)::geography,
      radius_km * 1000
    )
  ORDER BY distance
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Function to get nearby ride requests
CREATE OR REPLACE FUNCTION get_nearby_ride_requests(
  driver_lat DECIMAL,
  driver_lng DECIMAL,
  radius_km DECIMAL DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  rider_id UUID,
  pickup_latitude DECIMAL,
  pickup_longitude DECIMAL,
  pickup_address TEXT,
  dropoff_address TEXT,
  estimated_fare DECIMAL,
  estimated_distance DECIMAL,
  distance_to_pickup DECIMAL,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.rider_id,
    r.pickup_latitude,
    r.pickup_longitude,
    r.pickup_address,
    r.dropoff_address,
    r.estimated_fare,
    r.estimated_distance,
    ROUND(
      ST_Distance(
        r.pickup_location,
        ST_SetSRID(ST_MakePoint(driver_lng, driver_lat), 4326)::geography
      ) / 1000, 2
    ) as distance_to_pickup,
    r.created_at
  FROM rides r
  WHERE r.status = 'searching'
    AND r.driver_id IS NULL
    AND ST_DWithin(
      r.pickup_location,
      ST_SetSRID(ST_MakePoint(driver_lng, driver_lat), 4326)::geography,
      radius_km * 1000
    )
  ORDER BY r.created_at DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Drivers visible to riders" ON profiles
  FOR SELECT USING (role = 'driver' AND is_online = true);

-- Rides policies
CREATE POLICY "Users can view own rides" ON rides
  FOR SELECT USING (auth.uid() IN (rider_id, driver_id));
CREATE POLICY "Riders can create rides" ON rides
  FOR INSERT WITH CHECK (auth.uid() = rider_id);
CREATE POLICY "Participants can update rides" ON rides
  FOR UPDATE USING (auth.uid() IN (rider_id, driver_id));

-- Driver locations policies
CREATE POLICY "Drivers can update own location" ON driver_locations
  FOR ALL USING (auth.uid() = driver_id);
CREATE POLICY "Anyone can view driver locations" ON driver_locations
  FOR SELECT USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE rides;
ALTER PUBLICATION supabase_realtime ADD TABLE driver_locations;
