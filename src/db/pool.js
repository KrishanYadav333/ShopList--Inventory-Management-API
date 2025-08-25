// Creates a single shared connection pool to PostgreSQL
const { Pool } = require('pg');
const env = require('../config/env');

const pool = new Pool({ connectionString: env.DATABASE_URL });

// Handle pool errors
pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('Database connected successfully');
    release();
  }
});

module.exports = { pool };