// A vehicle in the fleet. Status here is the single source of truth for
// whether a vehicle is eligible to be recommended for a new trip — the
// recommendation engine in trip.service.js only ever considers vehicles
// with status AVAILABLE.

module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define('Vehicle', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    registrationNumber: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    make: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    capacityKg: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0 },
    },
    status: {
      type: DataTypes.ENUM('AVAILABLE', 'ON_TRIP', 'MAINTENANCE', 'INACTIVE'),
      allowNull: false,
      defaultValue: 'AVAILABLE',
    },
    // Running odometer reading, kept in sync every time a trip completes
    // so the next trip's distance calc always starts from a real number.
    currentOdometerKm: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    tableName: 'vehicles',
  });

  Vehicle.associate = (models) => {
    Vehicle.hasMany(models.Trip, { foreignKey: 'vehicleId', as: 'trips' });
    if (models.MaintenanceLog) {
      Vehicle.hasMany(models.MaintenanceLog, { foreignKey: 'vehicleId', as: 'maintenanceLogs' });
    }
    if (models.FuelLog) {
      Vehicle.hasMany(models.FuelLog, { foreignKey: 'vehicleId', as: 'fuelLogs' });
    }
    if (models.Expense) {
      Vehicle.hasMany(models.Expense, { foreignKey: 'vehicleId', as: 'expenses' });
    }
  };

  return Vehicle;
};