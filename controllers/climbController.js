'use strict';
const { Op } = require('sequelize');
const { throwError, manageError, round, paginateResponse, validateAuthenticatedUser } = require('../utils/utils');
const { status, climbStyle } = require('../utils/enums');
const errors = require('../json/errors.json');
const successes = require('../json/successes.json');
const Place = require('../classes/place');
const UserRatesModel = require('../classes/userRates');
const { getSequelize } = require('../database/config');
const Climb = require('../classes/climb');
const UserRates = require('../classes/userRates');

exports.getAll = async (req, res, next) => {
    try {
        // trim query values
        let query = {};
        for (let [key, value] of Object.entries(req.query)) {
            if (Array.isArray(value)) {
                value.forEach(v => {
                    if (typeof value === 'string') {
                        v = v.trim();
                    }
                });
            } else if (typeof value === 'string') {
                value = value.trim();
            }
            query[key] = value;
        }

        // Set criterias for search
        let where = {};
        let having = {};
        if (req.query.rate !== undefined) {
            having.rate = { [Op.between]: req.query.rate };
        }
        if (req.query.place !== undefined) {
            where['$Place.title$'] = req.query.place;
        }
        if (req.query.style !== undefined) {
            where.style = typeof req.query.style === 'string'
                ? req.query.style
                : { [Op.or]: req.query.style };
        }
        if (req.query.difficultyLevel !== undefined) {
            // get min and max decimal
            let [, minDecimal] = String(req.query.difficultyLevel[0]).split('.');
            let [, maxDecimal] = String(req.query.difficultyLevel[1]).split('.');
            minDecimal = Number(minDecimal);
            maxDecimal = Number(maxDecimal);

            // set step and min decimal if 10 or superior
            // ex : bad -> 5.10 + 0.1 => 5.2
            //      good -> 5.10 + 0.01 => 5.11
            let step = 0.1;
            if (minDecimal === 1 || minDecimal === 10) {
                minDecimal = 10;
            }
            if (minDecimal >= 10) {
                step = 0.01;
            }

            // create array to get values between range specified
            let decimalDifference = maxDecimal - minDecimal + 1;
            let difficultyLevelRange = [];
            difficultyLevelRange.push(`5.${ minDecimal }`);
            for (let i = 1; i < decimalDifference; i++) {
                if (Number(difficultyLevelRange[i - 1]) === 5.9) {
                    difficultyLevelRange.push('5.10');
                    step = 0.01;
                } else {
                    difficultyLevelRange.push(String(round(Number(difficultyLevelRange[i - 1]) + step)));
                }
            }

            where.difficultyLevel = difficultyLevelRange;
        }

        let searchCriterias = {
            offset: Number(req.query.offset) || 0,
            limit: req.query.limit
                ? req.query.limit.includes('top-10')
                    ? 10
                    : Number(req.query.limit)
                : 15
        };

        let orderDefault = {
            rate: 'DESC',
            votes: 'DESC',
            title: 'ASC'
        };
        let order = Object.entries(orderDefault);

        // set find options for find queries
        let findOptions = {
            include: [
                {
                    model: UserRatesModel,
                    attributes: [],
                    required: false
                },
                {
                    model: Place,
                    attributes: [],
                    required: true
                }
            ],
            where: where,
            group: ['Climb.id'],
            having: having,
            order: order
        };

        // set options for findAll query
        let findAllOptions = findOptions;

        let descriptionLiteralStatement = 'IF(CHAR_LENGTH(Climb.description) > 60, CONCAT(SUBSTRING(Climb.description, 1, 100), \'...\'), SUBSTRING(Climb.description, 1, 100))';
        let rateLiteralStatement = 'IF(UserRate.rate IS NULL, 0, AVG(UserRate.rate))';
        let votesLiteralStatement = 'IF(UserRate.climb_id IS NULL, 0, COUNT(UserRate.climb_id))';
        let sequelize = getSequelize();
        findAllOptions.attributes = [
            'title',
            'images',
            [sequelize.literal(descriptionLiteralStatement), 'description'],
            [sequelize.literal(rateLiteralStatement), 'rate'],
            [sequelize.literal(votesLiteralStatement), 'votes'],
            [sequelize.col('Place.title'), 'placeTitle']
        ];
        findAllOptions.limit = searchCriterias.limit;
        findAllOptions.offset = searchCriterias.offset;

        let results = await Climb.findAll(findAllOptions);

        let climbs = [];
        results.forEach(result => {
            let climb = result.toJSON();
            climb.image = climb.images[0];
            climbs.push(climb);
        });

        let result = paginateResponse(climbs, searchCriterias.offset, searchCriterias.limit);

        // Find next if there is possibly more results
        if (result.hasMoreResult) {
            // set options for findOne query
            let findOneOptions = findOptions;
            findOneOptions.attributes = [
                'title',
                [sequelize.literal(rateLiteralStatement), 'rate'],
                [sequelize.literal(votesLiteralStatement), 'votes']
            ];
            findOneOptions.offset = result.offset;

            let nextClimb = await Climb.findOne(findOneOptions);

            if (nextClimb === null) {
                result.hasMoreResult = false;
            }
        }

        if (req.query.limit && !req.query.limit.includes('top-10')) {
            result.placeTitles = await Place.findAll({
                attributes: ['title']
            });
            result.styles = climbStyle;
        }

        if (req.user && 'authInvalid' in req.user) {
            result.isAuthInvalid = req.user.authInvalid;
        }

        res.status(200).json({
            code: successes.routes.all.climbs,
            status: status.success,
            result: result
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.all.climbs,
            cause: 'climb_all'
        }));
    }
};

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

        let createdClimbs = await Climb.findAll(findAllOptions);

        let result = paginateResponse(createdClimbs, searchCriterias.offset, searchCriterias.limit);

        // Find next if there is possibly more results
        if (result.hasMoreResult) {
            let findOneOptions = findOptions;
            findOneOptions.offset = result.offset;

            let nextCreatedClimb = await Climb.findOne(findOneOptions);

            if (nextCreatedClimb === null) {
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
            code: errors.routes.details.account.created_climbs,
            cause: 'created_climbs'
        }));
    }
};

