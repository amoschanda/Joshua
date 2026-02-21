import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import {
  getDashboardStats,
  getRevenueAnalytics,
  getAllUsers,
  getUserDetails,
  disableUser,
  enableUser,
  getActiveRides,
  getRideDetails,
  cancelRideAsAdmin,
  getSupportTickets,
  getTicketDetails,
  respondToTicket,
  closeTicket,
  getFraudAlerts,
  createFraudAlert,
  resolveFraudAlert,
  createPromotion,
  getActivePromotions,
  applyPromotion,
} from '../services/adminService.js';

const router = Router();

// Dashboard
router.get('/dashboard', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Revenue analytics
router.get(
  '/analytics/revenue',
  authenticate,
  authorize('admin'),
  async (req: AuthRequest, res) => {
    try {
      const { startDate, endDate } = req.query;
      const analytics = await getRevenueAnalytics(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// User management
router.get('/users', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const users = await getAllUsers(
      parseInt(limit as string),
      parseInt(offset as string)
    );
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users/:userId', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;
    const user = await getUserDetails(userId);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  '/users/:userId/disable',
  authenticate,
  authorize('admin'),
  [body('reason').notEmpty().withMessage('Reason required')],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { userId } = req.params;
      const { reason } = req.body;
      const result = await disableUser(userId, reason);
      res.json({ message: 'User disabled', result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  '/users/:userId/enable',
  authenticate,
  authorize('admin'),
  async (req: AuthRequest, res) => {
    try {
      const { userId } = req.params;
      const result = await enableUser(userId);
      res.json({ message: 'User enabled', result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Ride monitoring
router.get('/rides/active', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const rides = await getActiveRides();
    res.json(rides);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/rides/:rideId', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { rideId } = req.params;
    const ride = await getRideDetails(rideId);
    res.json(ride);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  '/rides/:rideId/cancel',
  authenticate,
  authorize('admin'),
  [body('reason').notEmpty().withMessage('Reason required')],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { rideId } = req.params;
      const { reason } = req.body;
      const result = await cancelRideAsAdmin(rideId, reason);
      res.json({ message: 'Ride cancelled', result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Support tickets
router.get('/support/tickets', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { status = 'open', limit = 50 } = req.query;
    const tickets = await getSupportTickets(status as string, parseInt(limit as string));
    res.json(tickets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/support/tickets/:ticketId', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await getTicketDetails(ticketId);
    res.json(ticket);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  '/support/tickets/:ticketId/respond',
  authenticate,
  authorize('admin'),
  [body('message').notEmpty().withMessage('Message required')],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { ticketId } = req.params;
      const { message } = req.body;
      const response = await respondToTicket(ticketId, message, req.user!.id);
      res.status(201).json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  '/support/tickets/:ticketId/close',
  authenticate,
  authorize('admin'),
  [body('resolution').notEmpty().withMessage('Resolution required')],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { ticketId } = req.params;
      const { resolution } = req.body;
      const result = await closeTicket(ticketId, resolution);
      res.json({ message: 'Ticket closed', result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Fraud detection
router.get('/fraud/alerts', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const alerts = await getFraudAlerts();
    res.json(alerts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  '/fraud/alerts',
  authenticate,
  authorize('admin'),
  [
    body('userId').notEmpty().withMessage('User ID required'),
    body('alertType').notEmpty().withMessage('Alert type required'),
    body('description').notEmpty().withMessage('Description required'),
    body('severity').isIn(['low', 'medium', 'high']).withMessage('Valid severity required'),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { userId, alertType, description, severity } = req.body;
      const alert = await createFraudAlert(userId, alertType, description, severity);
      res.status(201).json(alert);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  '/fraud/alerts/:alertId/resolve',
  authenticate,
  authorize('admin'),
  [body('resolution').notEmpty().withMessage('Resolution required')],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { alertId } = req.params;
      const { resolution } = req.body;
      const result = await resolveFraudAlert(alertId, resolution);
      res.json({ message: 'Alert resolved', result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Promotions
router.post(
  '/promotions',
  authenticate,
  authorize('admin'),
  [
    body('code').notEmpty().withMessage('Code required'),
    body('discountPercent').isFloat({ min: 0, max: 100 }).withMessage('Valid discount required'),
    body('maxUses').isInt({ min: 1 }).withMessage('Max uses required'),
    body('expiresAt').isISO8601().withMessage('Valid expiry date required'),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { code, discountPercent, maxUses, expiresAt } = req.body;
      const promotion = await createPromotion(code, discountPercent, maxUses, new Date(expiresAt));
      res.status(201).json(promotion);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get('/promotions', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const promotions = await getActivePromotions();
    res.json(promotions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
