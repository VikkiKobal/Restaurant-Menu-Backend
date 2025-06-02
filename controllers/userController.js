const jwt = require('jsonwebtoken');
const { registerUser, loginUser } = require('../services/userService');
const JWT_SECRET = process.env.JWT_SECRET;

async function register(req, res) {
    try {
        const { email, password, role } = req.body;
        await registerUser(email, password, role);
        res.json({ message: 'Реєстрація успішна' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await loginUser(email, password);

        console.log('User from DB:', user);

        const token = jwt.sign(
            { email: user.Email, role: user.Role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                email: user.Email,
                role: user.Role
            }
        });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
}

module.exports = { register, login };
