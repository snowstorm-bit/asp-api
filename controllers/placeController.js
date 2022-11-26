'use strict';

const { Places } = require('../database');
const { throwError, status, manageError } = require('../utils/utils');
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
            code: successes.place.create,
            status: status.success,
            result: {
                title: place.title
            }
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.place.create,
            cause: 'place_create'
        }));
    }
};

exports.update = async (req, res, next) => {
    try {
        let result = await Places.findOne({
            attributes: ['id', 'title', 'user_id'],
            where: {
                title: req.params.title
            }
        });

        if (result === null) {
            throwError(errors.place.not_found, 'place', 404, false);
        } else if (result.userId !== req.user.id) {
            throwError(errors.auth.unauthorized, 'place_update', 403, false);
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
            code: successes.place.update,
            status: status.success,
            result: {
                title: place.title
            }
        });
    } catch (err) {
        console.log(err);
        next(manageError(err, {
            code: errors.routes.place.update,
            cause: 'place_update'
        }));
    }
};