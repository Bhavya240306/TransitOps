// auth.middleware attaches { id, role } from the JWT — but every driver
// action in trip.routes.js needs the DRIVER row's id, not the USER's id.
// This middleware looks that up once and attaches it as req.driverId, so
// controllers never have to do the User -> Driver lookup themselves.
//
// Must run AFTER auth.middleware. Only meant for routes restricted to
// role DRIVER (i.e. always paired with requireRole('DRIVER')).

const { Driver } = require('../models');
const { error } = require('../utils/apiResponse');

async function resolveDriver(req, res, next) {
  try {
    const driver = await Driver.findOne({ where: { userId: req.user.id } });
    if (!driver) {
      return error(res, 'No driver profile found for this account', 404, 'DRIVER_PROFILE_NOT_FOUND');
    }
    req.driverId = driver.id;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = resolveDriver;