exports.getRated = async (req, res, next) => {
    try {
        let searchCriterias = {
            offset: Number(req.query.offset) || 0,
            limit: req.query.limit ? Number(req.query.limit) : 15
        };

        let findOptions = {
            include: {
                model: UserRatesModel,
                attributes: [],
                where: {
                    userId: req.user.id
                }
            }
        };

        let findAllOptions = findOptions;

        let sequelize = getSequelize();
        findAllOptions.attributes = ['title', [sequelize.col('UserRate.rate'), 'rate']];
        findAllOptions.offset = searchCriterias.offset;
        findAllOptions.limit = searchCriterias.limit;

        let results = await Climb.findAll(findAllOptions);

        let ratedClimbs = [];
        results.forEach(result => ratedClimbs.push(result.toJSON()));

        let result = paginateResponse(ratedClimbs, searchCriterias.offset, searchCriterias.limit);

        // Find next if there is possibly more results
        if (result.hasMoreResult) {
            let findOneOptions = findOptions;
            findOneOptions.attributes = ['id'];
            findOneOptions.offset = result.offset;

            let nextRatedClimb = await Climb.findOne(findOneOptions);

            if (nextRatedClimb === null) {
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
            code: errors.routes.details.account.rated_climbs,
            cause: 'rated_climbs'
        }));
    }
};

exports.getOne = async (req, res, next) => {
    try {
        let climb = await Climb.findOne({
            attributes: ['id'],
            where: {
                title: req.params.title
            }
        });

        if (climb === null) {
            throwError(errors.climb.not_found, 'climb_details', 404, false);
        }

        let sequelize = getSequelize();

        let rateLiteralStatement = 'IF(UserRate.rate IS NULL, 0, AVG(UserRate.rate))';
        let votesLiteralStatement = 'IF(UserRate.climb_id IS NULL, 0, COUNT(UserRate.climb_id))';

        let result = (await Climb.findOne({
            attributes: [
                'title', 'description', 'style', 'difficultyLevel', 'images', 'userId',
                [sequelize.literal(rateLiteralStatement), 'rate'],
                [sequelize.literal(votesLiteralStatement), 'votes'],
                [sequelize.col('Place.title'), 'placeTitle']
            ],
            include: [
                {
                    model: UserRatesModel,
                    attributes: [],
                    required: false
                },
                {
                    model: Place,
                    attributes: [],
                    required: true
                }
            ],
            where: {
                title: req.params.title
            },
            group: ['Climb.id']
        })).toJSON();

        if (req.user?.id) {
            let userRate = await UserRates.findOne({
                attributes: ['rate'],
                where: {
                    climbId: climb.id,
                    userId: req.user.id
                }
            });

            result.userRate = userRate ? userRate.rate : 0;
        }

        result.isCreator = req.user
            ? validateAuthenticatedUser(req.user, result.userId)
            : false;

        delete result.userId;

        res.status(200).json({
            code: successes.routes.details.climb,
            status: status.success,
            result: result
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.details.climb,
            cause: 'climb_details'
        }));
    }
};

