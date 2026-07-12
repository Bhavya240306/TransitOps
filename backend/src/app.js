// backend/src/app.js
//
// Configures the Express app: global middleware, route mounting, and the
// error handler (must stay LAST). server.js imports this and starts it
// listening — kept separate so the app itself can be imported by tests
// later without actually binding a port.

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/v1', routes);

// Must be registered after all routes.
app.use(errorHandler);

module.exports = app;
