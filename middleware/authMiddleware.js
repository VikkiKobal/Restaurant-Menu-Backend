const jwt = require('jsonwebtoken');
require('dotenv').config();
const TOKEN_KEY = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log(`[authenticateToken] Токен не надано. IP: ${req.ip}, URL: ${req.originalUrl}`);
        return res.status(401).json({ message: 'Токен не надано' });
    }

    try {
        const user = jwt.verify(token, TOKEN_KEY);
        req.user = user;
        console.log(`[authenticateToken] Токен успішно підтверджено. Користувач: ${user.email || user.id}, IP: ${req.ip}`);
        next();
    } catch (err) {
        console.error(`[authenticateToken] Аутентифікація не вдалася: ${err.message}, Токен: ${token}, IP: ${req.ip}, URL: ${req.originalUrl}`);
        return res.status(403).json({ message: 'Токен невалідний' });
    }
}

function authorizeAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        console.log(`[authorizeAdmin] Доступ дозволено адміністратору: ${req.user.email || req.user.id}, IP: ${req.ip}`);
        next();
    } else {
        console.log(`[authorizeAdmin] Доступ заборонено. Користувач: ${req.user ? (req.user.email || req.user.id) : 'неавторизований'}, IP: ${req.ip}`);
        res.status(403).json({ message: 'Доступ заборонено: лише для адміністраторів' });
    }
}

module.exports = { authenticateToken, authorizeAdmin };
