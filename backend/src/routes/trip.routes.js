const express = require('express');
const router = express.Router();

const controller = require('../controllers/trip.controller');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const resolveDriver = require('../middleware/resolveDriver.middleware');

router.use(authMiddleware);

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', requireRole('FLEET_MANAGER'), controller.create);
router.post('/:id/recommend', requireRole('FLEET_MANAGER'), controller.recommend);
router.post('/:id/recommend/next-best', requireRole('FLEET_MANAGER'), controller.requestNextBest);
router.post('/:id/approve', requireRole('FLEET_MANAGER'), controller.approve);
router.post('/:id/cancel', requireRole('FLEET_MANAGER', 'DRIVER'), controller.cancel);

// Driver-only sub-flow — resolveDriver attaches req.driverId after auth.
router.post('/:id/alcohol-check', requireRole('DRIVER'), resolveDriver, controller.alcoholCheck);
router.post('/:id/respond', requireRole('DRIVER'), resolveDriver, controller.respond);
router.post('/:id/start', requireRole('DRIVER'), resolveDriver, controller.start);
router.post('/:id/location', requireRole('DRIVER'), resolveDriver, controller.postLocation);
router.get('/:id/location', controller.getLocation);
router.post('/:id/complete', requireRole('DRIVER'), resolveDriver, controller.complete);
router.post('/:id/refuel', requireRole('DRIVER'), resolveDriver, controller.refuel);

module.exports = router;