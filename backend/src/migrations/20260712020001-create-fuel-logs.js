module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('fuel_logs', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      vehicle_id: {
        type: Sequelize.BIGINT, allowNull: false,
        references: { model: 'vehicles', key: 'id' },
      },
      trip_id: {
        type: Sequelize.BIGINT, allowNull: true,
        references: { model: 'trips', key: 'id' },
      },
      logged_by_driver_id: { type: Sequelize.BIGINT, allowNull: true },
      liters: { type: Sequelize.FLOAT, allowNull: false },
      cost_amount: { type: Sequelize.FLOAT, allowNull: true },
      is_mid_trip: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => queryInterface.dropTable('fuel_logs'),
};