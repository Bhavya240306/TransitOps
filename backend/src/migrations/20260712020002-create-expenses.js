module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('expenses', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      vehicle_id: {
        type: Sequelize.BIGINT, allowNull: true,
        references: { model: 'vehicles', key: 'id' },
      },
      trip_id: {
        type: Sequelize.BIGINT, allowNull: true,
        references: { model: 'trips', key: 'id' },
      },
      logged_by_user_id: { type: Sequelize.BIGINT, allowNull: false },
      category: {
        type: Sequelize.ENUM('TOLL', 'MAINTENANCE', 'FINE', 'OTHER'),
        allowNull: false, defaultValue: 'OTHER',
      },
      amount: { type: Sequelize.FLOAT, allowNull: false },
      description: { type: Sequelize.STRING(255), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => queryInterface.dropTable('expenses'),
};