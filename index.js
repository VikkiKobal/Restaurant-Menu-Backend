const express = require('express');
require('dotenv').config();
const path = require('path');
const cors = require('cors');

const { connect } = require('./db');
const userRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
    'http://localhost:8080',               // локальний фронтенд
    'https://menurestaurantweb.netlify.app/',  // твій Netlify фронтенд (заміни на свій реальний URL)
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // для Postman, curl, серверних запитів
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json());

app.use('/assets/images', express.static(path.join(__dirname, 'assets/images')));
app.use('/menu', require('./routes/menuRoutes'));

app.use('/api/auth', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/upload', uploadRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
});

// Підключення до БД та старт сервера
connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Не вдалося підключитись до бази даних:', err);
    });
