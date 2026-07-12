const vehicleService = require('../services/vehicle.service');
const { success, error } = require('../utils/apiResponse');

async function register(req, res, next) {
  try {
    const { registrationNumber, make, model, capacityKg } = req.body;
    if (!registrationNumber || !make || !model || !capacityKg) {
      return error(res, 'registrationNumber, make, model, and capacityKg are required', 400, 'MISSING_FIELDS');
    }
    const vehicle = await vehicleService.register({ registrationNumber, make, model, capacityKg });
    return success(res, vehicle, 201);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const vehicles = await vehicleService.list();
    return success(res, vehicles);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const vehicle = await vehicleService.getById(req.params.id);
    return success(res, vehicle);
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const vehicle = await vehicleService.setStatus(req.params.id, status);
    return success(res, vehicle);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, list, getById, updateStatus };