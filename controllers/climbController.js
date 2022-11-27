'use strict';

const { Climbs, Places } = require('../database');
const { throwError, manageError } = require('../utils/utils');
const { status } = require('../utils/enums');
const errors = require('../json/errors.json');
const successes = require('../json/successes.json');
const Climb = require('../classes/climb');
const PlaceClimbs = require('../classes/placeClimbs');

exports.getAll = async (req, res, next) => {
};

exports.getOne = async (req, res, next) => {
};


exports.getForCreate = async (req, res, next) => {

};

exports.create = async (req, res, next) => {
    try {
        // req.body.placeId;
        // let result = await Climbs.findOne({
        //     attributes: ['id', 'title'],
        //     include: {
        //         model: PlaceClimbs,
        //         attributes: [],
        //         where: {
        //             placeId: req.body.placeId
        //         }
        //     }
        // });

        // if (result !== null) {
        //     throwError(errors.user.email.already_taken, 'email', 422, false);
        // }
        // console.log(result);
        //
        // let climb = await Climbs.create(
        //     {
        //         title: req.body.title,
        //         description: req.body.description,
        //         style: req.body.style,
        //         difficultyLevel: req.body.difficultyLevel
        //     }
        // );
        //
        // await climb.save();

        res.status(201).json({
            code: successes.climb.create,
            status: status.success,
            result: {
                title: req.body.title
            }
        });
    } catch (err) {
        console.log(err);
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
            style: req.body.style,
            difficultyLevel: req.body.difficultyLevel
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