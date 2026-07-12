module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define('Expense', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    vehicleId: { type: DataTypes.BIGINT, allowNull: true },
    tripId: { type: DataTypes.BIGINT, allowNull: true },
    loggedByUserId: { type: DataTypes.BIGINT, allowNull: false },
    category: {
      type: DataTypes.ENUM('TOLL', 'MAINTENANCE', 'FINE', 'OTHER'),
      allowNull: false, defaultValue: 'OTHER',
    },
    amount: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0 } },
    description: { type: DataTypes.STRING(255), allowNull: true },
  }, { tableName: 'expenses' });

  Expense.associate = (models) => {
    Expense.belongsTo(models.Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
    Expense.belongsTo(models.Trip, { foreignKey: 'tripId', as: 'trip' });
  };

  return Expense;
};