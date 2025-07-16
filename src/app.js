require('@dotenvx/dotenvx').config();
// require('dotenv').config();
require('./config/database').connect();
const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');

const auth = require('./middleware/auth');
const User = require('./model/user');

const app = express();

app.use(express.json());

app.post('/hello', async (req, res) => {
  try {
    const { name } = req.body;
    res.status(200).json({ message: `Hello, ${name}!` });
  } catch (error) {
    console.error('Error in /hello:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// User routes ??  check the syntax for adding routes from external module
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

module.exports = app;
