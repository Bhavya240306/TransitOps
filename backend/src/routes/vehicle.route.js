const express = require('express');
const router = express.Router();

const controller = require('../controllers/vehicle.controller');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

router.use(authMiddleware);

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', requireRole('FLEET_MANAGER'), controller.register);
router.patch('/:id/status', requireRole('FLEET_MANAGER'), controller.updateStatus);

module.exports = router;