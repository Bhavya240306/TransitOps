
// Central mount point for every domain's routes under /api/v1.


const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));



module.exports = router;
