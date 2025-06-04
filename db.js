require('dotenv').config();
const { Pool } = require('pg');

const isRender = process.env.RENDER === 'true';

const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: isRender ? { rejectUnauthorized: false } : false,
    }
    : {
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: isRender ? { rejectUnauthorized: false } : false,
    };

const pool = new Pool(poolConfig);

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
