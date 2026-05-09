import mysql from "mysql2/promise";
import { AppConfig } from "./app.js";

const pool = mysql.createPool({
  host: AppConfig.DB_HOST,
  user: AppConfig.DB_USER,
  password: AppConfig.DB_PASSWORD,
  database: AppConfig.DB_NAME,
  port: AppConfig.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
