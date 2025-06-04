'use strict';

var express = require('express');
var authController = require('../controllers/auth');

var router = express.Router();

router.post('/api/auth/register', authController.register);
router.post('/api/auth/login', authController.login);

module.exports = router;
