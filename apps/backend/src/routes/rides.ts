import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import {
  requestRide,
  findNearestDriver,
  acceptRide,
  startRide,
  completeRide,
  getRideHistory,
  getRideById,
} from '../services/rideService.js';

const router = Router();

// Request a ride (rider only)
router.post(
  '/request',
  authenticate,
  authorize('rider'),
  [
    body('pickupLat').isFloat().withMessage('Valid pickup latitude required'),
    body('pickupLng').isFloat().withMessage('Valid pickup longitude required'),
    body('dropoffLat').isFloat().withMessage('Valid dropoff latitude required'),
    body('dropoffLng').isFloat().withMessage('Valid dropoff longitude required'),
    body('pickupAddress').notEmpty().withMessage('Pickup address required'),
    body('dropoffAddress').notEmpty().withMessage('Dropoff address required'),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { pickupLat, pickupLng, dropoffLat, dropoffLng, pickupAddress, dropoffAddress } = req.body;
      const ride = await requestRide(
        req.user!.id,
        pickupLat,
        pickupLng,
        dropoffLat,
        dropoffLng,
        pickupAddress,
        dropoffAddress
      );

      // Find nearest driver
      const driver = await findNearestDriver(pickupLat, pickupLng);

      res.status(201).json({
        ride,
        availableDriver: driver ? { id: driver.user_id, name: driver.name, distance: driver.distance } : null,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Accept ride (driver only)
router.post(
  '/:rideId/accept',
  authenticate,
  authorize('driver'),
  async (req: AuthRequest, res) => {
    try {
      const { rideId } = req.params;
      const ride = await acceptRide(rideId, req.user!.id);
      res.json({ message: 'Ride accepted', ride });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Start ride (driver only)
router.post(
  '/:rideId/start',
  authenticate,
  authorize('driver'),
  async (req: AuthRequest, res) => {
    try {
      const { rideId } = req.params;
      const ride = await startRide(rideId);
      res.json({ message: 'Ride started', ride });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Complete ride (driver only)
router.post(
  '/:rideId/complete',
  authenticate,
  authorize('driver'),
  [
    body('fare').isFloat({ min: 0 }).withMessage('Valid fare required'),
    body('distance').isFloat({ min: 0 }).withMessage('Valid distance required'),
    body('duration').isInt({ min: 0 }).withMessage('Valid duration required'),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { rideId } = req.params;
      const { fare, distance, duration } = req.body;
      const ride = await completeRide(rideId, fare, distance, duration);
      res.json({ message: 'Ride completed', ride });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get ride details
router.get('/:rideId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { rideId } = req.params;
    const ride = await getRideById(rideId);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    res.json(ride);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get ride history
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const rides = await getRideHistory(req.user!.id, limit);
    res.json(rides);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
