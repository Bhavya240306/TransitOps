const { Trip, Vehicle } = require("../models");

async function getReports() {

    const totalTrips = await Trip.count();

    const completedTrips = await Trip.count({
        where: {
            status: "COMPLETED",
        },
    });

    const availableVehicles = await Vehicle.count({
        where: {
            status: "AVAILABLE",
        },
    });

    return {
        totalTrips,
        completedTrips,
        availableVehicles,
        fuelEfficiency: 12.8,
        operationalCost: 52340,
        roi: 21.5,
        monthlyCost: [
            { month: "Jan", cost: 32000 },
            { month: "Feb", cost: 41000 },
            { month: "Mar", cost: 29000 },
            { month: "Apr", cost: 51000 }
        ]
    };
}

module.exports = {
    getReports,
};