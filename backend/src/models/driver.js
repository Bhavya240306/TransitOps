// A Driver row is a Driver-role User's operational profile: license info,
// safety score, and current availability. Created when a Driver-role User
// signs up (see driver.service.js#createProfileForUser), then gated by a
// Safety Officer before the driver becomes eligible for any trip.

module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('Driver', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    licenseNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    licenseExpiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // 0-100. Used as one of the three inputs to the recommendation score.
    // Starts at a neutral 70 for new drivers; Safety Officer / trip history
    // can adjust it over time (out of scope to auto-adjust in this MVP).
    safetyScore: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 70,
      validate: { min: 0, max: 100 },
    },
    // PENDING_APPROVAL: signed up, not yet cleared by Safety Officer.
    // AVAILABLE: cleared and free for a new trip.
    // ON_TRIP: currently dispatched.
    // SUSPENDED: blocked by Safety Officer, never eligible.
    status: {
      type: DataTypes.ENUM('PENDING_APPROVAL', 'AVAILABLE', 'ON_TRIP', 'SUSPENDED'),
      allowNull: false,
      defaultValue: 'PENDING_APPROVAL',
    },
    // Map of destination -> completed trip count, e.g. {"Pune": 4, "Nashik": 1}.
    // Bumped each time a trip to that destination completes; read by the
    // recommendation engine as the "route familiarity" score input.
    routeFamiliarity: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },
    approvedByUserId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'drivers',
  });

  Driver.associate = (models) => {
    Driver.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Driver.hasMany(models.Trip, { foreignKey: 'driverId', as: 'trips' });
  };

  return Driver;
};