const bcrypt = require('bcrypt');
const { connect, sql } = require('./db');

async function createAdmin() {
    try {
        const pool = await connect();

        const email = 'admin@restaurant.com';  
        const plainPassword = 'adminOfRestaurant';
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        await pool.request()
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashedPassword)
            .input('role', sql.NVarChar, 'admin')
            .query(`
                INSERT INTO Users (Email, Password, Role)
                VALUES (@email, @password, @role)
            `);

        console.log('Адмін створений успішно');
    } catch (err) {
        console.error('Помилка створення адміна:', err);
    }
}

createAdmin();
