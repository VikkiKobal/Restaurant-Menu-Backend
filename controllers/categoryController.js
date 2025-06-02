const categoryService = require('../services/categoryService');

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.fetchCategories();
        res.json(categories);
    } catch (err) {
        console.error('Помилка контролера категорій:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getDishes = async (req, res) => {
    const { categoryId, specialsOnly } = req.query;

    try {
        const dishes = await dishService.findByCategory(
            categoryId ? parseInt(categoryId) : null,
            specialsOnly === 'true'
        );
        res.json(dishes);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = {
    getAllCategories
};

