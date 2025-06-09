const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');


router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `/assets/images/${req.file.filename}`;
    res.status(201).json({ imageUrl });
});

module.exports = router;
