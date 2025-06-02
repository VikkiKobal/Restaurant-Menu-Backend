const sql = require('mssql/msnodesqlv8');

const config = {
    connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-T94V6UV\\SQLEXPRESS;Database=RestaurantDB;Trusted_Connection=yes;'
};

let pool;

async function connect() {
    if (pool) return pool;
    try {
        pool = await sql.connect(config);
        console.log('Підключення через Windows Authentication встановлено');
        return pool;
    } catch (err) {
        console.error('Помилка підключення:', err);
        throw err; 
    }
}

module.exports = { sql, connect };
