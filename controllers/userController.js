const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { addUser, getUserByEmail } = require('../services/userService');
const JWT_SECRET = process.env.JWT_SECRET;

async function register(req, res, next) {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ message: 'Email, password, and role are required' });
        }
        await addUser({ email, password, role });
        res.json({ message: 'Реєстрація успішна' });
    } catch (err) {
        console.error('Помилка в register:', err);
        res.status(400).json({ message: err.message });
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Невірний email або пароль' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Невірний email або пароль' });
        }

        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const token = jwt.sign(
            { email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: { email: user.email, role: user.role }
        });
    } catch (err) {
        console.error('Помилка в login:', err);
        res.status(401).json({ message: err.message });
    }
}

module.exports = { register, login };