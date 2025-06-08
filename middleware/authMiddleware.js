const jwt = require('jsonwebtoken');
require('dotenv').config();
const TOKEN_KEY = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Токен не надано' });
    }

    try {
        const user = jwt.verify(token, TOKEN_KEY);
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Токен невалідний' });
    }
}

function authorizeAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Доступ заборонено: лише для адміністраторів' });
    }
}

module.exports = { authenticateToken, authorizeAdmin };
