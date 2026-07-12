// Implements the core trip lifecycle from section 4 of the MVP doc:
//   create -> recommend -> approve -> notify -> alcohol check -> accept
//   -> start (readings) -> [mid-trip refuels] -> end (readings) -> complete
// Every transition validates the trip's current status/assignmentStatus
// first, so out-of-order calls (e.g. starting a trip that was never
// approved) fail with a clear error instead of corrupting state.

const { Trip, Vehicle, Driver, User, TripLiveLocation, sequelize } = require('../models');
const vehicleService = require('./vehicle.service');
const driverService = require('./driver.service');

const WEIGHTS = { safety: 0.5, routeFamiliarity: 0.3, loadFit: 0.2 };

function fail(message, statusCode, code) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  return err;
}

async function getById(id) {
  const trip = await Trip.findByPk(id, {
    include: [
      { model: Vehicle, as: 'vehicle' },
      { model: Driver, as: 'driver', include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'email'] }] },
      { model: TripLiveLocation, as: 'liveLocation' },
    ],
  });
  if (!trip) throw fail('Trip not found', 404, 'TRIP_NOT_FOUND');
  return trip;
}

async function listForFleetManager(fleetManagerId) {
  return Trip.findAll({ where: { fleetManagerId }, order: [['createdAt', 'DESC']] });
}

async function listForDriver(driverId) {
  return Trip.findAll({ where: { driverId }, order: [['createdAt', 'DESC']] });
}

async function listAll() {
  return Trip.findAll({ order: [['createdAt', 'DESC']] });
}

// Step 1: Fleet Manager creates the trip shell.
async function create(fleetManagerId, { sourceAddress, destinationAddress, sourceLat, sourceLng, destLat, destLng, cargoWeightKg }) {
  return Trip.create({
    fleetManagerId,
    sourceAddress,
    destinationAddress,
    sourceLat,
    sourceLng,
    destLat,
    destLng,
    cargoWeightKg,
    status: 'DRAFT',
  });
}

// Step 2+3: filter eligible driver+vehicle pairs, score every combination,
// return them sorted best-first, and stamp the top pair onto the trip as
// its pending recommendation.
async function generateRecommendation(tripId) {
  const trip = await Trip.findByPk(tripId);
  if (!trip) throw fail('Trip not found', 404, 'TRIP_NOT_FOUND');
  if (!['DRAFT', 'RECOMMENDED', 'DECLINED'].includes(trip.status)) {
    throw fail('Trip is no longer eligible for a new recommendation', 400, 'INVALID_STATE');
  }

  const eligibleVehicles = await Vehicle.findAll({
    where: { status: 'AVAILABLE' },
  });
  const capableVehicles = eligibleVehicles.filter((v) => v.capacityKg >= trip.cargoWeightKg);

  const eligibleDrivers = await Driver.findAll({ where: { status: 'AVAILABLE' } });

  if (capableVehicles.length === 0) throw fail('No available vehicle has enough capacity for this cargo weight', 409, 'NO_ELIGIBLE_VEHICLE');
  if (eligibleDrivers.length === 0) throw fail('No approved, available driver right now', 409, 'NO_ELIGIBLE_DRIVER');

  const scoredPairs = [];
  for (const driver of eligibleDrivers) {
    const familiarityCount = driver.routeFamiliarity?.[trip.destinationAddress] || 0;
    const familiarityScore = Math.min(100, familiarityCount * 20); // 5 trips -> maxed out
    for (const vehicle of capableVehicles) {
      const loadFitRatio = trip.cargoWeightKg / vehicle.capacityKg; // closer to 1 = tighter, still valid, fit
      const loadFitScore = 100 - Math.abs(0.75 - loadFitRatio) * 100; // sweet spot ~75% utilization
      const score =
        WEIGHTS.safety * driver.safetyScore +
        WEIGHTS.routeFamiliarity * familiarityScore +
        WEIGHTS.loadFit * Math.max(0, Math.min(100, loadFitScore));

      scoredPairs.push({
        driverId: driver.id,
        vehicleId: vehicle.id,
        score: Number(score.toFixed(2)),
        breakdown: {
          safetyScore: driver.safetyScore,
          familiarityScore,
          loadFitScore: Math.max(0, Math.min(100, Number(loadFitScore.toFixed(2)))),
        },
      });
    }
  }

  scoredPairs.sort((a, b) => b.score - a.score);
  const best = scoredPairs[0];

  trip.driverId = best.driverId;
  trip.vehicleId = best.vehicleId;
  trip.recommendationScore = best.score;
  trip.recommendationBreakdown = best.breakdown;
  trip.status = 'RECOMMENDED';
  await trip.save();

  return { trip, candidates: scoredPairs.slice(0, 5) };
}

