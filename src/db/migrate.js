const fs = require('fs');
const path = require('path');
const { pool } = require('./pool');

async function runMigration() {
  try {
    const migrationPath = path.join(__dirname, 'migrations', '001_init.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Running database migration...');
    await pool.query(sql);
    console.log('Migration completed successfully!');
    
    await pool.end();
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();