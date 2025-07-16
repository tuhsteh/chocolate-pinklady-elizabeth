const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');
const User = require('../model/user');

const userRoutes = express();

userRoutes.use(express.json());

/**
 * @route POST /register
 * @desc Register a new user
 * @access Public
 * @returns {Object} User object with token
 * @throws {400} Bad Request if required fields are missing
 * @throws {409} Conflict if user already exists
 * @throws {500} Internal Server Error if registration fails
 */
const registerError = 'Failed to Register User.  Try again later.';
userRoutes.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, invitation } = req.body;
    if (!(email && password && firstName && lastName && invitation)) {
      return res.status(400).json({ message: registerError });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: registerError });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      invitation,
    });
    
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      { expiresIn: '15m' }
    );
    user.token = token;
    
    // isn't this dangerous?
    // res.status(201).json(user);
    res.status(201).json({
      user: {
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        token: user.token,
      },
    });
  } catch (error) {
    console.log(`Error in /register:  [${error}]`);
    res.status(500).json({ message: registerError });
  }
});

/**
 * @route POST /login
 * @desc Login an existing user
 * @access Public
 * @returns {Object} User object with token
 * @throws {400} Bad Request if required fields are missing
 * @throws {401} Unauthorized if login fails
 * @throws {500} Internal Server Error if login fails
 */
const loginError = 'Failed to Login User.  Try again later.';
userRoutes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({ message: loginError });
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        { expiresIn: '15m' }
      );
      user.token = token;

      console.log(
        `User login:  [${user.first_name} ${user.last_name} <${user.email}>]`
      );

      // isn't this dangerous?
      // return res.status(200).json(user);
      return res.status(200).json({
        user: {
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          token: user.token,
        },
      });
    } else {
      return res.status(400).json({ message: loginError });
    }
  } catch (error) {
    console.log(`Error in /login:  [${error}]`);
    res.status(500).json({ message: loginError });
  }
});

module.exports = userRoutes;
