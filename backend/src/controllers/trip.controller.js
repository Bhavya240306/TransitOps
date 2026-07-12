const tripService = require('../services/trip.service');
const fuelLogService = require('../services/fuelLog.service');
const { success, error } = require('../utils/apiResponse');

async function create(req, res, next) {
  try {
    const { sourceAddress, destinationAddress, sourceLat, sourceLng, destLat, destLng, cargoWeightKg } = req.body;
    if (!sourceAddress || !destinationAddress || !cargoWeightKg) {
      return error(res, 'sourceAddress, destinationAddress, and cargoWeightKg are required', 400, 'MISSING_FIELDS');
    }
    const trip = await tripService.create(req.user.id, {
      sourceAddress, destinationAddress, sourceLat, sourceLng, destLat, destLng, cargoWeightKg,
    });
    return success(res, trip, 201);
  } catch (err) {
    next(err);
  }
}

async function recommend(req, res, next) {
  try {
    const result = await tripService.generateRecommendation(req.params.id);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function requestNextBest(req, res, next) {
  try {
    const trip = await tripService.requestNextBest(req.params.id);
    return success(res, trip);
  } catch (err) {
    next(err);
  }
}

async function approve(req, res, next) {
  try {
    const trip = await tripService.approve(req.params.id, req.user.id);
    return success(res, trip);
  } catch (err) {
    next(err);
  }
}

async function alcoholCheck(req, res, next) {
  try {
    const { passed } = req.body;
    const trip = await tripService.submitAlcoholCheck(req.params.id, req.driverId, !!passed);
    return success(res, trip);
  } catch (err) {
    next(err);
  }
}

async function respond(req, res, next) {
  try {
    const { accept } = req.body;
    const trip = await tripService.respondToAssignment(req.params.id, req.driverId, !!accept);
    return success(res, trip);
  } catch (err) {
    next(err);
  }
}

async function start(req, res, next) {
  try {
    const { startOdometerKm, startFuelReading } = req.body;
    if (startOdometerKm == null || startFuelReading == null) {
      return error(res, 'startOdometerKm and startFuelReading are required', 400, 'MISSING_FIELDS');
    }
    const trip = await tripService.startTrip(req.params.id, req.driverId, { startOdometerKm, startFuelReading });
    return success(res, trip);
  } catch (err) {
    next(err);
  }
}

async function postLocation(req, res, next) {
  try {
    const { lat, lng } = req.body;
    const location = await tripService.postLiveLocation(req.params.id, req.driverId, { lat, lng });
    return success(res, location);
  } catch (err) {
    next(err);
  }
}

async function getLocation(req, res, next) {
  try {
    const location = await tripService.getLiveLocation(req.params.id);
    return success(res, location);
  } catch (err) {
    next(err);
  }
}

async function complete(req, res, next) {
  try {
    const { endOdometerKm, endFuelReading } = req.body;
    if (endOdometerKm == null || endFuelReading == null) {
      return error(res, 'endOdometerKm and endFuelReading are required', 400, 'MISSING_FIELDS');
    }
    const midTripRefuelLiters = await fuelLogService.sumMidTripRefuelLiters(req.params.id);
    const trip = await tripService.completeTrip(req.params.id, req.driverId, { endOdometerKm, endFuelReading }, midTripRefuelLiters);
    return success(res, trip);
  } catch (err) {
    next(err);
  }
}

async function cancel(req, res, next) {
  try {
    const trip = await tripService.cancel(req.params.id, req.user);
    return success(res, trip);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    let trips;
    if (req.user.role === 'FLEET_MANAGER') trips = await tripService.listForFleetManager(req.user.id);
    else if (req.user.role === 'DRIVER') trips = await tripService.listForDriver(req.driverId);
    else trips = await tripService.listAll();
    return success(res, trips);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const trip = await tripService.getById(req.params.id);
    return success(res, trip);
  } catch (err) {
    next(err);
  }
}

async function refuel(req, res, next) {
  try {
    const { liters, costAmount } = req.body;
    if (liters == null) return error(res, 'liters is required', 400, 'MISSING_FIELDS');
    const log = await fuelLogService.logMidTripRefuel(req.params.id, req.driverId, { liters, costAmount });
    return success(res, log, 201);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create, recommend, requestNextBest, approve, alcoholCheck, respond,
  start, postLocation, getLocation, complete, cancel, list, getById,
  refuel,
};