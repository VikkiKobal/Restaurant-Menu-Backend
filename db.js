require('dotenv').config();
const { Pool } = require('pg');

const isRender = process.env.RENDER === 'true';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isRender ? { rejectUnauthorized: false } : false,
});

const connect = async () => {
    try {
        const client = await pool.connect();
        client.release();
        console.log('Connected to PostgreSQL');
    } catch (err) {
        console.error('Failed to connect to PostgreSQL:', err);
        throw err;
    }
};

module.exports = { pool, connect };
