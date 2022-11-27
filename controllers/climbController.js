'use strict';

const { Climbs, Places, PlaceClimbs } = require('../database');
const { throwError, manageError } = require('../utils/utils');
const { status } = require('../utils/enums');
const errors = require('../json/errors.json');
const successes = require('../json/successes.json');
const PlaceClimbsModel = require('../classes/placeClimbs');

exports.getAll = async (req, res, next) => {
};

exports.getOne = async (req, res, next) => {
};


exports.getForCreate = async (req, res, next) => {

};

exports.create = async (req, res, next) => {
    try {
        let result = await Climbs.findOne({
            attributes: ['id', 'title'],
            include: {
                model: PlaceClimbsModel,
                attributes: [],
                required: true,
                where: {
                    placeId: req.body.placeId
                }
            },
            where: {
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
            difficultyLevel: req.body.difficultyLevel
        });

        await climb.save();

        await (await PlaceClimbs.create({
            placeId: req.body.placeId,
            climbId: req.body.placeId
        })).save();

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

};

exports.update = async (req, res, next) => {
    try {
        let results = await Climbs.findOne({
            attributes: ['id', 'title'],
            include: {
                model: PlaceClimbsModel,
                attributes: [],
                required: true,
                where: {
                    placeId: req.body.placeId
                }
            },
            where: {
                title: req.body.title
            }
        });
        
        if (result !== null) {
            throwError(errors.climb.unique_constraint, 'title', 422, false);
        }
        
        let result = await Climbs.findOne({
            attributes: ['id', 'title'],
            include: {
                model: PlaceClimbsModel,
                attributes: [],
                required: true,
                where: {
                    placeId: req.body.placeId
                }
            },
            where: {
                title: req.params.title
            }
        });

        if (result === null) {
            throwError(errors.climb.not_found, 'climb', 404, false);
        } else if (result.userId !== req.user.id) {
            throwError(errors.auth.unauthorized, 'climb_update', 403, false);
        }

        let climb = await Climbs.set({
            title: req.body.title,
            description: req.body.description,
            style: req.body.style,
            difficultyLevel: req.body.difficultyLevel
        });

        await climb.save();

        await (await PlaceClimbs.set({
            placeId: req.body.placeId,
            climbId: req.body.placeId
        })).save();

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