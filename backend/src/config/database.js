import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'London_pop',

    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD || 'zywbis-nijxur-fIwgi5'),
    max: 20, 
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000, 
};

export const pool = new Pool(dbConfig);

pool.on('connect', () => {
    console.log('Connected to PostgreSQL database, амжилттай!');
});

pool.on('error', (err) => {
    console.error('Database connection үүсэхэд алдаа гарлаа:', err);
    process.exit(-1);
});

export const query = async (text, params) => {
    try {
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Query executed:', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Query error:', error);
        throw error;
    }
};

export const getClient = async () => {
    return await pool.connect();
};

export const closePool = async () => {
    await pool.end();
    console.log('Database connection haagdlaa');
};

export default {
    pool,
    query,
    getClient,
    closePool
};