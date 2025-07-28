import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const findError = 'User Operation Failed.';
const registerError = 'User Operation Failed.';
const updateError = 'User Operation Failed.';

const prisma = new PrismaClient();

/**
 * Find a user by userID.
 * @param {Integer} userId
 * @returns {Object} User object partial, containing firstName, lastName, email, and role
 * @throws {Error} If user not found or database error
 */
const getUserById = async function getUserById(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    const { id, firstName, lastName, email, role } = user;
    return { id, firstName, lastName, email, role };
  } catch (error) {
    console.error(
      `Error fetching user with ID ${userId}:  ${JSON.stringify(error)}`,
    );
    throw new Error(findError);
  }
};

/**
 * Find a user by email.
 * @param {String} email
 * @returns {Object} User object partial, containing firstName, lastName, email, and role
 * @throws {Error} If user not found or database error
 */
const getUserByEmail = async function getUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      throw new Error(findError);
    }
    const { id, firstName, lastName, email: userEmail, role } = user;
    return { id, firstName, lastName, email: userEmail, role };
  } catch (error) {
    console.error(
      `Error fetching user with email ${email}:  ${JSON.stringify(error)}`,
    );
    throw new Error(findError);
  }
};

/**
 * Create a new user.
 * @param {Object: UserCreateData} data
 * @returns {Object} Created user object
 * @throws {Error} If user creation fails
 */
const createUser = async function createUser(data) {
  try {
    const encryptedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        inviteCode: data.inviteCode.toLowerCase(),
        password: encryptedPassword,
        role: data.role || 'DINER', // Default to 'USER' if not provided
      },
    });

    const token = jwt.sign(
      { user_id: user.id, email: user.email },
      process.env.TOKEN_KEY,
      { expiresIn: '15m' },
    );
    user.token = token;
    const { id, firstName, lastName, email } = user;
    return { id, firstName, lastName, email };
  } catch (error) {
    console.error(`Error creating user:  ${JSON.stringify(error)}`);
    throw new Error(registerError);
  }
};

/**
 * Update one or more fields of a user.
 * @param {Integer} userId the ID of the user to update
 * @param {Object} data, including all fields, whether updating or not.
 * @returns
 */
const updateUser = async function updateUser(userId, data) {
  try {
    if (!data.firstName || !data.lastName || !data.email) {
      throw new Error(updateError);
    }
    const foundUser = prisma.user.findUnique({
      where: { OR: [ { id: userId }, { email: data.email } ] },
    });
    if (!foundUser) {
      console.error(
        `UPDATE:  User with ID ${userId} or email ${data.email} does not exist.`,
      );
      throw new Error(updateError);
    }
    const encryptedPassword =
      '' != data.password && null != data.password
        ? await bcrypt.hash(data.password, 10)
        : await bcrypt.hash(foundUser.password, 10);
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        inviteCode: data.inviteCode,
        password: encryptedPassword,
        role: data.role || foundUser.role,
      },
    });
    return user;
  } catch (error) {
    console.error(
      `Error updating user with ID ${userId}:  ${JSON.stringify(error)}`,
    );
    throw new Error(updateError);
  }
};

export default {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
};
