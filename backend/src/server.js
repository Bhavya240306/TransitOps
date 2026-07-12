
// Actual entry point (this is what `npm run dev` runs). Verifies the DB
// connection is alive BEFORE accepting any HTTP traffic, so a bad
// DB_PASSWORD fails immediately and loudly instead of showing up as a
// confusing 500 on the first request.

require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/database');

const PORT = process.env.PORT || 5000;

async function start() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚚 TransitOps API running on http://localhost:${PORT}`);
  });
}

start();
