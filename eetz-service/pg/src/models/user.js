const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs');
const { CodedError } = require('./codedError.js');

const { generateToken } = require('../middleware/auth.js');

const findError = 'User Operation Failed.';
const registerError = 'User Operation Failed.';
const updateError = 'User Operation Failed.';

const prisma = new PrismaClient();

class User {
  // constructor(firstName, lastName, email, password, inviteCode, role)
  firstName; // String
  lastName; // String
  email; // String // varChar(255)
  password; // String // encrypted before write
  token; // String // assigned after successful login
  role; // Role
}

/**
 * Create a new user.
 * @param {Object} data
 * @returns {Object} Created user object
 * @throws {Error} If user creation fails
 */
const createUser = async function createUser(data) {
  try {
    encryptedPassword = await bcrypt.hash(data.password, 10);

    const foundInvite = await prisma.invitation.findFirst({
      where: {
        AND: [
          { code: data.inviteCode },
          { expiresAt: { gte: new Date() } },
          // { inviteEmail: data.email },
        ],
      },
    });
    if (!foundInvite) {
      console.error('InviteCode missing or invalid');
      throw new CodedError({ code: 422, reason: registerError });
    }

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        password: encryptedPassword,
        role: data.role || 'guest', // Default to 'guest' if not provided
      },
    });

    // TODO update the 'uses' count on the Invite code
    try {
      user.token = await generateToken({ userId: user.id, email: user.email });
    } catch (ce) {
      console.error(`Token error.  ${ce.reason}`);
      throw new CodedError({ code: ce.code, reason: ce.reason });
    }
    const { id, firstName, lastName, email, token } = user;
    return { id, firstName, lastName, email, token };
  } catch (error) {
    console.error(`Error creating user:  ${error}`);
    throw new CodedError({ code: 403, reason: registerError });
  }
};

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
    const { id, firstName, lastName, email, password, role } = user;
    return { id, firstName, lastName, email, password, role };
  } catch (err) {
    console.error(
      `Error fetching user with ID ${userId}:  ${JSON.stringify(err)}`,
    );
    throw new Error(findError);
  }
};

/**
 * Find a user by email.
 * @param {String} emailToSearch
 * @returns {Object} User object partial, containing firstName, lastName, email, and role
 * @throws {Error} If user not found or database error
 */
const getUserByEmail = async function getUserByEmail(emailToSearch) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: emailToSearch.toLowerCase() },
    });
    if (!user) {
      throw new Error(findError);
    }
    const { id, firstName, lastName, email, password, role } = user;
    return { id, firstName, lastName, email, password, role };
  } catch (err) {
    console.error(`Error fetching user with email ${emailToSearch}:  ${err}`);
    throw new Error(findError);
  }
};

/**
 * Update one or more fields of a user.
 * @param {Integer} userId the ID of the user to update
 * @param {Object} data, including all fields, whether updating or not
 * @returns {Object} updated user doc
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
        : foundUser.password; // don't doubly encrypt the password
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        inviteCode: data.inviteCode, // this isn't part of User anymore
        password: encryptedPassword,
        role: data.role || foundUser.role,
      },
    });
    return user;
  } catch (error) {
    console.error(`Error updating user with ID ${userId}:  ${error}`);
    throw new Error(updateError);
  }
};

module.exports = {
  User,
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
};
