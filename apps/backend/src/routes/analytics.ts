import { Router } from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import {
  getDailyMetrics,
  getWeeklyMetrics,
  getMonthlyMetrics,
  getTopDrivers,
  getDriverPerformance,
  getTopRiders,
  getPopularRoutes,
  getHotspots,
  getCancellationAnalytics,
  getPaymentAnalytics,
  getUserRetention,
  getRatingDistribution,
  exportMetrics,
} from '../services/analyticsService.js';

const router = Router();

// Daily metrics
router.get('/daily', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { date = new Date() } = req.query;
    const metrics = await getDailyMetrics(new Date(date as string));
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Weekly metrics
router.get('/weekly', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { startDate, endDate } = req.query;
    const metrics = await getWeeklyMetrics(
      new Date(startDate as string),
      new Date(endDate as string)
    );
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Monthly metrics
router.get('/monthly', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { year, month } = req.query;
    const metrics = await getMonthlyMetrics(
      parseInt(year as string),
      parseInt(month as string)
    );
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Top drivers
router.get('/drivers/top', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { limit = 10 } = req.query;
    const drivers = await getTopDrivers(parseInt(limit as string));
    res.json(drivers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Driver performance
router.get(
  '/drivers/:driverId/performance',
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const { driverId } = req.params;
      const { days = 30 } = req.query;
      const performance = await getDriverPerformance(driverId, parseInt(days as string));
      res.json(performance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Top riders
router.get('/riders/top', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { limit = 10 } = req.query;
    const riders = await getTopRiders(parseInt(limit as string));
    res.json(riders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Popular routes
router.get('/routes/popular', authenticate, async (req: AuthRequest, res) => {
  try {
    const { limit = 10 } = req.query;
    const routes = await getPopularRoutes(parseInt(limit as string));
    res.json(routes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Hotspots
router.get('/hotspots', authenticate, async (req: AuthRequest, res) => {
  try {
    const hotspots = await getHotspots();
    res.json(hotspots);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Cancellation analytics
router.get(
  '/cancellations',
  authenticate,
  authorize('admin'),
  async (req: AuthRequest, res) => {
    try {
      const { days = 30 } = req.query;
      const analytics = await getCancellationAnalytics(parseInt(days as string));
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Payment analytics
router.get(
  '/payments',
  authenticate,
  authorize('admin'),
  async (req: AuthRequest, res) => {
    try {
      const { startDate, endDate } = req.query;
      const analytics = await getPaymentAnalytics(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// User retention
router.get(
  '/retention',
  authenticate,
  authorize('admin'),
  async (req: AuthRequest, res) => {
    try {
      const { days = 30 } = req.query;
      const retention = await getUserRetention(parseInt(days as string));
      res.json(retention);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Rating distribution
router.get(
  '/ratings',
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const { role = 'driver' } = req.query;
      const distribution = await getRatingDistribution(role as string);
      res.json(distribution);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Export metrics
router.get(
  '/export',
  authenticate,
  authorize('admin'),
  async (req: AuthRequest, res) => {
    try {
      const { startDate, endDate } = req.query;
      const metrics = await exportMetrics(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
