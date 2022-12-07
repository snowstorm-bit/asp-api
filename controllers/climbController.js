'use strict';
const { QueryTypes } = require('sequelize');
const { Climbs, Places, sequelize } = require('../database');
const { throwError, manageError, round, paginateResponse } = require('../utils/utils');
const { status, climbStyle } = require('../utils/enums');
const errors = require('../json/errors.json');
const successes = require('../json/successes.json');
const Place = require('../classes/place');
const UserRates = require('../classes/userRates');

exports.getAll = async (req, res, next) => {
    try {
        let whereQueryString = '';

        if (req.query.rate !== undefined) {
            whereQueryString += `WHERE row.totalRate BETWEEN ${ req.query.rate[0] } AND ${ req.query.rate[1] }`;
        }

        let whereSubQuery = [];
        if (req.query.place !== undefined) {
            whereSubQuery.push(`p.title = '${ req.query.place }'`);
        }
        if (req.query.style !== undefined) {
            if (typeof req.query.style === 'string') {
                whereSubQuery.push(`c.style = '${ req.query.style }'`);
            } else {
                let styleWhereStatement = '';
                styleWhereStatement += `c.style IN ('${ req.query.style[0] }'`;
                for (let i = 1; i < req.query.style.length; i++) {
                    styleWhereStatement += `, '${ req.query.style[i] }'`;
                }
                styleWhereStatement += ')';
                whereSubQuery.push(styleWhereStatement);
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

            let difficultyLevelWhereStatement = '';
            difficultyLevelWhereStatement += `c.difficulty_level IN ('${ difficultyLevelRange[0] }'`;
            for (let i = 1; i < difficultyLevelRange.length; i++) {
                difficultyLevelWhereStatement += `, '${ difficultyLevelRange[i] }'`;
            }
            difficultyLevelWhereStatement += ')';
            whereSubQuery.push(difficultyLevelWhereStatement);
        }

        let whereSubQueryString = '';
        if (whereSubQuery.length > 0) {
            whereSubQueryString += `WHERE ${ whereSubQuery[0] }`;
            for (let i = 1; i < whereSubQuery.length; i++) {
                whereSubQueryString += ` AND ${ whereSubQuery[i] }`;
            }
            whereSubQueryString += ' ';
        }

        let rowCols = 'row.title, row.description, row.style, row.images, row.placeTitle, row.totalRate as rate, row.votes';
        let descriptionLiteralStatement = 'IF(CHAR_LENGTH(c.description) > 60, CONCAT(SUBSTRING(c.description, 1, 100), \'...\'), SUBSTRING(c.description, 1, 100)) AS description';
        let subQueryCols = `c.title, ${ descriptionLiteralStatement }, c.style, c.images, p.title AS placeTitle, AVG(ur.rate) AS totalRate, COUNT(ur.climb_id) AS votes`;

        let searchCriterias = {
            offset: Number(req.query.offset) || 0,
            limit: req.query.limit
                ? req.query.limit.includes('top-10')
                    ? 10
                    : Number(req.query.limit)
                : 15
        };

        let queryString = `SELECT ${ rowCols }
                           FROM (SELECT ${ subQueryCols }
                                 FROM user_rates ur
                                          INNER JOIN climbs c ON ur.climb_id = c.id
                                          INNER JOIN places p ON c.place_id = p.id
                                     ${ whereSubQueryString }
                                 GROUP BY c.id) AS row
                               ${ whereQueryString }
                           ORDER BY row.totalRate DESC, row.votes DESC, row.title ASC
                               LIMIT ${ searchCriterias.limit }
                           OFFSET ${ searchCriterias.offset }`;

        let climbs = await sequelize.query(queryString,
            {
                logging: console.log,
                raw: false,
                type: QueryTypes.SELECT
            });

        climbs.forEach(climb => {
            climb.images = climb.images.split(';')[0];
            climb.rate = round(Number(climb.rate));
        });

        let result = paginateResponse(climbs, searchCriterias.offset, searchCriterias.limit);

        if (req.query.limit && !req.query.limit.includes('top-10')) {
            result.placeTitles = await Places.findAll({
                attributes: ['title']
            });
            result.styles = climbStyle;
        }

        console.log('result', result);
        res.status(200).json({
            code: successes.routes.all.climbs,
            status: status.success,
            result: result
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
    try {
        let result = await Climbs.findOne({
            attributes: [
                'id', 'title', 'description', 'style', 'difficultyLevel', 'images',
                [sequelize.fn('AVG', sequelize.col('UserRate.rate')), 'rate'],
                [sequelize.fn('COUNT', sequelize.col('UserRate.climb_id')), 'votes']
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
            where: {
                title: req.params.title
            },
            group: ['UserRate.climb_id'],
            raw: true
        });

        if (result === null) {
            throwError(errors.climb.not_found, 'climb_details', 404, false);
        }

        res.status(200).json({
            code: successes.routes.details.place,
            status: status.success,
            result: {
                title: result.title,
                description: result.description,
                style: result.style,
                image: result.images.split(';')[0],
                difficultyLevel: result.difficultyLevel,
                placeTitle: result.Place.title,
                rate: round(Number(result.rate)),
                votes: result.votes,
                isCreator: req.user.status || req.user.id === result.userId
            }
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.details.place,
            cause: 'climb_details'
        }));
    }
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

        res.status(201).json({
            code: successes.routes.create.climb,
            status: status.success,
            result: {
                title: climb.title
            }
        });
    } catch (err) {
        console.log('error', err);
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
                'title', 'description', 'style', 'difficultyLevel', 'images'
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
                placeTitle: climb.Place.title,
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
        next(manageError(err, {
            code: errors.routes.update.climb,
            cause: 'update_climb'
        }));
    }
};

exports.delete = async (req, res, next) => {
    try {
        let climb = await Climbs.findOne({
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
        console.log(err);
        next(manageError(err, {
            code: errors.routes.delete.climb,
            cause: 'delete_climb'
        }));
    }
};