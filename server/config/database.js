import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

console.log("DB CONNECTION CONFIG:", {
  host: process.env.MYSQL_HOST,
  port: process.env.DB_PORT,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  hasPassword: !!process.env.MYSQL_PASSWORD,
  nodeEnv: process.env.NODE_ENV,
});

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.DB_PORT), // <-- fix
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(process.env.NODE_ENV === "production"
    ? { ssl: { rejectUnauthorized: false } } // SSL required on Railway
    : {}),
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL connected successfully!");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
  }
})();

export { pool };
