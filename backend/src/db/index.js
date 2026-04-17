import { Pool } from "pg";


export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // 👈 better to cast to number
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
