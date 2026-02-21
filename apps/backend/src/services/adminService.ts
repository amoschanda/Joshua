import { pool } from '../config/database.js';

// Dashboard analytics
export async function getDashboardStats() {
  const result = await pool.query(`
    SELECT 
      (SELECT COUNT(*) FROM users WHERE role = 'rider') as total_riders,
      (SELECT COUNT(*) FROM users WHERE role = 'driver') as total_drivers,
      (SELECT COUNT(*) FROM rides WHERE status = 'completed') as total_completed_rides,
      (SELECT COUNT(*) FROM rides WHERE status IN ('searching', 'accepted', 'in_progress')) as active_rides,
      (SELECT SUM(fare) FROM rides WHERE status = 'completed') as total_revenue,
      (SELECT AVG(rating) FROM users WHERE role = 'driver') as avg_driver_rating,
      (SELECT AVG(rating) FROM users WHERE role = 'rider') as avg_rider_rating,
      (SELECT COUNT(*) FROM payments WHERE status = 'completed') as total_transactions,
      (SELECT SUM(amount) FROM payments WHERE status = 'completed') as total_payments_processed,
      (SELECT COUNT(*) FROM payments WHERE status = 'failed') as failed_payments
  `);

  return result.rows[0];
}

// Revenue analytics
export async function getRevenueAnalytics(startDate: Date, endDate: Date) {
  const result = await pool.query(`
    SELECT 
      DATE(completed_at) as date,
      COUNT(*) as rides_count,
      SUM(fare) as daily_revenue,
      AVG(fare) as avg_fare,
      MAX(fare) as max_fare,
      MIN(fare) as min_fare
    FROM rides
    WHERE status = 'completed' AND completed_at BETWEEN $1 AND $2
    GROUP BY DATE(completed_at)
    ORDER BY date DESC
  `, [startDate, endDate]);

  return result.rows;
}

// User management
export async function getAllUsers(limit: number = 50, offset: number = 0) {
  const result = await pool.query(`
    SELECT id, name, email, phone, role, rating, total_rides, created_at
    FROM users
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `, [limit, offset]);

  return result.rows;
}

export async function getUserDetails(userId: string) {
  const result = await pool.query(`
    SELECT 
      u.id, u.name, u.email, u.phone, u.role, u.rating, u.total_rides, u.created_at,
      (SELECT COUNT(*) FROM rides WHERE rider_id = u.id OR driver_id = u.id) as total_activity,
      (SELECT SUM(fare) FROM rides WHERE (rider_id = u.id OR driver_id = u.id) AND status = 'completed') as total_value,
      (SELECT COUNT(*) FROM support_tickets WHERE user_id = u.id) as open_tickets
    FROM users u
    WHERE u.id = $1
  `, [userId]);

  return result.rows[0];
}

export async function disableUser(userId: string, reason: string) {
  const result = await pool.query(`
    UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id, is_active
  `, [userId]);

  // Log action
  await logAdminAction('disable_user', userId, reason);

  return result.rows[0];
}

export async function enableUser(userId: string) {
  const result = await pool.query(`
    UPDATE users SET is_active = true, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id, is_active
  `, [userId]);

  return result.rows[0];
}

// Ride monitoring
export async function getActiveRides() {
  const result = await pool.query(`
    SELECT 
      r.id, r.rider_id, r.driver_id, r.status, r.pickup_address, r.dropoff_address,
      rider.name as rider_name, driver.name as driver_name,
      r.started_at, r.created_at
    FROM rides r
    LEFT JOIN users rider ON r.rider_id = rider.id
    LEFT JOIN users driver ON r.driver_id = driver.id
    WHERE r.status IN ('searching', 'accepted', 'in_progress')
    ORDER BY r.created_at DESC
  `);

  return result.rows;
}

export async function getRideDetails(rideId: string) {
  const result = await pool.query(`
    SELECT 
      r.id, r.rider_id, r.driver_id, r.status, r.pickup_lat, r.pickup_lng, r.dropoff_lat, r.dropoff_lng,
      r.pickup_address, r.dropoff_address, r.fare, r.distance_km, r.duration_minutes,
      r.started_at, r.completed_at, r.created_at,
      rider.name as rider_name, rider.email as rider_email, rider.phone as rider_phone,
      driver.name as driver_name, driver.email as driver_email, driver.phone as driver_phone,
      p.stripe_payment_id, p.amount, p.status as payment_status
    FROM rides r
    LEFT JOIN users rider ON r.rider_id = rider.id
    LEFT JOIN users driver ON r.driver_id = driver.id
    LEFT JOIN payments p ON r.id = p.ride_id
    WHERE r.id = $1
  `, [rideId]);

  return result.rows[0];
}

export async function cancelRideAsAdmin(rideId: string, reason: string) {
  const result = await pool.query(`
    UPDATE rides SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND status != 'completed'
    RETURNING id, status
  `, [rideId]);

  // Log action
  await logAdminAction('cancel_ride', rideId, reason);

  return result.rows[0];
}

