module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vehicles', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      registration_number: { type: Sequelize.STRING(30), allowNull: false, unique: true },
      make: { type: Sequelize.STRING(60), allowNull: false },
      model: { type: Sequelize.STRING(60), allowNull: false },
      capacity_kg: { type: Sequelize.FLOAT, allowNull: false },
      status: {
        type: Sequelize.ENUM('AVAILABLE', 'ON_TRIP', 'MAINTENANCE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'AVAILABLE',
      },
      current_odometer_km: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('vehicles');
  },
};