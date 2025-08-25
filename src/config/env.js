// Loads environment variables and exports them in one place
require('dotenv').config();

const env = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  BASIC_AUTH_USER: process.env.BASIC_AUTH_USER,
  BASIC_AUTH_PASS: process.env.BASIC_AUTH_PASS
};

// Validate required environment variables
if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required (e.g., postgres://user:pass@host:5432/db)');
}

if (!env.BASIC_AUTH_USER || !env.BASIC_AUTH_PASS) {
  throw new Error('BASIC_AUTH_USER and BASIC_AUTH_PASS are required for authentication');
}

module.exports = env;