const db = require('../db');
const sql = db.sql;
const dbConfig = require('../db');

const fetchCategories = async () => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query('SELECT id, name FROM Categories');
        return result.recordset;
    } catch (err) {
        console.error('Помилка сервісу категорій:', err);
        throw err;
    }
};

module.exports = {
    fetchCategories
};
