const { FuelLog, Trip } = require('../models');

function fail(message, statusCode, code) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  return err;
}

// Called by trip.controller.complete() to fold mid-trip refuels into the
// fuel_used_liters formula: (start_fuel - end_fuel) + SUM(mid-trip refuels).
async function sumMidTripRefuelLiters(tripId) {
  const logs = await FuelLog.findAll({ where: { tripId, isMidTrip: true } });
  return logs.reduce((sum, log) => sum + log.liters, 0);
}

// Driver logs a refuel while a trip is DISPATCHED.
async function logMidTripRefuel(tripId, driverId, { liters, costAmount }) {
  const trip = await Trip.findByPk(tripId);
  if (!trip) throw fail('Trip not found', 404, 'TRIP_NOT_FOUND');
  if (trip.driverId !== driverId) throw fail('This trip is not assigned to you', 403, 'FORBIDDEN');
  if (trip.status !== 'DISPATCHED') throw fail('Trip is not currently in progress', 400, 'INVALID_STATE');

  return FuelLog.create({
    vehicleId: trip.vehicleId,
    tripId,
    loggedByDriverId: driverId,
    liters,
    costAmount: costAmount ?? null,
    isMidTrip: true,
  });
}

async function listForVehicle(vehicleId) {
  return FuelLog.findAll({ where: { vehicleId }, order: [['createdAt', 'DESC']] });
}

async function listAll() {
  return FuelLog.findAll({ order: [['createdAt', 'DESC']] });
}

module.exports = { sumMidTripRefuelLiters, logMidTripRefuel, listForVehicle, listAll };