import express from 'express';
import { body } from 'express-validator';
import * as authCtrl from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Validation Rules
const registerValidation = [
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('phone').optional().isMobilePhone(),
    body('address').optional().trim().isLength({ max: 500 })
];

const loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
];

// Routes
router.post('/register', registerValidation, authCtrl.register);
router.post('/login', loginValidation, authCtrl.login);

router.get('/me', authenticateToken, authCtrl.getMe);

export default router;