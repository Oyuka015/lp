import express from 'express';
import * as foodCtrl from '../controllers/food.controller.js';
import { optionalAuth, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, foodCtrl.getAllFoods);
router.get('/categories/all', foodCtrl.getCategories);
router.get('/saved/all', authenticateToken, foodCtrl.getSavedFoods);
router.get('/:id', optionalAuth, foodCtrl.getFoodById);

// Private routes
router.post('/:id/save', authenticateToken, foodCtrl.toggleSaveFood);

export default router;