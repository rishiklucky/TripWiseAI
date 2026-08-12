const express = require('express');
const router = express.Router();
const { getAIStatus } = require('../controllers/aiController');

router.get('/status', getAIStatus);

module.exports = router;
