const driverService = require('../services/driver.service');
const { success, error } = require('../utils/apiResponse');

async function createMyProfile(req, res, next) {
  try {
    const { licenseNumber, licenseExpiryDate } = req.body;
    if (!licenseNumber || !licenseExpiryDate) {
      return error(res, 'licenseNumber and licenseExpiryDate are required', 400, 'MISSING_FIELDS');
    }
    const driver = await driverService.createProfileForUser(req.user.id, { licenseNumber, licenseExpiryDate });
    return success(res, driver, 201);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const drivers = await driverService.list();
    return success(res, drivers);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const driver = await driverService.getById(req.params.id);
    return success(res, driver);
  } catch (err) {
    next(err);
  }
}

async function approve(req, res, next) {
  try {
    const driver = await driverService.approve(req.params.id, req.user.id);
    return success(res, driver);
  } catch (err) {
    next(err);
  }
}

async function suspend(req, res, next) {
  try {
    const driver = await driverService.suspend(req.params.id);
    return success(res, driver);
  } catch (err) {
    next(err);
  }
}

async function reinstate(req, res, next) {
  try {
    const driver = await driverService.reinstate(req.params.id);
    return success(res, driver);
  } catch (err) {
    next(err);
  }
}

module.exports = { createMyProfile, list, getById, approve, suspend, reinstate };