const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { addUser, getUserByEmail } = require('../services/userService');
require('dotenv').config();
const TOKEN_KEY = process.env.JWT_SECRET;

class AuthController {
    static async register(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }

            if (!/^.{8,}$/.test(password)) {
                return res.status(400).json({ message: 'Password must be at least 8 characters long' });
            }

            await addUser({ email, password, role: 'user' });
            res.status(201).json({ message: 'Реєстрація успішна' });
        } catch (err) {
            console.error('Помилка в register:', err);
            res.status(400).json({ message: err.message });
        }
    }


    static async registerAdmin(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }

            if (!/^.{8,}$/.test(password)) {
                return res.status(400).json({ message: 'Password must be at least 8 characters long' });
            }
            await addUser({ email, password, role: 'admin' });
            res.status(201).json({ message: 'Адміністратора створено успішно' });
        } catch (err) {
            console.error('Помилка в registerAdmin:', err);
            res.status(400).json({ message: err.message });
        }
    }

    static async login(req, res) {
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
            if (!TOKEN_KEY) {
                throw new Error('JWT_SECRET is not defined');
            }
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                TOKEN_KEY,
                { expiresIn: '1h' }
            );
            res.json({
                token,
                user: { id: user.id, email: user.email, role: user.role },
            });
        } catch (err) {
            console.error('Помилка в login:', err);
            res.status(401).json({ message: err.message });
        }
    }
}

module.exports = AuthController;