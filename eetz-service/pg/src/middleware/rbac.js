const Role = require('../models/role.js');
const Permissions = require('../models/permissions.js');

const checkPermission = function checkPermission(permission) {
  return (req, res, next) => {
    const userRole = req.user ? req.user.role : 'guest';
    const userPermissions = new Permissions().getPermissionsByRoleName(
      userRole,
    );

    if (userPermissions.includes(permission)) {
      return next();
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }
  };
};

// from https://medium.com/@jayantchoudhary271/building-role-based-access-control-rbac-in-node-js-and-express-js-bc870ec32bdb
// mark endpoints with the rbac and check the permission there:
// e.g. router.get('/records', rbacMiddleware.checkPermission('read_record'), recordsController.getAllRecord);

module.exports = { checkPermission };
