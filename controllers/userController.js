'use strict';

const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { throwError, manageError } = require('../utils/utils');
const { status, userAccessLevel } = require('../utils/enums');
const { Users } = require('../database');
const errors = require('../json/errors.json');
const successes = require('../json/successes.json');

dotenv.config();

exports.register = async (req, res, next) => {
    try {
        let user = await Users.create(
            {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                accessLevel: userAccessLevel.user
            }
        );

        res.status(201).json({
            code: successes.routes.register,
            status: status.success,
            result: {
                username: user.username,
                accessLevel: user.accessLevel
            },
            token: jwt.sign(
                {
                    email: user.email,
                    id: user.id,
                    accessLevel: user.accessLevel
                },
                process.env.SECRET_JTW_KEY,
                { expiresIn: '1h' }
            )
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.register,
            cause: 'register'
        }));
    }
};

exports.login = async (req, res, next) => {
    try {
        let user = await Users.findOne({
            attributes: ['id', 'username', 'email', 'password', 'accessLevel'],
            where: {
                email: req.body.email
            }
        });

        if (user === null) {
            throwError(errors.user.email.not_found, 'email', 422, false);
        }

        if (!bcrypt.compareSync(`${ req.body.password }`, user.password)) {
            throwError(errors.user.invalid, 'login', 422, false);
        }

        res.status(200).json({
            code: successes.routes.login,
            status: status.success,
            result: {
                username: user.username,
                accessLevel: user.accessLevel
            },
            token: jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    accessLevel: user.accessLevel
                },
                process.env.SECRET_JTW_KEY,
                { expiresIn: '1h' }
            )
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.login,
            cause: 'login'
        }));
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        let user = await Users.findOne({
            attributes: ['username'],
            where: {
                id: req.user.id
            }
        });

        res.status(200).json({
            code: successes.routes.details.account,
            status: status.success,
            result: {
                username: user.username
            }
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.details.account.profile,
            cause: 'profile'
        }));
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        let user = await Users.findOne({
            attributes: ['id'],
            where: {
                id: req.user.id
            }
        });

        await user.update({ username: req.body.username });

        res.status(200).json({
            code: successes.routes.update.account_profile,
            status: status.success,
            result: {
                username: user.username
            }
        });
    } catch (err) {
        next(manageError(err, {
            code: errors.routes.update.account_profile,
            cause: 'profile'
        }));
    }
};