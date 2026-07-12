const { Vehicle } = require('../models');

async function register({ registrationNumber, make, model, capacityKg }) {
  return Vehicle.create({ registrationNumber, make, model, capacityKg });
}

async function list() {
  return Vehicle.findAll({ order: [['createdAt', 'DESC']] });
}

async function getById(id) {
  const vehicle = await Vehicle.findByPk(id);
  if (!vehicle) {
    const err = new Error('Vehicle not found');
    err.statusCode = 404;
    err.code = 'VEHICLE_NOT_FOUND';
    throw err;
  }
  return vehicle;
}

// Used by maintenance.service (Member C) to flip a vehicle in/out of
// MAINTENANCE, and by trip.service to flip AVAILABLE <-> ON_TRIP.
async function setStatus(id, status) {
  const vehicle = await getById(id);
  vehicle.status = status;
  await vehicle.save();
  return vehicle;
}

async function updateOdometer(id, odometerKm) {
  const vehicle = await getById(id);
  vehicle.currentOdometerKm = odometerKm;
  await vehicle.save();
  return vehicle;
}

module.exports = { register, list, getById, setStatus, updateOdometer };