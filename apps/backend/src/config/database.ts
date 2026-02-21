import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'joshua',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export async function initializeDatabase() {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        role VARCHAR(20) NOT NULL CHECK (role IN ('rider', 'driver', 'admin')),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255),
        rating DECIMAL(3,2) DEFAULT 5.0,
        total_rides INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS drivers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_type VARCHAR(50) NOT NULL,
        vehicle_number VARCHAR(50) NOT NULL,
        license_number VARCHAR(50) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('offline', 'available', 'busy')),
        current_lat DECIMAL(10,8),
        current_lng DECIMAL(11,8),
        total_earnings DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS rides (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
        status VARCHAR(20) DEFAULT 'searching' CHECK (status IN ('searching', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled')),
        pickup_lat DECIMAL(10,8) NOT NULL,
        pickup_lng DECIMAL(11,8) NOT NULL,
        dropoff_lat DECIMAL(10,8),
        dropoff_lng DECIMAL(11,8),
        pickup_address VARCHAR(255),
        dropoff_address VARCHAR(255),
        fare DECIMAL(10,2),
        distance_km DECIMAL(10,2),
        duration_minutes INT,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
        stripe_payment_id VARCHAR(255),
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
        payment_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ratings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
        from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
      CREATE INDEX IF NOT EXISTS idx_rides_driver_id ON rides(driver_id);
      CREATE INDEX IF NOT EXISTS idx_rides_rider_id ON rides(rider_id);
      CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
      CREATE INDEX IF NOT EXISTS idx_drivers_user_id ON drivers(user_id);
      CREATE INDEX IF NOT EXISTS idx_payments_ride_id ON payments(ride_id);
      CREATE INDEX IF NOT EXISTS idx_ratings_ride_id ON ratings(ride_id);
    `);

    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export async function closeDatabase() {
  await pool.end();
}
