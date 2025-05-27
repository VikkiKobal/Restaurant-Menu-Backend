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


exports.update = async (req, res, next) => {
    try {
        const updatedItem = await menuService.update(Number(req.params.id), req.body);
        if (!updatedItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(updatedItem);
    } catch (err) {
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
