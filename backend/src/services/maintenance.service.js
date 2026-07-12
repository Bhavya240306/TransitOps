const { MaintenanceLog, Vehicle } = require('../models');
const vehicleService = require('./vehicle.service');

function fail(message, statusCode, code) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  return err;
}

// Opens a maintenance log and flips the vehicle to MAINTENANCE so it drops
// out of the trip-recommendation pool automatically.
async function open(userId, { vehicleId, issue }) {
  const log = await MaintenanceLog.create({ vehicleId, issue, openedByUserId: userId, status: 'OPEN' });
  await vehicleService.setStatus(vehicleId, 'MAINTENANCE');
  return log;
}

// Closes it and flips the vehicle back to AVAILABLE.
async function close(id, costAmount) {
  const log = await MaintenanceLog.findByPk(id);
  if (!log) throw fail('Maintenance log not found', 404, 'LOG_NOT_FOUND');
  if (log.status === 'CLOSED') throw fail('Already closed', 400, 'ALREADY_CLOSED');

  log.status = 'CLOSED';
  log.closedAt = new Date();
  if (costAmount != null) log.costAmount = costAmount;
  await log.save();

  await vehicleService.setStatus(log.vehicleId, 'AVAILABLE');
  return log;
}

async function list() {
  return MaintenanceLog.findAll({
    include: [{ model: Vehicle, as: 'vehicle', attributes: ['id', 'registrationNumber', 'model'] }],
    order: [['createdAt', 'DESC']],
  });
}

module.exports = { open, close, list };