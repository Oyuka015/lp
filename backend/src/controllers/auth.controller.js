import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { generateToken } from '../middleware/auth.js';

// shine hereglegch burtgeh, nevtreh
export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { name, email, password, phone, address } = req.body;

    // Имэйл шалгах
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
        return res.status(400).json({ 
            error: 'User already exists', 
            message: 'Энэ имэйл хаяг аль хэдийн бүртгэгдсэн байна' 
        });
    }

    // Нууц үг шифрлэх
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await query(
        `INSERT INTO users (name, email, password_hash, phone, address) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, name, email, phone, address, created_at`,
        [name, email, passwordHash, phone || null, address || null]
    );

    const user = result.rows[0];
    const token = generateToken({ userId: user.id, email: user.email });

    res.status(201).json({
        message: 'User registered successfully',
        user,
        token
    });
};

// 2. Нэвтрэх
export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { email, password } = req.body;
    
    const userResult = await query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );

    if (userResult.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials', message: 'Имэйл эсвэл нууц үг буруу байна' });
    }

    const user = userResult.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials', message: 'Имэйл эсвэл нууц үг буруу байна' });
    }

    const token = generateToken({ userId: user.id, email: user.email });

    res.json({
        message: 'Login successful',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address
        },
        token
    });
};

// 3. Өөрийн мэдээллийг авах (Token-оор)
export const getMe = async (req, res) => {
    // AuthenticateToken middleware-ээс req.user-д мэдээлэл орж ирсэн байгаа
    const userResult = await query(
        'SELECT id, name, email, phone, address, created_at FROM users WHERE id = $1',
        [req.user.id]
    );

    if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: userResult.rows[0] });
};