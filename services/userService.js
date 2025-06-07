const db = require('../db');
const bcrypt = require('bcrypt');

async function addUser({ email, password, role = 'user' }) {
    try {
        console.log(`[${new Date().toISOString()}] addUser called with email: ${email}, role: ${role}`);

        if (!email || !password) {
            console.warn(`[${new Date().toISOString()}] addUser failed: Email and password are required`);
            throw new Error('Email and password are required');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            console.warn(`[${new Date().toISOString()}] addUser failed: Invalid email format - ${email}`);
            throw new Error('Invalid email format');
        }
        const existingUser = await db.pool.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
        if (existingUser.rows.length > 0) {
            console.warn(`[${new Date().toISOString()}] addUser failed: Email already exists - ${email}`);
            throw new Error('Email already exists');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await db.pool.query(
            `INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *`,
            [email.trim().toLowerCase(), hashedPassword, role]
        );
        console.log(`[${new Date().toISOString()}] addUser success: User created with id ${result.rows[0].id}`);
        return result.rows[0];
    } catch (err) {
        console.error(`[${new Date().toISOString()}] addUser error: ${err.message}`);
        throw new Error(err.message || 'Failed to add user');
    }
}

async function getUserByEmail(email) {
    try {
        console.log(`[${new Date().toISOString()}] getUserByEmail called with email: ${email}`);

        if (!email) {
            console.warn(`[${new Date().toISOString()}] getUserByEmail failed: Email is required`);
            throw new Error('Email is required');
        }
        const result = await db.pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email.trim().toLowerCase()]
        );
        if (!result.rows.length) {
            console.warn(`[${new Date().toISOString()}] getUserByEmail: No user found with email ${email}`);
        } else {
            console.log(`[${new Date().toISOString()}] getUserByEmail success: User found with id ${result.rows[0].id}`);
        }
        return result.rows[0];
    } catch (err) {
        console.error(`[${new Date().toISOString()}] getUserByEmail error: ${err.message}`);
        throw new Error('Failed to fetch user');
    }
}

module.exports = { addUser, getUserByEmail };
