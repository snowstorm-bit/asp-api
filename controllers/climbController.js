'use strict';

const { Climbs, Places } = require('../database');
const { throwError, manageError } = require('../utils/utils');
const { status } = require('../utils/enums');
const errors = require('../json/errors.json');
const successes = require('../json/successes.json');
const Place = require('../classes/place');

exports.getAll = async (req, res, next) => {
};

exports.getOne = async (req, res, next) => {
};


exports.getForCreate = async (req, res, next) => {

};

exports.create = async (req, res, next) => {
    try {
        let result = await Climbs.findOne({
            attributes: ['title'],
            where: {
                placeId: req.body.placeId,
                title: req.body.title
            }
        });

        if (result !== null) {
            throwError(errors.climb.unique_constraint, 'title', 422, false);
        }

        let climb = await Climbs.create({
            title: req.body.title,
            description: req.body.description,
            style: req.body.style,
            difficultyLevel: req.body.difficultyLevel,
            placeId: req.body.placeId
        });

        await climb.save();

        res.status(201).json({
            code: successes.climb.create,
            status: status.success,
            result: {
                title: climb.title
            }
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.climb.create,
            cause: 'climb_create'
        }));
    }
};

exports.getForUpdate = async (req, res, next) => {
    try {
        let result = await Climbs.findOne({
            attributes: [],
            include: {
                model: Place,
                attributes: ['user_id'],
                required: true
            },
            where: {
                title: req.params.title
            }
        });

        console.log(result.place);
        if (result === null) {
            throwError(errors.climb.not_found, 'climb', 404, false);
        } else if (result.place.userId !== req.user.id) {
            throwError(errors.auth.unauthorized, 'climb_update', 403, false);
        }

        let climb = await Climbs.findOne({
            attributes: ['title', 'description', 'style', 'difficulty_level'],
            include: {
                model: Place,
                attributes: ['title'],
                required: true
            },
            where: {
                title: req.params.title
            }
        });

        res.status(200).json({
            code: successes.climb.update,
            status: status.success,
            result: {
                title: climb.title,
                description: climb.description,
                style: climb.style,
                difficultyLevel: climb.difficultyLevel,
                placeTitle: climb.place.placeId
            }
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.climb.update,
            cause: 'climb_update'
        }));
    }
};

exports.update = async (req, res, next) => {
    try {
        let result = await Climbs.findOne({
            attributes: ['id', 'title'],
            include: {
                model: Place,
                attributes: ['user_id'],
                required: true
            },
            where: {
                title: req.params.title
            }
        });

        console.log(result.place);
        if (result === null) {
            throwError(errors.climb.not_found, 'climb', 404, false);
        } else if (result.place.userId !== req.user.id) {
            throwError(errors.auth.unauthorized, 'climb_update', 403, false);
        } else if (req.body.title !== req.params.title) {
            throwError(errors.climb.unique_constraint, 'title', 422, false);
        }

        let climb = await result.set({
            title: req.body.title,
            description: req.body.description,
            style: req.body.style,
            difficultyLevel: req.body.difficultyLevel,
            placeId: req.body.placeId
        });

        await climb.save();

        res.status(200).json({
            code: successes.climb.update,
            status: status.success,
            result: {
                title: climb.title
            }
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.climb.update,
            cause: 'climb_update'
        }));
    }
};