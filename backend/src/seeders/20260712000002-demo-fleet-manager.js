
// Seeds the one Fleet Manager account. This bypasses auth.service's
// signup rule intentionally, since Fleet Manager is admin-provisioned,
// not self-registered. Run with: npm run seed
//
// Demo login after seeding:
//   email:    manager@transitops.com
//   password: Manager@123

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    const passwordHash = await bcrypt.hash('Manager@123', 10);

    await queryInterface.bulkInsert('users', [
      {
        email: 'manager@transitops.com',
        password_hash: passwordHash,
        full_name: 'Fleet Manager (Demo)',
        role: 'FLEET_MANAGER',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', { email: 'manager@transitops.com' });
  },
};
