import { getMysqlConnPool } from '../instances/dbConnection';

const migrationQuery = `
CREATE TABLE IF NOT EXISTS items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_code VARCHAR(10) NOT NULL UNIQUE,
    INDEX idx_item_code (item_code)
  );

CREATE TABLE IF NOT EXISTS combinations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    combination TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at)
  );

CREATE TABLE IF NOT EXISTS responses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    combination_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (combination_id) REFERENCES combinations(id) ON DELETE CASCADE,
    INDEX idx_combination_id (combination_id)
  );`;

const migration = async () => {
  console.log('Starting migration...');
  const pool = getMysqlConnPool();
  const conn = await pool.getConnection();
  await conn.query(migrationQuery);
  console.log(`Migration done`);
};

migration().catch(console.error);
