'use strict';

const { Places } = require('../database');
const { throwError, manageError } = require('../utils/utils');
const { status } = require('../utils/enums');
const errors = require('../json/errors.json');
const successes = require('../json/successes.json');

exports.getAll = async (req, res, next) => {
};

exports.getOne = async (req, res, next) => {
};

exports.create = async (req, res, next) => {
    try {
        let place = await Places.create(
            {
                title: req.body.title,
                description: req.body.description,
                steps: req.body.steps,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                userId: req.user.id
            }
        );

        await place.save();

        res.status(201).json({
            code: successes.routes.create.place,
            status: status.success,
            result: {
                title: place.title
            }
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.create.place,
            cause: 'place_create'
        }));
    }
};

exports.getForUpdate = async (req, res, next) => {
    try {
        let result = await Places.findOne({
            attributes: ['userId'],
            where: {
                title: req.params.title
            }
        });

        console.log(result);
        if (result === null) {
            throwError(errors.place.not_found, 'place', 404, false);
        } else if (result.userId !== req.user.id) {
            throwError(errors.auth.unauthorized, 'update_place', 403, false);
        }

        let place = await Places.findOne({
            attributes: ['title', 'description', 'steps', 'latitude', 'longitude'],
            where: {
                title: req.params.title
            }
        });

        res.status(200).json({
            code: successes.routes.update.place,
            status: status.success,
            result: {
                title: place.title,
                description: place.description,
                steps: place.steps,
                latitude: place.latitude,
                longitude: place.longitude
            }
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.update.place,
            cause: 'update_place'
        }));
    }
};

exports.update = async (req, res, next) => {
    try {
        let result = await Places.findOne({
            attributes: ['id', 'userId'],
            where: {
                title: req.params.title
            }
        });

        if (result === null) {
            throwError(errors.place.not_found, 'place', 404, false);
        } else if (result.userId !== req.user.id) {
            throwError(errors.auth.unauthorized, 'update_place', 403, false);
        }

        let place = await result.set({
            title: req.body.title,
            description: req.body.description,
            steps: req.body.steps,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        });

        await place.save();

        res.status(200).json({
            code: successes.routes.update.place,
            status: status.success,
            result: {
                title: place.title
            }
        });
    } catch (err) {
        console.log(err);
        next(manageError(err, {
            code: errors.routes.update.place,
            cause: 'update_place'
        }));
    }
};