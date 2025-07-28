import bcrypt from 'bcryptjs';
import express from 'express';

import authPkg from '../middleware/auth';
const { generateToken, verifyToken } = authPkg;
import userPkg from '../models/user';
const { createUser, getUserById, getUserByEmail, updateUser } = userPkg;

const userRoutes = express();
userRoutes.use(express.json());

const loginError = 'Failed to Login User.  Try again later.';
const registerError = 'Failed to Register User.  Try again later.';

/**
 * @route POST /register
 * @desc Register a new user.
 * @returns {Object} User object with token
 * @throws {400} Bad Request if required fields are missing
 * @throws {409} Conflict if user already exists
 * @throws {422} If user is not invited
 * @throws {500} Internal Server Error if registration fails
 */
userRoutes.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, inviteCode, role } = req.body;
    if (!(email && password && firstName && lastName && inviteCode)) {
      return res.status(400).json({ message: registerError });
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: registerError });
    }

    const user = await createUser({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password, // encrypted on store
      inviteCode,
      role,
    });

    res.set('x-access-token', user.token);
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
 * @route POST /update
 * @desc Update user values
 * @param {Object} User data, including fields we don't want to modify †
 * @throws {401} if user is not authenticated
 * @throws {403} if user is not authorized to modify user
 * @throws {404} if user to modify is not found
 * @throws {422} if missing update data
 * † the Password field may be left blank or '', to help reduce leaks of sensitive data.
 * Only supply a Password value if the user wants to change their password.
 */
// TODO userRoutes.post('/update'...)

/**
 * @route POST /login
 * @desc Login an existing user.
 * @returns {Object} User object with token
 * @throws {400} Bad Request if required fields are missing
 * @throws {401} Unauthorized if login fails
 * @throws {500} Internal Server Error if login fails
 */
userRoutes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({ message: loginError });
    }
    const user = await getUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      try {
        const token = generateToken(user.id, user.email);
        user.token = token;
      } catch (ce) {
        return res.status(ce.code).json(ce.reason);
      }

      console.log(
        `User login:  [${user.first_name} ${user.last_name} <${user.email}>]`,
      );

      return res.status(200).json({
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
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

/**
 * @route POST /welcome
 * @desc A Simple welcome endpoint that requires authentication.
 * @returns {String} welcome string
 * @throws {401} if token is missing
 * @throws {403} if token is bad
 */
userRoutes.post('/welcome', async (req, res) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];
  const userOrError = verifyToken(token);
  if (userOrError.code && userOrError.reason) {
    res.status(userOrError.code).json(userOrError.reason);
  }
  res.status(200).send('welcome.');
});

/**
 * @route POST /me
 * @desc Get current user profile, for permissions.
 * @returns {Object} User object
 * @throws {401} Unauthorized if token is invalid or missing
 * @throws {403} if user is not Authenticated
 * @throws {500} Internal Server Error if retrieval fails
 */
// TODO:  userRoutes.get('/me'...);

export default userRoutes;
