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

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));

app.use(express.json());

// Статика для зображень
app.use('/assets/images', express.static(path.join(__dirname, 'assets/images')));

app.use('/api/auth', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/upload', uploadRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
});

connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Не вдалося підключитись до бази даних:', err);
});
