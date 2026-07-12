const fuelLogService = require('../services/fuelLog.service');
const { success, error } = require('../utils/apiResponse');

async function logRefuel(req, res, next) {
  try {
    const { liters, costAmount } = req.body;
    if (liters == null) return error(res, 'liters is required', 400, 'MISSING_FIELDS');
    const log = await fuelLogService.logMidTripRefuel(req.params.id, req.driverId, { liters, costAmount });
    return success(res, log, 201);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const logs = req.query.vehicleId
      ? await fuelLogService.listForVehicle(req.query.vehicleId)
      : await fuelLogService.listAll();
    return success(res, logs);
  } catch (err) {
    next(err);
  }
}

module.exports = { logRefuel, list };