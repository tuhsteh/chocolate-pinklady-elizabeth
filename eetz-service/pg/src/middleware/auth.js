import jwt from 'jsonwebtoken';
import CodedError from '../models/codedError';

const tokenError = 'Token Operation failed.';

/**
 * Produce a token to be used in future call authentication.
 * @param {Object} data userId and email
 * @returns {String} token generated from signing with userId and email
 * @throws {Error} if missing data, or if token generation fails
 */
const generateToken = async function generateToken(data) {
  if (data.userId && data.email) {
    try {
      const token = jwt.sign(
        { userId: data.userId, email: data.email },
        process.env.TOKEN_KEY,
        { expiresIn: '15m' },
      );
      return token;
    } catch (error) {
      console.error('Data Error generating token.');
      throw new CodedError({ code: 422, reason: tokenError });
    }
  }
  console.error('Error generating token.');
  throw new CodedError({ code: 500, reason: tokenError });
};

/**
 * Verify a token for authentication.
 * @param {Object} data token to verify
 * @returns {Object} user if verification doesn't fail
 */
const verifyToken = async function verifyToken(data) {
  const { token } = data;

  if (!token) {
    console.error('Token not valid.');
    throw new CodedError({ code: 403, reason: tokenError });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    return decoded;
  } catch (error) {
    console.error(`Unauthorized:  Invalid Token.  ${JSON.stringify(error)}`);
    throw new CodedError({ code: 401, reason: tokenError });
  }
};

export default {
  generateToken,
  verifyToken,
};
