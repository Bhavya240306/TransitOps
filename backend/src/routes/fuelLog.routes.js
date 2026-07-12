const express = require('express');
const router = express.Router();

const controller = require('../controllers/fuelLog.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);
router.get('/', controller.list);

module.exports = router;