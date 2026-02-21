import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import {
  saveFavoriteLocation,
  getSavedLocations,
  deleteSavedLocation,
  setRidePreferences,
  getRidePreferences,
  addEmergencyContact,
  getEmergencyContacts,
  deleteEmergencyContact,
  getReferralCode,
  applyReferralCode,
  getRiderStats,
  addPaymentMethod,
  getPaymentMethods,
  setDefaultPaymentMethod,
  scheduleRide,
  getScheduledRides,
} from '../services/riderService.js';

const router = Router();

// Saved locations
router.post(
  '/locations',
  authenticate,
  authorize('rider'),
  [
    body('label').notEmpty().withMessage('Label required'),
    body('lat').isFloat().withMessage('Valid latitude required'),
    body('lng').isFloat().withMessage('Valid longitude required'),
    body('address').notEmpty().withMessage('Address required'),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { label, lat, lng, address } = req.body;
      const location = await saveFavoriteLocation(req.user!.id, label, lat, lng, address);
      res.status(201).json(location);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get('/locations', authenticate, authorize('rider'), async (req: AuthRequest, res) => {
  try {
    const locations = await getSavedLocations(req.user!.id);
    res.json(locations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete(
  '/locations/:locationId',
  authenticate,
  authorize('rider'),
  async (req: AuthRequest, res) => {
    try {
      const { locationId } = req.params;
      const deleted = await deleteSavedLocation(locationId, req.user!.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Location not found' });
      }
      res.json({ message: 'Location deleted' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Ride preferences
router.post(
  '/preferences',
  authenticate,
  authorize('rider'),
  async (req: AuthRequest, res) => {
    try {
      const preferences = await setRidePreferences(req.user!.id, req.body);
      res.json(preferences);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get('/preferences', authenticate, authorize('rider'), async (req: AuthRequest, res) => {
  try {
    const preferences = await getRidePreferences(req.user!.id);
    res.json(preferences);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Emergency contacts
router.post(
  '/emergency-contacts',
  authenticate,
  authorize('rider'),
  [
    body('name').notEmpty().withMessage('Name required'),
    body('phone').notEmpty().withMessage('Phone required'),
    body('relationship').notEmpty().withMessage('Relationship required'),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, phone, relationship } = req.body;
      const contact = await addEmergencyContact(req.user!.id, name, phone, relationship);
      res.status(201).json(contact);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get('/emergency-contacts', authenticate, authorize('rider'), async (req: AuthRequest, res) => {
  try {
    const contacts = await getEmergencyContacts(req.user!.id);
    res.json(contacts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete(
  '/emergency-contacts/:contactId',
  authenticate,
  authorize('rider'),
  async (req: AuthRequest, res) => {
    try {
      const { contactId } = req.params;
      const deleted = await deleteEmergencyContact(contactId, req.user!.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      res.json({ message: 'Contact deleted' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Referral program
router.get('/referral', authenticate, authorize('rider'), async (req: AuthRequest, res) => {
  try {
    const referral = await getReferralCode(req.user!.id);
    res.json(referral);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  '/referral/apply',
  authenticate,
  authorize('rider'),
  [body('referralCode').notEmpty().withMessage('Referral code required')],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { referralCode } = req.body;
      const result = await applyReferralCode(req.user!.id, referralCode);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Stats
router.get('/stats', authenticate, authorize('rider'), async (req: AuthRequest, res) => {
  try {
    const stats = await getRiderStats(req.user!.id);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Payment methods
router.post(
  '/payment-methods',
  authenticate,
  authorize('rider'),
  [
    body('type').isIn(['card', 'wallet']).withMessage('Valid payment type required'),
    body('token').notEmpty().withMessage('Token required'),
    body('last4').notEmpty().withMessage('Last 4 digits required'),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { type, token, last4 } = req.body;
      const method = await addPaymentMethod(req.user!.id, type, token, last4);
      res.status(201).json(method);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get('/payment-methods', authenticate, authorize('rider'), async (req: AuthRequest, res) => {
  try {
    const methods = await getPaymentMethods(req.user!.id);
    res.json(methods);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  '/payment-methods/:methodId/default',
  authenticate,
  authorize('rider'),
  async (req: AuthRequest, res) => {
    try {
      const { methodId } = req.params;
      const method = await setDefaultPaymentMethod(methodId, req.user!.id);
      res.json(method);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Schedule ride
router.post(
  '/schedule',
  authenticate,
  authorize('rider'),
  [
    body('pickupLat').isFloat().withMessage('Valid pickup latitude required'),
    body('pickupLng').isFloat().withMessage('Valid pickup longitude required'),
    body('dropoffLat').isFloat().withMessage('Valid dropoff latitude required'),
    body('dropoffLng').isFloat().withMessage('Valid dropoff longitude required'),
    body('scheduledTime').isISO8601().withMessage('Valid scheduled time required'),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { pickupLat, pickupLng, dropoffLat, dropoffLng, scheduledTime } = req.body;
      const ride = await scheduleRide(
        req.user!.id,
        pickupLat,
        pickupLng,
        dropoffLat,
        dropoffLng,
        new Date(scheduledTime)
      );
      res.status(201).json(ride);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get('/schedule', authenticate, authorize('rider'), async (req: AuthRequest, res) => {
  try {
    const rides = await getScheduledRides(req.user!.id);
    res.json(rides);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
