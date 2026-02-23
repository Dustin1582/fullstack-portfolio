const express = require('express');
const router = express.Router();
const { me } = require('../controllers/getCurrentUserController');

router.get('/me', me);

module.exports = router;