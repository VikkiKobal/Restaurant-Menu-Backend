const bcrypt = require('bcrypt');
const { sql, connect } = require('../db');

async function addUser({ email, password, role }) {
    const pool = await connect();

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.request()
        .input('email', sql.NVarChar, email.trim())
        .input('password', sql.NVarChar, hashedPassword)
        .input('role', sql.NVarChar, role)
        .query(`
            INSERT INTO Users (Email, Password, Role) 
            VALUES (@email, @password, @role)
        `);
}
