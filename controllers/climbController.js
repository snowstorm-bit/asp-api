'use strict';
const { Op } = require('sequelize');
const { Climbs, Places, sequelize } = require('../database');
const { throwError, manageError, round, paginateResponse } = require('../utils/utils');
const { status, climbStyle } = require('../utils/enums');
const errors = require('../json/errors.json');
const successes = require('../json/successes.json');
const Place = require('../classes/place');
const UserRates = require('../classes/userRates');

exports.getAll = async (req, res, next) => {
    try {
        let orderDefault = {
            rate: 'DESC',
            votes: 'DESC',
            title: 'ASC'
        };

        let order = [];
        let where = {};
        if (req.query.rate !== undefined) {
            delete orderDefault.rate;
            delete orderDefault.votes;
            order.push(['rate', 'DESC'], ['votes', 'DESC']);
        }
        if (req.query.place !== undefined) {
            if (typeof req.query.place === 'string') {
                order.push(['rate', 'DESC']);
            } else {
                where['$Place.title$'] = { [Op.or]: req.query.place };
                order.push(['placeTitle', 'ASC']);
            }
        }
        if (req.query.style !== undefined) {
            if (typeof req.query.style === 'string') {
                where.style = req.query.style;
            } else {
                where.style = { [Op.or]: req.query.style };
                let styles = [];
                Object.values(climbStyle).forEach(style => styles.push(`'${ style }'`));
                order.push([sequelize.literal(`FIELD(Climb.style,${ styles.join(',') }) ASC`)]);
            }
        }
        if (req.query.difficultyLevel !== undefined) {
            let [, minDecimal] = String(req.query.difficultyLevel[0]).split('.');
            let [, maxDecimal] = String(req.query.difficultyLevel[1]).split('.');
            minDecimal = Number(minDecimal);
            maxDecimal = Number(maxDecimal);
            let decimalDifference = maxDecimal - minDecimal + 1;
            let difficultyLevelRange = [];
            difficultyLevelRange.push(`5.${ minDecimal }`);
            let step = 0.1;
            for (let i = 1; i < decimalDifference; i++) {
                if (Number(difficultyLevelRange[i - 1]) === 5.9) {
                    difficultyLevelRange.push('5.10');
                    step = 0.01;
                } else {
                    difficultyLevelRange.push(String(round(Number(difficultyLevelRange[i - 1]) + step)));
                }
            }
            console.log(difficultyLevelRange);
            where.difficultyLevel = difficultyLevelRange;
            order.push(['difficultyLevel', 'ASC']);
        }

        let orderDefaultArray = Object.entries(orderDefault);
        order.push(...orderDefaultArray);

        let searchCriterias = {
            offset: req.query.offset || 0,
            limit: req.query.limit || 15
        };

        let results = await Climbs.findAll({
            attributes: [
                'id', 'title',
                [sequelize.fn('COUNT', sequelize.col('UserRate.climb_id')), 'votes'],
                [sequelize.fn('AVG', sequelize.col('UserRate.rate')), 'rate'],
                [sequelize.col('Place.title'), 'placeTitle']
            ],
            include: [
                {
                    model: UserRates,
                    attributes: ['climbId', 'rate'],
                    required: true
                },
                {
                    model: Place,
                    attributes: ['title'],
                    required: true
                }
            ],
            where: where,
            group: ['UserRate.climb_id'],
            order: order,
            offset: searchCriterias.offset,
            limit: searchCriterias.limit,
            raw: true
        });

        let climbs = [];

        results.forEach(result => {
            let climbRate = Number(result.rate);
            if (req.query.rate === undefined || climbRate >= Number(req.query.rate[0]) && climbRate <= Number(req.query.rate[1])) {
                climbs.push({
                    title: result.title,
                    rate: round(climbRate),
                    votes: result.votes,
                    placeTitle: result.placeTitle
                });
            }
        });

        res.status(200).json({
            code: successes.routes.all.climbs,
            status: status.success,
            result: paginateResponse(climbs, searchCriterias.offset)
        });
    } catch (err) {
        console.log(err);
        next(manageError(err, {
            code: errors.routes.all.climbs,
            cause: 'climb_all'
        }));
    }
};

exports.getOne = async (req, res, next) => {
};

exports.getForCreate = async (req, res, next) => {
    try {
        let placeTitles = await Places.findAll({
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
        let place = await Places.findOne({
            attributes: ['id'],
            where: {
                title: req.body.placeTitle
            }
        });

        if (place === null) {
            throwError(errors.climb.place_title.not_found, 'place_title', 404, false);
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

        if (req.body.difficultyLevel === '5.1') {
            throwError(errors.climb.difficulty_level.range, 'difficulty_level', 422, false);
        }

        let climb = await Climbs.create({
            title: req.body.title,
            description: req.body.description,
            style: req.body.style,
            difficultyLevel: Number(req.body.difficultyLevel),
            images: req.body.images,
            placeId: place.id,
            userId: req.user.id
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
        next(manageError(err, {
            code: errors.routes.create.climb,
            cause: 'create_climb'
        }));
    }
};

exports.getForUpdate = async (req, res, next) => {
    try {
        let result = await Climbs.findOne({
            attributes: ['userId'],
            where: {
                title: req.params.title
            }
        });

        if (result === null) {
            throwError(errors.climb.not_found, 'update_climb', 404, false);
        } else if (result.userId !== req.user.id) {
            throwError(errors.auth.unauthorized, 'update_climb', 403, false);
        }

        let climb = await Climbs.findOne({
            attributes: [
                'title', 'description', 'style', 'difficultyLevel', 'images',
                [sequelize.col('Place.title'), 'placeTitle']
            ],
            include: {
                model: Place,
                attributes: ['title'],
                required: true
            },
            where: {
                title: req.params.title
            }
        });

        let placeTitles = await Places.findAll({ attributes: ['title'] });

        res.status(200).json({
            code: successes.routes.update.climb,
            status: status.success,
            result: {
                title: climb.title,
                description: climb.description,
                style: climb.style,
                styles: climbStyle,
                difficultyLevel: climb.difficultyLevel,
                images: climb.images,
                placeTitle: climb.placeTitle,
                placeTitles: placeTitles
            }
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
        let place = await Places.findOne({
            attributes: ['id'],
            where: {
                title: req.body.placeTitle
            }
        });

        if (place === null) {
            throwError(errors.climb.place_title.not_found, 'place_title', 404, false);
        }

        let result = await Climbs.findOne({
            attributes: ['id', 'userId', 'images'],
            where: {
                title: req.params.title
            }
        });

        if (result === null) {
            throwError(errors.climb.not_found, 'update_climb', 404, false);
        } else if (result.userId !== req.user.id) {
            throwError(errors.auth.unauthorized, 'update_climb', 403, false);
        }

        // If the title of the climb has changed but the result is equals to the changed title,
        // this means the title is already associated to an other place
        let resultForUniqueConstraint = await Climbs.findOne({
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
            throwError(errors.climb.difficulty_level.range, 'difficulty_level', 422, false);
        }

        let climb = await result.set({
            title: req.body.title,
            description: req.body.description,
            style: req.body.style,
            difficultyLevel: Number(req.body.difficultyLevel),
            images: images,
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
        console.log(err);
        next(manageError(err, {
            code: errors.routes.update.climb,
            cause: 'update_climb'
        }));
    }
};