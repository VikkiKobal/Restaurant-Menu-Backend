const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Correct path
const menuController = require('../controllers/menuController');

router.get('/', menuController.getAll);
router.get('/:id', menuController.getById);
router.post('/', menuController.create);
router.post('/menu-items/upload', upload.single('image'), menuController.addDishWithFile);
router.put('/:id', menuController.update);
router.put('/menu-items/upload/:id', upload.single('image'), menuController.updateDishWithFile);
router.delete('/:id', menuController.delete);

module.exports = router;