module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('trips', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      fleet_manager_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      driver_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'drivers', key: 'id' },
      },
      vehicle_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'vehicles', key: 'id' },
      },
      source_address: { type: Sequelize.STRING(255), allowNull: false },
      destination_address: { type: Sequelize.STRING(255), allowNull: false },
      source_lat: { type: Sequelize.FLOAT, allowNull: true },
      source_lng: { type: Sequelize.FLOAT, allowNull: true },
      dest_lat: { type: Sequelize.FLOAT, allowNull: true },
      dest_lng: { type: Sequelize.FLOAT, allowNull: true },
      cargo_weight_kg: { type: Sequelize.FLOAT, allowNull: false },
      status: {
        type: Sequelize.ENUM(
          'DRAFT', 'RECOMMENDED', 'APPROVED', 'DISPATCHED',
          'COMPLETED', 'CANCELLED', 'DECLINED'
        ),
        allowNull: false,
        defaultValue: 'DRAFT',
      },
      assignment_status: {
        type: Sequelize.ENUM('NOT_NOTIFIED', 'NOTIFIED', 'ACCEPTED', 'DECLINED'),
        allowNull: false,
        defaultValue: 'NOT_NOTIFIED',
      },
      alcohol_test_status: {
        type: Sequelize.ENUM('PENDING', 'PASSED', 'FAILED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      recommendation_score: { type: Sequelize.FLOAT, allowNull: true },
      recommendation_breakdown: { type: Sequelize.JSON, allowNull: true },
      start_odometer_km: { type: Sequelize.FLOAT, allowNull: true },
      start_fuel_reading: { type: Sequelize.FLOAT, allowNull: true },
      end_odometer_km: { type: Sequelize.FLOAT, allowNull: true },
      end_fuel_reading: { type: Sequelize.FLOAT, allowNull: true },
      distance_km: { type: Sequelize.FLOAT, allowNull: true },
      fuel_used_liters: { type: Sequelize.FLOAT, allowNull: true },
      dispatched_at: { type: Sequelize.DATE, allowNull: true },
      completed_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('trips');
  },
};