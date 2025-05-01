const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Cherry5052005",
    database: "awil",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('connect sucessfully');
        connection.release();
    } catch (error) {
        console.error('connect failed', error);
    }
}

module.exports = {pool, testConnection};