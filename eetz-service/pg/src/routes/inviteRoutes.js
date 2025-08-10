const bodyParser = require('body-parser');
const { checkPermission } = require('../middleware/rbac.js');
const { verifyToken } = require('../middleware/auth.js');

const { createInvitation, inviteValid, useInvite } = require('../models/invitation.js');

const inviteError = 'Failed to Manage Invitation.  Try again later.';

module.exports = function (app) {
  //https://stackoverflow.com/a/6059938

  const jsonParser = bodyParser.json();

  /**
   * @route POST /invite
   * @desc Create a new invitation code.
   * @returns {Object} Invitation object
   * @throws {400} Bad Request if required fields are missing
   * @throws {403} Forbidden if user is not granted
   * @throws {500} Internal Server Error if creation fails
   * @access create_invite only
   */
  app.post('/invite', checkPermission('create_invitation'), jsonParser, async (req, res) => {
    const token =
      req.body.token || req.query.token || req.headers['x-access-token'];
    const userOrError = verifyToken(token);
    if (userOrError.code && userOrError.reason) {
      return res.status(userOrError.code).json(userOrError.reason);
    }
    try {
      const { inviteEmail } = req.body;
      if (!inviteEmail) {
        return res.status(400).json({ message: inviteError });
      }
      const invitation = await createInvitation({
        inviteEmail: inviteEmail.toLowerCase(),
        expiresAt,
      });

      console.log(`Invitation created:  [${invitation.code}]`);

      res.status(201).json(invitation);
    } catch (err) {
      console.error('Error creating invitation:', err);
      res.status(err.code || 500).json({ message: err.reason || inviteError });
    }
  });
}
