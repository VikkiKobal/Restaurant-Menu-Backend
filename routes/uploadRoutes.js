const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Налаштування multer для збереження файлів у assets/images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../assets/images')); // шлях до папки
    },
    filename: function (req, file, cb) {
        // Зберігаємо файл з унікальним ім'ям: timestamp + оригінальне ім'я
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

// Маршрут для upload одного файлу (поле "image")
router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    // Повертаємо URL для доступу до файлу
    const imageUrl = `/assets/images/${req.file.filename}`;
    res.status(201).json({ imageUrl });
});

module.exports = router;
