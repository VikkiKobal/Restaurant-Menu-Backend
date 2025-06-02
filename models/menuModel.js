const { poolConnect, sql } = require('./db');

exports.findAll = async () => {
    await poolConnect;
    const request = new sql.Request();
    const result = await request.query('SELECT * FROM MenuItems');
    return result.recordset;
};
