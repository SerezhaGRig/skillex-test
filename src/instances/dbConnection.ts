import mysql, { ConnectionOptions, Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const { DB_NAME, DB_PORT, DB_PASS, DB_USER, DB_HOST } = process.env;

const access: ConnectionOptions = {
  host: DB_HOST,
  port: Number.parseInt(DB_PORT!),
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  multipleStatements: true,
};

let conn: Pool | undefined;

export const getMysqlConnPool = () => {
  if (!conn) {
    console.info(access);
    conn = mysql.createPool(access);
  }
  return conn;
};
