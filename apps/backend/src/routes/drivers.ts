import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import {
  calculateSurgePricing,
  submitDriverDocuments,
  getDriverDocuments,
  getDriverStats,
  getDriverIncentives,
  claimIncentive,
  setDriverSchedule,
  getDriverSchedule,
} from '../services/driverService.js';

const router = Router();

// Get driver stats
router.get('/stats', authenticate, authorize('driver'), async (req: AuthRequest, res) => {
  try {
    const stats = await getDriverStats(req.user!.id);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Submit documents
router.post(
  '/documents',
  authenticate,
  authorize('driver'),
  [
    body('licenseNumber').notEmpty().withMessage('License number required'),
    body('licenseExpiry').isISO8601().withMessage('Valid license expiry date required'),
    body('insuranceNumber').notEmpty().withMessage('Insurance number required'),
    body('insuranceExpiry').isISO8601().withMessage('Valid insurance expiry date required'),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const documents = await submitDriverDocuments(req.user!.id, req.body);
      res.status(201).json({ message: 'Documents submitted for verification', documents });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get documents
router.get('/documents', authenticate, authorize('driver'), async (req: AuthRequest, res) => {
  try {
    const documents = await getDriverDocuments(req.user!.id);
    res.json(documents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get incentives
router.get('/incentives', authenticate, authorize('driver'), async (req: AuthRequest, res) => {
  try {
    const incentives = await getDriverIncentives(req.user!.id);
    res.json(incentives);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Claim incentive
router.post(
  '/incentives/:incentiveId/claim',
  authenticate,
  authorize('driver'),
  async (req: AuthRequest, res) => {
    try {
      const { incentiveId } = req.params;
      const result = await claimIncentive(incentiveId, req.user!.id);
      res.json({ message: 'Incentive claimed', result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Set schedule
router.post(
  '/schedule',
  authenticate,
  authorize('driver'),
  async (req: AuthRequest, res) => {
    try {
      const schedule = await setDriverSchedule(req.user!.id, req.body);
      res.json({ message: 'Schedule updated', schedule });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get schedule
router.get('/schedule', authenticate, authorize('driver'), async (req: AuthRequest, res) => {
  try {
    const schedule = await getDriverSchedule(req.user!.id);
    res.json(schedule);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate surge pricing
router.post(
  '/surge-pricing',
  authenticate,
  [
    body('pickupLat').isFloat().withMessage('Valid latitude required'),
    body('pickupLng').isFloat().withMessage('Valid longitude required'),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { pickupLat, pickupLng } = req.body;
      const surgePricing = await calculateSurgePricing(pickupLat, pickupLng);
      res.json({ surgePricing });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
