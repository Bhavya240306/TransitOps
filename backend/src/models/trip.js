//`status` tracks the
// coarse lifecycle stage; `assignmentStatus` and `alcoholTestStatus` track
// the driver-side sub-steps that happen while status is still APPROVED.

module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define('Trip', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    fleetManagerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    driverId: {
      type: DataTypes.BIGINT,
      allowNull: true, // unset until a recommendation is approved
    },
    vehicleId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    sourceAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    destinationAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sourceLat: { type: DataTypes.FLOAT, allowNull: true },
    sourceLng: { type: DataTypes.FLOAT, allowNull: true },
    destLat: { type: DataTypes.FLOAT, allowNull: true },
    destLng: { type: DataTypes.FLOAT, allowNull: true },
    cargoWeightKg: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0 },
    },

    // DRAFT: created, not yet scored.
    // RECOMMENDED: system has scored eligible pairs, awaiting FM approval.
    // APPROVED: FM approved a pair; driver notification/accept flow runs next.
    // DISPATCHED: driver accepted + logged start readings; trip in progress.
    // COMPLETED: end readings logged, distance/fuel computed.
    // CANCELLED: cancelled from APPROVED or DISPATCHED.
    // DECLINED: driver declined the recommended pair.
    status: {
      type: DataTypes.ENUM(
        'DRAFT', 'RECOMMENDED', 'APPROVED', 'DISPATCHED',
        'COMPLETED', 'CANCELLED', 'DECLINED'
      ),
      allowNull: false,
      defaultValue: 'DRAFT',
    },

    // Driver-side notification/accept sub-flow, only meaningful once status
    // reaches APPROVED.
    assignmentStatus: {
      type: DataTypes.ENUM('NOT_NOTIFIED', 'NOTIFIED', 'ACCEPTED', 'DECLINED'),
      allowNull: false,
      defaultValue: 'NOT_NOTIFIED',
    },

    alcoholTestStatus: {
      type: DataTypes.ENUM('PENDING', 'PASSED', 'FAILED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },

    // Score breakdown for the pair the Fleet Manager approved (or is
    // reviewing), kept for transparency in the Recommendation Review screen.
    recommendationScore: { type: DataTypes.FLOAT, allowNull: true },
    recommendationBreakdown: { type: DataTypes.JSON, allowNull: true },

    startOdometerKm: { type: DataTypes.FLOAT, allowNull: true },
    startFuelReading: { type: DataTypes.FLOAT, allowNull: true },
    endOdometerKm: { type: DataTypes.FLOAT, allowNull: true },
    endFuelReading: { type: DataTypes.FLOAT, allowNull: true },

    // Computed once the trip completes.
    distanceKm: { type: DataTypes.FLOAT, allowNull: true },
    fuelUsedLiters: { type: DataTypes.FLOAT, allowNull: true },

    dispatchedAt: { type: DataTypes.DATE, allowNull: true },
    completedAt: { type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'trips',
  });

  Trip.associate = (models) => {
    Trip.belongsTo(models.User, { foreignKey: 'fleetManagerId', as: 'fleetManager' });
    Trip.belongsTo(models.Driver, { foreignKey: 'driverId', as: 'driver' });
    Trip.belongsTo(models.Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
    Trip.hasOne(models.TripLiveLocation, { foreignKey: 'tripId', as: 'liveLocation' });
    if (models.FuelLog) {
      Trip.hasMany(models.FuelLog, { foreignKey: 'tripId', as: 'fuelLogs' });
    }
    if (models.Expense) {
      Trip.hasMany(models.Expense, { foreignKey: 'tripId', as: 'expenses' });
    }
  };

  return Trip;
};