import express from 'express';
import { body } from 'express-validator';
import * as orderCtrl from '../controllers/order.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken); // Бүх замд нэвтрэх шаардлагатай

router.get('/', orderCtrl.getOrders);
router.get('/:id', orderCtrl.getOrderById);

router.post('/', [
    body('deliveryAddress').optional().trim().isLength({ max: 500 }),
    body('notes').optional().trim().isLength({ max: 1000 })
], orderCtrl.createOrder);

router.put('/:id/status', [
    body('status').isIn(['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'])
], orderCtrl.updateOrderStatus);

router.delete('/:id', orderCtrl.cancelOrder);

export default router;