exports.getForCreate = async (req, res, next) => {
    try {
        let placeTitles = await Place.findAll({
            attributes: ['title']
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
        let place = await Place.findOne({
            attributes: ['id'],
            where: {
                title: req.body.placeTitle
            }
        });

        if (place === null) {
            throwError(errors.climb.place_title.not_found, 'placeTitle', 404, false);
        }

        let result = await Climb.findOne({
            attributes: ['title'],
            where: {
                placeId: place.id,
                title: req.body.title
            }
        });

        if (result !== null) {
            throwError(errors.climb.unique_constraint, 'title', 422, false);
        }

        if (req.body.difficultyLevel === '5.1') {
            throwError(errors.climb.difficulty_level.range, 'difficultyLevel', 422, false);
        }

        await Climb.create({
            title: req.body.title,
            description: req.body.description,
            style: req.body.style,
            difficultyLevel: req.body.difficultyLevel,
            images: req.body.images,
            placeId: place.id,
            userId: req.user.id
        });

        res.status(201).json({
            code: successes.routes.create.climb,
            status: status.success,
            result: {
                title: req.body.title
            }
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.create.climb,
            cause: 'create_climb'
        }));
    }
};

exports.getForUpdate = async (req, res, next) => {
    try {
        let foundResult = await Climb.findOne({
            attributes: ['userId'],
            where: {
                title: req.params.title
            }
        });

        if (foundResult === null) {
            throwError(errors.climb.not_found, 'update_climb', 404, false);
        } else if (foundResult.userId !== req.user.id) {
            throwError(errors.auth.unauthorized, 'authentication', 403, false);
        }

        let sequelize = getSequelize();

        let result = (await Climb.findOne({
            attributes: [
                'title', 'description', 'style', 'difficultyLevel', 'images',
                [sequelize.col('Place.title'), 'placeTitle']
            ],
            include: {
                model: Place,
                attributes: [],
                required: true
            },
            where: {
                title: req.params.title
            }
        })).toJSON();

        result.placeTitles = await Place.findAll({ attributes: ['title'] });
        result.styles = climbStyle;

        res.status(200).json({
            code: successes.routes.update.climb,
            status: status.success,
            result: result
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.update.climb,
            cause: 'update_climb'
        }));
    }
};

exports.update = async (req, res, next) => {
    try {
        let place = await Place.findOne({
            attributes: ['id'],
            where: {
                title: req.body.placeTitle
            }
        });

        if (place === null) {
            throwError(errors.climb.place_title.not_found, 'placeTitle', 404, false);
        }

        let result = await Climb.findOne({
            attributes: ['id', 'userId', 'images'],
            where: {
                title: req.params.title
            }
        });

        if (result === null) {
            throwError(errors.climb.not_found, 'update_climb', 404, false);
        } else if (result.userId !== req.user.id) {
            throwError(errors.auth.unauthorized, 'authentication', 403, false);
        }

        // If the title of the climb has changed but the result is equals to the changed title,
        // this means the title is already associated to an other place
        let resultForUniqueConstraint = await Climb.findOne({
            attributes: ['title'],
            where: {
                placeId: place.id,
                title: req.body.title
            }
        });

        if (resultForUniqueConstraint !== null && req.params.title !== req.body.title) {
            throwError(errors.climb.unique_constraint, 'title', 422, false);
        }

        let images = result.images;
        images.push(...req.body.images);

        if (req.body.difficultyLevel === '5.1') {
            throwError(errors.climb.difficulty_level.range, 'difficultyLevel', 422, false);
        }

        await result.update({
            title: req.body.title,
            description: req.body.description,
            style: req.body.style,
            difficultyLevel: req.body.difficultyLevel,
            images: images,
            placeId: place.id
        });

        res.status(200).json({
            code: successes.routes.update.climb,
            status: status.success,
            result: {
                title: req.body.title
            }
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.update.climb,
            cause: 'update_climb'
        }));
    }
};

