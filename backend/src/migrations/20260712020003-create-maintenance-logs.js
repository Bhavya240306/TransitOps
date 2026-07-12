module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('maintenance_logs', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      vehicle_id: {
        type: Sequelize.BIGINT, allowNull: false,
        references: { model: 'vehicles', key: 'id' },
      },
      issue: { type: Sequelize.STRING(255), allowNull: false },
      status: {
        type: Sequelize.ENUM('OPEN', 'CLOSED'),
        allowNull: false, defaultValue: 'OPEN',
      },
      cost_amount: { type: Sequelize.FLOAT, allowNull: true },
      opened_by_user_id: { type: Sequelize.BIGINT, allowNull: false },
      closed_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => queryInterface.dropTable('maintenance_logs'),
};