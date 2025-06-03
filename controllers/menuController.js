const menuService = require('../services/menuService');

exports.getAll = async (req, res, next) => {
    try {
        const { categoryId } = req.query;
        let items;
        if (categoryId) {
            items = await menuService.findByCategory(Number(categoryId));
        } else {
            items = await menuService.findAll();
        }
        res.json(items);
    } catch (err) {
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
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const newItem = await menuService.create(req.body);
        res.status(201).json(newItem);
    } catch (err) {
        console.error('Error in create controller:', err);
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        await menuService.delete(Number(req.params.id));
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

exports.addDishWithFile = async (req, res, next) => {
    try {
        const image_url = req.file ? `/assets/images/${req.file.filename}` : null;
        const { name, price, description, is_available, category_id, is_special } = req.body;

        const newItem = await menuService.create({
            name,
            price: Number(price),
            description,
            image_url,
            is_available: is_available === 'true',
            category_id: Number(category_id),
            is_special: is_special === 'true' || is_special === true, // Зміна з special_category на is_special
        });

        res.status(201).json(newItem);
    } catch (err) {
        console.error('Error in addDishWithFile:', err);
        next(err);
    }
};

exports.updateDishWithFile = async (req, res, next) => {
    try {
        const image_url = req.file ? `/assets/images/${req.file.filename}` : null;
        console.log('PUT /api/menu/menu-items/upload/:id called with ID:', req.params.id, 'Data:', req.body, 'Image:', image_url);
        const { name, price, description, is_available, category_id, is_special } = req.body;

        const updatedItem = await menuService.update(Number(req.params.id), {
            name,
            price: Number(price),
            description,
            is_available: is_available === 'true' || is_available === true,
            category_id: category_id ? Number(category_id) : null,
            is_special: is_special === 'true' || is_special === true, // Зміна з special_category на is_special
            ...(image_url && { image_url })
        });

        if (!updatedItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(updatedItem);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        console.log('PUT /api/menu/:id called with ID:', req.params.id, 'Data:', req.body);
        const updatedItem = await menuService.update(Number(req.params.id), req.body);
        if (!updatedItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(updatedItem);
    } catch (err) {
        next(err);
    }
};

