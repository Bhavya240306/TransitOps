const { Expense } = require('../models');

async function log(userId, { vehicleId, tripId, category, amount, description }) {
  return Expense.create({
    loggedByUserId: userId, vehicleId: vehicleId ?? null, tripId: tripId ?? null,
    category: category || 'OTHER', amount, description: description ?? null,
  });
}

async function list({ vehicleId, tripId } = {}) {
  const where = {};
  if (vehicleId) where.vehicleId = vehicleId;
  if (tripId) where.tripId = tripId;
  return Expense.findAll({ where, order: [['createdAt', 'DESC']] });
}

module.exports = { log, list };