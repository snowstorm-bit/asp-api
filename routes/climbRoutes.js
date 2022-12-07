'use strict';

const express = require('express');
const router = express.Router();
const { needsAuth, isAuth } = require('../middlewares/is-auth');
const climbController = require('../controllers/climbController');

router.get('/all', climbController.getAll2);
router.get('/details/:title', isAuth, climbController.getOne);
router.get('/', needsAuth, climbController.getForCreate);
router.post('/', needsAuth, climbController.create);
router.get('/:title', needsAuth, climbController.getForUpdate);
router.put('/:title', needsAuth, climbController.update);

// Export des routes pour utilisation dans app.js
module.exports = router;
