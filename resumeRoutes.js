const express = require('express');
const router = express.Router();
const multer = require('multer');
const { extractTextFromResume } = require('../controllers/resumeController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('resume'), extractTextFromResume);

module.exports = router;