exports.delete = async (req, res, next) => {
    try {
        let climb = await Climb.findOne({
            attributes: ['id', 'title'],
            where: {
                title: req.params.title
            }
        });

        if (climb === null) {
            throwError(errors.climb.not_found, 'delete_climb', 404, false);
        }

        await climb.destroy();

        res.status(200).json({
            code: successes.routes.delete.climb,
            status: status.success,
            result: {
                title: climb.title
            }
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.delete.climb,
            cause: 'delete_climb'
        }));
    }
};

exports.rateOne = async (req, res, next) => {
    try {
        let climb = await Climb.findOne({
            attributes: ['id'],
            include: [
                {
                    model: UserRatesModel,
                    attributes: [],
                    required: false
                }
            ],
            where: {
                title: req.params.title
            }
        });

        if (climb === null) {
            throwError(errors.routes.rate.climb_not_found, 'rate_climb', 404, false);
        }

        let [_, created] = await UserRates.upsert({
            climbId: climb.id,
            userId: req.user.id,
            rate: req.body.rate
        }, { validate: true });

        let sequelize = getSequelize();

        let rateLiteralStatement = 'IF(UserRate.rate IS NULL, 0, AVG(UserRate.rate))';
        let votesLiteralStatement = 'IF(UserRate.climb_id IS NULL, 0, COUNT(UserRate.climb_id))';

        climb = (await Climb.findOne({
            attributes: [
                [sequelize.literal(rateLiteralStatement), 'rate'],
                [sequelize.literal(votesLiteralStatement), 'votes']
            ],
            include: [
                {
                    model: UserRatesModel,
                    attributes: [],
                    required: true
                }
            ],
            where: {
                title: req.params.title
            },
            group: ['UserRate.climb_id']
        })).toJSON();

        delete climb.id;
        climb.userRate = req.body.rate;

        res.status(created ? 201 : 200).json({
            code: successes.routes[created ? 'create' : 'update'].rate.climb,
            status: status.success,
            result: climb
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.rate.climb,
            cause: 'rate_climb'
        }));
    }
};

exports.deleteOneRate = async (req, res, next) => {
    try {
        let climb = await Climb.findOne({
            attributes: ['id'],
            where: {
                title: req.params.title
            }
        });

        if (climb === null) {
            throwError(errors.routes.rate.climb_not_found, 'rate_climb', 404, false);
        }

        let result = await UserRates.findOne({
            attributes: ['climbId', 'userId'],
            where: {
                climbId: climb.id,
                userId: req.user.id
            }
        });

        if (result === null) {
            throwError(errors.routes.rate.not_found, 'rate_climb', 404, false);
        }

        await result.destroy();

        let sequelize = getSequelize();

        let rateLiteralStatement = 'IF(UserRate.rate IS NULL, 0, AVG(UserRate.rate))';
        let votesLiteralStatement = 'IF(UserRate.climb_id IS NULL, 0, COUNT(UserRate.climb_id))';

        climb = (await Climb.findOne({
            attributes: [
                [sequelize.literal(rateLiteralStatement), 'rate'],
                [sequelize.literal(votesLiteralStatement), 'votes']
            ],
            include: [
                {
                    model: UserRatesModel,
                    attributes: [],
                    required: false
                }
            ],
            where: {
                title: req.params.title
            },
            group: ['UserRate.climb_id']
        })).toJSON();

        climb.userRate = 0;

        res.status(200).json({
            code: successes.routes.delete.rate.climb,
            status: status.success,
            result: climb
        });
    } catch (err) {
        console.log(err);
        next(manageError(err, {
            code: errors.routes.rate.climb,
            cause: 'rate_climb'
        }));
    }
};