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
        const res = await client.query('SELECT current_database(), current_user, inet_server_addr();');
        console.log('Connected to DB:', res.rows[0]);
        client.release();
        console.log('Connected to PostgreSQL');
    } catch (err) {
        console.error('Failed to connect to PostgreSQL:', err);
        throw err;
    }
};


module.exports = { pool, connect };