// Fleet Manager requests the next-best pair instead of the current one
// (MVP: manual re-run, no auto-loop on decline per the cut list).
async function requestNextBest(tripId) {
  const { candidates } = await generateRecommendation(tripId);
  const trip = await Trip.findByPk(tripId);
  const next = candidates[1];
  if (!next) throw fail('No alternative pair available', 409, 'NO_ALTERNATIVE');
  trip.driverId = next.driverId;
  trip.vehicleId = next.vehicleId;
  trip.recommendationScore = next.score;
  trip.recommendationBreakdown = next.breakdown;
  await trip.save();
  return trip;
}

// Step 4: Fleet Manager approves the recommended pair -> driver notified.
async function approve(tripId, fleetManagerId) {
  const trip = await Trip.findByPk(tripId);
  if (!trip) throw fail('Trip not found', 404, 'TRIP_NOT_FOUND');
  if (trip.fleetManagerId !== fleetManagerId) throw fail('Not your trip', 403, 'FORBIDDEN');
  if (trip.status !== 'RECOMMENDED') throw fail('Trip must be in RECOMMENDED state to approve', 400, 'INVALID_STATE');

  trip.status = 'APPROVED';
  trip.assignmentStatus = 'NOTIFIED';
  await trip.save();
  return trip;
}

// Step 5a: driver takes the alcohol check.
async function submitAlcoholCheck(tripId, driverId, passed) {
  const trip = await Trip.findByPk(tripId);
  if (!trip) throw fail('Trip not found', 404, 'TRIP_NOT_FOUND');
  if (trip.driverId !== driverId) throw fail('This trip is not assigned to you', 403, 'FORBIDDEN');
  if (trip.status !== 'APPROVED') throw fail('Trip is not awaiting an alcohol check', 400, 'INVALID_STATE');

  trip.alcoholTestStatus = passed ? 'PASSED' : 'FAILED';
  await trip.save();
  return trip;
}

// Step 5b: driver accepts or declines.
async function respondToAssignment(tripId, driverId, accept) {
  const trip = await Trip.findByPk(tripId);
  if (!trip) throw fail('Trip not found', 404, 'TRIP_NOT_FOUND');
  if (trip.driverId !== driverId) throw fail('This trip is not assigned to you', 403, 'FORBIDDEN');
  if (trip.status !== 'APPROVED') throw fail('Trip is not awaiting a driver response', 400, 'INVALID_STATE');
  if (trip.alcoholTestStatus !== 'PASSED') throw fail('Alcohol check must pass before accepting', 400, 'ALCOHOL_CHECK_REQUIRED');

  if (!accept) {
    trip.assignmentStatus = 'DECLINED';
    trip.status = 'DECLINED';
    await trip.save();
    return trip;
  }

  trip.assignmentStatus = 'ACCEPTED';
  await trip.save();
  return trip;
}

// Step 6-7: driver logs start odometer + fuel -> trip goes DISPATCHED,
// vehicle & driver flip to ON_TRIP.
async function startTrip(tripId, driverId, { startOdometerKm, startFuelReading }) {
  return sequelize.transaction(async (t) => {
    const trip = await Trip.findByPk(tripId, { transaction: t });
    if (!trip) throw fail('Trip not found', 404, 'TRIP_NOT_FOUND');
    if (trip.driverId !== driverId) throw fail('This trip is not assigned to you', 403, 'FORBIDDEN');
    if (trip.status !== 'APPROVED' || trip.assignmentStatus !== 'ACCEPTED') {
      throw fail('Trip must be accepted before it can be dispatched', 400, 'INVALID_STATE');
    }

    trip.startOdometerKm = startOdometerKm;
    trip.startFuelReading = startFuelReading;
    trip.status = 'DISPATCHED';
    trip.dispatchedAt = new Date();
    await trip.save({ transaction: t });

    await Vehicle.update({ status: 'ON_TRIP' }, { where: { id: trip.vehicleId }, transaction: t });
    await Driver.update({ status: 'ON_TRIP' }, { where: { id: trip.driverId }, transaction: t });

    return trip;
  });
}

