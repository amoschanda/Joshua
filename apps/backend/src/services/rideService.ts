import { pool } from '../config/database.js';

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function requestRide(
  riderId: string,
  pickupLat: number,
  pickupLng: number,
  dropoffLat: number,
  dropoffLng: number,
  pickupAddress: string,
  dropoffAddress: string
) {
  const result = await pool.query(
    `INSERT INTO rides (rider_id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, pickup_address, dropoff_address, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'searching')
     RETURNING id, rider_id, status, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, created_at`,
    [riderId, pickupLat, pickupLng, dropoffLat, dropoffLng, pickupAddress, dropoffAddress]
  );

  return result.rows[0];
}

export async function findNearestDriver(pickupLat: number, pickupLng: number, maxDistance: number = 5) {
  const result = await pool.query(
    `SELECT d.id, d.user_id, d.current_lat, d.current_lng, u.name, u.rating
     FROM drivers d
     JOIN users u ON d.user_id = u.id
     WHERE d.status = 'available' AND d.current_lat IS NOT NULL AND d.current_lng IS NOT NULL
     ORDER BY SQRT(POWER(d.current_lat - $1, 2) + POWER(d.current_lng - $2, 2)) ASC
     LIMIT 1`,
    [pickupLat, pickupLng]
  );

  if (result.rows.length === 0) return null;

  const driver = result.rows[0];
  const distance = calculateDistance(pickupLat, pickupLng, driver.current_lat, driver.current_lng);

  if (distance > maxDistance) return null;

  return { ...driver, distance };
}

export async function acceptRide(rideId: string, driverId: string) {
  const result = await pool.query(
    `UPDATE rides SET driver_id = $1, status = 'accepted', updated_at = CURRENT_TIMESTAMP
     WHERE id = $2 AND status = 'searching'
     RETURNING id, rider_id, driver_id, status, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng`,
    [driverId, rideId]
  );

  if (result.rows.length === 0) {
    throw new Error('Ride not found or already accepted');
  }

  return result.rows[0];
}

export async function startRide(rideId: string) {
  const result = await pool.query(
    `UPDATE rides SET status = 'in_progress', started_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND status = 'arrived'
     RETURNING id, rider_id, driver_id, status, started_at`,
    [rideId]
  );

  return result.rows[0];
}

export async function completeRide(rideId: string, fare: number, distance: number, duration: number) {
  const result = await pool.query(
    `UPDATE rides SET status = 'completed', completed_at = CURRENT_TIMESTAMP, fare = $1, distance_km = $2, duration_minutes = $3, updated_at = CURRENT_TIMESTAMP
     WHERE id = $4 AND status = 'in_progress'
     RETURNING id, rider_id, driver_id, status, fare, completed_at`,
    [fare, distance, duration, rideId]
  );

  if (result.rows.length === 0) {
    throw new Error('Ride not found or not in progress');
  }

  const ride = result.rows[0];

  // Update driver earnings
  await pool.query(
    'UPDATE drivers SET total_earnings = total_earnings + $1 WHERE user_id = $2',
    [fare, ride.driver_id]
  );

  // Update ride counts
  await pool.query('UPDATE users SET total_rides = total_rides + 1 WHERE id = $1', [ride.rider_id]);
  await pool.query('UPDATE users SET total_rides = total_rides + 1 WHERE id = $1', [ride.driver_id]);

  return ride;
}

export async function getRideHistory(userId: string, limit: number = 10) {
  const result = await pool.query(
    `SELECT r.id, r.rider_id, r.driver_id, r.status, r.pickup_address, r.dropoff_address, r.fare, r.distance_km, r.duration_minutes, r.completed_at, r.created_at,
            u.name as driver_name, u.rating as driver_rating
     FROM rides r
     LEFT JOIN users u ON r.driver_id = u.id
     WHERE r.rider_id = $1 OR r.driver_id = $1
     ORDER BY r.created_at DESC
     LIMIT $2`,
    [userId, limit]
  );

  return result.rows;
}

export async function getRideById(rideId: string) {
  const result = await pool.query(
    `SELECT r.id, r.rider_id, r.driver_id, r.status, r.pickup_lat, r.pickup_lng, r.dropoff_lat, r.dropoff_lng,
            r.pickup_address, r.dropoff_address, r.fare, r.distance_km, r.duration_minutes, r.started_at, r.completed_at,
            rider.name as rider_name, rider.phone as rider_phone,
            driver.name as driver_name, driver.phone as driver_phone, driver.rating as driver_rating
     FROM rides r
     LEFT JOIN users rider ON r.rider_id = rider.id
     LEFT JOIN users driver ON r.driver_id = driver.id
     WHERE r.id = $1`,
    [rideId]
  );

  return result.rows[0];
}