// Support ticket management
export async function getSupportTickets(status: string = 'open', limit: number = 50) {
  const result = await pool.query(`
    SELECT id, user_id, subject, description, status, priority, created_at, updated_at
    FROM support_tickets
    WHERE status = $1
    ORDER BY priority DESC, created_at ASC
    LIMIT $2
  `, [status, limit]);

  return result.rows;
}

export async function getTicketDetails(ticketId: string) {
  const result = await pool.query(`
    SELECT 
      t.id, t.user_id, t.subject, t.description, t.status, t.priority, t.created_at, t.updated_at,
      u.name, u.email, u.phone,
      (SELECT COUNT(*) FROM ticket_messages WHERE ticket_id = t.id) as message_count
    FROM support_tickets t
    LEFT JOIN users u ON t.user_id = u.id
    WHERE t.id = $1
  `, [ticketId]);

  return result.rows[0];
}

export async function respondToTicket(ticketId: string, message: string, adminId: string) {
  const result = await pool.query(`
    INSERT INTO ticket_messages (ticket_id, sender_id, message, is_admin)
    VALUES ($1, $2, $3, true)
    RETURNING id, message, created_at
  `, [ticketId, adminId, message]);

  return result.rows[0];
}

export async function closeTicket(ticketId: string, resolution: string) {
  const result = await pool.query(`
    UPDATE support_tickets SET status = 'closed', resolution = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, status
  `, [resolution, ticketId]);

  return result.rows[0];
}

// Fraud detection
export async function getFraudAlerts() {
  const result = await pool.query(`
    SELECT 
      id, user_id, alert_type, description, severity, created_at
    FROM fraud_alerts
    WHERE status = 'active'
    ORDER BY severity DESC, created_at DESC
  `);

  return result.rows;
}

export async function createFraudAlert(userId: string, alertType: string, description: string, severity: string) {
  const result = await pool.query(`
    INSERT INTO fraud_alerts (user_id, alert_type, description, severity, status)
    VALUES ($1, $2, $3, $4, 'active')
    RETURNING id, alert_type, severity
  `, [userId, alertType, description, severity]);

  return result.rows[0];
}

export async function resolveFraudAlert(alertId: string, resolution: string) {
  const result = await pool.query(`
    UPDATE fraud_alerts SET status = 'resolved', resolution = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, status
  `, [resolution, alertId]);

  return result.rows[0];
}

// Admin actions logging
export async function logAdminAction(action: string, targetId: string, details: string) {
  await pool.query(`
    INSERT INTO admin_logs (action, target_id, details)
    VALUES ($1, $2, $3)
  `, [action, targetId, details]);
}

export async function getAdminLogs(limit: number = 100) {
  const result = await pool.query(`
    SELECT id, action, target_id, details, created_at
    FROM admin_logs
    ORDER BY created_at DESC
    LIMIT $1
  `, [limit]);

  return result.rows;
}

// Promotions and campaigns
export async function createPromotion(code: string, discountPercent: number, maxUses: number, expiresAt: Date) {
  const result = await pool.query(`
    INSERT INTO promotions (code, discount_percent, max_uses, expires_at, status)
    VALUES ($1, $2, $3, $4, 'active')
    RETURNING id, code, discount_percent, max_uses, expires_at
  `, [code, discountPercent, maxUses, expiresAt]);

  return result.rows[0];
}

export async function getActivePromotions() {
  const result = await pool.query(`
    SELECT id, code, discount_percent, max_uses, uses_count, expires_at
    FROM promotions
    WHERE status = 'active' AND expires_at > CURRENT_TIMESTAMP
    ORDER BY expires_at ASC
  `);

  return result.rows;
}

export async function applyPromotion(rideId: string, promoCode: string) {
  const promoResult = await pool.query(`
    SELECT id, discount_percent, max_uses, uses_count FROM promotions
    WHERE code = $1 AND status = 'active' AND expires_at > CURRENT_TIMESTAMP
  `, [promoCode]);

  if (promoResult.rows.length === 0) {
    throw new Error('Invalid or expired promotion code');
  }

  const promo = promoResult.rows[0];
  if (promo.uses_count >= promo.max_uses) {
    throw new Error('Promotion code has reached maximum uses');
  }

  // Update ride with discount
  const rideResult = await pool.query(`
    SELECT fare FROM rides WHERE id = $1
  `, [rideId]);

  const originalFare = rideResult.rows[0].fare;
  const discount = (originalFare * promo.discount_percent) / 100;
  const finalFare = originalFare - discount;

  await pool.query(`
    UPDATE rides SET fare = $1, promo_code = $2, discount_amount = $3 WHERE id = $4
  `, [finalFare, promoCode, discount, rideId]);

  // Increment usage
  await pool.query(`
    UPDATE promotions SET uses_count = uses_count + 1 WHERE id = $1
  `, [promo.id]);

  return { originalFare, discount, finalFare };
}
