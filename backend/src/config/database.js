const { Pool } = require('pg');
require('dotenv').config({ path: '../../.env' });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'foodrush_db',
    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD || '1234'),
    max: 20, 
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000, 
};

const pool = new Pool(dbConfig);

pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Database connection error:', err);
    process.exit(-1);
});

const query = async (text, params) => {
    try {
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('📊 Query executed:', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('❌ Query error:', error);
        throw error;
    }
};

const getClient = async () => {
    return await pool.connect();
};

const closePool = async () => {
    await pool.end();
    console.log('🔌 Database connection pool closed');
};

module.exports = {
    pool,
    query,
    getClient,
    closePool
};