module.exports = (sequelize, DataTypes) => {
  const FuelLog = sequelize.define('FuelLog', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    vehicleId: { type: DataTypes.BIGINT, allowNull: false },
    tripId: { type: DataTypes.BIGINT, allowNull: true },
    loggedByDriverId: { type: DataTypes.BIGINT, allowNull: true },
    liters: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0 } },
    costAmount: { type: DataTypes.FLOAT, allowNull: true },
    // true for a mid-trip refuel logged by the driver; false for a
    // depot/off-trip fill-up logged some other way later.
    isMidTrip: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, { tableName: 'fuel_logs' });

  FuelLog.associate = (models) => {
    FuelLog.belongsTo(models.Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
    FuelLog.belongsTo(models.Trip, { foreignKey: 'tripId', as: 'trip' });
  };

  return FuelLog;
};