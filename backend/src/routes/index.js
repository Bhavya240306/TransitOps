// backend/src/routes/index.js
//
// Central mount point for every domain's routes under /api/v1.
//
// TEAM NOTE: each new route file gets ONE require + ONE router.use line
// here. To minimize merge conflicts on this shared file, always add your
// line at the BOTTOM of the list, never in the middle, and push often.

const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));

// Member B adds:
// router.use('/vehicles', require('./vehicle.routes'));
// router.use('/drivers', require('./driver.routes'));
// router.use('/trips', require('./trip.routes'));

// Member C adds:
// router.use('/maintenance', require('./maintenance.routes'));
// router.use('/fuel-logs', require('./fuelLog.routes'));
// router.use('/expenses', require('./expense.routes'));
// router.use('/reports', require('./report.routes'));

module.exports = router;
