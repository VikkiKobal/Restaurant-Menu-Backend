const db = require('../db');
const bcrypt = require('bcrypt');

async function addUser({ email, password, role = 'user' }) {
    try {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('Invalid email format');
        }

        const existingUser = await db.pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email.trim().toLowerCase()]
        );
        if (existingUser.rows.length > 0) {
            throw new Error('Email already exists');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await db.pool.query(
            `INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *`,
            [email.trim().toLowerCase(), hashedPassword, role]
        );

        return result.rows[0];
    } catch (err) {
        console.error(`[addUser error]: ${err.message}`);
        throw new Error(err.message || 'Failed to add user');
    }
}

async function getUserByEmail(email) {
    try {
        if (!email) {
            throw new Error('Email is required');
        }

        const result = await db.pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email.trim().toLowerCase()]
        );

        return result.rows[0];
    } catch (err) {
        console.error(`[getUserByEmail error]: ${err.message}`);
        throw new Error('Failed to fetch user');
    }
}

module.exports = { addUser, getUserByEmail };
