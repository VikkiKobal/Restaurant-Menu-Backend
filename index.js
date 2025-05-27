const express = require('express');
require('dotenv').config();
const path = require('path');

const { connect } = require('./db');
const menuRoutes = require('./routes/menuRoutes');
const uploadRoutes = require('./routes/uploadRoutes');  // <-- додано

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Робимо папку 'assets/images' доступною на /assets/images/...
app.use('/assets/images', express.static(path.join(__dirname, 'assets/images')));

app.use('/api/menu', menuRoutes);
app.use('/api/upload', uploadRoutes);   // <-- додано

// Middleware для обробки помилок
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
});

// Встановлюємо підключення до БД перед запуском сервера
connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Не вдалося підключитись до бази даних:', err);
});
