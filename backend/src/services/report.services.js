const { Trip, Vehicle, FuelLog, Expense } = require("../models");
const { Op, fn, col } = require("sequelize");

async function getReports() {
  const totalTrips = await Trip.count();
  const completedTrips = await Trip.count({ where: { status: "COMPLETED" } });
  const availableVehicles = await Vehicle.count({ where: { status: "AVAILABLE" } });

  const completed = await Trip.findAll({
    where: { status: "COMPLETED" },
    attributes: ["distanceKm", "fuelUsedLiters", "completedAt"],
  });

  const totalDistance = completed.reduce((s, t) => s + (t.distanceKm || 0), 0);
  const totalFuel = completed.reduce((s, t) => s + (t.fuelUsedLiters || 0), 0);
  const fuelEfficiency = totalFuel > 0 ? Number((totalDistance / totalFuel).toFixed(2)) : 0;

  const expenseTotal = (await Expense.sum("amount")) || 0;
  const fuelCostTotal = (await FuelLog.sum("costAmount")) || 0;
  const operationalCost = Number((expenseTotal + fuelCostTotal).toFixed(2));

  // Simple ROI placeholder: needs a real revenue figure once that concept
  // exists in the data model. Flagged here rather than left as a magic
  // number so it's obvious this still needs a real input.
  const roi = null;

  const monthlyCostMap = {};
  for (const t of completed) {
    if (!t.completedAt) continue;
    const key = t.completedAt.toISOString().slice(0, 7); // YYYY-MM
    monthlyCostMap[key] = (monthlyCostMap[key] || 0) + (t.fuelUsedLiters || 0);
  }
  const monthlyCost = Object.entries(monthlyCostMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, fuelUsed]) => ({ month, fuelUsed: Number(fuelUsed.toFixed(2)) }));

  return {
    totalTrips, completedTrips, availableVehicles,
    fuelEfficiency, operationalCost, roi, monthlyCost,
  };
}

module.exports = { getReports };