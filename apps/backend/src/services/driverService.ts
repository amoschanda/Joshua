import { pool } from '../config/database.js';

// Calculate surge pricing based on demand
export async function calculateSurgePricing(pickupLat: number, pickupLng: number): Promise<number> {
  // Get active rides in area
  const result = await pool.query(
    `SELECT COUNT(*) as active_rides FROM rides 
     WHERE status IN ('searching', 'accepted', 'in_progress')
     AND ABS(pickup_lat - $1) < 0.05 AND ABS(pickup_lng - $2) < 0.05`,
    [pickupLat, pickupLng]
  );

  const activeRides = parseInt(result.rows[0].active_rides);
  const availableDrivers = await getAvailableDriversCount(pickupLat, pickupLng);

  // Surge multiplier: if more rides than drivers, increase price
  if (availableDrivers === 0) return 3.0; // 3x surge
  const ratio = activeRides / availableDrivers;
  
  if (ratio > 3) return 2.5;
  if (ratio > 2) return 2.0;
  if (ratio > 1.5) return 1.5;
  return 1.0; // No surge
}

async function getAvailableDriversCount(lat: number, lng: number): Promise<number> {
  const result = await pool.query(
    `SELECT COUNT(*) as count FROM drivers 
     WHERE status = 'available' 
     AND ABS(current_lat - $1) < 0.05 AND ABS(current_lng - $2) < 0.05`,
    [lat, lng]
  );
  return parseInt(result.rows[0].count);
}

// Driver verification
export async function submitDriverDocuments(userId: string, documents: any) {
  const { licenseNumber, licenseExpiry, insuranceNumber, insuranceExpiry, backgroundCheckUrl } = documents;

  const result = await pool.query(
    `INSERT INTO driver_documents (user_id, license_number, license_expiry, insurance_number, insurance_expiry, background_check_url, verification_status)
     VALUES ($1, $2, $3, $4, $5, $6, 'pending')
     RETURNING id, verification_status`,
    [userId, licenseNumber, licenseExpiry, insuranceNumber, insuranceExpiry, backgroundCheckUrl]
  );

  return result.rows[0];
}

export async function getDriverDocuments(userId: string) {
  const result = await pool.query(
    `SELECT id, license_number, license_expiry, insurance_number, insurance_expiry, background_check_url, verification_status, created_at
     FROM driver_documents WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );

  return result.rows[0];
}

export async function verifyDriver(userId: string, approved: boolean) {
  const status = approved ? 'verified' : 'rejected';

  const result = await pool.query(
    `UPDATE driver_documents SET verification_status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $2
     RETURNING id, verification_status`,
    [status, userId]
  );

  if (approved) {
    // Update driver status to available
    await pool.query(
      `UPDATE drivers SET status = 'available' WHERE user_id = $1`,
      [userId]
    );
  }

  return result.rows[0];
}

// Driver ratings and reviews
export async function submitDriverRating(rideId: string, fromUserId: string, toUserId: string, rating: number, comment: string) {
  const result = await pool.query(
    `INSERT INTO ratings (ride_id, from_user_id, to_user_id, rating, comment)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, rating, comment`,
    [rideId, fromUserId, toUserId, rating, comment]
  );

  // Update driver average rating
  await updateDriverRating(toUserId);

  return result.rows[0];
}

async function updateDriverRating(userId: string) {
  const result = await pool.query(
    `SELECT AVG(rating) as avg_rating FROM ratings WHERE to_user_id = $1`,
    [userId]
  );

  const avgRating = parseFloat(result.rows[0].avg_rating) || 5.0;

  await pool.query(
    `UPDATE users SET rating = $1 WHERE id = $2`,
    [avgRating, userId]
  );
}

// Driver statistics
export async function getDriverStats(userId: string) {
  const result = await pool.query(
    `SELECT 
      d.total_earnings,
      u.total_rides,
      u.rating,
      (SELECT COUNT(*) FROM rides WHERE driver_id = $1 AND status = 'completed' AND DATE(completed_at) = CURRENT_DATE) as today_rides,
      (SELECT SUM(fare) FROM rides WHERE driver_id = $1 AND status = 'completed' AND DATE(completed_at) = CURRENT_DATE) as today_earnings,
      (SELECT AVG(EXTRACT(EPOCH FROM (completed_at - started_at))/60) FROM rides WHERE driver_id = $1 AND status = 'completed') as avg_ride_duration,
      (SELECT COUNT(*) FROM rides WHERE driver_id = $1 AND status = 'cancelled') as cancelled_rides
     FROM drivers d
     JOIN users u ON d.user_id = u.id
     WHERE d.user_id = $1`,
    [userId]
  );

  return result.rows[0];
}

// Driver promotions and incentives
export async function getDriverIncentives(userId: string) {
  const result = await pool.query(
    `SELECT id, title, description, target_rides, bonus_amount, current_rides, expires_at, status
     FROM driver_incentives 
     WHERE user_id = $1 AND status = 'active' AND expires_at > CURRENT_TIMESTAMP`,
    [userId]
  );

  return result.rows;
}

export async function claimIncentive(incentiveId: string, userId: string) {
  const result = await pool.query(
    `UPDATE driver_incentives SET status = 'claimed', updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND user_id = $2 AND current_rides >= target_rides
     RETURNING id, bonus_amount`,
    [incentiveId, userId]
  );

  if (result.rows.length > 0) {
    const bonus = result.rows[0].bonus_amount;
    // Add bonus to driver earnings
    await pool.query(
      `UPDATE drivers SET total_earnings = total_earnings + $1 WHERE user_id = $2`,
      [bonus, userId]
    );
  }

  return result.rows[0];
}

// Driver schedule and availability
export async function setDriverSchedule(userId: string, schedule: any) {
  const result = await pool.query(
    `INSERT INTO driver_schedules (user_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (user_id) DO UPDATE SET
       monday = $2, tuesday = $3, wednesday = $4, thursday = $5, friday = $6, saturday = $7, sunday = $8
     RETURNING id, monday, tuesday, wednesday, thursday, friday, saturday, sunday`,
    [userId, schedule.monday, schedule.tuesday, schedule.wednesday, schedule.thursday, schedule.friday, schedule.saturday, schedule.sunday]
  );

  return result.rows[0];
}

export async function getDriverSchedule(userId: string) {
  const result = await pool.query(
    `SELECT monday, tuesday, wednesday, thursday, friday, saturday, sunday
     FROM driver_schedules WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0];
}
