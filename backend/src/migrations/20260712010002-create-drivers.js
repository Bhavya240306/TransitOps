module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('drivers', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      license_number: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      license_expiry_date: { type: Sequelize.DATEONLY, allowNull: false },
      safety_score: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 70 },
      status: {
        type: Sequelize.ENUM('PENDING_APPROVAL', 'AVAILABLE', 'ON_TRIP', 'SUSPENDED'),
        allowNull: false,
        defaultValue: 'PENDING_APPROVAL',
      },
      route_familiarity: { type: Sequelize.JSON, allowNull: false },
      approved_by_user_id: { type: Sequelize.BIGINT, allowNull: true },
      approved_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('drivers');
  },
};