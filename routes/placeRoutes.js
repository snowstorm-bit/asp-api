'use strict';

const express = require('express');
const router = express.Router();
const { isAuth, needsAdminAuth, needsAuth } = require('../middlewares/is-auth');
const placeController = require('../controllers/placeController');
const { status } = require('../utils/enums');

router.get('/details/:title', isAuth, placeController.getOne);
router.get('/', needsAuth, (req, res, next) =>
    res.status(200).send({ status: status.success }));
router.post('/', needsAuth, placeController.create);
router.get('/:title', needsAuth, placeController.getForUpdate);
router.put('/:title', needsAuth, placeController.update);
router.delete('/:title', needsAdminAuth, placeController.delete);

// Export des routes pour utilisation dans app.js
module.exports = router;
