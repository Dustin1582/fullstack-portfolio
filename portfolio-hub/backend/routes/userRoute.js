const express = require('express');
const router = express.Router();

const { getUserCount, getUserProfile } = require('../controllers/userController');

router.get("/user-count", getUserCount)
router.get("/user-profile", getUserProfile)
module.exports = router