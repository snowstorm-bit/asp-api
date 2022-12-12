'use strict';

const express = require('express');
const router = express.Router();
const { isAuth, needsUserAuth, needsAdminAuth } = require('../middlewares/is-auth');
const placeController = require('../controllers/placeController');
const { status } = require('../utils/enums');

router.get('/details/:title', isAuth, placeController.getOne);
router.get('/', needsUserAuth, (req, res, next) =>
    res.status(200).send({ status: status.success }));
router.post('/', needsUserAuth, placeController.create);
router.get('/:title', needsUserAuth, placeController.getForUpdate);
router.put('/:title', needsUserAuth, placeController.update);
router.delete('/:title', needsAdminAuth, placeController.delete);

// Export des routes pour utilisation dans app.js
module.exports = router;
