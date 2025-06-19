const express = require('express');
const {problemStats}=require('../controllers/problemController')
const router = express.Router();

router.get('/:handle/problemStats',problemStats);

module.exports = router;