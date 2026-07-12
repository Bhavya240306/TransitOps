const express = require('express');
const router = express.Router();

const controller = require('../controllers/maintenance.controller');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

router.use(authMiddleware);
router.get('/', controller.list);
router.post('/', requireRole('FLEET_MANAGER'), controller.create);
router.patch('/:id/close', requireRole('FLEET_MANAGER'), controller.close);

module.exports = router;