const express = require('express');
const checkURL = require('../controllers/checkUrlController');

const router = new express.Router();

router.post('/check-url', checkURL);

module.exports = router;
