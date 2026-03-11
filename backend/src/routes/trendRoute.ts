import express from 'express';
import { getAlerts, getTrends } from '../controllers/trendController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();


router.get('/alerts', protect, getAlerts);


router.get('/product', protect, getTrends);

export default router;
