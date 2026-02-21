-- Sample seed data for testing

-- Insert test riders
INSERT INTO profiles (id, phone, name, email, role, rating, total_rides) VALUES
  ('11111111-1111-1111-1111-111111111111', '+15551234567', 'Alex Johnson', 'alex@test.com', 'rider', 4.8, 25),
  ('22222222-2222-2222-2222-222222222222', '+15552345678', 'Sarah Williams', 'sarah@test.com', 'rider', 4.9, 42),
  ('33333333-3333-3333-3333-333333333333', '+15553456789', 'Mike Davis', 'mike@test.com', 'rider', 4.7, 18)
ON CONFLICT (id) DO NOTHING;

-- Insert test drivers
INSERT INTO profiles (
  id, phone, name, email, role, rating, total_rides,
  vehicle_type, vehicle_number, vehicle_color, license_number,
  is_online, is_verified, total_earnings
) VALUES
  ('44444444-4444-4444-4444-444444444444', '+15554567890', 'James Wilson', 'james@test.com', 'driver', 4.9, 156, 'Toyota Camry', 'ABC-1234', 'Silver', 'DL123456', true, true, 4520.00),
  ('55555555-5555-5555-5555-555555555555', '+15555678901', 'Maria Garcia', 'maria@test.com', 'driver', 4.8, 203, 'Honda Civic', 'XYZ-5678', 'Black', 'DL234567', true, true, 6340.00),
  ('66666666-6666-6666-6666-666666666666', '+15556789012', 'David Lee', 'david@test.com', 'driver', 4.7, 89, 'Tesla Model 3', 'EV-9012', 'White', 'DL345678', true, true, 2890.00)
ON CONFLICT (id) DO NOTHING;

-- Insert driver locations
INSERT INTO driver_locations (driver_id, latitude, longitude, heading, speed) VALUES
  ('44444444-4444-4444-4444-444444444444', 37.7749, -122.4194, 45, 25),
  ('55555555-5555-5555-5555-555555555555', 37.7849, -122.4094, 180, 30),
  ('66666666-6666-6666-6666-666666666666', 37.7649, -122.4294, 90, 0)
ON CONFLICT (driver_id) DO UPDATE SET
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  heading = EXCLUDED.heading,
  speed = EXCLUDED.speed;

-- Insert sample rides
INSERT INTO rides (
  rider_id, driver_id,
  pickup_latitude, pickup_longitude, pickup_address,
  dropoff_latitude, dropoff_longitude, dropoff_address,
  estimated_fare, actual_fare, estimated_distance, estimated_duration,
  status, payment_status, rating_by_rider, rating_by_driver,
  created_at, completed_at
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444444',
    37.7749, -122.4194, '123 Market St, San Francisco',
    37.7849, -122.4094, '456 Mission St, San Francisco',
    12.50, 13.20, 2.5, 12,
    'completed', 'completed', 5, 5,
    NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '15 minutes'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '55555555-5555-5555-5555-555555555555',
    37.7849, -122.4094, '789 Howard St, San Francisco',
    37.7949, -122.3994, 'SFO Airport',
    35.00, 38.50, 12.3, 25,
    'completed', 'completed', 5, 4,
    NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '30 minutes'
  );
