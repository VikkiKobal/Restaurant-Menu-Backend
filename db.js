const sql = require('mssql/msnodesqlv8');

const config = {
    connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-T94V6UV\\SQLEXPRESS;Database=RestaurantDB;Trusted_Connection=yes;'
};

async function connect() {
    try {
        await sql.connect(config);
        console.log('Підключення через Windows Authentication встановлено');
    } catch (err) {
        console.error('Помилка підключення:', err);
    }
}


async function connect() {
    try {
        await sql.connect(config);
        console.log('Підключення через Windows Authentication встановлено');
    } catch (err) {
        console.error('Помилка підключення:', err);
    }
}

module.exports = { sql, connect };
