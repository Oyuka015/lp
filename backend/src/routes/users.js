import express from 'express';
import { body } from 'express-validator';
import * as userCtrl from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken); 

router.get('/profile', userCtrl.getProfile);

router.put('/profile', [
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('phone').optional().isMobilePhone(),
    body('address').optional().trim().isLength({ max: 500 })
], userCtrl.updateProfile);

router.put('/change-password', [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
], userCtrl.changePassword);

router.delete('/account', userCtrl.deleteAccount);

export default router;