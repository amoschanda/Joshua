import { pool } from '../config/database.js';

// Saved locations
export async function saveFavoriteLocation(userId: string, label: string, lat: number, lng: number, address: string) {
  const result = await pool.query(
    `INSERT INTO saved_locations (user_id, label, latitude, longitude, address)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, label, latitude, longitude, address`,
    [userId, label, lat, lng, address]
  );

  return result.rows[0];
}

export async function getSavedLocations(userId: string) {
  const result = await pool.query(
    `SELECT id, label, latitude, longitude, address, created_at
     FROM saved_locations WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
}

export async function deleteSavedLocation(locationId: string, userId: string) {
  const result = await pool.query(
    `DELETE FROM saved_locations WHERE id = $1 AND user_id = $2 RETURNING id`,
    [locationId, userId]
  );

  return result.rows.length > 0;
}

// Ride preferences
export async function setRidePreferences(userId: string, preferences: any) {
  const { musicPreference, temperaturePreference, conversationLevel, petFriendly, wheelchairAccessible } = preferences;

  const result = await pool.query(
    `INSERT INTO ride_preferences (user_id, music_preference, temperature_preference, conversation_level, pet_friendly, wheelchair_accessible)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id) DO UPDATE SET
       music_preference = $2, temperature_preference = $3, conversation_level = $4, pet_friendly = $5, wheelchair_accessible = $6
     RETURNING id, music_preference, temperature_preference, conversation_level, pet_friendly, wheelchair_accessible`,
    [userId, musicPreference, temperaturePreference, conversationLevel, petFriendly, wheelchairAccessible]
  );

  return result.rows[0];
}

export async function getRidePreferences(userId: string) {
  const result = await pool.query(
    `SELECT music_preference, temperature_preference, conversation_level, pet_friendly, wheelchair_accessible
     FROM ride_preferences WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0];
}

// Emergency contacts
export async function addEmergencyContact(userId: string, name: string, phone: string, relationship: string) {
  const result = await pool.query(
    `INSERT INTO emergency_contacts (user_id, name, phone, relationship)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, phone, relationship`,
    [userId, name, phone, relationship]
  );

  return result.rows[0];
}

export async function getEmergencyContacts(userId: string) {
  const result = await pool.query(
    `SELECT id, name, phone, relationship FROM emergency_contacts WHERE user_id = $1`,
    [userId]
  );

  return result.rows;
}

export async function deleteEmergencyContact(contactId: string, userId: string) {
  const result = await pool.query(
    `DELETE FROM emergency_contacts WHERE id = $1 AND user_id = $2 RETURNING id`,
    [contactId, userId]
  );

  return result.rows.length > 0;
}

// Referral program
export async function getReferralCode(userId: string) {
  const result = await pool.query(
    `SELECT referral_code, referrals_count, referral_earnings FROM users WHERE id = $1`,
    [userId]
  );

  return result.rows[0];
}

export async function applyReferralCode(userId: string, referralCode: string) {
  // Find referrer
  const referrerResult = await pool.query(
    `SELECT id FROM users WHERE referral_code = $1`,
    [referralCode]
  );

  if (referrerResult.rows.length === 0) {
    throw new Error('Invalid referral code');
  }

  const referrerId = referrerResult.rows[0].id;

  // Check if already applied
  const existingResult = await pool.query(
    `SELECT id FROM referrals WHERE referred_user_id = $1`,
    [userId]
  );

  if (existingResult.rows.length > 0) {
    throw new Error('Referral already applied');
  }

  // Create referral record
  await pool.query(
    `INSERT INTO referrals (referrer_id, referred_user_id, status, bonus_amount)
     VALUES ($1, $2, 'pending', 10.00)`,
    [referrerId, userId]
  );

  // Give referral bonus to new user
  await pool.query(
    `UPDATE users SET referral_earnings = referral_earnings + 10.00 WHERE id = $1`,
    [userId]
  );

  return { success: true, bonus: 10.00 };
}

export async function completeReferral(referralId: string) {
  const result = await pool.query(
    `UPDATE referrals SET status = 'completed', updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND status = 'pending'
     RETURNING referrer_id, bonus_amount`,
    [referralId]
  );

  if (result.rows.length > 0) {
    const { referrer_id, bonus_amount } = result.rows[0];
    // Give bonus to referrer
    await pool.query(
      `UPDATE users SET referral_earnings = referral_earnings + $1 WHERE id = $2`,
      [bonus_amount, referrer_id]
    );
  }

  return result.rows[0];
}

// Rider statistics
export async function getRiderStats(userId: string) {
  const result = await pool.query(
    `SELECT 
      u.total_rides,
      u.rating,
      (SELECT COUNT(*) FROM rides WHERE rider_id = $1 AND status = 'completed') as completed_rides,
      (SELECT SUM(fare) FROM rides WHERE rider_id = $1 AND status = 'completed') as total_spent,
      (SELECT AVG(fare) FROM rides WHERE rider_id = $1 AND status = 'completed') as avg_fare,
      (SELECT COUNT(*) FROM rides WHERE rider_id = $1 AND status = 'cancelled') as cancelled_rides,
      (SELECT COUNT(*) FROM referrals WHERE referred_user_id = $1 AND status = 'completed') as referrals_count,
      (SELECT COALESCE(referral_earnings, 0) FROM users WHERE id = $1) as referral_earnings
     FROM users u
     WHERE u.id = $1`,
    [userId]
  );

  return result.rows[0];
}

// Rider payment methods
export async function addPaymentMethod(userId: string, type: string, token: string, last4: string) {
  const result = await pool.query(
    `INSERT INTO payment_methods (user_id, type, stripe_token, last_four, is_default)
     VALUES ($1, $2, $3, $4, false)
     RETURNING id, type, last_four, is_default`,
    [userId, type, token, last4]
  );

  return result.rows[0];
}

export async function getPaymentMethods(userId: string) {
  const result = await pool.query(
    `SELECT id, type, last_four, is_default FROM payment_methods WHERE user_id = $1 ORDER BY is_default DESC`,
    [userId]
  );

  return result.rows;
}

export async function setDefaultPaymentMethod(paymentMethodId: string, userId: string) {
  // Remove default from others
  await pool.query(
    `UPDATE payment_methods SET is_default = false WHERE user_id = $1`,
    [userId]
  );

  // Set new default
  const result = await pool.query(
    `UPDATE payment_methods SET is_default = true WHERE id = $1 AND user_id = $2
     RETURNING id, is_default`,
    [paymentMethodId, userId]
  );

  return result.rows[0];
}

// Ride scheduling
export async function scheduleRide(userId: string, pickupLat: number, pickupLng: number, dropoffLat: number, dropoffLng: number, scheduledTime: Date) {
  const result = await pool.query(
    `INSERT INTO scheduled_rides (rider_id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, scheduled_time, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'scheduled')
     RETURNING id, scheduled_time, status`,
    [userId, pickupLat, pickupLng, dropoffLat, dropoffLng, scheduledTime]
  );

  return result.rows[0];
}

export async function getScheduledRides(userId: string) {
  const result = await pool.query(
    `SELECT id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, scheduled_time, status
     FROM scheduled_rides WHERE rider_id = $1 AND status = 'scheduled' AND scheduled_time > CURRENT_TIMESTAMP
     ORDER BY scheduled_time ASC`,
    [userId]
  );

  return result.rows;
}
