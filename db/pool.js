import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

let poolConfig;

if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  };
} else {
  poolConfig = {
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
  };
}

export const pool = new Pool(poolConfig);
