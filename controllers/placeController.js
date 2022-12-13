'use strict';

const { throwError, manageError, paginateResponse, validateAuthenticatedUser } = require('../utils/utils');
const { status, climbStyle } = require('../utils/enums');
const errors = require('../json/errors.json');
const successes = require('../json/successes.json');
const UserRates = require('../classes/userRates');
const dotenv = require('dotenv');
const Place = require('../classes/place');
const Climb = require('../classes/climb');
const { getSequelize } = require('../database/config');
dotenv.config();

exports.getCreated = async (req, res, next) => {
    try {
        let searchCriterias = {
            offset: Number(req.query.offset) || 0,
            limit: req.query.limit ? Number(req.query.limit) : 15
        };

        let findOptions = {
            attributes: ['title'],
            where: {
                userId: req.user.id
            }
        };

        let findAllOptions = findOptions;
        findAllOptions.offset = searchCriterias.offset;
        findAllOptions.limit = searchCriterias.limit;

        let createdPlaces = await Place.findAll(findAllOptions);

        let result = paginateResponse(createdPlaces, searchCriterias.offset, searchCriterias.limit);

        if (result.hasMoreResult) {
            let findOneOptions = findOptions;
            findOneOptions.offset = result.offset;

            let nextCreatedPlace = await Place.findOne(findOneOptions);

            if (nextCreatedPlace === null) {
                result.hasMoreResult = false;
            }
        }

        res.status(200).json({
            code: successes.routes.details.account,
            status: status.success,
            result: result
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.details.account.created_places,
            cause: 'created_places'
        }));
    }
};

exports.getOne = async (req, res, next) => {
    try {
        let result = await Place.findOne({
            attributes: ['id', 'title', 'description', 'steps', 'latitude', 'longitude', 'userId'],
            where: {
                title: req.params.title
            }
        });

        if (result === null) {
            throwError(errors.place.not_found, 'place_details', 404, false);
        }

        result = result.toJSON();

        let sequelize = getSequelize();

        let results = await Climb.findAll({
            attributes: [
                'title', 'style', 'difficultyLevel',
                [sequelize.fn('COUNT', sequelize.col('UserRate.climb_id')), 'votes'],
                [sequelize.fn('AVG', sequelize.col('UserRate.rate')), 'rate']
            ],
            include: {
                model: UserRates,
                attributes: [],
                required: true
            },
            where: {
                placeId: result.id
            },
            group: ['UserRate.climb_id'],
            order: [['title', 'ASC']]
        });

        let climbs = [];
        results.forEach(climb => climbs.push(climb.toJSON()));

        delete result.id;

        result.climbs = climbs;
        result.styles = climbStyle;
        result.isCreator = validateAuthenticatedUser(req.user, result.userId);

        delete result.userId;

        res.status(200).json({
            code: successes.routes.details.place,
            status: status.success,
            result: result
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
        await Place.create(
            {
                title: req.body.title,
                description: req.body.description,
                steps: req.body.steps,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                userId: req.user.id
            }
        );

        res.status(201).json({
            code: successes.routes.create.place,
            status: status.success,
            result: {
                title: req.body.title
            }
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.create.place,
            cause: 'create_place'
        }));
    }
};

exports.getForUpdate = async (req, res, next) => {
    try {
        let result = await Place.findOne({
            attributes: ['userId'],
            where: {
                title: req.params.title
            }
        });

        if (result === null) {
            throwError(errors.place.not_found, 'update_place', 404, false);
        } else if (result.userId !== req.user.id) {
            throwError(errors.auth.unauthorized, 'authentication', 403, false);
        }

        let place = (await Place.findOne({
            attributes: ['title', 'description', 'steps', 'latitude', 'longitude'],
            where: {
                title: req.params.title
            }
        })).toJSON();

        res.status(200).json({
            code: successes.routes.update.place,
            status: status.success,
            result: place
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
        let result = await Place.findOne({
            attributes: ['id', 'userId'],
            where: {
                title: req.params.title
            }
        });

        if (result === null) {
            throwError(errors.place.not_found, 'update_place', 404, false);
        } else if (result.userId !== req.user.id) {
            throwError(errors.auth.unauthorized, 'authentication', 403, false);
        }

        await result.update({
            title: req.body.title,
            description: req.body.description,
            steps: req.body.steps,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        });

        res.status(200).json({
            code: successes.routes.update.place,
            status: status.success,
            result: {
                title: req.body.title
            }
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.update.place,
            cause: 'update_place'
        }));
    }
};

exports.delete = async (req, res, next) => {
    try {
        let place = await Place.findOne({
            attributes: ['id', 'title'],
            where: {
                title: req.params.title
            }
        });

        if (place === null) {
            throwError(errors.place.not_found, 'delete_place', 404, false);
        }

        await place.destroy();

        res.status(200).json({
            code: successes.routes.delete.place,
            status: status.success,
            result: {
                title: place.title
            }
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.delete.place,
            cause: 'delete_place'
        }));
    }
};