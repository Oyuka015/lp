import express from 'express';
import { body } from 'express-validator';
import * as cartCtrl from '../controllers/cart.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Бүх замууд authenticateToken (нэвтэрсэн байх) шаардана
router.use(authenticateToken);

router.get('/', cartCtrl.getCart);

router.post('/add', [
    body('foodId').isUUID().withMessage('Valid food ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], cartCtrl.addToCart);

router.put('/update', [
    body('foodId').isUUID().withMessage('Valid food ID is required'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or greater')
], cartCtrl.updateCartItem);

router.delete('/remove/:foodId', cartCtrl.removeFromCart);
router.delete('/clear', cartCtrl.clearCart);

export default router;