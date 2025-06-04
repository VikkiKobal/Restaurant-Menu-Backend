const db = require('../db');
const bcrypt = require('bcrypt');

async function addUser({ email, password, role }) {
    try {
        if (!email || !password || !role) {
            throw new Error('Email, password, and role are required');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('Invalid email format');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await db.pool.query(
            `INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *`,
            [email.trim().toLowerCase(), hashedPassword, role]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Помилка додавання користувача:', err);
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
        console.error('Помилка пошуку користувача:', err);
        throw new Error('Failed to fetch user');
    }
}

module.exports = { addUser, getUserByEmail };