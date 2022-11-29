'use strict';

const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/is-auth');
const placeController = require('../controllers/placeController');

router.get('/all', placeController.getAll);
router.get('/details/:title', placeController.getOne);
router.post('/', isAuth, placeController.create);
router.get('/:title', isAuth, placeController.getForUpdate);
router.put('/:title', isAuth, placeController.update);

// Export des routes pour utilisation dans app.js
module.exports = router;
