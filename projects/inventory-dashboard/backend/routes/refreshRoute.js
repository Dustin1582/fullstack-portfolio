const express = require('express');
const router = express.Router();

const {handleRefresh} = require('../controllers/refreshController');

router.get('/refresh', handleRefresh);

module.exports = router;