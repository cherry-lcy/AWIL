const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "username",  // replace with your username
    password: "password",  // replace with your password
    database: "dbname",  // replace with the name of the database
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