const express = require('express');
const router = express.Router();
const { getProgress, updateProgress } = require('../controllers/progressController');

router.get('/:company', getProgress);
router.post('/', updateProgress);

module.exports = router;