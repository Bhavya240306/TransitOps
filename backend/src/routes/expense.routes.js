const express = require('express');
const router = express.Router();

const controller = require('../controllers/expense.controller');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

router.use(authMiddleware);
router.get('/', controller.list);
router.post('/', requireRole('FINANCIAL_ANALYST'), controller.create);

module.exports = router;
