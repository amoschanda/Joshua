import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { createPaymentIntent, confirmPayment, getPaymentHistory, refundPayment } from '../services/paymentService.js';

const router = Router();

// Create payment intent
router.post(
  '/intent',
  authenticate,
  [
    body('rideId').notEmpty().withMessage('Ride ID required'),
    body('amount').isFloat({ min: 0 }).withMessage('Valid amount required'),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { rideId, amount } = req.body;
      const paymentData = await createPaymentIntent(rideId, amount);
      res.json(paymentData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Confirm payment
router.post(
  '/confirm',
  authenticate,
  [body('paymentIntentId').notEmpty().withMessage('Payment Intent ID required')],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { paymentIntentId } = req.body;
      const result = await confirmPayment(paymentIntentId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get payment history
router.get('/history', authenticate, async (req: AuthRequest, res) => {
  try {
    const payments = await getPaymentHistory(req.user!.id);
    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Refund payment
router.post(
  '/refund',
  authenticate,
  [body('paymentIntentId').notEmpty().withMessage('Payment Intent ID required')],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { paymentIntentId } = req.body;
      const result = await refundPayment(paymentIntentId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
