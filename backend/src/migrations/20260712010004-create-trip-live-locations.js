module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('trip_live_locations', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      trip_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        references: { model: 'trips', key: 'id' },
        onDelete: 'CASCADE',
      },
      lat: { type: Sequelize.FLOAT, allowNull: false },
      lng: { type: Sequelize.FLOAT, allowNull: false },
      recorded_at: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('trip_live_locations');
  },
};