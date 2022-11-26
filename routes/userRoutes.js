'use strict';

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);

// Export des routes pour utilisation dans app.js
module.exports = router;
