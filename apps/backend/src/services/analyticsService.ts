import { pool } from '../config/database.js';

// Daily metrics
export async function getDailyMetrics(date: Date) {
  const result = await pool.query(`
    SELECT 
      DATE($1) as date,
      COUNT(DISTINCT rider_id) as unique_riders,
      COUNT(DISTINCT driver_id) as unique_drivers,
      COUNT(*) as total_rides,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_rides,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_rides,
      SUM(CASE WHEN status = 'completed' THEN fare ELSE 0 END) as total_revenue,
      AVG(CASE WHEN status = 'completed' THEN fare ELSE NULL END) as avg_fare,
      AVG(CASE WHEN status = 'completed' THEN distance_km ELSE NULL END) as avg_distance,
      AVG(CASE WHEN status = 'completed' THEN duration_minutes ELSE NULL END) as avg_duration
    FROM rides
    WHERE DATE(created_at) = DATE($1)
  `, [date]);

  return result.rows[0];
}

// Weekly metrics
export async function getWeeklyMetrics(startDate: Date, endDate: Date) {
  const result = await pool.query(`
    SELECT 
      DATE_TRUNC('week', created_at) as week_start,
      COUNT(DISTINCT rider_id) as unique_riders,
      COUNT(DISTINCT driver_id) as unique_drivers,
      COUNT(*) as total_rides,
      SUM(CASE WHEN status = 'completed' THEN fare ELSE 0 END) as weekly_revenue,
      AVG(rating) as avg_rating
    FROM rides
    WHERE created_at BETWEEN $1 AND $2
    GROUP BY DATE_TRUNC('week', created_at)
    ORDER BY week_start DESC
  `, [startDate, endDate]);

  return result.rows;
}

// Monthly metrics
export async function getMonthlyMetrics(year: number, month: number) {
  const result = await pool.query(`
    SELECT 
      DATE_TRUNC('month', created_at) as month_start,
      COUNT(DISTINCT rider_id) as unique_riders,
      COUNT(DISTINCT driver_id) as unique_drivers,
      COUNT(*) as total_rides,
      SUM(CASE WHEN status = 'completed' THEN fare ELSE 0 END) as monthly_revenue,
      COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancellations,
      AVG(CASE WHEN status = 'completed' THEN duration_minutes ELSE NULL END) as avg_ride_duration
    FROM rides
    WHERE EXTRACT(YEAR FROM created_at) = $1 AND EXTRACT(MONTH FROM created_at) = $2
    GROUP BY DATE_TRUNC('month', created_at)
  `, [year, month]);

  return result.rows[0];
}

// Driver analytics
export async function getTopDrivers(limit: number = 10) {
  const result = await pool.query(`
    SELECT 
      u.id, u.name, u.rating, u.total_rides,
      COUNT(r.id) as rides_this_month,
      SUM(r.fare) as earnings_this_month,
      AVG(r.fare) as avg_fare
    FROM users u
    LEFT JOIN rides r ON u.id = r.driver_id AND DATE_TRUNC('month', r.completed_at) = DATE_TRUNC('month', CURRENT_TIMESTAMP)
    WHERE u.role = 'driver'
    GROUP BY u.id, u.name, u.rating, u.total_rides
    ORDER BY earnings_this_month DESC
    LIMIT $1
  `, [limit]);

  return result.rows;
}

export async function getDriverPerformance(driverId: string, days: number = 30) {
  const result = await pool.query(`
    SELECT 
      u.id, u.name, u.rating, u.total_rides,
      COUNT(r.id) as rides_count,
      SUM(r.fare) as total_earnings,
      AVG(r.fare) as avg_fare,
      AVG(r.distance_km) as avg_distance,
      AVG(r.duration_minutes) as avg_duration,
      COUNT(CASE WHEN r.status = 'cancelled' THEN 1 END) as cancellations,
      ROUND(100.0 * COUNT(CASE WHEN r.status = 'completed' THEN 1 END) / COUNT(*), 2) as completion_rate
    FROM users u
    LEFT JOIN rides r ON u.id = r.driver_id AND r.created_at > CURRENT_TIMESTAMP - INTERVAL '1 day' * $2
    WHERE u.id = $1
    GROUP BY u.id, u.name, u.rating, u.total_rides
  `, [driverId, days]);

  return result.rows[0];
}

