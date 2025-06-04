const db = require('../db');

const fetchCategories = async () => {
    try {
        const result = await db.pool.query('SELECT id, name FROM categories ORDER BY name');
        return result.rows;
    } catch (err) {
        console.error('Помилка сервісу категорій:', err);
        throw new Error('Failed to fetch categories');
    }
};

module.exports = { fetchCategories };