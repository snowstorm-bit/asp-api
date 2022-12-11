'use strict';

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { needsAuth } = require('../middlewares/is-auth');
const climbController = require('../controllers/climbController');
const placeController = require('../controllers/placeController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/account/profile', needsAuth, userController.getProfile);
router.put('/account/profile', needsAuth, userController.updateProfile);
router.get('/account/places', needsAuth, placeController.getCreated);
router.get('/account/climbs', needsAuth, climbController.getCreated);
router.get('/account/rates/climbs', needsAuth, climbController.getRated);

module.exports = router;
