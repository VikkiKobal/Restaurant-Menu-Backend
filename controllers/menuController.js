const menuService = require('../services/menuService');

exports.getAll = async (req, res, next) => {
    try {
        const { categoryId } = req.query;
        let items;
        if (categoryId) {
            if (isNaN(parseInt(categoryId))) {
                return res.status(400).json({ message: 'Invalid categoryId' });
            }
            items = await menuService.findByCategory(Number(categoryId));
        } else {
            items = await menuService.findAll();
        }
        console.log('items from DB:', items);
        res.json(items);
    } catch (err) {
        console.error('Error in getAll:', err.stack);
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const item = await menuService.findById(Number(req.params.id));
        if (!item) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(item);
    } catch (err) {
        console.error('Error in getById:', err.stack);
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const newItem = await menuService.create(req.body);
        res.status(201).json(newItem);
    } catch (err) {
        console.error('Error in create controller:', err.stack);
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        await menuService.delete(Number(req.params.id));
        res.status(204).send();
    } catch (err) {
        console.error('Error in delete:', err.stack);
        next(err);
    }
};

exports.addDishWithFile = async (req, res, next) => {
    try {
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);
        const { name, price, description, is_available, category_id, is_special, portion_size } = req.body;
        if (!name || !price || !category_id) {
            return res.status(400).json({ message: 'Name, price, and category_id are required' });
        }
        const portionSizeNumber = portion_size ? Number(portion_size) : null;
        if (portion_size && (isNaN(portionSizeNumber) || portionSizeNumber < 0)) {
            return res.status(400).json({ message: 'Portion size must be a positive number' });
        }

        const image_url = req.file ? `/assets/images/${req.file.filename}` : null;
        const newItem = await menuService.create({
            name,
            price: Number(price),
            description: description || null,
            image_url,
            is_available: is_available === 'true' || is_available === true,
            category_id: Number(category_id),
            is_special: is_special === 'true' || is_special === true,
            portion_size: portionSizeNumber,
        });
        res.status(201).json(newItem);
    } catch (err) {
        console.error('Помилка в addDishWithFile:', err.stack);
        next(err);
    }
};

exports.updateDishWithFile = async (req, res, next) => {
    try {
        console.log('PUT /api/menu/menu-items/upload/:id called with ID:', req.params.id, 'Data:', req.body, 'File:', req.file);
        const { name, price, description, is_available, category_id, is_special, portion_size } = req.body;
        const image_url = req.file ? `/assets/images/${req.file.filename}` : null;
        const portionSizeNumber = portion_size ? Number(portion_size) : null;
        if (portion_size && (isNaN(portionSizeNumber) || portionSizeNumber < 0)) {
            return res.status(400).json({ message: 'Portion size must be a positive number' });
        }

        const updatedItem = await menuService.update(Number(req.params.id), {
            name,
            price: Number(price),
            description: description || null,
            is_available: is_available === 'true' || is_available === true,
            category_id: category_id ? Number(category_id) : null,
            is_special: is_special === 'true' || is_special === true,
            image_url,
            portion_size: portionSizeNumber,
        });

        if (!updatedItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(updatedItem);
    } catch (err) {
        console.error('Помилка в updateDishWithFile:', err.stack);
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const updatedItem = await menuService.update(Number(req.params.id), req.body);
        if (!updatedItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(updatedItem);
    } catch (err) {
        console.error('Error in update:', err.stack);
        next(err);
    }
};
