// require('@dotenvx/dotenvx').config();
require('dotenv').config();
const { pool } = require('./config/database');
const express = require('express');

const app = express();
require('./routes/userRoutes.js')(app);

app.use(express.json());

app.post('/hello', async (req, res) => {
  try {
    const { name = 'user' } = req.body;
    const query = {
      text: 'SELECT NOW();',
      values: [],
    };
    pool.query(query, (err, result) => {
      if (err) {
        console.error(`Database query error:  ${err}`);
        return res.status(500).json({ message: 'Database query failed' });
      }
      return res.status(200).json({ message: `Hello ${name}.  ` + result.rows[0].now });
    });
  } catch (err) {
    console.error(`Error in /hello:  ${JSON.stringify(err)}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = app;
