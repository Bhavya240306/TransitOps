// Latest-position-only table (1:1 with Trip, upserted every ~10s while a
// trip is DISPATCHED). We deliberately do NOT keep a position history
// table in the MVP — that's what "WebSocket real-time GPS" / richer
// tracking would need, and it's explicitly cut. Polling this single row
// is enough for the Fleet Manager's live map.

module.exports = (sequelize, DataTypes) => {
  const TripLiveLocation = sequelize.define('TripLiveLocation', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    tripId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    lat: { type: DataTypes.FLOAT, allowNull: false },
    lng: { type: DataTypes.FLOAT, allowNull: false },
    recordedAt: { type: DataTypes.DATE, allowNull: false },
  }, {
    tableName: 'trip_live_locations',
  });

  TripLiveLocation.associate = (models) => {
    TripLiveLocation.belongsTo(models.Trip, { foreignKey: 'tripId', as: 'trip' });
  };

  return TripLiveLocation;
};