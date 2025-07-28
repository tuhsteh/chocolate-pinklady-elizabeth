// require('@dotenvx/dotenvx').config();
require('dotenv').config();
const { pool } = require('./config/database');
const bcrypt = require('bcryptjs');
const { text } = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');

// const auth = require('./middleware/auth');
// const User = require('./model/user');

const app = express();

app.use(express.json());

app.post('/hello', async (req, res) => {
  try {
    // const { name } = req.body;
    const query = {
      text: 'SELECT NOW()',
      values: [],
    };
    pool.query(query, (err, result) => {
      if (err) {
        console.error(`Database query error:  ${err}`);
        return res.status(500).json({ message: 'Database query failed' });
      }
      console.log(`Database connection successful:  ${result.rows}`);
      res.status(200).json({ message: `Result, ${result.rows}` });
    });
  } catch (error) {
    console.error('Error in /hello:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// User routes ??  check the syntax for adding routes from external module
// const userRoutes = require('./routes/userRoutes');
// app.use('/users', userRoutes);

module.exports = app;
