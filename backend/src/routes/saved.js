import express from 'express';
import * as savedCtrl from '../controllers/saved.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Бүх замд токен шаардлагатай
router.use(authenticateToken);

router.get('/', savedCtrl.getSavedFoods);
router.post('/:foodId', savedCtrl.addToSaved);
router.delete('/:foodId', savedCtrl.removeFromSaved);

export default router;