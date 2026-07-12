
// Represents a login account. Every role (Fleet Manager, Driver, Safety
// Officer, Financial Analyst) is a User row distinguished by `role`.
// A Driver's operational profile (license, safety score, etc.) lives in a
// separate Driver model that links back here via userId — added by
// whoever owns Vehicle/Driver/Trip models.

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'users',
  });

  // Associations are declared here but only take effect once the related
  // model (Driver) exists. Safe to leave in place even before Driver.js
  // is written — Sequelize just won't find a match until it is.
  User.associate = (models) => {
    if (models.Driver) {
      User.hasOne(models.Driver, { foreignKey: 'userId', as: 'driverProfile' });
    }
  };

  return User;
};
