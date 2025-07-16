const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('../../node_modules/bcryptjs/umd/types');
const { app } = require('../app');

// user schema, first_name, last_name, email, password, token
const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, default: null },
  last_name: { type: String, required: true, default: null },
  email: { type: String, required: true, unique: true, default: null },
  password: { type: String },
  token: { type: String },
});

module.exports = mongoose.model('user', userSchema); // Register
