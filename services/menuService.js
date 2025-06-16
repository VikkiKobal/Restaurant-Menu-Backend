const db = require('../db');

exports.findAll = async () => {
    try {
        const result = await db.pool.query('SELECT * FROM menu_items ORDER BY name');
        return result.rows;
    } catch (err) {
        throw new Error('Failed to fetch menu items');
    }
};

exports.findById = async (id) => {
    try {
        if (!Number.isInteger(id)) {
            throw new Error('Invalid menu item ID');
        }
        const result = await db.pool.query('SELECT * FROM menu_items WHERE id = $1', [id]);
        return result.rows[0];
    } catch (err) {
        throw new Error('Failed to fetch menu item');
    }
};

exports.findByCategory = async (categoryId, specialsOnly = false) => {
    try {
        if (specialsOnly) {
            const result = await db.pool.query('SELECT * FROM menu_items WHERE is_special = TRUE');
            return result.rows;
        }
        if (!Number.isInteger(categoryId)) {
            throw new Error('Invalid category ID');
        }
        const result = await db.pool.query('SELECT * FROM menu_items WHERE category_id = $1', [categoryId]);
        return result.rows;
    } catch (err) {
        throw new Error('Failed to fetch menu items by category');
    }
};

exports.create = async (menuItem) => {
    try {
        const { name, description, price, image_url, is_available, category_id, is_special, portion_size } = menuItem;
        if (!name || !price || !category_id) {
            throw new Error('Name, price, and category_id are required');
        }
        if (!Number.isInteger(category_id) || price < 0) {
            throw new Error('Invalid category_id or price');
        }
        if (portion_size !== null && (isNaN(portion_size) || portion_size < 0)) {
            throw new Error('Portion size must be a positive number');
        }

        const result = await db.pool.query(
            `INSERT INTO menu_items 
            (name, description, price, image_url, is_available, category_id, is_special, portion_size)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [name, description || null, Number(price), image_url || null, !!is_available, category_id, !!is_special, portion_size || null]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error(err.message || 'Failed to create menu item');
    }
};

exports.update = async (id, menuItem) => {
    try {
        if (!Number.isInteger(id)) {
            throw new Error('Invalid menu item ID');
        }
        const existing = await exports.findById(id);
        if (!existing) {
            return null;
        }

        const name = menuItem.name ?? existing.name;
        const description = menuItem.description ?? existing.description;
        const price = menuItem.price ?? existing.price;
        const category_id = menuItem.category_id ?? existing.category_id;
        const image_url = menuItem.image_url ?? existing.image_url;
        const is_available = menuItem.is_available ?? existing.is_available;
        const is_special = menuItem.is_special ?? existing.is_special;
        const portion_size = menuItem.portion_size ?? existing.portion_size;

        if (!name || !price || !category_id) {
            throw new Error('Name, price, and category_id are required');
        }
        if (!Number.isInteger(category_id) || price < 0) {
            throw new Error('Invalid category_id or price');
        }
        if (portion_size !== null && (isNaN(portion_size) || portion_size < 0)) {
            throw new Error('Portion size must be a positive number');
        }

        const result = await db.pool.query(
            `UPDATE menu_items SET
            name = $1, description = $2, price = $3, category_id = $4, image_url = $5, 
            is_available = $6, is_special = $7, portion_size = $8
            WHERE id = $9
            RETURNING *`,
            [name, description || null, Number(price), category_id, image_url || null, !!is_available, !!is_special, portion_size || null, id]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error(err.message || 'Failed to update menu item');
    }
};

exports.delete = async (id) => {
    try {
        if (!Number.isInteger(id)) {
            throw new Error('Invalid menu item ID');
        }
        const result = await db.pool.query('DELETE FROM menu_items WHERE id = $1 RETURNING id', [id]);
        return result.rowCount > 0;
    } catch (err) {
        throw new Error('Failed to delete menu item');
    }
};