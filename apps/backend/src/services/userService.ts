import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function registerUser(
  name: string,
  email: string,
  phone: string,
  password: string,
  role: 'rider' | 'driver'
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, role`,
    [name, email, phone, hashedPassword, role]
  );

  return result.rows[0];
}

export async function loginUser(email: string, password: string) {
  const result = await pool.query(
    'SELECT id, name, email, phone, role, password_hash FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  const user = result.rows[0];
  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'secret-key',
    { expiresIn: '24h' }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  };
}

export async function getUserById(id: string) {
  const result = await pool.query(
    'SELECT id, name, email, phone, role, rating, total_rides, created_at FROM users WHERE id = $1',
    [id]
  );

  return result.rows[0];
}

export async function updateUserProfile(id: string, data: any) {
  const { name, avatar_url } = data;

  const result = await pool.query(
    `UPDATE users SET name = COALESCE($1, name), avatar_url = COALESCE($2, avatar_url), updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING id, name, email, phone, role, rating, total_rides`,
    [name, avatar_url, id]
  );

  return result.rows[0];
}
