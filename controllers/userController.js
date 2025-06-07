const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { addUser, getUserByEmail } = require('../services/userService');
require('dotenv').config();
const TOKEN_KEY = process.env.JWT_SECRET;

class AuthController {
    static async register(req, res) {
        console.log('[register] Спроба реєстрації користувача:', req.body.email);
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                console.log('[register] Відсутні email або пароль');
                return res.status(400).json({ message: 'Email and password are required' });
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                console.log('[register] Невірний формат email:', email);
                return res.status(400).json({ message: 'Invalid email format' });
            }

            if (!/^.{8,}$/.test(password)) {
                console.log('[register] Пароль занадто короткий');
                return res.status(400).json({ message: 'Password must be at least 8 characters long' });
            }

            await addUser({ email, password, role: 'user' });
            console.log('[register] Користувача успішно додано:', email);
            res.status(201).json({ message: 'Реєстрація успішна' });
        } catch (err) {
            console.error('[register] Помилка в register:', err);
            res.status(400).json({ message: err.message });
        }
    }

    static async registerAdmin(req, res) {
        console.log('[registerAdmin] Спроба створити адміністратора:', req.body.email);
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                console.log('[registerAdmin] Відсутні email або пароль');
                return res.status(400).json({ message: 'Email and password are required' });
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                console.log('[registerAdmin] Невірний формат email:', email);
                return res.status(400).json({ message: 'Invalid email format' });
            }

            if (!/^.{8,}$/.test(password)) {
                console.log('[registerAdmin] Пароль занадто короткий');
                return res.status(400).json({ message: 'Password must be at least 8 characters long' });
            }
            await addUser({ email, password, role: 'admin' });
            console.log('[registerAdmin] Адміністратора успішно додано:', email);
            res.status(201).json({ message: 'Адміністратора створено успішно' });
        } catch (err) {
            console.error('[registerAdmin] Помилка в registerAdmin:', err);
            res.status(400).json({ message: err.message });
        }
    }

    static async login(req, res) {
        console.log('[login] Спроба входу користувача:', req.body.email);
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                console.log('[login] Відсутні email або пароль');
                return res.status(400).json({ message: 'Email and password are required' });
            }
            const user = await getUserByEmail(email);
            if (!user) {
                console.log('[login] Користувача не знайдено:', email);
                return res.status(401).json({ message: 'Невірний email або пароль' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log('[login] Невірний пароль для:', email);
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
            console.log('[login] Успішний вхід для:', email);
            res.json({
                token,
                user: { id: user.id, email: user.email, role: user.role },
            });
        } catch (err) {
            console.error('[login] Помилка в login:', err);
            res.status(401).json({ message: err.message });
        }
    }
}

module.exports = AuthController;
