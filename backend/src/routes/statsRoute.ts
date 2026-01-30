import express from 'express';
import { getMyStats } from '../controllers/statscontroller';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// Get current user's statistics
router.get('/me', protect, getMyStats);

export default router;
