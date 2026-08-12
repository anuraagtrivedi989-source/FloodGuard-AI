const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "anurag@#8858",
  database: "FloodGuard",
  port: 3306,
});

module.exports = pool;