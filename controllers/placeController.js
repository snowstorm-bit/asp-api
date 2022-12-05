'use strict';

const { Places, Climbs, sequelize } = require('../database');
const { throwError, manageError, round } = require('../utils/utils');
const { status, climbStyle } = require('../utils/enums');
const errors = require('../json/errors.json');
const successes = require('../json/successes.json');
const UserRates = require('../classes/userRates');
const dotenv = require('dotenv');
dotenv.config();

exports.getOne = async (req, res, next) => {
    try {
        let result = await Places.findOne({
            attributes: ['id', 'title', 'description', 'steps', 'latitude', 'longitude', 'userId'],
            where: {
                title: req.params.title
            }
        });

        if (result === null) {
            throwError(errors.place.not_found, 'place_details', 404, false);
        }

        let descriptionLiteralStatement = 'IF(CHAR_LENGTH(description) > 60, CONCAT(SUBSTRING(description, 1, 100), \'...\'), SUBSTRING(description, 1, 100)) AS description';
        let results = await Climbs.findAll({
            attributes: [
                'id', 'title', 'style', 'difficultyLevel', 'images',
                sequelize.literal(descriptionLiteralStatement),
                [sequelize.fn('COUNT', sequelize.col('UserRate.climb_id')), 'votes'],
                [sequelize.fn('AVG', sequelize.col('UserRate.rate')), 'rate']
            ],
            include: {
                model: UserRates,
                attributes: ['climbId', 'rate'],
                required: true
            },
            where: {
                placeId: result.id
            },
            group: ['UserRate.climb_id'],
            raw: true
        });

        let climbs = [];

        results.forEach(result =>
            climbs.push({
                title: result.title,
                style: result.style,
                image: result.images.split(';')[0],
                description: result.description,
                difficultyLevel: result.difficultyLevel,
                rate: round(Number(result.rate)),
                votes: result.votes
            }));

        res.status(200).json({
            code: successes.routes.details.place,
            status: status.success,
            result: {
                title: result.title,
                description: result.description,
                steps: result.steps,
                latitude: result.latitude,
                longitude: result.longitude,
                styles: climbStyle,
                climbs: climbs,
                isCreator: req.user.status || req.user.id === result.userId
            }
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.details.place,
            cause: 'place_details'
        }));
    }
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

        if (result === null) {
            throwError(errors.place.not_found, 'update_place', 404, false);
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
            throwError(errors.place.not_found, 'update_place', 404, false);
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
        next(manageError(err, {
            code: errors.routes.update.place,
            cause: 'update_place'
        }));
    }
};