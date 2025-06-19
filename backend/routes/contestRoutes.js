const express = require('express');
const {contestStats}=require('../controllers/contestContoller')
const router = express.Router();

router.get('/:handle/contestStats',contestStats);

module.exports = router;