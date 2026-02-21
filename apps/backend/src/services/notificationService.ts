import { pool } from '../config/database.js';
import axios from 'axios';

// Push notification
export async function sendPushNotification(userId: string, title: string, body: string, data?: any) {
  // Get user's device tokens
  const result = await pool.query(`
    SELECT device_token FROM device_tokens WHERE user_id = $1 AND is_active = true
  `, [userId]);

  const tokens = result.rows.map(r => r.device_token);

  if (tokens.length === 0) return;

  // Send via Firebase Cloud Messaging (implement with your FCM key)
  for (const token of tokens) {
    try {
      await axios.post('https://fcm.googleapis.com/fcm/send', {
        to: token,
        notification: { title, body },
        data: data || {},
      }, {
        headers: {
          'Authorization': `key=${process.env.FCM_SERVER_KEY}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('FCM error:', error);
    }
  }

  // Store notification in database
  await storeNotification(userId, 'push', title, body);
}

// SMS notification
export async function sendSMSNotification(userId: string, message: string) {
  const userResult = await pool.query(`
    SELECT phone FROM users WHERE id = $1
  `, [userId]);

  if (userResult.rows.length === 0) return;

  const phone = userResult.rows[0].phone;

  // Send via Twilio (implement with your Twilio credentials)
  try {
    await axios.post('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
      From: process.env.TWILIO_PHONE_NUMBER,
      To: phone,
      Body: message,
    }, {
      auth: {
        username: process.env.TWILIO_ACCOUNT_SID,
        password: process.env.TWILIO_AUTH_TOKEN,
      },
    });
  } catch (error) {
    console.error('SMS error:', error);
  }

  // Store notification
  await storeNotification(userId, 'sms', 'SMS', message);
}

// Email notification
export async function sendEmailNotification(userId: string, subject: string, htmlContent: string) {
  const userResult = await pool.query(`
    SELECT email FROM users WHERE id = $1
  `, [userId]);

  if (userResult.rows.length === 0) return;

  const email = userResult.rows[0].email;

  // Send via SendGrid (implement with your SendGrid API key)
  try {
    await axios.post('https://api.sendgrid.com/v3/mail/send', {
      personalizations: [{
        to: [{ email }],
        subject,
      }],
      from: { email: process.env.SENDGRID_FROM_EMAIL },
      content: [{
        type: 'text/html',
        value: htmlContent,
      }],
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Email error:', error);
  }

  // Store notification
  await storeNotification(userId, 'email', subject, htmlContent);
}

// Store notification
async function storeNotification(userId: string, type: string, title: string, body: string) {
  await pool.query(`
    INSERT INTO notifications (user_id, type, title, body, is_read)
    VALUES ($1, $2, $3, $4, false)
  `, [userId, type, title, body]);
}

// Get user notifications
export async function getUserNotifications(userId: string, limit: number = 20) {
  const result = await pool.query(`
    SELECT id, type, title, body, is_read, created_at
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2
  `, [userId, limit]);

  return result.rows;
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  await pool.query(`
    UPDATE notifications SET is_read = true WHERE id = $1
  `, [notificationId]);
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(userId: string) {
  await pool.query(`
    UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false
  `, [userId]);
}

// Notification templates
export async function sendRideRequestNotification(driverId: string, rideId: string, pickupAddress: string, fare: number) {
  await sendPushNotification(
    driverId,
    'New Ride Request',
    `${pickupAddress} - $${fare.toFixed(2)}`,
    { rideId, type: 'ride_request' }
  );
}

export async function sendRideAcceptedNotification(riderId: string, driverName: string, driverRating: number) {
  await sendPushNotification(
    riderId,
    'Ride Accepted',
    `${driverName} (${driverRating}⭐) is on the way`,
    { type: 'ride_accepted' }
  );
}

export async function sendRideArrivedNotification(riderId: string) {
  await sendPushNotification(
    riderId,
    'Driver Arrived',
    'Your driver has arrived at the pickup location',
    { type: 'ride_arrived' }
  );
}

export async function sendRideCompletedNotification(riderId: string, fare: number, driverName: string) {
  await sendPushNotification(
    riderId,
    'Ride Completed',
    `Fare: $${fare.toFixed(2)} - Rate your ride with ${driverName}`,
    { type: 'ride_completed' }
  );
}

export async function sendPaymentConfirmationNotification(userId: string, amount: number, rideId: string) {
  await sendPushNotification(
    userId,
    'Payment Confirmed',
    `$${amount.toFixed(2)} has been charged to your account`,
    { type: 'payment_confirmed', rideId }
  );

  await sendEmailNotification(
    userId,
    'Payment Confirmation',
    `<h2>Payment Confirmed</h2><p>Amount: $${amount.toFixed(2)}</p><p>Ride ID: ${rideId}</p>`
  );
}

export async function sendDriverEarningsNotification(driverId: string, earnings: number) {
  await sendPushNotification(
    driverId,
    'Earnings Updated',
    `You've earned $${earnings.toFixed(2)} today`,
    { type: 'earnings_update' }
  );
}

export async function sendSupportTicketResponseNotification(userId: string, ticketId: string) {
  await sendPushNotification(
    userId,
    'Support Response',
    'A support agent has responded to your ticket',
    { type: 'support_response', ticketId }
  );
}

export async function sendPromotionNotification(userId: string, promoCode: string, discount: number) {
  await sendPushNotification(
    userId,
    'Special Offer',
    `Use code ${promoCode} for ${discount}% off your next ride`,
    { type: 'promotion', promoCode }
  );
}

// Notification preferences
export async function setNotificationPreferences(userId: string, preferences: any) {
  const { pushEnabled, smsEnabled, emailEnabled, promotionalEmails } = preferences;

  const result = await pool.query(`
    INSERT INTO notification_preferences (user_id, push_enabled, sms_enabled, email_enabled, promotional_emails)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (user_id) DO UPDATE SET
      push_enabled = $2, sms_enabled = $3, email_enabled = $4, promotional_emails = $5
    RETURNING id, push_enabled, sms_enabled, email_enabled, promotional_emails
  `, [userId, pushEnabled, smsEnabled, emailEnabled, promotionalEmails]);

  return result.rows[0];
}

export async function getNotificationPreferences(userId: string) {
  const result = await pool.query(`
    SELECT push_enabled, sms_enabled, email_enabled, promotional_emails
    FROM notification_preferences WHERE user_id = $1
  `, [userId]);

  return result.rows[0];
}

// Register device token
export async function registerDeviceToken(userId: string, token: string, platform: string) {
  const result = await pool.query(`
    INSERT INTO device_tokens (user_id, device_token, platform, is_active)
    VALUES ($1, $2, $3, true)
    ON CONFLICT (device_token) DO UPDATE SET is_active = true
    RETURNING id, device_token, platform
  `, [userId, token, platform]);

  return result.rows[0];
}

export async function unregisterDeviceToken(token: string) {
  await pool.query(`
    UPDATE device_tokens SET is_active = false WHERE device_token = $1
  `, [token]);
}
