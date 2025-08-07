const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  // connectionString: process.env.POSTGRES_URI,
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

module.exports = {
  pool,
};
