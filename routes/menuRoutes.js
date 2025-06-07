const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const menuController = require('../controllers/menuController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/', menuController.getAll);
router.get('/:id', menuController.getById);

router.post('/', authenticateToken, authorizeAdmin, menuController.create);
router.post('/menu-items/upload', authenticateToken, authorizeAdmin, upload.single('image'), menuController.addDishWithFile);

router.put('/:id', authenticateToken, authorizeAdmin, menuController.update);
router.put('/menu-items/upload/:id', authenticateToken, authorizeAdmin, upload.single('image'), menuController.updateDishWithFile);

router.delete('/:id', authenticateToken, authorizeAdmin, menuController.delete);

module.exports = router;
