const categoryService = require('../services/categoryService');
const menuService = require('../services/menuService');

const getAllCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.fetchCategories();
        res.json(categories);
    } catch (err) {
        console.error('Error in category controller:', err);
        next(err);
    }
};

const getDishes = async (req, res, next) => {
    const { categoryId, specialsOnly } = req.query;
    try {
        if (categoryId && isNaN(parseInt(categoryId))) {
            return res.status(400).json({ error: 'Invalid categoryId' });
        }
        const dishes = await menuService.findByCategory(
            categoryId ? parseInt(categoryId) : null,
            specialsOnly === 'true'
        );
        res.json(dishes);
    } catch (err) {
        console.error('Error in getDishes:', err);
        next(err);
    }
};

module.exports = { getAllCategories, getDishes };