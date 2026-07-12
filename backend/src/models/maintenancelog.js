module.exports = (sequelize, DataTypes) => {
  const MaintenanceLog = sequelize.define('MaintenanceLog', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    vehicleId: { type: DataTypes.BIGINT, allowNull: false },
    issue: { type: DataTypes.STRING(255), allowNull: false },
    status: { type: DataTypes.ENUM('OPEN', 'CLOSED'), allowNull: false, defaultValue: 'OPEN' },
    costAmount: { type: DataTypes.FLOAT, allowNull: true },
    openedByUserId: { type: DataTypes.BIGINT, allowNull: false },
    closedAt: { type: DataTypes.DATE, allowNull: true },
  }, { tableName: 'maintenance_logs' });

  MaintenanceLog.associate = (models) => {
    MaintenanceLog.belongsTo(models.Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
  };

  return MaintenanceLog;
};