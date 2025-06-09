const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.resolve(__dirname, '..', 'assets', 'images');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Multer destination:', uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext)
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9\-_]/g, '');
        const uniqueName = `${baseName}-${Date.now()}${ext}`;
        console.log('Multer saving file as:', uniqueName);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

module.exports = upload;
