const express = require('express');
const router = express.Router();

const controller = require('../controllers/driver.controller');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

router.use(authMiddleware);

router.post('/me', requireRole('DRIVER'), controller.createMyProfile);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.patch('/:id/approve', requireRole('SAFETY_OFFICER'), controller.approve);
router.patch('/:id/suspend', requireRole('SAFETY_OFFICER'), controller.suspend);
router.patch('/:id/reinstate', requireRole('SAFETY_OFFICER'), controller.reinstate);

module.exports = router;