// Rider analytics
export async function getTopRiders(limit: number = 10) {
  const result = await pool.query(`
    SELECT 
      u.id, u.name, u.rating, u.total_rides,
      COUNT(r.id) as rides_this_month,
      SUM(r.fare) as spent_this_month,
      AVG(r.fare) as avg_fare
    FROM users u
    LEFT JOIN rides r ON u.id = r.rider_id AND DATE_TRUNC('month', r.created_at) = DATE_TRUNC('month', CURRENT_TIMESTAMP)
    WHERE u.role = 'rider'
    GROUP BY u.id, u.name, u.rating, u.total_rides
    ORDER BY spent_this_month DESC
    LIMIT $1
  `, [limit]);

  return result.rows;
}

// Geographic analytics
export async function getPopularRoutes(limit: number = 10) {
  const result = await pool.query(`
    SELECT 
      pickup_address, dropoff_address,
      COUNT(*) as ride_count,
      AVG(fare) as avg_fare,
      AVG(distance_km) as avg_distance,
      AVG(duration_minutes) as avg_duration
    FROM rides
    WHERE status = 'completed'
    GROUP BY pickup_address, dropoff_address
    ORDER BY ride_count DESC
    LIMIT $1
  `, [limit]);

  return result.rows;
}

export async function getHotspots() {
  const result = await pool.query(`
    SELECT 
      ROUND(pickup_lat::numeric, 2) as lat,
      ROUND(pickup_lng::numeric, 2) as lng,
      COUNT(*) as ride_count,
      AVG(fare) as avg_fare
    FROM rides
    WHERE status = 'completed'
    GROUP BY ROUND(pickup_lat::numeric, 2), ROUND(pickup_lng::numeric, 2)
    ORDER BY ride_count DESC
    LIMIT 20
  `);

  return result.rows;
}

// Cancellation analytics
export async function getCancellationAnalytics(days: number = 30) {
  const result = await pool.query(`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as total_rides,
      COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_rides,
      ROUND(100.0 * COUNT(CASE WHEN status = 'cancelled' THEN 1 END) / COUNT(*), 2) as cancellation_rate
    FROM rides
    WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '1 day' * $1
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `, [days]);

  return result.rows;
}

// Payment analytics
export async function getPaymentAnalytics(startDate: Date, endDate: Date) {
  const result = await pool.query(`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as total_transactions,
      SUM(amount) as total_amount,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful,
      COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
      COUNT(CASE WHEN status = 'refunded' THEN 1 END) as refunded,
      AVG(amount) as avg_transaction
    FROM payments
    WHERE created_at BETWEEN $1 AND $2
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `, [startDate, endDate]);

  return result.rows;
}

// User retention
export async function getUserRetention(days: number = 30) {
  const result = await pool.query(`
    SELECT 
      DATE(created_at) as signup_date,
      COUNT(*) as new_users,
      COUNT(CASE WHEN total_rides > 0 THEN 1 END) as active_users,
      ROUND(100.0 * COUNT(CASE WHEN total_rides > 0 THEN 1 END) / COUNT(*), 2) as retention_rate
    FROM users
    WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '1 day' * $1
    GROUP BY DATE(created_at)
    ORDER BY signup_date DESC
  `, [days]);

  return result.rows;
}

// Rating distribution
export async function getRatingDistribution(userRole: string = 'driver') {
  const result = await pool.query(`
    SELECT 
      FLOOR(rating) as rating_floor,
      COUNT(*) as user_count,
      ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM users WHERE role = $1), 2) as percentage
    FROM users
    WHERE role = $1
    GROUP BY FLOOR(rating)
    ORDER BY rating_floor DESC
  `, [userRole]);

  return result.rows;
}

// Export metrics for reporting
export async function exportMetrics(startDate: Date, endDate: Date) {
  const result = await pool.query(`
    SELECT 
      'rides' as metric_type,
      COUNT(*) as count,
      SUM(CASE WHEN status = 'completed' THEN fare ELSE 0 END) as value,
      AVG(CASE WHEN status = 'completed' THEN fare ELSE NULL END) as average
    FROM rides
    WHERE created_at BETWEEN $1 AND $2
    
    UNION ALL
    
    SELECT 
      'payments' as metric_type,
      COUNT(*) as count,
      SUM(amount) as value,
      AVG(amount) as average
    FROM payments
    WHERE created_at BETWEEN $1 AND $2
    
    UNION ALL
    
    SELECT 
      'users' as metric_type,
      COUNT(*) as count,
      NULL as value,
      NULL as average
    FROM users
    WHERE created_at BETWEEN $1 AND $2
  `, [startDate, endDate]);

  return result.rows;
}
