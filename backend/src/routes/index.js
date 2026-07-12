
// Central mount point for every domain's routes under /api/v1.


const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/dashboard', require('./dashboard.routes'));

router.use('/vehicles', require('./vehicle.routes'));
router.use('/drivers', require('./driver.routes'));
router.use('/trips', require('./trip.routes'));

router.use('/maintenance', require('./maintenance.routes'));
router.use('/fuel-logs', require('./fuelLog.routes'));
router.use('/expenses', require('./expense.routes'));
router.use('/reports', require('./report.routes'));


module.exports = router;
