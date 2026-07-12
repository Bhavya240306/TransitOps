const { Vehicle, Driver, Trip } = require("../models");

async function getDashboard() {

    const activeVehicles = await Vehicle.count({
        where: {
            status: "ON_TRIP",
        },
    });

    const availableVehicles = await Vehicle.count({
        where: {
            status: "AVAILABLE",
        },
    });

    const maintenanceVehicles = await Vehicle.count({
        where: {
            status: "IN_SHOP",
        },
    });

    const activeTrips = await Trip.count({
        where: {
            status: "DISPATCHED",
        },
    });

    const driversOnTrip = await Driver.count({
        where: {
            status: "ON_TRIP",
        },
    });

    const totalVehicles = await Vehicle.count();

    const fleetUtilization =
        totalVehicles === 0
            ? 0
            : Number(((activeVehicles / totalVehicles) * 100).toFixed(1));

    return {
        activeVehicles,
        availableVehicles,
        maintenanceVehicles,
        activeTrips,
        driversOnTrip,
        fleetUtilization,
    };
}

module.exports = {
    getDashboard,
};