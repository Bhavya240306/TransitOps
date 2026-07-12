const expenseService = require('../services/expense.service');
const { success, error } = require('../utils/apiResponse');

async function create(req, res, next) {
  try {
    const { vehicleId, tripId, category, amount, description } = req.body;
    if (amount == null) return error(res, 'amount is required', 400, 'MISSING_FIELDS');
    const expense = await expenseService.log(req.user.id, { vehicleId, tripId, category, amount, description });
    return success(res, expense, 201);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const expenses = await expenseService.list(req.query);
    return success(res, expenses);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list };