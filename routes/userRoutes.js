'use strict';

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { needsAuth, needsUserAuth } = require('../middlewares/is-auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
// Export des routes pour utilisation dans app.js
// router.get('/account', needsAuth, userController.get);
// router.put('/account', needsAuth, userController.update);

module.exports = router;
