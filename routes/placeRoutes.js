'use strict';

const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/is-auth');
const placeController = require('../controllers/placeController');

router.get('/', placeController.getAll);
router.get('/:title', placeController.getOne);
router.post('/', isAuth, placeController.create);
router.put('/:title', isAuth, placeController.update);

// Export des routes pour utilisation dans app.js
module.exports = router;
