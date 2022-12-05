'use strict';

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { needsAuth } = require('../middlewares/is-auth');
const { status } = require('../utils/enums');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/auth', needsAuth, (req, res, next) =>
    res.status(200).send({ status: status.success }));
// Export des routes pour utilisation dans app.js
module.exports = router;
