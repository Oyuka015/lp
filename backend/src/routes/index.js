import express from 'express';
const router = express.Router();

import authRoutes from './auth.js';
import userRoutes from './users.js';
import foodRoutes from './foods.js';
import orderRoutes from './orders.js';
import savedRoutes from './saved.js';
import cartRoutes from './cart.js';

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/foods', foodRoutes);
router.use('/orders', orderRoutes);
router.use('/saved', savedRoutes);
router.use('/cart', cartRoutes);

export default router;