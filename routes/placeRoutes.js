'use strict';

const express = require('express');
const router = express.Router();
const { needsAuth, isAuth } = require('../middlewares/is-auth');
const placeController = require('../controllers/placeController');

router.get('/all', placeController.getAll);
router.get('/details/:title', isAuth, placeController.getOne);
router.post('/', needsAuth, placeController.create);
router.get('/:title', needsAuth, placeController.getForUpdate);
router.put('/:title', needsAuth, placeController.update);

// Export des routes pour utilisation dans app.js
module.exports = router;
