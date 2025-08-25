// Creates a single shared connection pool to PostgreSQL
const { Pool } = require('pg');
const env = require('../config/env');

const pool = new Pool({ connectionString: env.DATABASE_URL });

module.exports = { pool };