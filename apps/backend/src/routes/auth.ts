import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { registerUser, loginUser, getUserById, updateUserProfile } from '../services/userService.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Register
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['rider', 'driver']).withMessage('Role must be rider or driver'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, phone, password, role } = req.body;
      const user = await registerUser(name, email, phone, password, role);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error: any) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Email or phone already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const result = await loginUser(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
);

// Get profile
router.get('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await getUserById(req.user!.id);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put(
  '/profile',
  authenticate,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('avatar_url').optional().isURL().withMessage('Invalid URL'),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await updateUserProfile(req.user!.id, req.body);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
