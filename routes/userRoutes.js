'use strict';

const express = require('express');
const router = express.Router();

const accountController = require('../controllers/userController');

router.post('/user/register', accountController.register);
router.post('/user/login', accountController.login);

// Export des routes pour utilisation dans app.js
module.exports = router;
