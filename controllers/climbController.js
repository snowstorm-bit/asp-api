'use strict';

const { Climbs, Places } = require('../database');
const { throwError, manageError } = require('../utils/utils');
const { status, climbStyle } = require('../utils/enums');
const errors = require('../json/errors.json');
const successes = require('../json/successes.json');
const Place = require('../classes/place');

exports.getAll = async (req, res, next) => {
};

exports.getOne = async (req, res, next) => {
};

exports.getForCreate = async (req, res, next) => {
    try {
        let placeTitles = await Places.findAll({
            attributes: ['title'],
            where: {
                userId: req.user.id
            }
        });
        res.status(200).json({
            code: successes.routes.create.climb,
            status: status.success,
            result: {
                styles: climbStyle,
                placeTitles: placeTitles
            }
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.create.climb,
            cause: 'create_climb'
        }));
    }
};

exports.create = async (req, res, next) => {
    try {
        let place = await Places.findOne({
            attributes: ['id', 'userId'],
            where: {
                title: req.body.placeTitle
            }
        });

        if (place === null) {
            throwError(errors.climb.place_title.not_found, 'place_title', 404, false);
        } else if (place.userId !== req.user.id) {
            throwError(errors.climb.place_title.unauthorized, 'place_title', 403, false);
        }

        let result = await Climbs.findOne({
            attributes: ['title'],
            where: {
                placeId: place.id,
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
            placeId: place.id
        });

        await climb.save();

        res.status(201).json({
            code: successes.routes.create.climb,
            status: status.success,
            result: {
                title: climb.title
            }
        });
    } catch (err) {
        console.log(err);
        next(manageError(err, {
            code: errors.routes.create.climb,
            cause: 'create_climb'
        }));
    }
};

exports.getForUpdate = async (req, res, next) => {
    try {
        let result = await Climbs.findOne({
            attributes: [],
            include: {
                model: Place,
                attributes: ['userId'],
                required: true
            },
            where: {
                title: req.params.title
            }
        });

        if (result === null) {
            throwError(errors.climb.not_found, 'climb', 404, false);
        } else if (result.Place.userId !== req.user.id) {
            throwError(errors.auth.unauthorized, 'climb_update', 403, false);
        }

        let climb = await Climbs.findOne({
            attributes: ['title', 'description', 'style', 'difficultyLevel'],
            include: {
                model: Place,
                attributes: ['title'],
                required: true
            },
            where: {
                title: req.params.title
            }
        });

        let placeTitles = await Places.findAll({
            attributes: ['title'],
            where: {
                userId: req.user.id
            }
        });

        res.status(200).json({
            code: successes.routes.update.climb,
            status: status.success,
            result: {
                title: climb.title,
                description: climb.description,
                style: climb.style,
                styles: climbStyle,
                difficultyLevel: climb.difficultyLevel,
                placeTitle: climb.Place.title,
                placeTitles: placeTitles
            }
        });
    } catch (err) {
        console.log(err);
        next(manageError(err, {
            code: errors.routes.update.climb,
            cause: 'update_climb'
        }));
    }
};

exports.update = async (req, res, next) => {
    try {
        let result = await Climbs.findOne({
            attributes: ['id', 'title'],
            include: {
                model: Place,
                attributes: ['userId'],
                required: true
            },
            where: {
                title: req.params.title
            }
        });

        if (result === null) {
            throwError(errors.climb.not_found, 'climb', 404, false);
        } else if (result.Place.userId !== req.user.id) {
            throwError(errors.auth.unauthorized, 'climb_update', 403, false);
        } else if (req.params.title !== req.body.title && result.title === req.body.title) {
            throwError(errors.climb.unique_constraint, 'title', 422, false);
        }

        let place = await Places.findOne({
            attributes: ['id', 'userId'],
            where: {
                title: req.body.placeTitle
            }
        });

        if (place === null) {
            throwError(errors.climb.place_title.not_found, 'place_title', 404, false);
        } else if (place.userId !== req.user.id) {
            throwError(errors.climb.place_title.unauthorized, 'place_title', 403, false);
        }

        let climb = await result.set({
            title: req.body.title,
            description: req.body.description,
            style: req.body.style,
            difficultyLevel: req.body.difficultyLevel,
            placeId: place.id
        });

        await climb.save();

        res.status(200).json({
            code: successes.routes.update.climb,
            status: status.success,
            result: {
                title: climb.title
            }
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.update.climb,
            cause: 'update_climb'
        }));
    }
};