'use strict';

const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { throwError, manageError, status, userAccessLevel } = require('../utils/utils');
const { Users } = require('../database');
const errors = require('../json/errors.json');
const successes = require('../json/successes.json');
dotenv.config();

exports.register = async (req, res, next) => {
    try {
        let result = await Users.findOne({
            attributes: ['username', 'password'],
            where: {
                email: req.body.email
            }
        });

        if (result !== null) {
            throwError(errors.field.email.already_taken, 'email', 422, false);
        }

        let user = await Users.create(
            {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                accessLevel: userAccessLevel.user
            }
        );

        user.save();

        res.status(201).json({
            code: successes.register,
            status: status.success,
            result: {
                username: user.username,
                access_level: user.accessLevel
            },
            token: jwt.sign(
                {
                    email: user.email,
                    id: user.id,
                    access_level: user.accessLevel
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
            attributes: ['id', 'username', 'email', 'password'],
            where: {
                email: req.body.email
            }
        });

        if (user === null) {
            throwError(errors.field.email.not_found, 'email', 422, false);
        }

        if (!bcrypt.compareSync(`${ req.body.password }`, user.password)) {
            throwError(errors.field.password.invalid, 'password', 422, false);
        }

        res.status(200).json({
            code: successes.login,
            status: status.success,
            result: {
                username: user.username,
                access_level: user.accessLevel
            },
            token: jwt.sign(
                {
                    email: user.email,
                    id: user.id,
                    access_level: user.accessLevel
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
