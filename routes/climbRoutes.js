'use strict';

const express = require('express');
const router = express.Router();
const { isAuth, needsAdminAuth, needsUserAuth } = require('../middlewares/is-auth');
const climbController = require('../controllers/climbController');

router.get('/all', climbController.getAll);
router.get('/details/:title', isAuth, climbController.getOne);
router.get('/', needsUserAuth, climbController.getForCreate);
router.post('/', needsUserAuth, climbController.create);
router.get('/:title', needsUserAuth, climbController.getForUpdate);
router.put('/:title', needsUserAuth, climbController.update);
router.delete('/:title', needsAdminAuth, climbController.delete);
router.post('/rate/:title', needsUserAuth, climbController.rateOne);
router.delete('/rate/:title', needsUserAuth, climbController.deleteOneRate);

// Export des routes pour utilisation dans app.js
module.exports = router;
