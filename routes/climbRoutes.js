'use strict';

const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/is-auth');
const climbController = require('../controllers/climbController');

router.get('/all', climbController.getAll);
router.get('/details/:title', climbController.getOne);
router.get('/', isAuth, climbController.getForCreate);
router.post('/', isAuth, climbController.create);
router.get('/:title', isAuth, climbController.getForUpdate);
router.put('/:title', isAuth, climbController.update);

// Export des routes pour utilisation dans app.js
module.exports = router;