// Live GPS: upsert the single latest-position row for this trip.
async function postLiveLocation(tripId, driverId, { lat, lng }) {
  const trip = await Trip.findByPk(tripId);
  if (!trip) throw fail('Trip not found', 404, 'TRIP_NOT_FOUND');
  if (trip.driverId !== driverId) throw fail('This trip is not assigned to you', 403, 'FORBIDDEN');
  if (trip.status !== 'DISPATCHED') throw fail('Trip is not currently in progress', 400, 'INVALID_STATE');

  const [location] = await TripLiveLocation.upsert(
    { tripId, lat, lng, recordedAt: new Date() },
    { returning: true }
  );
  return location;
}

async function getLiveLocation(tripId) {
  return TripLiveLocation.findOne({ where: { tripId } });
}

// Step 9-10: driver logs end odometer + fuel -> compute distance and
// fuel_used = (start_fuel - end_fuel) + SUM(mid-trip refuels' liters),
// where the refuel sum is passed in by fuelLog.service (Member C owns
// FuelLog, so trip.service asks it for the total rather than querying the
// table directly).
async function completeTrip(tripId, driverId, { endOdometerKm, endFuelReading }, midTripRefuelLiters = 0) {
  return sequelize.transaction(async (t) => {
    const trip = await Trip.findByPk(tripId, { transaction: t });
    if (!trip) throw fail('Trip not found', 404, 'TRIP_NOT_FOUND');
    if (trip.driverId !== driverId) throw fail('This trip is not assigned to you', 403, 'FORBIDDEN');
    if (trip.status !== 'DISPATCHED') throw fail('Trip is not currently in progress', 400, 'INVALID_STATE');
    if (endOdometerKm < trip.startOdometerKm) throw fail('End odometer cannot be less than start odometer', 400, 'INVALID_ODOMETER');

    const distanceKm = endOdometerKm - trip.startOdometerKm;
    const fuelUsedLiters = (trip.startFuelReading - endFuelReading) + midTripRefuelLiters;

    trip.endOdometerKm = endOdometerKm;
    trip.endFuelReading = endFuelReading;
    trip.distanceKm = distanceKm;
    trip.fuelUsedLiters = fuelUsedLiters;
    trip.status = 'COMPLETED';
    trip.completedAt = new Date();
    await trip.save({ transaction: t });

    await Vehicle.update(
      { status: 'AVAILABLE', currentOdometerKm: endOdometerKm },
      { where: { id: trip.vehicleId }, transaction: t }
    );
    await Driver.update({ status: 'AVAILABLE' }, { where: { id: trip.driverId }, transaction: t });

    return trip;
  });
}

// Cancel path: Fleet Manager or Driver can cancel from APPROVED/DISPATCHED.
async function cancel(tripId, actor) {
  const trip = await Trip.findByPk(tripId);
  if (!trip) throw fail('Trip not found', 404, 'TRIP_NOT_FOUND');
  if (!['APPROVED', 'DISPATCHED'].includes(trip.status)) {
    throw fail('Only approved or dispatched trips can be cancelled', 400, 'INVALID_STATE');
  }
  if (actor.role === 'FLEET_MANAGER' && trip.fleetManagerId !== actor.id) throw fail('Not your trip', 403, 'FORBIDDEN');

  trip.status = 'CANCELLED';
  await trip.save();

  if (trip.vehicleId) await vehicleService.setStatus(trip.vehicleId, 'AVAILABLE');
  if (trip.driverId) await driverService.setStatus(trip.driverId, 'AVAILABLE');

  return trip;
}

module.exports = {
  getById,
  listForFleetManager,
  listForDriver,
  listAll,
  create,
  generateRecommendation,
  requestNextBest,
  approve,
  submitAlcoholCheck,
  respondToAssignment,
  startTrip,
  postLiveLocation,
  getLiveLocation,
  completeTrip,
  cancel,
};