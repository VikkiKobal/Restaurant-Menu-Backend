require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
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