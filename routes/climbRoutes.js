'use strict';

const express = require('express');
const router = express.Router();
const { isAuth, needsAdminAuth, needsAuth } = require('../middlewares/is-auth');
const climbController = require('../controllers/climbController');

router.get('/all', isAuth, climbController.getAll);
router.get('/details/:title', isAuth, climbController.getOne);
router.get('/', needsAuth, climbController.getForCreate);
router.post('/', needsAuth, climbController.create);
router.get('/:title', needsAuth, climbController.getForUpdate);
router.put('/:title', needsAuth, climbController.update);
router.delete('/:title', needsAdminAuth, climbController.delete);
router.post('/rate/:title', needsAuth, climbController.rateOne);
router.delete('/rate/:title', needsAuth, climbController.deleteOneRate);

// Export des routes pour utilisation dans app.js
module.exports = router;
