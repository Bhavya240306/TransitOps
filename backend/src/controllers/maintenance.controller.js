const maintenanceService = require('../services/maintenance.service');
const { success, error } = require('../utils/apiResponse');

async function create(req, res, next) {
  try {
    const { vehicleId, issue } = req.body;
    if (!vehicleId || !issue) return error(res, 'vehicleId and issue are required', 400, 'MISSING_FIELDS');
    const log = await maintenanceService.open(req.user.id, { vehicleId, issue });
    return success(res, log, 201);
  } catch (err) {
    next(err);
  }
}

async function close(req, res, next) {
  try {
    const { costAmount } = req.body;
    const log = await maintenanceService.close(req.params.id, costAmount);
    return success(res, log);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const logs = await maintenanceService.list();
    return success(res, logs);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, close, list };