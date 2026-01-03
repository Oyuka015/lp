const { Pool } = require('pg');
require('dotenv').config({ path: '../../.env' });

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433,
    database: process.env.DB_NAME || 'foodrush_db',
    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD || '1234'),
    max: 20, // maximum number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // how long to wait for connection
};

// Create connection pool
const pool = new Pool(dbConfig);

// Test connection
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Database connection error:', err);
    process.exit(-1);
});

// Query helper function
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

// Get client from pool
const getClient = async () => {
    return await pool.connect();
};

// Close pool connection
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