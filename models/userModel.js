const { sql, connect } = require('../db');

async function addUser({ email, password, role }) {
    const pool = await connect();
    await pool.request()
        .input('email', sql.NVarChar, email)
        .input('password', sql.NVarChar, password)
        .input('role', sql.NVarChar, role)
        .query(`
            INSERT INTO Users (Email, Password, Role) 
            VALUES (@email, @password, @role)
        `);
}

async function getUserByEmail(email) {
    const pool = await connect();
    console.log('Шукаємо користувача з email:', email);
    const result = await pool.request()
        .input('email', sql.NVarChar(50), email.trim())
        .query('SELECT * FROM Users WHERE Email = @email');
    console.log('Результат запиту:', result.recordset);
    return result.recordset[0];
}


module.exports = { addUser, getUserByEmail };
