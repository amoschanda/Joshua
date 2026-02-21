import Stripe from 'stripe';
import { pool } from '../config/database.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function createPaymentIntent(rideId: string, amount: number) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    metadata: {
      rideId,
    },
  });

  // Store payment record in database
  await pool.query(
    `INSERT INTO payments (ride_id, stripe_payment_id, amount, status)
     VALUES ($1, $2, $3, 'pending')`,
    [rideId, paymentIntent.id, amount]
  );

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
}

export async function confirmPayment(paymentIntentId: string) {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status === 'succeeded') {
    // Update payment status
    await pool.query(
      `UPDATE payments SET status = 'completed', updated_at = CURRENT_TIMESTAMP
       WHERE stripe_payment_id = $1`,
      [paymentIntentId]
    );

    return { success: true, status: 'completed' };
  } else if (paymentIntent.status === 'processing') {
    return { success: false, status: 'processing' };
  } else {
    // Update payment status to failed
    await pool.query(
      `UPDATE payments SET status = 'failed', updated_at = CURRENT_TIMESTAMP
       WHERE stripe_payment_id = $1`,
      [paymentIntentId]
    );

    return { success: false, status: 'failed' };
  }
}

export async function getPaymentHistory(userId: string) {
  const result = await pool.query(
    `SELECT p.id, p.ride_id, p.amount, p.status, p.created_at, r.pickup_address, r.dropoff_address
     FROM payments p
     JOIN rides r ON p.ride_id = r.id
     WHERE r.rider_id = $1 OR r.driver_id = $1
     ORDER BY p.created_at DESC`,
    [userId]
  );

  return result.rows;
}

export async function refundPayment(paymentIntentId: string) {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
  });

  if (refund.status === 'succeeded') {
    await pool.query(
      `UPDATE payments SET status = 'refunded', updated_at = CURRENT_TIMESTAMP
       WHERE stripe_payment_id = $1`,
      [paymentIntentId]
    );

    return { success: true };
  }

  return { success: false };
}
