// A Driver row is created right after a Driver-role User signs up (call
// createProfileForUser from auth.service's signup flow, or from a
// controller hook — wired in driver.routes.js as POST /drivers/me).
// It starts PENDING_APPROVAL until a Safety Officer approves it.

const { Driver, User } = require('../models');

async function createProfileForUser(userId, { licenseNumber, licenseExpiryDate }) {
  const existing = await Driver.findOne({ where: { userId } });
  if (existing) {
    const err = new Error('Driver profile already exists for this user');
    err.statusCode = 409;
    err.code = 'DRIVER_PROFILE_EXISTS';
    throw err;
  }
  return Driver.create({ userId, licenseNumber, licenseExpiryDate });
}

async function list() {
  return Driver.findAll({
    include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'email'] }],
    order: [['createdAt', 'DESC']],
  });
}

async function getById(id) {
  const driver = await Driver.findByPk(id, {
    include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'email'] }],
  });
  if (!driver) {
    const err = new Error('Driver not found');
    err.statusCode = 404;
    err.code = 'DRIVER_NOT_FOUND';
    throw err;
  }
  return driver;
}

// Safety Officer action — the gate for trip eligibility.
async function approve(id, safetyOfficerUserId) {
  const driver = await getById(id);
  driver.status = 'AVAILABLE';
  driver.approvedByUserId = safetyOfficerUserId;
  driver.approvedAt = new Date();
  await driver.save();
  return driver;
}

async function suspend(id) {
  const driver = await getById(id);
  driver.status = 'SUSPENDED';
  await driver.save();
  return driver;
}

async function reinstate(id) {
  const driver = await getById(id);
  driver.status = 'AVAILABLE';
  await driver.save();
  return driver;
}

// Used by trip.service after a trip completes, so the next recommendation
// round has an up-to-date route-familiarity score for this destination.
async function bumpRouteFamiliarity(id, destinationAddress) {
  const driver = await getById(id);
  const familiarity = { ...driver.routeFamiliarity };
  familiarity[destinationAddress] = (familiarity[destinationAddress] || 0) + 1;
  driver.routeFamiliarity = familiarity;
  await driver.save();
  return driver;
}

async function setStatus(id, status) {
  const driver = await getById(id);
  driver.status = status;
  await driver.save();
  return driver;
}

module.exports = {
  createProfileForUser,
  list,
  getById,
  approve,
  suspend,
  reinstate,
  bumpRouteFamiliarity,
  setStatus,
};