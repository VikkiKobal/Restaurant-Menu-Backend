const db = require('../db');
const sql = db.sql;
const poolConnect = db.poolConnect;


exports.findAll = async () => {
    await poolConnect;
    const request = new sql.Request();
    const result = await request.query('SELECT * FROM MenuItems');
    return result.recordset;
};

exports.findByCategory = async (categoryId) => {
    await poolConnect;
    const request = new sql.Request();
    request.input('categoryId', sql.Int, categoryId);
    const result = await request.query('SELECT * FROM MenuItems WHERE CategoryId = @categoryId');
    return result.recordset;
};

exports.findById = async (id) => {
    await poolConnect;
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    const result = await request.query('SELECT * FROM MenuItems WHERE Id = @id');
    return result.recordset[0];
};

exports.create = async (menuItem) => {
    await poolConnect;
    const { name, description, price, image_url, is_available, category_id } = menuItem;
    const request = new sql.Request();
    request.input('name', sql.NVarChar, name);
    request.input('description', sql.NVarChar, description);
    request.input('price', sql.Decimal(10, 2), price);
    request.input('image_url', sql.NVarChar, image_url);
    request.input('is_available', sql.Bit, is_available);
    request.input('category_id', sql.Int, category_id);

    const result = await request.query(`
      INSERT INTO MenuItems (name, description, price, image_url, is_available, category_id)
      OUTPUT INSERTED.*
      VALUES (@name, @description, @price, @image_url, @is_available, @category_id)
    `);
    return result.recordset[0];
};



exports.update = async (id, menuItem) => {
    await poolConnect;

    const existing = await exports.findById(id);
    if (!existing) return null;

    const name = menuItem.name ?? existing.name;
    const description = menuItem.description ?? existing.description;
    const price = menuItem.price ?? existing.price;
    const category_id = menuItem.category_id ?? existing.category_id;
    const image_url = menuItem.image_url ?? existing.image_url;
    const is_available = menuItem.is_available ?? existing.is_available;

    const request = new sql.Request();
    request.input('Id', sql.Int, id);
    request.input('Name', sql.NVarChar, name);
    request.input('Description', sql.NVarChar, description);
    request.input('Price', sql.Decimal(10, 2), price);
    request.input('category_id', sql.Int, category_id);
    request.input('image_url', sql.NVarChar, image_url);
    request.input('is_available', sql.Bit, is_available);

    const result = await request.query(`
      UPDATE MenuItems
      SET Name = @Name, Description = @Description, Price = @Price, category_id = @category_id, image_url = @image_url, is_available = @is_available
      OUTPUT INSERTED.*
      WHERE Id = @Id
    `);

    return result.recordset[0];
};


exports.delete = async (id) => {
    await poolConnect;
    const request = new sql.Request();
    request.input('Id', sql.Int, id);
    await request.query('DELETE FROM MenuItems WHERE Id = @Id');
};
